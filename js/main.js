// Main JavaScript file for Mayuge High School website
(function() {
    'use strict';

    // DOM Elements
    const body = document.body;
    const navbar = document.querySelector('.navbar');
    
    // Initialize all functionality when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        initScrollAnimations();
        initSmoothScrolling();
        initNavbarScroll();
        initTabs();
        initFilterButtons();
        initFormValidation();
        initGalleryModal();
        initNewsletterForm();
        initLoadMore();
        initFAQ();
        initVirtualTour();
        initContactForm();
    });

    // Scroll Animations
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    // Add staggered animation for multiple elements
                    const siblings = entry.target.parentElement.querySelectorAll('.animate-on-scroll');
                    siblings.forEach((sibling, index) => {
                        if (sibling === entry.target) {
                            setTimeout(() => {
                                sibling.classList.add('animate');
                            }, index * 100);
                        }
                    });
                }
            });
        }, observerOptions);

        // Observe all elements with animation class
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(el => observer.observe(el));
    }

    // Smooth scrolling for anchor links
    function initSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerOffset = navbar.offsetHeight + 20;
                    const elementPosition = targetElement.offsetTop;
                    const offsetPosition = elementPosition - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Navbar scroll effect
    function initNavbarScroll() {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add background on scroll
            if (scrollTop > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Hide/show navbar on scroll
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        });
    }

    // Tab functionality
    function initTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetTab = this.getAttribute('data-tab');
                
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.style.display = 'none');
                
                // Add active class to clicked button and show corresponding content
                this.classList.add('active');
                const targetContent = document.getElementById(targetTab);
                if (targetContent) {
                    targetContent.style.display = 'block';
                    targetContent.classList.add('animate-on-scroll');
                }
            });
        });
    }

    // Filter functionality for news and gallery
    function initFilterButtons() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const filterableItems = document.querySelectorAll('[data-category]');

        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filterValue = this.getAttribute('data-filter');
                
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter items
                filterableItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                        item.classList.add('animate-on-scroll');
                        // Trigger animation
                        setTimeout(() => {
                            item.classList.add('animate');
                        }, 100);
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // Form validation
    function initFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                if (!validateForm(this)) {
                    e.preventDefault();
                }
            });
            
            // Real-time validation
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', function() {
                    validateField(this);
                });
            });
        });
    }

    function validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    function validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        let isValid = true;
        let errorMessage = '';
        
        // Remove existing error
        removeFieldError(field);
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required.';
        }
        
        // Email validation
        if (fieldType === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
            }
        }
        
        // Phone validation
        if (fieldType === 'tel' && value) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number.';
            }
        }
        
        if (!isValid) {
            showFieldError(field, errorMessage);
        }
        
        return isValid;
    }

    function showFieldError(field, message) {
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    function removeFieldError(field) {
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    // Gallery modal functionality
    function initGalleryModal() {
        const modal = document.getElementById('imageModal');
        const modalImage = document.getElementById('modalImage');
        const modalCaption = document.getElementById('modalCaption');
        const closeBtn = document.querySelector('.modal-close');
        const prevBtn = document.getElementById('prevImage');
        const nextBtn = document.getElementById('nextImage');
        const galleryItems = document.querySelectorAll('.gallery-zoom');
        
        let currentImageIndex = 0;
        let images = [];
        
        if (!modal) return;
        
        // Collect all gallery images
        galleryItems.forEach((item, index) => {
            const imgSrc = item.getAttribute('data-image');
            const imgAlt = item.closest('.gallery-item').querySelector('img').alt;
            const imgCaption = item.closest('.gallery-item').querySelector('.gallery-info h3').textContent;
            
            images.push({
                src: imgSrc,
                alt: imgAlt,
                caption: imgCaption
            });
            
            item.addEventListener('click', function() {
                currentImageIndex = index;
                showModal();
            });
        });
        
        function showModal() {
            const currentImage = images[currentImageIndex];
            modalImage.src = currentImage.src;
            modalImage.alt = currentImage.alt;
            modalCaption.textContent = currentImage.caption;
            modal.style.display = 'block';
            body.style.overflow = 'hidden';
        }
        
        function hideModal() {
            modal.style.display = 'none';
            body.style.overflow = '';
        }
        
        function showNextImage() {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            showModal();
        }
        
        function showPrevImage() {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            showModal();
        }
        
        // Event listeners
        closeBtn.addEventListener('click', hideModal);
        nextBtn.addEventListener('click', showNextImage);
        prevBtn.addEventListener('click', showPrevImage);
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideModal();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (modal.style.display === 'block') {
                switch(e.key) {
                    case 'Escape':
                        hideModal();
                        break;
                    case 'ArrowLeft':
                        showPrevImage();
                        break;
                    case 'ArrowRight':
                        showNextImage();
                        break;
                }
            }
        });
    }

    // Newsletter form submission
    function initNewsletterForm() {
        const newsletterForm = document.querySelector('.newsletter-form');
        
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = this.querySelector('input[type="email"]').value;
                
                if (email) {
                    // Simulate newsletter subscription
                    showNotification('Thank you for subscribing to our newsletter!', 'success');
                    this.reset();
                } else {
                    showNotification('Please enter a valid email address.', 'error');
                }
            });
        }
    }

    // Load more functionality
    function initLoadMore() {
        const loadMoreBtns = document.querySelectorAll('#loadMoreBtn, #loadMoreGallery');
        
        loadMoreBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Simulate loading more content
                this.textContent = 'Loading...';
                this.disabled = true;
                
                setTimeout(() => {
                    showNotification('No more content available at the moment.', 'info');
                    this.textContent = 'Load More';
                    this.disabled = false;
                }, 1000);
            });
        });
    }

    // FAQ functionality
    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const toggle = item.querySelector('.faq-toggle');
            
            if (question && answer && toggle) {
                question.addEventListener('click', function() {
                    const isOpen = answer.style.display === 'block';
                    
                    // Close all other FAQ items
                    faqItems.forEach(otherItem => {
                        otherItem.querySelector('.faq-answer').style.display = 'none';
                        otherItem.querySelector('.faq-toggle').textContent = '+';
                    });
                    
                    // Toggle current item
                    if (!isOpen) {
                        answer.style.display = 'block';
                        toggle.textContent = '-';
                    }
                });
            }
        });
    }

    // Virtual tour functionality
    function initVirtualTour() {
        const tourBtn = document.getElementById('startTour');
        
        if (tourBtn) {
            tourBtn.addEventListener('click', function() {
                showNotification('Virtual tour feature coming soon!', 'info');
            });
        }
    }

    // Contact form submission
    function initContactForm() {
        const contactForm = document.getElementById('contactForm');
        
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                if (validateForm(this)) {
                    // Simulate form submission
                    const submitBtn = this.querySelector('button[type="submit"]');
                    const originalText = submitBtn.textContent;
                    
                    submitBtn.textContent = 'Sending...';
                    submitBtn.disabled = true;
                    
                    setTimeout(() => {
                        showNotification('Thank you for your message! We will get back to you soon.', 'success');
                        this.reset();
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }, 2000);
                }
            });
        }
    }

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            max-width: 400px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        `;
        
        closeBtn.addEventListener('click', () => removeNotification(notification));
        
        // Auto remove after 5 seconds
        setTimeout(() => removeNotification(notification), 5000);
    }

    function removeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // Utility functions
    window.MayugeHS = {
        showNotification: showNotification,
        validateForm: validateForm,
        
        // Analytics helper (placeholder for Google Analytics)
        trackEvent: function(action, category, label) {
            if (typeof gtag !== 'undefined') {
                gtag('event', action, {
                    event_category: category,
                    event_label: label
                });
            }
        },
        
        // Performance monitoring
        measurePerformance: function() {
            if ('performance' in window) {
                window.addEventListener('load', function() {
                    setTimeout(function() {
                        const perfData = performance.getEntriesByType('navigation')[0];
                        const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                        console.log('Page load time:', loadTime + 'ms');
                    }, 0);
                });
            }
        }
    };

    // Initialize performance monitoring
    window.MayugeHS.measurePerformance();

})();

// Additional utility functions for enhanced functionality
(function() {
    'use strict';

    // Lazy loading for images
    function initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }

    // Search functionality (if needed)
    function initSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchResults = document.getElementById('searchResults');
        
        if (searchInput && searchResults) {
            let searchTimeout;
            
            searchInput.addEventListener('input', function() {
                clearTimeout(searchTimeout);
                const query = this.value.trim();
                
                if (query.length > 2) {
                    searchTimeout = setTimeout(() => {
                        performSearch(query);
                    }, 300);
                } else {
                    searchResults.innerHTML = '';
                    searchResults.style.display = 'none';
                }
            });
        }
    }

    function performSearch(query) {
        // This would typically make an API call to search content
        // For now, we'll simulate a search through page content
        const searchableElements = document.querySelectorAll('h1, h2, h3, p');
        const results = [];
        
        searchableElements.forEach(element => {
            if (element.textContent.toLowerCase().includes(query.toLowerCase())) {
                results.push({
                    title: element.tagName.toLowerCase().startsWith('h') ? element.textContent : 'Page Content',
                    content: element.textContent.substring(0, 150) + '...',
                    url: window.location.href + '#' + (element.id || '')
                });
            }
        });
        
        displaySearchResults(results.slice(0, 5)); // Show top 5 results
    }

    function displaySearchResults(results) {
        const searchResults = document.getElementById('searchResults');
        
        if (results.length === 0) {
            searchResults.innerHTML = '<p>No results found.</p>';
        } else {
            searchResults.innerHTML = results.map(result => `
                <div class="search-result">
                    <h4><a href="${result.url}">${result.title}</a></h4>
                    <p>${result.content}</p>
                </div>
            `).join('');
        }
        
        searchResults.style.display = 'block';
    }

    // Cookie consent (if needed for GDPR compliance)
    function initCookieConsent() {
        const cookieConsent = localStorage.getItem('cookieConsent');
        
        if (!cookieConsent) {
            showCookieConsent();
        }
    }

    function showCookieConsent() {
        const consent = document.createElement('div');
        consent.className = 'cookie-consent';
        consent.innerHTML = `
            <div class="cookie-content">
                <p>We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p>
                <div class="cookie-buttons">
                    <button class="btn btn-primary" onclick="acceptCookies()">Accept</button>
                    <button class="btn btn-outline" onclick="declineCookies()">Decline</button>
                </div>
            </div>
        `;
        
        consent.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 1rem;
            z-index: 1000;
            transform: translateY(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(consent);
        
        setTimeout(() => {
            consent.style.transform = 'translateY(0)';
        }, 100);
        
        // Global functions for cookie consent
        window.acceptCookies = function() {
            localStorage.setItem('cookieConsent', 'accepted');
            consent.style.transform = 'translateY(100%)';
            setTimeout(() => {
                document.body.removeChild(consent);
            }, 300);
        };
        
        window.declineCookies = function() {
            localStorage.setItem('cookieConsent', 'declined');
            consent.style.transform = 'translateY(100%)';
            setTimeout(() => {
                document.body.removeChild(consent);
            }, 300);
        };
    }

    // Initialize additional features when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        initLazyLoading();
        initSearch();
        initCookieConsent();
    });

})();
