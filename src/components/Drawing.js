/* ============================================
   ÇİZİM YER TUTUCULARI
   Gerçek proje görselleri eklenene kadar hücreleri dolduran
   pafta çizimleri. stroke="currentColor" olduğu için hücrenin
   ve temanın rengini kendiliğinden alırlar.
   ============================================ */

const drawings = {
  // Vaziyet / kat planı
  plan: `
    <rect x="14" y="18" width="60" height="46"/>
    <rect x="24" y="28" width="40" height="26"/>
    <rect x="86" y="18" width="60" height="84"/>
    <path d="M86 46h60M86 74h60M116 18v84"/>
    <path d="M14 78h60M14 90h60M14 102h60" stroke-dasharray="3 4"/>
  `,

  // Kesit — zemin çizgisi ve tarama
  section: `
    <path d="M8 96h144"/>
    <path d="M28 96V44l52-28 52 28v52"/>
    <path d="M28 62h104M28 78h104"/>
    <path d="M8 104l6-8M24 104l6-8M40 104l6-8M56 104l6-8M72 104l6-8M88 104l6-8M104 104l6-8M120 104l6-8M136 104l6-8"/>
  `,

  // Cephe — modüler ızgara, iki dolu panel
  facade: `
    <rect x="18" y="14" width="124" height="92"/>
    <path d="M18 37h124M18 60h124M18 83h124M49 14v92M80 14v92M111 14v92"/>
    <rect x="49" y="37" width="31" height="23" fill="currentColor" opacity=".25" stroke="none"/>
    <rect x="111" y="60" width="31" height="23" fill="currentColor" opacity=".25" stroke="none"/>
  `,
};

/**
 * Kart kapağı: proje görseli varsa onu, yoksa çizim yer tutucusunu verir.
 * Izgara kartlarında küçük (thumb), büyük yüzeylerde tam sürüm kullanılır.
 */
export function cover(project, { thumb = true } = {}) {
  const first = project.images?.[0];

  if (!first) {
    return `<div class="cell__art">${drawing(project.art)}</div>`;
  }

  const src = thumb ? (first.thumb ?? first.src) : first.src;

  return `
    <div class="cell__media ratio ratio--landscape">
      <img src="${src}" alt="${pickTitle(project)}" loading="lazy" />
    </div>
  `;
}

function pickTitle(project) {
  const title = project.title;
  if (title && typeof title === 'object') {
    return title[document.documentElement.lang] ?? title.tr ?? '';
  }
  return title ?? '';
}

/** Verilen anahtara ait SVG çizimini döndürür. */
export function drawing(key = 'plan') {
  const paths = drawings[key] ?? drawings.plan;

  return `
    <svg viewBox="0 0 160 120" fill="none" stroke="currentColor"
         stroke-width="1" vector-effect="non-scaling-stroke"
         role="presentation" aria-hidden="true">
      ${paths}
    </svg>
  `;
}
