/* ============================================
   PROJELER SAYFASI
   İki görünüm — konsept gereği tesadüf değil:
     Izgara  → Eames'in görsel envanteri (House of Cards)
     Katalog → Eldem'in Türk Evi plan tipolojisi

   Davranışları da bilerek farklı:
     Izgara kartı  → detay sayfasına gider (gezinme)
     Katalog satırı → yerinde açılır (başvuru kaynağı, sözlük maddesi)
   ============================================ */

import { t, pick } from '../i18n.js';
import { projects, categories } from '../data/projects.js';
import { drawing, cover } from '../components/Drawing.js';

// Sayfa durumu — dil değişse de korunur
const state = {
  view: 'grid',      // 'grid' | 'catalog'
  filter: 'all',
  expanded: null,    // açık katalog satırının id'si
};

function visibleProjects() {
  return state.filter === 'all'
    ? projects
    : projects.filter((p) => p.category === state.filter);
}

function categoryName(id) {
  const found = categories.find((c) => c.id === id);
  return found ? pick(found.name) : id;
}

function gridView(list) {
  return `
    <div class="frame frame--3">
      ${list.map((p, i) => `
        <a href="#/projeler/${p.id}" class="cell reveal" data-delay="${(i % 5) + 1}">
          ${cover(p)}
          <div>
            <h3 class="cell__title">${pick(p.title)}</h3>
            <div class="meta">${p.year} · ${categoryName(p.category)}${p.ongoing ? ` · ${t('detail.ongoing')}` : ''}</div>
          </div>
        </a>
      `).join('')}
    </div>
  `;
}

function catalogView(list) {
  return `
    <div class="catalog">
      ${list.map((p, i) => {
        const open = state.expanded === p.id;

        return `
          <div class="catalog__entry ${open ? 'is-open' : ''}">
            <button class="catalog__row" data-entry="${p.id}" aria-expanded="${open}">
              <span class="catalog__index">${String(i + 1).padStart(2, '0')}</span>
              <span class="catalog__name">${pick(p.title)}</span>
              <span class="meta catalog__cat">${categoryName(p.category)}</span>
              <span class="meta catalog__year">${p.year}</span>
            </button>

            ${open ? `
              <div class="catalog__detail">
                <div class="catalog__detail-art">
                  ${p.images?.length
                    ? `<img src="${p.images[0].thumb ?? p.images[0].src}" alt="${pick(p.title)}" loading="lazy" />`
                    : drawing(p.art)}
                </div>
                <div class="catalog__detail-text">
                  <p>${pick(p.summary)}</p>
                  <div class="meta meta-row catalog__detail-meta">
                    <span>${pick(p.location)}</span>
                    <span>${pick(p.course)}</span>
                  </div>
                  <a href="#/projeler/${p.id}" class="btn">${t('detail.openFull')}</a>
                </div>
              </div>
            ` : ''}
          </div>
        `;
      }).join('')}
    </div>
  `;
}

export function renderProjects() {
  const list = visibleProjects();

  const output = list.length
    ? (state.view === 'grid' ? gridView(list) : catalogView(list))
    : `<p class="placeholder__note">${t('projects.empty')}</p>`;

  return `
    <section class="container">
      <header class="page-head">
        <span class="overline">${t('nav.projects')}</span>
        <h1 class="page-head__title">${t('projects.title')}</h1>
        <p class="page-head__lead">${t('projects.lead')}</p>
      </header>

      <div class="section__head projects__controls">
        <div class="filters">
          ${categories.map((c) => `
            <button class="filter-btn ${state.filter === c.id ? 'is-active' : ''}"
                    data-filter="${c.id}">${pick(c.name)}</button>
          `).join('')}
        </div>

        <div class="projects__right">
          <span class="meta">${list.length} ${t('projects.count')}</span>
          <div class="view-switch">
            <button class="view-switch__btn ${state.view === 'grid' ? 'is-active' : ''}"
                    data-view="grid">${t('projects.viewGrid')}</button>
            <button class="view-switch__btn ${state.view === 'catalog' ? 'is-active' : ''}"
                    data-view="catalog">${t('projects.viewCatalog')}</button>
          </div>
        </div>
      </div>

      ${output}
    </section>
  `;
}

/**
 * Filtre / görünüm / katalog tıklamalarını işler.
 * main.js'te #app üzerine kurulan TEK delegasyondan çağrılır —
 * her çizimde yeni dinleyici eklenmesin diye.
 * @returns {boolean} durum değiştiyse true (yeniden çizim gerekir)
 */
export function handleProjectsClick(e) {
  const viewBtn = e.target.closest('[data-view]');
  if (viewBtn && state.view !== viewBtn.dataset.view) {
    state.view = viewBtn.dataset.view;
    return true;
  }

  const filterBtn = e.target.closest('[data-filter]');
  if (filterBtn && state.filter !== filterBtn.dataset.filter) {
    state.filter = filterBtn.dataset.filter;
    state.expanded = null;   // filtre değişince açık madde kapanır
    return true;
  }

  // Katalog satırı — akordeon: aynı satıra tekrar basınca kapanır
  const entryBtn = e.target.closest('[data-entry]');
  if (entryBtn) {
    const id = entryBtn.dataset.entry;
    state.expanded = state.expanded === id ? null : id;
    return true;
  }

  return false;
}
