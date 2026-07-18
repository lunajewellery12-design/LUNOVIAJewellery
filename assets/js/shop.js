/* ==========================================================
   LUNOVIA SHOP MANAGER
========================================================== */

'use strict';

const ShopManager = {

    products: [],

    filteredProducts: [],

    currentPage: 1,

    productsPerPage: 12,

    currentView: 'grid',

    filters: {

        search: '',

        category: [],

        maxPrice: 5000,

        rating: 0,

        inStock: false,

        onSale: false,

        newArrival: false,

        sort: 'default'

    },

    async init() {

        await this.loadProducts();

        this.cacheElements();

        this.bindEvents();

        this.applyFilters();

    },

    async loadProducts() {

        try {

            const response = await fetch('assets/data/products.json');

            this.products = await response.json();

            this.filteredProducts = [...this.products];

        }

        catch (error) {

            console.error('Products Load Error:', error);

        }

    },

    cacheElements() {

        this.productsGrid = document.getElementById('productsGrid');

        this.productsCount = document.getElementById('productsCount');

        this.pagination = document.getElementById('shopPagination');

        this.loading = document.getElementById('loadingProducts');

        this.empty = document.getElementById('emptyProducts');

        this.searchInput = document.getElementById('shopSearch');

        this.priceRange = document.getElementById('priceRange');

        this.priceValue = document.getElementById('priceValue');

        this.sortSelect = document.getElementById('sortProducts');

        this.gridButton = document.getElementById('gridView');

        this.listButton = document.getElementById('listView');

    },

    bindEvents() {

        if (this.searchInput) {

            this.searchInput.addEventListener('input', e => {

                this.filters.search = e.target.value.toLowerCase();

                this.applyFilters();

            });

        }

        if (this.priceRange) {

            this.priceRange.addEventListener('input', e => {

                this.filters.maxPrice = Number(e.target.value);

                this.priceValue.textContent = '$' + e.target.value;

                this.applyFilters();

            });

        }

        if (this.sortSelect) {

            this.sortSelect.addEventListener('change', e => {

                this.filters.sort = e.target.value;

                this.applyFilters();

            });

        }

        if (this.gridButton) {

            this.gridButton.addEventListener('click', () => {

                this.changeView('grid');

            });

        }

        if (this.listButton) {

            this.listButton.addEventListener('click', () => {

                this.changeView('list');

            });

        }

    },

      applyFilters() {

        this.filteredProducts = this.products.filter(product => {

            /* Search */

            if (this.filters.search) {

                const keyword = this.filters.search;

                const matched =

                    product.name.toLowerCase().includes(keyword) ||

                    product.category.toLowerCase().includes(keyword) ||

                    (product.description || '')
                        .toLowerCase()
                        .includes(keyword);

                if (!matched) return false;

            }

            /* Categories */

            if (this.filters.category.length > 0) {

                if (!this.filters.category.includes(product.category)) {

                    return false;

                }

            }

            /* Price */

            if (Number(product.price) > this.filters.maxPrice) {

                return false;

            }

            /* Rating */

            if (this.filters.rating > 0) {

                if ((product.rating || 0) < this.filters.rating) {

                    return false;

                }

            }

            /* Availability */

            if (this.filters.inStock && !product.inStock) {

                return false;

            }

            if (this.filters.onSale && !product.sale) {

                return false;

            }

            if (this.filters.newArrival && !product.newArrival) {

                return false;

            }

            return true;

        });

        this.sortProducts();

        this.renderProducts();

    },

    sortProducts() {

        switch (this.filters.sort) {

            case "latest":

                this.filteredProducts.sort((a, b) => b.id - a.id);

                break;

            case "popular":

                this.filteredProducts.sort(

                    (a, b) => (b.sales || 0) - (a.sales || 0)

                );

                break;

            case "rating":

                this.filteredProducts.sort(

                    (a, b) => (b.rating || 0) - (a.rating || 0)

                );

                break;

            case "price-low":

                this.filteredProducts.sort(

                    (a, b) => Number(a.price) - Number(b.price)

                );

                break;

            case "price-high":

                this.filteredProducts.sort(

                    (a, b) => Number(b.price) - Number(a.price)

                );

                break;

            case "name":

                this.filteredProducts.sort(

                    (a, b) => a.name.localeCompare(b.name)

                );

                break;

        }

    },

    renderProducts() {

        if (!this.productsGrid) return;

        this.loading.style.display = "none";

        if (this.filteredProducts.length === 0) {

            this.productsGrid.innerHTML = "";

            this.empty.style.display = "block";

            this.productsCount.textContent = "Showing 0 Products";

            return;

        }

        this.empty.style.display = "none";

        const start =

            (this.currentPage - 1) *

            this.productsPerPage;

        const end =

            start + this.productsPerPage;

        const pageProducts =

            this.filteredProducts.slice(start, end);

        this.productsGrid.innerHTML = pageProducts

            .map(product => this.createProductCard(product))

            .join("");

        this.productsCount.textContent =

            `Showing ${this.filteredProducts.length} Products`;

        this.renderPagination();

    },

      createProductCard(product) {

        const badge = product.sale
            ? '<span class="product-badge sale">Sale</span>'
            : product.newArrival
            ? '<span class="product-badge new">New</span>'
            : '';

        const stars = this.renderStars(product.rating || 5);

        return `

        <article class="product-card">

            ${badge}

            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy">

                <div class="product-actions">

                    <button
                        class="quick-view-btn"
                        data-id="${product.id}"
                        title="Quick View">

                        <i class="fa-solid fa-eye"></i>

                    </button>

                    <button
                        class="wishlist-btn"
                        data-id="${product.id}"
                        title="Wishlist">

                        <i class="fa-regular fa-heart"></i>

                    </button>

                    <button
                        class="compare-btn"
                        data-id="${product.id}"
                        title="Compare">

                        <i class="fa-solid fa-code-compare"></i>

                    </button>

                </div>

            </div>

            <div class="product-content">

                <span class="product-category">

                    ${product.category}

                </span>

                <h3>

                    ${product.name}

                </h3>

                <div class="product-rating">

                    ${stars}

                </div>

                <div class="product-price">

                    $${Number(product.price).toFixed(2)}

                </div>

                <button
                    class="btn btn-primary add-cart-btn"
                    data-id="${product.id}">

                    <i class="fa-solid fa-bag-shopping"></i>

                    Add To Cart

                </button>

            </div>

        </article>

        `;

    },

    renderStars(rating = 5) {

        let html = "";

        for (let i = 1; i <= 5; i++) {

            html += i <= Math.round(rating)

                ? '<i class="fa-solid fa-star"></i>'

                : '<i class="fa-regular fa-star"></i>';

        }

        return html;

    },

    renderPagination() {

        if (!this.pagination) return;

        const totalPages = Math.ceil(

            this.filteredProducts.length /

            this.productsPerPage

        );

        let html = "";

        for (let i = 1; i <= totalPages; i++) {

            html += `

            <button
                class="page-btn ${i === this.currentPage ? 'active' : ''}"
                data-page="${i}">

                ${i}

            </button>

            `;

        }

        this.pagination.innerHTML = html;

        this.pagination.querySelectorAll(".page-btn")

            .forEach(button => {

                button.addEventListener("click", () => {

                    this.currentPage = Number(button.dataset.page);

                    this.renderProducts();

                    window.scrollTo({

                        top: 0,

                        behavior: "smooth"

                    });

                });

            });

    },

    changeView(view) {

        this.currentView = view;

        this.productsGrid.classList.toggle(

            "list-view",

            view === "list"

        );

        this.gridButton.classList.toggle(

            "active",

            view === "grid"

        );

        this.listButton.classList.toggle(

            "active",

            view === "list"

        );

    }

};

document.addEventListener("DOMContentLoaded", () => {

    ShopManager.init();

});
