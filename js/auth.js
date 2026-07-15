document.addEventListener('DOMContentLoaded', () => {
    const authForm = document.getElementById('auth-form');
    
    if (authForm) {
        authForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('auth-email').value;
            const password = document.getElementById('auth-password').value;

            // بيانات الدخول
            if (email === "admin@lunovia.com" && password === "123") {
                localStorage.setItem('lunovia_user', JSON.stringify({name: "المدير العام", provider: "الإدارة"}));
                alert("تم الدخول بنجاح!");
                window.location.href = "admin.html";
            } else {
                alert("بيانات الدخول غير صحيحة");
            }
        });
    }
});
