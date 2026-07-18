/*==================================================
LUNOVIA MAIN JAVASCRIPT
Version 1.0
==================================================*/

"use strict";

/*==================================================
GLOBAL VARIABLES
==================================================*/

const body=document.body;

const header=document.querySelector("#header");

const mobileMenu=document.querySelector("#mobileMenu");

const mobileMenuButton=document.querySelector("#mobileMenuBtn");

const closeMobileMenu=document.querySelector("#closeMobileMenu");

const searchOverlay=document.querySelector("#searchOverlay");

const searchButton=document.querySelector("#searchBtn");

const closeSearch=document.querySelector("#closeSearch");

const backToTop=document.querySelector("#backToTop");

const heroSlider=document.querySelector("#heroSlider");

const heroSlides=document.querySelectorAll(".hero-slide");

const heroPagination=document.querySelectorAll(

".hero-pagination span"

);

const heroNext=document.querySelector("#heroNext");

const heroPrev=document.querySelector("#heroPrev");

let currentSlide=0;

let sliderInterval=null;

/*==================================================
INITIALIZE
==================================================*/

document.addEventListener(

"DOMContentLoaded",

initializeWebsite

);

function initializeWebsite(){

initializePreloader();

initializeHeader();

initializeMobileMenu();

initializeSearch();

initializeHeroSlider();

initializeBackToTop();

initializeNewsletter();

}

/*==================================================
PRELOADER
==================================================*/

function initializePreloader(){

const preloader=document.querySelector("#preloader");

if(!preloader)return;

window.addEventListener(

"load",

function(){

preloader.classList.add("hide");

setTimeout(function(){

preloader.remove();

},500);

}

);

}

/*==================================================
HEADER
==================================================*/

function initializeHeader(){

window.addEventListener(

"scroll",

function(){

if(!header)return;

if(window.scrollY>60){

header.classList.add("sticky");

}else{

header.classList.remove("sticky");

}

}

);

}
/*==================================================
MOBILE MENU
Version 1.1
==================================================*/

function initializeMobileMenu(){

if(!mobileMenu)return;

if(mobileMenuButton){

mobileMenuButton.addEventListener(

"click",

openMobileMenu

);

}

if(closeMobileMenu){

closeMobileMenu.addEventListener(

"click",

closeMenu

);

}

const overlay=

mobileMenu.querySelector(

".mobile-menu-overlay"

);

if(overlay){

overlay.addEventListener(

"click",

closeMenu

);

}

document.addEventListener(

"keydown",

function(event){

if(event.key==="Escape"){

closeMenu();

}

}

);

}

function openMobileMenu(){

mobileMenu.classList.add(

"active"

);

body.classList.add(

"menu-open"

);

}

function closeMenu(){

mobileMenu.classList.remove(

"active"

);

body.classList.remove(

"menu-open"

);

}

/*==================================================
SEARCH OVERLAY
Version 1.2
==================================================*/

function initializeSearch(){

if(searchButton){

searchButton.addEventListener(

"click",

openSearch

);

}

if(closeSearch){

closeSearch.addEventListener(

"click",

closeSearchOverlay

);

}

if(searchOverlay){

searchOverlay.addEventListener(

"click",

function(event){

if(event.target===searchOverlay){

closeSearchOverlay();

}

}

);

}

document.addEventListener(

"keydown",

function(event){

if(event.key==="Escape"){

closeSearchOverlay();

}

}

);

}

function openSearch(){

if(!searchOverlay)return;

searchOverlay.classList.add(

"active"

);

body.classList.add(

"search-open"

);

const input=

document.querySelector(

"#searchInput"

);

if(input){

setTimeout(function(){

input.focus();

},150);

}

}

function closeSearchOverlay(){

if(!searchOverlay)return;

searchOverlay.classList.remove(

"active"

);

body.classList.remove(

"search-open"

);

}

/*==================================================
BACK TO TOP
Version 1.3
==================================================*/

function initializeBackToTop(){

if(!backToTop)return;

window.addEventListener(

"scroll",

function(){

if(window.scrollY>400){

backToTop.classList.add(

"show"

);

}else{

backToTop.classList.remove(

"show"

);

}

}

);

backToTop.addEventListener(

"click",

function(){

window.scrollTo({

top:0,

behavior:"smooth"

});

}

);

}
/*==================================================
HERO SLIDER
Version 1.4
==================================================*/

function initializeHeroSlider(){

if(!heroSlider)return;

if(heroSlides.length===0)return;

showSlide(0);

startSlider();

if(heroNext){

heroNext.addEventListener(

"click",

nextSlide

);

}

if(heroPrev){

heroPrev.addEventListener(

"click",

previousSlide

);

}

heroPagination.forEach(

function(dot,index){

dot.addEventListener(

"click",

function(){

showSlide(index);

restartSlider();

}

);

}

);

heroSlider.addEventListener(

"mouseenter",

stopSlider

);

heroSlider.addEventListener(

"mouseleave",

startSlider

);

initializeSliderTouch();

}

/*=========================================
SHOW SLIDE
=========================================*/

