/* ============================================
   LIGHTBOX — YAKINLAŞTIRMALI GÖRSEL İNCELEME

   Mimari çizimde detay okunabilmeli: plan çizgisi, kot, ölçü yazısı.
   O yüzden sığdırılmış görüntü yeterli değil.

   Etkileşim
     tekerlek / pinch  → imlecin bulunduğu noktadan yakınlaş
     çift tık          → yakınlaş / sığdır arası geçiş
     sürükle           → yakınken kaydır
     + − 0             → klavyeyle yakınlaş, uzaklaş, sığdır
     ← →               → görsel değiştir (yakınlaştırma sıfırlanır)
     Esc               → kapat

   Yüksek çözünürlüklü (-full) sürüm yalnız ilk yakınlaştırmada
   indirilir; normal gezinmede ağırlığı yoktur.
   ============================================ */

import { pick, t } from '../i18n.js';

const MIN_SCALE = 1;
const MAX_SCALE = 8;
const STEP = 1.35;

let photos = [];
let index = 0;
let lastFocused = null;

// Görüntü durumu
let scale = 1;
let panX = 0;
let panY = 0;

// Sürükleme durumu
let dragging = false;
let dragStartX = 0;
let dragStartY = 0;
let dragOriginX = 0;
let dragOriginY = 0;

// Pinch durumu
let pinchStart = 0;
let pinchScale = 1;

function el() {
  return document.getElementById('lightbox');
}

