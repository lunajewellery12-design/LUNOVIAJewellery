/*==================================================
LUNOVIA USER PROFILE
Version 1.0
==================================================*/

"use strict";

/*==================================================
LOCAL STORAGE KEYS
==================================================*/

const USER_STORAGE="lunovia_session";

const USERS_STORAGE="lunovia_users";

const ORDERS_STORAGE="lunovia_orders";

const ACTIVITY_STORAGE="lunovia_activity";

const WISHLIST_STORAGE="lunovia_wishlist";

/*==================================================
GLOBAL VARIABLES
==================================================*/

let currentUser=null;

let users=[];

let orders=[];

let activities=[];

let wishlist=[];

/*==================================================
INITIALIZE
==================================================*/

document.addEventListener(

"DOMContentLoaded",

initializeProfile

);

function initializeProfile(){

loadProfileData();

protectProfile();

renderProfile();

renderStatistics();

bindProfileEvents();

}

/*==================================================
LOAD DATA
==================================================*/

function loadProfileData(){

currentUser=

JSON.parse(

localStorage.getItem(

USER_STORAGE

)

);

users=

JSON.parse(

localStorage.getItem(

USERS_STORAGE

)

)||[];

orders=

JSON.parse(

localStorage.getItem(

ORDERS_STORAGE

)

)||[];

activities=

JSON.parse(

localStorage.getItem(

ACTIVITY_STORAGE

)

)||[];

wishlist=

JSON.parse(

localStorage.getItem(

WISHLIST_STORAGE

)

)||[];

}

/*==================================================
PROFILE PROTECTION
==================================================*/

function protectProfile(){

if(!currentUser){

window.location.href="login.html";

}

}

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
PROFILE INFORMATION
Version 1.1
==================================================*/

/*=========================================
RENDER PROFILE
=========================================*/

function renderProfile(){

if(!currentUser)return;

setText(

"profileName",

currentUser.name

);

setText(

"profileEmail",

currentUser.email

);

setText(

"profilePhone",

currentUser.phone||"-"

);

setText(

"profileRole",

currentUser.role

);

setText(

"profileStatus",

currentUser.status

);

setText(

"profileCreated",

formatDate(

currentUser.createdAt

)

);

setText(

"profileLastLogin",

currentUser.lastLogin

?

formatDate(

currentUser.lastLogin

)

:

"Never"

);

const avatar=

document.querySelector(

"#profileAvatar"

);

if(avatar){

avatar.src=

currentUser.avatar

||

"assets/images/avatar/default-user.png";

}

}

/*=========================================
PROFILE STATISTICS
=========================================*/

function renderStatistics(){

if(!currentUser)return;

const myOrders=

orders.filter(

order=>

order.customerId===currentUser.id

);

const myActivities=

activities.filter(

activity=>

activity.userId===currentUser.id

);

setText(

"ordersCount",

myOrders.length

);

setText(

"wishlistCount",

wishlist.length

);

setText(

"activityCount",

myActivities.length

);

const spent=

myOrders.reduce(

(total,order)=>{

return total+

Number(order.total||0);

},

0

);

setText(

"totalSpent",

"$"+spent.toFixed(2)

);

}

/*=========================================
HELPER
=========================================*/

function setText(id,value){

const element=

document.getElementById(id);

if(element){

element.textContent=value;

}

}

/*=========================================
DATE FORMAT
=========================================*/

function formatDate(date){

if(!date)return "-";

return new Date(date)

.toLocaleDateString(

undefined,

{

year:"numeric",

month:"long",

day:"numeric"

}

);

}
/*==================================================
PROFILE EDITING
Version 1.2
==================================================*/

/*=========================================
FILL PROFILE FORM
=========================================*/

function fillProfileForm(){

if(!currentUser)return;

setValue(

"editName",

currentUser.name

);

setValue(

"editEmail",

currentUser.email

);

setValue(

"editPhone",

currentUser.phone||""

);

setValue(

"editCountry",

currentUser.country||""

);

setValue(

"editCity",

currentUser.city||""

);

setValue(

"editAddress",

currentUser.address||""

);

}

/*=========================================
SET VALUE
=========================================*/

function setValue(id,value){

const element=

document.getElementById(id);

if(element){

element.value=value;

}

}

/*=========================================
UPDATE PROFILE
=========================================*/

