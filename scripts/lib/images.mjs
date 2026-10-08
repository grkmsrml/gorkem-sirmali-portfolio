/* ============================================
   GÖRSEL DÖNÜŞTÜRME — ortak işlevler
   Hem komut satırı betiği (optimize-images.mjs) hem yönetim
   panelinin yükleme ucu (admin-api.mjs) bunları kullanır.

   Her kaynak görselden üç webp sürümü üretilir:
     <ad>-full.webp   max 2600px — lightbox'ta yakınlaştırma
     <ad>.webp        max 1600px — detay sayfası / slider
     <ad>-thumb.webp  max  700px — ızgara kartı, galeri
   ============================================ */

import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

export const IMAGE_ROOT = 'public/images';
export const RASTER = /\.(jpe?g|png)$/i;
const MANIFEST = 'src/data/image-sizes.js';

// Sharp okuduğu dosyaları açık tutmasın: Windows'ta uzun çalışan
// geliştirme sunucusu, görselleri silinemez / değiştirilemez hale getiriyor.
sharp.cache(false);

const posix = (p) => p.replace(/\\/g, '/');

export async function walk(dir, match = RASTER) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full, match));
    else if (match.test(entry.name)) files.push(full);
  }
  return files;
}

/**
 * Tek bir .jpg/.png dosyasını üç webp sürümüne çevirir ve kaynağı siler.
 * @returns dönüştürme özeti (boyutlar bayt cinsinden)
 */
export async function convertImage(file) {
  const { size } = await fs.stat(file);
  const dir = path.dirname(file);
  const base = path.basename(file).replace(RASTER, '');
  const full = path.join(dir, `${base}-full.webp`);
  const large = path.join(dir, `${base}.webp`);
  const thumb = path.join(dir, `${base}-thumb.webp`);

  const meta = await sharp(file).metadata();

  // .rotate(): EXIF yönünü uygular (telefon fotoğrafları yan yatmasın)
  // İnceleme sürümü: çizim detayı okunabilsin diye kalite yüksek
  await sharp(file).rotate().resize({ width: 2600, withoutEnlargement: true })
    .webp({ quality: 86 }).toFile(full);
  await sharp(file).rotate().resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 80 }).toFile(large);
  await sharp(file).rotate().resize({ width: 700, withoutEnlargement: true })
    .webp({ quality: 75 }).toFile(thumb);

  const sizes = await Promise.all([full, large, thumb].map(async (f) => (await fs.stat(f)).size));
  await fs.unlink(file);

  return {
    file: posix(path.relative(IMAGE_ROOT, file)),
    output: large,
    source: `${meta.width}×${meta.height}`,
    before: size,
    full: sizes[0],
    web: sizes[1] + sizes[2],
  };
}

/* Üretilen webp'lerin gerçek en/boy değerlerini manifest'e yazar.
   Mimari çizimlerin oranları çok değişken (0.46'dan 6.8'e); sayfa
   bu değerleri bilmezse görseller yüklenirken düzen kayıyor. */
export async function writeManifest() {
  const entries = {};

  for (const file of await walk(IMAGE_ROOT, /\.webp$/i)) {
    if (file.includes('-thumb') || file.includes('-full')) continue;
    // Bozuk bir dosya bütün listeyi durdurmasın
    const meta = await sharp(file).metadata().catch(() => null);
    if (!meta) {
      console.warn(`Okunamadı, atlandı: ${posix(file)}`);
      continue;
    }
    const key = '/' + posix(path.relative('public', file));
    // v: yanında -thumb/-full sürümleri var (kırpılmış kapaklarda yok)
    const hasVariants = await fs.access(file.replace(/\.webp$/i, '-thumb.webp'))
      .then(() => true, () => false);
    entries[key] = { w: meta.width, h: meta.height, ...(hasVariants ? { v: true } : {}) };
  }

  const sorted = Object.fromEntries(Object.entries(entries).sort());

  // JSON değil JS modülü: import attribute gerektirmez, hem Node
  // hem Vite hem tarayıcı aynı şekilde okur.
  const body = `/* OTOMATİK ÜRETİLDİ — elle düzenleme.
   Kaynak: npm run optimize:images
   Görsellerin gerçek en/boy değerleri. Sayfa bunları bilmezse
   çizimler yüklenirken düzen kayıyor. */

export default ${JSON.stringify(sorted, null, 2)};
`;

  // Değişmediyse yazma: gereksiz yere sayfa yenilenmesin
  const current = await fs.readFile(MANIFEST, 'utf8').catch(() => '');
  if (current.replace(/\r\n/g, '\n') !== body) await fs.writeFile(MANIFEST, body, 'utf8');

  return Object.keys(sorted).length;
}

/* İçerik dosyasına .jpg/.png adresiyle yazılmış görseller,
   dönüştürmeden sonra .webp'e çevrilir ki içerik diskteki dosyayla
   aynı şeyi göstersin. */
export async function rewriteContentRefs(converted) {
  const changed = [];
  if (converted.length === 0) return changed;

  for (const file of await walk('content', /\.json$/i)) {
    const before = await fs.readFile(file, 'utf8');
    let after = before;

    for (const source of converted) {
      const from = '/' + posix(path.relative('public', source));
      after = after.split(from).join(from.replace(RASTER, '.webp'));
    }

    if (after !== before) {
      await fs.writeFile(file, after, 'utf8');
      changed.push(posix(file));
    }
  }
  return changed;
}
