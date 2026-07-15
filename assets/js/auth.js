/*==================================================
LUNOVIA AUTH SYSTEM
Version 1.0
==================================================*/

"use strict";

/*==================================================
GLOBAL VARIABLES
==================================================*/

const USERS_STORAGE = "lunovia_users";
const SESSION_STORAGE = "lunovia_session";

let users =
JSON.parse(
localStorage.getItem(USERS_STORAGE)
) || [];

let currentUser =
JSON.parse(
localStorage.getItem(SESSION_STORAGE)
) || null;

/*==================================================
DOM ELEMENTS
==================================================*/

const loginForm =
document.querySelector("#loginForm");

const registerForm =
document.querySelector("#registerForm");

const logoutButton =
document.querySelector("#logoutButton");

/*==================================================
SAVE USERS
==================================================*/

function saveUsers(){

localStorage.setItem(

USERS_STORAGE,

JSON.stringify(users)

);

}

/*==================================================
SAVE SESSION
==================================================*/

function saveSession(){

localStorage.setItem(

SESSION_STORAGE,

JSON.stringify(currentUser)

);

}

/*==================================================
CLEAR SESSION
==================================================*/

function clearSession(){

currentUser=null;

localStorage.removeItem(

SESSION_STORAGE

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

if(!currentUser) return false;

return currentUser.role==="admin";

}

/*==================================================
INITIALIZE
==================================================*/

document.addEventListener(

"DOMContentLoaded",

initializeAuth

);

function initializeAuth(){

updateUserInterface();

bindLogout();

}
/*==================================================
REGISTER SYSTEM
Version 1.1
==================================================*/

/*=========================================
VALIDATE EMAIL
=========================================*/

function isValidEmail(email){

const pattern=

/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

return pattern.test(email);

}

/*=========================================
VALIDATE PASSWORD
=========================================*/

function isValidPassword(password){

return password.length>=8;

}

/*=========================================
CHECK EMAIL EXISTS
=========================================*/

function emailExists(email){

return users.some(

user=>

user.email.toLowerCase()===

email.toLowerCase()

);

}

/*=========================================
CREATE ADMIN
=========================================*/

function createDefaultAdmin(){

const adminExists=

users.some(

user=>user.role==="admin"

);

if(adminExists)return;

users.push({

id:Date.now(),

name:"Administrator",

email:"admin@lunovia.com",

password:"Admin@123",

phone:"",

provider:"email",

role:"admin",

createdAt:new Date().toISOString(),

lastLogin:null,

status:"active"

});

saveUsers();

}

/*=========================================
REGISTER USER
=========================================*/

function registerUser(

name,

email,

password,

phone=""

){

if(!name){

showToast(

"Please enter your name",

"warning"

);

return false;

}

if(!isValidEmail(email)){

showToast(

"Invalid email address",

"warning"

);

return false;

}

if(!isValidPassword(password)){

showToast(

"Password must contain at least 8 characters",

"warning"

);

return false;

}

if(emailExists(email)){

showToast(

"Email already registered",

"error"

);

return false;

}

const user={

id:Date.now(),

name:name,

email:email,

password:password,

phone:phone,

provider:"email",

role:"customer",

createdAt:new Date().toISOString(),

lastLogin:null,

status:"active",

wishlist:[],

cart:[],

orders:[]

};

users.push(user);

saveUsers();

showToast(

"Account created successfully",

"success"

);

return true;

}

/*=========================================
REGISTER FORM
=========================================*/

function bindRegisterForm(){

if(!registerForm)return;

registerForm.addEventListener(

"submit",

function(event){

event.preventDefault();

const name=

document.querySelector("#registerName").value.trim();

const email=

document.querySelector("#registerEmail").value.trim();

const password=

document.querySelector("#registerPassword").value;

const phone=

document.querySelector("#registerPhone")?

document.querySelector("#registerPhone").value.trim()

:"";

const success=

registerUser(

name,

email,

password,

phone

);

if(success){

registerForm.reset();

setTimeout(function(){

window.location.href="login.html";

},1000);

}

});

}

/*=========================================
START REGISTER
=========================================*/

document.addEventListener(

"DOMContentLoaded",

function(){

createDefaultAdmin();

bindRegisterForm();

});
/*==================================================
LOGIN SYSTEM
Version 1.2
==================================================*/

/*=========================================
LOGIN USER
=========================================*/

function loginUser(email,password){

const user=

users.find(

item=>

item.email.toLowerCase()===email.toLowerCase()

&&

item.password===password

);

if(!user){

showToast(

"Incorrect email or password",

"error"

);

return false;

}

user.lastLogin=

new Date().toISOString();

currentUser=user;

saveUsers();

saveSession();

showToast(

"Welcome back "+user.name,

"success"

);

setTimeout(function(){

if(user.role==="admin"){

window.location.href="admin/dashboard.html";

}else{

window.location.href="profile.html";

}

},1200);

return true;

}

/*=========================================
LOGIN FORM
=========================================*/

function bindLoginForm(){

if(!loginForm)return;

loginForm.addEventListener(

"submit",

function(event){

event.preventDefault();

const email=

document.querySelector("#loginEmail").value.trim();

const password=

document.querySelector("#loginPassword").value;

loginUser(

email,

password

);

});

}

/*=========================================
LOGOUT
=========================================*/

function logout(){

clearSession();

showToast(

"You have logged out",

"info"

);

setTimeout(function(){

window.location.href="login.html";

},1000);

}

/*=========================================
LOGOUT BUTTON
=========================================*/

function bindLogout(){

if(!logoutButton)return;

logoutButton.addEventListener(

"click",

function(event){

event.preventDefault();

logout();

});

}

/*=========================================
UPDATE USER INTERFACE
=========================================*/

function updateUserInterface(){

const guest=

document.querySelectorAll(".guest-only");

const member=

document.querySelectorAll(".member-only");

const admin=

document.querySelectorAll(".admin-only");

if(currentUser){

guest.forEach(item=>{

item.style.display="none";

});

member.forEach(item=>{

item.style.display="";

});

if(isAdmin()){

admin.forEach(item=>{

item.style.display="";

});

}

const username=

document.querySelector("#currentUserName");

if(username){

username.textContent=currentUser.name;

}

}else{

guest.forEach(item=>{

item.style.display="";

});

member.forEach(item=>{

item.style.display="none";

});

admin.forEach(item=>{

item.style.display="none";

});

}

}

/*=========================================
PROTECT ADMIN PAGE
=========================================*/

function protectAdminPage(){

if(

window.location.pathname.includes("/admin/")

){

if(!currentUser){

window.location.href="../login.html";

return;

}

if(currentUser.role!=="admin"){

window.location.href="../index.html";

return;

}

}

}

/*=========================================
START AUTH
=========================================*/

document.addEventListener(

"DOMContentLoaded",

function(){

createDefaultAdmin();

bindRegisterForm();

bindLoginForm();

bindLogout();

protectAdminPage();

updateUserInterface();

});
/*==================================================
SOCIAL AUTHENTICATION
Version 1.3
==================================================*/

/*=========================================
GOOGLE LOGIN
=========================================*/

async function loginWithGoogle(){

showToast(

"Connecting to Google...",

"info"

);

try{

/*

Firebase Google Provider

will be connected here.

*/

setTimeout(function(){

showToast(

"Google Authentication Ready",

"success"

);

},1000);

}catch(error){

console.error(error);

showToast(

"Google Login Failed",

"error"

);

}

}

/*=========================================
APPLE LOGIN
=========================================*/

async function loginWithApple(){

showToast(

"Connecting to Apple...",

"info"

);

try{

/*

Firebase Apple Provider

will be connected here.

*/

setTimeout(function(){

showToast(

"Apple Authentication Ready",

"success"

);

},1000);

}catch(error){

console.error(error);

showToast(

"Apple Login Failed",

"error"

);

}

}

/*=========================================
PHONE LOGIN
=========================================*/

async function loginWithPhone(phone){

if(!phone){

showToast(

"Please enter your phone number",

"warning"

);

return;

}

showToast(

"Sending verification code...",

"info"

);

try{

/*

Firebase Phone Auth

will be connected here.

*/

setTimeout(function(){

showToast(

"Verification service ready",

"success"

);

},1200);

}catch(error){

console.error(error);

showToast(

"Phone Authentication Failed",

"error"

);

}

}

/*=========================================
SOCIAL BUTTONS
=========================================*/

function bindSocialButtons(){

const googleButton=

document.querySelector(

"#googleLogin"

);

const appleButton=

document.querySelector(

"#appleLogin"

);

const phoneButton=

document.querySelector(

"#phoneLogin"

);

if(googleButton){

googleButton.addEventListener(

"click",

function(e){

e.preventDefault();

loginWithGoogle();

});

}

if(appleButton){

appleButton.addEventListener(

"click",

function(e){

e.preventDefault();

loginWithApple();

});

}

if(phoneButton){

phoneButton.addEventListener(

"click",

function(e){

e.preventDefault();

const phoneInput=

document.querySelector(

"#phoneNumber"

);

if(phoneInput){

loginWithPhone(

phoneInput.value.trim()

);

}

});

}

}

/*=========================================
REMEMBER ME
=========================================*/

function rememberUser(){

const remember=

document.querySelector(

"#rememberMe"

);

if(!remember)return;

if(currentUser){

remember.checked=true;

}

}

/*=========================================
AUTO LOGIN
=========================================*/

function autoLogin(){

if(!currentUser)return;

updateUserInterface();

}

/*=========================================
AUTH INITIALIZER
=========================================*/

document.addEventListener(

"DOMContentLoaded",

function(){

bindSocialButtons();

rememberUser();

autoLogin();

});
