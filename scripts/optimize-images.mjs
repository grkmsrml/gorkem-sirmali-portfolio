/* ============================================
   GÖRSEL OPTİMİZASYONU

   Kullanım:  npm run optimize:images

   public/images altındaki tüm .jpg/.png dosyalarını tarar ve
   her birinden üç webp sürümü üretir:

     <ad>-full.webp   max 2600px — lightbox'ta yakınlaştırma
     <ad>.webp        max 1600px — detay sayfası / slider
     <ad>-thumb.webp  max  700px — ızgara kartı, galeri

   -full yalnız kullanıcı yakınlaştırdığında indiriliyor; normal
   gezinmede ağırlığı yok.

   Kaynak dosya işlem sonunda silinir; .webp dosyalarına
   dokunulmaz, o yüzden betiği tekrar çalıştırmak güvenlidir.

   Her derlemeden önce kendiliğinden çalışır (package.json: prebuild).
   Yönetim panelinden yüklenen .jpg/.png dosyaları böylece elle bir
   şey yapmadan dönüştürülür; content/ altındaki içerik dosyalarında
   o görsele verilen adres de .webp olarak güncellenir.
   ============================================ */

import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = 'public/images';
const RASTER = /\.(jpe?g|png)$/i;

async function walk(dir, match = RASTER) {
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

/* Üretilen webp'lerin gerçek en/boy değerlerini manifest'e yazar.
   Mimari çizimlerin oranları çok değişken (0.46'dan 6.8'e); sayfa
   bu değerleri bilmezse görseller yüklenirken düzen kayıyor. */
async function writeManifest() {
  const entries = {};

  for (const file of await walk(ROOT, /\.webp$/i)) {
    if (file.includes('-thumb') || file.includes('-full')) continue;
    const meta = await sharp(file).metadata();
    const key = '/' + path.relative('public', file).replace(/\\/g, '/');
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

  await fs.writeFile('src/data/image-sizes.js', body, 'utf8');

  console.log(`\nManifest yazıldı: src/data/image-sizes.js (${Object.keys(sorted).length} görsel)`);
}

/* Panelden yüklenen görsel içerik dosyasına .jpg/.png adresiyle
   yazılır. Dönüştürmeden sonra o adresleri .webp'e çeviririz ki
   içerik, diskteki dosyayla aynı şeyi göstersin. */
async function rewriteContentRefs(converted) {
  if (converted.length === 0) return;

  for (const file of await walk('content', /\.json$/i)) {
    const before = await fs.readFile(file, 'utf8');
    let after = before;

    for (const source of converted) {
      const from = '/' + path.relative('public', source).replace(/\\/g, '/');
      after = after.split(from).join(from.replace(RASTER, '.webp'));
    }

    if (after !== before) {
      await fs.writeFile(file, after, 'utf8');
      console.log(`İçerik güncellendi: ${file.replace(/\\/g, '/')}`);
    }
  }
}

const files = await walk(ROOT);

if (files.length === 0) {
  console.log('Optimize edilecek yeni görsel yok.');
  await writeManifest();
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
  const full = path.join(dir, `${base}-full.webp`);
  const large = path.join(dir, `${base}.webp`);
  const thumb = path.join(dir, `${base}-thumb.webp`);

  const meta = await sharp(file).metadata();

  // İnceleme sürümü: çizim detayı okunabilsin diye kalite yüksek
  await sharp(file)
    .rotate()
    .resize({ width: 2600, withoutEnlargement: true })
    .webp({ quality: 86 })
    .toFile(full);

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

  const fl = (await fs.stat(full)).size;
  const lg = (await fs.stat(large)).size;
  const sm = (await fs.stat(thumb)).size;
  after += fl + lg + sm;

  rows.push({
    dosya: path.relative(ROOT, file).replace(/\\/g, '/'),
    kaynak: `${meta.width}×${meta.height}`,
    önce: `${Math.round(size / 1024)} KB`,
    full: `${Math.round(fl / 1024)} KB`,
    web: `${Math.round((lg + sm) / 1024)} KB`,
  });

  await fs.unlink(file);
}

console.table(rows);
console.log(`\nÖnce  : ${(before / 1024 / 1024).toFixed(1)} MB`);
console.log(`Sonra : ${(after / 1024 / 1024).toFixed(1)} MB`);
console.log(`Kazanç: %${Math.round((1 - after / before) * 100)}`);

await rewriteContentRefs(files);
await writeManifest();
