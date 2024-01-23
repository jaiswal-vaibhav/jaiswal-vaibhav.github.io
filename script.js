document.addEventListener('DOMContentLoaded', function() {
    console.log("Website loaded!");

    // Theme toggle functionality
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            document.body.classList.toggle('light-theme');
            themeToggleBtn.textContent = document.body.classList.contains('light-theme') ? "Switch to Dark Theme" : "Switch to Light Theme";
        });
    } else {
        console.log("Theme toggle button not found");
    }

    // Navigation link functionality
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('section').forEach(section => {
                section.classList.remove('active');
            });
            const sectionId = this.getAttribute('href').substring(1);
            const section = document.getElementById(sectionId);
            if (section) {
                section.classList.add('active');
            } else {
                console.log("Section not found for id: " + sectionId);
            }
        });
    });

    // Search functionality
    const searchBar = document.getElementById('search-bar');
    const searchButton = document.getElementById('search-button');
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            const searchText = searchBar.value.toLowerCase();
            const paragraphs = document.querySelectorAll('p');
            let found = false;

            paragraphs.forEach(p => {
                p.style.backgroundColor = ''; // Reset highlight
                if (p.textContent.toLowerCase().includes(searchText)) {
                    found = true;
                    p.style.backgroundColor = 'yellow'; // Highlight match
                    if (!found) p.scrollIntoView(); // Scroll to the first match
                }
            });

            if (!found) {
                alert('No matches found');
            }
        });
    } else {
        console.log("Search button not found");
    }
});
