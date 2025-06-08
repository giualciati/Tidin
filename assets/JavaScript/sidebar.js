document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector(".sidebar");
    const toggleBtn = document.querySelector(".sidebar header .material-icons-outlined");

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener("click", () => {
            sidebar.classList.toggle("close");

            toggleBtn.textContent = sidebar.classList.contains("close")
                ? "chevron_right"
                : "chevron_left";
        });
    }
});
