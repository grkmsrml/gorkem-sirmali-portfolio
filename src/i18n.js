/* ============================================
   i18n — ÇİFT DİL (TR / EN)
   Tercih localStorage'da saklanır, URL'de dil belirteci yok.
   Metinler data/ klasöründe iki dilde tutulur; buradaki sözlük
   yalnız arayüz metinleri içindir.
   ============================================ */

const DEFAULT_LANG = 'tr';
const STORAGE_KEY = 'lang';

export const translations = {
  tr: {
    'brand': 'GÖRKEM SIRMALI',

    'nav.home': 'Ana Sayfa',
    'nav.projects': 'Projeler',
    'nav.about': 'Hakkımda',
    'nav.cv': 'CV',
    'nav.blog': 'Blog',
    'nav.photos': 'Fotoğraflar',
    'nav.contact': 'İletişim',

    'hero.overline': 'Mimarlık Portfolyosu',
    'hero.lead': 'Mimar Sinan Güzel Sanatlar Üniversitesi Mimarlık Bölümü son sınıf öğrencisiyim. Mimari tasarım, kent tasarımı ve iç mekan üzerine çalışıyorum.',
    'hero.scroll': 'Aşağı kaydır',
    'hero.location': 'İstanbul / Türkiye',
    'hero.projectCount': 'proje',

    'home.selected': 'Seçili İşler',
    'home.selectedLead': 'Son dönemde üzerinde çalıştığım projelerden bir seçki.',
    'home.viewAll': 'Tüm projeleri gör',
    'home.gridCatalog': 'Izgara / Katalog',
    'home.about': 'Hakkımda',
    'home.contactCta': 'Birlikte çalışalım',
    'home.contactLead': 'Staj, proje veya işbirliği için yazabilirsin.',
    'home.contactBtn': 'İletişime geç',

    'projects.title': 'Projeler',
    'projects.lead': 'Mimari tasarım, kent tasarımı, iç mekan, konsept ve çizim çalışmaları.',
    'projects.viewGrid': 'Izgara',
    'projects.viewCatalog': 'Katalog',
    'projects.empty': 'Bu kategoride henüz proje yok.',
    'projects.count': 'proje',

    'detail.year': 'Yıl',
    'detail.category': 'Kategori',
    'detail.location': 'Konum',
    'detail.scale': 'Ölçek',
    'detail.course': 'Ders',
    'detail.prev': 'Önceki',
    'detail.next': 'Sonraki',
    'detail.backToProjects': 'Projelere dön',
    'detail.openFull': 'Projeyi aç',

    'about.title': 'Hakkımda',
    'about.lead': 'İnşaat mühendisliğinden mimarlığa geçen, teknik rasyonaliteyi tasarım vizyonuyla birleştirmeye çalışan bir mimarlık öğrencisi.',
    'about.education': 'Eğitim',
    'about.experience': 'Deneyim',
    'about.involvement': 'Projeler, Araştırmalar, Gönüllü Çalışmalar',
    'about.leadership': 'Liderlik',
    'about.software': 'Yazılım',
    'about.languages': 'Diller',
    'about.competencies': 'Yetkinlikler',
    'about.present': 'Devam ediyor',

    'cv.title': 'CV',
    'cv.lead': 'Özgeçmişimin tam sürümünü indirebilir veya aşağıdan inceleyebilirsin.',
    'cv.download': 'PDF indir',
    'cv.downloadTr': 'Türkçe PDF indir',
    'cv.downloadEn': 'İngilizce PDF indir',
    'cv.enSoon': 'İngilizce sürüm hazırlanıyor.',
    'cv.preview': 'Önizleme',
    'cv.noPreview': 'Tarayıcın PDF önizlemeyi desteklemiyor.',
    'cv.openTab': 'Yeni sekmede aç',
    'cv.seeAbout': 'Detaylı geçmiş için Hakkımda sayfasına bak.',
    'cv.print': 'Yazdır / PDF olarak kaydet',
    'cv.pdfLabel': 'Türkçe PDF — önizleme',
    'cv.contact': 'İletişim',
    'cv.summary': 'Özet',
    'cv.langHint': 'Bu sayfa aktif dile göre çizilir; dili değiştirerek özgeçmişi İngilizce okuyabilirsin.',
    'blog.title': 'Blog',
    'photos.title': 'Fotoğraflar',
    'contact.title': 'İletişim',

    'page.soon': 'Bu bölüm henüz kurulmadı.',
    'page.soonNote': 'Faz 1 tamamlandı: tasarım sistemi, ızgara, router, çift dil ve tema altyapısı çalışıyor. Bu sayfa sıradaki fazda içerikle birlikte gelecek.',
    'page.notFound': 'Sayfa bulunamadı',
    'page.backHome': 'Ana sayfaya dön',

    'footer.tagline': 'Mimarlık & Tasarım',
    'footer.follow': 'Takip et',
    'footer.location': 'İstanbul / Türkiye',
  },

  en: {
    'brand': 'GÖRKEM SIRMALI',

    'nav.home': 'Home',
    'nav.projects': 'Projects',
    'nav.about': 'About',
    'nav.cv': 'CV',
    'nav.blog': 'Journal',
    'nav.photos': 'Photographs',
    'nav.contact': 'Contact',

    'hero.overline': 'Architecture Portfolio',
    'hero.lead': 'Final-year architecture student at Mimar Sinan Fine Arts University. I work on architectural design, urban design and interiors.',
    'hero.scroll': 'Scroll',
    'hero.location': 'Istanbul / Türkiye',
    'hero.projectCount': 'projects',

    'home.selected': 'Selected Work',
    'home.selectedLead': 'A selection of projects I have been working on recently.',
    'home.viewAll': 'View all projects',
    'home.gridCatalog': 'Grid / Catalogue',
    'home.about': 'About',
    'home.contactCta': "Let's work together",
    'home.contactLead': 'Get in touch for internships, projects or collaboration.',
    'home.contactBtn': 'Get in touch',

    'projects.title': 'Projects',
    'projects.lead': 'Architectural design, urban design, interiors, concept and drawing studies.',
    'projects.viewGrid': 'Grid',
    'projects.viewCatalog': 'Catalogue',
    'projects.empty': 'No projects in this category yet.',
    'projects.count': 'projects',

    'detail.year': 'Year',
    'detail.category': 'Category',
    'detail.location': 'Location',
    'detail.scale': 'Scale',
    'detail.course': 'Course',
    'detail.prev': 'Previous',
    'detail.next': 'Next',
    'detail.backToProjects': 'Back to projects',
    'detail.openFull': 'Open project',

    'about.title': 'About',
    'about.lead': 'An architecture student who moved from civil engineering to architecture, working to combine technical rationality with design vision.',
    'about.education': 'Education',
    'about.experience': 'Experience',
    'about.involvement': 'Projects, Research, Volunteer Work',
    'about.leadership': 'Leadership',
    'about.software': 'Software',
    'about.languages': 'Languages',
    'about.competencies': 'Competencies',
    'about.present': 'Present',

    'cv.title': 'CV',
    'cv.lead': 'Download the full version of my CV or read it below.',
    'cv.download': 'Download PDF',
    'cv.downloadTr': 'Download Turkish PDF',
    'cv.downloadEn': 'Download English PDF',
    'cv.enSoon': 'The English version is in preparation.',
    'cv.preview': 'Preview',
    'cv.noPreview': 'Your browser does not support inline PDF preview.',
    'cv.openTab': 'Open in new tab',
    'cv.seeAbout': 'See the About page for a fuller account.',
    'cv.print': 'Print / Save as PDF',
    'cv.pdfLabel': 'Turkish PDF — preview',
    'cv.contact': 'Contact',
    'cv.summary': 'Summary',
    'cv.langHint': 'This page follows the active language, so the CV can be read in full in English here.',
    'blog.title': 'Journal',
    'photos.title': 'Photographs',
    'contact.title': 'Contact',

    'page.soon': 'This section is not built yet.',
    'page.soonNote': 'Phase 1 is complete: design system, grid, router, bilingual support and theming are working. This page arrives with its content in the next phase.',
    'page.notFound': 'Page not found',
    'page.backHome': 'Back to home',

    'footer.tagline': 'Architecture & Design',
    'footer.follow': 'Follow',
    'footer.location': 'Istanbul / Türkiye',
  },
};

let currentLang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;

if (!translations[currentLang]) {
  currentLang = DEFAULT_LANG;
}

export function getLang() {
  return currentLang;
}

export function setLang(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  localStorage.setItem(STORAGE_KEY, lang);
  document.documentElement.lang = lang;
  applyTranslations();
  // Sayfa içeriği de dile bağlı olduğu için yeniden çizilmesi gerekir.
  window.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
}

export function toggleLang() {
  setLang(currentLang === 'tr' ? 'en' : 'tr');
}

/** Çeviri anahtarını çözer. Anahtar yoksa anahtarın kendisi döner. */
export function t(key) {
  return translations[currentLang]?.[key] ?? key;
}

/** İki dilli veri nesnesinden aktif dildeki değeri seçer: { tr, en } */
export function pick(value) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value[currentLang] ?? value[DEFAULT_LANG] ?? '';
  }
  return value;
}

/** data-i18n taşıyan tüm statik elemanları günceller. */
export function applyTranslations(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });

  root.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    el.setAttribute('aria-label', t(el.dataset.i18nAria));
  });
}

/** Dil düğmesi karşı dili gösterir: TR iken "EN" yazar. */
export function otherLangLabel() {
  return currentLang === 'tr' ? 'EN' : 'TR';
}
