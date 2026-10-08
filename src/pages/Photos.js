/* ============================================
   FOTOĞRAFLAR
   Tek düz ızgara; üstte kategori süzgeci. Süzgeç yalnız birden çok
   seçenek varsa görünür (tek kategoride anlamı yok).
   ============================================ */

import { t, pick } from '../i18n.js';
import { allPhotos, usedPhotoCategories } from '../data/photos.js';

// Sayfa durumu — dil değişse de korunur
const state = { filter: 'all' };

/** Süzgece göre görünen fotoğraflar; lightbox da bu listede gezinir. */
export function visiblePhotos() {
  const photos = allPhotos();
  return state.filter === 'all' ? photos : photos.filter((p) => p.category === state.filter);
}

function filterBar(count) {
  const categories = usedPhotoCategories();
  // Kategorisiz fotoğraf varsa "Tümü" tek başına da ayrı bir seçenektir
  const uncategorised = allPhotos().some((p) => !p.category);
  if (categories.length < 2 && !(categories.length === 1 && uncategorised)) return '';

  const button = (id, label) => `
    <button class="filter-btn ${state.filter === id ? 'is-active' : ''}"
            data-photo-filter="${id}">${label}</button>`;

  return `
    <div class="section__head projects__controls">
      <div class="filters">
        ${button('all', t('photos.all'))}
        ${categories.map((c) => button(c.id, pick(c.name))).join('')}
      </div>
      <span class="meta">${count} ${t('photos.count')}</span>
    </div>
  `;
}

export function renderPhotos() {
  // Seçili kategori içerikten kalktıysa "Tümü"ne dön
  if (state.filter !== 'all' && !usedPhotoCategories().some((c) => c.id === state.filter)) {
    state.filter = 'all';
  }

  const photos = visiblePhotos();

  const body = allPhotos().length
    ? `
      ${filterBar(photos.length)}
      <div class="photo-grid">
        ${photos.map((item, i) => {
          const dims = item.width && item.height
            ? ` width="${item.width}" height="${item.height}"`
            : '';
          // Başlıksız fotoğrafta da düğmenin bir adı olsun
          const label = pick(item.caption) || `${t('photos.item')} ${i + 1}`;
          return `
            <button class="photo-cell reveal reveal--unveil"
                    data-photo-index="${i}"
                    aria-label="${label}">
              <span class="ratio ratio--${item.ratio ?? 'landscape'}">
                <img src="${item.thumb ?? item.src}" alt="${label}" loading="lazy"${dims} />
              </span>
            </button>
          `;
        }).join('')}
      </div>
    `
    : `<p class="cv__note meta photo-notice">${t('photos.empty')}</p>`;

  return `
    <div class="container">
      <header class="page-head">
        <span class="overline">${t('nav.photos')}</span>
        <h1 class="page-head__title">${t('photos.title')}</h1>
        <p class="page-head__lead">${t('photos.lead')}</p>
      </header>

      ${body}
    </div>
  `;
}

/** Kategori süzgeci — main.js delegasyonundan çağrılır. */
export function handlePhotosClick(e) {
  const btn = e.target.closest('[data-photo-filter]');
  if (btn && state.filter !== btn.dataset.photoFilter) {
    state.filter = btn.dataset.photoFilter;
    return true;
  }
  return false;
}
