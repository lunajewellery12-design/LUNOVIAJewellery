document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('auth-submit-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const email = document.getElementById('auth-email').value;
            const password = document.getElementById('auth-password').value;
            if (email === "admin@lunovia.com" && password === "Firas33$") {
                window.location.href = "admin.html";
            } else {
                alert("بيانات الدخول غير صحيحة");
            }
        });
    }
});
