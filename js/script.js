// --- 1. التحكم بالبار المنزلق التلقائي (Slider) بذكاء وأمان ---
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(index) {
    if (slides.length === 0) return; 
    
    slides.forEach(slide => slide.classList.remove('active'));
    
    currentSlide = index;
    if (currentSlide >= slides.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = slides.length - 1;
    
    slides[currentSlide].classList.add('active');
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

if (slides.length > 0) {
    setInterval(nextSlide, 4000);
}


// --- 2. النوافذ المنبثقة للتحكم بلوحة الإدارة (تم إصلاح التداخل مع الـ CSS) ---
const adminBtn = document.getElementById('adminBtn');
const loginModal = document.getElementById('loginModal');
const closeModal = document.getElementById('closeModal');

if (adminBtn && loginModal) {
    // فتح لوحة الدخول عبر إضافة كلاس active المتوافق مع الـ CSS المطور
    adminBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.classList.add('active'); 
    });
}

if (closeModal && loginModal) {
    // إغلاق اللوحة عند الضغط على زر الإغلاق (X)
    closeModal.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.classList.remove('active'); 
        const errorEl = document.getElementById('loginError');
        if (errorEl) errorEl.style.display = 'none';
    });
}

// إغلاق النافذة عند الضغط في أي مكان خارج الصندوق المضيء
window.addEventListener('click', (e) => {
    if (loginModal && e.target === loginModal) {
        loginModal.classList.remove('active'); 
        const errorEl = document.getElementById('loginError');
        if (errorEl) errorEl.style.display = 'none';
    }
});


// --- 3. حل مشكلة تسجيل دخول الإدارة البرمجي وربطها بالهوية الجديدة ---
const adminLoginForm = document.getElementById('adminLoginForm');
const loginError = document.getElementById('loginError');

if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', function(e) {
        e.preventDefault(); // إيقاف إعادة تحميل الصفحة فوراً
        
        const email = document.getElementById('adminEmail').value.trim();
        const password = document.getElementById('adminPassword').value;

        // بيانات التحقق الخاصة بإدارة LUNOVIA
        const correctEmail = "admin@lunovia.com";
        const correctPassword = "123"; 

        if (email === correctEmail && password === correctPassword) {
            // حفظ بيانات المسؤول في الذاكرة
            const adminUser = {
                name: "المدير العام لـ LUNOVIA",
                provider: "لوحة تحكم الإدارة"
            };
            localStorage.setItem('lunovia_user', JSON.stringify(adminUser));

            alert("✨ تم التحقق بنجاح! جاري تهيئة لوحة التحكم الفاخرة لـ LUNOVIA...");
            
            if (loginError) loginError.style.display = 'none';
            if (loginModal) loginModal.classList.remove('active'); // تم الإصلاح هنا أيضاً ليتناسب مع الإغلاق التدريجي
            
            // للتوجيه التلقائي لصفحة الإدارة فوراً:
            window.location.href = "admin.html"; 
        } else {
            if (loginError) {
                loginError.style.display = 'block';
            }
        }
    });
}


// --- 4. دالة طلب العروض الحصرية التفاعلية ---
function openOrder(offerName) {
    alert(`لقد اخترت طلب: (${offerName}).\nمرحباً بك في عالم LUNOVIA الراقي، سيتم ربطك بخدمة العملاء لتأكيد تفاصيل الشحن الفاخر الخاص بك.`);
}
