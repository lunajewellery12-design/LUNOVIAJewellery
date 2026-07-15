/*==================================================
LUNOVIA
products.js
Version 1.0
==================================================*/

"use strict";

/*==================================================
GLOBAL VARIABLES
==================================================*/

const PRODUCT_DATA_URL = "assets/data/products.json";

let allProducts = [];

let featuredProducts = [];

let offerProducts = [];

let newArrivalProducts = [];

let bestSellerProducts = [];

let currentCategory = "";

let currentProduct = null;

let filteredProducts = [];

let searchKeyword = "";

let currentPage = 1;

const productsPerPage = 12;

/*==================================================
DOM ELEMENTS
==================================================*/

const featuredContainer =
document.querySelector("#featuredProducts");

const offersContainer =
document.querySelector("#offersProducts");

const newArrivalContainer =
document.querySelector("#newArrivalProducts");

const bestSellerContainer =
document.querySelector("#bestSellerProducts");

const productsContainer =
document.querySelector("#productsContainer");

const categoryContainer =
document.querySelector("#categoryProducts");

const relatedContainer =
document.querySelector("#relatedProducts");

/*==================================================
LOAD PRODUCTS
==================================================*/

async function loadProducts(){

try{

const response =
await fetch(PRODUCT_DATA_URL);

if(!response.ok){

throw new Error("Unable to load products.");

}

const data =
await response.json();

allProducts = data.products || [];

initializeProducts();

}

catch(error){

console.error(error);

showLoadingError();

}

}

/*==================================================
INITIALIZE
==================================================*/

function initializeProducts(){

featuredProducts =
allProducts.filter(product => product.featured);

offerProducts =
allProducts.filter(product => product.discount > 0);

newArrivalProducts =
allProducts.filter(product => product.id >= 25);

bestSellerProducts =
allProducts
.sort((a,b)=>b.rating-a.rating)
.slice(0,8);

renderHomeSections();

}

/*==================================================
HOME PAGE
==================================================*/

function renderHomeSections(){

renderFeaturedProducts();

renderOfferProducts();

renderNewArrivals();

renderBestSellerProducts();

}

/*==================================================
START
==================================================*/

document.addEventListener(

"DOMContentLoaded",

loadProducts

);

/*==================================================
LOADING ERROR
==================================================*/

function showLoadingError(){

const html=`

<div class="empty-state">

<h2>Unable to Load Products</h2>

<p>

Please check products.json file.

</p>

</div>

`;

if(productsContainer){

productsContainer.innerHTML=html;

}

}

/*==================================================
UTILITY
==================================================*/

function money(value){

return "$"+Number(value).toFixed(2);

                   }
/*==================================================
PRODUCT CARD ENGINE
==================================================*/

function createProductCard(product){

return `

<div class="product-card fade-in premium-card gold-shine"

data-id="${product.id}"

data-category="${product.category}"

data-price="${product.price}"

data-rating="${product.rating}">

<div class="product-image">

<img

src="${product.images[0]}"

alt="${product.name}"

loading="lazy">

${product.discount > 0 ?

`<span class="discount-badge">

-${product.discount}%

</span>`

:

""

}

<div class="product-actions">

<button

class="wishlist-btn"

data-id="${product.id}"

title="Wishlist">

<i class="fa-regular fa-heart"></i>

</button>

<button

class="quick-view-btn"

data-id="${product.id}"

title="Quick View">

<i class="fa-solid fa-eye"></i>

</button>

<button

class="compare-btn"

data-id="${product.id}"

title="Compare">

<i class="fa-solid fa-code-compare"></i>

</button>

</div>

</div>

<div class="product-info">

<div class="product-category">

${product.category}

</div>

<h3 class="product-title">

${product.name}

</h3>

<div class="product-rating">

${generateStars(product.rating)}

<span>

(${product.rating})

</span>

</div>

<div class="product-price">

<span class="new-price">

${money(product.price)}

</span>

${
product.oldPrice ?

`<span class="old-price">

${money(product.oldPrice)}

</span>`

:

""

}

</div>

<div class="product-buttons">

<button

class="btn-add-cart"

data-id="${product.id}">

<i class="fa-solid fa-cart-shopping"></i>

Add To Cart

</button>

<a

href="product.html?id=${product.id}"

class="btn-details">

Details

</a>

</div>

</div>

</div>

`;

}

