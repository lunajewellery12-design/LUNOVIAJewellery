/*==================================================
LUNOVIA LANGUAGE MANAGER
Version 1.0
==================================================*/

"use strict";

/*==================================================
LOCAL STORAGE
==================================================*/

const LANGUAGE_STORAGE=

"lunovia_language";

/*==================================================
SUPPORTED LANGUAGES
==================================================*/

const SUPPORTED_LANGUAGES=[

"en",

"ar"

];

/*==================================================
GLOBAL VARIABLES
==================================================*/

let currentLanguage="en";

let translations={};

/*==================================================
INITIALIZE
==================================================*/

document.addEventListener(

"DOMContentLoaded",

initializeLanguage

);

async function initializeLanguage(){

loadLanguage();

await loadTranslations();

applyLanguage();

bindLanguageEvents();

}

/*==================================================
LOAD LANGUAGE
==================================================*/

function loadLanguage(){

const saved=

localStorage.getItem(

LANGUAGE_STORAGE

);

currentLanguage=

SUPPORTED_LANGUAGES.includes(

saved

)

?

saved

:

getBrowserLanguage();

}

/*==================================================
SAVE LANGUAGE
==================================================*/

function saveLanguage(){

localStorage.setItem(

LANGUAGE_STORAGE,

currentLanguage

);

}
/*==================================================
TRANSLATION LOADER
Version 1.1
==================================================*/

/*=========================================
BROWSER LANGUAGE
=========================================*/

function getBrowserLanguage(){

const language=

navigator.language

.substring(

0,

2

);

return SUPPORTED_LANGUAGES

.includes(language)

?

language

:

"en";

}

/*=========================================
LOAD JSON
=========================================*/

async function loadTranslations(){

try{

const response=

await fetch(

`assets/lang/${currentLanguage}.json`

);

translations=

await response.json();

}catch(error){

console.error(

"Translation load failed.",

error

);

translations={};

}

}

/*=========================================
SET LANGUAGE
=========================================*/

async function setLanguage(

language

){

if(

!SUPPORTED_LANGUAGES

.includes(language)

){

return;

}

currentLanguage=

language;

saveLanguage();

await loadTranslations();

applyLanguage();

}

/*=========================================
GET TEXT
=========================================*/

function translate(

key

){

return translations[key]

??

key;

}
/*==================================================
APPLY TRANSLATIONS
Version 1.2
==================================================*/

/*=========================================
APPLY LANGUAGE
=========================================*/

function applyLanguage(){

document.documentElement.lang=

currentLanguage;

document.documentElement.dir=

currentLanguage==="ar"

?

"rtl"

:

"ltr";

translatePage();

updateLanguageButtons();

}

/*=========================================
TRANSLATE PAGE
=========================================*/

function translatePage(){

document

.querySelectorAll(

"[data-i18n]"

)

.forEach(element=>{

const key=

element.dataset.i18n;

element.textContent=

translate(key);

});

document

.querySelectorAll(

"[data-i18n-placeholder]"

)

.forEach(element=>{

const key=

element.dataset.i18nPlaceholder;

element.placeholder=

translate(key);

});

document

.querySelectorAll(

"[data-i18n-title]"

)

.forEach(element=>{

const key=

element.dataset.i18nTitle;

element.title=

translate(key);

});

}

/*=========================================
UPDATE BUTTONS
=========================================*/

function updateLanguageButtons(){

document

.querySelectorAll(

".language-button"

)

.forEach(button=>{

button.classList.toggle(

"active",

button.dataset.language===

currentLanguage

);

});

}

/*=========================================
RTL CHECK
=========================================*/

function isRTL(){

return currentLanguage==="ar";

}

/*=========================================
CURRENT LANGUAGE
=========================================*/

function getCurrentLanguage(){

return currentLanguage;

}
/*==================================================
LANGUAGE EVENTS
Version 1.3
==================================================*/

/*=========================================
LOAD FALLBACK
=========================================*/

async function loadFallbackLanguage(){

try{

const response=

await fetch(

"assets/lang/en.json"

);

translations=

await response.json();

}catch(error){

console.error(

"Fallback language failed.",

error

);

}

}

/*=========================================
RELOAD TRANSLATIONS
=========================================*/

async function reloadTranslations(){

try{

await loadTranslations();

if(

Object.keys(

translations

).length===0

){

await loadFallbackLanguage();

}

applyLanguage();

}catch(error){

console.error(

error

);

}

}

/*=========================================
BUTTON EVENTS
=========================================*/

function bindLanguageEvents(){

document

.querySelectorAll(

".language-button"

)

.forEach(button=>{

button.addEventListener(

"click",

async function(){

const language=

this.dataset.language;

await setLanguage(

language

);

}

);

});

}

/*=========================================
SYNC BETWEEN TABS
=========================================*/

window.addEventListener(

"storage",

async function(event){

if(

event.key!==

LANGUAGE_STORAGE

){

return;

}

currentLanguage=

event.newValue||

"en";

await reloadTranslations();

});

/*=========================================
PAGE TITLE
=========================================*/

function translatePageTitle(){

const key=

document.body.dataset.title;

if(

key

){

document.title=

translate(key);

}

}

/*=========================================
PATCH APPLY
=========================================*/

const originalApplyLanguage=

applyLanguage;

applyLanguage=function(){

originalApplyLanguage();

translatePageTitle();

};

/*=========================================
AUTO START
=========================================*/

document.addEventListener(

"DOMContentLoaded",

reloadTranslations

);
