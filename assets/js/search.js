/*==================================================
LUNOVIA SEARCH ENGINE
Version 1.0
Professional Search System
==================================================*/

"use strict";

/*==================================================
LOCAL STORAGE KEYS
==================================================*/

const PRODUCTS_STORAGE="lunovia_products";
const SEARCH_HISTORY_STORAGE="lunovia_search_history";

/*==================================================
GLOBAL VARIABLES
==================================================*/

let products=[];

let filteredProducts=[];

let searchHistory=[];

let searchFilters={

keyword:"",

category:"all",

minPrice:0,

maxPrice:999999,

rating:0,

availability:"all",

sort:"featured"

};

/*==================================================
INITIALIZE
==================================================*/

document.addEventListener(

"DOMContentLoaded",

initializeSearch

);

function initializeSearch(){

loadProducts();

loadSearchHistory();

bindSearchEvents();

renderSearchResults(products);

}

/*==================================================
LOAD PRODUCTS
==================================================*/

function loadProducts(){

products=

JSON.parse(

localStorage.getItem(

PRODUCTS_STORAGE

)

)||[];

filteredProducts=[...products];

}

/*==================================================
LOAD HISTORY
==================================================*/

function loadSearchHistory(){

searchHistory=

JSON.parse(

localStorage.getItem(

SEARCH_HISTORY_STORAGE

)

)||[];

}

/*==================================================
SAVE HISTORY
==================================================*/

function saveSearchHistory(){

localStorage.setItem(

SEARCH_HISTORY_STORAGE,

JSON.stringify(searchHistory)

);

}
/*==================================================
LIVE SEARCH ENGINE
Version 1.1
==================================================*/

/*=========================================
PERFORM SEARCH
=========================================*/

function performSearch(){

filteredProducts=

products.filter(product=>{

const keyword=

searchFilters.keyword

.toLowerCase()

.trim();

const matchesKeyword=

keyword===""

||

product.name

.toLowerCase()

.includes(keyword)

||

(product.description||"")

.toLowerCase()

.includes(keyword)

||

(product.category||"")

.toLowerCase()

.includes(keyword)

||

(product.keywords||[])

.join(" ")

.toLowerCase()

.includes(keyword);

const matchesCategory=

searchFilters.category==="all"

||

product.category===

searchFilters.category;

const price=

Number(product.price);

const matchesPrice=

price>=searchFilters.minPrice

&&

price<=searchFilters.maxPrice;

const rating=

Number(product.rating||0);

const matchesRating=

rating>=searchFilters.rating;

const inStock=

searchFilters.availability==="all"

||

(searchFilters.availability==="instock"

&&product.stock>0)

||

(searchFilters.availability==="outofstock"

&&product.stock<=0);

return(

matchesKeyword

&&

matchesCategory

&&

matchesPrice

&&

matchesRating

&&

inStock

);

});

sortResults();

renderSearchResults(

filteredProducts

);

}

/*=========================================
SORT RESULTS
=========================================*/

function sortResults(){

switch(searchFilters.sort){

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

(a,b)=>

(b.rating||0)-

(a.rating||0)

);

break;

case "newest":

filteredProducts.sort(

(a,b)=>

new Date(b.createdAt||0)-

new Date(a.createdAt||0)

);

break;

default:

break;

}

  }
/*==================================================
SEARCH EVENTS & SUGGESTIONS
Version 1.2
==================================================*/

/*=========================================
RENDER RESULTS
=========================================*/

function renderSearchResults(results){

const container=

document.querySelector("#searchResults");

if(!container)return;

container.innerHTML="";

updateResultsCount(results.length);

if(results.length===0){

container.innerHTML=`

<div class="empty-search">

<i class="fa-solid fa-magnifying-glass"></i>

<h2>No products found</h2>

<p>Try different keywords or filters.</p>

</div>

`;

return;

}

results.forEach(product=>{

container.innerHTML+=createProductCard(product);

});

}

