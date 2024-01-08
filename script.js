document.addEventListener('DOMContentLoaded', function() {
    console.log("Website loaded!");
});
document.getElementById('theme-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-theme');
});
