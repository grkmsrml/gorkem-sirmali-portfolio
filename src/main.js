/* ============================================
   GİRİŞ NOKTASI
   ============================================ */

import './styles/index.css';

import { initRouter, redraw } from './router.js';
import { applyTranslations, toggleLang, otherLangLabel, getLang } from './i18n.js';
import { handleProjectsClick } from './pages/Projects.js';
import { handleBlogClick } from './pages/Blog.js';
import { submitContactForm } from './pages/Contact.js';
import { moveSlider } from './components/ImageSlider.js';
import { downloadEnglishCV } from './pages/CV.js';
import {
  openLightbox, closeLightbox, moveLightbox, initLightboxKeys,
} from './components/Lightbox.js';
import { photoThemes } from './data/photos.js';

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

  // Dil programatik olarak da değişebiliyor (İngilizce CV üretimi gibi),
  // o yüzden etiket tıklamaya değil dil değişimine bağlı.
  window.addEventListener('langchange', sync);

  btn?.addEventListener('click', toggleLang);
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

  // Kademe sırasını kardeşler arasında hesapla ve --i olarak yaz.
  // Elle data-delay yazmaya göre avantajı: ızgaradaki eleman sayısı
  // değişse de sıra kendiliğinden doğru kalıyor.
  const groups = new Map();

  // .section__head de gözlemleniyor: alt çizgisi görünürken çiziliyor
  const targets = document.querySelectorAll(
    '.reveal:not(.is-visible), .section__head:not(.is-visible)',
  );

  targets.forEach((el) => {
    if (el.classList.contains('reveal')) {
      const parent = el.parentElement;
      const index = groups.get(parent) ?? 0;
      groups.set(parent, index + 1);
      el.style.setProperty('--i', String(index));
    }

    revealObserver.observe(el);
  });
}

/* ============================================
   GÖRSEL YÜKLEME
   Görsel hazır olunca .is-loaded ile belirir.
   width/height zaten yer ayırdığı için zıplama olmuyor.
   ============================================ */
function markLoadedImages() {
  const selector = '.cell__media img, .slider__img, .photo-cell img, .catalog__detail-art img';

  document.querySelectorAll(selector).forEach((img) => {
    if (img.dataset.loadBound) return;
    img.dataset.loadBound = '1';

    if (img.complete && img.naturalWidth > 0) {
      img.classList.add('is-loaded');
      return;
    }

    img.addEventListener('load', () => img.classList.add('is-loaded'), { once: true });
    // Yüklenemezse de gizli kalmasın — alt metni görünsün
    img.addEventListener('error', () => img.classList.add('is-loaded'), { once: true });
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
    // Slider yerinde güncellenir — sayfayı yeniden çizmeye gerek yok
    const sliderBtn = e.target.closest('[data-slider-prev], [data-slider-next]');
    if (sliderBtn) {
      const slider = sliderBtn.closest('[data-slider]');
      if (slider) moveSlider(slider, sliderBtn.hasAttribute('data-slider-prev') ? -1 : 1);
      return;
    }

    // İngilizce CV indirme — resmî PDF hazır olana kadar sayfadan üretilir
    if (e.target.closest('[data-download-en]')) {
      downloadEnglishCV();
      return;
    }

    // Fotoğrafa tıklama — lightbox o temanın fotoğrafları içinde gezinir
    const photoBtn = e.target.closest('[data-photo-theme]');
    if (photoBtn) {
      const theme = photoThemes.find((th) => th.id === photoBtn.dataset.photoTheme);
      if (theme) openLightbox(theme.items, Number(photoBtn.dataset.photoIndex));
      return;
    }

    if (handleProjectsClick(e) || handleBlogClick(e)) redraw();
  });

  // Form gönderimi — sayfa yenilenmesini engelleyip doğrulamayı biz yapıyoruz
  app.addEventListener('submit', (e) => {
    const form = e.target.closest('[data-contact-form]');
    if (!form) return;

    e.preventDefault();
    submitContactForm(form);
  });
}

/* ============================================
   LIGHTBOX
   Kendi katmanında yaşıyor (body'ye ekleniyor), o yüzden
   dinleyicileri #app delegasyonundan ayrı.
   ============================================ */
function initLightbox() {
  initLightboxKeys();

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-lb-close]')) return closeLightbox();
    if (e.target.closest('[data-lb-prev]')) return moveLightbox(-1);
    if (e.target.closest('[data-lb-next]')) return moveLightbox(1);

    // Boşluğa tıklayınca kapansın — görselin veya düğmelerin dışı
    const box = e.target.closest('#lightbox');
    if (box && !e.target.closest('.lightbox__figure')) closeLightbox();
  });

  // Sayfa değişince açık lightbox kapanmalı
  window.addEventListener('hashchange', closeLightbox);
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
  initLightbox();
  initRouter();
  initScrollReveal();
  initLoader();

  // Router her çizimden sonra haber verir
  window.addEventListener('pagerendered', () => {
    observeReveals();
    markLoadedImages();
  });

  markLoadedImages();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
