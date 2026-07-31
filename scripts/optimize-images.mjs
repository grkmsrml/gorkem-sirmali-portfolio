/* ============================================
   GÖRSEL OPTİMİZASYONU

   Kullanım:  npm run optimize:images

   public/images altındaki tüm .jpg/.png dosyalarını tarar ve
   her birinden iki webp sürümü üretir:

     <ad>.webp        max 1600px — detay sayfası / slider
     <ad>-thumb.webp  max  700px — ızgara kartı, galeri

   Kaynak dosya işlem sonunda silinir; .webp dosyalarına
   dokunulmaz, o yüzden betiği tekrar çalıştırmak güvenlidir.

   Yeni proje görseli eklerken: dosyaları ilgili klasöre
   .jpg/.png olarak at, sonra bu betiği çalıştır.
   ============================================ */

import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = 'public/images';
const RASTER = /\.(jpe?g|png)$/i;

async function walk(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (RASTER.test(entry.name)) files.push(full);
  }
  return files;
}

const files = await walk(ROOT);

if (files.length === 0) {
  console.log('Optimize edilecek yeni görsel yok.');
  process.exit(0);
}

let before = 0;
let after = 0;
const rows = [];

for (const file of files) {
  const { size } = await fs.stat(file);
  before += size;

  const dir = path.dirname(file);
  const base = path.basename(file).replace(RASTER, '');
  const large = path.join(dir, `${base}.webp`);
  const thumb = path.join(dir, `${base}-thumb.webp`);

  const meta = await sharp(file).metadata();

  await sharp(file)
    .rotate()                                            // EXIF yönünü uygula
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(large);

  await sharp(file)
    .rotate()
    .resize({ width: 700, withoutEnlargement: true })
    .webp({ quality: 75 })
    .toFile(thumb);

  const lg = (await fs.stat(large)).size;
  const sm = (await fs.stat(thumb)).size;
  after += lg + sm;

  rows.push({
    dosya: path.relative(ROOT, file).replace(/\\/g, '/'),
    kaynak: `${meta.width}×${meta.height}`,
    önce: `${Math.round(size / 1024)} KB`,
    sonra: `${Math.round((lg + sm) / 1024)} KB`,
  });

  await fs.unlink(file);
}

console.table(rows);
console.log(`\nÖnce  : ${(before / 1024 / 1024).toFixed(1)} MB`);
console.log(`Sonra : ${(after / 1024 / 1024).toFixed(1)} MB`);
console.log(`Kazanç: %${Math.round((1 - after / before) * 100)}`);
