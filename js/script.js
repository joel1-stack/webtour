/* ============================================
   GREAT AFRICAN ADVENTURE - Main JavaScript
   Animations, Interactions & Effects
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Preloader ----
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.style.overflow = 'auto';
      }, 1500);
    });
    // Fallback: hide after 4s
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }, 4000);
  }

  // ---- Sticky Navigation ----
  const mainNav = document.querySelector('.main-nav');
  const topBar = document.querySelector('.top-bar');
  let topBarHeight = topBar ? topBar.offsetHeight : 0;

  function handleScroll() {
    const scrollY = window.scrollY;

    // Nav background
    if (mainNav) {
      if (scrollY > topBarHeight + 50) {
        mainNav.classList.add('scrolled');
      } else {
        mainNav.classList.remove('scrolled');
      }
    }

    // Back to top
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
      if (scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }

    // Parallax removed for clean theme
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // ---- Mobile Menu ----
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navOverlay = document.querySelector('.nav-overlay');

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      if (navOverlay) navOverlay.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      navLinks.classList.remove('active');
      navOverlay.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  }

  // Close mobile menu on link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      if (mobileToggle) {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('active');
        if (navOverlay) navOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  });

  // ---- Scroll Animations (Intersection Observer) ----
  const animateElements = document.querySelectorAll('.animate-on-scroll, .animate-left, .animate-right, .animate-scale, .animate-rotate, .animate-flip, .animate-zoom, .stagger-children, .animate-bounce-up');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(el => observer.observe(el));
  } else {
    animateElements.forEach(el => el.classList.add('animated'));
  }

  // ---- Counter Animation ----
  const counters = document.querySelectorAll('.counter-value');

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = prefix + Math.floor(current) + suffix;
    }, 16);
  }

  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  // ---- Smooth Scroll ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = mainNav ? mainNav.offsetHeight : 0;
        const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - navHeight - 20;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });

  // ---- Back to Top ----
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Particles removed for clean white theme

  // ---- Gallery Filter ----
  const filterBtns = document.querySelectorAll('.gallery-filter');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.classList.remove('hidden');
          item.style.animation = 'slideInScale 0.5s ease forwards';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // ---- Lightbox ----
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  let currentLightboxIndex = 0;
  let visibleItems = [];

  function openLightbox(index) {
    if (!lightbox) return;
    visibleItems = Array.from(document.querySelectorAll('.gallery-item:not(.hidden)'));
    currentLightboxIndex = index;
    const img = visibleItems[currentLightboxIndex].querySelector('img');
    lightboxImg.src = img.src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  function navigateLightbox(dir) {
    visibleItems = Array.from(document.querySelectorAll('.gallery-item:not(.hidden)'));
    currentLightboxIndex += dir;
    if (currentLightboxIndex >= visibleItems.length) currentLightboxIndex = 0;
    if (currentLightboxIndex < 0) currentLightboxIndex = visibleItems.length - 1;
    const img = visibleItems[currentLightboxIndex].querySelector('img');
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.src = img.src;
      lightboxImg.style.opacity = '1';
    }, 200);
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => navigateLightbox(1));

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  // ---- Contact Form ----
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = this.querySelector('[name="name"]');
      const email = this.querySelector('[name="email"]');
      const message = this.querySelector('[name="message"]');
      let valid = true;

      // Simple validation
      [name, email, message].forEach(field => {
        if (field && !field.value.trim()) {
          field.style.borderColor = '#dc2626';
          valid = false;
        } else if (field) {
          field.style.borderColor = 'var(--gray-200)';
        }
      });

      if (email && email.value && !isValidEmail(email.value)) {
        email.style.borderColor = '#dc2626';
        valid = false;
      }

      if (valid) {
        showToast('Message sent successfully! We will get back to you soon.', 'success');
        this.reset();
      } else {
        showToast('Please fill in all required fields correctly.', 'error');
      }
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ---- Toast Notification ----
  function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 50);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 500);
    }, 4000);
  }

  // ---- Testimonial Slider ----
  const testimonials = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testimonial-dot');
  let currentTestimonial = 0;
  let testimonialInterval;

  function showTestimonial(index) {
    testimonials.forEach(t => {
      t.style.display = 'none';
      t.style.opacity = '0';
    });
    dots.forEach(d => d.classList.remove('active'));

    if (testimonials[index]) {
      testimonials[index].style.display = 'block';
      setTimeout(() => {
        testimonials[index].style.opacity = '1';
      }, 50);
    }
    if (dots[index]) dots[index].classList.add('active');
    currentTestimonial = index;
  }

  if (testimonials.length > 0) {
    showTestimonial(0);
    testimonialInterval = setInterval(() => {
      showTestimonial((currentTestimonial + 1) % testimonials.length);
    }, 6000);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(testimonialInterval);
      showTestimonial(i);
      testimonialInterval = setInterval(() => {
        showTestimonial((currentTestimonial + 1) % testimonials.length);
      }, 6000);
    });
  });

  // ---- Tilt Effect on Cards ----
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 15;
      const rotateY = (centerX - x) / 15;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  // ---- Typed Effect for Hero ----
  const typedEl = document.querySelector('.typed-text');
  if (typedEl) {
    const words = JSON.parse(typedEl.getAttribute('data-words'));
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function typeEffect() {
      const currentWord = words[wordIndex];

      if (isDeleting) {
        typedEl.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
      } else {
        typedEl.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
      }

      if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500;
      }

      setTimeout(typeEffect, typeSpeed);
    }

    setTimeout(typeEffect, 1000);
  }

  // ---- Navbar Active State based on page ----
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a:not(.nav-cta)').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ---- Image Lazy Loading ----
  const lazyImages = document.querySelectorAll('img[data-src]');
  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
          img.addEventListener('load', () => img.classList.add('loaded'));
          imgObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imgObserver.observe(img));
  }

  // ---- Marquee Duplicate for Seamless Loop ----
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    const items = marqueeTrack.innerHTML;
    marqueeTrack.innerHTML = items + items;
  }

  // ---- Form Input Animations ----
  document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('focus', function () {
      this.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', function () {
      if (!this.value) {
        this.parentElement.classList.remove('focused');
      }
    });
  });

  // ---- Video Fallback ----
  const heroVideo = document.querySelector('.hero-video-bg video');
  if (heroVideo) {
    heroVideo.addEventListener('error', () => {
      document.querySelector('.hero-video-bg').style.display = 'none';
      const fallback = document.querySelector('.hero-bg-fallback');
      if (fallback) fallback.style.zIndex = '0';
    });
    // Also try to play on user interaction if autoplay blocked
    document.addEventListener('click', () => {
      if (heroVideo.paused) {
        heroVideo.play().catch(() => {});
      }
    }, { once: true });
  }
});
