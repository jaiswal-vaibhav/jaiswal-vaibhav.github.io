document.addEventListener('DOMContentLoaded', function() {
    console.log("Website loaded!");

    const themeToggleBtn = document.getElementById('theme-toggle');
    themeToggleBtn.addEventListener('click', function() {
        document.body.classList.toggle('light-theme');
        themeToggleBtn.textContent = document.body.classList.contains('light-theme') ? "Switch to Dark Theme" : "Switch to Light Theme";
    });

    const navLinks = document.querySelectorAll('nav ul li a');
// When a nav link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();

        // Hide all sections
        document.querySelectorAll('.other-sections section').forEach(section => {
            section.classList.remove('active');
        });

        // Show only the selected section
        const sectionId = this.getAttribute('href').substring(1);
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('active');
        }
    });
});

