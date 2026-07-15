const defaultImg = "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500";
let products = JSON.parse(localStorage.getItem('luna_products')) || [];

// توليد المنتجات الـ 70 الافتراضية إذا كانت السلة فارغة لأول مرة
if (products.length === 0) {
    const baseNames = ["خاتم الزمرد الأخضر", "سوار الذهب المصقول", "عقد اللؤلؤ المضيء", "أقراط الياقوت الهادئ"];
    const slogans = [
        "لمسات راقية تفيض بالنعومة والدلال",
        "تألق ملكي يجلب الأنظار في هدوء تام",
        "نسج من سحر الطبيعة ليرافق طلتك الجذابة",
        "قصة عشق أبدية من الذهب الخالص وصنعة اليدين"
    ];
    
    for (let i = 1; i <= 70; i++) {
        products.push({
            id: i,
            name: `${baseNames[i % 4]} - موديل ${i}`,
            slogan: slogans[i % 4],
            price: 1500 + (i * 10),
            img: defaultImg
        });
    }
    localStorage.setItem('luna_products', JSON.stringify(products));
}

let cart = [];

function renderStore() {
    const container = document.getElementById('products-container');
    if(!container) return;
    
    container.innerHTML = products.map(p => `
        <div class="product-card">
            <div class="product-img-wrapper">
                <img class="product-img" src="${p.img}" alt="${p.name}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${p.name}</h3>
                <p class="product-slogan">${p.slogan}</p>
                <div class="product-price">${p.price} ج.م</div>
                <button class="btn" onclick="addToCart(${p.id})">إضافة للحقيبة ✨</button>
            </div>
        </div>
    `).join('');
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    document.getElementById('cart-count').innerText = cart.length;
    
    // محاكاة تسجيل تحليلات التصفح والاهتمامات
    const currentUser = JSON.parse(localStorage.getItem('luna_user')) || { name: "عميل زائر", provider: "منصة المتجر العامة" };
    const logs = JSON.parse(localStorage.getItem('luna_analytics')) || [];
    logs.push({
        user: currentUser.name,
        provider: currentUser.provider,
        item: product.name,
        time: new Date().toLocaleTimeString('ar-EG')
    });
    localStorage.setItem('luna_analytics', JSON.stringify(logs));
    
    alert(`تم اختيار ${product.name} بنجاح!`);
}

function showSection(sectionId) {
    document.getElementById('store-section').style.display = sectionId === 'store-section' ? 'block' : 'none';
    document.getElementById('cart-section').style.display = sectionId === 'cart-section' ? 'block' : 'none';
    if(sectionId === 'cart-section') renderCart();
}

function renderCart() {
    const container = document.getElementById('cart-items');
    let total = 0;
    container.innerHTML = cart.map((item, idx) => {
        total += item.price;
        return `
            <div style="display:flex; justify-content:space-between; margin-bottom:12px; font-size:14px;">
                <span>${item.name}</span>
                <span style="font-weight:700;">${item.price} ج.م <button onclick="removeFromCart(${idx})" style="background:none; border:none; color:#e05c5c; margin-right:10px; cursor:pointer;">(حذف)</button></span>
            </div>
        `;
    }).join('');
    document.getElementById('cart-total').innerText = total;
}

function removeFromCart(idx) {
    cart.splice(idx, 1);
    document.getElementById('cart-count').innerText = cart.length;
    renderCart();
}

function sendOrder() {
    const name = document.getElementById('cust-name').value;
    const phone = document.getElementById('cust-phone').value;
    const gov = document.getElementById('cust-gov').value;
    const city = document.getElementById('cust-city').value;
    const street = document.getElementById('cust-street').value;
    const bld = document.getElementById('cust-building').value;
    const flr = document.getElementById('cust-floor').value;

    if(!name || !phone || !gov || !city || !street || !bld || !flr) { 
        alert("لطفاً، أكمل كافة تفاصيل العنوان ورقم الهاتف لضمان دقة عملية الشحن."); 
        return; 
    }

    const orderItems = cart.map(item => `- ${item.name} (${item.price} ج.م)`).join('\n');

    const message = `🛍️ *طلب شراء جديد من متجر Luna Jewellery* 🛍️\n\n` +
                    `👤 *العميل:* ${name}\n` +
                    `📞 *الهاتف:* ${phone}\n` +
                    `📍 *تفاصيل الشحن:* \n` +
                    `المحافظة: ${gov} | المدينة: ${city}\n` +
                    `الشارع: ${street} | عمارة: ${bld} | شقة رقم: ${flr}\n\n` +
                    `📦 *الطلبات:* \n${orderItems}\n\n` +
                    `💵 *إجمالي الحساب:* ${document.getElementById('cart-total').innerText} ج.م (محولة عبر فودافون كاش)`;

    window.open(`https://wa.me/201065859268?text=${encodeURIComponent(message)}`, '_blank');
}

window.onload = renderStore;
