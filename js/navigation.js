// Navigation functionality for Mayuge High School website
(function() {
    'use strict';

    let navbar;
    let navToggle;
    let navMenu;
    let navLinks;
    let isMenuOpen = false;

    // Initialize navigation when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        initNavigation();
        initMobileNavigation();
        initActiveNavigation();
        initDropdownMenus();
        initKeyboardNavigation();
    });

    // Main navigation initialization
    function initNavigation() {
        navbar = document.querySelector('.navbar');
        navToggle = document.querySelector('.nav-toggle');
        navMenu = document.querySelector('.nav-menu');
        navLinks = document.querySelectorAll('.nav-link');

        if (!navbar || !navToggle || !navMenu) {
            console.warn('Navigation elements not found');
            return;
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (isMenuOpen && !navbar.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Close mobile menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isMenuOpen) {
                closeMobileMenu();
            }
        });

        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 991 && isMenuOpen) {
                closeMobileMenu();
            }
        });
    }

    // Mobile navigation functionality
    function initMobileNavigation() {
        if (!navToggle) return;

        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMobileMenu();
        });

        // Close menu when clicking on nav links
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (isMenuOpen) {
                    closeMobileMenu();
                }
            });
        });
    }

    // Toggle mobile menu
    function toggleMobileMenu() {
        if (isMenuOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    // Open mobile menu
    function openMobileMenu() {
        navMenu.classList.add('active');
        navToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
        isMenuOpen = true;

        // Animate menu items
        navLinks.forEach((link, index) => {
            link.style.opacity = '0';
            link.style.transform = 'translateY(20px)';
            setTimeout(() => {
                link.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                link.style.opacity = '1';
                link.style.transform = 'translateY(0)';
            }, index * 100);
        });

        // Focus first menu item for accessibility
        setTimeout(() => {
            if (navLinks[0]) {
                navLinks[0].focus();
            }
        }, 100);
    }

    // Close mobile menu
    function closeMobileMenu() {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
        isMenuOpen = false;

        // Reset menu item styles
        navLinks.forEach(link => {
            link.style.transition = '';
            link.style.opacity = '';
            link.style.transform = '';
        });
    }

    // Set active navigation item based on current page
    function initActiveNavigation() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';

        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            
            // Remove existing active classes
            link.classList.remove('active');
            
            // Add active class to current page link
            if (linkPath === currentPage || 
                (currentPage === '' && linkPath === 'index.html') ||
                (currentPage === 'index.html' && linkPath === 'index.html')) {
                link.classList.add('active');
            }
        });

        // Highlight section on scroll for single page navigation
        if (currentPage === 'index.html' || currentPage === '') {
            initScrollNavigation();
        }
    }

    // Scroll-based navigation highlighting
    function initScrollNavigation() {
        const sections = document.querySelectorAll('section[id]');
        
        if (sections.length === 0) return;

        function updateActiveNavOnScroll() {
            const scrollPosition = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    // Remove active class from all nav links
                    navLinks.forEach(link => {
                        if (link.getAttribute('href').startsWith('#')) {
                            link.classList.remove('active');
                        }
                    });
                    
                    // Add active class to corresponding nav link
                    const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }

        // Throttle scroll event for performance
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            if (scrollTimeout) {
                cancelAnimationFrame(scrollTimeout);
            }
            scrollTimeout = requestAnimationFrame(updateActiveNavOnScroll);
        });
    }

    // Dropdown menu functionality (if needed for future enhancements)
    function initDropdownMenus() {
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        
        dropdownToggles.forEach(toggle => {
            const dropdown = toggle.nextElementSibling;
            
            if (!dropdown || !dropdown.classList.contains('dropdown-menu')) {
                return;
            }

            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Close other dropdowns
                dropdownToggles.forEach(otherToggle => {
                    if (otherToggle !== toggle) {
                        const otherDropdown = otherToggle.nextElementSibling;
                        if (otherDropdown) {
                            otherDropdown.classList.remove('show');
                            otherToggle.setAttribute('aria-expanded', 'false');
                        }
                    }
                });
                
                // Toggle current dropdown
                const isOpen = dropdown.classList.contains('show');
                dropdown.classList.toggle('show');
                toggle.setAttribute('aria-expanded', !isOpen);
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', function(e) {
                if (!toggle.contains(e.target) && !dropdown.contains(e.target)) {
                    dropdown.classList.remove('show');
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // Keyboard navigation for accessibility
    function initKeyboardNavigation() {
        navLinks.forEach((link, index) => {
            link.addEventListener('keydown', function(e) {
                switch(e.key) {
                    case 'ArrowRight':
                    case 'ArrowDown':
                        e.preventDefault();
                        const nextIndex = (index + 1) % navLinks.length;
                        navLinks[nextIndex].focus();
                        break;
                        
                    case 'ArrowLeft':
                    case 'ArrowUp':
                        e.preventDefault();
                        const prevIndex = (index - 1 + navLinks.length) % navLinks.length;
                        navLinks[prevIndex].focus();
                        break;
                        
                    case 'Home':
                        e.preventDefault();
                        navLinks[0].focus();
                        break;
                        
                    case 'End':
                        e.preventDefault();
                        navLinks[navLinks.length - 1].focus();
                        break;
                }
            });
        });
    }

    // Navbar scroll effects
    function initNavbarScrollEffects() {
        if (!navbar) return;

        let lastScrollTop = 0;
        let scrollDirection = 'up';
        let isScrolling = false;

        function handleScroll() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Determine scroll direction
            if (scrollTop > lastScrollTop) {
                scrollDirection = 'down';
            } else {
                scrollDirection = 'up';
            }
            
            // Add/remove scrolled class based on scroll position
            if (scrollTop > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
            
            // Hide/show navbar based on scroll direction (optional)
            if (window.innerWidth > 991) { // Only on desktop
                if (scrollDirection === 'down' && scrollTop > 200) {
                    navbar.classList.add('navbar-hidden');
                } else {
                    navbar.classList.remove('navbar-hidden');
                }
            }
            
            lastScrollTop = scrollTop;
            isScrolling = false;
        }

        // Throttle scroll events
        window.addEventListener('scroll', function() {
            if (!isScrolling) {
                requestAnimationFrame(handleScroll);
                isScrolling = true;
            }
        });
    }

    // Smooth scroll to sections
    function initSmoothScroll() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    const headerOffset = navbar ? navbar.offsetHeight + 20 : 80;
                    const elementPosition = targetElement.offsetTop;
                    const offsetPosition = elementPosition - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (isMenuOpen) {
                        closeMobileMenu();
                    }
                    
                    // Update URL hash
                    history.pushState(null, null, this.getAttribute('href'));
                }
            });
        });
    }

    // Progress indicator for page scroll
    function initScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #0066FF, #FF8C00);
            z-index: 1001;
            transition: width 0.1s ease;
        `;
        
        document.body.appendChild(progressBar);
        
        function updateScrollProgress() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            progressBar.style.width = Math.min(scrollPercent, 100) + '%';
        }
        
        window.addEventListener('scroll', updateScrollProgress);
    }

    // Initialize additional navigation features
    document.addEventListener('DOMContentLoaded', function() {
        initNavbarScrollEffects();
        initSmoothScroll();
        initScrollProgress();
    });

    // Public API for navigation control
    window.Navigation = {
        openMobileMenu: openMobileMenu,
        closeMobileMenu: closeMobileMenu,
        toggleMobileMenu: toggleMobileMenu,
        
        // Method to programmatically set active nav item
        setActiveNav: function(href) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === href) {
                    link.classList.add('active');
                }
            });
        },
        
        // Method to check if mobile menu is open
        isMobileMenuOpen: function() {
            return isMenuOpen;
        }
    };

})();
