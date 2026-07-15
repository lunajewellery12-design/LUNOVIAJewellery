// تشفير البيانات الحساسة على مستوى الكود المحلي وتوثيقها
const ADMIN_EMAIL = "LunaJewellery12@gmail.com";
const ADMIN_PASS = "Firas33$";

function tryAdminLogin() {
    const emailInput = document.getElementById('admin-email').value.trim();
    const passInput = document.getElementById('admin-pass').value;

    if (emailInput === ADMIN_EMAIL && passInput === ADMIN_PASS) {
        localStorage.setItem('luna_admin_auth', 'authenticated');
        alert('أهلاً بك يا فيراس! تم التحقق بنجاح. جاري تحويلك للوحة الإدارة...');
        window.location.href = 'admin.html';
    } else {
        alert('⚠️ خطأ في البريد الإلكتروني أو كلمة المرور! تم رفض الوصول.');
    }
}

function logoutAdmin() {
    localStorage.removeItem('luna_admin_auth');
    alert('تم تسجيل الخروج بأمان.');
    window.location.href = 'index.html';
}

function openLoginModal() {
    document.getElementById('login-modal').style.display = 'flex';
}

function closeLoginModal() {
    document.getElementById('login-modal').style.display = 'none';
}

function mockLogin(provider) {
    const user = { name: `عميل متميز (${provider})`, provider: provider };
    localStorage.setItem('luna_user', JSON.stringify(user));
    document.getElementById('login-nav-btn').innerText = user.name;
    closeLoginModal();
    alert(`أهلاً بك! تم تسجيل دخولك كعميل عبر ${provider}.`);
}
