/* ============================================
   FOTOĞRAF GALERİSİ
   İçerik: content/photos.json — kategoriler ve tek düz fotoğraf listesi.
   Yönetim paneli (/admin) fotoğraf ekler, sıralar, başlık yazar,
   kategori atar. Karenin oranı (yatay / dikey / kare) görselin kendi
   ölçüsünden hesaplanır, elle seçilmez.
   ============================================ */

import content from '../../content/photos.json';
import { imageFrom, captionOrNull } from './images.js';

function ratioOf({ width, height }) {
  if (!width || !height) return 'landscape';
  const r = width / height;
  if (r > 1.15) return 'landscape';
  if (r < 0.87) return 'portrait';
  return 'square';
}

const known = new Set((content.categories ?? []).map((c) => c.id));

const photos = (content.photos ?? [])
  .filter((item) => item.image)
  .map((item) => {
    const image = imageFrom(item.image);
    return {
      ...image,
      caption: captionOrNull(item.caption),
      ratio: ratioOf(image),
      // Bir fotoğraf birden çok kategoride olabilir. Silinmiş kategoriler
      // ayıklanır; eski tek kategorili kayıtlar da okunur.
      categories: (item.categories ?? (item.category ? [item.category] : []))
        .filter((id) => known.has(id)),
    };
  });

/** Tüm fotoğraflar, içerik dosyasındaki sırayla. */
export function allPhotos() {
  return photos;
}

/** Yalnız en az bir fotoğrafı olan kategoriler, içerikteki sırayla. */
export function usedPhotoCategories() {
  return (content.categories ?? []).filter((c) => photos.some((p) => p.categories.includes(c.id)));
}
