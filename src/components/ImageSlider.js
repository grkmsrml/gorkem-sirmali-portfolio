/* ============================================
   GÖRSEL SLIDER

   Görsel yoksa çizim yer tutucusuna düşer — sayfa hiçbir zaman
   boş bir kutu göstermez. Görsel eklendiği an slider devreye girer.

   Durum DOM'da (data-index) tutuluyor; böylece sayfa yeniden
   çizildiğinde ayrı bir state deposunu senkronlamak gerekmiyor.
   ============================================ */

import { pick } from '../i18n.js';
import { drawing } from './Drawing.js';

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

  // --- Tek görsel: kontrol gerekmez ---
  if (images.length === 1) {
    return `
      <figure class="slider">
        <div class="ratio ratio--landscape">
          <img src="${images[0].src}" alt="${pick(images[0].caption) || pick(project.title)}" loading="lazy" />
        </div>
        ${images[0].caption ? `<figcaption class="meta slider__caption">${pick(images[0].caption)}</figcaption>` : ''}
      </figure>
    `;
  }

  // --- Çoklu görsel: slider ---
  const slides = images.map((img, i) => `
    <div class="slider__slide ${i === 0 ? 'is-active' : ''}" data-slide="${i}">
      <div class="ratio ratio--landscape">
        <img src="${img.src}"
             alt="${pick(img.caption) || `${pick(project.title)} — ${i + 1}`}"
             loading="${i === 0 ? 'eager' : 'lazy'}" />
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
          <button class="slider__btn" data-slider-prev aria-label="Önceki görsel">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <button class="slider__btn" data-slider-next aria-label="Sonraki görsel">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

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
