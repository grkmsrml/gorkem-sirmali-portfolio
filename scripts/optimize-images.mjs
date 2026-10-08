/* ============================================
   GÖRSEL OPTİMİZASYONU

   Kullanım:  npm run optimize:images

   public/images altındaki tüm .jpg/.png dosyalarını tarar ve
   her birinden üç webp sürümü üretir (bkz. lib/images.mjs).
   -full yalnız kullanıcı yakınlaştırdığında indiriliyor; normal
   gezinmede ağırlığı yok.

   Kaynak dosya işlem sonunda silinir; .webp dosyalarına
   dokunulmaz, o yüzden betiği tekrar çalıştırmak güvenlidir.

   Her derlemeden önce kendiliğinden çalışır (package.json: prebuild).
   Yönetim paneli yüklediği görseli anında kendisi dönüştürür; bu
   betik elle klasöre atılan ya da GitHub üzerinden gelen ham
   dosyalar içindir. content/ altındaki içerik dosyalarında o
   görsele verilen adres de .webp olarak güncellenir.
   ============================================ */

import {
  IMAGE_ROOT, walk, convertImage, writeManifest, rewriteContentRefs,
} from './lib/images.mjs';

const files = await walk(IMAGE_ROOT);

if (files.length === 0) {
  console.log('Optimize edilecek yeni görsel yok.');
} else {
  const kb = (n) => `${Math.round(n / 1024)} KB`;
  const results = [];
  for (const file of files) results.push(await convertImage(file));

  console.table(results.map((r) => ({
    dosya: r.file, kaynak: r.source, önce: kb(r.before), full: kb(r.full), web: kb(r.web),
  })));

  const before = results.reduce((sum, r) => sum + r.before, 0);
  const after = results.reduce((sum, r) => sum + r.full + r.web, 0);
  console.log(`\nÖnce  : ${(before / 1024 / 1024).toFixed(1)} MB`);
  console.log(`Sonra : ${(after / 1024 / 1024).toFixed(1)} MB`);
  console.log(`Kazanç: %${Math.round((1 - after / before) * 100)}`);

  for (const file of await rewriteContentRefs(files)) {
    console.log(`İçerik güncellendi: ${file}`);
  }
}

const count = await writeManifest();
console.log(`\nManifest yazıldı: src/data/image-sizes.js (${count} görsel)`);
