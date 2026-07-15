/*==================================================
LUNOVIA ADMIN PANEL
Version 1.0
==================================================*/

"use strict";

/*==================================================
GLOBAL VARIABLES
==================================================*/

let adminProducts=[];

let adminUsers=[];

let adminOrders=[];

let adminStatistics={};

let currentEditingProduct=null;

/*==================================================
LOCAL STORAGE KEYS
==================================================*/

const PRODUCTS_KEY="lunovia_products";

const USERS_KEY="lunovia_users";

const ORDERS_KEY="lunovia_orders";

/*==================================================
LOAD DATA
==================================================*/

function loadAdminData(){

adminProducts=

JSON.parse(

localStorage.getItem(PRODUCTS_KEY)

)||[];

adminUsers=

JSON.parse(

localStorage.getItem(USERS_KEY)

)||[];

adminOrders=

JSON.parse(

localStorage.getItem(ORDERS_KEY)

)||[];

calculateStatistics();

renderDashboard();

}

/*==================================================
STATISTICS
==================================================*/

function calculateStatistics(){

let revenue=0;

adminOrders.forEach(order=>{

revenue+=Number(order.total||0);

});

adminStatistics={

products:adminProducts.length,

users:adminUsers.length,

orders:adminOrders.length,

revenue:revenue

};

}

/*==================================================
DASHBOARD
==================================================*/

function renderDashboard(){

updateCard(

"dashboardProducts",

adminStatistics.products

);

updateCard(

"dashboardUsers",

adminStatistics.users

);

updateCard(

"dashboardOrders",

adminStatistics.orders

);

updateCard(

"dashboardRevenue",

"$"+

adminStatistics.revenue.toFixed(2)

);

renderRecentOrders();

renderRecentUsers();

}

/*==================================================
UPDATE CARD
==================================================*/

function updateCard(id,value){

const card=

document.getElementById(id);

if(card){

card.textContent=value;

}

}

/*==================================================
RECENT USERS
==================================================*/

function renderRecentUsers(){

const container=

document.getElementById(

"recentUsers"

);

if(!container)return;

container.innerHTML="";

adminUsers

.slice(-5)

.reverse()

.forEach(user=>{

container.innerHTML+=`

<tr>

<td>${user.name}</td>

<td>${user.email}</td>

<td>${user.role}</td>

<td>${user.status}</td>

</tr>

`;

});

}

/*==================================================
RECENT ORDERS
==================================================*/

function renderRecentOrders(){

const container=

document.getElementById(

"recentOrders"

);

if(!container)return;

container.innerHTML="";

adminOrders

.slice(-5)

.reverse()

.forEach(order=>{

container.innerHTML+=`

<tr>

<td>${order.id}</td>

<td>${order.customer}</td>

<td>$${order.total}</td>

<td>${order.status}</td>

</tr>

`;

});

}

/*==================================================
INITIALIZE
==================================================*/

document.addEventListener(

"DOMContentLoaded",

loadAdminData

);
/*==================================================
PRODUCT MANAGEMENT
Version 1.1
==================================================*/

/*=========================================
RENDER PRODUCTS TABLE
=========================================*/

function renderProductsTable(){

const table=

document.querySelector("#productsTableBody");

if(!table)return;

table.innerHTML="";

adminProducts.forEach(product=>{

table.innerHTML+=`

<tr>

<td>

<img

src="${product.images[0]}"

class="admin-product-image"

alt="${product.name}">

</td>

<td>${product.id}</td>

<td>${product.name}</td>

<td>${product.category}</td>

<td>$${product.price}</td>

<td>${product.stock}</td>

<td>

<span class="status-badge">

${product.featured ? "Featured":"Standard"}

</span>

</td>

<td>

<button

class="btn-edit-product"

data-id="${product.id}">

<i class="fa-solid fa-pen"></i>

</button>

<button

class="btn-delete-product"

data-id="${product.id}">

<i class="fa-solid fa-trash"></i>

</button>

</td>

</tr>

`;

});

}

/*=========================================
ADD PRODUCT
=========================================*/

function addProduct(product){

product.id=Date.now();

adminProducts.push(product);

saveProducts();

renderProductsTable();

showToast(

"Product Added Successfully",

"success"

);

}

/*=========================================
UPDATE PRODUCT
=========================================*/

function updateProduct(product){

const index=

adminProducts.findIndex(

item=>item.id==product.id

);

if(index===-1)return;

adminProducts[index]=product;

saveProducts();

renderProductsTable();

showToast(

"Product Updated",

"success"

);

}

/*=========================================
DELETE PRODUCT
=========================================*/

function deleteProduct(id){

if(

!confirm(

"Delete this product?"

)

){

return;

}

adminProducts=

adminProducts.filter(

item=>item.id!=id

);

saveProducts();

renderProductsTable();

showToast(

"Product Deleted",

"warning"

);

}

