/*==================================================
LUNOVIA SECURITY
Version 1.0
==================================================*/

"use strict";

/*==================================================
LOCAL STORAGE KEYS
==================================================*/

const USER_STORAGE="lunovia_session";

/*==================================================
SESSION SETTINGS
==================================================*/

const SESSION_TIMEOUT=

1000*60*60*2;

/*==================================================
GLOBAL VARIABLES
==================================================*/

let currentUser=null;

let lastActivity=Date.now();

/*==================================================
INITIALIZE
==================================================*/

document.addEventListener(

"DOMContentLoaded",

initializeSecurity

);

function initializeSecurity(){

loadCurrentUser();

protectPage();

startSessionMonitor();

bindActivityEvents();

}

/*==================================================
LOAD SESSION
==================================================*/

function loadCurrentUser(){

currentUser=

JSON.parse(

localStorage.getItem(

USER_STORAGE

)

);

}

/*==================================================
CHECK LOGIN
==================================================*/

function isLoggedIn(){

return currentUser!==null;

}

/*==================================================
CHECK ADMIN
==================================================*/

function isAdmin(){

if(!currentUser){

return false;

}

return currentUser.role==="admin";

}
/*==================================================
VALIDATION & SESSION
Version 1.1
==================================================*/

/*=========================================
PASSWORD VALIDATION
=========================================*/

function validatePassword(password){

if(

typeof password!=="string"

){

return false;

}

if(

password.length<

SECURITY_CONFIG

.minPasswordLength

){

return false;

}

return

SECURITY_CONFIG

.passwordPattern

.test(password);

}

/*=========================================
EMAIL VALIDATION
=========================================*/

function validateEmail(email){

return

SECURITY_CONFIG

.emailPattern

.test(

String(email)

.trim()

);

}

/*=========================================
PHONE VALIDATION
=========================================*/

function validatePhone(phone){

return

SECURITY_CONFIG

.phonePattern

.test(

String(phone)

.trim()

);

}

/*=========================================
LOGIN ATTEMPTS
=========================================*/

function isLoginLocked(){

return

Date.now()<

loginAttempts.lockedUntil;

}

function registerFailedLogin(){

loginAttempts.count++;

if(

loginAttempts.count>=

SECURITY_CONFIG

.maxLoginAttempts

){

loginAttempts.lockedUntil=

Date.now()+

SECURITY_CONFIG

.lockDuration;

}

saveLoginAttempts();

}

function resetLoginAttempts(){

loginAttempts={

count:0,

lockedUntil:0

};

saveLoginAttempts();

}

/*=========================================
LOCK CLEANUP
=========================================*/

function cleanupExpiredLock(){

if(

loginAttempts.lockedUntil>0 &&

Date.now()>

loginAttempts.lockedUntil

){

resetLoginAttempts();

}

}

/*=========================================
SESSION CHECK
=========================================*/

function checkSession(){

const session=

JSON.parse(

localStorage.getItem(

SESSION_STORAGE

)

);

if(!session)return;

if(

!session.lastActivity

){

session.lastActivity=

Date.now();

localStorage.setItem(

SESSION_STORAGE,

JSON.stringify(session)

);

return;

}

const expired=

Date.now()

-

session.lastActivity>

SECURITY_CONFIG

.sessionTimeout;

if(expired){

localStorage.removeItem(

SESSION_STORAGE

);

window.location.href=

"login.html";

}

}

/*=========================================
SESSION UPDATE
=========================================*/

function updateSessionActivity(){

const session=

JSON.parse(

localStorage.getItem(

SESSION_STORAGE

)

);

if(!session)return;

session.lastActivity=

Date.now();

localStorage.setItem(

SESSION_STORAGE,

JSON.stringify(session)

);

}

document.addEventListener(

"click",

updateSessionActivity

);

document.addEventListener(

"keydown",

updateSessionActivity

);
/*==================================================
INPUT SANITIZATION
Version 1.2
==================================================*/

/*=========================================
ESCAPE HTML
=========================================*/

function escapeHTML(value){

if(

value===null||

value===undefined

){

return "";

}

const div=

document.createElement(

"div"

);

div.textContent=

String(value);

return div.innerHTML;

}

/*=========================================
SANITIZE TEXT
=========================================*/

function sanitizeText(text){

return escapeHTML(

String(text)

.trim()

);

}

/*=========================================
REMOVE SCRIPT TAGS
=========================================*/

