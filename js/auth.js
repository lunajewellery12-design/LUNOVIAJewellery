// الانتظار حتى تحميل كامل عناصر الصفحة (DOM) لضمان ربط الأزرار بنجاح
document.addEventListener('DOMContentLoaded', () => {
    const adminBtn = document.getElementById('adminBtn');
    const closeModalBtn = document.querySelector('.close-modal');
    const modalOverlay = document.getElementById('auth-modal');

    // 1. ربط زر "لوحة الإدارة" في الهيدر لفتح النافذة
    if (adminBtn) {
        adminBtn.addEventListener('click', (e) => {
            e.preventDefault(); // يمنع الصفحة من القفز لأعلى عند الضغط
            openAuthModal();
        });
    }

    // 2. ربط علامة الـ X لإغلاق النافذة
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeAuthModal();
        });
    }

    // 3. إغلاق النافذة تلقائياً عند الضغط في أي مكان خارج الصندوق المضيء
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeAuthModal();
            }
        });
    }
});

// دالة لفتح نافذة تسجيل الدخول برمجياً وبنعومة
function openAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }
}

// دالة لإغلاق النافذة برمجياً بالكامل
function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300); // يتوافق مع تأثير الحركة التدريجي بالـ CSS
    }
}

// دالة التبديل بين حساب العميل وحساب الإدارة داخل النافذة
function switchAuthRole(role) {
    const tabAdmin = document.getElementById('tab-admin');
    const tabCustomer = document.getElementById('tab-customer');
    const subtitle = document.getElementById('auth-subtitle');
    
    if (role === 'admin') {
        if (tabAdmin) tabAdmin.classList.add('active');
        if (tabCustomer) tabCustomer.classList.remove('active');
        if (subtitle) subtitle.innerText = "لوحة التحكم بالإدارة";
    } else {
        if (tabCustomer) tabCustomer.classList.add('active');
        if (tabAdmin) tabAdmin.classList.remove('active');
        if (subtitle) subtitle.innerText = "تسجيل دخول العميل الفاخر";
    }
}
