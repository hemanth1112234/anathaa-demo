gsap.registerPlugin(ScrollTrigger);

window.addEventListener("load", () => {
    
    // 1. Preloader Animation
    const tl = gsap.timeline();
    tl.to(".bar-fill", { width: "100%", duration: 1.5, ease: "power2.inOut" })
      .to(".preloader", { yPercent: -100, duration: 0.8, ease: "power4.inOut" })
      .from(".hero-container h1 .line span", { yPercent: 100, duration: 1, stagger: 0.1, ease: "power3.out" }, "-=0.4");

    document.body.classList.add('loaded');

    // 2. Theme Logic
    const themeBtns = document.querySelectorAll('.theme-toggle-btn');
    const html = document.documentElement;
    const mobileLabel = document.getElementById('mobile-theme-label');

    // Check LocalStorage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);

    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    });

    function applyTheme(theme) {
        html.setAttribute('data-theme', theme);
        if(mobileLabel) mobileLabel.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
        
        // Toggle SVGs
        document.querySelectorAll('.theme-icon.sun').forEach(el => el.style.display = theme === 'dark' ? 'block' : 'none');
        document.querySelectorAll('.theme-icon.moon').forEach(el => el.style.display = theme === 'dark' ? 'none' : 'block');
    }

    // 3. Mobile Menu
    const menuToggle = document.querySelector('.menu-toggle');
    const menuClose = document.querySelector('.menu-close-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu .menu-link');

    const toggleMenu = (isActive) => {
        if(isActive) mobileMenu.classList.add('active');
        else mobileMenu.classList.remove('active');
    };

    if(menuToggle) menuToggle.addEventListener('click', () => toggleMenu(true));
    if(menuClose) menuClose.addEventListener('click', () => toggleMenu(false));
    mobileLinks.forEach(link => link.addEventListener('click', () => toggleMenu(false)));

    // 4. Marquee Animation
    gsap.to(".marquee-inner", { xPercent: -50, repeat: -1, duration: 20, ease: "linear" });

    // 5. Hero Parallax
    gsap.to(".hero-bg img", { 
        yPercent: 30, 
        ease: "none", 
        scrollTrigger: { 
            trigger: ".hero-agency", 
            start: "top top", 
            end: "bottom top", 
            scrub: true 
        } 
    });

    // 6. Staggered Reveals
    const fadeEls = gsap.utils.toArray(".bento-box, .spec-card, .intro-text, .footer-bottom, .amenity-item, .badges-row");
    fadeEls.forEach((el) => {
        gsap.from(el, { 
            y: 50, 
            opacity: 0, 
            duration: 0.8, 
            ease: "power3.out", 
            scrollTrigger: { trigger: el, start: "top 90%" } 
        });
    });

    // 7. Magnetic Buttons
    const magnets = document.querySelectorAll('.btn-magnetic');
    magnets.forEach( (magnet) => {
        magnet.addEventListener('mousemove', (e) => {
            const rect = magnet.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(magnet, { x: x * 0.3, y: y * 0.3, duration: 0.3 });
        });
        magnet.addEventListener('mouseleave', () => { gsap.to(magnet, { x: 0, y: 0, duration: 0.3 }); });
    });

    // 8. Video Modal
    const videoTrigger = document.getElementById('video-trigger');
    const videoModal = document.getElementById('video-modal');
    const videoClose = videoModal.querySelector('.modal-close');
    const iframeContainer = videoModal.querySelector('.iframe-container');

    if(videoTrigger) {
        videoTrigger.addEventListener('click', () => {
            videoModal.classList.add('active');
            // Inject your specific YouTube ID: T0-BcDq7jPY
            iframeContainer.innerHTML = '<iframe src="https://www.youtube.com/embed/T0-BcDq7jPY?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
        });

        const closeVideo = () => {
            videoModal.classList.remove('active');
            iframeContainer.innerHTML = ''; // Stop video
        };
        
        videoClose.addEventListener('click', closeVideo);
        videoModal.querySelector('.modal-bg').addEventListener('click', closeVideo);
    }
});