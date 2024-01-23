document.addEventListener('DOMContentLoaded', function() {
    console.log("Website loaded!");

    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            document.body.classList.toggle('light-theme');
            themeToggleBtn.textContent = document.body.classList.contains('light-theme') ? "Switch to Dark Theme" : "Switch to Light Theme";
        });
    } else {
        console.log("Theme toggle button not found");
    }

    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Hide all sections (adjust the selector if needed)
            document.querySelectorAll('section').forEach(section => {
                section.classList.remove('active');
            });

            // Show only the selected section
            const sectionId = this.getAttribute('href').substring(1);
            const section = document.getElementById(sectionId);
            if (section) {
                section.classList.add('active');
            } else {
                console.log("Section not found for id: " + sectionId);
            }
        });
    });
    const searchBar = document.getElementById('search-bar');
    const searchButton = document.getElementById('search-button'); // make sure you have this button in your HTML

    if (searchButton) {
        searchButton.addEventListener('click', function() {
            const searchText = searchBar.value.toLowerCase();
            const paragraphs = document.querySelectorAll('p');

            paragraphs.forEach(p => {
                if (p.textContent.toLowerCase().includes(searchText)) {
                    // For simplicity, just scrolling to the first match
                    p.scrollIntoView();
                    p.style.backgroundColor = 'yellow'; // highlighting the match
                    return; // remove this line if you want to highlight all matches
                }
            });
        });
    } else {
        console.log("Search button not found");
    }
});
});
