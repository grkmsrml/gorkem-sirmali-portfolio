/* ============================================
   PROJE VERİLERİ (TR & EN)
   İçerik: content/projects/<adres>.json — her proje bir dosya.
   Yönetim paneli (/admin) bu dosyaları düzenler; elle de
   düzenlenebilir. Buradaki kod yalnız dosyaları okuyup sayfaların
   beklediği biçime getirir.

   GÖRSELLER
   İçerik dosyası bir görselin yalnız adresini tutar; üç boyut
   (thumb / src / full) ve en-boy değeri images.js'te türetilir.
   ============================================ */

import { imageFrom, captionOrNull } from './images.js';
import { categories } from './categories.js';

export { categories };

const files = import.meta.glob('/content/projects/*.json', { eager: true, import: 'default' });

function toProject(raw) {
  return {
    ...raw,
    id: raw.slug,
    video: raw.video || null,
    team: raw.team || null,
    cover: imageFrom(raw.cover),
    images: (raw.images ?? [])
      .filter((item) => item.image)
      .map((item) => ({
        ...imageFrom(item.image),
        caption: captionOrNull(item.caption),
      })),
  };
}

/** Sıra: içerik dosyasındaki `order` alanı (küçük olan önce). */
export const projects = Object.values(files)
  .map(toProject)
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

/** Kartlarda gösterilecek kapak görseli; seçilmemişse ilk görsel. */
export function coverImage(project) {
  return project.cover ?? project.images?.[0] ?? null;
}

/** Yalnız en az bir projesi olan kategoriler (+ "Tümü"). */
export function usedCategories() {
  return categories.filter((c) =>
    c.id === 'all' || projects.some((p) => p.category === c.id));
}

/** Ana sayfada gösterilecek seçili işler. */
export function featuredProjects() {
  return projects.filter((p) => p.featured);
}

/** id ile tek proje getirir. */
export function projectById(id) {
  return projects.find((p) => p.id === id);
}

/** Detay sayfasındaki önceki/sonraki gezinme için komşular. */
export function adjacentProjects(id) {
  const i = projects.findIndex((p) => p.id === id);
  if (i === -1) return { prev: null, next: null };

  return {
    prev: i > 0 ? projects[i - 1] : null,
    next: i < projects.length - 1 ? projects[i + 1] : null,
  };
}
