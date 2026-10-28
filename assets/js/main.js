/**
 * Flexora.Ai — Master Site JavaScript (assets/js/main.js)
 * Shared interactions, animations, menu handling, and utilities.
 */

(function () {
  'use strict';

  // ---- 1. Global Toast Helper ----
  const toastEl = document.getElementById('toast');
  window.showToast = function (msg) {
    let t = toastEl || document.querySelector('.toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'toast';
      t.id = 'toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => {
      t.classList.remove('show');
    }, 2800);
  };

  // ---- 2. Mobile Navigation Toggle ----
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileMenu.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', mobileMenu.classList.contains('open'));
    });
    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && e.target !== menuBtn) {
        mobileMenu.classList.remove('open');
      }
    });
  }

  // ---- 3. Active Nav Link Highlighter ----
  (function highlightNav() {
    const rawPath = window.location.pathname.split('/').filter(Boolean).pop() || 'index.html';
    const cleanPath = rawPath.toLowerCase();
    document.querySelectorAll('.nav-links a[href], .mobile-menu a[href]').forEach(link => {
      const linkPath = (link.getAttribute('href') || '').split('#')[0].split('?')[0].split('/').filter(Boolean).pop() || 'index.html';
      if (linkPath.toLowerCase() === cleanPath) {
        link.classList.add('active');
      }
    });
  })();

  // ---- 4. Scroll Progress Bar ----
  (function initScrollProgress() {
    let bar = document.querySelector('.scroll-progress');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'scroll-progress';
      document.body.appendChild(bar);
    }
    window.addEventListener('scroll', () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      bar.style.width = scrolled + '%';
    }, { passive: true });
  })();

  // ---- 5. Back to Top Button ----
  (function initBackToTop() {
    let btn = document.getElementById('backToTop');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'backToTop';
      btn.className = 'back-to-top';
      btn.setAttribute('aria-label', 'Back to top');
      btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>';
      document.body.appendChild(btn);
    }
    window.addEventListener('scroll', () => {
      btn.classList.toggle('show', window.scrollY > 450);
    }, { passive: true });
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  })();

  // ---- 6. Button Click Ripple Effect ----
  document.addEventListener('click', (e) => {
    const target = e.target.closest('.btn, .cat-chip, .tab, .cat-tile');
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = Math.max(rect.width, rect.height) * 1.5;
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    target.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });

  // ---- 7. Scroll Reveal Observer ----
  document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('section, .reveal');
    revealElements.forEach(el => el.classList.add('reveal'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealElements.forEach(el => observer.observe(el));
  });

  // ---- 8. Background Floating Particles ----
  (function initParticles() {
    let container = document.getElementById('bgParticles');
    if (!container) {
      container = document.createElement('div');
      container.id = 'bgParticles';
      container.className = 'bg-particles';
      document.body.appendChild(container);
    }
    if (container.children.length === 0) {
      const count = 16;
      for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = 4 + Math.random() * 8;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
        p.style.animationDuration = (14 + Math.random() * 14) + 's';
        p.style.animationDelay = (Math.random() * -18) + 's';
        container.appendChild(p);
      }
    }
  })();

  // ---- 9. Interactive Cursor Glow ----
  (function initCursorGlow() {
    let glow = document.querySelector('.cursor-glow');
    if (!glow && window.matchMedia('(pointer: fine)').matches) {
      glow = document.createElement('div');
      glow.className = 'cursor-glow';
      document.body.appendChild(glow);
      window.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
      }, { passive: true });
    }
  })();

  // ---- 10. Ambient Background Music Toggle ----
  (function initAudio() {
    const STORAGE_KEY = 'flexora_music_on';
    const TRACK_SRC = 'assets/audio/pulse-vector.mp3';
    
    // Check if on a subpage or root
    const inSubdir = window.location.pathname.includes('/tools/') && !window.location.pathname.endsWith('/tools.html');
    const audioSrc = inSubdir ? '../' + TRACK_SRC : TRACK_SRC;

    document.addEventListener('DOMContentLoaded', () => {
      let audio = document.getElementById('flexoraAudio');
      if (!audio) {
        audio = document.createElement('audio');
        audio.id = 'flexoraAudio';
        audio.src = audioSrc;
        audio.loop = true;
        audio.preload = 'none';
        document.body.appendChild(audio);
      }

      let btn = document.getElementById('musicToggle');
      if (!btn) {
        btn = document.createElement('button');
        btn.id = 'musicToggle';
        btn.setAttribute('aria-label', 'Toggle background ambient audio');
        btn.innerHTML = '&#9835;';
        Object.assign(btn.style, {
          position: 'fixed',
          bottom: '24px',
          right: '78px',
          zIndex: '69',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          border: '1px solid var(--line, #232838)',
          background: 'var(--surface, #0F131D)',
          color: 'var(--teal, #2DE2C8)',
          fontSize: '18px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        });
        document.body.appendChild(btn);
      }

      function updateBtnState(playing) {
        btn.style.borderColor = playing ? 'var(--teal, #2DE2C8)' : 'var(--line, #232838)';
        btn.style.color = playing ? 'var(--teal, #2DE2C8)' : 'var(--ink-soft, #8A90A6)';
        btn.style.boxShadow = playing ? '0 0 14px rgba(45,226,200,0.4)' : 'none';
      }

      function playMusic() {
        audio.play().then(() => {
          localStorage.setItem(STORAGE_KEY, '1');
          updateBtnState(true);
        }).catch(() => {
          updateBtnState(false);
        });
      }

      function pauseMusic() {
        audio.pause();
        localStorage.setItem(STORAGE_KEY, '0');
        updateBtnState(false);
      }

      btn.addEventListener('click', () => {
        if (audio.paused) {
          playMusic();
          window.showToast('Ambient audio started');
        } else {
          pauseMusic();
          window.showToast('Ambient audio paused');
        }
      });

      if (localStorage.getItem(STORAGE_KEY) === '1') {
        playMusic();
      }
    });
  })();

})();
