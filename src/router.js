/* ============================================
   ROUTER — hash tabanlı SPA yönlendirme
   Sayfa geçişi: kısa fade-out → çiz → fade-in.
   Eames'çe kesin geçiş; yay/zıplama yok.
   ============================================ */

import { t } from './i18n.js';
import { renderHome } from './pages/Home.js';
import { renderProjects } from './pages/Projects.js';
import { renderPlaceholder } from './pages/Placeholder.js';

const routes = {
  '/': { render: renderHome, title: 'Görkem Sırmalı — Mimarlık Portfolyo' },
  '/projeler': { render: renderProjects, titleKey: 'projects.title' },
  '/hakkimda': { render: () => renderPlaceholder('about.title'), titleKey: 'about.title' },
  '/cv': { render: () => renderPlaceholder('cv.title'), titleKey: 'cv.title' },
  '/blog': { render: () => renderPlaceholder('blog.title'), titleKey: 'blog.title' },
  '/fotograflar': { render: () => renderPlaceholder('photos.title'), titleKey: 'photos.title' },
  '/iletisim': { render: () => renderPlaceholder('contact.title'), titleKey: 'contact.title' },
};

function currentPath() {
  const hash = window.location.hash.replace(/^#/, '');
  return hash || '/';
}

function setActiveLink(path) {
  document.querySelectorAll('.navbar__link').forEach((link) => {
    const target = link.getAttribute('href').replace(/^#/, '') || '/';
    link.classList.toggle('is-active', target === path);
  });
}

function renderNotFound() {
  return `
    <section class="container">
      <div class="placeholder">
        <span class="overline">404</span>
        <h1>${t('page.notFound')}</h1>
        <a href="#/" class="btn">${t('page.backHome')}</a>
      </div>
    </section>
  `;
}

function draw(path) {
  const app = document.getElementById('app');
  if (!app) return;

  const route = routes[path];
  const html = route ? route.render() : renderNotFound();

  app.innerHTML = html;

  document.title = route
    ? (route.titleKey ? `${t(route.titleKey)} — Görkem Sırmalı` : route.title)
    : `${t('page.notFound')} — Görkem Sırmalı`;

  setActiveLink(path);

  // Yeni içerikteki reveal elemanlarını gözlemciye bağla
  window.dispatchEvent(new CustomEvent('pagerendered', { detail: { path } }));
}

/** Geçiş animasyonuyla birlikte çizer. */
function navigate() {
  const app = document.getElementById('app');
  const path = currentPath();

  if (!app) return;

  app.classList.add('is-leaving');

  window.setTimeout(() => {
    draw(path);
    app.classList.remove('is-leaving');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, 140); // --duration-fast ile eşleşir
}

/** Aktif sayfayı geçiş animasyonu olmadan yeniden çizer. */
export function redraw() {
  draw(currentPath());
}

export function initRouter() {
  window.addEventListener('hashchange', navigate);

  // Dil değişince aktif sayfa yeniden çizilir
  window.addEventListener('langchange', () => draw(currentPath()));

  if (!window.location.hash) {
    window.location.hash = '#/';
  }

  draw(currentPath());
}