/*==================================================
STAR RATING
==================================================*/

function generateStars(rating){

let stars="";

const full=Math.floor(rating);

const half=rating%1>=0.5;

for(let i=0;i<full;i++){

stars+=`<i class="fa-solid fa-star"></i>`;

}

if(half){

stars+=`<i class="fa-solid fa-star-half-stroke"></i>`;

}

while((full+(half?1:0))<5){

stars+=`<i class="fa-regular fa-star"></i>`;

full++;

}

return stars;

}

/*==================================================
RENDER FUNCTION
==================================================*/

function renderProducts(products,container){

if(!container)return;

if(products.length===0){

container.innerHTML=

`

<div class="empty-state">

<h2>

No Products Found

</h2>

<p>

Please try another category.

</p>

</div>

`;

return;

}

container.innerHTML=

products

.map(product=>createProductCard(product))

.join("");

}

/*==================================================
HOME RENDER
==================================================*/

function renderFeaturedProducts(){

renderProducts(

featuredProducts,

featuredContainer

);

}

function renderOfferProducts(){

renderProducts(

offerProducts,

offersContainer

);

}

function renderNewArrivals(){

renderProducts(

newArrivalProducts,

newArrivalContainer

);

}

function renderBestSellerProducts(){

renderProducts(

bestSellerProducts,

bestSellerContainer

);

    }
/*==================================================
CATEGORY FILTER ENGINE
==================================================*/

function getProductsByCategory(category){

if(!category){

return allProducts;

}

return allProducts.filter(product=>{

return product.category.toLowerCase()===category.toLowerCase();

});

}

/*==================================================
DISPLAY CATEGORY
==================================================*/

function displayCategory(category){

currentCategory=category;

filteredProducts=getProductsByCategory(category);

currentPage=1;

renderCategoryProducts();

updateCategoryTitle();

}

/*==================================================
UPDATE TITLE
==================================================*/

function updateCategoryTitle(){

const title=

document.querySelector("#categoryTitle");

if(!title)return;

if(currentCategory===""){

title.textContent="All Products";

return;

}

title.textContent=currentCategory;

}

/*==================================================
RENDER CATEGORY
==================================================*/

function renderCategoryProducts(){

if(!categoryContainer)return;

const start=

(currentPage-1)*productsPerPage;

const end=

start+productsPerPage;

const pageProducts=

filteredProducts.slice(start,end);

renderProducts(

pageProducts,

categoryContainer

);

renderPagination();

}

/*==================================================
CATEGORY BUTTONS
==================================================*/

function initializeCategoryButtons(){

const buttons=

document.querySelectorAll(

"[data-category]"

);

buttons.forEach(button=>{

button.addEventListener(

"click",

function(){

const category=

this.dataset.category;

displayCategory(category);

});

});

}

/*==================================================
SHOW ALL
==================================================*/

function showAllProducts(){

filteredProducts=[

...allProducts

];

currentCategory="";

currentPage=1;

renderCategoryProducts();

}

/*==================================================
PRODUCT COUNT
==================================================*/

function updateProductCounter(){

const counter=

document.querySelector("#productCounter");

if(!counter)return;

counter.textContent=

filteredProducts.length+

" Products";

}

/*==================================================
INITIALIZE SHOP PAGE
==================================================*/

function initializeShopPage(){

if(categoryContainer){

filteredProducts=[

...allProducts

];

renderCategoryProducts();

initializeShopPage();
}

  }
/*==================================================
LIVE SEARCH ENGINE
==================================================*/

