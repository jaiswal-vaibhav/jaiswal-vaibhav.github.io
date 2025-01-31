document.addEventListener('DOMContentLoaded', function() {
    console.log("Website loaded!");

    // =========================
    // 1) THEME TOGGLE
    // =========================
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            document.body.classList.toggle('light-theme');
            themeToggleBtn.textContent = document.body.classList.contains('light-theme')
                ? "Switch to Dark Theme"
                : "Switch to Light Theme";
        });
    } else {
        console.log("Theme toggle button not found");
    }

    // =========================
    // 2) TAB NAVIGATION
    // =========================
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Hide all sections
            document.querySelectorAll('section').forEach(section => {
                section.classList.remove('active');
            });

            // Show only the selected section
            const sectionId = this.getAttribute('href').substring(1); // remove '#' from href
            const section = document.getElementById(sectionId);
            if (section) {
                section.classList.add('active');
            } else {
                console.log("Section not found for id: " + sectionId);
            }
        });
    });

    // =========================
    // 3) SEARCH FUNCTIONALITY
    // =========================
    const searchBar = document.getElementById('search-bar');
    if (searchBar) {
        // Listen for ENTER key in search bar
        searchBar.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(searchBar.value.trim().toLowerCase());
            }
        });
    } else {
        console.log("Search bar not found");
    }

    function performSearch(query) {
        const sections = document.querySelectorAll('section');

        if (!query) {
            // If search is empty, show only #home (or change logic to show all)
            sections.forEach(sec => sec.classList.remove('active'));
            const home = document.getElementById('home');
            if (home) {
                home.classList.add('active');
            }
            return;
        }

        // Otherwise, filter sections by the query
        let anyMatch = false;
        sections.forEach(section => {
            // Convert section text to lowercase for case-insensitive matching
            const text = section.textContent.toLowerCase();

            if (text.includes(query)) {
                section.classList.add('active');
                anyMatch = true;
            } else {
                section.classList.remove('active');
            }
        });

        // If no matches found, alert user and reset to home
        if (!anyMatch) {
            alert(`No results found for "${query}"`);
            sections.forEach(sec => sec.classList.remove('active'));
            const home = document.getElementById('home');
            if (home) {
                home.classList.add('active');
            }
        }
    }

});