function img() {
  return el()?.querySelector('.lightbox__img');
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
    <button class="lightbox__close" data-lb-close aria-label="${t('lightbox.close')}">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M18 6L6 18M6 6l12 12"/>
      </svg>
    </button>

    <button class="lightbox__nav lightbox__nav--prev" data-lb-prev aria-label="${t('lightbox.prev')}">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
    </button>

    <figure class="lightbox__figure">
      <div class="lightbox__stage" data-lb-stage>
        <img class="lightbox__img" alt="" draggable="false" />
      </div>
      <figcaption class="lightbox__caption meta"></figcaption>
    </figure>

    <button class="lightbox__nav lightbox__nav--next" data-lb-next aria-label="${t('lightbox.next')}">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </button>

    <div class="lightbox__zoom">
      <button class="lightbox__zoom-btn" data-lb-zoom-out aria-label="${t('lightbox.zoomOut')}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
          <circle cx="11" cy="11" r="7"/><path d="M8 11h6M20 20l-4.35-4.35"/>
        </svg>
      </button>
      <button class="lightbox__zoom-level" data-lb-zoom-reset aria-label="${t('lightbox.reset')}">100%</button>
      <button class="lightbox__zoom-btn" data-lb-zoom-in aria-label="${t('lightbox.zoomIn')}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
          <circle cx="11" cy="11" r="7"/><path d="M11 8v6M8 11h6M20 20l-4.35-4.35"/>
        </svg>
      </button>
    </div>

    <p class="lightbox__hint meta">${t('lightbox.hint')}</p>
  `;

  bindGestures(node);
  document.body.appendChild(node);
  return node;
}

/* ============================================
   GÖRÜNTÜ DURUMU
   ============================================ */

function clampPan() {
  const stage = el()?.querySelector('[data-lb-stage]');
  const image = img();
  if (!stage || !image) return;

  // Ölçeklenmiş görselin taşan yarısı kadar kaydırmaya izin ver
  const maxX = Math.max(0, (image.clientWidth * scale - stage.clientWidth) / 2);
  const maxY = Math.max(0, (image.clientHeight * scale - stage.clientHeight) / 2);

  panX = Math.min(maxX, Math.max(-maxX, panX));
  panY = Math.min(maxY, Math.max(-maxY, panY));
}

function applyTransform() {
  const image = img();
  const node = el();
  if (!image || !node) return;

  clampPan();
  image.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;

  node.classList.toggle('is-zoomed', scale > 1.001);

  const level = node.querySelector('[data-lb-zoom-reset]');
  if (level) level.textContent = `${Math.round(scale * 100)}%`;
}

/** Yüksek çözünürlüklü sürümü ilk yakınlaştırmada indirir. */
function upgradeSource() {
  const image = img();
  const photo = photos[index];
  if (!image || !photo?.full || image.dataset.full === '1') return;

  image.dataset.full = '1';

  const hi = new Image();
  hi.onload = () => {
    // Kullanıcı bu arada başka görsele geçmiş olabilir
    if (photos[index]?.full === photo.full) image.src = photo.full;
  };
  hi.src = photo.full;
}

function setScale(next, originX, originY) {
  const previous = scale;
  scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, next));

  if (scale > 1.001) upgradeSource();

  if (originX !== undefined && previous !== 0) {
    // İmlecin altındaki nokta sabit kalsın
    const ratio = scale / previous;
    panX = originX - (originX - panX) * ratio;
    panY = originY - (originY - panY) * ratio;
  }

  if (scale <= 1.001) {
    panX = 0;
    panY = 0;
  }

  applyTransform();
}

export function zoomBy(factor) {
  setScale(scale * factor);
}

export function resetZoom() {
  scale = 1;
  panX = 0;
  panY = 0;
  applyTransform();
}

/* ============================================
   HAREKETLER
   ============================================ */

function bindGestures(node) {
  const stage = node.querySelector('[data-lb-stage]');

  // Tekerlek — imlecin bulunduğu noktadan yakınlaş
  stage.addEventListener('wheel', (e) => {
    e.preventDefault();
    const rect = stage.getBoundingClientRect();
    const ox = e.clientX - rect.left - rect.width / 2;
    const oy = e.clientY - rect.top - rect.height / 2;
    setScale(scale * (e.deltaY < 0 ? STEP : 1 / STEP), ox, oy);
  }, { passive: false });

  // Çift tık — yakınlaş / sığdır
  stage.addEventListener('dblclick', (e) => {
    const rect = stage.getBoundingClientRect();
    const ox = e.clientX - rect.left - rect.width / 2;
    const oy = e.clientY - rect.top - rect.height / 2;
    if (scale > 1.001) resetZoom();
    else setScale(2.5, ox, oy);
  });

  // Sürükleme
  stage.addEventListener('pointerdown', (e) => {
    if (scale <= 1.001) return;
    dragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    dragOriginX = panX;
    dragOriginY = panY;
    stage.setPointerCapture(e.pointerId);
  });

  stage.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    panX = dragOriginX + (e.clientX - dragStartX);
    panY = dragOriginY + (e.clientY - dragStartY);
    applyTransform();
  });

  const endDrag = () => { dragging = false; };
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);

  // Pinch (iki parmak)
  const distance = (touches) => Math.hypot(
    touches[0].clientX - touches[1].clientX,
    touches[0].clientY - touches[1].clientY,
  );

  stage.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 2) return;
    pinchStart = distance(e.touches);
    pinchScale = scale;
  }, { passive: true });

  stage.addEventListener('touchmove', (e) => {
    if (e.touches.length !== 2 || !pinchStart) return;
    e.preventDefault();
    setScale(pinchScale * (distance(e.touches) / pinchStart));
  }, { passive: false });

  stage.addEventListener('touchend', () => { pinchStart = 0; });
}

/* ============================================
   ÇİZİM
   ============================================ */

function paint() {
  const node = el();
  const photo = photos[index];
  if (!node || !photo) return;

  const image = node.querySelector('.lightbox__img');
  const caption = node.querySelector('.lightbox__caption');

  image.dataset.full = '';           // yeni görsel: full henüz inmedi
  image.src = photo.src;
  image.alt = pick(photo.caption) ?? '';

  if (photo.width && photo.height) {
    image.width = photo.width;
    image.height = photo.height;
  }

  const text = pick(photo.caption);
  caption.textContent = photos.length > 1
    ? `${String(index + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}${text ? `  ·  ${text}` : ''}`
    : (text ?? '');

  const multiple = photos.length > 1;
  node.querySelectorAll('.lightbox__nav').forEach((btn) => { btn.hidden = !multiple; });

  resetZoom();
}

/* ============================================
   AÇ / KAPAT / GEZİN
   ============================================ */

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
  resetZoom();
  lastFocused?.focus?.();
  lastFocused = null;
}

export function moveLightbox(direction) {
  if (photos.length < 2) return;
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

    switch (e.key) {
      case 'Escape':     closeLightbox(); break;
      case 'ArrowLeft':  moveLightbox(-1); break;
      case 'ArrowRight': moveLightbox(1); break;
      case '+':
      case '=':          e.preventDefault(); zoomBy(STEP); break;
      case '-':
      case '_':          e.preventDefault(); zoomBy(1 / STEP); break;
      case '0':          e.preventDefault(); resetZoom(); break;
      default: break;
    }
  });
}
