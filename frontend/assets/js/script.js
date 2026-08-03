'use strict';

/* ══════════════════════════════════
   HERO BACKGROUND SLIDER
══════════════════════════════════ */
const heroImages = [
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1920&q=80',
  'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1920&q=80',
  'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1920&q=80',
  'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1920&q=80',
  'https://images.unsplash.com/photo-1547489432-cf93fa6c71ee?w=1920&q=80',
  'https://images.unsplash.com/photo-1578357078586-491adf1aa5ba?w=1920&q=80',
];

let currentSlide = 0;

function initSlider() {
  const slides     = document.querySelectorAll('.slide');
  const indicators = document.querySelectorAll('.indicator');

  function goTo(index) {
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');
    currentSlide = (index + heroImages.length) % heroImages.length;
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
  }

  // Auto-play every 3 seconds
  setInterval(function () { goTo(currentSlide + 1); }, 3000);

  // Indicator click
  indicators.forEach(function (ind, i) {
    ind.addEventListener('click', function () { goTo(i); });
  });
}

/* ══════════════════════════════════
   NAVBAR SCROLL
══════════════════════════════════ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* ══════════════════════════════════
   AOS — SCROLL ANIMATIONS
══════════════════════════════════ */
function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-aos-delay') || 0;
        setTimeout(function () {
          entry.target.classList.add('aos-animate');
        }, parseInt(delay));
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(function (el) { observer.observe(el); });
}

/* ══════════════════════════════════
   COUNTER ANIMATION
══════════════════════════════════ */
function animateCounter(el, target, duration) {
  let start = 0;
  const step = Math.ceil(target / (duration / 16));
  const timer = setInterval(function () {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = start.toLocaleString() + (el.dataset.suffix || '');
  }, 16);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !entry.target.dataset.done) {
        entry.target.dataset.done = true;
        animateCounter(entry.target, parseInt(entry.target.dataset.count), 1800);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(function (c) { observer.observe(c); });
}

/* ══════════════════════════════════
   BUTTON RIPPLE EFFECT
══════════════════════════════════ */
function initRipple() {
  document.querySelectorAll('.ripple').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      const rect   = btn.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height);
      const x      = e.clientX - rect.left - size / 2;
      const y      = e.clientY - rect.top  - size / 2;
      const ripple = document.createElement('span');
      ripple.classList.add('ripple-effect');
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
      btn.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 700);
    });
  });
}

/* ══════════════════════════════════
   CONTACT FORM
══════════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit');
    btn.textContent = 'Message Sent ✓';
    btn.style.background = '#2ecc71';
    setTimeout(function () {
      btn.textContent = 'Send Message';
      btn.style.background = '';
      form.reset();
    }, 3000);
  });
}

/* ══════════════════════════════════
   SMOOTH SCROLL
══════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ══════════════════════════════════
   INIT ALL
══════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {
  initSlider();
  initNavbar();
  initAOS();
  initCounters();
  initRipple();
  initContactForm();
  initSmoothScroll();
});
