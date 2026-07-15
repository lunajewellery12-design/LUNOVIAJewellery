/*==================================================
LUNOVIA THEME MANAGER
Version 1.0
==================================================*/

"use strict";

/*==================================================
LOCAL STORAGE
==================================================*/

const THEME_STORAGE=

"lunovia_theme";

/*==================================================
GLOBAL
==================================================*/

let currentTheme="light";

/*==================================================
INITIALIZE
==================================================*/

document.addEventListener(

"DOMContentLoaded",

initializeTheme

);

function initializeTheme(){

loadTheme();

applyTheme();

bindThemeEvents();

}

/*==================================================
LOAD
==================================================*/

function loadTheme(){

currentTheme=

localStorage.getItem(

THEME_STORAGE

)

||

getSystemTheme();

}

/*==================================================
SAVE
==================================================*/

function saveTheme(){

localStorage.setItem(

THEME_STORAGE,

currentTheme

);

}
/*==================================================
THEME CONTROL
Version 1.1
==================================================*/

/*=========================================
SYSTEM THEME
=========================================*/

function getSystemTheme(){

return window.matchMedia(

"(prefers-color-scheme: dark)"

).matches

?

"dark"

:

"light";

}

/*=========================================
APPLY THEME
=========================================*/

function applyTheme(){

document.documentElement

.setAttribute(

"data-theme",

currentTheme

);

document.body

.classList.remove(

"theme-light",

"theme-dark"

);

document.body

.classList.add(

"theme-"+currentTheme

);

const metaTheme=

document.querySelector(

'meta[name="theme-color"]'

);

if(metaTheme){

metaTheme.setAttribute(

"content",

currentTheme==="dark"

?

"#111111"

:

"#ffffff"

);

}

saveTheme();

updateThemeButtons();

}

/*=========================================
SET THEME
=========================================*/

function setTheme(theme){

if(

theme!=="light"&&

theme!=="dark"

){

return;

}

currentTheme=theme;

applyTheme();

}

/*=========================================
TOGGLE THEME
=========================================*/

function toggleTheme(){

setTheme(

currentTheme==="dark"

?

"light"

:

"dark"

);

}

/*=========================================
UPDATE BUTTONS
=========================================*/

function updateThemeButtons(){

document

.querySelectorAll(

".theme-toggle"

)

.forEach(button=>{

button.setAttribute(

"aria-label",

currentTheme==="dark"

?

"Switch to light mode"

:

"Switch to dark mode"

);

button.classList.toggle(

"is-dark",

currentTheme==="dark"

);

});

  }
/*==================================================
THEME EVENTS
Version 1.2
==================================================*/

/*=========================================
BUTTON EVENTS
=========================================*/

function bindThemeEvents(){

document

.querySelectorAll(

".theme-toggle"

)

.forEach(button=>{

button.addEventListener(

"click",

toggleTheme

);

});

}

/*=========================================
SYSTEM THEME CHANGE
=========================================*/

const systemTheme=

window.matchMedia(

"(prefers-color-scheme: dark)"

);

if(systemTheme){

systemTheme.addEventListener(

"change",

function(event){

if(

localStorage.getItem(

THEME_STORAGE

)

){

return;

}

currentTheme=

event.matches

?

"dark"

:

"light";

applyTheme();

}

);

}

/*=========================================
SYNC BETWEEN TABS
=========================================*/

window.addEventListener(

"storage",

function(event){

if(

event.key!==

THEME_STORAGE

){

return;

}

currentTheme=

event.newValue||

"light";

applyTheme();

});

}

/*=========================================
ENABLE TRANSITIONS
=========================================*/

function enableThemeTransition(){

document.body.classList.add(

"theme-transition"

);

setTimeout(

function(){

document.body.classList.remove(

"theme-transition"

);

},

300

);

}

const originalApplyTheme=

applyTheme;

applyTheme=function(){

enableThemeTransition();

originalApplyTheme();

};

/*=========================================
INITIAL ICON
=========================================*/

document.addEventListener(

"DOMContentLoaded",

function(){

updateThemeButtons();

});
