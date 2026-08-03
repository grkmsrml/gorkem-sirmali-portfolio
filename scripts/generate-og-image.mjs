/* ============================================
   OG GÖRSELİ

   Kullanım: npm run generate:og

   Sosyal medyada (LinkedIn, WhatsApp, Twitter/X) link paylaşılınca
   çıkan önizleme kartı. 1200×630 — Open Graph standart boyutu.

   Palet A (Case Study) renkleriyle: kâğıt zemin, kırmızı aksan
   şeridi, isim ve etiket. Not: Fraunces bu makinede sistem fontu
   olarak kurulu değil, o yüzden SVG içindeki yazı genel bir serife
   düşer — link önizlemesi için yeterli, siteyle piksel piksel aynı
   değil.
   ============================================ */

import sharp from 'sharp';

const WIDTH = 1200;
const HEIGHT = 630;

const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#F7F4ED" />

  <!-- ızgara çizgileri -->
  <line x1="0" y1="90" x2="${WIDTH}" y2="90" stroke="#D2C9B8" stroke-width="1" />
  <line x1="0" y1="${HEIGHT - 90}" x2="${WIDTH}" y2="${HEIGHT - 90}" stroke="#D2C9B8" stroke-width="1" />
  <line x1="90" y1="0" x2="90" y2="${HEIGHT}" stroke="#D2C9B8" stroke-width="1" />

  <!-- dolgu paneli — Eames House cephesi selamı -->
  <rect x="${WIDTH - 260}" y="0" width="260" height="${HEIGHT}" fill="#C8352A" />

  <text x="130" y="290" font-family="Georgia, 'Times New Roman', serif" font-size="88"
        font-weight="300" fill="#1A1A18" letter-spacing="-2">Görkem Sırmalı</text>

  <text x="130" y="345" font-family="'Courier New', monospace" font-size="22"
        letter-spacing="4" fill="#C8352A">MİMARLIK PORTFOLYOSU</text>

  <text x="130" y="${HEIGHT - 130}" font-family="'Courier New', monospace" font-size="18"
        letter-spacing="2" fill="#57534A">İSTANBUL — MSGSÜ MİMARLIK</text>
</svg>
`;

await sharp(Buffer.from(svg))
  .png()
  .toFile('public/og-image.png');

console.log('Üretildi: public/og-image.png (1200×630)');