/*=========================================
RESULT COUNT
=========================================*/

function updateResultsCount(count){

const element=

document.querySelector("#resultsCount");

if(element){

element.textContent=

count+" Products";

}

}

/*=========================================
SEARCH HISTORY
=========================================*/

function addSearchHistory(keyword){

keyword=keyword.trim();

if(keyword==="")return;

searchHistory=

searchHistory.filter(

item=>item!==keyword

);

searchHistory.unshift(keyword);

if(searchHistory.length>10){

searchHistory.pop();

}

saveSearchHistory();

renderSearchHistory();

}

/*=========================================
RENDER HISTORY
=========================================*/

function renderSearchHistory(){

const container=

document.querySelector("#searchHistory");

if(!container)return;

container.innerHTML="";

searchHistory.forEach(item=>{

container.innerHTML+=`

<button

class="history-item"

data-key="${item}">

<i class="fa-solid fa-clock-rotate-left"></i>

${item}

</button>

`;

});

}

/*=========================================
LIVE SEARCH
=========================================*/

const searchInput=

document.querySelector("#searchInput");

if(searchInput){

searchInput.addEventListener(

"input",

function(){

searchFilters.keyword=

this.value;

performSearch();

}

);

searchInput.addEventListener(

"change",

function(){

addSearchHistory(

this.value

);

}

);

}

/*=========================================
HISTORY EVENTS
=========================================*/

document.addEventListener(

"click",

function(event){

const history=

event.target.closest(

".history-item"

);

if(!history)return;

const keyword=

history.dataset.key;

searchInput.value=

keyword;

searchFilters.keyword=

keyword;

performSearch();

});

/*=========================================
CLEAR HISTORY
=========================================*/

const clearHistory=

document.querySelector(

"#clearSearchHistory"

);

if(clearHistory){

clearHistory.addEventListener(

"click",

function(){

searchHistory=[];

saveSearchHistory();

renderSearchHistory();

showToast(

"Search history cleared.",

"success"

);

});

}

/*=========================================
INITIALIZE HISTORY
=========================================*/

document.addEventListener(

"DOMContentLoaded",

function(){

renderSearchHistory();

});
/*==================================================
ADVANCED FILTERS
Version 1.3
==================================================*/

/*=========================================
CATEGORY FILTER
=========================================*/

const categoryFilter=

document.querySelector(

"#categoryFilter"

);

if(categoryFilter){

categoryFilter.addEventListener(

"change",

function(){

searchFilters.category=

this.value;

performSearch();

}

);

}

/*=========================================
MIN PRICE
=========================================*/

const minPrice=

document.querySelector(

"#minPrice"

);

if(minPrice){

minPrice.addEventListener(

"input",

function(){

searchFilters.minPrice=

Number(this.value)||0;

performSearch();

}

);

}

/*=========================================
MAX PRICE
=========================================*/

const maxPrice=

document.querySelector(

"#maxPrice"

);

if(maxPrice){

maxPrice.addEventListener(

"input",

function(){

searchFilters.maxPrice=

Number(this.value)||999999;

performSearch();

}

);

}

/*=========================================
RATING FILTER
=========================================*/

const ratingFilter=

document.querySelector(

"#ratingFilter"

);

if(ratingFilter){

ratingFilter.addEventListener(

"change",

function(){

searchFilters.rating=

Number(this.value);

performSearch();

}

);

}

/*=========================================
STOCK FILTER
=========================================*/

const stockFilter=

document.querySelector(

"#stockFilter"

);

if(stockFilter){

stockFilter.addEventListener(

"change",

function(){

searchFilters.availability=

this.value;

performSearch();

}

);

}

/*=========================================
SORT FILTER
=========================================*/

const sortFilter=

document.querySelector(

"#sortFilter"

);

