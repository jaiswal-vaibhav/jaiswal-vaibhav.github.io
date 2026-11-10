// ===================================
// Modern JavaScript for Website
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    console.log("Website loaded successfully!");

    // Keep section visibility, navigation links and browser history in sync.
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const searchBar = document.getElementById('search-bar');
    const searchBtn = document.getElementById('search-btn');
    const searchStatus = document.getElementById('search-status');

    // Hide collapsed content from both keyboard and assistive-technology users.
    document.querySelectorAll('.read-more-link[onclick]').forEach((button, index) => {
        const details = button.closest('li, .education-item')?.querySelector('.supervision-details');
        if (!details) return;
        details.id = details.id || `details-${index}`;
        button.setAttribute('aria-controls', details.id);
        setDetailsExpanded(button, details.classList.contains('expanded'));
    });

    function clearSearchResults() {
        sections.forEach(section => removeHighlights(section));
        document.querySelectorAll('.supervision-details[data-search-opened]').forEach(details => {
            const button = details.closest('li, .education-item')?.querySelector('.read-more-link');
            if (button) setDetailsExpanded(button, false);
        });
        if (searchStatus) searchStatus.hidden = true;
    }


    function showSection(sectionId, updateHistory = true) {
        const target = document.getElementById(sectionId);
        if (!target || !target.classList.contains('section')) return;
        clearSearchResults();

        sections.forEach(section => {
            removeHighlights(section);
            section.classList.toggle('active', section === target);
        });
        navLinks.forEach(link => {
            const active = link.getAttribute('href') === `#${sectionId}`;
            link.classList.toggle('active', active);
            if (active) link.setAttribute('aria-current', 'page');
            else link.removeAttribute('aria-current');
        });
        if (updateHistory) {
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
        }
        if (updateHistory && window.location.hash !== `#${sectionId}`) {
            window.history.pushState(null, '', `#${sectionId}`);
        }
        window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }

    function restoreSection() {
        if (searchBar) searchBar.value = '';
        const sectionId = window.location.hash.slice(1);
        const target = document.getElementById(sectionId);
        showSection(target && target.classList.contains('section') ? sectionId : 'home', false);
    }

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(event) {
            const sectionId = this.getAttribute('href').slice(1);
            const target = document.getElementById(sectionId);
            if (target && target.classList.contains('section')) {
                event.preventDefault();
                if (searchBar) searchBar.value = '';
                showSection(sectionId);
            } else if (target) {
                event.preventDefault();
                target.focus({ preventScroll: true });
                target.scrollIntoView({ block: 'start' });
            }
        });
    });
    window.addEventListener('popstate', restoreSection);
    window.addEventListener('hashchange', restoreSection);
    restoreSection();

    // ===================================
    // 2) THEME TOGGLE
    // ===================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    // Check for saved theme preference or default to dark
    let currentTheme = null;
    try { currentTheme = localStorage.getItem('theme'); } catch { /* Storage may be blocked. */ }
    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
    } else if (!currentTheme && !prefersDark.matches) {
        // If no saved preference and system prefers light
        document.body.classList.add('light-theme');
    }

    function updateThemeLabel() {
        if (themeToggleBtn) {
            themeToggleBtn.setAttribute('aria-label', document.body.classList.contains('light-theme')
                ? 'Switch to dark theme' : 'Switch to light theme');
        }
    }
    updateThemeLabel();

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            document.body.classList.toggle('light-theme');
            updateThemeLabel();
            
            // Save preference
            const theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
            try { localStorage.setItem('theme', theme); } catch { /* Keep the toggle usable without storage. */ }
            
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

    function performSearch(query) {
        clearSearchResults();
        if (!query) {
            // Restore the section selected before the search.
            restoreSection();
            searchBar.value = '';
            return;
        }

        query = query.toLowerCase();
        let matchedSections = [];

        // Search through all sections
        sections.forEach(section => {
            const searchable = section.cloneNode(true);
            searchable.querySelectorAll('button, script, style').forEach(node => node.remove());
            const sectionText = searchable.textContent.toLowerCase();
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
            navLinks.forEach(link => {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            });

            // Hide all sections first
            sections.forEach(sec => sec.classList.remove('active'));
            
            // Show all matched sections
            matchedSections.forEach(match => {
                match.element.classList.add('active');
                
                // Highlight search terms (optional enhancement)
                highlightSearchTerm(match.element, query);
                match.element.querySelectorAll('.supervision-details').forEach(details => {
                    if (details.hidden && details.querySelector('.search-highlight')) {
                        const button = details.closest('li, .education-item')?.querySelector('.read-more-link');
                        if (button) {
                            setDetailsExpanded(button, true);
                            details.dataset.searchOpened = 'true';
                        }
                    }
                });
            });

            if (searchStatus) {
                searchStatus.textContent = `${matchedSections.length} matching section${matchedSections.length === 1 ? '' : 's'} for “${query}”.`;
                searchStatus.hidden = false;
            }

            // Scroll to first match
            window.scrollTo({
                top: 0,
                behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
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
            { acceptNode: node => node.parentElement.closest('script, style, button, .read-more-link')
                ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT },
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
                restoreSection();
            }
        });
    }

    // Search on button click
    if (searchBtn && searchBar) {
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
        notification.setAttribute('role', 'status');
        
        // Add styles
        Object.assign(notification.style, {
            maxWidth: 'calc(100vw - 40px)',
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            backgroundColor: type === 'warning' ? '#875000' : '#0066cc',
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
    // 6) KEYBOARD SHORTCUTS
    // ===================================
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K to focus search
        if (searchBar && (e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchBar.focus();
        }

        // ESC to clear search and show home
        if (searchBar && e.key === 'Escape' && document.activeElement === searchBar) {
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

    if (typeof window.IntersectionObserver === 'function' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
    }

    console.log("All features initialized successfully!");
    console.log("Tip: Press Ctrl+K (or Cmd+K) to quickly access search!");
});

// ===================================
// 8) SUPERVISION DETAILS TOGGLE
// ===================================
function setDetailsExpanded(button, expanded) {
    const item = button.closest('li, .education-item');
    const details = item?.querySelector('.supervision-details, .phd-details');
    if (!details) return;
    const isThesis = item.classList.contains('phd-item');
    details.hidden = !expanded;
    details.classList.toggle('expanded', expanded);
    delete details.dataset.searchOpened;
    button.setAttribute('aria-expanded', String(expanded));
    button.textContent = expanded
        ? (isThesis ? 'Hide Details' : 'Read Less')
        : (isThesis ? 'View Thesis Details' : 'Read More');
}

function toggleDetails(button) {
    const details = button.closest('li, .education-item')?.querySelector('.supervision-details, .phd-details');
    if (details) setDetailsExpanded(button, details.hidden);
}
