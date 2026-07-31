# Görkem Sırmalı — Mimarlık Portfolyo Sitesi

Mimarlık son sınıf öğrencisi Görkem Sırmalı için çok amaçlı kişisel portfolyo sitesi. Staj/iş başvuruları, akademik sergileme, freelance müşteri çekme ve kişisel blog/günlük içeren kapsamlı bir platform.

---

## 📋 Toplanan Kararlar Özeti

| Karar | Seçim |
|---|---|
| **Marka** | Görkem Sırmalı (isim soyisim) |
| **Amaç** | Çok amaçlı: iş başvurusu + akademik + freelance + blog |
| **Dil** | Türkçe & İngilizce (çift dil) |
| **Yapı** | Hibrit — Ana sayfa SPA, Projeler/Blog ayrı sayfa |
| **Teknik** | Vite + Vanilla JS (component bazlı) |
| **Tipografi** | Karışık — Başlıklarda serif, metinlerde sans-serif |
| **Sosyal Medya** | GitHub, LinkedIn, Instagram, Behance/Archdaily + iletişim formu |
| **Tasarım dili** | 🔴 Sonra detaylı tartışılacak |
| **Renk paleti** | 🔴 Sonra detaylı tartışılacak |

---

## 📄 Sayfa Yapısı

### 1. Ana Sayfa (`/`)
- **Hero Section**: İsim, kısa tanıtım, etkileyici animasyonlu giriş
- **Seçili Projeler**: 3-4 öne çıkan proje önizlemesi
- **Hakkımda Kısa**: Kısa bio + fotoğraf
- **İletişim CTA**: İletişime geç butonu
- Tek sayfa scroll deneyimi

### 2. Projeler (`/projeler`)
- **İki görünüm modu** (kullanıcı değiştirebilir):
  - **Masonry Grid**: Görseller üzerinden, Pinterest tarzı
  - **Liste/Sözlük**: İsimler üzerinden ansiklopedi tarzı, tıklayınca inline detay açılır
- **Kategori filtreleme**: Mimari Tasarım, Kent Tasarımı/Peyzaj, İç Mekan, Konsept/Teorik, Maket/Model, 3D Render, El Çizimleri/Eskiz
- **Proje Detay**: Tıklayınca altında/yanında slider görseller + açıklama metni

### 3. Hakkımda (`/hakkimda`)
- Detaylı biyografi
- Deneyim & stajlar (timeline formatında)
- Eğitim bilgileri
- Yetenekler / Kullandığı yazılımlar

### 4. CV (`/cv`)
- CV önizleme
- **PDF indirme** butonu (TR & EN versiyonları)

### 5. Blog / Yazılar (`/blog`)
- Blog yazıları listesi
- Yazı detay sayfası
- Kategori/etiket sistemi

### 6. Fotoğraflar (`/fotograflar`)
- Kişisel fotoğraf galerisi
- Lightbox görünümü

### 7. İletişim (`/iletisim`)
- İletişim formu (isim, email, mesaj)
- Sosyal medya linkleri (GitHub, LinkedIn, Instagram, Behance/Archdaily)
- E-posta adresi

---

## ⚡ İnteraktif Özellikler & Animasyonlar

Tümü mobil uyumlu olacak şekilde:

| Özellik | Açıklama |
|---|---|
| Sayfa geçiş animasyonları | Sayfalar arası smooth fade/slide transition |
| Scroll animasyonları | Elementler görünüce fade-in, slide-up |
| Özel imleç (custom cursor) | Masaüstünde özel cursor, mobilde devre dışı |
| Parallax efektleri | Hero ve bazı bölümlerde derinlik hissi |
| Hover efektleri | Proje görselleri üzerinde zoom + overlay bilgi |
| Dark/Light mode | Koyu/aydınlık mod toggle butonu |
| Loading ekranı | Giriş animasyonu / splash screen |

---

## 🏗️ Teknik Mimari

### Teknoloji
- **Vite** — Build tool & dev server
- **Vanilla JS** — Framework yok, component bazlı modüler yapı
- **Vanilla CSS** — Custom properties (CSS variables) ile tema sistemi
- **Google Fonts** — Serif (başlıklar) + Sans-serif (metinler)

### Proje Yapısı

