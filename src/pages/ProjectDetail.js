/* ============================================
   PROJE DETAY SAYFASI
   Adres paylaşılabilir: #/projeler/<id>
   ============================================ */

import { t, pick } from '../i18n.js';
import { projectById, adjacentProjects, categories } from '../data/projects.js';
import { renderSlider } from '../components/ImageSlider.js';
import { md } from '../markdown.js';

/** Sekme başlığı için — router çağırır. */
export function projectTitle(id) {
  const project = projectById(id);
  return project ? pick(project.title) : null;
}

function categoryName(id) {
  const found = categories.find((c) => c.id === id);
  return found ? pick(found.name) : id;
}

/** Pafta anteti: projenin künyesi. */
function specSheet(project) {
  const rows = [
    [t('detail.year'), project.ongoing ? `${project.year} — ${t('detail.ongoing')}` : project.year],
    [t('detail.category'), categoryName(project.category)],
    [t('detail.location'), pick(project.location)],
    [t('detail.course'), pick(project.course)],
    [t('detail.role'), pick(project.role)],
    project.team ? [t('detail.team'), `${t('detail.teamWith')} ${project.team}`] : null,
    [t('detail.scale'), project.scale],
    [t('detail.area'), project.area],
    [t('detail.tools'), project.tools],
    project.video
      ? [t('detail.video'), `<a href="${project.video}" target="_blank" rel="noopener" class="link">${t('detail.watch')} →</a>`]
      : null,
  ].filter((row) => row && row[1]);

  return `
    <dl class="spec-sheet">
      ${rows.map(([label, value]) => `
        <div class="spec-sheet__row">
          <dt class="meta">${label}</dt>
          <dd>${value}</dd>
        </div>
      `).join('')}
    </dl>
  `;
}

function navFooter(id) {
  const { prev, next } = adjacentProjects(id);

  return `
    <nav class="project-nav frame frame--2">
      ${prev ? `
        <a href="#/projeler/${prev.id}" class="cell project-nav__item">
          <span class="meta">← ${t('detail.prev')}</span>
          <span class="cell__title">${pick(prev.title)}</span>
        </a>
      ` : '<div class="cell project-nav__item project-nav__item--empty"></div>'}

      ${next ? `
        <a href="#/projeler/${next.id}" class="cell project-nav__item project-nav__item--next">
          <span class="meta">${t('detail.next')} →</span>
          <span class="cell__title">${pick(next.title)}</span>
        </a>
      ` : '<div class="cell project-nav__item project-nav__item--empty"></div>'}
    </nav>
  `;
}

export function renderProjectDetail(id) {
  const project = projectById(id);

  if (!project) {
    return `
      <section class="container">
        <div class="placeholder">
          <span class="overline">404</span>
          <h1>${t('page.notFound')}</h1>
          <a href="#/projeler" class="btn">${t('detail.backToProjects')}</a>
        </div>
      </section>
    `;
  }

  const paragraphs = md(pick(project.description));

  return `
    <article class="container">
      <header class="page-head project-detail__head">
        <a href="#/projeler" class="meta project-detail__back">← ${t('detail.backToProjects')}</a>
        <h1 class="page-head__title">${pick(project.title)}</h1>
        <p class="page-head__lead">${pick(project.summary)}</p>
      </header>

      <div class="project-detail__media reveal">
        ${renderSlider(project)}
      </div>

      <div class="frame frame--split project-detail__body">
        <div class="cell">
          ${specSheet(project)}
        </div>
        <div class="cell">
          <div class="prose">${paragraphs}</div>
        </div>
      </div>

      ${navFooter(id)}
    </article>
  `;
}
