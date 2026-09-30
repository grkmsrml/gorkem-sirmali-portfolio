/* ============================================
   FOTOĞRAF GALERİSİ

   Temalar, özgeçmişindeki "Exploring Urban Photography" atölyesinde
   yoğunlaştığın dört başlıktan alındı — uydurma değil, senin
   çalıştığın konular.

   FOTOĞRAF EKLEME
   1) Dosyaları public/images/photos/<tema-id>/ altına .jpg/.png olarak koy
   2) npm run optimize:images çalıştır (üç webp boyutu + manifest üretir)
   3) İlgili temanın items dizisine ekle — width/height manifest'ten
      otomatik okunur, elle yazmana gerek yok:
      { ...photoImage('tangle', '01'),
        caption: { tr: 'Karaköy, 2026', en: 'Karaköy, 2026' },
        ratio: 'landscape' }   // 'square' | 'landscape' | 'portrait'

   items boşken tema kartı "yakında" durumunda görünür.
   ============================================ */

import imageSizes from './image-sizes.js';

/**
 * Bir fotoğrafın üç boyutunu ve manifest'ten okunan en/boy değerini üretir.
 *   thumb → ızgara kartı (700px)
 *   src   → normal görüntüleme (1600px)
 *   full  → lightbox'ta yakınlaştırma (2600px, yalnız gerektiğinde iner)
 */
function photoImage(themeId, n) {
  const src = `/images/photos/${themeId}/${n}.webp`;
  const size = imageSizes[src];

  return {
    src,
    thumb: `/images/photos/${themeId}/${n}-thumb.webp`,
    full: `/images/photos/${themeId}/${n}-full.webp`,
    width: size?.w ?? null,
    height: size?.h ?? null,
  };
}

export const photoThemes = [
  {
    id: 'tangle',
    name: { tr: 'Kentsel Karmaşa', en: 'Urban Tangle' },
    description: {
      tr: 'Kablolar, tabelalar, tenteler — kentin üst üste binmiş katmanlarının okunamaz hale geldiği eşik.',
      en: 'Cables, signs, awnings — the threshold where the city\'s overlapping layers become illegible.',
    },
    items: [
      {
        ...photoImage('tangle', '01'),
        caption: null,
        ratio: 'landscape',
      },
      {
        ...photoImage('tangle', '02'),
        caption: null,
        ratio: 'portrait',
      },
      {
        ...photoImage('tangle', '03'),
        caption: null,
        ratio: 'landscape',
      },
    ],
  },
  {
    id: 'stratification',
    name: { tr: 'Kentsel Katmanlaşma', en: 'Urban Stratification' },
    description: {
      tr: 'Farklı dönemlerin aynı yüzeyde üst üste durması; bir duvarın kesitinde okunan zaman.',
      en: 'Different periods standing one atop another on the same surface; time read in the section of a wall.',
    },
    items: [
      {
        ...photoImage('stratification', '01'),
        caption: null,
        ratio: 'landscape',
      },
      {
        ...photoImage('stratification', '02'),
        caption: null,
        ratio: 'portrait',
      },
    ],
  },
  {
    id: 'informal',
    name: { tr: 'Enformel Mimari', en: 'Informal Architecture' },
    description: {
      tr: 'Tasarlanmamış ama tutarlı olan yapılar. Kısıtın ürettiği ortak dil.',
      en: 'Structures undesigned yet consistent. The shared language produced by constraint.',
    },
    items: [],
  },
  {
    id: 'logistics',
    name: { tr: 'Lojistik Arka Yüz', en: 'The Logistical Backside' },
    description: {
      tr: 'Kentin görülmesi istenmeyen ama onu ayakta tutan yüzü: rampalar, servis girişleri, depolar.',
      en: 'The face the city would rather not show but which keeps it standing: ramps, service entrances, depots.',
    },
    items: [],
  },
];

/** Tüm fotoğrafları tek düz listede verir (lightbox gezinmesi için). */
export function allPhotos() {
  return photoThemes.flatMap((theme) =>
    theme.items.map((item) => ({ ...item, themeId: theme.id })));
}

export function photoCount() {
  return photoThemes.reduce((sum, theme) => sum + theme.items.length, 0);
}
