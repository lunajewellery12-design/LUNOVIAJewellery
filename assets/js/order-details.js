/*==================================================
LUNOVIA ORDER DETAILS
Version 1.0
==================================================*/

"use strict";

/*==================================================
LOCAL STORAGE KEYS
==================================================*/

const ORDERS_STORAGE="lunovia_orders";
const USER_STORAGE="lunovia_session";

/*==================================================
GLOBAL VARIABLES
==================================================*/

let currentUser=null;
let currentOrder=null;
let orders=[];

/*==================================================
INITIALIZE
==================================================*/

document.addEventListener(

"DOMContentLoaded",

initializeOrderDetails

);

function initializeOrderDetails(){

loadData();

loadOrder();

renderOrder();

renderTimeline();

}

/*==================================================
LOAD DATA
==================================================*/

function loadData(){

currentUser=

JSON.parse(

localStorage.getItem(

USER_STORAGE

)

);

orders=

JSON.parse(

localStorage.getItem(

ORDERS_STORAGE

)

)||[];

}

/*==================================================
GET ORDER ID
==================================================*/

function getOrderId(){

const params=

new URLSearchParams(

window.location.search

);

return params.get("id");

}

/*==================================================
LOAD ORDER
==================================================*/

function loadOrder(){

const id=getOrderId();

currentOrder=

orders.find(

order=>order.id===id

);

if(!currentOrder){

window.location.href="orders.html";

}

}
/*==================================================
RENDER ORDER DETAILS
Version 1.1
==================================================*/

/*=========================================
RENDER ORDER
=========================================*/

function renderOrder(){

if(!currentOrder)return;

setElementText("orderNumber",currentOrder.id);

setElementText("orderDate",formatDate(currentOrder.createdAt));

setElementText("orderStatus",currentOrder.status);

setElementText("paymentMethod",currentOrder.paymentMethod);

setElementText("shippingMethod",currentOrder.shippingMethod);

setElementText("customerName",currentOrder.customer);

setElementText("customerEmail",currentOrder.email);

setElementText("customerPhone",currentOrder.phone);

setElementText("shippingCountry",currentOrder.shippingAddress.country);

setElementText("shippingCity",currentOrder.shippingAddress.city);

setElementText("shippingAddress",currentOrder.shippingAddress.address);

setElementText("shippingPostal",currentOrder.shippingAddress.postalCode);

setElementText("subtotalPrice","$"+Number(currentOrder.subtotal).toFixed(2));

setElementText("shippingPrice","$"+Number(currentOrder.shipping).toFixed(2));

setElementText("taxPrice","$"+Number(currentOrder.tax).toFixed(2));

setElementText("discountPrice","- $"+Number(currentOrder.discount).toFixed(2));

setElementText("totalPrice","$"+Number(currentOrder.total).toFixed(2));

renderProducts();

}

/*=========================================
RENDER PRODUCTS
=========================================*/

function renderProducts(){

const container=

document.querySelector("#orderProducts");

if(!container)return;

container.innerHTML="";

currentOrder.products.forEach(product=>{

container.innerHTML+=`

<div class="order-product">

<div class="order-product-image">

<img

src="${product.image}"

alt="${product.name}">

</div>

<div class="order-product-info">

<h3>${product.name}</h3>

<p>

Price:

$${Number(product.price).toFixed(2)}

</p>

<p>

Quantity:

${product.quantity}

</p>

</div>

<div class="order-product-total">

$${(

Number(product.price)

*

Number(product.quantity)

).toFixed(2)}

</div>

</div>

`;

});

}

/*=========================================
HELPERS
=========================================*/

function setElementText(id,value){

const element=

document.getElementById(id);

if(element){

element.textContent=value;

}

}

function formatDate(date){

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
ORDER TRACKING TIMELINE
Version 1.2
==================================================*/

/*=========================================
TRACKING STEPS
=========================================*/

const ORDER_STEPS=[

"Pending",

"Confirmed",

"Processing",

"Shipped",

"Out for Delivery",

"Delivered"

];

/*=========================================
RENDER TIMELINE
=========================================*/

function renderTimeline(){

const container=

document.querySelector("#orderTimeline");

if(!container)return;

container.innerHTML="";

const currentIndex=

ORDER_STEPS.indexOf(

currentOrder.status

);

ORDER_STEPS.forEach(

(step,index)=>{

const completed=

index<=currentIndex;

const active=

index===currentIndex;

container.innerHTML+=`

<div class="timeline-step ${completed?"completed":""} ${active?"active":""}">

<div class="timeline-circle">

${completed

?'<i class="fa-solid fa-check"></i>'

:index+1}

</div>

<div class="timeline-content">

<h4>${step}</h4>

<p>

${getStepDescription(step)}

</p>

</div>

</div>

`;

}

);

if(currentOrder.status==="Cancelled"){

container.innerHTML=`

<div class="timeline-cancelled">

<i class="fa-solid fa-circle-xmark"></i>

<h3>Order Cancelled</h3>

<p>

This order has been cancelled.

</p>

</div>

`;

}

}

/*=========================================
STEP DESCRIPTION
=========================================*/

function getStepDescription(step){

switch(step){

case "Pending":

return "Your order has been received.";

case "Confirmed":

return "Your order has been confirmed.";

case "Processing":

return "Our team is preparing your order.";

case "Shipped":

return "Your package has been shipped.";

case "Out for Delivery":

return "Your order is on its way.";

case "Delivered":

return "Your order has been delivered successfully.";

default:

return "";

}

}

/*=========================================
PRINT ORDER
=========================================*/

function printOrder(){

window.print();

}

/*=========================================
ORDER EVENTS
=========================================*/

document.addEventListener(

"click",

function(event){

const print=

event.target.closest(

"#printOrder"

);

if(print){

printOrder();

}

});

