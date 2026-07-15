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

// توليد المنتجات الافتراضية المتنوعة بفخامة عند زيارة الموقع لأول مرة
if (products.length === 0) {
    const baseNames = [
        "عقد هلال Lunovia المضيء", 
        "سوار الذهب المصقول عيار 18", 
        "خاتم السوليتير الملكي الرائع", 
        "أقراط الياقوت الهادئ والنقي"
    ];
    const slogans = [
        "لمسات راقية تفيض بالنعومة والدلال والجاذبية اللامعة",
        "تألق ملكي فريد يجذب الأنظار في هدوء تام ورقي مطلق",
        "نسج من سحر الطبيعة ليرافق طلتك الجذابة والاستثنائية",
        "قصة عشق أبدية من الذهب الخالص المستوحى من بريق القمر"
    ];
    
    // توليد 70 قطعة فريدة بصور متبادلة غير متشابهة
    for (let i = 1; i <= 70; i++) {
        products.push({
            id: i,
            name: `${baseNames[i % 4]} - موديل ${i}`,
            slogan: slogans[i % 4],
            price: 350 + (i * 5), // أسعار متناسقة بالدولار لموقعك الفخم
            img: luxuryImages[i % luxuryImages.length] // توزيع الصور بالتتابع لضمان التنوع وعدم التكرار المتتالي
        });
    }
    localStorage.setItem('lunovia_products', JSON.stringify(products));
}

let cart = [];

// عرض المنتجات في المتجر بدقة واحترافية وبدون أي تداخل كلمات
function renderStore() {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    container.innerHTML = products.map(p => `
        <div class="product-card">
            <div class="product-img-wrapper">
                <img class="product-img" src="${p.img}" alt="${p.name}" loading="lazy">
            </div>
            <div class="product-info">
                <h3 class="product-title">${p.name}</h3>
                <p class="product-slogan">${p.slogan}</p>
                <div class="product-price">${p.price} $</div>
                <button class="btn buy-btn" onclick="addToCart(${p.id})">إضافة للحقيبة الفاخرة ✨</button>
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
    
    if (sectionId === 'cart-section') renderCart();
}

// عرض عناصر السلة وحساب الإجمالي
function renderCart() {
    const container = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    if (!container) return;

    let total = 0;
    
    if (cart.length === 0) {
        container.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding: 20px;">حقيبتك الفاخرة فارغة حالياً...</p>`;
        if (cartTotalEl) cartTotalEl.innerText = "0";
        return;
    }

    container.innerHTML = cart.map((item, idx) => {
        total += item.price;
        return `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; padding-bottom:10px; border-bottom:1px solid rgba(212,175,55,0.1); font-size:14px;">
                <span style="color:var(--text-white); font-weight:600;">${item.name}</span>
                <span style="color:var(--gold-primary); font-weight:700;">
                    ${item.price} $ 
                    <button onclick="removeFromCart(${idx})" style="background:none; border:none; color:#e74c3c; margin-right:15px; cursor:pointer; font-weight:bold;">(حذف)</button>
                </span>
            </div>
        `;
    }).join('');
    
    if (cartTotalEl) {
        cartTotalEl.innerText = total;
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

// معالجة وإرسال طلب الشراء الاحترافي عبر الواتساب بدقة متناهية
function sendOrder() {
    const name = document.getElementById('cust-name').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    const gov = document.getElementById('cust-gov').value.trim();
    const city = document.getElementById('cust-city').value.trim();
    const street = document.getElementById('cust-street').value.trim();
    const bld = document.getElementById('cust-building').value.trim();
    const flr = document.getElementById('cust-floor').value.trim();

    if (cart.length === 0) {
        alert("لطفاً، أضف بعض القطع الفاخرة إلى حقيبتك أولاً قبل إتمام الطلب!");
        return;
    }

    if (!name || !phone || !gov || !city || !street || !bld || !flr) { 
        alert("لطفاً، أكمل كافة تفاصيل العنوان ورقم الهاتف لضمان دقة عملية الشحن."); 
        return; 
    }

    const orderItems = cart.map(item => `- ${item.name} (${item.price} $)`).join('\n');
    const totalAmount = document.getElementById('cart-total').innerText;

    const message = `🛍️ *طلب شراء جديد من مجوهرات LUNOVIA* 🛍️\n\n` +
                    `👤 *العميل المتميز:* ${name}\n` +
                    `📞 *رقم الهاتف:* ${phone}\n` +
                    `📍 *عنوان التوصيل:* \n` +
                    `المحافظة: ${gov} | المدينة: ${city}\n` +
                    `الشارع: ${street} | مبنى: ${bld} | الطابق: ${flr}\n\n` +
                    `📦 *القطع المطلوبة:* \n${orderItems}\n\n` +
                    `💵 *الإجمالي العام للطلب:* ${totalAmount} $\n` +
                    `✨ *الشعار:* Shine like the moon | lunovia.dpdns.org`;

    window.open(`https://wa.me/201065859268?text=${encodeURIComponent(message)}`, '_blank');
}

// تهيئة تفعيل المتجر عند تحميل الصفحة بالكامل متوافقاً مع الـ Slider
window.addEventListener('DOMContentLoaded', () => {
    renderStore();
});
                        
