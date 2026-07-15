/*==================================================
LUNOVIA WISHLIST SYSTEM
Version 1.0
==================================================*/

"use strict";

/*==================================================
LOCAL STORAGE KEYS
==================================================*/

const WISHLIST_STORAGE="lunovia_wishlist";

const CART_STORAGE="lunovia_cart";

const PRODUCTS_STORAGE="lunovia_products";

/*==================================================
GLOBAL VARIABLES
==================================================*/

let wishlist=[];

let products=[];

/*==================================================
INITIALIZE
==================================================*/

document.addEventListener(

"DOMContentLoaded",

initializeWishlist

);

function initializeWishlist(){

loadWishlist();

loadProducts();

renderWishlist();

updateWishlistCounter();

bindWishlistEvents();

}

/*==================================================
LOAD DATA
==================================================*/

function loadWishlist(){

wishlist=

JSON.parse(

localStorage.getItem(

WISHLIST_STORAGE

)

)||[];

}

function loadProducts(){

products=

JSON.parse(

localStorage.getItem(

PRODUCTS_STORAGE

)

)||[];

}

/*==================================================
SAVE WISHLIST
==================================================*/

function saveWishlist(){

localStorage.setItem(

WISHLIST_STORAGE,

JSON.stringify(wishlist)

);

}

/*=========================================
UPDATE COUNTER
=========================================*/

function updateWishlistCounter(){

const counter=

document.querySelectorAll(

".wishlist-count"

);

counter.forEach(item=>{

item.textContent=

wishlist.length;

});

}
/*==================================================
WISHLIST OPERATIONS
Version 1.1
==================================================*/

/*=========================================
CHECK PRODUCT
=========================================*/

function isInWishlist(productId){

return wishlist.some(

item=>item.id===productId

);

}

/*=========================================
ADD TO WISHLIST
=========================================*/

function addToWishlist(productId){

const product=

products.find(

item=>item.id===productId

);

if(!product){

showToast(

"Product not found.",

"error"

);

return;

}

if(isInWishlist(productId)){

showToast(

"Product already in wishlist.",

"info"

);

return;

}

wishlist.push({

...product,

addedAt:new Date().toISOString()

});

saveWishlist();

updateWishlistCounter();

updateWishlistButtons();

renderWishlist();

showToast(

"Added to wishlist.",

"success"

);

}

/*=========================================
REMOVE FROM WISHLIST
=========================================*/

function removeFromWishlist(productId){

wishlist=

wishlist.filter(

item=>item.id!==productId

);

saveWishlist();

updateWishlistCounter();

updateWishlistButtons();

renderWishlist();

showToast(

"Removed from wishlist.",

"success"

);

}

/*=========================================
TOGGLE WISHLIST
=========================================*/

function toggleWishlist(productId){

if(isInWishlist(productId)){

removeFromWishlist(productId);

}else{

addToWishlist(productId);

}

}

/*=========================================
UPDATE BUTTONS
=========================================*/

function updateWishlistButtons(){

document

.querySelectorAll(

".wishlist-button"

)

.forEach(button=>{

const id=

Number(

button.dataset.id

);

button.classList.toggle(

"active",

isInWishlist(id)

);

});

}

/*=========================================
BUTTON EVENTS
=========================================*/

document.addEventListener(

"click",

function(event){

const button=

event.target.closest(

".wishlist-button"

);

if(!button)return;

toggleWishlist(

Number(

button.dataset.id

)

);

});
/*==================================================
RENDER WISHLIST
Version 1.2
==================================================*/

/*=========================================
RENDER WISHLIST
=========================================*/

function renderWishlist(){

const container=

document.querySelector(

"#wishlistContainer"

);

if(!container)return;

container.innerHTML="";

updateWishlistSummary();

if(wishlist.length===0){

container.innerHTML=`

<div class="empty-state">

<i class="fa-regular fa-heart"></i>

<h2>Your Wishlist is Empty</h2>

<p>

Save your favorite jewelry here.

</p>

<a

href="products.html"

class="btn-primary">

Browse Products

</a>

</div>

`;

return;

}

wishlist.forEach(product=>{

container.innerHTML+=`

<div class="wishlist-card">

<div class="wishlist-image">

<img

src="${product.image}"

alt="${product.name}">

</div>

<div class="wishlist-content">

<h3>

${product.name}

</h3>

<p>

${product.description||""}

</p>

<div class="wishlist-price">

$${Number(product.price).toFixed(2)}

</div>

</div>

<div class="wishlist-actions">

<button

class="btn-primary wishlist-cart"

data-id="${product.id}">

<i class="fa-solid fa-cart-shopping"></i>

Add to Cart

</button>

<button

class="btn-danger wishlist-remove"

data-id="${product.id}">

<i class="fa-solid fa-trash"></i>

Remove

</button>

</div>

</div>

`;

});

}

