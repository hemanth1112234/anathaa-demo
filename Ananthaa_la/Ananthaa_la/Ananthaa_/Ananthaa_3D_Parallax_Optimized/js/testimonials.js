document.addEventListener('DOMContentLoaded', function() {
    // Initialize Swiper for testimonials
    const testimonialSwiper = new Swiper('.testimonial-carousel', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            renderBullet: function (index, className) {
                return '<span class="' + className + '" style="background: #1E6D3D; width: 12px; height: 12px; margin: 0 6px; opacity: 0.3; transition: all 0.3s ease;"></span>';
            },
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            640: {
                slidesPerView: 1,
                spaceBetween: 20,
            },
            1024: {
                slidesPerView: 2,
                spaceBetween: 30,
            },
            1280: {
                slidesPerView: 3,
                spaceBetween: 30,
            }
        },
        on: {
            init: function() {
                // Add animation class to active slide
                const activeSlide = this.slides[this.activeIndex];
                activeSlide.classList.add('animate-fadeIn');
            },
            slideChange: function() {
                // Remove animation class from all slides
                this.slides.forEach(slide => {
                    slide.classList.remove('animate-fadeIn');
                });
                
                // Add animation class to new active slide
                const activeSlide = this.slides[this.activeIndex];
                activeSlide.classList.add('animate-fadeIn');
            }
        }
    });

    // Add hover effect to testimonial cards
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.12)';
            
            // Add shimmer effect to stars
            const stars = this.querySelectorAll('.star-rating i');
            stars.forEach((star, index) => {
                star.style.animation = `starPulse 0.5s ease ${index * 0.1}s`;
            });
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 10px 25px rgba(0,0,0,0.08)';
        });
    });

    // Add animation for star ratings
    const starRatings = document.querySelectorAll('.star-rating');
    starRatings.forEach(rating => {
        const stars = rating.querySelectorAll('i');
        stars.forEach((star, index) => {
            star.style.transition = 'transform 0.3s ease, color 0.3s ease';
            star.addEventListener('mouseover', () => {
                // Highlight stars on hover
                for (let i = 0; i <= index; i++) {
                    stars[i].style.transform = 'scale(1.2)';
                    stars[i].style.color = '#FFD700';
                }
            });
            
            star.addEventListener('mouseout', () => {
                // Reset stars on mouse out
                stars.forEach(s => {
                    s.style.transform = 'scale(1)';
                    s.style.color = ''; // Reset to default color
                });
            });
        });
    });

    // Add animation for profile images
    const profileImages = document.querySelectorAll('.testimonial-profile img');
    profileImages.forEach(img => {
        img.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 10px 25px rgba(30, 109, 61, 0.3)';
        });
        
        img.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        });
    });

    // Add animation for "View All Testimonials" button
    const viewAllBtn = document.querySelector('.view-all-testimonials');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('mouseover', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 10px 20px rgba(30, 109, 61, 0.3)';
        });
        
        viewAllBtn.addEventListener('mouseout', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 12px rgba(30, 109, 61, 0.2)';
        });
    }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes starPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.3); }
        100% { transform: scale(1); }
    }
    
    .animate-fadeIn {
        animation: fadeIn 0.6s ease forwards;
    }
    
    .testimonial-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 10px 25px rgba(0,0,0,0.08);
    }
    
    .testimonial-card:hover {
        transform: translateY(-5px) !important;
        box-shadow: 0 20px 40px rgba(0,0,0,0.12) !important;
    }
    
    .testimonial-profile {
        transition: all 0.3s ease;
    }
    
    .testimonial-profile:hover {
        transform: scale(1.05);
    }
    
    .star-rating i {
        background: linear-gradient(45deg, #FFD700, #FFA500);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(style);
