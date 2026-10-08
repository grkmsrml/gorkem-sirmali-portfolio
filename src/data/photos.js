/* ============================================
   FOTOĞRAF GALERİSİ
   İçerik: content/photos.json — tek düz liste.
   Yönetim paneli (/admin) fotoğraf ekler, sıralar, başlık yazar.
   Karenin oranı (yatay / dikey / kare) görselin kendi ölçüsünden
   hesaplanır, elle seçilmez.
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

const photos = (content.photos ?? [])
  .filter((item) => item.image)
  .map((item) => {
    const image = imageFrom(item.image);
    return { ...image, caption: captionOrNull(item.caption), ratio: ratioOf(image) };
  });

/** Tüm fotoğraflar, içerik dosyasındaki sırayla. */
export function allPhotos() {
  return photos;
}
