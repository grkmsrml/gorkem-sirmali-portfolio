/* ============================================
   KATEGORİLER
   Ayrı dosyada: hem site hem yönetim paneli kullanır ve panelin
   içerik dosyalarını (content/) içe aktarması gerekmez.
   Yeni kategori eklemek için buraya bir satır yaz; boş kategoriler
   sitede kendiliğinden gizlenir.
   ============================================ */

export const categories = [
  { id: 'all',       name: { tr: 'Tümü',              en: 'All' } },
  { id: 'mimari',    name: { tr: 'Mimari Tasarım',    en: 'Architectural Design' } },
  { id: 'koruma',    name: { tr: 'Koruma / Rölöve',   en: 'Conservation / Survey' } },
  { id: 'icmekan',   name: { tr: 'İç Mekan',          en: 'Interior' } },
  { id: 'kent',      name: { tr: 'Kent / Peyzaj',     en: 'Urban / Landscape' } },
  { id: 'uygulama',  name: { tr: 'Uygulama Projesi',  en: 'Construction Project' } },
];

export const blogCategories = [
  { id: 'all',     name: { tr: 'Tümü',      en: 'All' } },
  { id: 'kuram',   name: { tr: 'Kuram',     en: 'Theory' } },
  { id: 'kurgu',   name: { tr: 'Bilim-Kurgu', en: 'Science Fiction' } },
  { id: 'atolye',  name: { tr: 'Atölye',    en: 'Workshop' } },
  { id: 'not',     name: { tr: 'Not',       en: 'Notes' } },
  { id: 'gezi',    name: { tr: 'Gezi',      en: 'Travel' } },
];
