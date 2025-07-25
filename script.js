// ModernHaus JavaScript

// Page Navigation
class PageManager {
    constructor() {
        this.currentPage = 'home';
        this.pages = ['home', 'about', 'contact'];
        this.init();
    }

    init() {
        // Handle navigation clicks
        document.addEventListener('click', (e) => {
            const pageLink = e.target.closest('[data-page]');
            if (pageLink) {
                e.preventDefault();
                const targetPage = pageLink.getAttribute('data-page');
                this.navigateToPage(targetPage);
            }
        });

        // Initialize animations
        this.initAnimations();
        
        // Initialize forms
        this.initForms();
        
        // Show initial page
        this.showPage(this.currentPage);
    }

    navigateToPage(pageName) {
        if (this.pages.includes(pageName) && pageName !== this.currentPage) {
            this.hidePage(this.currentPage);
            this.showPage(pageName);
            this.currentPage = pageName;
            
            // Update navigation active state
            this.updateNavigation(pageName);
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Re-initialize animations for new page
            setTimeout(() => {
                this.initAnimations();
            }, 100);
        }
    }

    showPage(pageName) {
        const pageElement = document.getElementById(`${pageName}-page`);
        if (pageElement) {
            pageElement.classList.add('active');
        }
    }

    hidePage(pageName) {
        const pageElement = document.getElementById(`${pageName}-page`);
        if (pageElement) {
            pageElement.classList.remove('active');
        }
    }

    updateNavigation(activePage) {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current page link
        document.querySelectorAll(`[data-page="${activePage}"]`).forEach(link => {
            if (link.classList.contains('nav-link')) {
                link.classList.add('active');
            }
        });
    }

    initAnimations() {
        // Fade up animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);

        // Observe all fade-up elements in the current page
        const currentPageElement = document.getElementById(`${this.currentPage}-page`);
        if (currentPageElement) {
            const fadeElements = currentPageElement.querySelectorAll('.fade-up');
            fadeElements.forEach(el => {
                el.classList.remove('animate'); // Reset animation
                observer.observe(el);
            });
        }
    }

    initForms() {
        this.initContactForm();
        this.initNewsletterForm();
    }

    initContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            
            let isValid = true;

            // Reset previous states
            [fullName, email, message].forEach(field => {
                field.classList.remove('is-invalid', 'is-valid');
            });

            // Validate full name
            if (!fullName.value.trim()) {
                fullName.classList.add('is-invalid');
                isValid = false;
            } else {
                fullName.classList.add('is-valid');
            }

            // Validate email
            const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
            if (!email.value.trim() || !emailRegex.test(email.value)) {
                email.classList.add('is-invalid');
                isValid = false;
            } else {
                email.classList.add('is-valid');
            }

            // Validate message
            if (!message.value.trim() || message.value.trim().length < 20) {
                message.classList.add('is-invalid');
                isValid = false;
            } else {
                message.classList.add('is-valid');
            }

            if (isValid) {
                this.submitContactForm(contactForm);
            }
        });
    }

    submitContactForm(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            // Reset form
            form.reset();
            form.querySelectorAll('.form-control').forEach(field => {
                field.classList.remove('is-valid', 'is-invalid');
            });
            
            // Reset button
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
            
            // Show success message
            this.showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        }, 2000);
    }

    initNewsletterForm() {
        const newsletterForm = document.getElementById('newsletterForm');
        if (!newsletterForm) return;

        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = document.getElementById('newsletterEmail');
            const errorDiv = document.getElementById('newsletterError');
            const successDiv = document.getElementById('newsletterSuccess');
            
            // Reset states
            errorDiv.style.display = 'none';
            successDiv.style.display = 'none';
            emailInput.classList.remove('is-invalid');

            // Validate email
            const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
            if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
                emailInput.classList.add('is-invalid');
                errorDiv.textContent = 'Please enter a valid email address.';
                errorDiv.style.display = 'block';
                return;
            }

            // Simulate subscription
            const submitButton = newsletterForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Subscribing...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                emailInput.value = '';
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                successDiv.style.display = 'block';
                
                setTimeout(() => {
                    successDiv.style.display = 'none';
                }, 3000);
            }, 1500);
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'success' ? 'success' : 'info'} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
}

// Smooth scrolling for internal links
document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (link) {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.backgroundColor = '#ffffff';
        navbar.style.backdropFilter = 'none';
    }
});

// Product card interactions
document.addEventListener('mouseover', (e) => {
    if (e.target.closest('.product-card')) {
        e.target.closest('.product-card').style.transform = 'translateY(-5px)';
    }
});

document.addEventListener('mouseout', (e) => {
    if (e.target.closest('.product-card')) {
        e.target.closest('.product-card').style.transform = 'translateY(0)';
    }
});

// Initialize page manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PageManager();
});

// Add loading states to all buttons
document.addEventListener('click', (e) => {
    const button = e.target.closest('.btn');
    if (button && !button.disabled && !button.classList.contains('btn-close')) {
        // Don't add loading to navigation buttons
        if (!button.hasAttribute('data-page') && !button.closest('.navbar')) {
            button.classList.add('loading');
            setTimeout(() => {
                button.classList.remove('loading');
            }, 1000);
        }
    }
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// Performance optimization: Lazy load images
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// Add keyboard accessibility for custom interactive elements
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        const target = e.target;
        if (target.hasAttribute('data-page')) {
            e.preventDefault();
            target.click();
        }
    }
});

// Toast notification system
class ToastManager {
    constructor() {
        this.container = this.createContainer();
    }

    createContainer() {
        const container = document.createElement('div');
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
        return container;
    }

    show(message, type = 'primary', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-bg-${type} border-0`;
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;

        this.container.appendChild(toast);
        
        const bootstrapToast = new bootstrap.Toast(toast, {
            autohide: true,
            delay: duration
        });
        
        bootstrapToast.show();
        
        // Remove from DOM after hiding
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }
}

// Initialize toast manager
const toastManager = new ToastManager();

// Export for global use
window.showToast = (message, type, duration) => {
    toastManager.show(message, type, duration);
};