function searchProducts(keyword){

searchKeyword=keyword.trim().toLowerCase();

if(searchKeyword===""){

filteredProducts=[...allProducts];

currentPage=1;

renderCategoryProducts();

updateProductCounter();

return;

}

filteredProducts=allProducts.filter(product=>{

return(

product.name.toLowerCase().includes(searchKeyword)||

product.category.toLowerCase().includes(searchKeyword)||

product.description.toLowerCase().includes(searchKeyword)

);

});

currentPage=1;

renderCategoryProducts();

updateProductCounter();

}

/*==================================================
SEARCH INPUT
==================================================*/

function initializeSearch(){

const input=

document.querySelector("#searchInput");

if(!input)return;

input.addEventListener(

"input",

function(){

searchProducts(this.value);

}

);

}

/*==================================================
SORT PRODUCTS
==================================================*/

function sortProducts(type){

switch(type){

case "price-low":

filteredProducts.sort(

(a,b)=>a.price-b.price

);

break;

case "price-high":

filteredProducts.sort(

(a,b)=>b.price-a.price

);

break;

case "rating":

filteredProducts.sort(

(a,b)=>b.rating-a.rating

);

break;

case "discount":

filteredProducts.sort(

(a,b)=>b.discount-a.discount

);

break;

case "name":

filteredProducts.sort(

(a,b)=>a.name.localeCompare(b.name)

);

break;

default:

filteredProducts.sort(

(a,b)=>a.id-b.id

);

}

renderCategoryProducts();

}

/*==================================================
SORT SELECT
==================================================*/

function initializeSorting(){

const select=

document.querySelector("#sortProducts");

if(!select)return;

select.addEventListener(

"change",

function(){

sortProducts(this.value);

}

);

}

/*==================================================
SEARCH RESULTS
==================================================*/

function updateSearchResult(){

const result=

document.querySelector("#searchResult");

if(!result)return;

if(searchKeyword===""){

result.textContent="";

return;

}

result.textContent=

filteredProducts.length+

" result(s) found";

}

/*==================================================
REFRESH SHOP
==================================================*/

function refreshShop(){

renderCategoryProducts();

updateProductCounter();

updateSearchResult();

}

/*==================================================
INITIALIZE SEARCH SYSTEM
==================================================*/

function initializeShopPage(){

initializeCategoryButtons();

initializeSearchSystem();

}

  }
/*==================================================
PAGINATION ENGINE
==================================================*/

function renderPagination(){

const pagination=

document.querySelector("#pagination");

if(!pagination)return;

const totalPages=

Math.ceil(

filteredProducts.length/

productsPerPage

);

if(totalPages<=1){

pagination.innerHTML="";

return;

}

let html="";

html+=`

<button

class="page-btn"

${currentPage===1?"disabled":""}

onclick="previousPage()">

<i class="fa-solid fa-angle-left"></i>

</button>

`;

for(

let i=1;

i<=totalPages;

i++

){

html+=`

<button

class="page-btn

${currentPage===i?" active":""}"

onclick="goToPage(${i})">

${i}

</button>

`;

}

html+=`

<button

class="page-btn"

${currentPage===totalPages?"disabled":""}

onclick="nextPage()">

<i class="fa-solid fa-angle-right"></i>

</button>

`;

pagination.innerHTML=html;

}

/*==================================================
GO TO PAGE
==================================================*/

function goToPage(page){

currentPage=page;

renderCategoryProducts();

window.scrollTo({

top:0,

behavior:"smooth"

});

}

/*==================================================
NEXT PAGE
==================================================*/

function nextPage(){

const totalPages=

Math.ceil(

filteredProducts.length/

productsPerPage

);

if(currentPage<totalPages){

currentPage++;

renderCategoryProducts();

window.scrollTo({

top:0,

behavior:"smooth"

});

}

}

/*==================================================
PREVIOUS PAGE
==================================================*/

