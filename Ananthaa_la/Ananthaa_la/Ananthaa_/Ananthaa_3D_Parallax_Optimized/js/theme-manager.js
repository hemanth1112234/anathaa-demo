/**
 * Global Theme Manager
 * Handles theme persistence and toggling across all pages
 */

(function() {
    'use strict';
    
    const THEME_KEY = 'site-theme-mode';
    const MODES = ['default', 'light', 'dark'];
    
    /**
     * Get saved theme from localStorage
     */
    function getSavedTheme() {
        try {
            return localStorage.getItem(THEME_KEY);
        } catch (e) {
            return null;
        }
    }
    
    /**
     * Save theme to localStorage
     */
    function saveTheme(theme) {
        try {
            localStorage.setItem(THEME_KEY, theme);
        } catch (e) {
            // theme save failed silently
        }
    }
    
    /**
     * Apply theme to document
     */
    function applyTheme(mode) {
        const theme = (mode === 'default' || mode === 'light' || mode === 'dark') ? mode : 'default';
        document.documentElement.setAttribute('data-theme', theme);
        saveTheme(theme);
        
        // Update all toggle buttons
        updateToggleButtons(theme);
        
        return theme;
    }
    
    /**
     * Update toggle button text and state
     */
    function updateToggleButtons(theme) {
        const buttons = document.querySelectorAll('.theme-toggle-single, #theme-toggle, #theme-toggle-mobile');
        buttons.forEach(btn => {
            if (btn) {
                btn.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
                btn.setAttribute('data-mode', theme);
                
                if (theme === 'default') {
                    btn.classList.add('theme-active');
                } else {
                    btn.classList.remove('theme-active');
                }
            }
        });
    }
    
    /**
     * Get next theme in cycle
     */
    function getNextTheme(currentTheme) {
        const idx = MODES.indexOf(currentTheme);
        const nextIdx = (idx + 1) % MODES.length;
        return MODES[nextIdx];
    }
    
    /**
     * Initialize theme on page load
     */
    function initTheme() {
        let saved = getSavedTheme();
        
        // If no saved theme, use system preference
        if (!saved) {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                saved = 'dark';
            } else {
                saved = 'default';
            }
        }
        
        applyTheme(saved);
    }
    
    /**
     * Setup theme toggle buttons
     */
    function setupToggleButtons() {
        const buttons = document.querySelectorAll('.theme-toggle-single, #theme-toggle, #theme-toggle-mobile');
        
        buttons.forEach(btn => {
            btn.addEventListener('click', function() {
                const currentMode = document.documentElement.getAttribute('data-theme') || 'default';
                const nextMode = getNextTheme(currentMode);
                applyTheme(nextMode);
            });
        });
    }
    
    /**
     * Listen for theme changes from other tabs
     */
    function setupStorageListener() {
        window.addEventListener('storage', function(e) {
            if (e.key === THEME_KEY && e.newValue) {
                applyTheme(e.newValue);
            }
        });
    }
    
    /**
     * Initialize everything when DOM is ready
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initTheme();
            setupToggleButtons();
            setupStorageListener();
        });
    } else {
        // DOM already loaded
        initTheme();
        setupToggleButtons();
        setupStorageListener();
    }
    
    // Export to window for manual control if needed
    window.ThemeManager = {
        applyTheme: applyTheme,
        getSavedTheme: getSavedTheme,
        getNextTheme: getNextTheme
    };
})();
