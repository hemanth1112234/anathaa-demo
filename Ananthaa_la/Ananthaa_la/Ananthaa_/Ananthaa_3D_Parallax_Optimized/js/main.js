// Mobile menu single theme toggle button logic
document.addEventListener('DOMContentLoaded', function() {
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    if (!themeToggleMobile) return;
    const modes = ['default', 'light', 'dark'];
    let current = 0;
    try {
        const saved = localStorage.getItem('site-theme-mode');
        if (saved) {
            current = modes.indexOf(saved);
            if (current === -1) current = 0;
        }
    } catch (e) { current = 0; }
    function updateBtn() {
        themeToggleMobile.textContent = modes[current].charAt(0).toUpperCase() + modes[current].slice(1);
        if (modes[current] === 'dark') {
            themeToggleMobile.classList.add('dark');
        } else {
            themeToggleMobile.classList.remove('dark');
        }
    }
    updateBtn();
    themeToggleMobile.addEventListener('click', function() {
        current = (current + 1) % modes.length;
        document.documentElement.setAttribute('data-theme', modes[current]);
        try { localStorage.setItem('site-theme-mode', modes[current]); } catch(e) {}
        updateBtn();
    });
});
// Toggle between ongoing and upcoming projects
function switchProjects(type) {
    const ongoingBtn = document.getElementById('ongoing-btn');
    const upcomingBtn = document.getElementById('upcoming-btn');
    const indicator = document.getElementById('toggle-indicator');
    const ongoingSection = document.getElementById('ongoing-projects');
    const upcomingSection = document.getElementById('upcoming-projects');

    // Update button states
    ongoingBtn.setAttribute('aria-pressed', type === 'ongoing');
    upcomingBtn.setAttribute('aria-pressed', type === 'upcoming');

    // Animate indicator to match the active button
    if (indicator) {
        indicator.style.transform = type === 'ongoing' ? 'translateX(0)' : 'translateX(100%)';
        indicator.style.background = type === 'ongoing'
            ? 'linear-gradient(135deg, #D4AF37 0%, #F9E79F 100%)'
            : 'linear-gradient(135deg, #F9E79F 0%, #D4AF37 100%)';
    }

    if (type === 'ongoing') {
        ongoingBtn.classList.add('text-gray-900', 'font-semibold');
        upcomingBtn.classList.remove('text-gray-900', 'font-semibold');
        document.getElementById('ongoing-projects').classList.remove('hidden');
        document.getElementById('upcoming-projects').classList.add('hidden');
    } else {
        ongoingBtn.classList.remove('text-gray-900', 'font-semibold');
        upcomingBtn.classList.add('text-gray-900', 'font-semibold');
        document.getElementById('ongoing-projects').classList.add('hidden');
        document.getElementById('upcoming-projects').classList.remove('hidden');
    }


// On DOMContentLoaded, set indicator to match default active button
document.addEventListener('DOMContentLoaded', function() {
    const ongoingBtn = document.getElementById('ongoing-btn');
    const indicator = document.getElementById('toggle-indicator');
    if (ongoingBtn && indicator) {
        const rect = ongoingBtn.getBoundingClientRect();
        const parentRect = ongoingBtn.parentElement.getBoundingClientRect();
        indicator.style.width = rect.width + 'px';
        indicator.style.left = (rect.left - parentRect.left) + 'px';
    }
});
}