function previousPage(){

if(currentPage>1){

currentPage--;

renderCategoryProducts();

window.scrollTo({

top:0,

behavior:"smooth"

});

}

}

/*==================================================
PRODUCT COUNTER
==================================================*/

function updatePaginationInfo(){

const info=

document.querySelector("#paginationInfo");

if(!info)return;

const start=

(currentPage-1)

*

productsPerPage

+

1;

const end=

Math.min(

currentPage*

productsPerPage,

filteredProducts.length

);

info.textContent=

`Showing ${start} - ${end} of ${filteredProducts.length} products`;

}

/*==================================================
REFRESH PAGINATION
==================================================*/

function refreshPagination(){

renderProducts(
pageProducts,
categoryContainer
);

refreshPagination();

   }
/*==================================================
QUICK VIEW ENGINE
==================================================*/

const quickViewModal =
document.querySelector("#quickViewModal");

const quickViewContent =
document.querySelector("#quickViewContent");

/*=========================================
OPEN QUICK VIEW
=========================================*/

function openQuickView(productId){

const product =
allProducts.find(item=>item.id==productId);

if(!product)return;

currentProduct=product;

if(!quickViewModal || !quickViewContent)return;

quickViewContent.innerHTML=createQuickView(product);

quickViewModal.classList.add("active");

document.body.style.overflow="hidden";

initializeQuickViewEvents();

}

/*=========================================
CLOSE QUICK VIEW
=========================================*/

function closeQuickView(){

if(!quickViewModal)return;

quickViewModal.classList.remove("active");

document.body.style.overflow="";

}

/*=========================================
CREATE QUICK VIEW
=========================================*/

function createQuickView(product){

return `

<div class="quick-view-wrapper">

<div class="quick-view-gallery">

<img
id="quickViewMainImage"
src="${product.images[0]}"
alt="${product.name}">

<div class="quick-thumbnails">

${product.images.map(image=>`

<img
src="${image}"
class="quick-thumb"
data-image="${image}">

`).join("")}

</div>

</div>

<div class="quick-view-details">

<span class="quick-category">

${product.category}

</span>

<h2>

${product.name}

</h2>

<div class="quick-rating">

${generateStars(product.rating)}

<span>${product.rating}</span>

</div>

<div class="quick-price">

<span class="new-price">

${money(product.price)}

</span>

<span class="old-price">

${money(product.oldPrice)}

</span>

</div>

<p>

${product.description}

</p>

<div class="quick-buttons">

<button
class="btn-add-cart"
data-id="${product.id}">

<i class="fa-solid fa-cart-shopping"></i>

Add To Cart

</button>

<a
href="product.html?id=${product.id}"
class="btn-details">

View Details

</a>

</div>

</div>

</div>

`;

}

/*=========================================
THUMBNAILS
=========================================*/

function initializeQuickViewEvents(){

const thumbs=

document.querySelectorAll(".quick-thumb");

const main=

document.querySelector("#quickViewMainImage");

thumbs.forEach(thumb=>{

thumb.addEventListener(

"click",

function(){

main.src=this.dataset.image;

});

});

}

/*=========================================
CLICK EVENTS
=========================================*/

document.addEventListener(

"click",

function(event){

const quick=

event.target.closest(".quick-view-btn");

if(quick){

openQuickView(

quick.dataset.id

);

}

const close=

event.target.closest(".closeQuickView");

if(close){

closeQuickView();

}

if(

event.target===quickViewModal

){

closeQuickView();

}

}

);

/*=========================================
ESC KEY
=========================================*/

document.addEventListener(

"keydown",

function(event){

if(

event.key==="Escape"

&&

quickViewModal

&&

quickViewModal.classList.contains("active")

){

closeQuickView();

}

});
/*==================================================
SHOPPING CART ENGINE
Version 1.0
==================================================*/

let cart = JSON.parse(
localStorage.getItem("lunovia_cart")
) || [];

