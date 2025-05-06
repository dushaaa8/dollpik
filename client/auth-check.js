window.applyPermissions = function () {
    const permission = localStorage.getItem("userpermission");

    if (permission === "admin") {
        document.querySelectorAll(".admin-only").forEach(el => {
            el.style.display = "inline-block";
        });
    }

    document.querySelectorAll(".auth").forEach(el => {
        el.style.display = "flex";
    });
};

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const permission = localStorage.getItem("userpermission");

    console.log("Права пользователя:", permission);

    const textUsername = document.getElementById("username");
    const authButtons = document.querySelector(".auth-buttons");
    const userInfo = document.getElementById("user-info");
    const welcomeUser = document.getElementById("welcome-user");
    const logoutBtn = document.getElementById("logout-btn");

    if (token && username) {
        if (textUsername) textUsername.textContent = username;
        if (authButtons) authButtons.style.display = "none";
        if (userInfo) userInfo.style.display = "flex";
        if (welcomeUser) {
            welcomeUser.textContent = username.toUpperCase();
        }

        applyPermissions(); // 👉 применяем права при загрузке

        if (logoutBtn) {
            logoutBtn.addEventListener("click", () => {
                localStorage.removeItem("token");
                localStorage.removeItem("username");
                localStorage.removeItem("userpermission");
                window.location.reload();
            });
        }
    }
});