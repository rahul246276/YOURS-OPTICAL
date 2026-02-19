// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initHeroSlider();
    initSmoothScroll();
    initScrollToTop();
    initScrollAnimations();
    initLightbox();
    initForms();
    initQuickView();
    initNavbarScroll();
    initProductFilters();
    initCounter();
    initLazyLoading();
});

// ===== MOBILE MENU TOGGLE =====
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!hamburger || !navMenu) return;
    
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target) && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

// ===== HERO SLIDER FUNCTIONALITY =====
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.hero-prev');
    const nextBtn = document.querySelector('.hero-next');
    
    if (!slides.length) return;
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    let slideInterval;
    
    function showSlide(index) {
        // Remove active class from all slides and indicators
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Show current slide
        slides[index].classList.add('active');
        if (indicators[index]) indicators[index].classList.add('active');
        
        currentSlide = index;
    }
    
    function changeSlide(direction) {
        currentSlide += direction;
        
        if (currentSlide >= totalSlides) {
            currentSlide = 0;
        } else if (currentSlide < 0) {
            currentSlide = totalSlides - 1;
        }
        
        showSlide(currentSlide);
    }
    
    function goToSlide(index) {
        showSlide(index);
    }
    
    // Initialize slider controls
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            changeSlide(-1);
            resetAutoPlay();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            changeSlide(1);
            resetAutoPlay();
        });
    }
    
    // Add click handlers to indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
            resetAutoPlay();
        });
    });
    
    // Auto-play functionality
    function startAutoPlay() {
        slideInterval = setInterval(() => {
            changeSlide(1);
        }, 5000);
    }
    
    function resetAutoPlay() {
        clearInterval(slideInterval);
        startAutoPlay();
    }
    
    // Pause on hover
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        heroSection.addEventListener('mouseleave', () => {
            startAutoPlay();
        });
    }
    
    // Start auto-play
    startAutoPlay();
    
    // Expose functions globally if needed
    window.changeSlide = changeSlide;
    window.goToSlide = goToSlide;
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== SCROLL TO TOP BUTTON =====
function initScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><polyline points="18 15 12 9 6 15"></polyline></svg>';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    
    // Style the button
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--secondary, #9E7B5B);
        border: none;
        border-radius: 50%;
        color: white;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 4px 15px rgba(158, 123, 91, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    document.body.appendChild(scrollBtn);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
            scrollBtn.style.transform = 'translateY(0)';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
            scrollBtn.style.transform = 'translateY(20px)';
        }
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.collection-card, .product-card, .service-card, .craft-item, .testimonial-card, .feature-card, .glass-card'
    );
    
    if (!animatedElements.length) return;
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ===== GALLERY LIGHTBOX =====
function initLightbox() {
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.style.cssText = `
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        z-index: 10000;
        cursor: pointer;
    `;
    
    const lightboxImg = document.createElement('img');
    lightboxImg.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.setAttribute('aria-label', 'Close lightbox');
    closeBtn.style.cssText = `
        position: absolute;
        top: 30px;
        right: 40px;
        font-size: 40px;
        color: white;
        background: none;
        border: none;
        cursor: pointer;
        z-index: 10001;
        transition: transform 0.3s;
    `;
    
    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.transform = 'scale(1.1)';
    });
    
    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.transform = 'scale(1)';
    });
    
    lightbox.appendChild(lightboxImg);
    lightbox.appendChild(closeBtn);
    document.body.appendChild(lightbox);
    
    // Handle gallery image clicks
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('gallery-image') || 
            e.target.closest('.insta-item img') ||
            e.target.closest('.showcase-image')) {
            
            const img = e.target.closest('img') || e.target;
            if (img && img.src) {
                lightboxImg.src = img.src;
                lightbox.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        }
    });
    
    const closeLightbox = () => {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
        lightboxImg.src = '';
    };
    
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', closeLightbox);
    
    lightboxImg.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.style.display === 'block') {
            closeLightbox();
        }
    });
}

// ===== FORM HANDLING =====
function initForms() {
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
    
    // Contact form
    const contactForm = document.querySelector('.contact-form-container form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    // Appointment form
    const appointmentForm = document.querySelector('.appointment-form');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', handleAppointmentSubmit);
    }
}

function showNotification(message, type = 'success', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: ${type === 'success' ? 'var(--secondary, #9E7B5B)' : '#dc3545'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 5px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 350px;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, duration);
}

function handleNewsletterSubmit(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    showNotification('Thank you for subscribing to our newsletter!', 'success');
    e.target.reset();
}

function handleContactSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Simple validation
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    if (!name || !email || !message) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    showNotification('Message sent successfully! We will contact you soon.', 'success');
    e.target.reset();
}

function handleAppointmentSubmit(e) {
    e.preventDefault();
    showNotification('Appointment request submitted! We will confirm shortly.', 'success');
    e.target.reset();
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ===== QUICK VIEW MODAL =====
function initQuickView() {
    const quickViewModal = document.getElementById('quickViewModal');
    if (!quickViewModal) return;
    
    const closeBtn = quickViewModal.querySelector('.quick-view-close');
    
    window.openQuickView = function(imageSrc, title, description, price = '') {
        const image = document.getElementById('quickViewImage');
        const titleElement = document.getElementById('quickViewTitle');
        const descriptionElement = document.getElementById('quickViewDescription');
        const priceElement = document.getElementById('quickViewPrice');
        
        if (image) image.src = imageSrc;
        if (titleElement) titleElement.textContent = title;
        if (descriptionElement) descriptionElement.textContent = description;
        if (priceElement && price) priceElement.textContent = price;
        
        quickViewModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    
    window.closeQuickView = function() {
        quickViewModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };
    
    // Close when clicking outside
    quickViewModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeQuickView();
        }
    });
    
    // Close with close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeQuickView);
    }
    
    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && quickViewModal.classList.contains('active')) {
            closeQuickView();
        }
    });
    
    // Add quick view buttons to product cards
    document.querySelectorAll('.product-card, .glass-card').forEach(card => {
        const quickViewBtn = document.createElement('button');
        quickViewBtn.innerHTML = 'Quick View';
        quickViewBtn.className = 'btn-quick-view';
        quickViewBtn.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            color: var(--primary);
            padding: 10px 20px;
            border: none;
            border-radius: 25px;
            font-weight: 600;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s;
            z-index: 10;
            white-space: nowrap;
        `;
        
        card.style.position = 'relative';
        card.appendChild(quickViewBtn);
        
        card.addEventListener('mouseenter', () => {
            quickViewBtn.style.opacity = '1';
        });
        
        card.addEventListener('mouseleave', () => {
            quickViewBtn.style.opacity = '0';
        });
        
        quickViewBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const img = card.querySelector('img');
            const title = card.querySelector('h3, .product-name, .glass-name')?.textContent || 'Product';
            const desc = card.querySelector('p, .product-desc, .glass-desc')?.textContent || 'Premium quality eyewear';
            
            openQuickView(img?.src || '', title, desc);
        });
    });
}

// ===== NAVBAR SCROLL EFFECT =====
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
}

// ===== PRODUCT FILTERS =====
function initProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (!filterButtons.length) return;
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.dataset.filter || btn.textContent.toLowerCase().trim();
            filterProducts(filterValue);
        });
    });
}

function filterProducts(category) {
    const products = document.querySelectorAll('.product-card, .glass-card');
    
    products.forEach(product => {
        const productCategory = product.dataset.category || 
                              product.querySelector('.product-category')?.textContent.toLowerCase().trim() ||
                              '';
        
        if (category === 'all' || productCategory.includes(category)) {
            product.style.display = 'block';
            setTimeout(() => {
                product.style.opacity = '1';
                product.style.transform = 'scale(1)';
            }, 10);
        } else {
            product.style.opacity = '0';
            product.style.transform = 'scale(0.8)';
            setTimeout(() => {
                product.style.display = 'none';
            }, 300);
        }
    });
}

// ===== COUNTER ANIMATION =====
function initCounter() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.target) || 0;
                animateCounter(counter, target);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50; // Complete in 50 steps
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.round(current);
        }
    }, 20);
}

// ===== LAZY LOADING FOR IMAGES =====
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.dataset.src;
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for older browsers
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// ===== ADD ANIMATION STYLES =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .fade-in {
        animation: fadeIn 0.6s ease forwards;
    }
    
    body.menu-open {
        overflow: hidden;
    }
    
    .scroll-to-top:hover {
        background: var(--accent, #C1A173) !important;
        transform: translateY(-3px) !important;
        box-shadow: 0 6px 25px rgba(158, 123, 91, 0.4) !important;
    }
    
    .btn-quick-view {
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }
    
    .btn-quick-view:hover {
        background: var(--secondary) !important;
        color: white !important;
    }
    
    .notification {
        font-family: var(--font-primary), sans-serif;
        line-height: 1.5;
    }
`;

document.head.appendChild(style);