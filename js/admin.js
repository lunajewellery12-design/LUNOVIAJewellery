// استخدام مفتاح التخزين الجديد المتوافق مع هوية Lunovia
let products = JSON.parse(localStorage.getItem('lunovia_products')) || [];

// إصلاح دالة تبديل التبويبات وتمرير الـ event بشكل صحيح لمنع توقف الكود
function switchTab(tabId, event) {
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    const targetTab = document.getElementById(`${tabId}-tab`);
    if (targetTab) {
        targetTab.style.display = 'block';
    }
    
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
    
    if (tabId === 'analytics') renderAnalytics();
    if (tabId === 'inventory') renderInventory();
}

// عرض سجل العمليات والتحليلات
function renderAnalytics() {
    const logs = JSON.parse(localStorage.getItem('lunovia_analytics')) || [];
    const container = document.getElementById('logs-tbody');
    if (!container) return;
    
    container.innerHTML = logs.map(l => `
        <tr>
            <td>${l.user}</td>
            <td>${l.provider}</td>
            <td style="color: var(--gold-primary); font-weight: 700;">${l.item}</td>
            <td>${l.time}</td>
        </tr>
    `).reverse().join('');
}

// عرض وإدارة المخزون والمنتجات الحالية
function renderInventory() {
    const container = document.getElementById('products-tbody');
    if (!container) return;
    
    container.innerHTML = products.map((p, idx) => `
        <tr>
            <td>
                <img src="${p.img}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; border: 1px solid var(--border-gold);">
            </td>
            <td style="font-weight: 700; color: var(--text-white);">${p.name}</td>
            <td style="font-size: 12px; color: var(--text-muted);">${p.slogan}</td>
            <td>
                <input type="number" value="${p.price}" onchange="updatePrice(${idx}, this.value)" 
                style="width: 90px; padding: 8px; text-align: center; background-color: #222; color: #fff; border: 1px solid var(--border-gold); border-radius: 6px;">
            </td>
            <td>
                <button class="btn" style="background: #e74c3c; color: #fff; border: none; padding: 8px 16px; font-size: 12px; width: auto;" onclick="deleteProduct(${idx})">حذف</button>
            </td>
        </tr>
    `).join('');
}

// تحديث أسعار المنتجات وحفظها فورياً
function updatePrice(idx, newPrice) {
    if (products[idx]) {
        products[idx].price = parseInt(newPrice) || 0;
        localStorage.setItem('lunovia_products', JSON.stringify(products));
    }
}

// حذف القطع من المخزون
function deleteProduct(idx) {
    if (confirm("هل تود إزالة هذه القطعة من العرض الفاخر لـ LUNOVIA؟")) {
        products.splice(idx, 1);
        localStorage.setItem('lunovia_products', JSON.stringify(products));
        renderInventory();
    }
}

// إضافة منتج جديد ومعالجة الصورة المرفوعة بنجاح
const addProductForm = document.getElementById('add-product-form');
if (addProductForm) {
    addProductForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('new-title').value.trim();
        const price = parseInt(document.getElementById('new-price').value) || 0;
        const slogan = document.getElementById('new-slogan').value.trim();
        const imgFile = document.getElementById('new-img-file').files[0];

        if (!imgFile) {
            alert("يرجى اختيار صورة للمنتج أولاً!");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = function() {
            const base64Image = reader.result; // توليد رابط الصورة محلياً
            
            // إضافة المنتج الجديد في مقدمة المصفوفة
            products.unshift({
                id: Date.now(),
                name: title,
                slogan: slogan,
                price: price,
                img: base64Image
            });

            // حفظ التحديثات وإعادة تصفير الاستمارة وتحديث الجدول
            localStorage.setItem('lunovia_products', JSON.stringify(products));
            renderInventory();
            addProductForm.reset();
            alert("🎉 تم دمج صورتك الخاصة بنجاح وإضافة القطعة الفاخرة لمتجرك الجديد!");
        };
        
        reader.readAsDataURL(imgFile);
    });
}

// التشغيل التلقائي عند تحميل الصفحة لتهيئة السجلات والمخزون
window.onload = function() {
    renderAnalytics();
    renderInventory();
};
