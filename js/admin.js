let products = JSON.parse(localStorage.getItem('luna_products')) || [];

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(`${tabId}-tab`).style.display = 'block';
    event.target.classList.add('active');
    
    if (tabId === 'analytics') renderAnalytics();
    if (tabId === 'inventory') renderInventory();
}

function renderAnalytics() {
    const logs = JSON.parse(localStorage.getItem('luna_analytics')) || [];
    const container = document.getElementById('logs-tbody');
    container.innerHTML = logs.map(l => `
        <tr>
            <td>${l.user}</td>
            <td>${l.provider}</td>
            <td style="color:var(--luxury-gold); font-weight:700;">${l.item}</td>
            <td>${l.time}</td>
        </tr>
    `).reverse().join('');
}

function renderInventory() {
    const container = document.getElementById('products-tbody');
    container.innerHTML = products.map((p, idx) => `
        <tr>
            <td><img src="${p.img}" style="width:60px; height:60px; object-fit:cover; border-radius:8px; border:1px solid var(--border-color);"></td>
            <td style="font-weight:700;">${p.name}</td>
            <td style="font-size:12px; color:var(--text-muted);">${p.slogan}</td>
            <td>
                <input type="number" value="${p.price}" onchange="updatePrice(${idx}, this.value)" 
                style="width:90px; padding:8px; text-align:center; border:1px solid var(--border-color); border-radius:6px;">
            </td>
            <td>
                <button class="btn" style="background:#e05c5c; border-color:#e05c5c; padding:8px 16px; font-size:12px;" onclick="deleteProduct(${idx})">حذف</button>
            </td>
        </tr>
    `).join('');
}

function updatePrice(idx, newPrice) {
    products[idx].price = parseInt(newPrice);
    localStorage.setItem('luna_products', JSON.stringify(products));
}

function deleteProduct(idx) {
    if(confirm("هل تود إزالة هذه القطعة من العرض؟")) {
        products.splice(idx, 1);
        localStorage.setItem('luna_products', JSON.stringify(products));
        renderInventory();
    }
}

// تحويل الصورة المرفوعة من جهازك إلى صيغة Base64 لتخزينها فورياً
document.getElementById('add-product-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('new-title').value;
    const price = parseInt(document.getElementById('new-price').value);
    const slogan = document.getElementById('new-slogan').value;
    const imgFile = document.getElementById('new-img-file').files[0];

    const reader = new FileReader();
    reader.onloadend = function() {
        const base64Image = reader.result; // هذا هو رابط الصورة الثابت المولد محلياً من جهازك!
        
        products.unshift({
            id: Date.now(),
            name: title,
            slogan: slogan,
            price: price,
            img: base64Image
        });

        localStorage.setItem('luna_products', JSON.stringify(products));
        renderInventory();
        document.getElementById('add-product-form').reset();
        alert("🎉 تم دمج صورتك الخاصة بنجاح وإضافة القطعة الفاخرة لمتجرك!");
    }
    
    if (imgFile) {
        reader.readAsDataURL(imgFile);
    }
});

window.onload = renderAnalytics;
