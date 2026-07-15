// روابط لصور مجوهرات حقيقية وفخمة ومتنوعة لضمان عدم التكرار والتشابه
const luxuryImages = [
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80", // لؤلؤ وذهب
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80", // قلائد ملكية
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80", // خواتم ألماس
    "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=600&auto=format&fit=crop&q=80", // أساور فاخرة
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&auto=format&fit=crop&q=80", // أطقم الياقوت والزمرد
    "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&auto=format&fit=crop&q=80", // أقراط ماسية دقيقة
    "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&auto=format&fit=crop&q=80"  // تشكيلة كلاسيكية نادرة
];

// سحب المنتجات المخزنة بمفتاح Lunovia الجديد
let products = JSON.parse(localStorage.getItem('lunovia_products')) || [];

// تصنيفات المنتجات الفاخرة
const categories = ["الكل", "خواتم", "قلائد", "أساور", "أقراط"];

// توليد المنتجات الافتراضية المتنوعة بفخامة عند زيارة الموقع لأول مرة
if (products.length === 0) {
    const baseNames = [
        "خاتم السوليتير الملكي الرائع",
        "عقد هلال Lunovia المضيء", 
        "سوار الذهب المصقول عيار 18", 
        "أقراط الياقوت الهادئ والنقي"
    ];
    const slogans = [
        "تألق ملكي فريد يجذب الأنظار في هدوء تام ورقي مطلق",
        "قصة عشق أبدية من الذهب الخالص المستوحى من بريق القمر",
        "سوار مصقول بعناية ليعكس جمال معصمك الفاتن",
        "لمسات راقية تفيض بالنعومة والدلال والجاذبية اللامعة"
    ];
    
    // ربط التصنيفات بالترتيب مع الأسماء
    const mappedCategories = ["خواتم", "قلائد", "أساور", "أقراط"];
    
    // توليد 70 قطعة فريدة بصور متبادلة غير متشابهة
    for (let i = 1; i <= 70; i++) {
        const index = i % 4;
        products.push({
            id: i,
            name: `${baseNames[index]} - موديل ${i}`,
            slogan: slogans[index],
            category: mappedCategories[index],
            price: 1500 + (i * 50), // السعر بالجنيه المصري بتدرج فخم
            img: luxuryImages[i % luxuryImages.length] // توزيع الصور بالتتابع
        });
    }
    localStorage.setItem('lunovia_products', JSON.stringify(products));
}

let cart = [];
let activeCategory = "الكل";

// عرض بار الأقسام بشكل مرن وأنيق
function renderCategoryBar() {
    const container = document.getElementById('category-bar-container');
    if (!container) return;
    
    container.innerHTML = categories.map(cat => `
        <button class="category-btn ${activeCategory === cat ? 'active' : ''}" onclick="filterCategory('${cat}')">
            ${cat}
        </button>
    `).join('');
}

// تصفية المنتجات حسب القسم
function filterCategory(category) {
    activeCategory = category;
    renderCategoryBar();
    renderStore();
}

// عرض المنتجات في المتجر متوافق بالكامل مع كلاسات الـ CSS الفخمة المحدثة
function renderStore() {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    // تصفية المنتجات بناءً على القسم النشط
    const filteredProducts = activeCategory === "الكل" 
        ? products 
        : products.filter(p => p.category === activeCategory);
    
    if (filteredProducts.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:var(--text-muted); padding:40px;">لا توجد قطع معروضة في هذا القسم حالياً...</p>`;
        return;
    }

    // هنا تكمن قوة الإصلاح: استخدام .product-card ووسم img الفعلي بدلاً من الـ div الخلفي القديم لضمان تفعيل الـ CSS الفخم
    container.innerHTML = filteredProducts.map(p => `
        <div class="product-card">
            <img src="${p.img}" alt="${p.name}" loading="lazy">
            <div class="offer-details" style="display: flex; flex-direction: column; flex-grow: 1;">
                <h3 class="product-title" style="margin-bottom: 5px;">${p.name}</h3>
                <p class="product-desc" style="flex-grow: 1;">${p.slogan}</p>
                <div class="price-row" style="padding: 0 12px 10px 12px; display: flex; justify-content: space-between; align-items: center;">
                    <span class="old-price" style="text-decoration: line-through; color: var(--text-muted); font-size: 12px;">${Math.round(p.price * 1.2)} ج.م</span>
                    <span class="product-price" style="color: var(--gold-primary); font-weight: bold; font-size: 14px;">${p.price} ج.م</span>
                </div>
                <button class="add-to-cart-btn" onclick="addToCart(${p.id})">إضافة للحقيبة الفاخرة ✨</button>
            </div>
        </div>
    `).join('');
}

