// Gharonda Presentation JavaScript

class GharondaPresentation {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 20;
        this.slides = document.querySelectorAll('.slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.currentSlideElement = document.querySelector('.current-slide');
        this.totalSlidesElement = document.querySelector('.total-slides');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        
        this.init();
    }

    init() {
        // Initialize slide counter
        this.updateSlideCounter();
        this.updateNavigationButtons();
        
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.previousSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            } else if (e.key === 'Escape') {
                if (window.lightboxInstance) {
                    window.lightboxInstance.close();
                }
            }
        });

        // Add touch/swipe navigation
        this.addTouchNavigation();
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.goToSlide(this.currentSlide + 1);
        }
    }

    previousSlide() {
        if (this.currentSlide > 1) {
            this.goToSlide(this.currentSlide - 1);
        }
    }

    goToSlide(slideNumber) {
        if (slideNumber < 1 || slideNumber > this.totalSlides) {
            return;
        }

        // Remove active class from current slide and indicator
        this.slides[this.currentSlide - 1].classList.remove('active');
        this.indicators[this.currentSlide - 1].classList.remove('active');

        // Add prev class for exit animation
        this.slides[this.currentSlide - 1].classList.add('prev');

        // Update current slide
        this.currentSlide = slideNumber;

        // Remove prev class from all slides
        this.slides.forEach(slide => slide.classList.remove('prev'));

        // Add active class to new slide and indicator
        this.slides[this.currentSlide - 1].classList.add('active');
        this.indicators[this.currentSlide - 1].classList.add('active');

        // Update UI
        this.updateSlideCounter();
        this.updateNavigationButtons();

        // Trigger slide-specific animations
        this.triggerSlideAnimations();
    }

    updateSlideCounter() {
        this.currentSlideElement.textContent = this.currentSlide;
        this.totalSlidesElement.textContent = this.totalSlides;
    }

    updateNavigationButtons() {
        this.prevBtn.disabled = this.currentSlide === 1;
        this.nextBtn.disabled = this.currentSlide === this.totalSlides;
    }

    triggerSlideAnimations() {
        const activeSlide = this.slides[this.currentSlide - 1];
        const animatedElements = activeSlide.querySelectorAll('.slide-content > *');
        
        // Reset animations
        animatedElements.forEach((element, index) => {
            element.style.animation = 'none';
            element.offsetHeight; // Trigger reflow
            element.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s both`;
        });

        // Trigger image loading animations
        const images = activeSlide.querySelectorAll('img');
        images.forEach((img, index) => {
            if (img.complete && img.naturalHeight !== 0) {
                img.style.animation = 'none';
                img.offsetHeight; // Trigger reflow
                img.style.animation = `imageLoad 0.5s ease-in-out ${0.2 + index * 0.1}s forwards`;
            }
        });
    }

    addTouchNavigation() {
        let startX = 0;
        let endX = 0;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        document.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe();
        });

        // Mouse drag navigation
        let mouseDown = false;
        let startMouseX = 0;

        document.addEventListener('mousedown', (e) => {
            // Don't interfere with image clicks or lightbox
            if (e.target.classList.contains('clickable-image') || 
                e.target.closest('.lightbox') || 
                e.target.closest('.nav-btn') ||
                e.target.closest('.indicator')) {
                return;
            }
            mouseDown = true;
            startMouseX = e.clientX;
        });

        document.addEventListener('mouseup', (e) => {
            if (mouseDown && !e.target.classList.contains('clickable-image') && !e.target.closest('.lightbox')) {
                endX = e.clientX;
                startX = startMouseX;
                this.handleSwipe();
                mouseDown = false;
            }
        });

        document.addEventListener('mouseleave', () => {
            mouseDown = false;
        });
    }

    handleSwipe() {
        const threshold = 50; // Minimum swipe distance
        const swipeDistance = startX - endX;

        if (Math.abs(swipeDistance) > threshold) {
            if (swipeDistance > 0) {
                // Swiped left, go to next slide
                this.nextSlide();
            } else {
                // Swiped right, go to previous slide
                this.previousSlide();
            }
        }
    }

    restart() {
        this.goToSlide(1);
    }
}

// Image Lightbox Functionality
class ImageLightbox {
    constructor() {
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImage = document.getElementById('lightbox-image');
        this.lightboxCaption = document.getElementById('lightbox-caption');
        this.isOpen = false;
        this.init();
    }

    init() {
        // Set up event listeners
        const lightboxClose = document.querySelector('.lightbox-close');
        const lightboxOverlay = document.querySelector('.lightbox-overlay');
        
        if (lightboxClose) {
            lightboxClose.addEventListener('click', () => this.close());
        }
        
        if (lightboxOverlay) {
            lightboxOverlay.addEventListener('click', () => this.close());
        }

        // Set up all clickable images
        this.setupClickableImages();

        // Close lightbox on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    setupClickableImages() {
        const clickableImages = document.querySelectorAll('.clickable-image');
        clickableImages.forEach(img => {
            // Remove any existing event listeners
            img.removeEventListener('click', this.handleImageClick);
            
            // Add click event listener
            img.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleImageClick(img);
            });

            // Add keyboard support
            img.setAttribute('tabindex', '0');
            img.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleImageClick(img);
                }
            });

            // Add hover effects
            img.addEventListener('mouseenter', () => {
                img.style.transform = 'scale(1.05)';
                img.style.filter = 'brightness(1.1)';
            });

            img.addEventListener('mouseleave', () => {
                img.style.transform = 'scale(1)';
                img.style.filter = 'brightness(1)';
            });
        });
    }

    handleImageClick(imageElement) {
        const src = imageElement.src;
        const alt = imageElement.alt;
        const captionElement = imageElement.parentElement.querySelector('.image-caption');
        const caption = captionElement ? captionElement.textContent : alt;
        
        this.open(src, caption);
    }

    open(imageSrc, caption) {
        if (!this.lightbox || !this.lightboxImage || !this.lightboxCaption) {
            console.error('Lightbox elements not found');
            return;
        }

        this.lightboxImage.src = imageSrc;
        this.lightboxCaption.textContent = caption || '';
        this.lightbox.classList.remove('hidden');
        this.isOpen = true;
        
        // Prevent body scrolling
        document.body.style.overflow = 'hidden';
        
        // Focus management
        this.lightbox.focus();
        
        // Animate image loading
        this.lightboxImage.style.opacity = '0';
        this.lightboxImage.onload = () => {
            this.lightboxImage.style.transition = 'opacity 0.3s ease';
            this.lightboxImage.style.opacity = '1';
        };

        // Handle image load error
        this.lightboxImage.onerror = () => {
            console.error('Failed to load image:', imageSrc);
            this.lightboxCaption.textContent = 'Failed to load image';
        };
    }

    close() {
        if (!this.lightbox) return;
        
        this.lightbox.classList.add('hidden');
        this.isOpen = false;
        
        // Restore body scrolling
        document.body.style.overflow = 'auto';
        
        // Clear image source after transition
        setTimeout(() => {
            if (this.lightboxImage) {
                this.lightboxImage.src = '';
                this.lightboxImage.style.opacity = '1';
            }
            if (this.lightboxCaption) {
                this.lightboxCaption.textContent = '';
            }
        }, 300);
    }
}

// Global functions for HTML onclick handlers
function nextSlide() {
    if (window.presentation) {
        window.presentation.nextSlide();
    }
}

function previousSlide() {
    if (window.presentation) {
        window.presentation.previousSlide();
    }
}

function goToSlide(slideNumber) {
    if (window.presentation) {
        window.presentation.goToSlide(slideNumber);
    }
}

// Enhanced UI interactions
class UIEnhancements {
    constructor() {
        this.init();
    }

    init() {
        this.addHoverEffects();
        this.addClickEffects();
        this.addProgressIndicator();
        this.addFullscreenSupport();
        this.addImageLoadingEffects();
    }

    addHoverEffects() {
        // Add hover effects to interactive elements
        const interactiveElements = document.querySelectorAll('.service-card, .advantage-card, .solution-card, .philosophy-item, .material-item, .quality, .traditional-item');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.transform = 'translateY(-8px) scale(1.02)';
            });

            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Add hover effects to gallery items
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-4px)';
                item.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.3)';
            });

            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0)';
                item.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
            });
        });
    }

    addClickEffects() {
        // Add click ripple effect to buttons
        const buttons = document.querySelectorAll('.btn, .nav-btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                
                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                button.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    addProgressIndicator() {
        // Create progress bar
        const progressBar = document.createElement('div');
        progressBar.classList.add('progress-bar');
        progressBar.innerHTML = '<div class="progress-fill"></div>';
        document.body.appendChild(progressBar);

        // Update progress on slide change
        const updateProgress = () => {
            const progress = (window.presentation.currentSlide / window.presentation.totalSlides) * 100;
            const progressFill = document.querySelector('.progress-fill');
            if (progressFill) {
                progressFill.style.width = progress + '%';
            }
        };

        // Override goToSlide to update progress
        if (window.presentation) {
            const originalGoToSlide = window.presentation.goToSlide.bind(window.presentation);
            window.presentation.goToSlide = function(slideNumber) {
                originalGoToSlide(slideNumber);
                setTimeout(updateProgress, 50);
            };
        }

        updateProgress();
    }

    addFullscreenSupport() {
        // Add fullscreen toggle
        const fullscreenBtn = document.createElement('button');
        fullscreenBtn.classList.add('fullscreen-btn');
        fullscreenBtn.innerHTML = '⛶';
        fullscreenBtn.title = 'Toggle Fullscreen';
        document.body.appendChild(fullscreenBtn);

        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    console.log('Fullscreen error:', err);
                });
            } else {
                document.exitFullscreen().catch(err => {
                    console.log('Exit fullscreen error:', err);
                });
            }
        });

        // Update button icon on fullscreen change
        document.addEventListener('fullscreenchange', () => {
            fullscreenBtn.innerHTML = document.fullscreenElement ? '❌' : '⛶';
        });
    }

    addImageLoadingEffects() {
        // Add loading effects to images
        const images = document.querySelectorAll('img');
        images.forEach(image => {
            if (!image.complete) {
                image.style.opacity = '0';
                image.addEventListener('load', () => {
                    image.style.transition = 'opacity 0.5s ease';
                    image.style.opacity = '1';
                });
                
                image.addEventListener('error', () => {
                    console.error('Failed to load image:', image.src);
                    image.style.opacity = '1';
                });
            }
        });
    }
}

// Slide-specific interactions
class SlideInteractions {
    constructor() {
        this.init();
    }

    init() {
        this.addSlideSpecificFeatures();
    }

    addSlideSpecificFeatures() {
        this.addContactFormInteraction();
        this.addTestimonialRotation();
        this.addProjectHover();
    }

    addContactFormInteraction() {
        const contactItems = document.querySelectorAll('.contact-item');
        
        contactItems.forEach(item => {
            item.addEventListener('click', () => {
                const text = item.textContent;
                if (navigator.clipboard && text.includes('9867207625')) {
                    navigator.clipboard.writeText('9867207625').then(() => {
                        this.showNotification('Phone number copied!');
                    }).catch(err => {
                        console.log('Could not copy text: ', err);
                    });
                }
            });
        });
    }

    addTestimonialRotation() {
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        
        testimonialCards.forEach((card, index) => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = `rotate(${index % 2 === 0 ? '1deg' : '-1deg'}) scale(1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'rotate(0deg) scale(1)';
            });
        });
    }

    addProjectHover() {
        const projectItems = document.querySelectorAll('.project-item');
        
        projectItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.borderLeftWidth = '8px';
                item.style.paddingLeft = '16px';
                item.style.background = 'rgba(255, 215, 0, 0.1)';
            });

            item.addEventListener('mouseleave', () => {
                item.style.borderLeftWidth = '4px';
                item.style.paddingLeft = '20px';
                item.style.background = 'rgba(255, 215, 0, 0.05)';
            });
        });
    }

    showNotification(message) {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Accessibility enhancements
class AccessibilityEnhancements {
    constructor() {
        this.init();
    }

    init() {
        this.addAriaLabels();
        this.addFocusManagement();
        this.addScreenReaderSupport();
    }

    addAriaLabels() {
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        if (prevBtn) prevBtn.setAttribute('aria-label', 'Previous slide');
        if (nextBtn) nextBtn.setAttribute('aria-label', 'Next slide');

        // Add labels to indicators
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
            indicator.setAttribute('role', 'button');
            indicator.setAttribute('tabindex', '0');
            
            // Add keyboard support for indicators
            indicator.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    goToSlide(index + 1);
                }
            });
        });

        // Add lightbox labels
        const lightboxClose = document.querySelector('.lightbox-close');
        if (lightboxClose) {
            lightboxClose.setAttribute('aria-label', 'Close image viewer');
        }
    }

    addFocusManagement() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const focusableElements = document.querySelectorAll(
                    'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }

    addScreenReaderSupport() {
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.position = 'absolute';
        liveRegion.style.left = '-10000px';
        liveRegion.style.width = '1px';
        liveRegion.style.height = '1px';
        liveRegion.style.overflow = 'hidden';
        document.body.appendChild(liveRegion);

        // Override goToSlide to announce slide changes
        if (window.presentation) {
            const originalGoToSlide = window.presentation.goToSlide.bind(window.presentation);
            window.presentation.goToSlide = function(slideNumber) {
                originalGoToSlide(slideNumber);
                const slideTitle = document.querySelector('.slide.active .slide-title')?.textContent || 
                                  document.querySelector('.slide.active .main-title')?.textContent || 
                                  'Slide';
                liveRegion.textContent = `${slideTitle}, slide ${slideNumber} of ${window.presentation.totalSlides}`;
            };
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main presentation
    window.presentation = new GharondaPresentation();
    
    // Initialize lightbox
    window.lightboxInstance = new ImageLightbox();
    
    // Initialize enhancements
    const uiEnhancements = new UIEnhancements();
    const slideInteractions = new SlideInteractions();
    const accessibilityEnhancements = new AccessibilityEnhancements();

    // Add loading animation
    const loadingOverlay = document.createElement('div');
    loadingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        transition: opacity 0.5s ease;
    `;
    
    loadingOverlay.innerHTML = `
        <div style="text-align: center; color: #FFD700;">
            <div style="width: 60px; height: 60px; background: #FFD700; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; animation: pulse 1.5s infinite;">
                <span style="font-size: 24px; font-weight: bold; color: #1a1a1a;">GD</span>
            </div>
            <h2 style="margin: 0; font-size: 1.5rem;">GHARONDA</h2>
            <p style="margin: 10px 0 0 0; font-size: 1rem;">Loading presentation...</p>
        </div>
    `;

    document.body.appendChild(loadingOverlay);

    // Preload critical images and remove loading overlay
    const criticalImages = [
        'https://pplx-res.cloudinary.com/image/upload/v1755711219/pplx_project_search_images/f4d6fe106aab0a696ed695637aaf04d6090c33ca.png',
        'https://pplx-res.cloudinary.com/image/upload/v1755944636/pplx_project_search_images/ec8b2e7f8aa846d65ef79aa1b811707d2db20c43.png'
    ];

    let loadedImages = 0;
    const totalImages = criticalImages.length;

    const removeLoadingOverlay = () => {
        setTimeout(() => {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                if (loadingOverlay.parentNode) {
                    loadingOverlay.remove();
                }
                // Setup clickable images after loading overlay is removed
                if (window.lightboxInstance) {
                    window.lightboxInstance.setupClickableImages();
                }
            }, 500);
        }, 500);
    };

    criticalImages.forEach((src, index) => {
        const img = new Image();
        img.onload = () => {
            loadedImages++;
            if (loadedImages === totalImages) {
                removeLoadingOverlay();
            }
        };
        img.onerror = () => {
            console.error(`Failed to preload image: ${src}`);
            loadedImages++;
            if (loadedImages === totalImages) {
                removeLoadingOverlay();
            }
        };
        img.src = src;
    });

    // Fallback: remove loading overlay after maximum wait time
    setTimeout(() => {
        if (loadingOverlay.parentNode) {
            removeLoadingOverlay();
        }
    }, 3000);

    console.log('Gharonda Presentation with integrated images loaded successfully!');
});