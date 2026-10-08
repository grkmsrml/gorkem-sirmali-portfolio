/* ============================================
   BLOG YAZILARI (TR & EN)
   İçerik: content/blog/<adres>.json — her yazı bir dosya.
   Yönetim paneli (/admin) bu dosyaları düzenler. Gövde markdown
   metnidir; okuma süresi kelime sayısından hesaplanır.
   ============================================ */

import { readingTime } from '../markdown.js';

export const blogCategories = [
  { id: 'all',     name: { tr: 'Tümü',      en: 'All' } },
  { id: 'kuram',   name: { tr: 'Kuram',     en: 'Theory' } },
  { id: 'kurgu',   name: { tr: 'Bilim-Kurgu', en: 'Science Fiction' } },
  { id: 'atolye',  name: { tr: 'Atölye',    en: 'Workshop' } },
  { id: 'not',     name: { tr: 'Not',       en: 'Notes' } },
  { id: 'gezi',    name: { tr: 'Gezi',      en: 'Travel' } },
];

const files = import.meta.glob('/content/blog/*.json', { eager: true, import: 'default' });

export const posts = Object.values(files).map((raw) => ({
  ...raw,
  // Panel tarihi saatle birlikte yazabilir; yalnız gün kısmı gerekli
  date: String(raw.date).slice(0, 10),
  readingTime: readingTime(raw.body?.tr),
}));

/** Yalnız en az bir yazısı olan kategoriler (+ "Tümü"). */
export function usedBlogCategories() {
  return blogCategories.filter((c) =>
    c.id === 'all' || posts.some((p) => p.category === c.id));
}

/** Tarihe göre yeniden eskiye sıralı yazılar. */
export function sortedPosts() {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}

export function postBySlug(slug) {
  return posts.find((p) => p.slug === slug);
}

/** Yazı detayında önceki/sonraki gezinme (tarih sırasına göre). */
export function adjacentPosts(slug) {
  const list = sortedPosts();
  const i = list.findIndex((p) => p.slug === slug);
  if (i === -1) return { prev: null, next: null };

  return {
    prev: i > 0 ? list[i - 1] : null,
    next: i < list.length - 1 ? list[i + 1] : null,
  };
}
