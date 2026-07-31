/* ============================================
   BLOG — LİSTE VE YAZI DETAYI
   ============================================ */

import { t, pick, getLang } from '../i18n.js';
import { sortedPosts, postBySlug, adjacentPosts, blogCategories } from '../data/blog-posts.js';

const state = { filter: 'all' };

function formatDate(iso) {
  const locale = getLang() === 'tr' ? 'tr-TR' : 'en-GB';
  return new Date(iso).toLocaleDateString(locale, {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

function categoryName(id) {
  const found = blogCategories.find((c) => c.id === id);
  return found ? pick(found.name) : id;
}

function postMeta(post) {
  return `${formatDate(post.date)} · ${categoryName(post.category)} · ${post.readingTime} ${t('blog.minRead')}`;
}

/* --- Liste --- */

export function renderBlog() {
  const all = sortedPosts();
  const list = state.filter === 'all'
    ? all
    : all.filter((p) => p.category === state.filter);

  const body = all.length === 0
    ? `<p class="placeholder__note">${t('blog.empty')}</p>`
    : list.length === 0
      ? `<p class="placeholder__note">${t('blog.emptyCategory')}</p>`
      : `
        <div class="post-list">
          ${list.map((post) => `
            <a href="#/blog/${post.slug}" class="post-row reveal">
              <div class="post-row__main">
                <h2 class="post-row__title">${pick(post.title)}</h2>
                <p class="post-row__excerpt">${pick(post.excerpt)}</p>
              </div>
              <div class="post-row__meta meta">${postMeta(post)}</div>
            </a>
          `).join('')}
        </div>
      `;

  return `
    <div class="container">
      <header class="page-head">
        <span class="overline">${t('nav.blog')}</span>
        <h1 class="page-head__title">${t('blog.title')}</h1>
        <p class="page-head__lead">${t('blog.lead')}</p>
      </header>

      ${all.length ? `
        <div class="section__head projects__controls">
          <div class="filters">
            ${blogCategories.map((c) => `
              <button class="filter-btn ${state.filter === c.id ? 'is-active' : ''}"
                      data-blog-filter="${c.id}">${pick(c.name)}</button>
            `).join('')}
          </div>
          <span class="meta">${list.length} ${t('blog.count')}</span>
        </div>
      ` : ''}

      ${body}
    </div>
  `;
}

/* --- Detay --- */

export function postTitle(slug) {
  const post = postBySlug(slug);
  return post ? pick(post.title) : null;
}

export function renderBlogPost(slug) {
  const post = postBySlug(slug);

  if (!post) {
    return `
      <section class="container">
        <div class="placeholder">
          <span class="overline">404</span>
          <h1>${t('page.notFound')}</h1>
          <a href="#/blog" class="btn">${t('blog.backToList')}</a>
        </div>
      </section>
    `;
  }

  const { prev, next } = adjacentPosts(slug);
  const paragraphs = pick(post.body).map((p) => `<p>${p}</p>`).join('');

  return `
    <article class="container">
      <header class="page-head post__head">
        <a href="#/blog" class="meta post__back">← ${t('blog.backToList')}</a>
        <h1 class="page-head__title">${pick(post.title)}</h1>
        <p class="meta post__meta">${postMeta(post)}</p>
      </header>

      ${post.example ? `<p class="post__notice meta">${t('blog.exampleNotice')}</p>` : ''}

      <div class="post__body prose">
        ${paragraphs}
      </div>

      <nav class="project-nav frame frame--2">
        ${prev ? `
          <a href="#/blog/${prev.slug}" class="cell project-nav__item">
            <span class="meta">← ${t('blog.newer')}</span>
            <span class="cell__title">${pick(prev.title)}</span>
          </a>
        ` : '<div class="cell project-nav__item project-nav__item--empty"></div>'}

        ${next ? `
          <a href="#/blog/${next.slug}" class="cell project-nav__item project-nav__item--next">
            <span class="meta">${t('blog.older')} →</span>
            <span class="cell__title">${pick(next.title)}</span>
          </a>
        ` : '<div class="cell project-nav__item project-nav__item--empty"></div>'}
      </nav>
    </article>
  `;
}

/** Kategori filtresi — main.js delegasyonundan çağrılır. */
export function handleBlogClick(e) {
  const btn = e.target.closest('[data-blog-filter]');
  if (btn && state.filter !== btn.dataset.blogFilter) {
    state.filter = btn.dataset.blogFilter;
    return true;
  }
  return false;
}
