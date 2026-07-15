/*==================================================
LUNOVIA CHECKOUT SYSTEM
Version 1.0
==================================================*/

"use strict";

/*==================================================
LOCAL STORAGE KEYS
==================================================*/

const CART_KEY="lunovia_cart";
const ORDERS_KEY="lunovia_orders";
const USER_KEY="lunovia_session";
const COUPON_KEY="lunovia_coupon";

/*==================================================
GLOBAL VARIABLES
==================================================*/

let cart=[];

let currentUser=null;

let orders=[];

let shippingCost=0;

let taxRate=0.15;

let discountValue=0;

let selectedShipping="standard";

let selectedPayment="cash";

/*==================================================
INITIALIZE
==================================================*/

document.addEventListener(

"DOMContentLoaded",

initializeCheckout

);

function initializeCheckout(){

loadCheckoutData();

renderCheckout();

bindCheckoutEvents();

}

/*==================================================
LOAD DATA
==================================================*/

function loadCheckoutData(){

cart=

JSON.parse(

localStorage.getItem(CART_KEY)

)||[];

orders=

JSON.parse(

localStorage.getItem(ORDERS_KEY)

)||[];

currentUser=

JSON.parse(

localStorage.getItem(USER_KEY)

);

}

/*==================================================
SAVE ORDERS
==================================================*/

function saveOrders(){

localStorage.setItem(

ORDERS_KEY,

JSON.stringify(orders)

);

}

/*==================================================
SAVE CART
==================================================*/

function saveCart(){

localStorage.setItem(

CART_KEY,

JSON.stringify(cart)

);

}
/*==================================================
CHECKOUT CALCULATIONS
Version 1.1
==================================================*/

/*=========================================
SUBTOTAL
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
SHIPPING
=========================================*/

function calculateShipping(){

switch(selectedShipping){

case "express":

shippingCost=25;

break;

case "priority":

shippingCost=40;

break;

default:

shippingCost=10;

}

return shippingCost;

}

/*=========================================
TAX
=========================================*/

function calculateTax(){

const subtotal=calculateSubtotal();

return subtotal*taxRate;

}

/*=========================================
DISCOUNT
=========================================*/

function calculateDiscount(){

return discountValue;

}

/*=========================================
TOTAL
=========================================*/

function calculateTotal(){

const subtotal=calculateSubtotal();

const shipping=calculateShipping();

const tax=calculateTax();

const discount=calculateDiscount();

return (

subtotal+

shipping+

tax-

discount

);

}

/*=========================================
UPDATE SUMMARY
=========================================*/

function updateSummary(){

const subtotal=document.querySelector("#subtotal");

const shipping=document.querySelector("#shipping");

const tax=document.querySelector("#tax");

const discount=document.querySelector("#discount");

const total=document.querySelector("#total");

if(subtotal){

subtotal.textContent=

"$"+calculateSubtotal().toFixed(2);

}

if(shipping){

shipping.textContent=

"$"+calculateShipping().toFixed(2);

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

"$"+calculateTotal().toFixed(2);

}

}

/*=========================================
RENDER CART
=========================================*/

function renderCheckout(){

const container=

document.querySelector("#checkoutItems");

if(!container)return;

if(cart.length===0){

container.innerHTML=`

<div class="empty-state">

<h2>Your Cart is Empty</h2>

<p>Add products before checkout.</p>

</div>

`;

updateSummary();

return;

}

container.innerHTML="";

cart.forEach(item=>{

container.innerHTML+=`

<div class="checkout-item">

<img
src="${item.image}"
alt="${item.name}"
class="checkout-image">

<div class="checkout-details">

<h4>${item.name}</h4>

<p>

Quantity: ${item.quantity}

</p>

<p>

$${item.price.toFixed(2)}

</p>

</div>

<div class="checkout-total">

$${(item.price*item.quantity).toFixed(2)}

</div>

</div>

`;

});

updateSummary();

}
/*==================================================
ORDER CREATION & CHECKOUT
Version 1.2
==================================================*/

/*=========================================
GENERATE ORDER NUMBER
=========================================*/

function generateOrderNumber(){

const date=Date.now().toString();

const random=Math.floor(

1000+Math.random()*9000

);

return "LNV-"+date+"-"+random;

}

/*=========================================
GET CUSTOMER DATA
=========================================*/

function getCustomerData(){

return{

name:document.querySelector("#customerName")?.value.trim()||"",

email:document.querySelector("#customerEmail")?.value.trim()||"",

phone:document.querySelector("#customerPhone")?.value.trim()||"",

country:document.querySelector("#customerCountry")?.value.trim()||"",

city:document.querySelector("#customerCity")?.value.trim()||"",

address:document.querySelector("#customerAddress")?.value.trim()||"",

postalCode:document.querySelector("#customerPostalCode")?.value.trim()||"",

notes:document.querySelector("#customerNotes")?.value.trim()||""

};

}

/*=========================================
VALIDATE CHECKOUT
=========================================*/

function validateCheckout(){

const customer=getCustomerData();

if(cart.length===0){

showToast(

"Your cart is empty.",

"warning"

);

return false;

}

if(

customer.name==="" ||

customer.email==="" ||

customer.phone==="" ||

customer.country==="" ||

customer.city==="" ||

customer.address===""

){

showToast(

"Please complete all required fields.",

"warning"

);

return false;

}

return true;

}

/*=========================================
CREATE ORDER
=========================================*/

function createOrder(){

if(!validateCheckout()){

return;

}

const customer=getCustomerData();

const order={

id:generateOrderNumber(),

customerId:currentUser?currentUser.id:null,

customer:customer.name,

email:customer.email,

phone:customer.phone,

shippingAddress:{

country:customer.country,

city:customer.city,

address:customer.address,

postalCode:customer.postalCode

},

notes:customer.notes,

products:[...cart],

subtotal:calculateSubtotal(),

shipping:calculateShipping(),

tax:calculateTax(),

discount:calculateDiscount(),

total:calculateTotal(),

paymentMethod:selectedPayment,

shippingMethod:selectedShipping,

status:"Pending",

createdAt:new Date().toISOString()

};

orders.push(order);

saveOrders();

cart=[];

saveCart();

showToast(

"Order placed successfully.",

"success"

);

setTimeout(function(){

window.location.href=

"order-success.html?order="+order.id;

},1500);

}

/*=========================================
SHIPPING METHODS
=========================================*/

function bindShippingMethods(){

document

.querySelectorAll(

"input[name='shippingMethod']"

)

.forEach(option=>{

option.addEventListener(

"change",

function(){

selectedShipping=this.value;

updateSummary();

}

);

});

}

/*=========================================
PAYMENT METHODS
=========================================*/

function bindPaymentMethods(){

document

.querySelectorAll(

"input[name='paymentMethod']"

)

.forEach(option=>{

option.addEventListener(

"change",

function(){

selectedPayment=this.value;

}

);

});

}

/*=========================================
PLACE ORDER BUTTON
=========================================*/

function bindCheckoutEvents(){

bindShippingMethods();

bindPaymentMethods();

const button=

document.querySelector("#placeOrder");

if(!button)return;

button.addEventListener(

"click",

function(event){

event.preventDefault();

createOrder();

}

);

  }

