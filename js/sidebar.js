document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("sidebar");
    const btn = document.getElementById("toggleSidebar");
    const app = document.querySelector(".app");

    if (!sidebar || !btn || !app) return;

    // Начальное состояние – открыта (по умолчанию)
    app.classList.add("left-open");
    btn.textContent = "✕";

    btn.addEventListener("click", () => {
        sidebar.classList.toggle("hide");
        btn.classList.toggle("open");
        app.classList.toggle("left-open");

        btn.textContent = sidebar.classList.contains("hide") ? "☰" : "✕";
    });
});
function startRecognition() {
    // ...
    micBtn.classList.add('recording');
}

function stopRecognition() {
    // ...
    micBtn.classList.remove('recording');
}