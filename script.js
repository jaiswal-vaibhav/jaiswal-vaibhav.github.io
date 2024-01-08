document.addEventListener('DOMContentLoaded', function() {
    console.log("Website loaded!");

    const themeToggleBtn = document.getElementById('theme-toggle');
    themeToggleBtn.addEventListener('click', function() {
        document.body.classList.toggle('light-theme');
        themeToggleBtn.textContent = document.body.classList.contains('light-theme') ? "Switch to Dark Theme" : "Switch to Light Theme";
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            document.getElementById(sectionId).classList.toggle('hidden');
        });
    });
});
