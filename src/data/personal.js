/* ============================================
   KİŞİSEL VERİLER (TR & EN)
   İçerik: content/personal.json — yönetim paneli (/admin) düzenler.

   Not: Telefon numarası bilinçli olarak sitede gösterilmiyor.
   Herkese açık sayfada telefon yayınlamak spam çağırır; CV PDF'inde
   zaten var, isteyen oradan ulaşır.
   ============================================ */

import content from '../../content/personal.json';

export const profile = content.profile;

export const contact = {
  ...content.contact,
  // Adresi boş bırakılan hesap sitede hiç görünmez
  social: (content.contact.social ?? []).filter((s) => s.url),
};

export const cvFiles = {
  tr: content.cvFiles?.tr || null,
  en: content.cvFiles?.en || null,
};

export const education = content.education.map((e) => ({ ...e, end: e.end || null }));

export const {
  experience, involvement, leadership, coursework,
  languages, competencies,
} = content;

/** Yazılımlar: { name, level } — level boş olabilir (temel | orta | ileri). */
export const software = (content.software ?? [])
  .map((item) => (typeof item === 'string' ? { name: item, level: '' } : item))
  .filter((item) => item.name);