```
portfolyo/
├── index.html
├── vite.config.js
├── package.json
├── public/
│   ├── fonts/
│   ├── images/
│   │   ├── projects/        # Proje görselleri
│   │   ├── photos/          # Fotoğraf galerisi
│   │   └── general/         # Genel görseller
│   ├── cv/
│   │   ├── cv-tr.pdf
│   │   └── cv-en.pdf
│   └── favicon.ico
├── src/
│   ├── main.js              # Ana giriş noktası
│   ├── router.js            # Sayfa yönlendirme (SPA router)
│   ├── i18n.js              # Çift dil sistemi (TR/EN)
│   ├── styles/
│   │   ├── index.css         # Ana CSS dosyası (imports)
│   │   ├── variables.css     # CSS custom properties (renkler, fontlar, spacing)
│   │   ├── reset.css         # CSS reset
│   │   ├── typography.css    # Tipografi kuralları
│   │   ├── animations.css    # Keyframe animasyonlar
│   │   └── components/       # Component CSS dosyaları
│   │       ├── navbar.css
│   │       ├── hero.css
│   │       ├── projects.css
│   │       ├── blog.css
│   │       └── ...
│   ├── components/
│   │   ├── Navbar.js         # Navigasyon (dil & tema toggle dahil)
│   │   ├── Hero.js           # Ana sayfa hero
│   │   ├── ProjectCard.js    # Proje kartı
│   │   ├── ProjectDetail.js  # Proje detay (slider + metin)
│   │   ├── ImageSlider.js    # Görsel slider
│   │   ├── Lightbox.js       # Fotoğraf lightbox
│   │   ├── Timeline.js       # Deneyim timeline
│   │   ├── ContactForm.js    # İletişim formu
│   │   ├── Footer.js         # Footer
│   │   ├── CustomCursor.js   # Özel imleç
│   │   ├── Loader.js         # Loading ekranı
│   │   └── ScrollReveal.js   # Scroll animasyonları
│   ├── pages/
│   │   ├── Home.js
│   │   ├── Projects.js
│   │   ├── About.js
│   │   ├── CV.js
│   │   ├── Blog.js
│   │   ├── BlogPost.js
│   │   ├── Photos.js
│   │   └── Contact.js
│   ├── data/
│   │   ├── projects.js       # Proje verileri (TR & EN)
│   │   ├── blog-posts.js     # Blog yazıları (TR & EN)
│   │   └── personal.js       # Kişisel bilgiler (TR & EN)
│   └── utils/
│       ├── dom.js            # DOM yardımcı fonksiyonlar
│       ├── animations.js     # Animasyon utilities
│       └── helpers.js        # Genel yardımcılar
```

### Çift Dil (i18n) Sistemi
- `i18n.js` modülü ile merkezi çeviri yönetimi
- URL'de dil belirteci yok, localStorage'da tercih saklanır
- Navbar'da TR/EN toggle butonu
- Tüm metin içerikleri `data/` klasöründe iki dilde tutulur

### Routing (SPA Router)
- Vanilla JS ile hash-based routing (`#/projeler`, `#/hakkimda` vb.)
- Sayfa geçiş animasyonları router içinden tetiklenir
- Browser geri/ileri butonları desteklenir

### Responsive Tasarım
- Mobile-first yaklaşım
- Breakpoints: 480px (mobil), 768px (tablet), 1024px (laptop), 1440px (geniş ekran)
- Custom cursor mobilde otomatik devre dışı
- Touch-friendly interaction'lar

---

## 🔴 Sonra Tartışılacak Konular

Aşağıdaki kararlar implementasyon sırasında detaylı tartışılacak:

### 1. Tasarım Dili / Estetik
Seçenekler:
- Minimalist & Beyaz
- Koyu/Dark tema (sinematik)
- Brutalist / Deneysel
- Mimari / Monokrom
- Sıcak & Organik
- Ya da bunların birleşimi

> [!IMPORTANT]
> Tasarım dili tüm siteyi şekillendirecek en kritik karar. İlk olarak temel yapıyı kurup, ardından birlikte mockup'lar üzerinden bu kararı verebiliriz. Alternatif olarak, birkaç farklı tasarım yönünde demo hazırlayıp birlikte seçebiliriz.

### 2. Renk Paleti
Tasarım diline bağlı olarak belirlenecek. CSS custom properties sayesinde kolayca değiştirilebilir yapıda olacak.

---

## ✅ Uygulama Sırası

### Faz 1: Temel Altyapı
1. Vite projesi kurulumu
2. Proje dosya yapısını oluştur
3. CSS design system (variables, reset, typography)
4. Router sistemi
5. i18n (çift dil) sistemi
6. Navbar + Footer componentleri
7. Dark/Light mode toggle

### Faz 2: Ana Sayfa & Temel Componentler
8. Loading/intro animasyonu
9. Custom cursor
10. Scroll reveal animasyonları
11. Hero section
12. Ana sayfa bölümleri

### Faz 3: Projeler
13. Proje veri yapısı (data)
14. Projeler sayfası (masonry + liste görünüm)
15. Kategori filtreleme
16. Proje detay (slider + metin)

### Faz 4: Diğer Sayfalar
17. Hakkımda + Timeline
18. CV sayfası + PDF indirme
19. Blog listesi + detay
20. Fotoğraf galerisi + Lightbox
21. İletişim sayfası + form

### Faz 5: Polish & Optimizasyon
22. Sayfa geçiş animasyonları
23. Parallax efektleri
24. SEO meta tagleri
25. Performance optimizasyonu
26. Cross-browser test

---

## 🔍 Doğrulama Planı

### Otomatik
- `npm run build` ile production build başarılı olmalı
- Lighthouse skorları kontrol (Performance, SEO, Accessibility)

### Manuel
- Tüm sayfalar arası navigasyon testi
- TR/EN dil geçişi kontrolü
- Dark/Light mode tüm sayfalarda test
- Mobil (responsive) kontrol
- Proje filtreleme ve detay görüntüleme
- İletişim formu validasyonu
- CV PDF indirme

---

> [!NOTE]
> Bu plan, tasarım dili ve renk paleti kararları sonrası güncellenecektir. CSS custom properties kullanıldığı için renk/tema değişiklikleri kolay olacak.