function stripScripts(text){

return String(text)

.replace(

/<script[\s\S]*?>[\s\S]*?<\/script>/gi,

""

)

.replace(

/javascript:/gi,

""

)

.replace(

/on\w+="[^"]*"/gi,

""

)

.replace(

/on\w+='[^']*'/gi,

""

);

}

/*=========================================
SANITIZE OBJECT
=========================================*/

function sanitizeObject(object){

const result={};

Object.keys(object)

.forEach(key=>{

const value=

object[key];

if(

typeof value===

"string"

){

result[key]=

stripScripts(

sanitizeText(value)

);

}else{

result[key]=value;

}

});

return result;

}

/*=========================================
SAFE JSON PARSE
=========================================*/

function safeJSONParse(

value,

fallback=null

){

try{

return JSON.parse(value);

}catch{

return fallback;

}

}

/*=========================================
SAFE JSON STRINGIFY
=========================================*/

function safeJSONStringify(value){

try{

return JSON.stringify(value);

}catch{

return "";

}

}
/*==================================================
PASSWORD SECURITY
Version 1.3
==================================================*/

/*=========================================
PASSWORD STRENGTH
=========================================*/

function checkPasswordStrength(password){

let score=0;

if(password.length>=8){

score++;

}

if(/[A-Z]/.test(password)){

score++;

}

if(/[a-z]/.test(password)){

score++;

}

if(/[0-9]/.test(password)){

score++;

}

if(/[^A-Za-z0-9]/.test(password)){

score++;

}

return{

score:score,

weak:score<=2,

medium:score===3,

strong:score>=4

};

}

/*=========================================
VALIDATE EMAIL
=========================================*/

function validateEmail(email){

return /^[^\s@]+@[^\s@]+\.[^\s@]+$/

.test(

String(email)

.toLowerCase()

);

}

/*=========================================
VALIDATE PHONE
=========================================*/

function validatePhone(phone){

return /^[0-9+\-\s()]{7,20}$/

.test(

String(phone)

);

}

/*=========================================
VALIDATE URL
=========================================*/

function validateURL(url){

try{

new URL(url);

return true;

}catch{

return false;

}

}

/*=========================================
VALIDATE REQUIRED
=========================================*/

function validateRequired(value){

return String(value)

.trim()

.length>0;

}

/*=========================================
LIMIT INPUT LENGTH
=========================================*/

function limitInputLength(

value,

maxLength

){

return String(value)

.substring(

0,

maxLength

);

}
/*==================================================
INPUT SANITIZATION
Version 1.4
==================================================*/

/*=========================================
SANITIZE TEXT
=========================================*/

