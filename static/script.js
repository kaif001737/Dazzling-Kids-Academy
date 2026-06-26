/**
 * Dazzling Kids Learning Academy - Premium Landing Page Scripts (UI & Media Upgrades)
 * Interactivity: Mobile menu, Multi-directional Scroll Reveals, Bubbles Generator, Dynamic WhatsApp, and Slideshow Photo Album.
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 0. Preloader Splash Screen Logic (3 Seconds)
  // ==========================================
  const preloader = document.getElementById('preloader');
  if (preloader) {
    document.body.classList.add('loading');
    
    const spinner = document.querySelector('.preloader-spinner');
    const progressText = document.createElement('div');
    progressText.className = 'preloader-percentage';
    progressText.style.fontFamily = 'var(--font-display)';
    progressText.style.fontWeight = '800';
    progressText.style.color = 'var(--pink)';
    progressText.style.fontSize = '1.4rem';
    progressText.style.marginTop = '0.5rem';
    progressText.style.letterSpacing = '1px';
    progressText.innerText = '0%';
    
    const content = document.querySelector('.preloader-content');
    if (content) {
      const wrapper = document.querySelector('.preloader-spinner-wrapper');
      if (wrapper) {
        wrapper.after(progressText);
      }
    }
    
    let startTime = null;
    const duration = 2600; // 2.6s for active progress bar increase
    
    function animateProgress(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const percentage = Math.floor(progress * 100);
      progressText.innerText = `${percentage}%`;
      
      if (spinner) {
        spinner.style.animation = 'none'; // Overwrite infinite animation
        spinner.style.left = `${(progress * 100) - 100}%`;
      }
      
      if (progress < 1) {
        requestAnimationFrame(animateProgress);
      } else {
        // Hold at 100% for 400ms to hit exactly 3.0 seconds total load phase
        setTimeout(() => {
          preloader.style.opacity = '0';
          preloader.style.visibility = 'hidden';
          preloader.style.transform = 'scale(1.05)';
          preloader.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.6s';
          
          setTimeout(() => {
            preloader.style.display = 'none';
            document.body.classList.remove('loading');
            
            // Trigger animation reveals immediately
            if (typeof revealOnScroll === 'function') {
              revealOnScroll();
            }
          }, 600);
        }, 400);
      }
    }
    
    requestAnimationFrame(animateProgress);
  }

  
  // ==========================================
  // 1. Dynamic Background Bubbles Generator
  // ==========================================
  const bubbleContainer = document.getElementById('bubbleContainer');
  if (bubbleContainer) {
    const bubbleColors = [
      'rgba(255, 94, 98, 0.08)',   // Soft pinkish red
      'rgba(255, 234, 0, 0.12)',   // Soft yellow
      'rgba(74, 222, 128, 0.08)',  // Soft green
      'rgba(56, 189, 248, 0.08)',  // Soft sky blue
      'rgba(192, 132, 252, 0.08)'  // Soft purple
    ];
    
    const createBubble = () => {
      const bubble = document.createElement('div');
      bubble.classList.add('bubble');
      
      // Sizing (20px to 70px)
      const size = Math.random() * 50 + 20; 
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      
      // Initial horizontal position
      bubble.style.left = `${Math.random() * 100}%`;
      
      // Colors
      bubble.style.backgroundColor = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
      
      // Speed and delays
      const duration = Math.random() * 8 + 10; // 10s to 18s
      bubble.style.animationDuration = `${duration}s`;
      bubble.style.animationDelay = `${Math.random() * 4}s`;
      
      bubbleContainer.appendChild(bubble);
      
      // Remove bubble from DOM after animation completes
      setTimeout(() => {
        bubble.remove();
      }, (duration + 4) * 1000);
    };

    // Initial bubbles
    for (let i = 0; i < 12; i++) {
      createBubble();
    }
    
    // Spawn new bubbles
    setInterval(createBubble, 1500);
  }

  // ==========================================
  // 2. Sticky Header Styling on Scroll
  // ==========================================
  const mainHeader = document.getElementById('mainHeader');
  const handleScroll = () => {
    if (window.scrollY > 40) {
      mainHeader?.classList.add('scrolled');
    } else {
      mainHeader?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger immediately to format layout correctly if loaded scrolled

  // ==========================================
  // 3. Navigation Menu & Dropdown
  // ==========================================
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navOverlay = document.getElementById('navOverlay');
  const navDropdown = document.getElementById('navDropdown');
  const dropdownToggle = navDropdown?.querySelector('.nav-dropdown-toggle');

  const closeNavMenu = () => {
    navMenu?.classList.remove('active');
    navOverlay?.classList.remove('active');
    hamburgerBtn?.classList.remove('active');
    navDropdown?.classList.remove('open');
    dropdownToggle?.setAttribute('aria-expanded', 'false');
    hamburgerBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  const openNavMenu = () => {
    navMenu?.classList.add('active');
    navOverlay?.classList.add('active');
    hamburgerBtn?.classList.add('active');
    hamburgerBtn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        closeNavMenu();
      } else {
        openNavMenu();
      }
    });

    navOverlay?.addEventListener('click', closeNavMenu);

    document.querySelectorAll('.nav-link[href], .nav-cta, .nav-dropdown-link').forEach(link => {
      link.addEventListener('click', closeNavMenu);
    });
  }

  if (navDropdown && dropdownToggle) {
    dropdownToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navDropdown.classList.toggle('open');
      dropdownToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.addEventListener('click', (e) => {
      if (!navDropdown.contains(e.target)) {
        navDropdown.classList.remove('open');
        dropdownToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNavMenu();
  });

  // ==========================================
  // 4. Advanced Spring Scroll Reveal (Observer)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('active'));
  }

  // ==========================================
  // 5. Dynamic WhatsApp Link Generation
  // ==========================================
  const waNumber = '918838478500'; // Target school phone with country code (91 for India)
  const welcomeText = '🌟 Welcome to DK Academy 🌟 Thank you for contacting us... Kindly share your child’s age & requirement...';
  const encodedText = encodeURIComponent(welcomeText);
  const waURL = `https://api.whatsapp.com/send?phone=${waNumber}&text=${encodedText}`;
  
  const waLinks = document.querySelectorAll('.wa-dynamic-link');
  waLinks.forEach(link => {
    link.href = waURL;
  });

  // ==========================================
  // 6. Upgraded Slideshow Album Lightbox
  // ==========================================
  const galleryLightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxCaptionTitle = document.getElementById('lightboxCaptionTitle');
  const lightboxCaptionTag = document.getElementById('lightboxCaptionTag');
  
  // Create a unified array of all image cards (galleries + ceremony album)
  const albumItems = Array.from(document.querySelectorAll('.gallery-item, .infra-card, .vidhyarambham-item'));
  let activeIndex = -1;
  let activeAlbumItems = [];

  const getAlbumName = (item) => {
    if (item.getAttribute('data-album')) return item.getAttribute('data-album');
    if (item.classList.contains('infra-card')) return 'infrastructure';
    if (item.classList.contains('vidhyarambham-item')) return 'vidhyarambham';
    return 'gallery';
  };

  const getAlbumItems = (albumName) =>
    albumItems.filter((item) => getAlbumName(item) === albumName);
  
  const updateLightboxContent = (index) => {
    if (index >= 0 && index < activeAlbumItems.length) {
      activeIndex = index;
      const targetItem = activeAlbumItems[activeIndex];
      
      let imgSrc = targetItem.getAttribute('data-img');
      if (imgSrc && !imgSrc.startsWith('/') && !imgSrc.startsWith('http://') && !imgSrc.startsWith('https://')) {
        imgSrc = '/static/' + imgSrc;
      }
      const title = targetItem.getAttribute('data-title') || 'Dazzling Kids Album';
      const tag = targetItem.getAttribute('data-tag') || 'Showcase';
      
      // Set values in modal DOM
      lightboxImg.src = imgSrc;
      lightboxCaptionTitle.textContent = title;
      lightboxCaptionTag.textContent = tag;
    }
  };
  
  // Set up click listeners for all gallery card wrappers
  albumItems.forEach((item) => {
    item.addEventListener('click', () => {
      activeAlbumItems = getAlbumItems(getAlbumName(item));
      const index = activeAlbumItems.indexOf(item);
      updateLightboxContent(index);
      
      // Open modal
      if (galleryLightbox) {
        galleryLightbox.style.display = 'flex';
        setTimeout(() => {
          galleryLightbox.classList.add('active');
        }, 10);
      }
    });
  });
  
  // Navigation trigger functions
  const showNextImage = () => {
    let nextIndex = activeIndex + 1;
    if (nextIndex >= activeAlbumItems.length) {
      nextIndex = 0; // Wrap back to first item
    }
    updateLightboxContent(nextIndex);
  };
  
  const showPrevImage = () => {
    let prevIndex = activeIndex - 1;
    if (prevIndex < 0) {
      prevIndex = activeAlbumItems.length - 1; // Wrap to last item
    }
    updateLightboxContent(prevIndex);
  };
  
  // Bind next/prev button clicks
  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation(); // Avoid closing lightbox
      showNextImage();
    });
  }
  
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation(); // Avoid closing lightbox
      showPrevImage();
    });
  }
  
  // Close triggers
  if (galleryLightbox && lightboxClose) {
    const closeLightbox = () => {
      galleryLightbox.classList.remove('active');
      setTimeout(() => {
        galleryLightbox.style.display = 'none';
        if (lightboxImg) lightboxImg.src = '';
      }, 300);
    };
    
    lightboxClose.addEventListener('click', closeLightbox);
    
    galleryLightbox.addEventListener('click', (e) => {
      // Close only if clicking dark background, not content/nav buttons
      if (e.target === galleryLightbox) {
        closeLightbox();
      }
    });
    
    // Bind Arrow Keys and Escape Key
    document.addEventListener('keydown', (e) => {
      if (galleryLightbox.classList.contains('active')) {
        if (e.key === 'Escape') {
          closeLightbox();
        } else if (e.key === 'ArrowRight') {
          showNextImage();
        } else if (e.key === 'ArrowLeft') {
          showPrevImage();
        }
      }
    });
  }

  // ==========================================
  // 7. Inquiry Form Submission (Flask SMTP)
  // ==========================================
  const BUSINESS_NAME = 'Dazzling Kids Learning Academy';
  const inquiryForm = document.getElementById('inquiryForm');
  const submitBtn = document.getElementById('submitBtn');
  const formFeedback = document.getElementById('formFeedback');

  const resetSubmitButton = () => {
    if (!submitBtn) return;
    submitBtn.disabled = false;
    const btnSpan = submitBtn.querySelector('span');
    const btnIcon = submitBtn.querySelector('i');
    if (btnSpan) btnSpan.textContent = 'Send Message';
    if (btnIcon) btnIcon.className = 'fa-solid fa-paper-plane';
  };

  const setSubmitButtonLoading = (isLoading) => {
    if (!submitBtn) return;
    submitBtn.disabled = isLoading;
    const btnSpan = submitBtn.querySelector('span');
    const btnIcon = submitBtn.querySelector('i');
    if (btnSpan) btnSpan.textContent = isLoading ? 'Sending...' : 'Send Message';
    if (btnIcon) btnIcon.className = isLoading ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-paper-plane';
  };

  const showFormFeedback = (message, type = 'error') => {
    if (!formFeedback) return;
    formFeedback.hidden = false;
    formFeedback.textContent = message;
    formFeedback.className = `form-feedback form-feedback--${type}`;
  };

  const clearFormFeedback = () => {
    if (!formFeedback) return;
    formFeedback.hidden = true;
    formFeedback.textContent = '';
    formFeedback.className = 'form-feedback';
  };

  const clearFieldErrors = () => {
    inquiryForm?.querySelectorAll('.form-control.is-invalid').forEach((field) => {
      field.classList.remove('is-invalid');
    });
  };

  const markFieldInvalid = (fieldId) => {
    const field = document.getElementById(fieldId);
    if (field) field.classList.add('is-invalid');
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const showSuccessModal = (parentName) => {
    const overlay = document.createElement('div');
    overlay.className = 'inquiry-success-overlay';
    overlay.innerHTML = `
      <div class="inquiry-success-card" role="dialog" aria-labelledby="inquirySuccessTitle" aria-modal="true">
        <div class="inquiry-success-icon">
          <i class="fa-solid fa-circle-check"></i>
        </div>
        <p class="inquiry-success-brand">${BUSINESS_NAME}</p>
        <h4 id="inquirySuccessTitle" class="inquiry-success-title">Thank You, ${parentName}!</h4>
        <p class="inquiry-success-text">
          Your message has been sent successfully. A thank-you email from our academy is on its way to you, and our team will contact you within 24 hours.
        </p>
        <button type="button" id="closeSuccessBtn" class="inquiry-success-btn">Close</button>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector('#closeSuccessBtn')?.addEventListener('click', () => {
      overlay.remove();
      inquiryForm.reset();
      clearFormFeedback();
      clearFieldErrors();
      resetSubmitButton();
    });
  };

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearFormFeedback();
      clearFieldErrors();

      const parentName = document.getElementById('parentName').value.trim();
      const parentEmail = document.getElementById('parentEmail').value.trim();
      const contactPhone = document.getElementById('contactPhone').value.trim();
      const messageText = document.getElementById('messageText').value.trim();
      const honeypot = document.getElementById('formHoney')?.value.trim();

      if (honeypot) return;

      let hasError = false;

      if (!parentName) {
        markFieldInvalid('parentName');
        hasError = true;
      }

      if (!parentEmail || !isValidEmail(parentEmail)) {
        markFieldInvalid('parentEmail');
        hasError = true;
      }

      if (!contactPhone || !/^\d{10}$/.test(contactPhone.replace(/[\s-]/g, ''))) {
        markFieldInvalid('contactPhone');
        hasError = true;
      }

      if (!messageText) {
        markFieldInvalid('messageText');
        hasError = true;
      }

      if (hasError) {
        showFormFeedback('Please enter your name, email, a valid 10-digit mobile number, and your message.');
        return;
      }

      setSubmitButtonLoading(true);

      try {
        const response = await fetch('/api/inquiry', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            name: parentName,
            email: parentEmail,
            mobile: contactPhone,
            message: messageText,
            _honey: honeypot
          })
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok || result.success === false) {
          throw new Error(result.message || 'Unable to send your message right now.');
        }

        showSuccessModal(parentName);
      } catch (error) {
        showFormFeedback(
          error.message || 'Something went wrong. Please try again or call us at 88384 78500.',
          'error'
        );
        setSubmitButtonLoading(false);
      }
    });

    inquiryForm.querySelectorAll('.form-control').forEach((field) => {
      field.addEventListener('input', () => {
        field.classList.remove('is-invalid');
        if (formFeedback && !formFeedback.hidden) clearFormFeedback();
      });
    });
  }

  // ==========================================
  // 8. Principal Slideshow Auto-Rotation
  // ==========================================
  const principalSlides = document.querySelectorAll('.principal-slide');
  if (principalSlides.length > 1) {
    let currentSlide = 0;
    // Find the currently active slide index
    principalSlides.forEach((slide, index) => {
      if (slide.classList.contains('active')) {
        currentSlide = index;
      }
    });

    setInterval(() => {
      principalSlides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % principalSlides.length;
      principalSlides[currentSlide].classList.add('active');
    }, 4000); // Rotate every 4 seconds
  }
});
