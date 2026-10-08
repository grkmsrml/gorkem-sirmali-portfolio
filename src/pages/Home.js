/* ============================================
   ANA SAYFA
   Tasarım dilinin vitrini: çerçeve-dolgu ızgarası,
   içinde tek bir düz renk panel.
   ============================================ */

import { t, pick } from '../i18n.js';
import { featuredProjects, projects } from '../data/projects.js';
import { cover } from '../components/Drawing.js';

function heroSection() {
  const featured = featuredProjects().slice(0, 3);

  const cells = featured.map((p) => `
    <a href="#/projeler/${p.id}" class="cell reveal reveal--unveil">
      ${cover(p)}
      <div>
        <div class="cell__title">${pick(p.title)}</div>
        <div class="meta">${p.year} · ${pick(p.location)}</div>
      </div>
    </a>
  `).join('');

  // İMZA: ızgaradaki tek düz renk panel — Eames House cephesi
  const panel = `
    <a href="#/projeler" class="cell panel reveal reveal--unveil">
      <div>
        <div class="cell__title">${t('home.viewAll')}</div>
        <div class="meta">${t('home.gridCatalog')}</div>
      </div>
    </a>
  `;

  return `
    <section class="hero">
      <div class="frame frame--split hero__frame">
        <div class="hero__intro">
          <div>
            <span class="overline">${t('hero.overline')}</span>
            <h1 class="display hero__name">Görkem<br>Sırmalı</h1>
            <p class="hero__lead">${t('hero.lead')}</p>

            <a href="#/projeler" class="hero__scroll meta">
              ${t('home.viewAll')}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                <path d="M12 5v14M5 12l7 7 7-7"/>
              </svg>
            </a>
          </div>

          <div class="hero__meta meta meta-row">
            <span><b>${t('hero.location')}</b></span>
            <span>${t('hero.coords')}</span>
            <span><b>${projects.length}</b> ${t('hero.projectCount')}</span>
          </div>
        </div>

        <div class="hero__work">
          ${cells}
          ${panel}
        </div>
      </div>
    </section>
  `;
}

function selectedSection() {
  return `
    <section class="section container">
      <div class="section__head">
        <div>
          <span class="overline">${t('home.selected')}</span>
          <h2 class="section__title">${t('home.selectedLead')}</h2>
        </div>
        <a href="#/projeler" class="btn">${t('home.viewAll')}</a>
      </div>

      <div class="frame frame--3">
        ${featuredProjects().map((p) => `
          <a href="#/projeler/${p.id}" class="cell reveal reveal--unveil">
            ${cover(p)}
            <div>
              <div class="cell__title">${pick(p.title)}</div>
              <div class="meta">${p.year} · ${pick(p.course)}</div>
            </div>
          </a>
        `).join('')}
      </div>
    </section>
  `;
}

function contactSection() {
  return `
    <section class="section--tight container">
      <div class="frame frame--split">
        <div class="cell">
          <div>
            <span class="overline">${t('nav.contact')}</span>
            <h2 class="section__title" style="margin-top:var(--space-md)">${t('home.contactCta')}</h2>
          </div>
        </div>
        <div class="cell">
          <p>${t('home.contactLead')}</p>
          <a href="#/iletisim" class="btn btn--accent">${t('home.contactBtn')}</a>
        </div>
      </div>
    </section>
  `;
}

export function renderHome() {
  return heroSection() + selectedSection() + contactSection();
}