/*=========================================
SUMMARY
=========================================*/

function updateWishlistSummary(){

const count=

document.querySelector(

"#wishlistCount"

);

if(count){

count.textContent=

wishlist.length;

}

const total=

document.querySelector(

"#wishlistValue"

);

if(total){

const value=

wishlist.reduce(

(sum,item)=>{

return sum+

Number(item.price);

},

0

);

total.textContent=

"$"+

value.toFixed(2);

}

}

/*=========================================
CLEAR WISHLIST
=========================================*/

function clearWishlist(){

if(wishlist.length===0){

return;

}

if(

!confirm(

"Remove all products from your wishlist?"

)

){

return;

}

wishlist=[];

saveWishlist();

updateWishlistCounter();

renderWishlist();

updateWishlistButtons();

showToast(

"Wishlist cleared.",

"success"

);

}

/*=========================================
MOVE TO CART
=========================================*/

function moveWishlistToCart(productId){

const product=

wishlist.find(

item=>item.id===productId

);

if(!product)return;

let cart=

JSON.parse(

localStorage.getItem(

CART_STORAGE

)

)||[];

const exists=

cart.find(

item=>item.id===product.id

);

if(exists){

exists.quantity+=1;

}else{

cart.push({

...product,

quantity:1

});

}

localStorage.setItem(

CART_STORAGE,

JSON.stringify(cart)

);

showToast(

"Product added to cart.",

"success"

);

}

/*=========================================
WISHLIST EVENTS
=========================================*/

document.addEventListener(

"click",

function(event){

const cart=

event.target.closest(

".wishlist-cart"

);

if(cart){

moveWishlistToCart(

Number(

cart.dataset.id

)

);

}

const remove=

event.target.closest(

".wishlist-remove"

);

if(remove){

removeFromWishlist(

Number(

remove.dataset.id

)

);

}

const clear=

event.target.closest(

"#clearWishlist"

);

if(clear){

clearWishlist();

}

});
/*==================================================
ADVANCED WISHLIST
Version 1.3
==================================================*/

/*=========================================
SEARCH WISHLIST
=========================================*/

function searchWishlist(keyword){

keyword=

keyword

.toLowerCase()

.trim();

const cards=

document.querySelectorAll(

".wishlist-card"

);

cards.forEach(card=>{

const text=

card.textContent

.toLowerCase();

card.style.display=

text.includes(keyword)

?

"grid"

:

"none";

});

}

/*=========================================
SORT WISHLIST
=========================================*/

function sortWishlist(type){

switch(type){

case "name":

wishlist.sort(

(a,b)=>

a.name.localeCompare(b.name)

);

break;

case "price-low":

wishlist.sort(

(a,b)=>

a.price-b.price

);

break;

case "price-high":

wishlist.sort(

(a,b)=>

b.price-a.price

);

break;

case "newest":

wishlist.sort(

(a,b)=>

new Date(b.addedAt)-

new Date(a.addedAt)

);

break;

}

saveWishlist();

renderWishlist();

}

/*=========================================
SHARE WISHLIST
=========================================*/

async function shareWishlist(){

const text=

wishlist

.map(item=>

`${item.name} - $${item.price}`

)

.join("\n");

if(

navigator.share

){

try{

await navigator.share({

title:"My LUNOVIA Wishlist",

text:text

});

showToast(

"Wishlist shared successfully.",

"success"

);

}catch(error){

console.error(error);

}

}else{

navigator.clipboard

.writeText(text);

showToast(

"Wishlist copied to clipboard.",

"success"

);

}

}

/*=========================================
EXPORT WISHLIST
=========================================*/

function exportWishlist(){

const data=

JSON.stringify(

wishlist,

null,

2

);

const blob=

new Blob(

[data],

{

type:"application/json"

}

);

const url=

URL.createObjectURL(blob);

const link=

document.createElement("a");

link.href=url;

link.download=

"lunovia-wishlist.json";

link.click();

URL.revokeObjectURL(url);

}

/*=========================================
EXTRA EVENTS
=========================================*/

const wishlistSearch=

document.querySelector(

"#wishlistSearch"

);

if(wishlistSearch){

wishlistSearch.addEventListener(

"input",

function(){

searchWishlist(

this.value

);

}

);

}

const wishlistSort=

document.querySelector(

"#wishlistSort"

);

if(wishlistSort){

wishlistSort.addEventListener(

"change",

function(){

sortWishlist(

this.value

);

}

);

}

const shareButton=

document.querySelector(

"#shareWishlist"

);

if(shareButton){

shareButton.addEventListener(

"click",

shareWishlist

);

}

const exportButton=

document.querySelector(

"#exportWishlist"

);

if(exportButton){

exportButton.addEventListener(

"click",

exportWishlist

);

}