function updateProfile(){

if(!currentUser)return;

const name=

document.getElementById(

"editName"

)?.value.trim();

const phone=

document.getElementById(

"editPhone"

)?.value.trim();

const country=

document.getElementById(

"editCountry"

)?.value.trim();

const city=

document.getElementById(

"editCity"

)?.value.trim();

const address=

document.getElementById(

"editAddress"

)?.value.trim();

if(!name){

showToast(

"Name is required.",

"warning"

);

return;

}

currentUser.name=name;

currentUser.phone=phone;

currentUser.country=country;

currentUser.city=city;

currentUser.address=address;

const index=

users.findIndex(

user=>user.id===currentUser.id

);

if(index!==-1){

users[index]=currentUser;

}

saveUsers();

localStorage.setItem(

USER_STORAGE,

JSON.stringify(currentUser)

);

renderProfile();

showToast(

"Profile updated successfully.",

"success"

);

}

/*=========================================
PROFILE FORM
=========================================*/

const profileForm=

document.getElementById(

"profileForm"

);

if(profileForm){

profileForm.addEventListener(

"submit",

function(event){

event.preventDefault();

updateProfile();

}

);

}

/*=========================================
UPLOAD AVATAR
=========================================*/

const avatarInput=

document.getElementById(

"avatarUpload"

);

if(avatarInput){

avatarInput.addEventListener(

"change",

function(){

const file=this.files[0];

if(!file)return;

if(

!file.type.startsWith(

"image/"

)

){

showToast(

"Please select an image.",

"warning"

);

return;

}

const reader=

new FileReader();

reader.onload=function(e){

currentUser.avatar=

e.target.result;

const index=

users.findIndex(

user=>user.id===currentUser.id

);

if(index!==-1){

users[index]=currentUser;

}

saveUsers();

localStorage.setItem(

USER_STORAGE,

JSON.stringify(currentUser)

);

renderProfile();

showToast(

"Profile photo updated.",

"success"

);

};

reader.readAsDataURL(file);

});

}

/*=========================================
INITIALIZE EDIT FORM
=========================================*/

document.addEventListener(

"DOMContentLoaded",

function(){

fillProfileForm();

});
/*==================================================
PROFILE ORDERS & ACTIVITY
Version 1.3
==================================================*/

/*=========================================
RENDER USER ORDERS
=========================================*/

function renderUserOrders(){

const container=

document.querySelector("#profileOrders");

if(!container)return;

const myOrders=

orders.filter(

order=>order.customerId===currentUser.id

);

if(myOrders.length===0){

container.innerHTML=`

<div class="empty-state">

<i class="fa-solid fa-box-open"></i>

<h3>No Orders Yet</h3>

<p>

Your completed orders will appear here.

</p>

</div>

`;

return;

}

container.innerHTML="";

myOrders

.sort((a,b)=>

new Date(b.createdAt)-new Date(a.createdAt)

)

.forEach(order=>{

container.innerHTML+=`

<div class="profile-order-card">

<div class="order-header">

<h4>${order.id}</h4>

<span class="order-status">

${order.status}

</span>

</div>

<div class="order-body">

<p>

Items:

${order.products.length}

</p>

<p>

Total:

$${Number(order.total).toFixed(2)}

</p>

<p>

Date:

${formatDate(order.createdAt)}

</p>

</div>

<div class="order-footer">

<button

class="btn-order-details"

data-id="${order.id}">

View Details

</button>

<button

class="btn-order-repeat"

data-id="${order.id}">

Order Again

</button>

</div>

</div>

`;

});

}

/*=========================================
RENDER USER ACTIVITY
=========================================*/

function renderUserActivity(){

const container=

document.querySelector("#profileActivity");

if(!container)return;

const myActivity=

activities

.filter(

item=>item.userId===currentUser.id

)

.sort(

(a,b)=>

new Date(b.date)-new Date(a.date)

)

.slice(0,20);

if(myActivity.length===0){

container.innerHTML=`

<div class="empty-state">

<i class="fa-solid fa-clock-rotate-left"></i>

<h3>No Activity</h3>

</div>

`;

return;

}

container.innerHTML="";

myActivity.forEach(activity=>{

container.innerHTML+=`

<div class="activity-item">

<div class="activity-icon">

<i class="fa-solid fa-circle-check"></i>

</div>

<div class="activity-content">

<h5>

${activity.type}

</h5>

<p>

${activity.details}

</p>

<span>

${formatDate(activity.date)}

</span>

</div>

</div>

`;

});

}

/*=========================================
RENDER WISHLIST
=========================================*/