/*=========================================
SAVE PRODUCTS
=========================================*/

function saveProducts(){

localStorage.setItem(

PRODUCTS_KEY,

JSON.stringify(adminProducts)

);

calculateStatistics();

renderDashboard();

}

/*=========================================
SEARCH PRODUCTS
=========================================*/

function searchProductsAdmin(keyword){

keyword=

keyword.toLowerCase();

const rows=

document.querySelectorAll(

"#productsTableBody tr"

);

rows.forEach(row=>{

const text=

row.innerText.toLowerCase();

row.style.display=

text.includes(keyword)

?

""

:

"none";

});

}

/*=========================================
PRODUCT SEARCH
=========================================*/

const productSearch=

document.querySelector(

"#productSearch"

);

if(productSearch){

productSearch.addEventListener(

"input",

function(){

searchProductsAdmin(

this.value

);

});

}

/*=========================================
EDIT / DELETE EVENTS
=========================================*/

document.addEventListener(

"click",

function(event){

const edit=

event.target.closest(

".btn-edit-product"

);

if(edit){

const id=

Number(edit.dataset.id);

currentEditingProduct=

adminProducts.find(

item=>item.id===id

);

fillProductForm(

currentEditingProduct

);

}

const del=

event.target.closest(

".btn-delete-product"

);

if(del){

deleteProduct(

Number(del.dataset.id)

);

}

});

/*=========================================
FILL FORM
=========================================*/

function fillProductForm(product){

if(!product)return;

document.querySelector("#productName").value=product.name;

document.querySelector("#productCategory").value=product.category;

document.querySelector("#productPrice").value=product.price;

document.querySelector("#productOldPrice").value=product.oldPrice;

document.querySelector("#productDiscount").value=product.discount;

document.querySelector("#productStock").value=product.stock;

document.querySelector("#productDescription").value=product.description;

}
/*==================================================
PRODUCT FORM MANAGEMENT
Version 1.2
==================================================*/

/*=========================================
PRODUCT IMAGES
=========================================*/

let productImages=[];

/*=========================================
RESET FORM
=========================================*/

function resetProductForm(){

currentEditingProduct=null;

productImages=[];

const form=document.querySelector("#productForm");

if(form){

form.reset();

}

const preview=document.querySelector("#imagePreview");

if(preview){

preview.innerHTML="";

}

}

/*=========================================
IMAGE PREVIEW
=========================================*/

function previewProductImages(files){

const preview=document.querySelector("#imagePreview");

if(!preview)return;

preview.innerHTML="";

productImages=[];

Array.from(files).forEach(file=>{

if(!file.type.startsWith("image/")) return;

const reader=new FileReader();

reader.onload=function(e){

productImages.push(e.target.result);

preview.innerHTML+=`

<div class="preview-item">

<img
src="${e.target.result}"
class="preview-image"
alt="Preview">

</div>

`;

};

reader.readAsDataURL(file);

});

}

/*=========================================
IMAGE INPUT
=========================================*/

const imageInput=document.querySelector("#productImages");

if(imageInput){

imageInput.addEventListener(

"change",

function(){

previewProductImages(this.files);

}

);

}

/*=========================================
SAVE PRODUCT
=========================================*/

function saveProductForm(){

const name=document.querySelector("#productName").value.trim();

const category=document.querySelector("#productCategory").value;

const price=Number(document.querySelector("#productPrice").value);

const oldPrice=Number(document.querySelector("#productOldPrice").value);

const discount=Number(document.querySelector("#productDiscount").value);

const stock=Number(document.querySelector("#productStock").value);

const description=document.querySelector("#productDescription").value.trim();

if(

name==="" ||

category==="" ||

price<=0 ||

stock<0 ||

description===""

){

showToast(

"Please complete all required fields.",

"warning"

);

return;

}

const product={

id:currentEditingProduct ? currentEditingProduct.id : Date.now(),

sku:"LNV-"+Date.now(),

name:name,

category:category,

price:price,

oldPrice:oldPrice,

discount:discount,

rating:currentEditingProduct ? currentEditingProduct.rating : 5,

stock:stock,

featured:currentEditingProduct ? currentEditingProduct.featured : false,

description:description,

images:productImages.length>0

?productImages

:(currentEditingProduct

?currentEditingProduct.images

:["assets/images/products/default.jpg"])

};

if(currentEditingProduct){

updateProduct(product);

}else{

addProduct(product);

}

resetProductForm();

}

/*=========================================
FORM SUBMIT
=========================================*/

const productForm=document.querySelector("#productForm");

if(productForm){

productForm.addEventListener(

"submit",

function(event){

event.preventDefault();

saveProductForm();

}

);

}

/*=========================================
NEW PRODUCT
=========================================*/

const newProductButton=document.querySelector("#newProduct");

if(newProductButton){

newProductButton.addEventListener(

"click",

function(){

resetProductForm();

}

);

}

