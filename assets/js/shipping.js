/*==================================================
LUNOVIA SHIPPING MANAGER
Version 1.0
==================================================*/

"use strict";

/*==================================================
LOCAL STORAGE
==================================================*/

const SHIPPING_STORAGE=

"lunovia_shipping";

/*==================================================
GLOBAL VARIABLES
==================================================*/

let shippingMethods=[];

let selectedShipping=null;

/*==================================================
INITIALIZE
==================================================*/

document.addEventListener(

"DOMContentLoaded",

initializeShipping

);

function initializeShipping(){

loadShippingMethods();

loadSelectedShipping();

seedShippingMethods();

}

/*==================================================
LOAD
==================================================*/

function loadShippingMethods(){

shippingMethods=

JSON.parse(

localStorage.getItem(

SHIPPING_STORAGE

)

)||[];

}

/*==================================================
SAVE
==================================================*/

function saveShippingMethods(){

localStorage.setItem(

SHIPPING_STORAGE,

JSON.stringify(

shippingMethods

)

);

}

/*==================================================
SELECTED SHIPPING
==================================================*/

function loadSelectedShipping(){

selectedShipping=

JSON.parse(

localStorage.getItem(

"lunovia_selected_shipping"

)

)||null;

}

function saveSelectedShipping(){

localStorage.setItem(

"lunovia_selected_shipping",

JSON.stringify(

selectedShipping

)

);

}
/*==================================================
SHIPPING METHODS
Version 1.1
==================================================*/

/*=========================================
DEFAULT METHODS
=========================================*/

function seedShippingMethods(){

if(shippingMethods.length>0){

return;

}

shippingMethods=[

{

id:1,

name:"Standard Shipping",

type:"standard",

price:8,

minDays:3,

maxDays:7,

freeOver:150,

international:false,

active:true

},

{

id:2,

name:"Express Shipping",

type:"express",

price:18,

minDays:1,

maxDays:2,

freeOver:null,

international:false,

active:true

},

{

id:3,

name:"Free Shipping",

type:"free",

price:0,

minDays:5,

maxDays:8,

freeOver:75,

international:false,

active:true

},

{

id:4,

name:"International Shipping",

type:"international",

price:35,

minDays:7,

maxDays:15,

freeOver:null,

international:true,

active:true

}

];

saveShippingMethods();

}

/*=========================================
GET METHOD
=========================================*/

function getShippingMethod(

id

){

return shippingMethods.find(

method=>

method.id===

Number(id)

);

}

/*=========================================
GET ACTIVE
=========================================*/

function getActiveShippingMethods(){

return shippingMethods.filter(

method=>

method.active

);

}

/*=========================================
SELECT METHOD
=========================================*/

function selectShippingMethod(

id

){

const method=

getShippingMethod(

id

);

if(!method){

return false;

}

selectedShipping=

method;

saveSelectedShipping();

return true;

}

/*=========================================
REMOVE SELECTION
=========================================*/

function clearShippingSelection(){

selectedShipping=null;

saveSelectedShipping();

}
/*==================================================
SHIPPING CALCULATIONS
Version 1.2
==================================================*/

/*=========================================
CALCULATE SHIPPING
=========================================*/

function calculateShipping(

subtotal,

country="Local",

weight=0

){

if(!selectedShipping){

return{

cost:0,

estimatedDays:null

};

}

let cost=

selectedShipping.price;

/*-----------------------------------------
FREE SHIPPING
-----------------------------------------*/

if(

selectedShipping.freeOver!==null &&

subtotal>=selectedShipping.freeOver

){

cost=0;

}

/*-----------------------------------------
INTERNATIONAL
-----------------------------------------*/

if(

country!=="Local" &&

!selectedShipping.international

){

cost+=20;

}

/*-----------------------------------------
WEIGHT
-----------------------------------------*/

if(weight>5){

cost+=

(weight-5)*2;

}

/*-----------------------------------------
FREE SHIPPING COUPON
-----------------------------------------*/

if(

typeof getAppliedCoupon==="function"

){

const coupon=

getAppliedCoupon();

if(

coupon &&

coupon.type==="shipping"

){

cost=0;

}

}

return{

cost,

estimatedDays:

`${selectedShipping.minDays}-${selectedShipping.maxDays} Days`

};

}

/*=========================================
ESTIMATED DELIVERY
=========================================*/

function getEstimatedDeliveryDate(){

if(!selectedShipping){

return null;

}

const date=

new Date();

date.setDate(

date.getDate()

+

selectedShipping.maxDays

);

return date;

}

/*=========================================
FORMAT DELIVERY DATE
=========================================*/

function formatDeliveryDate(){

const date=

getEstimatedDeliveryDate();

if(!date){

return"-";

}

return date.toLocaleDateString();

}
/*==================================================
SHIPPING MANAGEMENT
Version 1.3
==================================================*/

/*=========================================
RENDER METHODS
=========================================*/

function renderShippingMethods(){

const container=

document.getElementById(

"shippingMethods"

);

if(!container){

return;

}

container.innerHTML="";

getActiveShippingMethods()

.forEach(method=>{

container.innerHTML+=`

<label class="shipping-method">

<input

type="radio"

name="shippingMethod"

value="${method.id}"

${selectedShipping&&selectedShipping.id===method.id?"checked":""}>

<div class="shipping-info">

<h4>${method.name}</h4>

<p>

${method.minDays}-${method.maxDays} Days

</p>

</div>

<strong>

$${Number(method.price).toFixed(2)}

</strong>

</label>

`;

});

}

/*=========================================
UPDATE METHOD
=========================================*/

function updateShippingMethod(

id,

data

){

const method=

getShippingMethod(id);

if(!method){

return false;

}

Object.assign(

method,

data

);

saveShippingMethods();

renderShippingMethods();

return true;

}

/*=========================================
DELETE METHOD
=========================================*/

function deleteShippingMethod(id){

shippingMethods=

shippingMethods.filter(

method=>

method.id!==

Number(id)

);

saveShippingMethods();

renderShippingMethods();

}

/*=========================================
CREATE METHOD
=========================================*/

function createShippingMethod(

method

){

method.id=

Date.now();

shippingMethods.push(

method

);

saveShippingMethods();

renderShippingMethods();

}

/*=========================================
EXPORT
=========================================*/

function exportShippingMethods(){

const blob=

new Blob(

[

JSON.stringify(

shippingMethods,

null,

2

)

],

{

type:

"application/json"

}

);

const url=

URL.createObjectURL(

blob

);

const link=

document.createElement(

"a"

);

link.href=url;

link.download=

"lunovia-shipping.json";

link.click();

URL.revokeObjectURL(

url

);

}

/*=========================================
EVENTS
=========================================*/

document.addEventListener(

"change",

function(event){

if(

event.target.name!==

"shippingMethod"

){

return;

}

selectShippingMethod(

event.target.value

);

if(

typeof updateCheckoutTotals===

"function"

){

updateCheckoutTotals();

}

});
