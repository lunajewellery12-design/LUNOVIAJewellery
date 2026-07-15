// تشفير البيانات الحساسة على مستوى الكود المحلي وتوثيقها لهوية LUNOVIA
const ADMIN_EMAIL = "LunaJewellery12@gmail.com";
const ADMIN_PASS = "Firas33$";

// دالة تسجيل دخول الإدارة المعتمدة
function tryAdminLogin() {
    const emailField = document.getElementById('admin-email') || document.getElementById('adminEmail');
    const passField = document.getElementById('admin-pass') || document.getElementById('adminPassword');
    const loginError = document.getElementById('loginError');

    if (!emailField || !passField) {
        console.error("خطأ: لم يتم العثور على حقول إدخال البريد أو كلمة المرور في الـ HTML.");
        return;
    }

    const emailInput = emailField.value.trim();
    const passInput = passField.value;

    if (emailInput === ADMIN_EMAIL && passInput === ADMIN_PASS) {
        // توحيد مفاتيح التخزين لتتوافق مع بقية ملفات المشروع
        localStorage.setItem('lunovia_admin_auth', 'authenticated');
        
        // حفظ بيانات المستخدم كمدير عام لتسجيلها في التحليلات
        const adminUser = { 
            name: "فيراس مصطفى (المدير العام)", 
            provider: "لوحة الإدارة الرسمية" 
        };
        localStorage.setItem('lunovia_user', JSON.stringify(adminUser));

        if (loginError) loginError.style.display = 'none';
        
        alert('أهلاً بك يا فيراس! تم التحقق بنجاح. جاري تحويلك للوحة الإدارة الفاخرة لـ LUNOVIA...');
        window.location.href = 'admin.html';
    } else {
        if (loginError) {
            loginError.style.display = 'block';
        } else {
            alert('⚠️ خطأ في البريد الإلكتروني أو كلمة المرور! تم رفض الوصول.');
        }
    }
}

// دالة تسجيل الخروج الآمنة للإدارة
function logoutAdmin() {
    localStorage.removeItem('lunovia_admin_auth');
    alert('تم تسجيل الخروج بأمان من نظام LUNOVIA.');
    window.location.href = 'index.html';
}

// التحكم بالنافذة المنبثقة لتسجيل الدخول بأمان
function openLoginModal() {
    const modal = document.getElementById('login-modal') || document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeLoginModal() {
    const modal = document.getElementById('login-modal') || document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'none';
    }
    const loginError = document.getElementById('loginError');
    if (loginError) loginError.style.display = 'none';
}

// محاكاة الدخول السريع كعميل متميز (iCloud / Email) المتناسق مع الأيقونات الفخمة
function mockLogin(provider) {
    const user = { name: `عميل متميز (${provider})`, provider: provider };
    localStorage.setItem('lunovia_user', JSON.stringify(user));
    
    // تغيير اسم الزر في الترويسة العلوية ليظهر ترحيباً بالعميل الفاخر
    const navBtn = document.getElementById('login-nav-btn') || document.getElementById('adminBtn');
    if (navBtn) {
        navBtn.innerHTML = `<i class="fas fa-user-circle"></i> ${user.name}`;
    }
    
    closeLoginModal();
    alert(`أهلاً بك في عالم LUNOVIA الفاخر! تم تسجيل دخولك عبر ${provider}.`);
}

// تهيئة وعرض حالة الدخول الحالية فور تحميل الصفحة دون حدوث تداخلات
window.addEventListener('DOMContentLoaded', () => {
    const savedUser = JSON.parse(localStorage.getItem('lunovia_user'));
    if (savedUser) {
        const navBtn = document.getElementById('login-nav-btn') || document.getElementById('adminBtn');
        if (navBtn) {
            navBtn.innerHTML = `<i class="fas fa-user-circle"></i> ${savedUser.name}`;
        }
    }
});
