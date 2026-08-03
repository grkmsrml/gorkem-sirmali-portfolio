/* ============================================
   HAKKIMDA
   Timeline'lar çerçeve-dolgu diline uyuyor: her kayıt
   bir satır, aralarında boşluk değil çizgi.
   ============================================ */

import { t, pick } from '../i18n.js';
import {
  profile, education, coursework, experience, involvement,
  leadership, software, languages, competencies,
} from '../data/personal.js';

function bioSection() {
  const paragraphs = pick(profile.bio).map((p) => `<p>${p}</p>`).join('');

  return `
    <section class="frame frame--split about__bio">
      <div class="cell">
        <span class="overline">${t('about.title')}</span>
        <div class="about__identity">
          <h2 class="about__name">${profile.name}</h2>
          <p class="meta">${pick(profile.title)}</p>
          <p class="meta">${pick(profile.location)}</p>
        </div>
      </div>
      <div class="cell">
        <div class="prose">${paragraphs}</div>
      </div>
    </section>
  `;
}

/** Eğitim ve deneyim için ortak satır düzeni. */
function timelineRow({ period, title, subtitle, body }) {
  return `
    <div class="timeline__row reveal">
      <div class="timeline__period meta">${period}</div>
      <div class="timeline__content">
        <h3 class="timeline__title">${title}</h3>
        ${subtitle ? `<p class="meta timeline__subtitle">${subtitle}</p>` : ''}
        ${body ? `<p class="timeline__body">${body}</p>` : ''}
      </div>
    </div>
  `;
}

function educationSection() {
  const rows = education.map((e) => timelineRow({
    period: `${e.start} — ${e.end ?? t('about.present')}`,
    title: pick(e.institution),
    subtitle: pick(e.program),
  })).join('');

  return `
    <section class="section--tight">
      <div class="section__head">
        <h2 class="section__title">${t('about.education')}</h2>
      </div>
      <div class="timeline">${rows}</div>
    </section>
  `;
}

function courseworkSection() {
  return `
    <section class="section--tight">
      <div class="section__head">
        <h2 class="section__title">${t('about.coursework')}</h2>
      </div>
      <div class="frame frame--split">
        <div class="cell">
          <p>${pick(coursework.summary)}</p>
        </div>
        <div class="cell">
          <p class="text-small">${pick(coursework.note)}</p>
        </div>
      </div>
    </section>
  `;
}

function experienceSection() {
  const rows = experience.map((e) => timelineRow({
    period: pick(e.period),
    title: `${pick(e.org)} — ${pick(e.role)}`,
    subtitle: pick(e.project),
    body: pick(e.description),
  })).join('');

  return `
    <section class="section--tight">
      <div class="section__head">
        <h2 class="section__title">${t('about.experience')}</h2>
      </div>
      <div class="timeline">${rows}</div>
    </section>
  `;
}

function involvementSection() {
  const rows = involvement.map((item) => timelineRow({
    period: item.year,
    title: pick(item.title),
    subtitle: pick(item.org),
    body: pick(item.description),
  })).join('');

  return `
    <section class="section--tight">
      <div class="section__head">
        <h2 class="section__title">${t('about.involvement')}</h2>
        <span class="meta">${involvement.length}</span>
      </div>
      <div class="timeline">${rows}</div>
    </section>
  `;
}

function leadershipSection() {
  return `
    <section class="section--tight">
      <div class="section__head">
        <h2 class="section__title">${t('about.leadership')}</h2>
      </div>
      <div class="frame frame--2">
        ${leadership.map((l) => `
          <div class="cell reveal">
            <h3 class="cell__title">${pick(l.title)}</h3>
            ${pick(l.note) ? `<p class="text-small">${pick(l.note)}</p>` : ''}
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

function skillsSection() {
  const tagList = (items) => `
    <ul class="tag-list" role="list">
      ${items.map((i) => `<li class="tag">${i}</li>`).join('')}
    </ul>
  `;

  return `
    <section class="section--tight">
      <div class="frame frame--3">
        <div class="cell">
          <span class="overline">${t('about.software')}</span>
          ${tagList(software)}
        </div>

        <div class="cell">
          <span class="overline">${t('about.languages')}</span>
          <dl class="spec-sheet">
            ${languages.map((l) => `
              <div class="spec-sheet__row">
                <dt class="meta">${pick(l.name)}</dt>
                <dd>${pick(l.level)}</dd>
              </div>
            `).join('')}
          </dl>
        </div>

        <div class="cell">
          <span class="overline">${t('about.competencies')}</span>
          ${tagList(competencies.map((c) => pick(c)))}
        </div>
      </div>
    </section>
  `;
}

export function renderAbout() {
  return `
    <div class="container">
      <header class="page-head">
        <span class="overline">${t('nav.about')}</span>
        <h1 class="page-head__title">${t('about.title')}</h1>
        <p class="page-head__lead">${t('about.lead')}</p>
      </header>

      ${bioSection()}
      ${educationSection()}
      ${courseworkSection()}
      ${experienceSection()}
      ${involvementSection()}
      ${leadershipSection()}
      ${skillsSection()}
    </div>
  `;
}