function initGalleryParallax() {
    // Parallax on the hero image inside the gallery card
    const heroImg = document.querySelector('#gallery [data-parallax-img]');
    if (!heroImg) return;

    function onScroll() {
        const rect = heroImg.getBoundingClientRect();
        const viewportH = window.innerHeight || document.documentElement.clientHeight;

        // Progress: how far the hero is into the viewport
        let progress = 1 - rect.top / viewportH;
        progress = Math.min(Math.max(progress, 0), 1.2);

        const translateY = progress * 30; // tune strength
        heroImg.style.transform = `translateY(${translateY}px) scale(1.05)`;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}
/**
 * Main JavaScript for Ananthaa Spaces
 * Handles site-wide interactivity
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initSmoothScroll();
    initScrollToTop();
    initScrollHeader();
    initTestimonialSlider();
    initGalleryLightbox();
    initGalleryParallax();
    initFormValidation();
    initThemeToggle();
    initProjectTabs();
    initModernMobileMenu();
});
/**
 * Modern mobile menu panel logic for new menu button
 */
function initModernMobileMenu() {
    const openBtn = document.getElementById('mobile-menu-btn');
    const panel = document.getElementById('mobile-menu-panel');
    const closeBtn = document.getElementById('close-mobile-menu');
    if (!openBtn || !panel || !closeBtn) return;

    // Hide panel by default
    panel.classList.remove('active');

    function showPanel() {
        panel.classList.add('active');
        document.body.classList.add('overflow-hidden');
    }
    function hidePanel() {
        panel.classList.remove('active');
        document.body.classList.remove('overflow-hidden');
    }

    openBtn.addEventListener('click', showPanel);
    closeBtn.addEventListener('click', hidePanel);
    // Close menu when clicking a nav link
    panel.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', hidePanel);
    });
}

/**
 * Smooth scrolling for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobile-menu');
                if (!mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden', '-translate-y-full');
                    mobileMenu.classList.remove('translate-y-0');
                    const menuIcon = document.getElementById('menu-icon');
                    if (menuIcon) menuIcon.className = 'fas fa-bars text-2xl';
                }
            }
        });
    });
}

/**
 * Scroll to top functionality
 */
function initScrollToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    if (!backToTopButton) return;
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.remove('opacity-0', 'invisible');
            backToTopButton.classList.add('opacity-100', 'visible');
        } else {
            backToTopButton.classList.remove('opacity-100', 'visible');
            backToTopButton.classList.add('opacity-0', 'invisible');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/**
 * Mobile menu toggle
 */

/**
 * Header scroll effect
 */
function initScrollHeader() {
    const header = document.getElementById('main-header');
    if (!header) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('shadow-md', 'bg-opacity-95', 'backdrop-blur-sm');
            return;
        }
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scrolling down
            header.classList.add('-translate-y-full');
            header.classList.remove('shadow-md');
        } else {
            // Scrolling up
            header.classList.remove('-translate-y-full');
            header.classList.add('shadow-md', 'bg-opacity-95', 'backdrop-blur-sm');
        }
        
        lastScroll = currentScroll;
    });
}

/**
 * Header theme toggle (default / light / dark)
 * Applies data-theme on <html> and persists to localStorage
 */
function initThemeToggle() {
    const html = document.documentElement;
    const btnDefault = document.getElementById('theme-default');
    const btnLight = document.getElementById('theme-light');
    const btnDark = document.getElementById('theme-dark');
    const btnDefaultMobile = document.getElementById('theme-default-mobile');
    const btnLightMobile = document.getElementById('theme-light-mobile');
    const btnDarkMobile = document.getElementById('theme-dark-mobile');

    if (!btnDefault && !btnLight && !btnDark) return;

    const buttons = [btnDefault, btnLight, btnDark, btnDefaultMobile, btnLightMobile, btnDarkMobile].filter(Boolean);

    function applyTheme(mode) {
        const theme = mode === 'default' || mode === 'light' || mode === 'dark' ? mode : 'default';
        html.setAttribute('data-theme', theme);
        localStorage.setItem('site-theme-mode', mode);

        buttons.forEach(btn => {
            const btnMode = btn.getAttribute('data-theme-mode');
            if (btnMode === mode) {
                btn.classList.add('theme-toggle-active');
            } else {
                btn.classList.remove('theme-toggle-active');
            }
        });
    }

    let savedMode = null;
    try {
        savedMode = localStorage.getItem('site-theme-mode');
    } catch (e) {
        savedMode = null;
    }

    if (savedMode !== 'default' && savedMode !== 'light' && savedMode !== 'dark') {
        // Fallback: respect system preference on first visit, but store as one of our modes
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            savedMode = 'dark';
        } else {
            savedMode = 'light';
        }
    }

    applyTheme(savedMode);

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.getAttribute('data-theme-mode');
            if (!mode) return;
            applyTheme(mode);
        });
    });
}

