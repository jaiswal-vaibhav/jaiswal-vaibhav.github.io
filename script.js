// ===================================
// Modern JavaScript for Website
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    console.log("Website loaded successfully!");

    // ===================================
    // 0) LOGO CLICK HANDLER
    // ===================================
    const logoPhoto = document.querySelector('.logo-photo');
    if (logoPhoto) {
        logoPhoto.addEventListener('click', function() {
            showSection('home');
        });
    }

    // ===================================
    // 1) TAB NAVIGATION
    // ===================================
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    function showSection(sectionId) {
        // Hide all sections
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Remove active class from all nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Show the selected section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Add active class to corresponding nav link
            const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }

            // Close mobile menu if open
            const hamburger = document.getElementById('hamburger-menu');
            const nav = document.getElementById('main-nav');
            if (hamburger && nav) {
                console.log("Closing mobile menu...");
                hamburger.classList.remove('active');
                nav.classList.remove('active');
            }

            // Smooth scroll to top of main content
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            console.log("Section not found for id: " + sectionId);
        }
    }

    // Handle navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1); // Remove '#'
            showSection(sectionId);
        });
    });

    // ===================================
    // 2) THEME TOGGLE
    // ===================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    // Check for saved theme preference or default to dark
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
    } else if (!currentTheme && !prefersDark.matches) {
        // If no saved preference and system prefers light
        document.body.classList.add('light-theme');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            document.body.classList.toggle('light-theme');
            
            // Save preference
            const theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
            localStorage.setItem('theme', theme);
            
            // Add a small animation feedback
            this.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                this.style.transform = 'rotate(0deg)';
            }, 300);
        });
    }

    // ===================================
    // 3) SEARCH FUNCTIONALITY
    // ===================================
    const searchBar = document.getElementById('search-bar');
    const searchBtn = document.getElementById('search-btn');

    function performSearch(query) {
        if (!query) {
            // If search is empty, show home section
            showSection('home');
            searchBar.value = '';
            return;
        }

        query = query.toLowerCase();
        let matchedSections = [];

        // Search through all sections
        sections.forEach(section => {
            const sectionText = section.textContent.toLowerCase();
            const sectionId = section.id;

            if (sectionText.includes(query)) {
                matchedSections.push({
                    id: sectionId,
                    element: section
                });
            }
        });

        // Display results
        if (matchedSections.length > 0) {
            // Hide all sections first
            sections.forEach(sec => sec.classList.remove('active'));
            
            // Show all matched sections
            matchedSections.forEach(match => {
                match.element.classList.add('active');
                
                // Highlight search terms (optional enhancement)
                highlightSearchTerm(match.element, query);
            });

            // Scroll to first match
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            // No results found
            showNotification(`No results found for "${query}"`, 'warning');
            showSection('home');
        }
    }

    // Highlight search terms in content
    function highlightSearchTerm(element, term) {
        // Remove previous highlights
        removeHighlights(element);

        if (!term) return;

        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }

        textNodes.forEach(textNode => {
            const text = textNode.textContent;
            const lowerText = text.toLowerCase();
            const lowerTerm = term.toLowerCase();
            
            if (lowerText.includes(lowerTerm)) {
                const parent = textNode.parentNode;
                const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi');
                const parts = text.split(regex);
                
                const fragment = document.createDocumentFragment();
                parts.forEach((part, index) => {
                    if (part.toLowerCase() === lowerTerm) {
                        const mark = document.createElement('mark');
                        mark.className = 'search-highlight';
                        mark.textContent = part;
                        fragment.appendChild(mark);
                    } else if (part) {
                        fragment.appendChild(document.createTextNode(part));
                    }
                });
                
                parent.replaceChild(fragment, textNode);
            }
        });
    }

    // Escape special regex characters
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Remove highlights
    function removeHighlights(element) {
        const highlights = element.querySelectorAll('.search-highlight');
        highlights.forEach(highlight => {
            const parent = highlight.parentNode;
            parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
            parent.normalize();
        });
    }

    // Search on Enter key
    if (searchBar) {
        searchBar.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = this.value.trim();
                performSearch(query);
            }
        });

        // Clear highlights when search is cleared
        searchBar.addEventListener('input', function() {
            if (this.value === '') {
                sections.forEach(section => {
                    removeHighlights(section);
                });
            }
        });
    }

    // Search on button click
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const query = searchBar.value.trim();
            performSearch(query);
        });
    }

    // ===================================
    // 4) NOTIFICATION SYSTEM
    // ===================================
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            backgroundColor: type === 'warning' ? '#ff9800' : '#2196F3',
            color: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            zIndex: '10000',
            animation: 'slideInRight 0.3s ease',
            fontSize: '0.95rem',
            fontWeight: '500'
        });

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Add CSS animations for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }

        .search-highlight {
            background-color: #ffeb3b;
            color: #000;
            padding: 2px 4px;
            border-radius: 3px;
            font-weight: 500;
        }

        .light-theme .search-highlight {
            background-color: #ffd600;
        }
    `;
    document.head.appendChild(style);

    // ===================================
    // 5) SMOOTH SCROLL FOR ANCHOR LINKS
    // ===================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && !this.classList.contains('nav-link')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ===================================
    // 6) KEYBOARD SHORTCUTS
    // ===================================
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchBar.focus();
        }

        // ESC to clear search and show home
        if (e.key === 'Escape' && document.activeElement === searchBar) {
            searchBar.value = '';
            sections.forEach(section => removeHighlights(section));
            showSection('home');
            searchBar.blur();
        }
    });

    // ===================================
    // 7) SECTION ANIMATIONS
    // ===================================
    // Add entrance animations to cards when section becomes active
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe cards and items for animation
    document.querySelectorAll('.education-item, .research-card, .contact-card').forEach(item => {
        observer.observe(item);
    });

    console.log("All features initialized successfully!");
    console.log("Tip: Press Ctrl+K (or Cmd+K) to quickly access search!");
});

// ===================================
// 8) SUPERVISION DETAILS TOGGLE
// ===================================
function toggleDetails(button) {
    const listItem = button.closest('li') || button.closest('.education-item');
    const details = listItem.querySelector('.supervision-details') || listItem.querySelector('.phd-details');
    const isExpanded = details.classList.contains('expanded');
    
    if (isExpanded) {
        details.classList.remove('expanded');
        button.textContent = button.classList.contains('education-read-more') ? 'View Thesis Details' : 'Read More';
    } else {
        details.classList.add('expanded');
        button.textContent = button.classList.contains('education-read-more') ? 'Hide Details' : 'Read Less';
    }
}
