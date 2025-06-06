// Animation utilities and effects for Mayuge High School website
(function() {
    'use strict';

    // Animation configuration
    const ANIMATION_CONFIG = {
        duration: {
            fast: 200,
            normal: 400,
            slow: 600
        },
        easing: {
            easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
            easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
            easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
            bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
        },
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    let animationObserver;
    let isReducedMotion = false;

    // Initialize animations when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        checkReducedMotion();
        initScrollAnimations();
        initHoverAnimations();
        initLoadAnimations();
        initCountUpAnimations();
        initParallaxEffects();
        initTypingAnimations();
        initMorphingBackground();
    });

    // Check for reduced motion preference
    function checkReducedMotion() {
        isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (isReducedMotion) {
            document.documentElement.style.setProperty('--transition-fast', '0.01ms');
            document.documentElement.style.setProperty('--transition-normal', '0.01ms');
            document.documentElement.style.setProperty('--transition-slow', '0.01ms');
        }
    }

    // Enhanced scroll animations with Intersection Observer
    function initScrollAnimations() {
        if (!('IntersectionObserver' in window)) {
            // Fallback for browsers without Intersection Observer
            fallbackScrollAnimations();
            return;
        }

        const observerOptions = {
            threshold: ANIMATION_CONFIG.threshold,
            rootMargin: ANIMATION_CONFIG.rootMargin
        };

        animationObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateElement(entry.target);
                    
                    // Stagger animations for grouped elements
                    const groupElements = entry.target.closest('.animate-group')?.querySelectorAll('.animate-on-scroll');
                    if (groupElements && groupElements.length > 1) {
                        staggerAnimations(groupElements);
                    }
                }
            });
        }, observerOptions);

        // Observe all elements with animation classes
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(el => {
            if (!isReducedMotion) {
                animationObserver.observe(el);
            } else {
                el.classList.add('animate');
            }
        });
    }

    // Animate individual element
    function animateElement(element) {
        if (element.classList.contains('animate')) return;

        const animationType = element.dataset.animation || 'fadeInUp';
        const delay = parseInt(element.dataset.delay) || 0;
        const duration = parseInt(element.dataset.duration) || ANIMATION_CONFIG.duration.normal;

        setTimeout(() => {
            element.classList.add('animate');
            element.style.setProperty('--animation-duration', `${duration}ms`);
            
            // Apply specific animation based on type
            applyAnimation(element, animationType);
            
            // Trigger custom event
            element.dispatchEvent(new CustomEvent('elementAnimated', {
                detail: { animationType, element }
            }));
        }, delay);
    }

    // Apply specific animation types
    function applyAnimation(element, type) {
        element.classList.add(`animate-${type}`);
        
        switch(type) {
            case 'fadeInUp':
                element.style.transform = 'translateY(0)';
                element.style.opacity = '1';
                break;
            case 'fadeInLeft':
                element.style.transform = 'translateX(0)';
                element.style.opacity = '1';
                break;
            case 'fadeInRight':
                element.style.transform = 'translateX(0)';
                element.style.opacity = '1';
                break;
            case 'scaleIn':
                element.style.transform = 'scale(1)';
                element.style.opacity = '1';
                break;
            case 'rotateIn':
                element.style.transform = 'rotate(0deg)';
                element.style.opacity = '1';
                break;
            default:
                element.style.opacity = '1';
        }
    }

    // Stagger animations for grouped elements
    function staggerAnimations(elements) {
        elements.forEach((el, index) => {
            if (!el.classList.contains('animate')) {
                setTimeout(() => {
                    animateElement(el);
                }, index * 100);
            }
        });
    }

    // Fallback for browsers without Intersection Observer
    function fallbackScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        function checkAnimations() {
            animatedElements.forEach(el => {
                if (isElementInViewport(el) && !el.classList.contains('animate')) {
                    animateElement(el);
                }
            });
        }
        
        window.addEventListener('scroll', throttle(checkAnimations, 100));
        window.addEventListener('resize', throttle(checkAnimations, 100));
        checkAnimations(); // Initial check
    }

    // Check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Hover animations for interactive elements
    function initHoverAnimations() {
        const hoverElements = document.querySelectorAll('.hover-animate');
        
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                if (!isReducedMotion) {
                    this.style.transform = 'translateY(-5px) scale(1.02)';
                    this.style.transition = `transform ${ANIMATION_CONFIG.duration.fast}ms ${ANIMATION_CONFIG.easing.easeOut}`;
                }
            });
            
            element.addEventListener('mouseleave', function() {
                if (!isReducedMotion) {
                    this.style.transform = '';
                }
            });
        });

        // Card hover effects
        const cards = document.querySelectorAll('.program-card, .news-card, .facility-card, .value-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                if (!isReducedMotion) {
                    this.style.transform = 'translateY(-8px)';
                    this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                if (!isReducedMotion) {
                    this.style.transform = '';
                    this.style.boxShadow = '';
                }
            });
        });
    }

    // Page load animations
    function initLoadAnimations() {
        window.addEventListener('load', function() {
            // Animate hero section
            const heroTitle = document.querySelector('.hero-title');
            const heroSubtitle = document.querySelector('.hero-subtitle');
            const heroButtons = document.querySelector('.hero-buttons');
            
            if (heroTitle && !isReducedMotion) {
                setTimeout(() => {
                    heroTitle.style.opacity = '1';
                    heroTitle.style.transform = 'translateY(0)';
                }, 300);
            }
            
            if (heroSubtitle && !isReducedMotion) {
                setTimeout(() => {
                    heroSubtitle.style.opacity = '1';
                    heroSubtitle.style.transform = 'translateY(0)';
                }, 500);
            }
            
            if (heroButtons && !isReducedMotion) {
                setTimeout(() => {
                    heroButtons.style.opacity = '1';
                    heroButtons.style.transform = 'translateY(0)';
                }, 700);
            }
        });
    }

    // Count-up animations for statistics
    function initCountUpAnimations() {
        const countElements = document.querySelectorAll('.stat-number');
        
        countElements.forEach(element => {
            const target = parseInt(element.textContent.replace(/[^\d]/g, ''));
            const suffix = element.textContent.replace(/[\d]/g, '');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCount(element, 0, target, suffix, 2000);
                        observer.unobserve(element);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(element);
        });
    }

    // Animate counting numbers
    function animateCount(element, start, end, suffix, duration) {
        if (isReducedMotion) {
            element.textContent = end + suffix;
            return;
        }

        const range = end - start;
        const increment = Math.max(1, Math.floor(range / 100));
        const stepTime = Math.max(10, Math.floor(duration / (range / increment)));
        
        let current = start;
        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = current + suffix;
        }, stepTime);
    }

    // Parallax effects
    function initParallaxEffects() {
        if (isReducedMotion) return;

        const parallaxElements = document.querySelectorAll('.parallax');
        
        if (parallaxElements.length === 0) return;

        function updateParallax() {
            const scrollTop = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = parseFloat(element.dataset.speed) || 0.5;
                const yPos = -(scrollTop * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        }
        
        window.addEventListener('scroll', throttle(updateParallax, 10));
    }

    // Typing animation for text elements
    function initTypingAnimations() {
        const typingElements = document.querySelectorAll('.typing-text');
        
        typingElements.forEach(element => {
            const text = element.textContent;
            const speed = parseInt(element.dataset.speed) || 50;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        typeText(element, text, speed);
                        observer.unobserve(element);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(element);
        });
    }

    // Type text animation
    function typeText(element, text, speed) {
        if (isReducedMotion) {
            element.textContent = text;
            return;
        }

        element.textContent = '';
        let i = 0;
        
        const typeTimer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeTimer);
                element.classList.add('typing-complete');
            }
        }, speed);
    }

    // Morphing background animation
    function initMorphingBackground() {
        const morphingBg = document.querySelector('.morphing-background');
        
        if (!morphingBg || isReducedMotion) return;

        let angle = 0;
        
        function updateMorphing() {
            angle += 0.5;
            const gradient = `linear-gradient(${angle}deg, 
                hsl(220, 100%, 50%) 0%, 
                hsl(220, 100%, 40%) 50%, 
                hsl(35, 100%, 55%) 100%)`;
            morphingBg.style.background = gradient;
            
            requestAnimationFrame(updateMorphing);
        }
        
        updateMorphing();
    }

    // Button click animations
    function initButtonAnimations() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                if (isReducedMotion) return;

                // Create ripple effect
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    // Scroll-triggered animations for specific elements
    function initScrollTriggeredAnimations() {
        // Animate navigation items on scroll
        const navLinks = document.querySelectorAll('.nav-link');
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const scrollDirection = scrollY > lastScrollY ? 'down' : 'up';
            
            if (!isReducedMotion) {
                navLinks.forEach((link, index) => {
                    const delay = index * 50;
                    setTimeout(() => {
                        if (scrollDirection === 'down') {
                            link.style.transform = 'translateY(-2px)';
                        } else {
                            link.style.transform = 'translateY(0)';
                        }
                    }, delay);
                });
            }
            
            lastScrollY = scrollY;
        });
    }

    // Utility function to throttle events
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Utility function to debounce events
    function debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    // Create custom CSS animations
    function createAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            @keyframes pulse {
                0%, 100% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.05);
                }
            }
            
            @keyframes float {
                0%, 100% {
                    transform: translateY(0px);
                }
                50% {
                    transform: translateY(-10px);
                }
            }
            
            @keyframes glow {
                0%, 100% {
                    box-shadow: 0 0 5px rgba(0, 102, 255, 0.3);
                }
                50% {
                    box-shadow: 0 0 20px rgba(0, 102, 255, 0.6);
                }
            }
            
            .animate-pulse {
                animation: pulse 2s infinite;
            }
            
            .animate-float {
                animation: float 3s ease-in-out infinite;
            }
            
            .animate-glow {
                animation: glow 2s ease-in-out infinite;
            }
        `;
        
        document.head.appendChild(style);
    }

    // Initialize additional animations
    document.addEventListener('DOMContentLoaded', function() {
        createAnimationStyles();
        initButtonAnimations();
        initScrollTriggeredAnimations();
    });

    // Public API for animations
    window.Animations = {
        animate: animateElement,
        countUp: animateCount,
        typeText: typeText,
        
        // Method to trigger custom animations
        trigger: function(element, animationType, options = {}) {
            if (typeof element === 'string') {
                element = document.querySelector(element);
            }
            
            if (element) {
                element.dataset.animation = animationType;
                element.dataset.delay = options.delay || 0;
                element.dataset.duration = options.duration || ANIMATION_CONFIG.duration.normal;
                animateElement(element);
            }
        },
        
        // Method to check if animations are enabled
        isEnabled: function() {
            return !isReducedMotion;
        },
        
        // Method to disable all animations
        disable: function() {
            isReducedMotion = true;
            document.documentElement.style.setProperty('--transition-fast', '0.01ms');
            document.documentElement.style.setProperty('--transition-normal', '0.01ms');
            document.documentElement.style.setProperty('--transition-slow', '0.01ms');
        },
        
        // Method to enable animations
        enable: function() {
            isReducedMotion = false;
            document.documentElement.style.removeProperty('--transition-fast');
            document.documentElement.style.removeProperty('--transition-normal');
            document.documentElement.style.removeProperty('--transition-slow');
        }
    };

})();
