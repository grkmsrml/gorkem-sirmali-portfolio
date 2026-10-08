/* ============================================
   GÖRSEL YARDIMCISI
   İçerik dosyaları bir görselin yalnız adresini tutar
   (/images/.../ad.webp ya da panelden yeni yüklenmiş .jpg/.png).
   Üç boyut ve en/boy değeri buradan türetilir:
     thumb → ızgara kartı        (700px)
     src   → slider              (1600px)
     full  → lightbox yakınlaştırma (2600px, yalnız gerektiğinde iner)

   -thumb / -full sürümleri optimize betiği üretir. Kırpılmış kapak
   gibi tek sürümlü görsellerde ikisi de ana dosyaya düşer.
   ============================================ */

import imageSizes from './image-sizes.js';

export function imageFrom(path) {
  if (!path) return null;

  const base = path.replace(/\.(jpe?g|png|webp)$/i, '');
  const src = `${base}.webp`;
  const size = imageSizes[src];
  // v: betik bu görselin -thumb ve -full sürümlerini de üretmiş
  const hasVariants = Boolean(size?.v);

  return {
    src,
    thumb: hasVariants ? `${base}-thumb.webp` : src,
    full: hasVariants ? `${base}-full.webp` : src,
    width: size?.w ?? null,
    height: size?.h ?? null,
  };
}

/** Başlığın iki dili de boşsa null döner (sayfada başlık gösterilmez). */
export function captionOrNull(caption) {
  return caption && (caption.tr || caption.en) ? caption : null;
}
