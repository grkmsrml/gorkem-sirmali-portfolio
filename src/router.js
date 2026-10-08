/* ============================================
   ROUTER — hash tabanlı SPA yönlendirme
   Sayfa geçişi: kısa fade-out → çiz → fade-in.
   Eames'çe kesin geçiş; yay/zıplama yok.

   Rotalar sırayla denenir, ilk eşleşen kazanır.
   Yakalanan gruplar render fonksiyonuna argüman olarak geçer.
   ============================================ */

import { t } from './i18n.js';
import { renderHome } from './pages/Home.js';
import { renderProjects } from './pages/Projects.js';
import { renderProjectDetail, projectTitle } from './pages/ProjectDetail.js';
import { renderAbout } from './pages/About.js';
import { renderCV } from './pages/CV.js';
import { renderBlog, renderBlogPost, postTitle } from './pages/Blog.js';
import { renderPhotos } from './pages/Photos.js';
import { renderContact } from './pages/Contact.js';

const routes = [
  {
    pattern: /^\/$/,
    render: () => renderHome(),
    title: () => t('site.title'),
  },
  {
    pattern: /^\/projeler$/,
    render: () => renderProjects(),
    title: () => t('projects.title'),
  },
  {
    // Proje detayı — paylaşılabilir adres, geri tuşu çalışır
    pattern: /^\/projeler\/([\w-]+)$/,
    render: (id) => renderProjectDetail(id),
    title: (id) => projectTitle(id) ?? t('page.notFound'),
  },
  { pattern: /^\/hakkimda$/,    render: () => renderAbout(),   title: () => t('about.title') },
  { pattern: /^\/cv$/,          render: () => renderCV(),      title: () => t('cv.title') },
  { pattern: /^\/blog$/,        render: () => renderBlog(),    title: () => t('blog.title') },
  {
    // Blog yazısı — paylaşılabilir adres
    pattern: /^\/blog\/([\w-]+)$/,
    render: (slug) => renderBlogPost(slug),
    title: (slug) => postTitle(slug) ?? t('page.notFound'),
  },
  { pattern: /^\/fotograflar$/, render: () => renderPhotos(),  title: () => t('photos.title') },
  { pattern: /^\/iletisim$/,    render: () => renderContact(), title: () => t('contact.title') },
];

function currentPath() {
  const hash = window.location.hash.replace(/^#/, '');
  return hash || '/';
}

function matchRoute(path) {
  for (const route of routes) {
    const match = path.match(route.pattern);
    if (match) return { route, params: match.slice(1) };
  }
  return null;
}

function setActiveLink(path) {
  document.querySelectorAll('.navbar__link').forEach((link) => {
    const target = link.getAttribute('href').replace(/^#/, '') || '/';
    // Detay sayfasındayken de "Projeler" işaretli kalsın
    const active = target === '/'
      ? path === '/'
      : path === target || path.startsWith(`${target}/`);
    link.classList.toggle('is-active', active);
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

  const matched = matchRoute(path);

  if (matched) {
    const { route, params } = matched;
    app.innerHTML = route.render(...params);
    // Ana sayfanın başlığı zaten adı içeriyor; ikinci kez ekleme
    const title = route.title(...params);
    document.title = title.includes('Görkem Sırmalı') ? title : `${title} — Görkem Sırmalı`;
  } else {
    app.innerHTML = renderNotFound();
    document.title = `${t('page.notFound')} — Görkem Sırmalı`;
  }

  setActiveLink(path);

  // Yeni içerikteki reveal elemanlarını gözlemciye bağla
  window.dispatchEvent(new CustomEvent('pagerendered', { detail: { path } }));
}

/** Aktif sayfayı geçiş animasyonu olmadan yeniden çizer. */
export function redraw() {
  draw(currentPath());
}

/** Geçiş animasyonuyla birlikte çizer. */
function navigate() {
  const app = document.getElementById('app');
  if (!app) return;

  app.classList.add('is-leaving');

  window.setTimeout(() => {
    draw(currentPath());
    app.classList.remove('is-leaving');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, 140); // --duration-fast ile eşleşir
}

export function initRouter() {
  window.addEventListener('hashchange', navigate);

  // Dil değişince aktif sayfa yeniden çizilir
  window.addEventListener('langchange', redraw);

  if (!window.location.hash) {
    window.location.hash = '#/';
  }

  draw(currentPath());
}
