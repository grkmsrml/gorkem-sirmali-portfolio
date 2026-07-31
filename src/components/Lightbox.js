/* ============================================
   LIGHTBOX
   Klavye: ← → gezinme, Esc kapatma.
   Açılmadan önceki odak saklanır ve kapanınca geri verilir.
   ============================================ */

import { pick } from '../i18n.js';

let photos = [];
let index = 0;
let lastFocused = null;

function el() {
  return document.getElementById('lightbox');
}

function ensureElement() {
  let node = el();
  if (node) return node;

  node = document.createElement('div');
  node.id = 'lightbox';
  node.className = 'lightbox';
  node.setAttribute('role', 'dialog');
  node.setAttribute('aria-modal', 'true');
  node.hidden = true;

  node.innerHTML = `
    <button class="lightbox__close" data-lb-close aria-label="Kapat">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M18 6L6 18M6 6l12 12"/>
      </svg>
    </button>

    <button class="lightbox__nav lightbox__nav--prev" data-lb-prev aria-label="Önceki">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
    </button>

    <figure class="lightbox__figure">
      <img class="lightbox__img" alt="" />
      <figcaption class="lightbox__caption meta"></figcaption>
    </figure>

    <button class="lightbox__nav lightbox__nav--next" data-lb-next aria-label="Sonraki">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </button>
  `;

  document.body.appendChild(node);
  return node;
}

function paint() {
  const node = el();
  const photo = photos[index];
  if (!node || !photo) return;

  const img = node.querySelector('.lightbox__img');
  const caption = node.querySelector('.lightbox__caption');

  img.src = photo.src;
  img.alt = pick(photo.caption) ?? '';
  caption.textContent = `${String(index + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}  ·  ${pick(photo.caption) ?? ''}`;

  // Tek fotoğraf varsa gezinme okları gereksiz
  const multiple = photos.length > 1;
  node.querySelectorAll('.lightbox__nav').forEach((btn) => { btn.hidden = !multiple; });
}

export function openLightbox(list, startIndex = 0) {
  if (!list?.length) return;

  photos = list;
  index = Math.max(0, Math.min(startIndex, list.length - 1));
  lastFocused = document.activeElement;

  const node = ensureElement();
  node.hidden = false;
  document.body.style.overflow = 'hidden';
  paint();

  node.querySelector('[data-lb-close]')?.focus();
}

export function closeLightbox() {
  const node = el();
  if (!node || node.hidden) return;

  node.hidden = true;
  document.body.style.overflow = '';
  lastFocused?.focus?.();
  lastFocused = null;
}

export function moveLightbox(direction) {
  if (!photos.length) return;
  index = (index + direction + photos.length) % photos.length;
  paint();
}

export function isLightboxOpen() {
  const node = el();
  return Boolean(node && !node.hidden);
}

/** Klavye kısayolları — main.js bir kez bağlar. */
export function initLightboxKeys() {
  document.addEventListener('keydown', (e) => {
    if (!isLightboxOpen()) return;

    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') moveLightbox(-1);
    else if (e.key === 'ArrowRight') moveLightbox(1);
  });
}
