/* ============================================
   PROJELER SAYFASI
   İki görünüm — konsept gereği tesadüf değil:
     Izgara  → Eames'in görsel envanteri (House of Cards)
     Katalog → Eldem'in Türk Evi plan tipolojisi
   ============================================ */

import { t, pick } from '../i18n.js';
import { projects, categories } from '../data/projects.js';
import { drawing } from '../components/Drawing.js';

// Sayfa durumu — dil değişse de korunur
const state = {
  view: 'grid',     // 'grid' | 'catalog'
  filter: 'all',
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
  if (!list.length) return '';

  return `
    <div class="frame frame--3">
      ${list.map((p, i) => `
        <article class="cell reveal" data-delay="${(i % 5) + 1}">
          <div class="cell__art">${drawing(p.art)}</div>
          <div>
            <h3 class="cell__title">${pick(p.title)}</h3>
            <div class="meta">${p.year} · ${categoryName(p.category)}</div>
          </div>
        </article>
      `).join('')}
    </div>
  `;
}

function catalogView(list) {
  if (!list.length) return '';

  return `
    <div class="catalog">
      ${list.map((p, i) => `
        <article class="catalog__row reveal">
          <span class="catalog__index">${String(i + 1).padStart(2, '0')}</span>
          <h3 class="catalog__name">${pick(p.title)}</h3>
          <span class="meta">${categoryName(p.category)}</span>
          <span class="meta">${p.year}</span>
        </article>
      `).join('')}
    </div>
  `;
}

export function renderProjects() {
  const list = visibleProjects();

  return `
    <section class="container">
      <header class="page-head">
        <span class="overline">${t('projects.title')}</span>
        <h1 class="page-head__title">${t('projects.title')}</h1>
        <p class="page-head__lead">${t('projects.lead')}</p>
      </header>

      <div class="section__head" style="margin-top:var(--space-2xl)">
        <div class="filters">
          ${categories.map((c) => `
            <button class="filter-btn ${state.filter === c.id ? 'is-active' : ''}"
                    data-filter="${c.id}">${pick(c.name)}</button>
          `).join('')}
        </div>

        <div class="view-switch">
          <button class="view-switch__btn ${state.view === 'grid' ? 'is-active' : ''}"
                  data-view="grid">${t('projects.viewGrid')}</button>
          <button class="view-switch__btn ${state.view === 'catalog' ? 'is-active' : ''}"
                  data-view="catalog">${t('projects.viewCatalog')}</button>
        </div>
      </div>

      <div id="projects-output">
        ${state.view === 'grid' ? gridView(list) : catalogView(list)}
      </div>
    </section>
  `;
}

/**
 * Filtre / görünüm tıklamasını işler.
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
    return true;
  }

  return false;
}
