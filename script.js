(function () {
  'use strict';

  // Nav scroll effect
  const nav = document.getElementById('nav');
  const hero = document.getElementById('hero');

  function onScroll() {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hero entrance animation
  window.addEventListener('load', function () {
    hero.classList.add('loaded');

    const heroVideo = document.querySelector('.hero__video');
    if (heroVideo) {
      heroVideo.play().catch(function () {});
    }
  });

  // Hero accent image slideshow
  const heroSlides = document.querySelectorAll('.hero__slide');
  if (heroSlides.length > 1) {
    let heroSlideIndex = 0;

    setInterval(function () {
      heroSlides[heroSlideIndex].classList.remove('is-active');
      heroSlideIndex = (heroSlideIndex + 1) % heroSlides.length;
      heroSlides[heroSlideIndex].classList.add('is-active');
    }, 3500);
  }

  // Scroll reveal via Intersection Observer
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealEls.forEach(function (el) {
    // Skip hero elements — they animate on load instead
    if (!el.closest('.hero')) {
      revealObserver.observe(el);
    }
  });

  // Mobile nav toggle
  const toggle = document.querySelector('.nav__toggle');
  const navEl = document.getElementById('nav');
  const navLinks = document.querySelector('.nav__links');
  const navActions = document.querySelector('.nav__actions');

  if (toggle && navEl) {
    toggle.addEventListener('click', function () {
      navEl.classList.toggle('nav--open');
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navEl.classList.remove('nav--open');
      });
    });
  }

  // Smooth anchor scroll offset for floating nav
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 110;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  // Testimonial slider
  const track = document.getElementById('testimonial-track');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');
  const dotsContainer = document.getElementById('testimonial-dots');

  if (track && prevBtn && nextBtn && dotsContainer) {
    const cards = track.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    let slidesPerView = 3;

    function getSlidesPerView() {
      if (window.innerWidth <= 600) return 1;
      if (window.innerWidth <= 900) return 1;
      if (window.innerWidth <= 1100) return 2;
      return 3;
    }

    function getMaxIndex() {
      return Math.max(0, cards.length - slidesPerView);
    }

    function buildDots() {
      dotsContainer.innerHTML = '';
      const total = getMaxIndex() + 1;
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.className = 'testimonials__dot' + (i === currentIndex ? ' active' : '');
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        dot.addEventListener('click', function () {
          currentIndex = i;
          updateSlider();
        });
        dotsContainer.appendChild(dot);
      }
    }

    function updateSlider() {
      slidesPerView = getSlidesPerView();
      currentIndex = Math.min(currentIndex, getMaxIndex());
      const card = cards[0];
      if (!card) return;
      const gap = 24;
      const offset = currentIndex * (card.offsetWidth + gap);
      track.style.transform = 'translateX(-' + offset + 'px)';

      dotsContainer.querySelectorAll('.testimonials__dot').forEach(function (dot, i) {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    prevBtn.addEventListener('click', function () {
      currentIndex = currentIndex > 0 ? currentIndex - 1 : getMaxIndex();
      updateSlider();
    });

    nextBtn.addEventListener('click', function () {
      currentIndex = currentIndex < getMaxIndex() ? currentIndex + 1 : 0;
      updateSlider();
    });

    buildDots();
    updateSlider();

    window.addEventListener('resize', function () {
      buildDots();
      updateSlider();
    });

    // Auto-advance every 6 seconds
    setInterval(function () {
      currentIndex = currentIndex < getMaxIndex() ? currentIndex + 1 : 0;
      updateSlider();
    }, 6000);
  }
})();

// FAQ accordion
document.querySelectorAll('.faq-item__q').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var expanded = this.getAttribute('aria-expanded') === 'true';
    // close all
    document.querySelectorAll('.faq-item__q').forEach(function(b) {
      b.setAttribute('aria-expanded', 'false');
    });
    // open clicked if it was closed
    if (!expanded) this.setAttribute('aria-expanded', 'true');
  });
});

// Product filter tabs
document.querySelectorAll('.filter-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.filter-btn').forEach(function(b) {
      b.classList.remove('filter-btn--active');
    });
    this.classList.add('filter-btn--active');
  });
});
