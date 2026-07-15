/*==================================================
LUNOVIA SHOPPING CART
Version 1.0
==================================================*/

"use strict";

/*==================================================
LOCAL STORAGE KEYS
==================================================*/

const CART_STORAGE="lunovia_cart";

const USER_STORAGE="lunovia_session";

const ACTIVITY_STORAGE="lunovia_activity";

/*==================================================
GLOBAL VARIABLES
==================================================*/

let cart=[];

let currentUser=null;

let shippingCost=0;

let couponDiscount=0;

let taxRate=0.15;

/*==================================================
INITIALIZE
==================================================*/

document.addEventListener(

"DOMContentLoaded",

initializeCart

);

function initializeCart(){

loadCart();

loadCurrentUser();

renderCart();

updateCartSummary();

bindCartEvents();

}

/*==================================================
LOAD CART
==================================================*/

function loadCart(){

cart=

JSON.parse(

localStorage.getItem(

CART_STORAGE

)

)||[];

}

/*==================================================
LOAD USER
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
SAVE CART
==================================================*/

function saveCart(){

localStorage.setItem(

CART_STORAGE,

JSON.stringify(cart)

);

}

/*==================================================
SAVE ACTIVITY
==================================================*/

function saveActivity(type,details){

if(!currentUser)return;

const activities=

JSON.parse(

localStorage.getItem(

ACTIVITY_STORAGE

)

)||[];

activities.push({

id:Date.now(),

userId:currentUser.id,

type:type,

details:details,

date:new Date().toISOString()

});

localStorage.setItem(

ACTIVITY_STORAGE,

JSON.stringify(activities)

);

}

/*==================================================
GET PRODUCT
==================================================*/

function getCartItem(id){

return cart.find(

item=>item.id==id

);

}
/*==================================================
CART OPERATIONS
Version 1.1
==================================================*/

/*=========================================
ADD TO CART
=========================================*/

function addToCart(product){

if(!product)return;

const existing=

cart.find(

item=>item.id===product.id

);

if(existing){

existing.quantity++;

}else{

cart.push({

id:product.id,

name:product.name,

price:product.price,

image:product.image ||

(product.images

?product.images[0]

:""),

quantity:1,

stock:product.stock||999

});

}

saveCart();

renderCart();

updateCartSummary();

updateCartCounter();

saveActivity(

"Added To Cart",

product.name

);

showToast(

"Product added to cart",

"success"

);

}

/*=========================================
REMOVE ITEM
=========================================*/

function removeFromCart(id){

const item=getCartItem(id);

if(!item)return;

cart=cart.filter(

product=>product.id!==id

);

saveActivity(

"Removed From Cart",

item.name

);

saveCart();

renderCart();

updateCartSummary();

updateCartCounter();

showToast(

"Product removed",

"warning"

);

}

/*=========================================
CHANGE QUANTITY
=========================================*/

function changeQuantity(id,change){

const item=getCartItem(id);

if(!item)return;

item.quantity+=change;

if(item.quantity<=0){

removeFromCart(id);

return;

}

if(item.quantity>item.stock){

item.quantity=item.stock;

showToast(

"Maximum stock reached",

"warning"

);

}

saveCart();

renderCart();

updateCartSummary();

updateCartCounter();

}

/*=========================================
CLEAR CART
=========================================*/

function clearCart(){

if(cart.length===0)return;

if(!confirm(

"Clear all products from cart?"

)){

return;

}

cart=[];

saveCart();

renderCart();

updateCartSummary();

updateCartCounter();

saveActivity(

"Cart Cleared",

"All products removed"

);

showToast(

"Cart cleared",

"info"

);

}

/*=========================================
CART COUNT
=========================================*/

function getCartCount(){

return cart.reduce(

(total,item)=>{

return total+item.quantity;

},

0

);

}

/*=========================================
UPDATE COUNTER
=========================================*/

function updateCartCounter(){

document

.querySelectorAll(

".cart-count"

)

.forEach(counter=>{

counter.textContent=

getCartCount();

});

}
/*==================================================
RENDER SHOPPING CART
Version 1.2
==================================================*/

/*=========================================
RENDER CART
=========================================*/

function renderCart(){

const container=

document.querySelector("#cartItems");

if(!container)return;

if(cart.length===0){

container.innerHTML=`

<div class="cart-empty">

<i class="fa-solid fa-bag-shopping"></i>

<h2>Your shopping cart is empty</h2>

<p>

Browse our luxury collections and add your favorite jewelry.

</p>

<a

href="products.html"

class="btn-primary">

Continue Shopping

</a>

</div>

`;

return;

}

container.innerHTML="";

cart.forEach(item=>{

container.innerHTML+=createCartItem(item);

});

}

/*=========================================
CREATE CART ITEM
=========================================*/

