// --- التحكم بالبار المنزلق التلقائي (Slider) ---
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(index) {
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

// التغيير التلقائي للشرائح كل 4 ثوانٍ بسلاسة
setInterval(nextSlide, 4000);


// --- النوافذ المنبثقة للتحكم بلوحة الإدارة ---
const adminBtn = document.getElementById('adminBtn');
const loginModal = document.getElementById('loginModal');
const closeModal = document.getElementById('closeModal');

// فتح لوحة الدخول
adminBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.style.display = 'flex';
});

// إغلاق اللوحة
closeModal.addEventListener('click', () => {
    loginModal.style.display = 'none';
    document.getElementById('loginError').style.display = 'none';
});

// إغلاق النافذة عند الضغط في أي مكان خارجها
window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
        document.getElementById('loginError').style.display = 'none';
    }
});


// --- حل مشكلة تسجيل دخول الإدارة البرمجي ---
const adminLoginForm = document.getElementById('adminLoginForm');
const loginError = document.getElementById('loginError');

adminLoginForm.addEventListener('submit', function(e) {
    e.preventDefault(); // إيقاف إعادة التحميل التلقائي فوراً
    
    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value;

    // بريد وكلمة مرور تجريبية مخصصة للتحقق
    const correctEmail = "admin@lunovia.com";
    const correctPassword = "123"; 

    if (email === correctEmail && password === correctPassword) {
        // في حال النجاح
        alert("تم التحقق بنجاح! جاري توجيهك إلى لوحة التحكم الإدارية لـ LUNOVIA...");
        loginError.style.display = 'none';
        loginModal.style.display = 'none';
        
        // يمكنك توجيه المسؤول لصفحة الإدارة عبر هذا السطر:
        // window.location.href = "admin-dashboard.html";
    } else {
        // إظهار رسالة الخطأ بشكل واضح
        loginError.style.display = 'block';
    }
});


// --- دالة طلب العروض الحصرية التفاعلية ---
function openOrder(offerName) {
    alert(`لقد اخترت طلب: (${offerName}).\nمرحباً بك في LUNOVIA، سيتم ربطك بخدمة العملاء لتأكيد تفاصيل الشحن الفاخر الخاص بك.`);
}