if(sortFilter){

sortFilter.addEventListener(

"change",

function(){

searchFilters.sort=

this.value;

performSearch();

}

);

}

/*=========================================
RESET FILTERS
=========================================*/

function resetSearchFilters(){

searchFilters={

keyword:"",

category:"all",

minPrice:0,

maxPrice:999999,

rating:0,

availability:"all",

sort:"featured"

};

if(searchInput){

searchInput.value="";

}

if(categoryFilter){

categoryFilter.value="all";

}

if(minPrice){

minPrice.value="";

}

if(maxPrice){

maxPrice.value="";

}

if(ratingFilter){

ratingFilter.value="0";

}

if(stockFilter){

stockFilter.value="all";

}

if(sortFilter){

sortFilter.value="featured";

}

performSearch();

showToast(

"Search filters reset.",

"success"

);

}

/*=========================================
RESET BUTTON
=========================================*/

const resetButton=

document.querySelector(

"#resetSearchFilters"

);

if(resetButton){

resetButton.addEventListener(

"click",

resetSearchFilters

);

}
/*==================================================
SMART SEARCH
Version 1.4
==================================================*/

/*=========================================
DEBOUNCE
=========================================*/

let searchTimer=null;

function debounceSearch(callback,delay=300){

clearTimeout(searchTimer);

searchTimer=setTimeout(callback,delay);

}

/*=========================================
SEARCH SUGGESTIONS
=========================================*/

function renderSuggestions(keyword){

const container=

document.querySelector("#searchSuggestions");

if(!container)return;

container.innerHTML="";

keyword=keyword.trim().toLowerCase();

if(keyword===""){

container.style.display="none";

return;

}

const suggestions=

products

.filter(product=>

product.name

.toLowerCase()

.includes(keyword)

)

.slice(0,8);

if(suggestions.length===0){

container.style.display="none";

return;

}

suggestions.forEach(product=>{

container.innerHTML+=`

<div

class="search-suggestion"

data-id="${product.id}"

data-name="${product.name}">

<i class="fa-solid fa-magnifying-glass"></i>

<span>${product.name}</span>

</div>

`;

});

container.style.display="block";

}

/*=========================================
TRENDING SEARCHES
=========================================*/

function renderTrendingSearches(){

const container=

document.querySelector("#trendingSearches");

if(!container)return;

container.innerHTML="";

searchHistory

.slice(0,5)

.forEach(item=>{

container.innerHTML+=`

<button

class="trending-search"

data-key="${item}">

${item}

</button>

`;

});

}

/*=========================================
SEARCH INPUT EVENTS
=========================================*/

if(searchInput){

searchInput.addEventListener(

"input",

function(){

const value=this.value;

debounceSearch(function(){

searchFilters.keyword=value;

performSearch();

renderSuggestions(value);

});

});

}

/*=========================================
SUGGESTION EVENTS
=========================================*/

document.addEventListener(

"click",

function(event){

const suggestion=

event.target.closest(

".search-suggestion"

);

if(suggestion){

const keyword=

suggestion.dataset.name;

searchInput.value=keyword;

searchFilters.keyword=keyword;

performSearch();

addSearchHistory(keyword);

document.querySelector(

"#searchSuggestions"

).style.display="none";

}

const trending=

event.target.closest(

".trending-search"

);

if(trending){

const keyword=

trending.dataset.key;

searchInput.value=keyword;

searchFilters.keyword=keyword;

performSearch();

}

});

/*=========================================
HIDE SUGGESTIONS
=========================================*/

document.addEventListener(

"click",

function(event){

const suggestions=

document.querySelector(

"#searchSuggestions"

);

if(

suggestions &&

!event.target.closest(

".search-box"

)

){

suggestions.style.display="none";

}

});

/*=========================================
INITIALIZE SMART SEARCH
=========================================*/

document.addEventListener(

"DOMContentLoaded",

function(){

renderTrendingSearches();

});
