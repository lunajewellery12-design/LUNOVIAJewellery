/*==================================================
LUNOVIA PRODUCT COMPARISON
Version 1.0
==================================================*/

"use strict";

/*==================================================
LOCAL STORAGE KEYS
==================================================*/

const COMPARE_STORAGE="lunovia_compare";

const PRODUCTS_STORAGE="lunovia_products";

/*==================================================
GLOBAL VARIABLES
==================================================*/

let compareProducts=[];

let products=[];

const MAX_COMPARE_ITEMS=4;

/*==================================================
INITIALIZE
==================================================*/

document.addEventListener(

"DOMContentLoaded",

initializeCompare

);

function initializeCompare(){

loadCompare();

loadProducts();

renderCompare();

updateCompareCounter();

bindCompareEvents();

}

/*==================================================
LOAD DATA
==================================================*/

function loadCompare(){

compareProducts=

JSON.parse(

localStorage.getItem(

COMPARE_STORAGE

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
SAVE DATA
==================================================*/

function saveCompare(){

localStorage.setItem(

COMPARE_STORAGE,

JSON.stringify(compareProducts)

);

}

/*==================================================
UPDATE COUNTER
==================================================*/

function updateCompareCounter(){

document

.querySelectorAll(

".compare-count"

)

.forEach(counter=>{

counter.textContent=

compareProducts.length;

});

}
/*==================================================
COMPARE OPERATIONS
Version 1.1
==================================================*/

/*=========================================
CHECK PRODUCT
=========================================*/

function isInCompare(productId){

return compareProducts.some(

item=>item.id===productId

);

}

/*=========================================
ADD TO COMPARE
=========================================*/

function addToCompare(productId){

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

if(isInCompare(productId)){

showToast(

"Product already added.",

"info"

);

return;

}

if(compareProducts.length>=MAX_COMPARE_ITEMS){

showToast(

"Maximum 4 products can be compared.",

"warning"

);

return;

}

compareProducts.push({

...product,

addedAt:new Date().toISOString()

});

saveCompare();

updateCompareCounter();

updateCompareButtons();

renderCompare();

showToast(

"Product added to comparison.",

"success"

);

}

/*=========================================
REMOVE PRODUCT
=========================================*/

function removeFromCompare(productId){

compareProducts=

compareProducts.filter(

item=>item.id!==productId

);

saveCompare();

updateCompareCounter();

updateCompareButtons();

renderCompare();

showToast(

"Product removed from comparison.",

"success"

);

}

/*=========================================
TOGGLE COMPARE
=========================================*/

function toggleCompare(productId){

if(isInCompare(productId)){

removeFromCompare(productId);

}else{

addToCompare(productId);

}

}

/*=========================================
UPDATE BUTTONS
=========================================*/

function updateCompareButtons(){

document

.querySelectorAll(

".compare-button"

)

.forEach(button=>{

const id=

Number(

button.dataset.id

);

button.classList.toggle(

"active",

isInCompare(id)

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

".compare-button"

);

if(!button)return;

toggleCompare(

Number(

button.dataset.id

)

);

});
/*==================================================
RENDER COMPARISON TABLE
Version 1.2
==================================================*/

/*=========================================
RENDER COMPARE
=========================================*/

function renderCompare(){

const container=

document.querySelector(

"#compareContainer"

);

if(!container)return;

if(compareProducts.length===0){

container.innerHTML=`

<div class="empty-state">

<i class="fa-solid fa-scale-balanced"></i>

<h2>No Products Selected</h2>

<p>

Add products to compare them.

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

container.innerHTML=`

<table class="compare-table">

<thead>

<tr>

<th>Feature</th>

${compareProducts.map(product=>`

<th>

<div class="compare-product">

<img

src="${product.image}"

alt="${product.name}">

<h3>${product.name}</h3>

<button

class="compare-remove"

data-id="${product.id}">

<i class="fa-solid fa-xmark"></i>

</button>

</div>

</th>

`).join("")}

</tr>

</thead>

<tbody>

${createCompareRow(

"Price",

product=>"$"+

Number(product.price)

.toFixed(2)

)}

${createCompareRow(

"Category",

product=>

product.category||"-"

)}

${createCompareRow(

"Material",

product=>

product.material||"-"

)}

${createCompareRow(

"Gemstone",

product=>

product.gemstone||"-"

)}

${createCompareRow(

"Weight",

product=>

product.weight||"-"

)}

${createCompareRow(

"Rating",

product=>

(product.rating||0)+" ★"

)}

${createCompareRow(

"Stock",

product=>

product.stock

)}

${createCompareRow(

"Warranty",

product=>

product.warranty||"-"

)}

<tr>

<td>Action</td>

${compareProducts.map(product=>`

<td>

<button

class="btn-primary compare-add-cart"

data-id="${product.id}">

Add to Cart

</button>

</td>

`).join("")}

</tr>

</tbody>

</table>

`;

}

/*=========================================
CREATE ROW
=========================================*/

function createCompareRow(

title,

callback

){

return`

<tr>

<td>

<strong>${title}</strong>

</td>

${compareProducts.map(product=>`

<td>

${callback(product)}

</td>

`).join("")}

</tr>

`;

  }
/*==================================================
COMPARE ACTIONS
Version 1.3
==================================================*/

/*=========================================
ADD TO CART
=========================================*/

function addComparedProductToCart(productId){

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

let cart=

JSON.parse(

localStorage.getItem(

"lunovia_cart"

)

)||[];

const existing=

cart.find(

item=>item.id===product.id

);

if(existing){

existing.quantity+=1;

}else{

cart.push({

...product,

quantity:1

});

}

localStorage.setItem(

"lunovia_cart",

JSON.stringify(cart)

);

showToast(

"Product added to cart.",

"success"

);

}

/*=========================================
CLEAR COMPARISON
=========================================*/

function clearCompare(){

if(compareProducts.length===0){

return;

}

if(!confirm(

"Clear all compared products?"

)){

return;

}

compareProducts=[];

saveCompare();

updateCompareCounter();

updateCompareButtons();

renderCompare();

showToast(

"Comparison cleared.",

"success"

);

}

/*=========================================
EXPORT JSON
=========================================*/

function exportCompare(){

const data=

JSON.stringify(

compareProducts,

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

"lunovia-compare.json";

link.click();

URL.revokeObjectURL(url);

}

/*=========================================
SHARE COMPARISON
=========================================*/

async function shareCompare(){

const text=

compareProducts

.map(product=>

`${product.name} - $${product.price}`

)

.join("\n");

if(navigator.share){

try{

await navigator.share({

title:"LUNOVIA Product Comparison",

text:text

});

showToast(

"Comparison shared.",

"success"

);

}catch(error){

console.error(error);

}

}else{

navigator.clipboard.writeText(text);

showToast(

"Comparison copied.",

"success"

);

}

}

/*=========================================
EVENTS
=========================================*/

document.addEventListener(

"click",

function(event){

const addButton=

event.target.closest(

".compare-add-cart"

);

if(addButton){

addComparedProductToCart(

Number(addButton.dataset.id)

);

}

const removeButton=

event.target.closest(

".compare-remove"

);

if(removeButton){

removeFromCompare(

Number(removeButton.dataset.id)

);

}

const clearButton=

event.target.closest(

"#clearCompare"

);

if(clearButton){

clearCompare();

}

const exportButton=

event.target.closest(

"#exportCompare"

);

if(exportButton){

exportCompare();

}

const shareButton=

event.target.closest(

"#shareCompare"

);

if(shareButton){

shareCompare();

}

});

