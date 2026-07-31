/* ============================================
   CV SAYFASI
   PDF indirme + tarayıcı içi önizleme.
   İngilizce sürüm hazırlanınca data/personal.js içindeki
   cvFiles.en doldurulduğu an ikinci düğme kendiliğinden çıkar.
   ============================================ */

import { t, getLang } from '../i18n.js';
import { cvFiles, profile } from '../data/personal.js';

function downloadIcon() {
  return `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="1.75" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
    </svg>
  `;
}

export function renderCV() {
  // Aktif dilin dosyası varsa onu, yoksa mevcut olanı göster
  const primary = cvFiles[getLang()] ?? cvFiles.tr ?? cvFiles.en;

  const buttons = [
    cvFiles.tr ? `<a href="${cvFiles.tr}" download class="btn btn--accent">${downloadIcon()} ${t('cv.downloadTr')}</a>` : '',
    cvFiles.en
      ? `<a href="${cvFiles.en}" download class="btn">${downloadIcon()} ${t('cv.downloadEn')}</a>`
      : `<span class="meta cv__note">${t('cv.enSoon')}</span>`,
  ].join('');

  return `
    <div class="container">
      <header class="page-head">
        <span class="overline">${t('nav.cv')}</span>
        <h1 class="page-head__title">${profile.name}</h1>
        <p class="page-head__lead">${t('cv.lead')}</p>
      </header>

      <div class="cv__actions">
        ${buttons}
      </div>

      ${primary ? `
        <figure class="cv__preview reveal">
          <object data="${primary}" type="application/pdf" class="cv__object">
            <div class="cv__fallback">
              <p>${t('cv.noPreview')}</p>
              <a href="${primary}" target="_blank" rel="noopener" class="btn">${t('cv.openTab')}</a>
            </div>
          </object>
        </figure>
      ` : ''}

      <p class="cv__footnote meta">
        ${t('cv.seeAbout')}
        <a href="#/hakkimda" class="link">${t('nav.about')} →</a>
      </p>
    </div>
  `;
}