function showSlide(index){

if(index>=heroSlides.length){

index=0;

}

if(index<0){

index=heroSlides.length-1;

}

heroSlides.forEach(

slide=>{

slide.classList.remove(

"active"

);

}

);

heroPagination.forEach(

dot=>{

dot.classList.remove(

"active"

);

}

);

heroSlides[index].classList.add(

"active"

);

if(heroPagination[index]){

heroPagination[index].classList.add(

"active"

);

}

currentSlide=index;

}

/*=========================================
NEXT
=========================================*/

function nextSlide(){

showSlide(

currentSlide+1

);

}

/*=========================================
PREVIOUS
=========================================*/

function previousSlide(){

showSlide(

currentSlide-1

);

}

/*=========================================
AUTO PLAY
=========================================*/

function startSlider(){

stopSlider();

sliderInterval=

setInterval(

nextSlide,

5000

);

}

function stopSlider(){

if(sliderInterval){

clearInterval(

sliderInterval

);

sliderInterval=null;

}

}

function restartSlider(){

stopSlider();

startSlider();

}

/*=========================================
TOUCH SUPPORT
=========================================*/

function initializeSliderTouch(){

let startX=0;

let endX=0;

heroSlider.addEventListener(

"touchstart",

function(event){

startX=

event.touches[0].clientX;

},

{

passive:true

}

);

heroSlider.addEventListener(

"touchend",

function(event){

endX=

event.changedTouches[0].clientX;

handleSwipe();

},

{

passive:true

}

);

function handleSwipe(){

const distance=

startX-endX;

if(Math.abs(distance)<50){

return;

}

if(distance>0){

nextSlide();

}else{

previousSlide();

}

restartSlider();

}

  }
/*==================================================
TOAST NOTIFICATIONS
Version 1.5
==================================================*/

function showToast(message,type="info"){

const container=

document.querySelector(

"#toastContainer"

);

if(!container)return;

const toast=

document.createElement(

"div"

);

toast.className=

`toast toast-${type}`;

toast.innerHTML=`

<div class="toast-content">

<span>${message}</span>

</div>

`;

container.appendChild(

toast

);

requestAnimationFrame(function(){

toast.classList.add(

"show"

);

});

setTimeout(function(){

toast.classList.remove(

"show"

);

setTimeout(function(){

toast.remove();

},300);

},3000);

}

/*==================================================
NEWSLETTER
==================================================*/

function initializeNewsletter(){

const form=

document.querySelector(

"#newsletterForm"

);

if(!form)return;

form.addEventListener(

"submit",

function(event){

event.preventDefault();

const email=

document.querySelector(

"#newsletterEmail"

);

if(!email)return;

const value=

email.value.trim();

if(value===""){

showToast(

"Please enter your email",

"warning"

);

return;

}

showToast(

"Subscription successful",

"success"

);

form.reset();

}

);

}

/*==================================================
LAZY LOADING
==================================================*/

function initializeLazyLoading(){

const images=

document.querySelectorAll(

"img[data-src]"

);

if(images.length===0)return;

const observer=

new IntersectionObserver(

function(entries){

entries.forEach(function(entry){

if(!entry.isIntersecting){

return;

}

const image=

entry.target;

image.src=

image.dataset.src;

image.removeAttribute(

"data-src"

);

observer.unobserve(

image

);

});

}

);

images.forEach(function(image){

observer.observe(image);

});

}

/*==================================================
SCROLL ANIMATIONS
==================================================*/

function initializeAnimations(){

const elements=

document.querySelectorAll(

".fade-up"

);

if(elements.length===0)return;

const observer=

new IntersectionObserver(

function(entries){

entries.forEach(function(entry){

if(entry.isIntersecting){

entry.target.classList.add(

"visible"

);

observer.unobserve(

entry.target

);

}

});

},

{

threshold:0.2

}

);

elements.forEach(function(element){

observer.observe(

element

);

});

}

/*==================================================
WINDOW LOAD
==================================================*/

window.addEventListener(

"load",

function(){

initializeLazyLoading();

initializeAnimations();

});

/*==================================================
GLOBAL HELPERS
==================================================*/

function $(selector){

return document.querySelector(

selector

);

}

function $$(selector){

return document.querySelectorAll(

selector

);

}

/*==================================================
END OF FILE
==================================================*/

console.log(

"LUNOVIA Main.js Loaded Successfully"

);

/* ==========================================
   LUNOVIA Header Loader
========================================== */