/*=========================================
SAVE CART
=========================================*/

function saveCart(){

localStorage.setItem(

"lunovia_cart",

JSON.stringify(cart)

);

updateCartCounter();

}

/*=========================================
ADD PRODUCT
=========================================*/

function addToCart(productId){

const product=

allProducts.find(

item=>item.id==productId

);

if(!product)return;

const existing=

cart.find(

item=>item.id==productId

);

if(existing){

existing.quantity++;

}else{

cart.push({

id:product.id,

name:product.name,

price:product.price,

image:product.images[0],

quantity:1

});

}

saveCart();

showToast(

product.name+

" added to cart",

"success"

);

}

/*=========================================
REMOVE PRODUCT
=========================================*/

function removeFromCart(productId){

cart=

cart.filter(

item=>item.id!=productId

);

saveCart();

renderCart();

showToast(

"Product removed",

"warning"

);

}

/*=========================================
CHANGE QUANTITY
=========================================*/

function changeQuantity(productId,value){

const item=

cart.find(

item=>item.id==productId

);

if(!item)return;

item.quantity+=value;

if(item.quantity<=0){

removeFromCart(productId);

return;

}

saveCart();

renderCart();

}

/*=========================================
TOTAL PRICE
=========================================*/

function getCartTotal(){

let total=0;

cart.forEach(item=>{

total+=

item.price*

item.quantity;

});

return total;

}

/*=========================================
ITEM COUNT
=========================================*/

function getCartCount(){

let count=0;

cart.forEach(item=>{

count+=item.quantity;

});

return count;

}

/*=========================================
UPDATE COUNTER
=========================================*/

function updateCartCounter(){

document

.querySelectorAll(".cart-count")

.forEach(counter=>{

counter.textContent=

getCartCount();

});

}

/*=========================================
CLEAR CART
=========================================*/

function clearCart(){

cart=[];

saveCart();

renderCart();

showToast(

"Cart cleared",

"info"

);

}

/*=========================================
ADD BUTTON EVENTS
=========================================*/

document.addEventListener(

"click",

function(event){

const button=

event.target.closest(

".btn-add-cart"

);

if(!button)return;

event.preventDefault();

addToCart(

button.dataset.id

);

});

/*=========================================
INITIALIZE
=========================================*/

document.addEventListener(

"DOMContentLoaded",

function(){

updateCartCounter();

});
/*==================================================
WISHLIST ENGINE
Version 1.0
==================================================*/

let wishlist = JSON.parse(

localStorage.getItem("lunovia_wishlist")

) || [];

/*=========================================
SAVE WISHLIST
=========================================*/

function saveWishlist(){

localStorage.setItem(

"lunovia_wishlist",

JSON.stringify(wishlist)

);

updateWishlistCounter();

updateWishlistButtons();

}

/*=========================================
IS IN WISHLIST
=========================================*/

function isInWishlist(productId){

return wishlist.some(

item=>item.id==productId

);

}

/*=========================================
ADD / REMOVE
=========================================*/

function toggleWishlist(productId){

const product=

allProducts.find(

item=>item.id==productId

);

if(!product)return;

if(isInWishlist(productId)){

wishlist=

wishlist.filter(

item=>item.id!=productId

);

showToast(

"Removed from wishlist",

"warning"

);

}else{

wishlist.push({

id:product.id,

name:product.name,

price:product.price,

image:product.images[0]

});

showToast(

product.name+

" added to wishlist",

"success"

);

}

saveWishlist();

}

/*=========================================
REMOVE
=========================================*/

function removeWishlist(productId){

wishlist=

wishlist.filter(

item=>item.id!=productId

);

saveWishlist();

renderWishlist();

}

/*=========================================
COUNT
=========================================*/

function updateWishlistCounter(){

document

.querySelectorAll(".wishlist-count")

.forEach(counter=>{

counter.textContent=

wishlist.length;

});

}

/*=========================================
BUTTON STATE
=========================================*/

