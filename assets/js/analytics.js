/*==================================================
LUNOVIA ANALYTICS
Version 1.0
==================================================*/

"use strict";

/*==================================================
LOCAL STORAGE KEYS
==================================================*/

const ANALYTICS_STORAGE=

"lunovia_analytics";

/*==================================================
GLOBAL VARIABLES
==================================================*/

let analytics={

pageViews:0,

productViews:0,

cartAdds:0,

wishlistAdds:0,

orders:0,

revenue:0,

searches:0,

sessions:0,

lastVisit:null,

events:[]

};

/*==================================================
INITIALIZE
==================================================*/

document.addEventListener(

"DOMContentLoaded",

initializeAnalytics

);

function initializeAnalytics(){

loadAnalytics();

registerSession();

trackPageView();

saveAnalytics();

}

/*==================================================
LOAD
==================================================*/

function loadAnalytics(){

analytics=

JSON.parse(

localStorage.getItem(

ANALYTICS_STORAGE

)

)||analytics;

}

/*==================================================
SAVE
==================================================*/

function saveAnalytics(){

localStorage.setItem(

ANALYTICS_STORAGE,

JSON.stringify(

analytics

)

);

}
/*==================================================
EVENT TRACKING
Version 1.1
==================================================*/

/*=========================================
REGISTER SESSION
=========================================*/

function registerSession(){

analytics.sessions++;

analytics.lastVisit=

new Date()

.toISOString();

trackEvent(

"session_start",

{

page:

window.location.pathname

}

);

}

/*=========================================
PAGE VIEW
=========================================*/

function trackPageView(){

analytics.pageViews++;

trackEvent(

"page_view",

{

page:

window.location.pathname,

title:

document.title

}

);

}

/*=========================================
PRODUCT VIEW
=========================================*/

function trackProductView(

productId

){

analytics.productViews++;

trackEvent(

"product_view",

{

productId

}

);

saveAnalytics();

}

/*=========================================
ADD TO CART
=========================================*/

function trackCartAdd(

productId,

quantity=1

){

analytics.cartAdds++;

trackEvent(

"cart_add",

{

productId,

quantity

}

);

saveAnalytics();

}

/*=========================================
ADD TO WISHLIST
=========================================*/

function trackWishlistAdd(

productId

){

analytics.wishlistAdds++;

trackEvent(

"wishlist_add",

{

productId

}

);

saveAnalytics();

}

/*=========================================
SEARCH
=========================================*/

function trackSearch(

keyword

){

analytics.searches++;

trackEvent(

"search",

{

keyword

}

);

saveAnalytics();

}

/*=========================================
ORDER
=========================================*/

function trackOrder(

order

){

analytics.orders++;

analytics.revenue+=

Number(

order.total||0

);

trackEvent(

"order_completed",

{

orderId:

order.id,

total:

order.total

}

);

saveAnalytics();

}
/*==================================================
EVENT LOG & REPORTS
Version 1.2
==================================================*/

/*=========================================
TRACK EVENT
=========================================*/

function trackEvent(

name,

data={}

){

analytics.events.unshift({

id:Date.now(),

name,

data,

page:

window.location.pathname,

timestamp:

new Date().toISOString()

});

if(

analytics.events.length>

1000

){

analytics.events=

analytics.events.slice(

0,

1000

);

}

saveAnalytics();

}

/*=========================================
GET EVENTS
=========================================*/

function getEvents(){

return analytics.events;

}

/*=========================================
MOST VISITED PAGES
=========================================*/

function getMostVisitedPages(){

const pages={};

analytics.events

.filter(event=>

event.name===

"page_view"

)

.forEach(event=>{

pages[event.page]=

(pages[event.page]||0)+1;

});

return Object.entries(pages)

.sort(

(a,b)=>b[1]-a[1]

);

}

/*=========================================
MOST VIEWED PRODUCTS
=========================================*/

function getMostViewedProducts(){

const products={};

analytics.events

.filter(event=>

event.name===

"product_view"

)

.forEach(event=>{

const id=

event.data.productId;

products[id]=

(products[id]||0)+1;

});

return Object.entries(products)

.sort(

(a,b)=>b[1]-a[1]

);

}

/*=========================================
EXPORT ANALYTICS
=========================================*/

function exportAnalytics(){

const blob=

new Blob(

[

JSON.stringify(

analytics,

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

"lunovia-analytics.json";

link.click();

URL.revokeObjectURL(

url

);

}

/*=========================================
RESET ANALYTICS
=========================================*/

function resetAnalytics(){

if(

!confirm(

"Reset analytics data?"

)

){

return;

}

localStorage.removeItem(

ANALYTICS_STORAGE

);

location.reload();

  }
/*==================================================
ANALYTICS DASHBOARD
Version 1.3
==================================================*/

/*=========================================
RENDER DASHBOARD
=========================================*/

function renderAnalyticsDashboard(){

setAnalyticsValue(

"analyticsPageViews",

analytics.pageViews

);

setAnalyticsValue(

"analyticsProductViews",

analytics.productViews

);

setAnalyticsValue(

"analyticsCartAdds",

analytics.cartAdds

);

setAnalyticsValue(

"analyticsWishlistAdds",

analytics.wishlistAdds

);

setAnalyticsValue(

"analyticsOrders",

analytics.orders

);

setAnalyticsValue(

"analyticsRevenue",

"$"+

Number(

analytics.revenue

).toFixed(2)

);

setAnalyticsValue(

"analyticsSearches",

analytics.searches

);

setAnalyticsValue(

"analyticsSessions",

analytics.sessions

);

renderTopPages();

renderTopProducts();

}

/*=========================================
SET VALUE
=========================================*/

function setAnalyticsValue(

id,

value

){

const element=

document.getElementById(

id

);

if(element){

element.textContent=

value;

}

}

/*=========================================
TOP PAGES
=========================================*/

function renderTopPages(){

const container=

document.getElementById(

"analyticsTopPages"

);

if(!container){

return;

}

container.innerHTML="";

getMostVisitedPages()

.slice(0,10)

.forEach(page=>{

container.innerHTML+=`

<li>

<span>${page[0]}</span>

<strong>${page[1]}</strong>

</li>

`;

});

}

/*=========================================
TOP PRODUCTS
=========================================*/

function renderTopProducts(){

const container=

document.getElementById(

"analyticsTopProducts"

);

if(!container){

return;

}

container.innerHTML="";

getMostViewedProducts()

.slice(0,10)

.forEach(product=>{

container.innerHTML+=`

<li>

<span>${product[0]}</span>

<strong>${product[1]}</strong>

</li>

`;

});

}

/*=========================================
REFRESH
=========================================*/

function refreshAnalytics(){

loadAnalytics();

renderAnalyticsDashboard();

}

/*=========================================
AUTO REFRESH
=========================================*/

setInterval(

refreshAnalytics,

30000

);

document.addEventListener(

"DOMContentLoaded",

renderAnalyticsDashboard

);
