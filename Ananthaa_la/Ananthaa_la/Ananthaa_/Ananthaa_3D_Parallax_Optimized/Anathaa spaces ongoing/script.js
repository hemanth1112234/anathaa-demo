gsap.registerPlugin(ScrollTrigger);

window.addEventListener("load", () => {
    
    // --- THEME TOGGLE LOGIC (UPDATED FOR MOBILE + DESKTOP) ---
    // Select both desktop and mobile buttons
    const themeBtns = document.querySelectorAll('.theme-toggle-btn');
    const htmlEl = document.documentElement;
    const mobileLabel = document.getElementById('mobile-theme-label');

    // SVG Icons
    const sunIcon = `<path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z"/>`;
    const moonIcon = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;

    // Function to update icon on all buttons and the text label
    function updateThemeUI(theme) {
        // Update Icons
        themeBtns.forEach(btn => {
            const icon = btn.querySelector('svg');
            if (icon) {
                // If dark mode, show Sun (to switch to light). If light, show Moon.
                icon.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
            }
        });

        // Update Text Label
        if (mobileLabel) {
            mobileLabel.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
        }
    }

    // Check saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlEl.setAttribute('data-theme', savedTheme);
    updateThemeUI(savedTheme);

    // Add click event to all theme buttons
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentTheme = htmlEl.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            htmlEl.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeUI(newTheme);
        });
    });

    // 1. Preloader Animation
    const tl = gsap.timeline();
    
    tl.to(".bar-fill", { width: "100%", duration: 1.5, ease: "power2.inOut" })
      .to(".preloader", { yPercent: -100, duration: 0.8, ease: "power4.inOut" })
      .from(".line span", { yPercent: 100, duration: 1, stagger: 0.1, ease: "power3.out" }, "-=0.4"); 

    document.body.classList.remove('is-loading');

    // 2. Mobile Menu Toggle Logic
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu .menu-link');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }

    // 3. Marquee (Continuous Horizontal Scroll)
    gsap.to(".marquee-inner", { xPercent: -50, repeat: -1, duration: 20, ease: "linear" });

    // 4. Hero Parallax 
    gsap.to(".hero-bg img", { yPercent: 30, ease: "none", scrollTrigger: { trigger: ".hero-agency", start: "top top", end: "bottom top", scrub: true } });

    // 5. Staggered Reveals (Fade-in-up animation for content blocks)
    const fadeEls = gsap.utils.toArray(".reveal-el, .spec-card, .bento-box");
    fadeEls.forEach((el, i) => {
        gsap.from(el, { y: 50, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%" } });
    });

    // 6. Magnetic Buttons (Interactive hover effect)
    const magnets = document.querySelectorAll('.btn-magnetic');
    magnets.forEach( (magnet) => {
        magnet.addEventListener('mousemove', (e) => {
            const rect = magnet.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const span = magnet.querySelector('span');
            gsap.to(span, { x: x * 0.4, y: y * 0.4, duration: 0.4, ease: "power1.out" });
        });
        magnet.addEventListener('mouseleave', () => { 
            const span = magnet.querySelector('span');
            gsap.to(span, { x: 0, y: 0, duration: 0.4, ease: "power1.out" }); 
        });
    });


    // 7. Video Modal Logic
    const videoBtn = document.getElementById('play-video-btn-agency');
    const videoModal = document.getElementById('video-modal');
    const closeVideo = document.getElementById('close-video-agency');
    const iframe = videoModal ? videoModal.querySelector('iframe') : null;
    const videoSrc = iframe ? iframe.src : '';
    
    if(videoBtn) {
        videoBtn.addEventListener('click', () => {
            if(videoModal) {
                videoModal.style.display = 'flex';
                // Autoplay video when modal opens
                if (iframe) iframe.src = videoSrc + "&autoplay=1";
            }
        });
    }

    if(closeVideo) {
        closeVideo.addEventListener('click', () => {
            if(videoModal) {
                videoModal.style.display = 'none';
                // Stop video playback when modal closes
                if (iframe) iframe.src = videoSrc.replace("&autoplay=1", "");
            }
        });
    }
    
    // 8. PLAN TABS LOGIC
    const tabs = document.querySelectorAll('.plan-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active state from all tabs and content
            document.querySelectorAll('.plan-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.plan-content').forEach(c => c.classList.remove('active'));

            // Add active state to clicked tab
            tab.classList.add('active');

            // Find and show corresponding content
            const targetId = tab.dataset.target;
            const targetContent = document.getElementById(targetId);
            if(targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // 9. GALLERY MARQUEE SCROLL
    gsap.to(".gallery-marquee-track", { 
        xPercent: -50, 
        repeat: -1, 
        duration: 40, 
        ease: "linear" 
    });


    // 10. LIGHTBOX ZOOM & PAN LOGIC
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const container = document.getElementById('lightbox-container');
    const closeLightbox = document.getElementById('close-lightbox');
    const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
    
    const btnZoomIn = document.getElementById('zoom-in');
    const btnZoomOut = document.getElementById('zoom-out');
    const btnReset = document.getElementById('zoom-reset');

    let scale = 1;
    let panning = false;
    let pointX = 0;
    let pointY = 0;
    let startX = 0;
    let startY = 0;
    
    // FIX: Ensure lightbox is hidden on load via JS
    if (lightbox) {
        lightbox.style.display = 'none';
    }
    
    function updateTransform() {
        lightboxImg.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;
    }

    // Function to open the lightbox
    function openLightbox(src) {
        lightboxImg.src = src;
        scale = 1;
        pointX = 0;
        pointY = 0;
        updateTransform();
        
        lightbox.style.display = 'flex'; 
        lightbox.classList.remove('hidden'); 
        container.classList.add('cursor-grab');
    };
    
    // Add event listeners to all images that should trigger the lightbox
    lightboxTriggers.forEach(img => {
        img.addEventListener('click', () => {
            openLightbox(img.src);
        });
    });

    if(closeLightbox) {
        closeLightbox.addEventListener('click', () => {
            lightbox.style.display = 'none';
            container.classList.remove('cursor-grab', 'cursor-grabbing');
        });
    }

    // Zoom Buttons
    btnZoomIn.addEventListener('click', (e) => {
        e.stopPropagation();
        scale = Math.min(scale + 0.5, 5); 
        updateTransform();
    });

    btnZoomOut.addEventListener('click', (e) => {
        e.stopPropagation();
        scale = Math.max(scale - 0.5, 1);
        updateTransform();
    });

    btnReset.addEventListener('click', (e) => {
        e.stopPropagation();
        scale = 1;
        pointX = 0;
        pointY = 0;
        updateTransform();
    });

    // Wheel Zoom
    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        scale += delta;
        scale = Math.min(Math.max(1, scale), 5);
        updateTransform();
    });

    // Mouse Drag (Pan)
    container.addEventListener('mousedown', (e) => {
        if(scale <= 1) return;
        e.preventDefault();
        startX = e.clientX - pointX;
        startY = e.clientY - pointY;
        panning = true;
        container.classList.add('cursor-grabbing');
    });

    container.addEventListener('mousemove', (e) => {
        if(!panning) return;
        e.preventDefault();
        pointX = e.clientX - startX;
        pointY = e.clientY - startY;
        updateTransform();
    });

    container.addEventListener('mouseup', () => {
        panning = false;
        container.classList.remove('cursor-grabbing');
    });

    container.addEventListener('mouseleave', () => {
        panning = false;
        container.classList.remove('cursor-grabbing');
    });
});