alert("الملف يعمل!");
document.addEventListener('DOMContentLoaded', () => {
    // نربط العملية بالزر الذي أرسلت الـ ID الخاص به
    const submitBtn = document.getElementById('auth-submit-btn');
    
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // سحب القيم من حقول الإيميل والباسورد
            const email = document.getElementById('auth-email').value;
            const password = document.getElementById('auth-password').value;

            // بيانات الدخول (يمكنك تعديلها)
            if (email === "admin@lunovia.com" && password === "123") {
                localStorage.setItem('lunovia_user', JSON.stringify({name: "المدير العام", provider: "الإدارة"}));
                alert("✨ تم الدخول بنجاح! جاري التوجيه...");
                window.location.href = "admin.html";
            } else {
                alert("⚠️ بيانات الدخول غير صحيحة، يرجى المحاولة مجدداً.");
            }
        });
    }
});
