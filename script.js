// Advanced JavaScript for AIim Website

class AIimWebsite {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupAnimations();
        this.setupFormHandling();
        this.setupPerformanceOptimizations();
        this.setupAccessibility();
    }

    // Event Listeners
    setupEventListeners() {
        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', this.smoothScroll.bind(this));
        });

        // Navbar scroll effect
        window.addEventListener('scroll', this.handleNavbarScroll.bind(this));

        // Mobile menu toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', this.toggleMobileMenu.bind(this));
        }

        // Intersection Observer for animations
        this.setupIntersectionObserver();

        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyboardNavigation.bind(this));

        // Window resize handler
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    // Smooth scrolling implementation
    smoothScroll(e) {
        e.preventDefault();
        const target = document.querySelector(e.currentTarget.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    // Navbar scroll effect
    handleNavbarScroll() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Mobile menu toggle
    toggleMobileMenu() {
        const navLinks = document.querySelector('.nav-links');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn i');
        
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('fa-bars');
        mobileMenuBtn.classList.toggle('fa-times');
    }

    // Animation setup
    setupAnimations() {
        // Loading screen
        this.showLoadingScreen();

        // Counter animation for stats
        this.animateCounters();

        // Parallax effects
        this.setupParallax();
    }

    // Loading screen
    showLoadingScreen() {
        const loadingScreen = document.createElement('div');
        loadingScreen.className = 'loading-screen';
        loadingScreen.innerHTML = '<div class="loading-spinner"></div>';
        document.body.appendChild(loadingScreen);

        window.addEventListener('load', () => {
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.remove();
                }, 500);
            }, 1000);
        });
    }

    // Counter animation
    animateCounters() {
        const stats = document.querySelectorAll('.stat-number');
        const options = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                }
            });
        }, options);

        stats.forEach(stat => observer.observe(stat));
    }

    animateCounter(element) {
        const target = parseInt(element.textContent.replace(/[^0-9]/g, ''));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            const suffix = element.textContent.replace(/[0-9]/g, '');
            element.textContent = Math.floor(current) + suffix;
        }, 16);
    }

    // Parallax effects
    setupParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroImage = document.querySelector('.hero-image');
            
            if (heroImage) {
                heroImage.style.transform = `translateY(${scrolled * 0.1}px)`;
            }
        });
    }

    // Intersection Observer for scroll animations
    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, options);

        // Observe elements for animation
        document.querySelectorAll('.feature-card, .about-text, .contact-content').forEach(el => {
            observer.observe(el);
        });
    }

    // Form handling
    setupFormHandling() {
        const form = document.querySelector('.contact-form');
        if (form) {
            form.addEventListener('submit', this.handleFormSubmission.bind(this));
            
            // Real-time validation
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', this.validateField.bind(this));
                input.addEventListener('input', this.clearValidationErrors.bind(this));
            });
        }
    }

    // Form submission handler
    async handleFormSubmission(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const submitBtn = form.querySelector('.btn-primary');
        
        // Validate form
        if (!this.validateForm(form)) {
            return;
        }

        // Show loading state
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            // Simulate API call
            await this.simulateFormSubmission(formData);
            
            // Show success message
            this.showNotification('Thank you! We will contact you soon.', 'success');
            form.reset();
            
        } catch (error) {
            this.showNotification('Sorry, something went wrong. Please try again.', 'error');
        } finally {
            // Restore button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    // Form validation
    validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!this.validateField({ target: field })) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Clear previous errors
        this.clearFieldError(field);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            errorMessage = 'This field is required';
            isValid = false;
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
        }

        // Show error if validation failed
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        const errorElement = document.createElement('span');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.color = '#ef4444';
        errorElement.style.fontSize = '0.8rem';
        errorElement.style.display = 'block';
        errorElement.style.marginTop = '0.25rem';
        
        field.parentNode.appendChild(errorElement);
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    clearValidationErrors(e) {
        this.clearFieldError(e.target);
    }

    // Simulate form submission
    simulateFormSubmission(formData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success/error (90% success rate)
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error('Simulated error'));
                }
            }, 2000);
        });
    }

    // Notification system
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // Performance optimizations
    setupPerformanceOptimizations() {
        // Lazy loading for images
        this.setupLazyLoading();

        // Debounced scroll handler
        this.setupDebouncedScrollHandler();

        // Preload critical resources
        this.preloadCriticalResources();
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    setupDebouncedScrollHandler() {
        let scrollTimeout;
        
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            
            scrollTimeout = setTimeout(() => {
                this.handleScroll();
            }, 16);
        });
    }

    handleScroll() {
        // Optimized scroll handling
        const scrolled = window.pageYOffset;
        
        // Update navbar
        this.updateNavbarOnScroll(scrolled);
        
        // Update parallax elements
        this.updateParallaxElements(scrolled);
    }

    updateNavbarOnScroll(scrolled) {
        const navbar = document.getElementById('navbar');
        navbar.style.transform = `translateY(${Math.min(scrolled * -0.1, 0)}px)`;
    }

    updateParallaxElements(scrolled) {
        const heroImage = document.querySelector('.hero-image');
        if (heroImage && scrolled < window.innerHeight) {
            heroImage.style.transform = `translateY(${scrolled * 0.1}px) scale(${1 + scrolled * 0.0001})`;
        }
    }

    preloadCriticalResources() {
        // Preload fonts
        const fontUrls = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
        ];

        fontUrls.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = url;
            link.as = 'style';
            document.head.appendChild(link);
        });
    }

    // Accessibility features
    setupAccessibility() {
        // Skip to main content link
        this.addSkipLink();

        // Focus management
        this.setupFocusManagement();

        // ARIA labels and roles
        this.enhanceARIA();
    }

    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'sr-only';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-color);
            color: white;
            padding: 8px;
            text-decoration: none;
            z-index: 10000;
            transition: top 0.3s;
        `;

        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });

        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    setupFocusManagement() {
        // Trap focus in mobile menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const mobileMenu = document.querySelector('.nav-links.active');
                if (mobileMenu) {
                    this.toggleMobileMenu();
                }
            }
        });
    }

    enhanceARIA() {
        // Add ARIA labels to interactive elements
        const buttons = document.querySelectorAll('button, .btn');
        buttons.forEach(button => {
            if (!button.getAttribute('aria-label')) {
                button.setAttribute('aria-label', button.textContent.trim());
            }
        });

        // Add main landmark
        const main = document.querySelector('main');
        if (!main) {
            document.querySelector('.hero').setAttribute('role', 'main');
            document.querySelector('.hero').id = 'main';
        }
    }

    // Keyboard navigation
    handleKeyboardNavigation(e) {
        // Tab navigation enhancements
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    }

    // Window resize handler
    handleResize() {
        // Debounce resize events
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }

        this.resizeTimeout = setTimeout(() => {
            this.onResize();
        }, 250);
    }

    onResize() {
        // Recalculate layouts if needed
        const isMobile = window.innerWidth < 768;
        
        if (isMobile && document.querySelector('.nav-links.active')) {
            // Close mobile menu on resize to desktop
            this.toggleMobileMenu();
        }
    }
}

// Analytics and tracking
class AnalyticsManager {
    constructor() {
        this.setupEventTracking();
    }

    setupEventTracking() {
        // Track button clicks
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.trackEvent('button_click', {
                    button_text: e.target.textContent.trim(),
                    location: this.getCurrentSection()
                });
            });
        });

        // Track form submissions
        document.querySelector('.contact-form')?.addEventListener('submit', () => {
            this.trackEvent('form_submission', {
                form_type: 'contact'
            });
        });

        // Track scroll depth
        this.trackScrollDepth();
    }

    trackEvent(eventName, properties = {}) {
        // In a real application, you would send this to your analytics service
        console.log('Analytics Event:', eventName, properties);
        
        // Example: Send to Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, properties);
        }
    }

    getCurrentSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + window.innerHeight / 2;

        for (let section of sections) {
            if (scrollPosition >= section.offsetTop && 
                scrollPosition <= section.offsetTop + section.offsetHeight) {
                return section.id;
            }
        }
        return 'unknown';
    }

    trackScrollDepth() {
        const milestones = [25, 50, 75, 100];
        const trackedMilestones = new Set();

        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );

            milestones.forEach(milestone => {
                if (scrollPercent >= milestone && !trackedMilestones.has(milestone)) {
                    trackedMilestones.add(milestone);
                    this.trackEvent('scroll_depth', {
                        depth_percentage: milestone
                    });
                }
            });
        });
    }
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    // In production, you might want to send this to an error reporting service
});

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AIimWebsite();
    new AnalyticsManager();
});

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}