/**
 * Testimonial slider
 */
function initTestimonialSlider() {
    const slider = document.querySelector('.testimonial-slider');
    if (!slider) return;
    
    // Implementation for testimonial slider
    // This would be customized based on your preferred slider library
    // Example with Swiper.js:
    /*
    new Swiper('.testimonial-slider', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 30,
        navigation: {
            nextEl: '.testimonial-next',
            prevEl: '.testimonial-prev',
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            }
        }
    });
    */
}

/**
 * Gallery lightbox
 */
let galleryLightboxInitialized = false;
let galleryLightboxOverlay = null;

function initGalleryLightbox() {
    if (galleryLightboxInitialized) return;
    galleryLightboxInitialized = true;

    const galleryItems = Array.from(document.querySelectorAll('#gallery [data-gallery-index]'));
    if (!galleryItems.length) return;

    // Remove any existing overlays to prevent duplicates
    const existingOverlays = document.querySelectorAll('.gallery-lightbox-overlay');
    existingOverlays.forEach(el => {
        if (el !== galleryLightboxOverlay) el.remove();
    });

    // Build overlay once and reuse
    if (!galleryLightboxOverlay) {
        galleryLightboxOverlay = document.createElement('div');
        galleryLightboxOverlay.className = 'gallery-lightbox-overlay';
        galleryLightboxOverlay.innerHTML = `
            <div class="gallery-lightbox-backdrop" data-gallery-close></div>
            <div class="gallery-lightbox-dialog">
                <button class="gallery-lightbox-arrow gallery-lightbox-arrow-left" type="button" data-gallery-prev aria-label="Previous image">‹</button>
                <button class="gallery-lightbox-arrow gallery-lightbox-arrow-right" type="button" data-gallery-next aria-label="Next image">›</button>

                <div class="gallery-lightbox-image-wrapper">
                    <img src="" alt="" id="gallery-lightbox-image">
                </div>

                <div class="gallery-lightbox-footer">
                    <div class="gallery-lightbox-meta">
                        <!-- caption removed -->
                        <div class="gallery-lightbox-counter" id="gallery-lightbox-counter"></div>
                    </div>
                    <button class="gallery-lightbox-close" type="button" data-gallery-close>
                        <span>Close</span>
                        <span aria-hidden="true">✕</span>
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(galleryLightboxOverlay);
    }

    const overlay = galleryLightboxOverlay;
    const imgEl = overlay.querySelector('#gallery-lightbox-image');
    const counterEl = overlay.querySelector('#gallery-lightbox-counter');
    const prevBtn = overlay.querySelector('[data-gallery-prev]');
    const nextBtn = overlay.querySelector('[data-gallery-next]');

    let currentIndex = 0;

    function showByIndex(index) {
        const total = galleryItems.length;
        currentIndex = (index + total) % total;

        const item = galleryItems[currentIndex];
        const img = item.querySelector('img');

        imgEl.src = img.src;
        imgEl.alt = img.alt || 'Gallery Image';
        counterEl.textContent = `Image ${currentIndex + 1} of ${total}`;
    }

    function openLightbox(index) {
        showByIndex(index);
        overlay.classList.add('is-visible');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        overlay.classList.remove('is-visible');
        document.body.style.overflow = '';
    }

    function showNext() { showByIndex(currentIndex + 1); }
    function showPrev() { showByIndex(currentIndex - 1); }

    // Clear old listeners and add new ones only once
    if (prevBtn && !prevBtn._galleryListenerAdded) {
        prevBtn.addEventListener('click', showPrev);
        prevBtn._galleryListenerAdded = true;
    }
    
    if (nextBtn && !nextBtn._galleryListenerAdded) {
        nextBtn.addEventListener('click', showNext);
        nextBtn._galleryListenerAdded = true;
    }

    // Close button listeners
    const closeEls = overlay.querySelectorAll('[data-gallery-close]');
    closeEls.forEach(el => {
        if (!el._galleryListenerAdded) {
            el.addEventListener('click', closeLightbox);
            el._galleryListenerAdded = true;
        }
    });

    // Gallery item click handlers using event delegation
    const galleryGrid = document.querySelector('.gallery-grid');
    if (galleryGrid && !galleryGrid._galleryListenerAdded) {
        galleryGrid.addEventListener('click', function(e) {
            const item = e.target.closest('[data-gallery-index]');
            if (item) {
                const index = Number(item.dataset.galleryIndex);
                openLightbox(index);
            }
        });
        galleryGrid._galleryListenerAdded = true;
    }

    // Keyboard navigation - only add once
    if (!window._galleryLightboxKeyHandler) {
        window._galleryLightboxKeyHandler = function(e) {
            if (!overlay.classList.contains('is-visible')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') showNext();
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') showPrev();
        };
        document.addEventListener('keydown', window._galleryLightboxKeyHandler);
    }
}

/**
 * Form validation
 */
function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');
    if (!forms.length) return;
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!this.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            this.classList.add('was-validated');
        }, false);
        
        // Add real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                if (this.checkValidity()) {
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');
                } else {
                    this.classList.remove('is-valid');
                    this.classList.add('is-invalid');
                }
            });
        });
    });
}

/**
 * Debounce function for performance optimization
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function for scroll/resize events
 */
function throttle(callback, limit) {
    let waiting = false;
    return function() {
        if (!waiting) {
            callback.apply(this, arguments);
            waiting = true;
            setTimeout(function() {
                waiting = false;
            }, limit);
        }
    };
}

/**
 * Initialize project tabs functionality
 */
function initProjectTabs() {
    const tabs = document.querySelectorAll('.project-tab');
    const projectContents = document.querySelectorAll('.project-content');
    
    if (tabs.length === 0 || projectContents.length === 0) return;
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            tabs.forEach(t => {
                t.classList.remove('active', 'text-primary', 'border-primary');
                t.classList.add('text-gray-500', 'border-transparent');
            });
            
            projectContents.forEach(content => content.classList.add('hidden'));
            
            // Add active class to clicked tab
            tab.classList.add('active', 'text-primary', 'border-primary');
            tab.classList.remove('text-gray-500', 'border-transparent');
            
            // Show corresponding content
            const tabId = tab.getAttribute('data-tab');
            const activeContent = document.getElementById(`${tabId}-projects`);
            if (activeContent) {
                activeContent.classList.remove('hidden');
                activeContent.classList.add('grid');
            }
        });
    });
}

/**
 * Simple Hero Section - CSS Animation (No Scroll JS)
 * Text box fades in and slides up automatically using CSS keyframes
 */
function initHeroAnimation() {
    // Animation is handled entirely by CSS keyframes
    // No JavaScript scroll calculations needed
    const heroTextBox = document.querySelector('.hero-text-box');
    
    if (heroTextBox) {
        // Text box will animate on page load automatically via CSS
        // No manual manipulation needed
        console.log('Hero animation initialized');
    }
}


// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initHeroAnimation);

// Scroll-triggered counter animation
function animateCounter(el, duration) {
    const target = Number(el.dataset.target || '0');
    const suffix = el.dataset.suffix || '';
    let start = null;

    function step(timestamp) {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const current = Math.floor(progress * target);
        el.textContent = current.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
}

document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target, 1500); // 1.5s animation
                obs.unobserve(entry.target);        // run only once
            }
        });
    }, { threshold: 0.4 });

    counters.forEach(el => observer.observe(el));
});


