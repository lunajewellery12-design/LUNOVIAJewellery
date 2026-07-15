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
            <td style="color:var(--logo-dark-gold); font-weight:700;">${l.item}</td>
            <td>${l.time}</td>
        </tr>
    `).reverse().join('');
}

function renderInventory() {
    const container = document.getElementById('products-tbody');
    container.innerHTML = products.map((p, idx) => `
        <tr>
            <td><img src="${p.img}" style="width:50px; height:50px; object-fit:cover; border-radius:5px;"></td>
            <td>${p.name}</td>
            <td style="font-size:12px; color:#666;">${p.slogan}</td>
            <td><input type="number" value="${p.price}" onchange="updatePrice(${idx}, this.value)" style="width:80px; padding:5px; text-align:center;"></td>
            <td><button class="btn" style="background:red; color:#fff; padding:5px 10px;" onclick="deleteProduct(${idx})">حذف</button></td>
        </tr>
    `).join('');
}

function updatePrice(idx, newPrice) {
    products[idx].price = parseInt(newPrice);
    localStorage.setItem('luna_products', JSON.stringify(products));
}

function deleteProduct(idx) {
    if(confirm("هل أنت متأكد من حذف هذا العرض نهائياً؟")) {
        products.splice(idx, 1);
        localStorage.setItem('luna_products', JSON.stringify(products));
        renderInventory();
    }
}

document.getElementById('add-product-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('new-title').value;
    const price = parseInt(document.getElementById('new-price').value);
    const slogan = document.getElementById('new-slogan').value;

    products.unshift({
        id: Date.now(),
        name: title,
        slogan: slogan,
        price: price,
        img: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400" // لوجو افتراضي للعروض الجديدة
    });

    localStorage.setItem('luna_products', JSON.stringify(products));
    renderInventory();
    this.reset();
    alert("تم إضافة العرض الجديد بنجاح في مقدمة المتجر!");
});

window.onload = renderAnalytics;
                                                             
