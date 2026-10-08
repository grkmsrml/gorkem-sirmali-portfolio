/* ============================================
   CV SAYFASI

   İki katman:
     1) Sayfa içi özgeçmiş — aktif dile göre çizilir.
        İngilizce PDF hazır olmadığı için İngilizce ziyaretçinin
        özgeçmişi eksiksiz okuyabildiği yer burası. Yazdırma
        stiliyle birlikte Ctrl+P temiz bir CV çıkarır.
     2) Türkçe PDF — indirme + tarayıcı içi önizleme.

   cvFiles.en doldurulduğu an ikinci indirme düğmesi kendiliğinden
   çıkar; o zamana kadar "hazırlanıyor" notu görünür.
   ============================================ */

import { t, pick, getLang, setLang } from '../i18n.js';
import { md } from '../markdown.js';
import {
  profile, contact, cvFiles, education, experience,
  involvement, leadership, software, languages, competencies,
} from '../data/personal.js';

function icon(path) {
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="1.75" aria-hidden="true">${path}</svg>`;
}

const downloadIcon = () => icon('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>');

/**
 * İngilizce özgeçmişi indirilebilir hale getirir.
 * Resmî İngilizce PDF hazır olmadığı için çıktı sayfadan üretilir:
 * dil geçici olarak İngilizce'ye alınır, tarayıcının "PDF olarak
 * kaydet" akışı açılır, ardından dil eski haline döner.
 * cvFiles.en doldurulduğunda bu yola hiç girilmez — gerçek dosya inilir.
 */
export async function downloadEnglishCV() {
  const previousLang = getLang();
  const previousTitle = document.title;

  if (previousLang !== 'en') {
    setLang('en');
    // Sayfanın İngilizce çizilmesini bekle (langchange → redraw)
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)));
  }

  // Kaydedilen dosyanın varsayılan adı sekme başlığından gelir
  document.title = 'Gorkem-Sirmali-CV-EN';

  try {
    window.print();
  } finally {
    document.title = previousTitle;
    if (previousLang !== 'en') setLang(previousLang);
  }
}

/* --- Sayfa içi özgeçmiş bölümleri --- */

function sheetHeader() {
  return `
    <header class="cv-sheet__head">
      <div>
        <h2 class="cv-sheet__name">${profile.name}</h2>
        <p class="meta">${pick(profile.title)}</p>
      </div>
      <div class="cv-sheet__contact meta">
        <span>${contact.email}</span>
        <span>${pick(profile.location)}</span>
      </div>
    </header>
  `;
}

function sheetBlock(title, body) {
  return `
    <section class="cv-block">
      <h3 class="cv-block__title">${title}</h3>
      ${body}
    </section>
  `;
}

function entry({ period, title, subtitle, body }) {
  return `
    <div class="cv-entry">
      <div class="cv-entry__period meta">${period}</div>
      <div class="cv-entry__content">
        <h4 class="cv-entry__title">${title}</h4>
        ${subtitle ? `<p class="meta cv-entry__subtitle">${subtitle}</p>` : ''}
        ${body ? `<p class="cv-entry__body">${body}</p>` : ''}
      </div>
    </div>
  `;
}

function inlineList(items) {
  return `<p class="cv-inline">${items.join(' · ')}</p>`;
}

function renderSheet() {
  const summary = `<div class="prose cv-summary">${md(pick(profile.bio))}</div>`;

  const educationBody = education.map((e) => entry({
    period: `${e.start} — ${e.end ?? t('about.present')}`,
    title: pick(e.institution),
    subtitle: pick(e.program),
  })).join('');

  const experienceBody = experience.map((e) => entry({
    period: pick(e.period),
    title: `${pick(e.org)} — ${pick(e.role)}`,
    subtitle: pick(e.project),
    body: pick(e.description),
  })).join('');

  const involvementBody = involvement.map((i) => entry({
    period: i.year,
    title: pick(i.title),
    subtitle: pick(i.org),
    body: pick(i.description),
  })).join('');

  const leadershipBody = leadership.map((l) => entry({
    period: '',
    title: pick(l.title),
    subtitle: pick(l.note),
  })).join('');

  const skillsBody = `
    <div class="cv-skills">
      <div>
        <span class="overline">${t('about.software')}</span>
        ${inlineList(software)}
      </div>
      <div>
        <span class="overline">${t('about.languages')}</span>
        ${inlineList(languages.map((l) => `${pick(l.name)} (${pick(l.level)})`))}
      </div>
      <div>
        <span class="overline">${t('about.competencies')}</span>
        ${inlineList(competencies.map((c) => pick(c)))}
      </div>
    </div>
  `;

  return `
    <article class="cv-sheet">
      ${sheetHeader()}
      ${sheetBlock(t('cv.summary'), summary)}
      ${sheetBlock(t('about.education'), educationBody)}
      ${sheetBlock(t('about.experience'), experienceBody)}
      ${sheetBlock(t('about.involvement'), involvementBody)}
      ${sheetBlock(t('about.leadership'), leadershipBody)}
      ${sheetBlock(t('about.competencies'), skillsBody)}
    </article>
  `;
}

export function renderCV() {
  const buttons = [
    cvFiles.tr
      ? `<a href="${cvFiles.tr}" download class="btn btn--accent">${downloadIcon()} ${t('cv.downloadTr')}</a>`
      : '',
    // Resmî İngilizce PDF varsa doğrudan inilir; yoksa sayfadan üretilir.
    cvFiles.en
      ? `<a href="${cvFiles.en}" download class="btn">${downloadIcon()} ${t('cv.downloadEn')}</a>`
      : `<button class="btn" data-download-en>${downloadIcon()} ${t('cv.downloadEnOngoing')}</button>`,
  ].join('');

  return `
    <div class="container">
      <header class="page-head">
        <span class="overline">${t('nav.cv')}</span>
        <h1 class="page-head__title">${t('cv.title')}</h1>
        <p class="page-head__lead">${t('cv.lead')}</p>
      </header>

      <div class="cv__actions">
        ${buttons}
      </div>

      ${!cvFiles.en ? `<p class="meta cv__note">${t('cv.enSoon')}</p>` : ''}

      ${renderSheet()}

      ${cvFiles.tr ? `
        <section class="cv__pdf">
          <div class="section__head">
            <h2 class="section__title">${t('cv.pdfLabel')}</h2>
            <a href="${cvFiles.tr}" target="_blank" rel="noopener" class="meta link">${t('cv.openTab')} →</a>
          </div>

          <figure class="cv__preview">
            <object data="${cvFiles.tr}" type="application/pdf" class="cv__object">
              <div class="cv__fallback">
                <p>${t('cv.noPreview')}</p>
                <a href="${cvFiles.tr}" target="_blank" rel="noopener" class="btn">${t('cv.openTab')}</a>
              </div>
            </object>
          </figure>
        </section>
      ` : ''}

      <p class="cv__footnote meta">
        ${t('cv.seeAbout')}
        <a href="#/hakkimda" class="link">${t('nav.about')} →</a>
      </p>
    </div>
  `;
}
