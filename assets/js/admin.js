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
/*==================================================
CUSTOMERS MANAGEMENT
Version 1.3
==================================================*/

/*=========================================
RENDER CUSTOMERS
=========================================*/

function renderCustomers(){

const table=

document.querySelector("#customersTableBody");

if(!table)return;

table.innerHTML="";

adminUsers.forEach(user=>{

const orders=

user.orders ? user.orders.length : 0;

const wishlist=

user.wishlist ? user.wishlist.length : 0;

const cart=

user.cart ? user.cart.length : 0;

table.innerHTML+=`

<tr>

<td>${user.id}</td>

<td>${user.name}</td>

<td>${user.email}</td>

<td>${user.phone||"-"}</td>

<td>${user.role}</td>

<td>${orders}</td>

<td>${wishlist}</td>

<td>${cart}</td>

<td>

<span class="status-badge">

${user.status}

</span>

</td>

<td>

<button
class="btn-view-user"
data-id="${user.id}">

<i class="fa-solid fa-eye"></i>

</button>

<button
class="btn-user-status"
data-id="${user.id}">

<i class="fa-solid fa-user-lock"></i>

</button>

<button
class="btn-delete-user"
data-id="${user.id}">

<i class="fa-solid fa-trash"></i>

</button>

</td>

</tr>

`;

});

}

/*=========================================
VIEW CUSTOMER
=========================================*/

function viewCustomer(id){

const user=

adminUsers.find(

item=>item.id==id

);

if(!user)return;

const details=

document.querySelector("#customerDetails");

if(!details)return;

details.innerHTML=`

<h2>${user.name}</h2>

<p><strong>Email:</strong> ${user.email}</p>

<p><strong>Phone:</strong> ${user.phone||"-"}</p>

<p><strong>Role:</strong> ${user.role}</p>

<p><strong>Status:</strong> ${user.status}</p>

<p><strong>Orders:</strong> ${(user.orders||[]).length}</p>

<p><strong>Wishlist:</strong> ${(user.wishlist||[]).length}</p>

<p><strong>Cart:</strong> ${(user.cart||[]).length}</p>

<p><strong>Joined:</strong> ${user.createdAt}</p>

<p><strong>Last Login:</strong> ${user.lastLogin||"Never"}</p>

`;

}

/*=========================================
CHANGE STATUS
=========================================*/

function toggleUserStatus(id){

const user=

adminUsers.find(

item=>item.id==id

);

if(!user)return;

user.status=

user.status==="active"

?

"blocked"

:

"active";

localStorage.setItem(

USERS_KEY,

JSON.stringify(adminUsers)

);

renderCustomers();

showToast(

"Customer status updated",

"success"

);

}

/*=========================================
DELETE CUSTOMER
=========================================*/

function deleteCustomer(id){

if(!confirm("Delete this customer?")){

return;

}

adminUsers=

adminUsers.filter(

item=>item.id!=id

);

localStorage.setItem(

USERS_KEY,

JSON.stringify(adminUsers)

);

calculateStatistics();

renderDashboard();

renderCustomers();

showToast(

"Customer deleted",

"warning"

);

}

/*=========================================
CUSTOMER EVENTS
=========================================*/

document.addEventListener(

"click",

function(event){

const view=

event.target.closest(".btn-view-user");

if(view){

viewCustomer(

Number(view.dataset.id)

);

}

const status=

event.target.closest(".btn-user-status");

if(status){

toggleUserStatus(

Number(status.dataset.id)

);

}

const del=

event.target.closest(".btn-delete-user");

if(del){

deleteCustomer(

Number(del.dataset.id)

);

}

});

/*=========================================
INITIALIZE
=========================================*/

document.addEventListener(

"DOMContentLoaded",

function(){

renderCustomers();

});
/*==================================================
CUSTOMER ACTIVITY TRACKING
Version 1.4
==================================================*/

/*=========================================
LOAD ACTIVITIES
=========================================*/

let customerActivities = JSON.parse(

localStorage.getItem("lunovia_activity")

) || [];

/*=========================================
SAVE ACTIVITIES
=========================================*/

function saveActivities(){

localStorage.setItem(

"lunovia_activity",

JSON.stringify(customerActivities)

);

}

/*=========================================
REGISTER ACTIVITY
=========================================*/

function registerActivity(

userId,

type,

details

){

const activity={

id:Date.now(),

userId:userId,

type:type,

details:details,

date:new Date().toLocaleString(),

timestamp:Date.now()

};

customerActivities.push(activity);

saveActivities();

}

/*=========================================
GET USER ACTIVITIES
=========================================*/

function getUserActivities(userId){

return customerActivities.filter(

item=>item.userId==userId

);

}

/*=========================================
RENDER ACTIVITIES
=========================================*/

function renderCustomerActivities(userId){

const container=

document.querySelector(

"#customerActivityBody"

);

if(!container)return;

const activities=

getUserActivities(userId)

.sort(

(a,b)=>b.timestamp-a.timestamp

);

container.innerHTML="";

if(activities.length===0){

container.innerHTML=`

<tr>

<td colspan="4">

No activity found.

</td>

</tr>

`;

return;

}

activities.forEach(activity=>{

container.innerHTML+=`

<tr>

<td>${activity.date}</td>

<td>${activity.type}</td>

<td>${activity.details}</td>

<td>${activity.userId}</td>

</tr>

`;

});

}

/*=========================================
CUSTOMER INTERESTS
=========================================*/

function renderCustomerInterests(userId){

const container=

document.querySelector(

"#customerInterests"

);

if(!container)return;

const history=

getUserActivities(userId);

const interests={};

history.forEach(item=>{

if(!interests[item.type]){

interests[item.type]=0;

}

interests[item.type]++;

});

container.innerHTML="";

Object.keys(interests).forEach(key=>{

container.innerHTML+=`

<div class="interest-card">

<h4>${key}</h4>

<span>${interests[key]} Times</span>

</div>

`;

});

}

/*=========================================
VIEW FULL PROFILE
=========================================*/

function openCustomerProfile(userId){

viewCustomer(userId);

renderCustomerActivities(userId);

renderCustomerInterests(userId);

}

/*=========================================
CUSTOMER EVENTS
=========================================*/

document.addEventListener(

"click",

function(event){

const view=

event.target.closest(

".btn-view-user"

);

if(!view)return;

openCustomerProfile(

Number(view.dataset.id)

);

});

