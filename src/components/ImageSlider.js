/* ============================================
   GÖRSEL SLIDER

   Görsel yoksa çizim yer tutucusuna düşer — sayfa hiçbir zaman
   boş bir kutu göstermez. Görsel eklendiği an slider devreye girer.

   Durum DOM'da (data-index) tutuluyor; böylece sayfa yeniden
   çizildiğinde ayrı bir state deposunu senkronlamak gerekmiyor.
   ============================================ */

import { pick, t } from '../i18n.js';
import { drawing } from './Drawing.js';

/**
 * Tek bir slayt görseli.
 * Çizimler kırpılmaz: doğal oranında, çerçeveye sığacak şekilde
 * gösterilir. width/height verilir ki yüklenirken düzen kaymasın.
 */
function slideImage(img, project, i, eager) {
  const dims = img.width && img.height
    ? ` width="${img.width}" height="${img.height}"`
    : '';

  // Düğme sarmalayıcı: tıklanınca lightbox açılır, çizim
  // yakınlaştırılarak incelenebilir. Klavyeyle de erişilebilir.
  return `
    <button class="slider__zoom-trigger" data-zoom-index="${i}"
            aria-label="${t('lightbox.open')}">
      <img class="slider__img"
           src="${img.src}"
           alt="${pick(img.caption) || `${pick(project.title)} — ${i + 1}`}"
           loading="${eager ? 'eager' : 'lazy'}"${dims} />
      <span class="slider__zoom-badge" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
          <circle cx="11" cy="11" r="7"/><path d="M11 8v6M8 11h6M20 20l-4.35-4.35"/>
        </svg>
      </span>
    </button>
  `;
}

export function renderSlider(project) {
  const images = project.images ?? [];

  // --- Görsel yok: büyük çizim yer tutucusu ---
  if (!images.length) {
    return `
      <figure class="slider slider--empty ratio ratio--landscape">
        <div class="slider__art">${drawing(project.art)}</div>
      </figure>
    `;
  }

  // İnceleme düğmesi — hover rozetinin aksine her zaman görünür.
  // data-zoom-open: hangi görselin açılacağını slider'ın kendi
  // data-index'inden okur, tek görselde 0'a düşer.
  const zoomButton = `
    <button class="slider__inspect" data-zoom-open>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
        <circle cx="11" cy="11" r="7"/><path d="M11 8v6M8 11h6M20 20l-4.35-4.35"/>
      </svg>
      <span>${t('lightbox.inspect')}</span>
    </button>
  `;

  // --- Tek görsel: gezinme kontrolü gerekmez, inceleme düğmesi kalır ---
  if (images.length === 1) {
    return `
      <figure class="slider">
        <div class="slider__frame">
          ${slideImage(images[0], project, 0, true)}
        </div>
        <div class="slider__bar">
          ${zoomButton}
          <figcaption class="slider__caption meta">
            ${pick(images[0].caption) ?? ''}
          </figcaption>
        </div>
      </figure>
    `;
  }

  // --- Çoklu görsel: slider ---
  const slides = images.map((img, i) => `
    <div class="slider__slide ${i === 0 ? 'is-active' : ''}" data-slide="${i}">
      <div class="slider__frame">
        ${slideImage(img, project, i, i === 0)}
      </div>
    </div>
  `).join('');

  const captions = images.map((img, i) => `
    <span class="slider__caption-item ${i === 0 ? 'is-active' : ''}" data-caption="${i}">
      ${pick(img.caption) ?? ''}
    </span>
  `).join('');

  return `
    <figure class="slider" data-slider data-index="0" data-total="${images.length}">
      <div class="slider__track">${slides}</div>

      <div class="slider__bar">
        <div class="slider__controls">
          <button class="slider__btn" data-slider-prev aria-label="${t('lightbox.prev')}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <button class="slider__btn" data-slider-next aria-label="${t('lightbox.next')}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        ${zoomButton}

        <figcaption class="slider__caption meta">${captions}</figcaption>

        <span class="slider__counter meta">
          <b data-slider-current>01</b> / ${String(images.length).padStart(2, '0')}
        </span>
      </div>
    </figure>
  `;
}

/** Slider'ı verilen yöne kaydırır. main.js delegasyonundan çağrılır. */
export function moveSlider(sliderEl, direction) {
  const total = Number(sliderEl.dataset.total);
  const current = Number(sliderEl.dataset.index);
  const next = (current + direction + total) % total;

  sliderEl.dataset.index = String(next);

  sliderEl.querySelectorAll('[data-slide]').forEach((slide) => {
    slide.classList.toggle('is-active', Number(slide.dataset.slide) === next);
  });

  sliderEl.querySelectorAll('[data-caption]').forEach((cap) => {
    cap.classList.toggle('is-active', Number(cap.dataset.caption) === next);
  });

  const counter = sliderEl.querySelector('[data-slider-current]');
  if (counter) counter.textContent = String(next + 1).padStart(2, '0');
}
