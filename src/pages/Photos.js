/* ============================================
   FOTOĞRAFLAR
   Tema bazlı galeri. Temalar "Exploring Urban Photography"
   atölyesindeki dört başlıktan geliyor.
   ============================================ */

import { t, pick } from '../i18n.js';
import { photoThemes, photoCount } from '../data/photos.js';
import { drawing } from '../components/Drawing.js';

function themeSection(theme) {
  const hasPhotos = theme.items.length > 0;

  const body = hasPhotos
    ? `
      <div class="photo-grid">
        ${theme.items.map((item, i) => `
          <button class="photo-cell reveal"
                  data-photo-theme="${theme.id}"
                  data-photo-index="${i}"
                  aria-label="${pick(item.caption) ?? ''}">
            <span class="ratio ratio--${item.ratio ?? 'landscape'}">
              <img src="${item.src}" alt="${pick(item.caption) ?? ''}" loading="lazy" />
            </span>
          </button>
        `).join('')}
      </div>
    `
    : `
      <div class="photo-empty">
        <div class="photo-empty__art">${drawing('facade')}</div>
        <p class="meta">${t('photos.themeEmpty')}</p>
      </div>
    `;

  return `
    <section class="photo-theme">
      <div class="section__head">
        <div>
          <span class="overline">${pick(theme.name)}</span>
          <p class="photo-theme__desc">${pick(theme.description)}</p>
        </div>
        <span class="meta">${theme.items.length}</span>
      </div>
      ${body}
    </section>
  `;
}

export function renderPhotos() {
  const total = photoCount();

  return `
    <div class="container">
      <header class="page-head">
        <span class="overline">${t('nav.photos')}</span>
        <h1 class="page-head__title">${t('photos.title')}</h1>
        <p class="page-head__lead">${t('photos.lead')}</p>
      </header>

      ${total === 0 ? `<p class="cv__note meta photo-notice">${t('photos.empty')}</p>` : ''}

      ${photoThemes.map(themeSection).join('')}
    </div>
  `;
}
