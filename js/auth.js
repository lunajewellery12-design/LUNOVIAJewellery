function openLoginModal() {
    document.getElementById('login-modal').style.display = 'flex';
}

function closeLoginModal() {
    document.getElementById('login-modal').style.display = 'none';
}

function mockLogin(provider) {
    let userName = "مستخدم ضيف";
    if (provider === "Google") userName = "فاطمة أحمد (جوجل)";
    if (provider === "Apple") userName = "سارة يوسف (iCloud)";
    if (provider === "Phone") userName = "01099887766 (هاتف)";

    const user = { name: userName, provider: provider };
    localStorage.setItem('luna_user', JSON.stringify(user));
    document.getElementById('login-nav-btn').innerText = userName;
    closeLoginModal();
    alert(`مرحباً بكِ، تم تسجيل الدخول بنجاح عبر ${provider}!`);
}