function loadHeader() {

    const header = document.getElementById("header");

    if (!header) return;

    header.innerHTML = `
<header class="main-header">

    <div class="container">

        <div class="header-inner">

            <a href="index.html"
               class="logo">

                <img src="assets/images/logo.png"
                     alt="LUNOVIA Jewellery">

            </a>

            <nav class="main-nav"
                 id="mainNav">

                <ul class="nav-list">

                    <li class="nav-item">

                        <a href="index.html"
                           class="nav-link">

                            Home

                        </a>

                    </li>

                    <li class="nav-item mega-parent has-mega-menu">

                        <a href="shop.html"
                           class="nav-link">

                            Shop

                            <i class="fa-solid fa-chevron-down"></i>

                        </a>

                                                <div class="mega-menu">

                            <div class="mega-grid">

                                <!-- Categories -->

                                <div class="mega-column">

                                    <h4>

                                        Categories

                                    </h4>

                                    <ul>

                                        <li>

                                            <a href="shop.html?category=rings">

                                                Rings

                                            </a>

                                        </li>

                                        <li>

                                            <a href="shop.html?category=necklaces">

                                                Necklaces

                                            </a>

                                        </li>

                                        <li>

                                            <a href="shop.html?category=bracelets">

                                                Bracelets

                                            </a>

                                        </li>

                                        <li>

                                            <a href="shop.html?category=earrings">

                                                Earrings

                                            </a>

                                        </li>

                                    </ul>

                                </div>

                                <!-- Collections -->

                                <div class="mega-column">

                                    <h4>

                                        Collections

                                    </h4>

                                    <ul>

                                        <li>

                                            <a href="collections.html">

                                                Luxury Collection

                                            </a>

                                        </li>

                                        <li>

                                            <a href="collections.html">

                                                Wedding Collection

                                            </a>

                                        </li>

                                        <li>

                                            <a href="collections.html">

                                                Diamond Collection

                                            </a>

                                        </li>

                                        <li>

                                            <a href="collections.html">

                                                New Arrivals

                                            </a>

                                        </li>

                                    </ul>

                                </div>

                                                                <!-- Customer -->

                                <div class="mega-column">

                                    <h4>

                                        Customer

                                    </h4>

                                    <ul>

                                        <li>

                                            <a href="wishlist.html">

                                                Wishlist

                                            </a>

                                        </li>

                                        <li>

                                            <a href="cart.html">

                                                Shopping Cart

                                            </a>

                                        </li>

                                        <li>

                                            <a href="profile.html">

                                                My Account

                                            </a>

                                        </li>

                                        <li>

                                            <a href="contact.html">

                                                Support

                                            </a>

                                        </li>

                                    </ul>

                                </div>

                                <!-- Banner -->

                                <div class="mega-banner">

                                    <img src="assets/images/menu/menu-banner.webp"
                                         alt="Luxury Jewellery">

                                    <div class="mega-banner-content">

                                        <span>

                                            Exclusive

                                        </span>

                                        <h3>

                                            Luxury Collection

                                        </h3>

                                        <a href="shop.html"
                                           class="btn btn-primary">

                                            Shop Now

                                        </a>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </li>

                    <li class="nav-item">

                        <a href="collections.html"
                           class="nav-link">

                            Collections

                        </a>

                    </li>

                    <li class="nav-item">

                        <a href="about.html"
                           class="nav-link">

                            About

                        </a>

                    </li>

                    <li class="nav-item">

                        <a href="contact.html"
                           class="nav-link">

                            Contact

                        </a>

                    </li>

                </ul>

            </nav>

                        <!-- =========================
                 HEADER ACTIONS
            ========================== -->

            <div class="header-actions">

                <!-- Search -->

                <button class="icon-btn"
                        id="searchBtn"
                        aria-label="Search">

                    <i class="fa-solid fa-magnifying-glass"></i>

                </button>

                <!-- Theme -->

                <button class="icon-btn"
                        id="themeToggle"
                        aria-label="Toggle Theme">

                    <i class="fa-solid fa-moon"></i>

                </button>

                <!-- Language -->

                <button class="icon-btn"
                        id="languageToggle"
                        aria-label="Language">

                    EN

                </button>

                <!-- Wishlist -->

                <a href="wishlist.html"
                   class="icon-btn wishlist-btn">

                    <i class="fa-regular fa-heart"></i>

                    <span id="wishlistCount">

                        0

                    </span>

                </a>

                <!-- Cart -->

                <a href="cart.html"
                   class="icon-btn cart-btn">

                    <i class="fa-solid fa-bag-shopping"></i>

                    <span id="cartCount">

                        0

                    </span>

                </a>

                <!-- User -->

                <div class="user-menu"
                     id="userMenu">

                    <button class="icon-btn"
                            id="userMenuBtn">

                        <i class="fa-regular fa-user"></i>

                    </button>

                    <div class="user-dropdown"
                         id="userDropdown">

                        <a href="login.html">

                            Login

                        </a>

                        <a href="register.html">

                            Register

                        </a>

                        <a href="profile.html">

                            Profile

                        </a>

                        <a href="orders.html">

                            Orders

                        </a>

                        <a href="admin.html"
                           id="adminLink"
                           style="display:none;">

                            Admin Dashboard

                        </a>

                        <button id="logoutBtn"
                                class="dropdown-btn">

                            Logout

                        </button>

                    </div>

                </div>

                <!-- Mobile -->

                <button class="icon-btn mobile-menu-btn"
                        id="mobileMenuBtn"
                        aria-label="Open Menu">

                    <i class="fa-solid fa-bars"></i>

                </button>

            </div>

        </div>

    </div>

</header>
    `;

}

/* ==========================================
   Initialize Shared Layout
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    loadHeader();

});
