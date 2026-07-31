/* ============================================
   GİRİŞ NOKTASI
   ============================================ */

import './styles/index.css';

import { initRouter, redraw } from './router.js';
import { applyTranslations, toggleLang, otherLangLabel, getLang } from './i18n.js';
import { handleProjectsClick } from './pages/Projects.js';

/* ============================================
   GİRİŞ EKRANI
   ============================================ */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  const dismiss = () => loader.classList.add('is-done');

  // Fontlar yerleşince kapat; takılırsa emniyet süresi devreye girer.
  const ready = document.fonts?.ready ?? Promise.resolve();
  Promise.race([ready, new Promise((r) => setTimeout(r, 1500))])
    .then(() => setTimeout(dismiss, 400));
}

/* ============================================
   TEMA (Açık / Koyu)
   Varsayılan açık tema (Palet A — Case Study).
   Koyu tema (Palet C — Gölge) data-theme="dark" ile açılır.
   ============================================ */
function initTheme() {
  const btn = document.getElementById('theme-toggle');

  // Varsayılan DAİMA açık tema (Palet A). Sistemin koyu tema tercihi
  // bilerek dikkate alınmıyor: sitenin kimliği Palet A üzerine kurulu,
  // ilk izlenim onunla verilmeli. Koyu tema (Palet C) kullanıcının
  // kendi seçimiyle açılır ve tercih olarak saklanır.
  const theme = localStorage.getItem('theme') || 'light';

  document.documentElement.setAttribute('data-theme', theme);

  btn?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

/* ============================================
   DİL
   ============================================ */
function initLang() {
  const btn = document.getElementById('lang-toggle');

  document.documentElement.lang = getLang();
  applyTranslations();

  const sync = () => {
    if (btn) btn.textContent = otherLangLabel();
  };

  sync();

  btn?.addEventListener('click', () => {
    toggleLang();
    sync();
  });
}

/* ============================================
   MOBİL MENÜ
   ============================================ */
function initNav() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  if (!toggle || !menu) return;

  const close = () => {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  // Bağlantıya tıklanınca menü kapansın
  menu.addEventListener('click', (e) => {
    if (e.target.closest('.navbar__link')) close();
  });

  window.addEventListener('hashchange', close);
}

/* ============================================
   NAVBAR — aşağı kaydırırken gizlen, yukarıda geri gel
   ============================================ */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastY = window.scrollY;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const menuOpen = document.getElementById('nav-menu')?.classList.contains('is-open');

    if (!menuOpen && y > 120 && y > lastY) {
      navbar.classList.add('is-hidden');
    } else {
      navbar.classList.remove('is-hidden');
    }

    lastY = y;
  }, { passive: true });
}

/* ============================================
   SCROLL REVEAL
   Her sayfa çizildikten sonra yeni .reveal'lar bağlanır.
   ============================================ */
let revealObserver;

function initScrollReveal() {
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  observeReveals();
}

function observeReveals() {
  if (!revealObserver) return;
  document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => {
    revealObserver.observe(el);
  });
}

/* ============================================
   SAYFA İÇİ ETKİLEŞİM DELEGASYONU
   #app üzerinde TEK dinleyici — sayfa her çizildiğinde
   yeni dinleyici eklenmesini önler.
   ============================================ */
function initDelegation() {
  const app = document.getElementById('app');
  if (!app) return;

  app.addEventListener('click', (e) => {
    if (handleProjectsClick(e)) redraw();
  });
}

/* ============================================
   BAŞLAT
   ============================================ */
function init() {
  initTheme();
  initLang();
  initNav();
  initNavbarScroll();
  initDelegation();
  initRouter();
  initScrollReveal();
  initLoader();

  // Router her çizimden sonra haber verir
  window.addEventListener('pagerendered', observeReveals);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