function createCartItem(item){

return`

<div class="cart-item"

data-id="${item.id}">

<div class="cart-image">

<img

src="${item.image}"

alt="${item.name}">

</div>

<div class="cart-info">

<h3>

${item.name}

</h3>

<div class="cart-price">

$${item.price.toFixed(2)}

</div>

</div>

<div class="cart-quantity">

<button

class="qty-minus"

data-id="${item.id}">

<i class="fa-solid fa-minus"></i>

</button>

<input

type="number"

value="${item.quantity}"

readonly>

<button

class="qty-plus"

data-id="${item.id}">

<i class="fa-solid fa-plus"></i>

</button>

</div>

<div class="cart-total">

$${(

item.price*

item.quantity

).toFixed(2)}

</div>

<div class="cart-actions">

<button

class="remove-cart-item"

data-id="${item.id}"

title="Remove">

<i class="fa-solid fa-trash"></i>

</button>

</div>

</div>

`;

}

/*=========================================
CART EVENTS
=========================================*/

document.addEventListener(

"click",

function(event){

const plus=

event.target.closest(

".qty-plus"

);

if(plus){

changeQuantity(

Number(

plus.dataset.id

),

1

);

}

const minus=

event.target.closest(

".qty-minus"

);

if(minus){

changeQuantity(

Number(

minus.dataset.id

),

-1

);

}

const remove=

event.target.closest(

".remove-cart-item"

);

if(remove){

removeFromCart(

Number(

remove.dataset.id

)

);

}

});

/*=========================================
REFRESH CART
=========================================*/

function refreshCart(){

renderCart();

updateCartSummary();

updateCartCounter();

}
/*==================================================
CART SUMMARY & COUPONS
Version 1.3
==================================================*/

/*=========================================
CALCULATE SUBTOTAL
=========================================*/

function calculateSubtotal(){

return cart.reduce(

(total,item)=>{

return total+(item.price*item.quantity);

},

0

);

}

/*=========================================
CALCULATE SHIPPING
=========================================*/

function calculateShipping(){

const subtotal=calculateSubtotal();

if(subtotal===0){

return 0;

}

if(subtotal>=200){

return 0;

}

return 15;

}

/*=========================================
CALCULATE TAX
=========================================*/

function calculateTax(){

return calculateSubtotal()*taxRate;

}

/*=========================================
CALCULATE DISCOUNT
=========================================*/

function calculateDiscount(){

return couponDiscount;

}

/*=========================================
CALCULATE TOTAL
=========================================*/

function calculateGrandTotal(){

return(

calculateSubtotal()

+

calculateShipping()

+

calculateTax()

-

calculateDiscount()

);

}

/*=========================================
UPDATE SUMMARY
=========================================*/

function updateCartSummary(){

const subtotal=document.querySelector("#cartSubtotal");

const shipping=document.querySelector("#cartShipping");

const tax=document.querySelector("#cartTax");

const discount=document.querySelector("#cartDiscount");

const total=document.querySelector("#cartGrandTotal");

if(subtotal){

subtotal.textContent=

"$"+calculateSubtotal().toFixed(2);

}

if(shipping){

const value=calculateShipping();

shipping.textContent=

value===0

?

"FREE"

:

"$"+value.toFixed(2);

}

if(tax){

tax.textContent=

"$"+calculateTax().toFixed(2);

}

if(discount){

discount.textContent=

"- $"+calculateDiscount().toFixed(2);

}

if(total){

total.textContent=

"$"+calculateGrandTotal().toFixed(2);

}

}

/*=========================================
COUPON SYSTEM
=========================================*/

function applyCoupon(code){

code=code.trim().toUpperCase();

switch(code){

case "WELCOME10":

couponDiscount=

calculateSubtotal()*0.10;

break;

case "LUXURY20":

couponDiscount=

calculateSubtotal()*0.20;

break;

case "VIP50":

couponDiscount=50;

break;

default:

couponDiscount=0;

showToast(

"Invalid coupon code",

"error"

);

updateCartSummary();

return;

}

showToast(

"Coupon applied successfully",

"success"

);

updateCartSummary();

}

/*=========================================
COUPON BUTTON
=========================================*/

const couponButton=

document.querySelector(

"#applyCoupon"

);

if(couponButton){

couponButton.addEventListener(

"click",

function(){

const input=

document.querySelector(

"#couponCode"

);

if(!input)return;

applyCoupon(

input.value

);

});

}

/*=========================================
CHECKOUT BUTTON
=========================================*/

const checkoutButton=

document.querySelector(

"#checkoutButton"

);

if(checkoutButton){

checkoutButton.addEventListener(

"click",

function(){

if(cart.length===0){

showToast(

"Your cart is empty",

"warning"

);

return;

}

window.location.href=

"checkout.html";

});

  }
