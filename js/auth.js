// تشغيل منطق تسجيل الدخول الفاخر لـ LUNOVIA
document.addEventListener('DOMContentLoaded', () => {
    const loginModal = document.getElementById('loginModal');
    const adminBtn = document.getElementById('adminBtn');
    const closeModal = document.getElementById('closeModal');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const loginError = document.getElementById('loginError');

    // 1. فتح وإغلاق النافذة المنبثقة
    if (adminBtn && loginModal) {
        adminBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'flex';
        });
    }

    if (closeModal && loginModal) {
        closeModal.addEventListener('click', () => {
            loginModal.style.display = 'none';
            if (loginError) loginError.style.display = 'none';
        });
    }

    // إغلاق النافذة عند الضغط خارجها
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
            if (loginError) loginError.style.display = 'none';
        }
    });

    // 2. التحقق من بيانات دخول الإدارة والتحويل لصفحة لوحة التحكم
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('adminEmail').value.trim();
            const password = document.getElementById('adminPassword').value.trim();

            // البريد الإلكتروني المعتمد لكلمة سر الإدارة (تستطيع تعديلها بحرية)
            if (email === "jewellery12@gmail.com" && password === "12345678") {
                // حفظ جلسة الإدارة في المتصفح للتعرف عليه في لوحة التحكم
                localStorage.setItem('lunovia_user', JSON.stringify({
                    name: "المدير العام",
                    role: "admin",
                    provider: "لوحة التحكم الرئيسية"
                }));
                
                if (loginError) loginError.style.display = 'none';
                alert("✨ تم التحقق من هويتك بنجاح! جاري الانتقال للوحة الإدارة الفاخرة...");
                window.location.href = "admin.html"; // التوجيه لصفحة الإدارة
            } else {
                if (loginError) loginError.style.display = 'block';
            }
        });
    }
});

// 3. التبديل الفخم بين تبويبات الإدارة والعملاء في واجهة تسجيل الدخول
function switchLoginTab(type) {
    const adminForm = document.getElementById('adminLoginForm');
    const clientSection = document.getElementById('clientLoginSection');
    const tabs = document.querySelectorAll('.tab-btn');

    tabs.forEach(btn => btn.classList.remove('active'));

    if (type === 'admin') {
        tabs[0].classList.add('active');
        if (adminForm) adminForm.style.display = 'block';
        if (clientSection) clientSection.style.display = 'none';
    } else {
        tabs[1].classList.add('active');
        if (adminForm) adminForm.style.display = 'none';
        if (clientSection) clientSection.style.display = 'block';
    }
}

// 4. دالة تسجيل دخول العميل الفورية وتنشيط حسابه
function loginAsClient(platform) {
    const randomID = Math.floor(1000 + Math.random() * 9000);
    const clientName = `عميل متميز #${randomID}`;
    
    // حفظ بيانات العميل في الذاكرة لتخصيص عمليات الشراء والتحليلات
    localStorage.setItem('lunovia_user', JSON.stringify({
        name: clientName,
        role: "client",
        provider: platform
    }));

    alert(`✨ أهلاً بك! تم تسجيل دخولك بنجاح عبر منصة [ ${platform} ]. مقتنياتك الفاخرة باتت محفوظة الآن.`);
    
    // إغلاق المودال تلقائياً
    const loginModal = document.getElementById('loginModal');
    if (loginModal) loginModal.style.display = 'none';
}