// إضافة منتج إلى سلة التسوق مع تسجيل التحليلات
function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    cart.push(product);
    
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
        cartCountEl.innerText = cart.length;
    }
    
    // تسجيل البيانات في سجل التحليلات بلوحة الإدارة لربطه بـ admin.js
    const currentUser = JSON.parse(localStorage.getItem('lunovia_user')) || { name: "عميل زائر", provider: "منصة المتجر العامة" };
    const logs = JSON.parse(localStorage.getItem('lunovia_analytics')) || [];
    
    logs.push({
        user: currentUser.name,
        provider: currentUser.provider,
        item: product.name,
        time: new Date().toLocaleTimeString('ar-EG')
    });
    
    localStorage.setItem('lunovia_analytics', JSON.stringify(logs));
    alert(`🎉 تم اختيار [ ${product.name} ] بنجاح وإضافته لحقيبتك الخاصة!`);
}

// التبديل بين أقسام المتجر والسلة بسلاسة
function showSection(sectionId) {
    const storeSection = document.getElementById('store-section');
    const cartSection = document.getElementById('cart-section');
    
    if (storeSection) storeSection.style.display = sectionId === 'store-section' ? 'block' : 'none';
    if (cartSection) cartSection.style.display = sectionId === 'cart-section' ? 'block' : 'none';
    
    // تحديث أزرار القائمة النشطة
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.classList.remove('active');
        if (sectionId === 'store-section' && link.innerText.includes('الرئيسية')) link.classList.add('active');
        if (sectionId === 'cart-section' && link.innerText.includes('الحقيبة')) link.classList.add('active');
    });

    if (sectionId === 'cart-section') renderCart();
}

// عرض عناصر السلة وحساب الإجمالي بالجنيه المصري بشكل منسق ومصلح بالكامل
function renderCart() {
    const container = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    if (!container) return;

    let total = 0;
    
    if (cart.length === 0) {
        container.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding: 40px;">حقيبتك الفاخرة فارغة حالياً...</p>`;
        if (cartTotalEl) cartTotalEl.innerText = "0 ج.م";
        return;
    }

    container.innerHTML = cart.map((item, idx) => {
        total += item.price;
        return `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:15px 0; border-bottom:1px dashed var(--border-gold);">
                <span style="color:var(--text-white); font-weight:600;">${item.name}</span>
                <span style="color:var(--gold-primary); font-weight:700;">
                    ${item.price} ج.م
                    <button onclick="removeFromCart(${idx})" style="background:none; border:none; color:#e74c3c; margin-right:15px; cursor:pointer; font-weight:bold; font-size:14px;">(حذف)</button>
                </span>
            </div>
        `;
    }).join('');
    
    if (cartTotalEl) {
        cartTotalEl.innerText = `${total} ج.m`;
    }
}

// إزالة منتج من السلة
function removeFromCart(idx) {
    cart.splice(idx, 1);
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
        cartCountEl.innerText = cart.length;
    }
    renderCart();
}

// إرسال طلب الشراء المباشر والفاخر للواتساب بالجنيه المصري
function checkoutWhatsApp() {
    if (cart.length === 0) {
        alert("لطفاً، أضف بعض القطع الفاخرة إلى حقيبتك أولاً قبل إتمام الطلب!");
        return;
    }

    const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);
    const orderItems = cart.map((item, idx) => `${idx + 1}- ${item.name} (${item.price} ج.م)`).join('\n');

    const message = `🛍️ *طلب شراء جديد من مجوهرات LUNOVIA* 🛍️\n\n` +
                    `📦 *القطع المطلوبة:* \n${orderItems}\n\n` +
                    `💵 *الإجمالي العام للطلب:* ${totalAmount} ج.م\n\n` +
                    `✨ *الشعار:* Shine like the moon | lunovia.dpdns.org`;

    window.open(`https://wa.me/201065859268?text=${encodeURIComponent(message)}`, '_blank');
}

// تهيئة تفعيل المتجر عند تحميل الصفحة بالكامل متوافقاً مع الـ Slider
window.addEventListener('DOMContentLoaded', () => {
    renderCategoryBar();
    renderStore();
});
        
