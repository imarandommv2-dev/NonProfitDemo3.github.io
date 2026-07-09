/* ═══════════════════════════════════════════════════════════════════
   ACC-WA — main.js
   Interactions, scroll animations, nav behavior
   ═══════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar scroll behavior ──────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  function updateNav() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ── Mobile hamburger ────────────────────────────────────────── */
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('nav-mobile-menu');
  hamburger?.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open.toString());
  });
  // Close on link click
  mobileMenu?.querySelectorAll('.nav-mobile-link, .btn').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
    });
  });

  /* ── Hero entrance animation ─────────────────────────────────── */
  const heroBg = document.getElementById('hero-bg');
  const heroContent = document.getElementById('hero-content');
  setTimeout(() => heroBg?.classList.add('loaded'), 100);
  setTimeout(() => heroContent?.classList.add('visible'), 200);

  /* ── Smooth scroll for anchor links ─────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── Intersection Observer — fade-up animations ──────────────── */
  const animateEls = document.querySelectorAll(
    '.fade-up, .program-card, .event-card, .testimonial-card, .location-card, ' +
    '.mission-card, .about-text, .about-visual, .section-header, ' +
    '.contact-info, .contact-form, .donate-content, .value-item, ' +
    '.hero-stat'
  );

  animateEls.forEach((el, i) => {
    el.classList.add('fade-up');
    // Stagger within sibling groups
    const siblings = el.parentElement?.children;
    if (siblings) {
      const idx = Array.from(siblings).indexOf(el);
      if (idx < 6) el.classList.add(`fade-up-delay-${idx}`);
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  animateEls.forEach(el => observer.observe(el));

  /* ── Counter animation ───────────────────────────────────────── */
  const counters = document.querySelectorAll('.hero-stat-num[data-target]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const duration = 1600;
        const start = performance.now();
        const animate = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target);
          if (progress < 1) requestAnimationFrame(animate);
          else el.textContent = target;
        };
        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  /* ── Donate tier selection ───────────────────────────────────── */
  document.querySelectorAll('.donate-tier').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.donate-tier').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

  /* ── Contact form ────────────────────────────────────────────── */
  const form = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const submitBtn = document.getElementById('contact-submit');

  form?.addEventListener('submit', e => {
    e.preventDefault();
    // Basic validation
    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const message = document.getElementById('form-message').value.trim();
    if (!name || !email || !message) {
      // Highlight empty fields
      [['form-name', name], ['form-email', email], ['form-message', message]].forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (!val) { el.style.borderColor = '#c0392b'; }
        else { el.style.borderColor = ''; }
      });
      return;
    }
    // Simulate submission
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;
    setTimeout(() => {
      form.reset();
      submitBtn.textContent = 'Send Message';
      submitBtn.disabled = false;
      formSuccess.style.display = 'block';
      setTimeout(() => { formSuccess.style.display = 'none'; }, 6000);
    }, 1400);
  });

  /* ── Navbar active link highlight on scroll ──────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function setActiveNav() {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) current = section.id;
    });
    navLinks.forEach(link => {
      link.style.fontWeight = '';
      if (link.getAttribute('href') === `#${current}`) {
        link.style.fontWeight = '700';
      }
    });
  }
  window.addEventListener('scroll', setActiveNav, { passive: true });

});
