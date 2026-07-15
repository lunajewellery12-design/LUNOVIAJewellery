// قاعدة بيانات تجريبية سحابية مدمجة (70 منتج مع عبارات رنانة)
const mockDbUrl = "https://images.unsplash.com/";
const categories = [
    { name: "خاتم الياقوت الأحمر الملكي", slogan: "بريق العاطفة يلتف حول إصبعكِ", price: 1000, img: "photo-1605100804763-247f67b3557e?w=400" },
    { name: "سلسلة اللؤلؤ الأبيض الناعم", slogan: "كأنها هالة من ضوء القمر تنساب برقة", price: 1200, img: "photo-1599643478518-a784e5dc4c8f?w=400" },
    { name: "خاتم الألماس الفضي الفاخر", slogan: "خلود اللحظة يتجسد في بريق نقي", price: 500, img: "photo-1603561591411-07134e71a2a9?w=400" },
    { name: "حلق الفراشة الذهبية الأنيق", slogan: "رفرفة من الأناقة تلامس وجنتيكِ", price: 600, img: "photo-1635767798638-3e25273a8236?w=400" }
];

// تكرار وتوليد 70 منتجاً فريداً بعبارات رنانة تلقائية ومختلفة لتجربة تصفح غنية جداً
let products = JSON.parse(localStorage.getItem('luna_products'));
if (!products) {
    products = [];
    const slogans = [
        "سحر لا يُقاوم يعبر عن حضورك الطاغي", "إبداع حقيقي يروي تفاصيل فخامتك", 
        "لمعان خالد يليق بملكة", "دقة الصنعة في قالب أنثوي رقيق", 
        "جمال ممتد عبر الأجيال", "الأناقة لا تحتاج إلى كلمات"
    ];
    for (let i = 1; i <= 70; i++) {
        const base = categories[(i - 1) % categories.length];
        products.push({
            id: i,
            name: `${base.name} - الإصدار المحدود ${i}`,
            slogan: slogans[i % slogans.length] + ` (تصميم فريد #${i})`,
            price: base.price + (i * 5), // اختلاف طفيف في الأسعار لإعطاء طابع طبيعي
            img: mockDbUrl + base.img
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
            <img class="product-img" src="${p.img}" alt="${p.name}">
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
    
    // تسجيل اهتمام المستخدم سحابياً محلياً لمحاكاة قاعدة البيانات
    const currentUser = JSON.parse(localStorage.getItem('luna_user')) || { name: "عميل زائر", provider: "مجهول" };
    const logs = JSON.parse(localStorage.getItem('luna_analytics')) || [];
    logs.push({
        user: currentUser.name,
        provider: currentUser.provider,
        item: product.name,
        time: new Date().toLocaleTimeString('ar-EG')
    });
    localStorage.setItem('luna_analytics', JSON.stringify(logs));
    
    alert(`تمت إضافة ${product.name} بنجاح!`);
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
            <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                <span>${item.name}</span>
                <span>${item.price} ج.م <button onclick="removeFromCart(${idx})" style="background:none; border:none; color:red; cursor:pointer;">(حذف)</button></span>
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

    if(!name || !phone || !gov) { alert("من فضلك املأ حقول التوصيل الأساسية!"); return; }

    const message = `🛍️ *طلب شراء جديد من متجر Luna Jewellery* 🛍️\n\n` +
                    `👤 *العميل:* ${name}\n` +
                    `📞 *الهاتف:* ${phone}\n` +
                    `📍 *العنوان بالتفصيل:* محافظة ${gov} - مدينة ${city} - شارع ${street} - عمارة ${bld} - شقة ${flr}\n\n` +
                    `💵 *إجمالي المبلغ:* ${document.getElementById('cart-total').innerText} ج.م محولة عبر فودافون كاش.\n\n` +
                    `يرجى تأكيد الشحن والتواصل معنا فوراً!`;

    window.open(`https://wa.me/201065859268?text=${encodeURIComponent(message)}`, '_blank');
}

window.onload = renderStore;
      
