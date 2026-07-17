/*==================================================
LUNOVIA PRODUCTS MANAGER
Version 2.0
==================================================*/

"use strict";

/*==================================================
GLOBAL VARIABLES
==================================================*/

let allProducts = [];

let filteredProducts = [];

let currentProduct = null;

let currentPage = 1;

const productsPerPage = 8;

/*==================================================
DOM
==================================================*/

const productsContainer =
document.getElementById(
"productsGrid"
);

const featuredContainer =
document.getElementById(
"featuredProducts"
);

const pagination =
document.getElementById(
"pagination"
);

const template =
document.getElementById(
"productCardTemplate"
);

/*==================================================
INITIALIZE
==================================================*/

document.addEventListener(
"DOMContentLoaded",
initializeProducts
);

async function initializeProducts(){

    await loadProducts();

    detectCurrentPage();

}

/*==================================================
LOAD PRODUCTS
==================================================*/

async function loadProducts(){

    try{

        const response =
        await fetch(
        "assets/data/products.json"
        );

        if(!response.ok){

            throw new Error(
            "Products not found."
            );

        }

        allProducts =
        await response.json();

        filteredProducts =
        [...allProducts];

    }

    catch(error){

        console.error(
        error
        );

        allProducts = [];

        filteredProducts = [];

    }

}

/*==================================================
PAGE DETECTOR
==================================================*/

function detectCurrentPage(){

    if(featuredContainer){

        renderFeaturedProducts();

    }

    if(productsContainer){

        renderShopProducts();

    }

}
/*==================================================
PRODUCT CARD
==================================================*/

function createProductCard(product){

    return `

    <article class="product-card">

        <div class="product-image">

            <img
            src="${product.image}"
            alt="${product.name}"
            loading="lazy">

            ${
            product.badge
            ?
            `<span class="product-badge">${product.badge}</span>`
            :
            ""
            }

        </div>

        <div class="product-content">

            <span class="product-category">
                ${product.category}
            </span>

            <h3 class="product-title">
                ${product.name}
            </h3>

            <div class="product-price">

                <span class="current-price">
                    $${product.price}
                </span>

                ${
                product.oldPrice
                ?
                `<span class="old-price">$${product.oldPrice}</span>`
                :
                ""
                }

            </div>

            <div class="product-rating">

                ⭐ ${product.rating}

                <span>

                    (${product.reviews})

                </span>

            </div>

            <div class="product-actions">

                <button
                class="btn btn-primary"
                onclick="viewProduct(${product.id})">

                    View

                </button>

                <button
                class="btn btn-outline"
                onclick="addToCart(${product.id})">

                    Add to Cart

                </button>

            </div>

        </div>

    </article>

    `;

}

/*==================================================
PAGINATION
==================================================*/

function renderPagination(){

    if(!pagination){

        return;

    }

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

    for(

        let page=1;

        page<=totalPages;

        page++

    ){

        html+=`

        <button

        class="page-btn ${page===currentPage?"active":""}"

        onclick="goToPage(${page})">

            ${page}

        </button>

        `;

    }

    pagination.innerHTML=html;

}

function goToPage(page){

    currentPage=page;

    renderShopProducts();

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}

/*==================================================
PRODUCT DETAILS
==================================================*/

function getProductById(id){

    return allProducts.find(

        product=>

        Number(product.id)===Number(id)

    );

}

function viewProduct(id){

    window.location.href=

    `product.html?id=${id}`;

}

/*==================================================
ADD TO CART
==================================================*/

function addToCart(id){

    const product=

    getProductById(id);

    if(!product){

        return;

    }

    let cart=

    StorageManager

    .CartStorage

    .get();

    const existing=

    cart.find(

        item=>

        Number(item.id)===

        Number(id)

    );

    if(existing){

        existing.quantity++;

    }else{

        cart.push({

            id:product.id,

            quantity:1

        });

    }

    StorageManager

    .CartStorage

    .save(cart);

    if(

        typeof showToast===

        "function"

    ){

        showToast(

            "Added to cart",

            "success"

        );

    }

}
/*==================================================
FEATURED PRODUCTS
==================================================*/

function renderFeaturedProducts(){

    const featured =

    allProducts.filter(

        product=>product.featured

    );

    renderProducts(

        featured,

        featuredContainer

    );

}

/*==================================================
SHOP PRODUCTS
==================================================*/

function renderShopProducts(){

    const start =

    (currentPage-1)

    *

    productsPerPage;

    const end=

    start+

    productsPerPage;

    const pageProducts=

    filteredProducts.slice(

        start,

        end

    );

    renderProducts(

        pageProducts,

        productsContainer

    );

    renderPagination();

}
