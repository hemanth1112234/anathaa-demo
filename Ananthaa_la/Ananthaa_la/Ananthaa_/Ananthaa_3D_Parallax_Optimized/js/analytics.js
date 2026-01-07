/**
 * Analytics & A/B Testing Implementation
 * Tracks user interactions and runs A/B tests for conversion optimization
 */

// Configuration
const ANALYTICS_CONFIG = {
    // Google Analytics 4 (replace with your measurement ID)
    GA4_MEASUREMENT_ID: 'G-XXXXXXXXXX',
    
    // A/B Test Configuration
    AB_TESTS: {
        ctaButton: {
            name: 'cta_button_copy',
            variants: [
                { id: 'control', text: 'Schedule a Site Visit', weight: 33 },
                { id: 'variant1', text: 'Get In Touch', weight: 33 },
                { id: 'variant2', text: 'Book a Walkthrough', weight: 34 }
            ]
        },
        newsletterButton: {
            name: 'newsletter_button_color',
            variants: [
                { id: 'control', color: '#4BA958', weight: 50 },
                { id: 'variant1', color: '#2563eb', weight: 50 }
            ]
        }
    },
    
    // Scroll depth tracking
    SCROLL_THRESHOLDS: [25, 50, 75, 90],
    
    // Section tracking
    SECTIONS: {
        about: 'About Us Section',
        team: 'Team Section',
        whyChooseUs: 'Why Choose Us Section',
        cta: 'CTA Section'
    }
};

// Initialize analytics
class AnalyticsTracker {
    constructor() {
        this.userVariant = {};
        this.scrollDepth = 0;
        this.sectionsViewed = new Set();
        this.init();
    }

    init() {
        this.loadGoogleAnalytics();
        this.initializeABTests();
        this.setupEventListeners();
        this.setupScrollTracking();
        this.setupSectionTracking();
    }

    // Google Analytics 4 Setup
    loadGoogleAnalytics() {
        // Load gtag.js
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.GA4_MEASUREMENT_ID}`;
        document.head.appendChild(script);

        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        window.gtag = function() {
            dataLayer.push(arguments);
        };
        gtag('js', new Date());
        gtag('config', ANALYTICS_CONFIG.GA4_MEASUREMENT_ID);
    }

    // A/B Test Implementation
    initializeABTests() {
        // CTA Button Test
        this.runABTest('ctaButton', (variant) => {
            const primaryCTA = document.querySelector('a[href="#schedule-visit"]');
            if (primaryCTA) {
                const span = primaryCTA.querySelector('span');
                if (span) {
                    span.textContent = variant.text;
                }
                this.trackABTestImpression('ctaButton', variant.id);
            }
        });

        // Newsletter Button Color Test
        this.runABTest('newsletterButton', (variant) => {
            const newsletterBtn = document.querySelector('button[type="submit"]');
            if (newsletterBtn) {
                newsletterBtn.style.backgroundColor = variant.color;
                this.trackABTestImpression('newsletterButton', variant.id);
            }
        });
    }

    runABTest(testName, callback) {
        const test = ANALYTICS_CONFIG.AB_TESTS[testName];
        if (!test) return;

        // Check if user already has a variant assigned
        let variant = this.getStoredVariant(testName);
        
        if (!variant) {
            // Assign new variant based on weights
            variant = this.assignVariant(test.variants);
            this.storeVariant(testName, variant);
        }

        this.userVariant[testName] = variant;
        callback(variant);
    }

    assignVariant(variants) {
        const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const variant of variants) {
            random -= variant.weight;
            if (random <= 0) {
                return variant;
            }
        }
        
        return variants[0]; // fallback
    }

    getStoredVariant(testName) {
        const key = `ab_test_${testName}`;
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : null;
    }

    storeVariant(testName, variant) {
        const key = `ab_test_${testName}`;
        localStorage.setItem(key, JSON.stringify(variant));
    }

    // Event Tracking Setup
    setupEventListeners() {
        // Primary CTA clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('a[href="#schedule-visit"]')) {
                this.trackCTAClick('primary', 'Schedule a Site Visit');
            }
            if (e.target.closest('a[href="#projects"]')) {
                this.trackCTAClick('secondary', 'View Projects');
            }
            if (e.target.closest('a[href="#contact"]')) {
                this.trackCTAClick('footer', 'Contact Us');
            }
        });

        // Newsletter signup
        document.addEventListener('submit', (e) => {
            if (e.target.querySelector('input[type="email"]')) {
                this.trackNewsletterSignup();
            }
        });

        // Team member interactions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.group-hover\\:scale-110')) {
                this.trackTeamInteraction();
            }
        });
    }

    // Scroll Depth Tracking
    setupScrollTracking() {
        let timeoutId;
        window.addEventListener('scroll', () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                const scrollPercent = Math.round(
                    (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
                );
                
                ANALYTICS_CONFIG.SCROLL_THRESHOLDS.forEach(threshold => {
                    if (scrollPercent >= threshold && this.scrollDepth < threshold) {
                        this.scrollDepth = threshold;
                        this.trackScrollDepth(threshold);
                    }
                });
            }, 100);
        });
    }

    // Section View Tracking
    setupSectionTracking() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    const sectionName = ANALYTICS_CONFIG.SECTIONS[sectionId];
                    
                    if (sectionName && !this.sectionsViewed.has(sectionId)) {
                        this.sectionsViewed.add(sectionName);
                        this.trackSectionView(sectionName);
                    }
                }
            });
        }, { threshold: 0.5 });

        // Observe sections
        Object.keys(ANALYTICS_CONFIG.SECTIONS).forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) observer.observe(section);
        });
    }

    // Tracking Methods
    trackCTAClick(type, text) {
        gtag('event', 'cta_click', {
            cta_type: type,
            cta_text: text,
            page_location: window.location.pathname
        });

        // Track A/B test variant
        if (type === 'primary' && this.userVariant.ctaButton) {
            gtag('event', 'ab_test_conversion', {
                test_name: 'cta_button_copy',
                variant_id: this.userVariant.ctaButton.id,
                conversion_type: 'cta_click'
            });
        }
    }

    trackNewsletterSignup() {
        gtag('event', 'newsletter_signup', {
            page_location: window.location.pathname
        });

        // Track A/B test variant
        if (this.userVariant.newsletterButton) {
            gtag('event', 'ab_test_conversion', {
                test_name: 'newsletter_button_color',
                variant_id: this.userVariant.newsletterButton.id,
                conversion_type: 'newsletter_signup'
            });
        }
    }

    trackScrollDepth(depth) {
        gtag('event', 'scroll_depth', {
            scroll_percentage: depth,
            page_location: window.location.pathname
        });
    }

    trackSectionView(sectionName) {
        gtag('event', 'section_view', {
            section_name: sectionName,
            page_location: window.location.pathname
        });
    }

    trackTeamInteraction() {
        gtag('event', 'team_interaction', {
            interaction_type: 'profile_click',
            page_location: window.location.pathname
        });
    }

    trackABTestImpression(testName, variantId) {
        gtag('event', 'ab_test_impression', {
            test_name: testName,
            variant_id: variantId,
            page_location: window.location.pathname
        });
    }

    // Analytics Dashboard Data
    getAnalyticsData() {
        return {
            userVariant: this.userVariant,
            scrollDepth: this.scrollDepth,
            sectionsViewed: Array.from(this.sectionsViewed),
            timestamp: new Date().toISOString()
        };
    }
}

// Initialize analytics when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.analyticsTracker = new AnalyticsTracker();
});

// Export for potential external use
window.AnalyticsTracker = AnalyticsTracker;