function updateWishlistButtons(){

document

.querySelectorAll(".wishlist-btn")

.forEach(button=>{

const id=

button.dataset.id;

const icon=

button.querySelector("i");

if(isInWishlist(id)){

button.classList.add("active");

icon.className=

"fa-solid fa-heart";

}else{

button.classList.remove("active");

icon.className=

"fa-regular fa-heart";

}

});

}

/*=========================================
RENDER PAGE
=========================================*/

function renderWishlist(){

const container=

document.querySelector(

"#wishlistContainer"

);

if(!container)return;

if(wishlist.length===0){

container.innerHTML=

`

<div class="empty-state">

<i class="fa-regular fa-heart"></i>

<h2>

Wishlist is Empty

</h2>

<p>

Save your favorite jewelry here.

</p>

</div>

`;

return;

}

container.innerHTML=

wishlist.map(product=>

createProductCard(product)

).join("");

updateWishlistButtons();

}

/*=========================================
CLICK EVENTS
=========================================*/

document.addEventListener(

"click",

function(event){

const button=

event.target.closest(

".wishlist-btn"

);

if(!button)return;

event.preventDefault();

toggleWishlist(

button.dataset.id

);

});

document.addEventListener(

"DOMContentLoaded",

function(){

updateWishlistCounter();

updateWishlistButtons();

renderWishlist();

});
/*==================================================
TOAST NOTIFICATION SYSTEM
LUNOVIA
==================================================*/

const toastContainer = createToastContainer();

/*=========================================
CREATE CONTAINER
=========================================*/

function createToastContainer(){

let container = document.querySelector("#toastContainer");

if(container){

return container;

}

container = document.createElement("div");

container.id = "toastContainer";

container.className = "toast-container";

document.body.appendChild(container);

return container;

}

/*=========================================
SHOW TOAST
=========================================*/

function showToast(

message,

type="success",

duration=3500

){

const toast = document.createElement("div");

toast.className =

`toast toast-${type}`;

let icon="fa-circle-info";

switch(type){

case "success":

icon="fa-circle-check";

break;

case "error":

icon="fa-circle-xmark";

break;

case "warning":

icon="fa-triangle-exclamation";

break;

case "info":

icon="fa-circle-info";

break;

}

toast.innerHTML=`

<div class="toast-icon">

<i class="fa-solid ${icon}"></i>

</div>

<div class="toast-content">

<div class="toast-title">

${type.toUpperCase()}

</div>

<div class="toast-message">

${message}

</div>

</div>

<button

class="toast-close">

<i class="fa-solid fa-xmark"></i>

</button>

<div class="toast-progress"></div>

`;

toastContainer.appendChild(toast);

requestAnimationFrame(()=>{

toast.classList.add("show");

});

const timer=setTimeout(()=>{

removeToast(toast);

},duration);

toast

.querySelector(".toast-close")

.addEventListener(

"click",

function(){

clearTimeout(timer);

removeToast(toast);

}

);

}

/*=========================================
REMOVE TOAST
=========================================*/

function removeToast(toast){

if(!toast)return;

toast.classList.remove("show");

toast.classList.add("hide");

setTimeout(()=>{

toast.remove();

},400);

}

/*=========================================
REMOVE ALL
=========================================*/

function clearAllToasts(){

document

.querySelectorAll(".toast")

.forEach(toast=>{

removeToast(toast);

});

}

/*=========================================
NETWORK STATUS
=========================================*/

window.addEventListener(

"online",

function(){

showToast(

"Internet connection restored.",

"success"

);

}

);

window.addEventListener(

"offline",

function(){

showToast(

"You are currently offline.",

"warning"

);

}

);

/*=========================================
WELCOME MESSAGE
=========================================*/

document.addEventListener(

"DOMContentLoaded",

function(){

setTimeout(()=>{

showToast(

"Welcome to LUNOVIA Luxury Store",

"info",

2500

);

},1000);

});
