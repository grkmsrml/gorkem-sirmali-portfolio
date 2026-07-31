/* ============================================
   FOTOĞRAF GALERİSİ

   Temalar, özgeçmişindeki "Exploring Urban Photography" atölyesinde
   yoğunlaştığın dört başlıktan alındı — uydurma değil, senin
   çalıştığın konular.

   FOTOĞRAF EKLEME
   1) Dosyaları public/images/photos/<tema-id>/ altına koy
   2) İlgili temanın items dizisine ekle:
      { src: '/images/photos/tangle/01.jpg',
        caption: { tr: 'Karaköy, 2026', en: 'Karaköy, 2026' },
        ratio: 'portrait' }   // 'square' | 'landscape' | 'portrait'

   items boşken tema kartı "yakında" durumunda görünür.
   ============================================ */

export const photoThemes = [
  {
    id: 'tangle',
    name: { tr: 'Kentsel Karmaşa', en: 'Urban Tangle' },
    description: {
      tr: 'Kablolar, tabelalar, tenteler — kentin üst üste binmiş katmanlarının okunamaz hale geldiği eşik.',
      en: 'Cables, signs, awnings — the threshold where the city\'s overlapping layers become illegible.',
    },
    items: [],
  },
  {
    id: 'stratification',
    name: { tr: 'Kentsel Katmanlaşma', en: 'Urban Stratification' },
    description: {
      tr: 'Farklı dönemlerin aynı yüzeyde üst üste durması; bir duvarın kesitinde okunan zaman.',
      en: 'Different periods standing one atop another on the same surface; time read in the section of a wall.',
    },
    items: [],
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
