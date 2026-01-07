// A/B Testing and Analytics for Our Values Section
(function() {
  'use strict';
  
  // A/B Test Configuration
  const AB_TESTS = {
    overlay: {
      variants: ['default', 'dark'],
      weights: [0.5, 0.5],
      current: null
    },
    icon: {
      variants: ['solid', 'outline'],
      weights: [0.5, 0.5],
      current: null
    },
    radius: {
      variants: ['12px', '18px'],
      weights: [0.5, 0.5],
      current: null
    }
  };
  
  // Analytics tracking
  const analytics = {
    track: function(event, data) {
      // Google Analytics 4 example
      if (typeof gtag !== 'undefined') {
        gtag('event', event, data);
      }
      
      // Store in localStorage for metrics
      const events = JSON.parse(localStorage.getItem('values_analytics') || '[]');
      events.push({
        event,
        data,
        timestamp: Date.now(),
        url: window.location.href
      });
      localStorage.setItem('values_analytics', JSON.stringify(events));
    },
    
    initMetrics: function() {
      // Track section view
      this.track('values_section_view', {
        test_variant: this.getCurrentVariant(),
        viewport_width: window.innerWidth,
        timestamp: Date.now()
      });
    },
    
    getCurrentVariant: function() {
      return {
        overlay: AB_TESTS.overlay.current,
        icon: AB_TESTS.icon.current,
        radius: AB_TESTS.radius.current
      };
    }
  };
  
  // Initialize A/B tests
  function initABTests() {
    const valuesSection = document.querySelector('.our-values');
    if (!valuesSection) return;
    
    // Get or assign test variants
    Object.keys(AB_TESTS).forEach(testName => {
      const test = AB_TESTS[testName];
      const stored = localStorage.getItem(`ab_test_${testName}`);
      
      if (stored) {
        test.current = stored;
      } else {
        // Random assignment based on weights
        const random = Math.random();
        let cumulative = 0;
        
        for (let i = 0; i < test.variants.length; i++) {
          cumulative += test.weights[i];
          if (random <= cumulative) {
            test.current = test.variants[i];
            break;
          }
        }
        
        localStorage.setItem(`ab_test_${testName}`, test.current);
      }
      
      // Apply variant
      applyVariant(testName, test.current);
    });
    
    analytics.initMetrics();
  }
  
  // Apply A/B test variant
  function applyVariant(testName, variant) {
    const valuesSection = document.querySelector('.our-values');
    if (!valuesSection) return;
    
    switch(testName) {
      case 'overlay':
        if (variant === 'dark') {
          valuesSection.classList.add('ab-test-overlay-dark');
        }
        break;
      case 'icon':
        if (variant === 'outline') {
          valuesSection.classList.add('ab-test-icon-outline');
        }
        break;
      case 'radius':
        if (variant === '18px') {
          valuesSection.classList.add('ab-test-radius-large');
        }
        break;
    }
  }
  
  // Track card interactions
  function trackCardInteractions() {
    const cards = document.querySelectorAll('.value-card[data-track]');
    
    cards.forEach(card => {
      // Track clicks
      card.addEventListener('click', function() {
        analytics.track('values_card_click', {
          card_name: this.dataset.track,
          test_variant: analytics.getCurrentVariant(),
          position: Array.from(cards).indexOf(this) + 1
        });
      });
      
      // Track hover start (engagement)
      let hoverTimer;
      card.addEventListener('mouseenter', function() {
        hoverTimer = setTimeout(() => {
          analytics.track('values_card_hover', {
            card_name: this.dataset.track,
            test_variant: analytics.getCurrentVariant(),
            position: Array.from(cards).indexOf(this) + 1
          });
        }, 500); // Only track if hover for 500ms+
      });
      
      card.addEventListener('mouseleave', function() {
        clearTimeout(hoverTimer);
      });
      
      // Track visibility (scroll depth)
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            analytics.track('values_card_visible', {
              card_name: entry.target.dataset.track,
              test_variant: analytics.getCurrentVariant(),
              position: Array.from(cards).indexOf(entry.target) + 1
            });
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(card);
    });
  }
  
  // Track time on section
  function trackTimeOnSection() {
    const valuesSection = document.querySelector('.our-values');
    if (!valuesSection) return;
    
    let startTime = null;
    let hasTracked = false;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !startTime) {
          startTime = Date.now();
        } else if (!entry.isIntersecting && startTime && !hasTracked) {
          const timeSpent = Date.now() - startTime;
          analytics.track('values_section_time', {
            time_spent_ms: timeSpent,
            time_spent_seconds: Math.round(timeSpent / 1000),
            test_variant: analytics.getCurrentVariant()
          });
          hasTracked = true;
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(valuesSection);
  }
  
  // Hero parallax effect (desktop only)
  function initParallax() {
    if (window.innerWidth < 1024) return;
    
    const heroBackground = document.querySelector('.hero-background');
    if (!heroBackground) return;
    
    let ticking = false;
    
    function updateParallax() {
      const scrolled = window.pageYOffset;
      const parallax = scrolled * -0.5; // Adjust speed multiplier
      
      heroBackground.style.setProperty('--scroll-y', `${parallax}px`);
      heroBackground.classList.add('hero-parallax');
      
      ticking = false;
    }
    
    function requestTick() {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
  }
  
  // Initialize everything
  function init() {
    initABTests();
    trackCardInteractions();
    trackTimeOnSection();
    initParallax();
    
    // Track page unload for final metrics
    window.addEventListener('beforeunload', () => {
      analytics.track('values_section_exit', {
        test_variant: analytics.getCurrentVariant(),
        total_time_on_page: performance.now()
      });
    });
  }
  
  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Expose analytics for debugging
  window.valuesAnalytics = analytics;
})();
