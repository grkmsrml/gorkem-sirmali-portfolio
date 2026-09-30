/* ============================================
   FOTOĞRAFLAR
   Tüm temalardaki görseller tek düz ızgarada — alt başlık yok,
   yalnız sayfa başlığı. Tema bilgisi veride duruyor (allPhotos
   themeId taşıyor), yalnızca ayrı bölüm/başlık olarak gösterilmiyor.
   ============================================ */

import { t, pick } from '../i18n.js';
import { allPhotos } from '../data/photos.js';

export function renderPhotos() {
  const photos = allPhotos();

  const body = photos.length
    ? `
      <div class="photo-grid">
        ${photos.map((item, i) => {
          const dims = item.width && item.height
            ? ` width="${item.width}" height="${item.height}"`
            : '';
          return `
            <button class="photo-cell reveal reveal--unveil"
                    data-photo-index="${i}"
                    aria-label="${pick(item.caption) ?? ''}">
              <span class="ratio ratio--${item.ratio ?? 'landscape'}">
                <img src="${item.thumb ?? item.src}" alt="${pick(item.caption) ?? ''}" loading="lazy"${dims} />
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