function renderProfileWishlist(){

const container=

document.querySelector("#profileWishlist");

if(!container)return;

if(wishlist.length===0){

container.innerHTML=`

<div class="empty-state">

<i class="fa-regular fa-heart"></i>

<h3>

Wishlist is Empty

</h3>

</div>

`;

return;

}

container.innerHTML="";

wishlist.forEach(product=>{

container.innerHTML+=`

<div class="wishlist-card">

<img

src="${product.image}"

alt="${product.name}">

<h4>

${product.name}

</h4>

<p>

$${product.price}

</p>

<a

href="product.html?id=${product.id}"

class="btn-primary">

View Product

</a>

</div>

`;

});

}

/*=========================================
ORDER ACTIONS
=========================================*/

document.addEventListener(

"click",

function(event){

const details=

event.target.closest(

".btn-order-details"

);

if(details){

window.location.href=

"order-details.html?id="+

details.dataset.id;

}

const repeat=

event.target.closest(

".btn-order-repeat"

);

if(repeat){

showToast(

"Order added to cart.",

"success"

);

/*

Later this button

will restore all products

to the shopping cart.

*/

}

});

/*=========================================
INITIALIZE PROFILE PANELS
=========================================*/

document.addEventListener(

"DOMContentLoaded",

function(){

renderUserOrders();

renderUserActivity();

renderProfileWishlist();

});
/*==================================================
ACCOUNT CENTER
Version 1.4
==================================================*/

/*=========================================
CHANGE PASSWORD
=========================================*/

function changePassword(){

if(!currentUser)return;

const currentPassword=

document.querySelector(

"#currentPassword"

)?.value;

const newPassword=

document.querySelector(

"#newPassword"

)?.value;

const confirmPassword=

document.querySelector(

"#confirmPassword"

)?.value;

if(

!currentPassword ||

!newPassword ||

!confirmPassword

){

showToast(

"Please complete all password fields.",

"warning"

);

return;

}

if(currentPassword!==currentUser.password){

showToast(

"Current password is incorrect.",

"error"

);

return;

}

if(newPassword.length<8){

showToast(

"Password must contain at least 8 characters.",

"warning"

);

return;

}

if(newPassword!==confirmPassword){

showToast(

"Passwords do not match.",

"error"

);

return;

}

currentUser.password=newPassword;

const index=

users.findIndex(

user=>user.id===currentUser.id

);

if(index!==-1){

users[index]=currentUser;

}

saveUsers();

localStorage.setItem(

USER_STORAGE,

JSON.stringify(currentUser)

);

document.querySelector("#currentPassword").value="";

document.querySelector("#newPassword").value="";

document.querySelector("#confirmPassword").value="";

showToast(

"Password changed successfully.",

"success"

);

}

/*=========================================
LOGOUT ALL DEVICES
=========================================*/

function logoutAllDevices(){

localStorage.removeItem(

USER_STORAGE

);

showToast(

"Logged out from all devices.",

"success"

);

setTimeout(function(){

window.location.href="login.html";

},1200);

}

/*=========================================
DELETE ACCOUNT
=========================================*/

function deleteAccount(){

if(

!confirm(

"Delete your account permanently?"

)

){

return;

}

users=

users.filter(

user=>user.id!==currentUser.id

);

saveUsers();

localStorage.removeItem(

USER_STORAGE

);

showToast(

"Account deleted successfully.",

"warning"

);

setTimeout(function(){

window.location.href="index.html";

},1200);

}

/*=========================================
ACCOUNT SETTINGS
=========================================*/

function bindAccountCenter(){

const passwordButton=

document.querySelector(

"#changePasswordButton"

);

if(passwordButton){

passwordButton.addEventListener(

"click",

function(event){

event.preventDefault();

changePassword();

}

);

}

const logoutButton=

document.querySelector(

"#logoutAllDevices"

);

if(logoutButton){

logoutButton.addEventListener(

"click",

function(){

logoutAllDevices();

}

);

}

const deleteButton=

document.querySelector(

"#deleteAccount"

);

if(deleteButton){

deleteButton.addEventListener(

"click",

function(){

deleteAccount();

}

);

}

}

/*=========================================
LANGUAGE
=========================================*/

function changeLanguage(language){

localStorage.setItem(

"lunovia_language",

language

);

showToast(

"Language preference saved.",

"success"

);

}

/*=========================================
THEME
=========================================*/

function changeTheme(theme){

localStorage.setItem(

"lunovia_theme",

theme

);

document.documentElement

.setAttribute(

"data-theme",

theme

);

showToast(

"Theme updated.",

"success"

);

}

/*=========================================
INITIALIZE ACCOUNT CENTER
=========================================*/

document.addEventListener(

"DOMContentLoaded",

function(){

bindAccountCenter();

});
