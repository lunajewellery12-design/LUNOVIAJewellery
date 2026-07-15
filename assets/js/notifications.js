/*==================================================
LUNOVIA NOTIFICATION CENTER
Version 1.0
==================================================*/

"use strict";

/*==================================================
LOCAL STORAGE
==================================================*/

const NOTIFICATIONS_STORAGE=

"lunovia_notifications";

/*==================================================
GLOBAL VARIABLES
==================================================*/

let notifications=[];

/*==================================================
INITIALIZE
==================================================*/

document.addEventListener(

"DOMContentLoaded",

initializeNotifications

);

function initializeNotifications(){

loadNotifications();

renderNotifications();

updateNotificationCounter();

bindNotificationEvents();

}

/*==================================================
LOAD
==================================================*/

function loadNotifications(){

notifications=

JSON.parse(

localStorage.getItem(

NOTIFICATIONS_STORAGE

)

)||[];

}

/*==================================================
SAVE
==================================================*/

function saveNotifications(){

localStorage.setItem(

NOTIFICATIONS_STORAGE,

JSON.stringify(

notifications

)

);

}

/*==================================================
CREATE NOTIFICATION
==================================================*/

function createNotification(

title,

message,

type="info"

){

const notification={

id:Date.now(),

title:title,

message:message,

type:type,

read:false,

createdAt:

new Date()

.toISOString()

};

notifications.unshift(

notification

);

saveNotifications();

renderNotifications();

updateNotificationCounter();

}
/*==================================================
RENDER NOTIFICATIONS
Version 1.1
==================================================*/

/*=========================================
RENDER LIST
=========================================*/

function renderNotifications(){

const container=

document.querySelector(

"#notificationsContainer"

);

if(!container)return;

container.innerHTML="";

if(notifications.length===0){

container.innerHTML=`

<div class="empty-state">

<i class="fa-regular fa-bell-slash"></i>

<h2>No Notifications</h2>

<p>

You're all caught up.

</p>

</div>

`;

return;

}

notifications.forEach(notification=>{

container.innerHTML+=`

<div

class="notification-card ${notification.read?"read":"unread"}"

data-id="${notification.id}">

<div class="notification-icon">

<i class="${getNotificationIcon(notification.type)}"></i>

</div>

<div class="notification-content">

<h4>

${notification.title}

</h4>

<p>

${notification.message}

</p>

<small>

${formatNotificationDate(notification.createdAt)}

</small>

</div>

<div class="notification-actions">

<button

class="notification-read"

data-id="${notification.id}"

title="Mark as read">

<i class="fa-solid fa-check"></i>

</button>

<button

class="notification-delete"

data-id="${notification.id}"

title="Delete">

<i class="fa-solid fa-trash"></i>

</button>

</div>

</div>

`;

});

}

/*=========================================
UPDATE COUNTER
=========================================*/

function updateNotificationCounter(){

const unread=

notifications.filter(

item=>!item.read

).length;

document

.querySelectorAll(

".notification-count"

)

.forEach(counter=>{

counter.textContent=

unread;

});

}

/*=========================================
ICON
=========================================*/

function getNotificationIcon(type){

switch(type){

case "success":

return

"fa-solid fa-circle-check";

case "warning":

return

"fa-solid fa-triangle-exclamation";

case "error":

return

"fa-solid fa-circle-xmark";

default:

return

"fa-solid fa-bell";

}

}

/*=========================================
DATE FORMAT
=========================================*/

function formatNotificationDate(date){

return new Date(date)

.toLocaleString();

                      }
/*==================================================
NOTIFICATION ACTIONS
Version 1.2
==================================================*/

/*=========================================
MARK AS READ
=========================================*/

function markNotificationAsRead(id){

const notification=

notifications.find(

item=>item.id===id

);

if(!notification){

return;

}

notification.read=true;

saveNotifications();

renderNotifications();

updateNotificationCounter();

}

/*=========================================
MARK ALL AS READ
=========================================*/

function markAllNotificationsAsRead(){

notifications.forEach(

notification=>{

notification.read=true;

}

);

saveNotifications();

renderNotifications();

updateNotificationCounter();

showToast(

"All notifications marked as read.",

"success"

);

}

/*=========================================
DELETE NOTIFICATION
=========================================*/

function deleteNotification(id){

notifications=

notifications.filter(

item=>item.id!==id

);

saveNotifications();

renderNotifications();

updateNotificationCounter();

showToast(

"Notification deleted.",

"success"

);

}

/*=========================================
CLEAR ALL
=========================================*/

function clearAllNotifications(){

if(notifications.length===0){

return;

}

if(

!confirm(

"Delete all notifications?"

)

){

return;

}

notifications=[];

saveNotifications();

renderNotifications();

updateNotificationCounter();

showToast(

"All notifications deleted.",

"success"

);

}

/*=========================================
EVENTS
=========================================*/

function bindNotificationEvents(){

document.addEventListener(

"click",

function(event){

const readButton=

event.target.closest(

".notification-read"

);

if(readButton){

markNotificationAsRead(

Number(

readButton.dataset.id

)

);

return;

}

const deleteButton=

event.target.closest(

".notification-delete"

);

if(deleteButton){

deleteNotification(

Number(

deleteButton.dataset.id

)

);

return;

}

const readAllButton=

event.target.closest(

"#readAllNotifications"

);

if(readAllButton){

markAllNotificationsAsRead();

return;

}

const clearButton=

event.target.closest(

"#clearNotifications"

);

if(clearButton){

clearAllNotifications();

}

});

  }
