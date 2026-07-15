/*==================================================
LUNOVIA ORDERS SYSTEM
Version 1.0
==================================================*/

"use strict";

/*==================================================
LOCAL STORAGE KEYS
==================================================*/

const ORDERS_STORAGE="lunovia_orders";
const USER_STORAGE="lunovia_session";
const CART_STORAGE="lunovia_cart";

/*==================================================
GLOBAL VARIABLES
==================================================*/

let currentUser=null;

let orders=[];

/*==================================================
INITIALIZE
==================================================*/

document.addEventListener(

"DOMContentLoaded",

initializeOrders

);

function initializeOrders(){

loadOrders();

renderOrders();

bindOrderEvents();

}

/*==================================================
LOAD DATA
==================================================*/

function loadOrders(){

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
SAVE ORDERS
==================================================*/

function saveOrders(){

localStorage.setItem(

ORDERS_STORAGE,

JSON.stringify(orders)

);

}

/*==================================================
GET USER ORDERS
==================================================*/

function getUserOrders(){

if(!currentUser){

return[];

}

return orders.filter(

order=>order.customerId===currentUser.id

);

}
/*==================================================
ORDERS LIST
Version 1.1
==================================================*/

/*=========================================
RENDER ORDERS
=========================================*/

function renderOrders(){

const container=

document.querySelector("#ordersContainer");

if(!container)return;

const myOrders=

getUserOrders()

.sort(

(a,b)=>

new Date(b.createdAt)-

new Date(a.createdAt)

);

if(myOrders.length===0){

container.innerHTML=`

<div class="empty-state">

<i class="fa-solid fa-box-open"></i>

<h2>No Orders Found</h2>

<p>

You haven't placed any orders yet.

</p>

<a

href="products.html"

class="btn-primary">

Start Shopping

</a>

</div>

`;

return;

}

container.innerHTML="";

myOrders.forEach(order=>{

container.innerHTML+=createOrderCard(order);

});

}

/*=========================================
CREATE ORDER CARD
=========================================*/

function createOrderCard(order){

return`

<div class="order-card">

<div class="order-header">

<div>

<h3>${order.id}</h3>

<p>

${formatOrderDate(order.createdAt)}

</p>

</div>

<span

class="order-status status-${order.status.toLowerCase()}">

${order.status}

</span>

</div>

<div class="order-body">

<div>

<strong>Items</strong>

<p>

${order.products.length}

Products

</p>

</div>

<div>

<strong>Payment</strong>

<p>

${order.paymentMethod}

</p>

</div>

<div>

<strong>Shipping</strong>

<p>

${order.shippingMethod}

</p>

</div>

<div>

<strong>Total</strong>

<p>

$${Number(order.total).toFixed(2)}

</p>

</div>

</div>

<div class="order-footer">

<button

class="btn-order-details"

data-id="${order.id}">

<i class="fa-solid fa-eye"></i>

View Details

</button>

<button

class="btn-download-invoice"

data-id="${order.id}">

<i class="fa-solid fa-file-pdf"></i>

Invoice

</button>

<button

class="btn-repeat-order"

data-id="${order.id}">

<i class="fa-solid fa-rotate-right"></i>

Order Again

</button>

</div>

</div>

`;

}

/*=========================================
FORMAT DATE
=========================================*/

function formatOrderDate(date){

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
ORDER ACTIONS
Version 1.2
==================================================*/

/*=========================================
GET ORDER BY ID
=========================================*/

function getOrderById(orderId){

return orders.find(

order=>order.id===orderId

);

}

/*=========================================
VIEW ORDER DETAILS
=========================================*/

function viewOrderDetails(orderId){

const order=getOrderById(orderId);

if(!order){

showToast(

"Order not found.",

"error"

);

return;

}

window.location.href=

"order-details.html?id="+

encodeURIComponent(order.id);

}

/*=========================================
DOWNLOAD INVOICE
=========================================*/

function downloadInvoice(orderId){

const order=getOrderById(orderId);

if(!order){

showToast(

"Invoice not found.",

"error"

);

return;

}

localStorage.setItem(

"lunovia_invoice",

JSON.stringify(order)

);

window.location.href=

"invoice.html?id="+

encodeURIComponent(order.id);

}

/*=========================================
ORDER AGAIN
=========================================*/

function repeatOrder(orderId){

const order=getOrderById(orderId);

if(!order){

showToast(

"Order not found.",

"error"

);

return;

}

let cart=

JSON.parse(

localStorage.getItem(

CART_STORAGE

)

)||[];

order.products.forEach(product=>{

const existing=

cart.find(

item=>item.id===product.id

);

if(existing){

existing.quantity+=product.quantity;

}else{

cart.push({

...product

});

}

});

localStorage.setItem(

CART_STORAGE,

JSON.stringify(cart)

);

showToast(

"Products added to cart.",

"success"

);

setTimeout(function(){

window.location.href="cart.html";

},800);

}

/*=========================================
SEARCH ORDERS
=========================================*/

function searchOrders(keyword){

const cards=

document.querySelectorAll(

".order-card"

);

const value=

keyword.toLowerCase();

cards.forEach(card=>{

const text=

card.textContent.toLowerCase();

card.style.display=

text.includes(value)

?

"block"

:

"none";

});

}

/*=========================================
ORDER EVENTS
=========================================*/

document.addEventListener(

"click",

function(event){

const details=

event.target.closest(

".btn-order-details"

);

if(details){

viewOrderDetails(

details.dataset.id

);

return;

}

const invoice=

event.target.closest(

".btn-download-invoice"

);

if(invoice){

downloadInvoice(

invoice.dataset.id

);

return;

}

const repeat=

event.target.closest(

".btn-repeat-order"

);

if(repeat){

repeatOrder(

repeat.dataset.id

);

}

});

/*=========================================
SEARCH INPUT
=========================================*/

const orderSearch=

document.querySelector(

"#orderSearch"

);

if(orderSearch){

orderSearch.addEventListener(

"input",

function(){

searchOrders(

this.value

);

}

);
}
