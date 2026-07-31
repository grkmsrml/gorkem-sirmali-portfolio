/* ============================================
   YER TUTUCU SAYFA
   Faz 2+ ile içerik gelene kadar bu sayfaları doldurur.
   ============================================ */

import { t } from '../i18n.js';

export function renderPlaceholder(titleKey) {
  return `
    <section class="container">
      <header class="page-head">
        <span class="overline">${t('page.soon')}</span>
        <h1 class="page-head__title">${t(titleKey)}</h1>
        <p class="page-head__lead">${t('page.soonNote')}</p>
      </header>

      <div class="placeholder">
        <a href="#/" class="btn">${t('page.backHome')}</a>
      </div>
    </section>
  `;
}