function sanitizeText(text){

if(text===null||

text===undefined){

return "";

}

return String(text)

.replace(/</g,"&lt;")

.replace(/>/g,"&gt;")

.replace(/"/g,"&quot;")

.replace(/'/g,"&#39;")

.trim();

}

/*=========================================
REMOVE HTML
=========================================*/

function stripHTML(text){

const div=

document.createElement(

"div"

);

div.innerHTML=text;

return div.textContent||

div.innerText||

"";

}

/*=========================================
SAFE HTML
=========================================*/

function setSafeHTML(

element,

text

){

if(!element)return;

element.textContent=

sanitizeText(text);

}

/*=========================================
SAFE VALUE
=========================================*/

function safeValue(value){

return sanitizeText(

String(value)

);

}

/*==================================================
FORM SECURITY
Version 1.5
==================================================*/

/*=========================================
VALIDATE FORM
=========================================*/

function validateForm(form){

let valid=true;

const required=

form.querySelectorAll(

"[required]"

);

required.forEach(field=>{

if(

!validateRequired(

field.value

)

){

field.classList.add(

"is-invalid"

);

valid=false;

}else{

field.classList.remove(

"is-invalid"

);

}

});

return valid;

}

/*=========================================
CLEAR VALIDATION
=========================================*/

function clearValidation(form){

form

.querySelectorAll(

".is-invalid"

)

.forEach(field=>{

field.classList.remove(

"is-invalid"

);

});

}

/*=========================================
PREVENT DOUBLE SUBMIT
=========================================*/

function disableSubmitButton(

button

){

if(!button)return;

button.disabled=true;

button.dataset.loading="true";

}

function enableSubmitButton(

button

){

if(!button)return;

button.disabled=false;

button.dataset.loading="false";

}
/*==================================================
PASSWORD SECURITY
Version 1.6
==================================================*/

/*=========================================
PASSWORD STRENGTH
=========================================*/

function getPasswordStrength(

password

){

let score=0;

if(password.length>=8){

score++;

}

if(/[A-Z]/.test(password)){

score++;

}

if(/[a-z]/.test(password)){

score++;

}

if(/[0-9]/.test(password)){

score++;

}

if(/[^A-Za-z0-9]/.test(password)){

score++;

}

return score;

}

/*=========================================
PASSWORD LABEL
=========================================*/

function getPasswordStrengthLabel(

score

){

switch(score){

case 0:

case 1:

return"Very Weak";

case 2:

return"Weak";

case 3:

return"Medium";

case 4:

return"Strong";

case 5:

return"Very Strong";

default:

return"Unknown";

}

}

/*=========================================
PASSWORD COLOR
=========================================*/

function getPasswordStrengthColor(

score

){

switch(score){

case 0:

case 1:

return"#dc3545";

case 2:

return"#fd7e14";

case 3:

return"#ffc107";

case 4:

return"#20c997";

case 5:

return"#198754";

default:

return"#6c757d";

}

}

/*=========================================
UPDATE PASSWORD METER
=========================================*/

function updatePasswordMeter(

input,

meter,

label

){

if(

!input||

!meter||

!label

){

return;

}

const score=

getPasswordStrength(

input.value

);

meter.value=score;

label.textContent=

getPasswordStrengthLabel(

score

);

label.style.color=

getPasswordStrengthColor(

score

);

}
/*==================================================
LOGIN PROTECTION
Version 1.7
==================================================*/

/*=========================================
SECURITY STORAGE
=========================================*/

const LOGIN_SECURITY_STORAGE=

"lunovia_login_security";

const MAX_LOGIN_ATTEMPTS=5;

const LOCK_TIME=

15*60*1000;

/*=========================================
LOAD SECURITY
=========================================*/

function loadLoginSecurity(){

return JSON.parse(

localStorage.getItem(

LOGIN_SECURITY_STORAGE

)

)||{

attempts:0,

lockedUntil:0,

history:[]

};

}

/*=========================================
SAVE SECURITY
=========================================*/

function saveLoginSecurity(data){

localStorage.setItem(

LOGIN_SECURITY_STORAGE,

JSON.stringify(data)

);

}

/*=========================================
CHECK LOCK
=========================================*/

function isLoginLocked(){

const security=

loadLoginSecurity();

return Date.now()<

security.lockedUntil;

}

/*=========================================
REGISTER FAILURE
=========================================*/

function registerFailedLogin(){

const security=

loadLoginSecurity();

security.attempts++;

security.history.unshift({

type:"failed",

time:new Date()

.toISOString()

});

if(

security.attempts>=

MAX_LOGIN_ATTEMPTS

){

security.lockedUntil=

Date.now()+

LOCK_TIME;

}

saveLoginSecurity(

security

);

}

/*=========================================
REGISTER SUCCESS
=========================================*/

function registerSuccessfulLogin(){

const security=

loadLoginSecurity();

security.attempts=0;

security.lockedUntil=0;

security.history.unshift({

type:"success",

time:new Date()

.toISOString()

});

if(

security.history.length>

50

){

security.history=

security.history.slice(

0,

50

);

}

saveLoginSecurity(

security

);

}

/*=========================================
LOCK TIME LEFT
=========================================*/

function getRemainingLockTime(){

const security=

loadLoginSecurity();

const remaining=

security.lockedUntil-

Date.now();

return remaining>0

?

Math.ceil(

remaining/

1000

)

:0;

}
/*==================================================
SESSION SECURITY
Version 1.8
==================================================*/

/*=========================================
SESSION STORAGE
=========================================*/

const SESSION_STORAGE=

"lunovia_session";

const SESSION_TIMEOUT=

30*60*1000;

/*=========================================
CREATE SESSION
=========================================*/

function createSession(){

const session={

createdAt:Date.now(),

lastActivity:Date.now(),

authenticated:true

};

localStorage.setItem(

SESSION_STORAGE,

JSON.stringify(session)

);

}

/*=========================================
LOAD SESSION
=========================================*/

function loadSession(){

return JSON.parse(

localStorage.getItem(

SESSION_STORAGE

)

)||null;

}

/*=========================================
UPDATE ACTIVITY
=========================================*/

function updateSessionActivity(){

const session=

loadSession();

if(!session){

return;

}

session.lastActivity=

Date.now();

localStorage.setItem(

SESSION_STORAGE,

JSON.stringify(session)

);

}

/*=========================================
CHECK SESSION
=========================================*/

function isSessionExpired(){

const session=

loadSession();

if(!session){

return true;

}

return(

Date.now()

-

session.lastActivity

>

SESSION_TIMEOUT

);

}

/*=========================================
DESTROY SESSION
=========================================*/

function destroySession(){

localStorage.removeItem(

SESSION_STORAGE

);

}

/*=========================================
AUTO LOGOUT
=========================================*/

function checkSession(){

if(

isSessionExpired()

){

destroySession();

showToast(

"Your session has expired.",

"warning"

);

if(

window.location.pathname

.includes("profile")||

window.location.pathname

.includes("checkout")||

window.location.pathname

.includes("orders")

){

window.location.href=

"login.html";

}

}

}

/*=========================================
ACTIVITY EVENTS
=========================================*/

[

"click",

"keydown",

"mousemove",

"scroll",

"touchstart"

].forEach(eventName=>{

document.addEventListener(

eventName,

updateSessionActivity,

{

passive:true

}

);

});

/*=========================================
SESSION TIMER
=========================================*/

setInterval(

checkSession,

60000

);
/*==================================================
DATA INTEGRITY
Version 1.9
==================================================*/

/*=========================================
CHECKSUM
=========================================*/

function generateChecksum(data){

const text=

JSON.stringify(data);

let hash=0;

for(

let i=0;

i<text.length;

i++

){

hash=

((hash<<5)-hash)

+

text.charCodeAt(i);

hash|=0;

}

return String(hash);

}

/*=========================================
SECURE SAVE
=========================================*/

function secureSave(

key,

data

){

const payload={

data:data,

checksum:

generateChecksum(data),

updatedAt:

Date.now()

};

localStorage.setItem(

key,

JSON.stringify(payload)

);

}

/*=========================================
SECURE LOAD
=========================================*/

function secureLoad(key){

const raw=

localStorage.getItem(key);

if(!raw){

return null;

}

try{

const payload=

JSON.parse(raw);

if(

!payload||

typeof payload!=="object"

){

return null;

}

const checksum=

generateChecksum(

payload.data

);

if(

checksum!==

payload.checksum

){

console.warn(

"Security warning: data integrity check failed:",

key

);

return null;

}

return payload.data;

}catch(error){

console.error(

error

);

return null;

}

}

/*=========================================
SECURE REMOVE
=========================================*/

function secureRemove(key){

localStorage.removeItem(

key

);

}

/*=========================================
VERIFY STORAGE
=========================================*/

function verifyApplicationStorage(){

const keys=[

"lunovia_cart",

"lunovia_wishlist",

"lunovia_compare",

"lunovia_orders",

"lunovia_profile"

];

keys.forEach(key=>{

const value=

secureLoad(key);

if(

value===null &&

localStorage.getItem(key)

){

console.warn(

"Invalid or modified storage:",

key

);

}

});

}
/*==================================================
SECURITY INITIALIZATION
Version 2.0
==================================================*/

/*=========================================
SECURITY AUDIT
=========================================*/

function runSecurityAudit(){

verifyApplicationStorage();

if(isLoginLocked()){

console.warn(

"Login is temporarily locked."

);

}

if(isSessionExpired()){

console.warn(

"Session expired."

);

}

}

/*=========================================
DISABLE DRAG
=========================================*/

function preventSensitiveDrag(){

document.addEventListener(

"dragstart",

function(event){

const target=

event.target;

if(

target instanceof HTMLInputElement||

target instanceof HTMLTextAreaElement

){

return;

}

event.preventDefault();

}

);

}

/*=========================================
DISABLE AUTOCOMPLETE
=========================================*/

function secureForms(){

document

.querySelectorAll(

"form"

)

.forEach(form=>{

form.setAttribute(

"autocomplete",

"off"

);

});

}

/*=========================================
PAGE VISIBILITY
=========================================*/

document.addEventListener(

"visibilitychange",

function(){

if(

document.visibilityState===

"visible"

){

checkSession();

}

});

/*=========================================
GLOBAL ERROR HANDLER
=========================================*/

window.addEventListener(

"error",

function(event){

console.error(

"Application Error:",

event.message

);

});

/*=========================================
SECURITY START
=========================================*/

function initializeSecurity(){

runSecurityAudit();

preventSensitiveDrag();

secureForms();

checkSession();

console.log(

"LUNOVIA Security Module Loaded"

);

}

/*=========================================
AUTO START
=========================================*/

document.addEventListener(

"DOMContentLoaded",

initializeSecurity

);
