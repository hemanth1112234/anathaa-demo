// js/header.js
// Handles mobile menu toggle and theme button (basic version)
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu open
    var menuBtn = document.getElementById('mobile-menu-btn');
    var mobileMenuPanel = document.getElementById('mobile-menu-panel');
    var closeBtn = document.getElementById('close-mobile-menu');

    if (menuBtn && mobileMenuPanel) {
        menuBtn.addEventListener('click', function() {
            mobileMenuPanel.classList.remove('hidden');
        });
    }
    if (closeBtn && mobileMenuPanel) {
        closeBtn.addEventListener('click', function() {
            mobileMenuPanel.classList.add('hidden');
        });
    }

    // Theme toggle (desktop)
    var themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
        });
    }
    // Theme toggle (mobile)
    var themeToggleMobile = document.getElementById('theme-toggle-mobile');
    if (themeToggleMobile) {
        themeToggleMobile.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
        });
    }
});
