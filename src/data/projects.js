/* ============================================
   PROJE VERİLERİ (TR & EN)

   Gerçek görseller gelene kadar her projede `art` alanı var:
   components/Drawing.js içindeki çizim yer tutucularından birini
   seçer. Görsel eklendiğinde `image` alanı `art`'ın yerini alır.
   ============================================ */

export const categories = [
  { id: 'all',      name: { tr: 'Tümü',              en: 'All' } },
  { id: 'mimari',   name: { tr: 'Mimari Tasarım',    en: 'Architecture' } },
  { id: 'kent',     name: { tr: 'Kent / Peyzaj',     en: 'Urban / Landscape' } },
  { id: 'icmekan',  name: { tr: 'İç Mekan',          en: 'Interior' } },
  { id: 'konsept',  name: { tr: 'Konsept / Teorik',  en: 'Concept / Theory' } },
  { id: 'maket',    name: { tr: 'Maket',             en: 'Model' } },
  { id: 'render',   name: { tr: '3D Render',         en: '3D Render' } },
  { id: 'cizim',    name: { tr: 'Çizim / Eskiz',     en: 'Drawing / Sketch' } },
];

export const projects = [
  {
    id: 'zeyrek-kultur-merkezi',
    title: { tr: "Zeyrek'te Kültür Merkezi", en: 'Cultural Centre in Zeyrek' },
    category: 'mimari',
    year: 2025,
    location: { tr: 'İstanbul / Zeyrek', en: 'Istanbul / Zeyrek' },
    scale: '1/200',
    art: 'plan',
    featured: true,
    summary: {
      tr: 'Taşıyıcı ızgaranın cephede okunur bırakıldığı, dolgu panellerinin programa göre değiştiği bir çerçeve önerisi.',
      en: 'A frame proposal where the structural grid stays legible on the façade while infill panels shift with the programme.',
    },
  },
  {
    id: 'yamac-evi',
    title: { tr: 'Kesit Denemesi — Yamaç Evi', en: 'Section Study — Hillside House' },
    category: 'konsept',
    year: 2024,
    location: { tr: 'Bursa / Uludağ', en: 'Bursa / Uludağ' },
    scale: '1/100',
    art: 'section',
    featured: true,
    summary: {
      tr: 'Eğimli araziye oturan tek aileli konutun kesit üzerinden kurgulanması; saçak ve gölge çalışması.',
      en: 'A single-family house on a slope, developed through section; a study of eaves and shadow.',
    },
  },
  {
    id: 'moduler-cephe',
    title: { tr: 'Modüler Cephe Etüdü', en: 'Modular Façade Study' },
    category: 'cizim',
    year: 2025,
    location: { tr: 'İstanbul', en: 'Istanbul' },
    scale: '1/50',
    art: 'facade',
    featured: true,
    summary: {
      tr: '90 cm modül üzerine kurulu cephe sisteminde dolgu panelinin varyasyonları.',
      en: 'Variations of the infill panel in a façade system built on a 90 cm module.',
    },
  },
  {
    id: 'kiyi-duzenlemesi',
    title: { tr: 'Kıyı Bandı Düzenlemesi', en: 'Waterfront Regeneration' },
    category: 'kent',
    year: 2024,
    location: { tr: 'İzmir / Karşıyaka', en: 'Izmir / Karşıyaka' },
    scale: '1/500',
    art: 'plan',
    featured: false,
    summary: {
      tr: 'Kıyı hattında yaya önceliğini kuran, kamusal boşlukları diziye bağlayan bir kent tasarımı çalışması.',
      en: 'An urban design study establishing pedestrian priority along the shore and linking public voids in sequence.',
    },
  },
];

/** Ana sayfada gösterilecek seçili işler. */
export function featuredProjects() {
  return projects.filter((p) => p.featured);
}
