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
RENDER PRODUCTS
==================================================*/

function renderProducts(products,container){

    if(!container){

        return;

    }

    if(products.length===0){

        container.innerHTML=`

        <div class="empty-products">

            <h3>

                No products found

            </h3>

        </div>

        `;

        return;

    }

    container.innerHTML=

    products

    .map(

        product=>

        createProductCard(product)

    )

    .join("");

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
