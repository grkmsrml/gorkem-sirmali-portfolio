# Görkem Sırmalı — Mimarlık Portfolyo

Mimarlık öğrencisi Görkem Sırmalı'nın kişisel portfolyo sitesi. Vite + vanilla JS ile
component bazlı, framework'süz bir yapı; hash tabanlı SPA router, çift dil (TR/EN) ve
açık/koyu tema desteği.

## Tasarım dili — "Çerçeve ve Dolgu"

Eames çifti ve Sedad Hakkı Eldem okuması: okunur bir modüler ızgara, sıcak malzeme,
ölçülü renk. Hücreler arasında boşluk yerine ince bir çizgi var (`--grid-line`); ızgaranın
içinde tek bir düz renk dolgu paneli, Eames House cephesine selam.

- **Palet A — Case Study**: açık tema, kâğıt zemin + kontrplak sıcaklığı + kırmızı/mavi/hardal aksan
- **Palet C — Gölge**: koyu tema eşi, saf siyah değil sıcak kömür
- **Tipografi**: Fraunces (başlık) + Archivo (gövde) + JetBrains Mono (etiket/metadata)

Tokenlar `src/styles/variables.css` içinde.

## Geliştirme

```bash
npm install
npm run dev          # yerel geliştirme sunucusu
npm run dev:host      # ağdaki başka cihazlardan (telefon) erişim için
npm run build         # üretim derlemesi -> dist/
npm run preview       # üretim derlemesini yerelde sun
```

## Görsel ekleme

Proje görselleri `.jpg`/`.png` olarak `public/images/projects/<proje-id>/` altına konur,
ardından:

```bash
npm run optimize:images
```

Her görselden üç `webp` sürümü üretilir (thumb / normal / yakınlaştırma) ve
`src/data/image-sizes.js` manifesti güncellenir. Orijinal dosyalar işlem sonunda silinir.

## Proje yapısı

```
src/
  data/        proje, blog, fotoğraf ve kişisel veriler (TR & EN)
  pages/       her sayfa için render fonksiyonu
  components/  slider, lightbox, çizim yer tutucuları
  styles/      tasarım tokenları + component CSS'leri
  router.js    hash tabanlı SPA router
  i18n.js      çift dil sözlüğü
```
