document.addEventListener('DOMContentLoaded', function() {
    console.log("Website loaded!");

    const themeToggleBtn = document.getElementById('theme-toggle');
    themeToggleBtn.addEventListener('click', function() {
        document.body.classList.toggle('light-theme');
        themeToggleBtn.textContent = document.body.classList.contains('light-theme') ? "Switch to Dark Theme" : "Switch to Light Theme";
    });
});
