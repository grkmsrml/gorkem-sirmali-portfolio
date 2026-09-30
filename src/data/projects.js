/* ============================================
   PROJE VERİLERİ (TR & EN)
   Kaynak: dört projenin resmî final sunum PDF'i (F:\Mimarlik).
   Proje adları, tarihler, açıklamalar ve görseller oradan alındı.

   GÖRSELLER
   public/images/projects/<proje-id>/ altında, her görselden üç
   sürüm: NN.webp (1600px, slider), NN-thumb.webp (700px, ızgara),
   NN-full.webp (2600px, yakınlaştırma). Yeni görsel eklerken
   .jpg/.png olarak klasöre at ve `npm run optimize:images` çalıştır.
   ============================================ */

import imageSizes from './image-sizes.js';

export const categories = [
  { id: 'all',       name: { tr: 'Tümü',              en: 'All' } },
  { id: 'mimari',    name: { tr: 'Mimari Tasarım',    en: 'Architectural Design' } },
  { id: 'koruma',    name: { tr: 'Koruma / Rölöve',   en: 'Conservation / Survey' } },
  { id: 'icmekan',   name: { tr: 'İç Mekan',          en: 'Interior' } },
  { id: 'kent',      name: { tr: 'Kent / Peyzaj',     en: 'Urban / Landscape' } },
  { id: 'uygulama',  name: { tr: 'Uygulama Projesi',  en: 'Construction Project' } },
];

/**
 * Bir projenin görsel dizisini üretir: 01..n arası, üç boyutuyla.
 *   thumb → ızgara kartı        (700px)
 *   src   → slider              (1600px)
 *   full  → lightbox yakınlaştırma (2600px, yalnız gerektiğinde iner)
 *
 * En/boy değerleri manifest'ten okunur. `captions` verilirse o
 * indeksteki metin kullanılır, verilmezse null kalır (slider'da
 * başlık gösterilmez).
 */
function images(projectId, count, captions = []) {
  return Array.from({ length: count }, (_, i) => {
    const n = String(i + 1).padStart(2, '0');
    const src = `/images/projects/${projectId}/${n}.webp`;
    const size = imageSizes[src];

    return {
      src,
      thumb: `/images/projects/${projectId}/${n}-thumb.webp`,
      full: `/images/projects/${projectId}/${n}-full.webp`,
      width: size?.w ?? null,
      height: size?.h ?? null,
      caption: captions[i] ?? null,
    };
  });
}

export const projects = [
  {
    id: 'kutahya-kutuphane-konser',
    title: {
      tr: 'Kütahya Kütüphane ve Konser Salonu',
      en: 'Kütahya Library and Concert Hall',
    },
    category: 'mimari',
    year: 2025,
    location: { tr: 'Kütahya', en: 'Kütahya' },
    course: { tr: 'Mimari Proje IV', en: 'Architectural Design IV' },
    art: 'plan',
    featured: true,
    images: images('kutahya-kutuphane-konser', 5, [
      { tr: 'Kentsel Analiz ve Çeşme Envanteri', en: 'Urban Analysis and Fountain Inventory' },
      { tr: 'Ahmet Yakupoğlu Araştırması', en: 'Research on Ahmet Yakupoğlu' },
      { tr: 'Kat Planları', en: 'Floor Plans' },
      { tr: 'Vaziyet Planı', en: 'Site Plan' },
      { tr: 'Kesitler ve Görünüşler', en: 'Sections and Elevations' },
    ]),
    summary: {
      tr: 'Kütahya kent merkezinde, 154 kültür varlığının haritalandığı bir araştırmayla başlayan kütüphane ve konser salonu kompleksi.',
      en: 'A library and concert hall complex in central Kütahya, growing out of a survey that mapped all 154 heritage assets in the historic core.',
    },
    description: {
      tr: [
        'Kütahya\'da başlayan proje için önce kentin geçmişte nasıl olduğunu, neleri yitirdiğini ve neleri koruduğunu araştırdım. Kütahya merkezde 154 kültür varlığı bulunuyor; bunların durumunu (çeşmelerin akıp akmadığından kayıp yapılara kadar) haritaladım ve ziyaret için üç alternatif yürüyüş rotası önerdim.',
        'Bu okumadan çıkan sonuç, kütüphane ve konser salonunu ressam Ahmet Yakupoğlu\'nun mirasına bağladı: kendi tasarladığı ve inşasına bizzat katıldığı Çinili Cami\'nin yakınında, onun kültürel restorasyon çabasını sürdüren bir kamusal kompleks kurguladım.',
        'Program iki ayrı kütleye ayrılıyor: kütüphane (ana kütüphane, dijital/süreli yayınlar, çocuk kütüphanesi, sesli/sessiz çalışma alanları, atölyeler) ve konser salonu (salon, fuaye, kulis, kafe, lobi). İkisi ortak bir peyzaj zemininde, kentin eğimine oturuyor.',
      ],
      en: [
        'For this project in Kütahya I first researched what the city used to be, what it has lost and what it has kept. The historic core holds 154 registered heritage assets; I mapped their condition — from fountains that still run to buildings that no longer exist — and proposed three alternative walking routes for visiting them.',
        'That reading tied the library and concert hall to the legacy of the painter Ahmet Yakupoğlu: sited near the Çinili Mosque he designed and helped build himself, the complex continues his cultural restoration effort as a public programme.',
        'The programme splits into two volumes: a library (main collection, digital/periodicals, children\'s library, quiet and vocal study rooms, workshops) and a concert hall (auditorium, foyer, backstage, café, lobby), sharing one landscaped ground that steps with the city\'s slope.',
      ],
    },
  },

  {
    id: 'cumalikizik-yurutme-merkezi',
    title: { tr: "Cumalıkızık'ta Yürüyüş Merkezi", en: 'Walking Centre in Cumalıkızık' },
    category: 'uygulama',
    year: 2025,
    location: { tr: 'Bursa / Cumalıkızık', en: 'Bursa / Cumalıkızık' },
    course: { tr: 'Uygulama Projesi II', en: 'Construction Project II' },
    art: 'section',
    featured: false,
    images: images('cumalikizik-yurutme-merkezi', 12, [
      { tr: 'Vaziyet Planı ve Kesitler', en: 'Site Plan and Sections' },
      { tr: '-3.00 Kotu Planı', en: 'Level -3.00 Plan' },
      { tr: '0.00 Kotu Planı', en: 'Level 0.00 Plan' },
      { tr: '3.00 Kotu Planı', en: 'Level 3.00 Plan' },
      { tr: 'A-A Kesiti', en: 'Section A-A' },
      { tr: 'B-B Kesiti', en: 'Section B-B' },
      { tr: 'Doğu Görünüşü', en: 'East Elevation' },
      { tr: 'Kuzey Görünüşü', en: 'North Elevation' },
      { tr: 'Güney Görünüşü', en: 'South Elevation' },
      { tr: 'Batı Görünüşü', en: 'West Elevation' },
      { tr: 'Aksonometrik Strüktür Modeli', en: 'Axonometric Structural Model' },
      { tr: 'Çatı ve Dere Detayları', en: 'Roof and Valley Details' },
    ]),
    summary: {
      tr: 'Cumalıkızık\'ta, eğimli arazide yarı gömülü bir kütlede kurgulanan, Cor-ten kaplamalı bir yürüyüş merkezi — tam teknik detaylandırmasıyla.',
      en: 'A part-buried walking centre on a sloping site in Cumalıkızık, clad in Cor-ten steel and developed down to full construction detail.',
    },
    description: {
      tr: [
        'Bursa\'nın tarihi köyü Cumalıkızık\'ta, eğimli bir arazide yarı gömülü bir yürüyüş merkezi tasarladım. Yapı, -3.00 kotundaki depo ve teknik hacimlerden 0.00 kotundaki mağaza ve satış alanlarına, oradan da 3.00 kotundaki kafe ve terasa doğru araziyle birlikte yükseliyor.',
        'Bu proje bir tasarım stüdyosu değil, bir uygulama projesiydi: her kesiti ve detayı 1/50\'den 1/5\'e kadar tam olarak çözmem gerekiyordu. Cephe Cor-ten panel, çelik strüktür ve yalıtım katmanlarıyla kurgulandı; çatı biriktirme ve dere detaylarından merdiven bağlantılarına, pencere sularına kadar her nokta ayrıca çizildi.',
        'Amaç, tasarım kararının üretilebilir bir yapıya dönüşmesini göstermekti — malzeme kalınlığından vida boyuna kadar.',
      ],
      en: [
        'In Cumalıkızık, Bursa\'s historic village, I designed a part-buried walking centre on a sloping site. The building rises with the terrain, from storage and plant rooms at level -3.00, through the shop and retail floor at 0.00, up to a café and terrace at level 3.00.',
        'This was not a design studio project but a construction project: every section and detail had to be resolved in full, from 1:50 down to 1:5. The façade is built up in Cor-ten panels, steel structure and insulation layers; roof drainage and valley details, stair connections and window sills are each drawn separately.',
        'The aim was to show a design decision carried all the way through to a buildable structure — down to material thickness and fastener length.',
      ],
    },
  },

  {
    id: 'han-adasi',
    title: {
      tr: 'İstanbullular Hanı Çevresi Yeniden Değerlendirilmesi',
      en: 'Reassessment of the İstanbullular Han Surroundings',
    },
    category: 'mimari',
    year: 2025,
    location: { tr: 'Edremit / Balıkesir', en: 'Edremit / Balıkesir' },
    course: { tr: 'Mimari Proje III', en: 'Architectural Design III' },
    art: 'plan',
    featured: true,
    images: images('han-adasi', 4, [
      { tr: 'Alan Analizi ve Vaziyet Planı', en: 'Site Analysis and Plan' },
      { tr: 'Mevcut Durum Fotoğrafları ve Kütle Çalışması', en: 'Existing Condition Photographs and Massing Study' },
      { tr: 'Kesitler (A-A, D-D) ve Kat Planları', en: 'Sections (A-A, D-D) and Floor Plans' },
      { tr: 'Kesitler (B-B, C-C) ve Kat Planları', en: 'Sections (B-B, C-C) and Floor Plans' },
    ]),
    summary: {
      tr: 'Edremit\'teki İstanbullular Hanı korunurken çevresinin dönüşümü: konutlar yeniden kurgulanıyor, hurdacıların işgal ettiği alan sinemaya, han avlusu kamusal alana dönüşüyor.',
      en: 'Preserving Edremit\'s İstanbullular Han while transforming what surrounds it: housing reconfigured, the scrap dealers\' plot becomes a cinema, and the han\'s courtyard turns public.',
    },
    description: {
      tr: [
        'Projem, en temelinde Edremit\'in nadir ayakta kalan taş yapılarından İstanbullular Hanı\'nı alarak başladı. Han yeniden işlevlendirilirken orijinal yapısına dokunulmadı; hanın işlevini koruması adına çevresinin dönüşümü mühimdi, bu sebeple konut alanları yeniden kurgulandı ve ticaret alanı artırıldı.',
        'Bir bina Edremit Tarımsal ve Hayvansal Ürün Üreticileri Kooperatifi\'ne ayrıldı. 1980\'lerde hurdacılar tarafından işgal edilen bölgeye ise sinema planladım.',
        'Tüm bunların yanında, hanın otopark olarak kullanılan avlusu herkese açık, çoğunlukla sert zemin bir alan olarak yeniden düzenlendi. Bu ikisi bir araya gelince sinema salonunun cephesine görüntü yansıtılarak açık hava sineması imkânı oluştu.',
      ],
      en: [
        'The project starts from İstanbullular Han, one of the few surviving stone masonry buildings in Edremit. The han itself was re-purposed without touching its original fabric; keeping that function intact meant the real design problem lay in its surroundings, so the housing stock around it was reconfigured and commercial space expanded.',
        'One building was set aside for the Edremit Agricultural and Livestock Producers\' Cooperative. The site occupied by scrap dealers since the 1980s became a cinema.',
        'The han\'s courtyard, long used as a car park, was reopened as a mostly hard-paved public space. Together with the cinema, this let the cinema\'s façade double as a screen for open-air screenings.',
      ],
    },
  },

  {
    id: 'acik-teras-kuzguncuk',
    title: { tr: 'Açık Teras Kuzguncuk', en: 'Open Terrace Kuzguncuk' },
    category: 'icmekan',
    year: 2025,
    location: { tr: 'İstanbul / Kuzguncuk', en: 'Istanbul / Kuzguncuk' },
    course: { tr: 'Mekan Organizasyonu Dersi', en: 'Spatial Organisation Studio' },
    art: 'section',
    featured: true,
    video: 'https://youtu.be/eZkMsbmmEg0',
    images: images('acik-teras-kuzguncuk', 7, [
      { tr: 'Vaziyet Planı ve Zemin Kat Planı', en: 'Site Plan and Ground Floor Plan' },
      { tr: 'Kat Planları (1-4)', en: 'Floor Plans (1–4)' },
      { tr: 'Kesitler A-A, B-B, C-C, D-D', en: 'Sections A-A, B-B, C-C, D-D' },
      { tr: 'Detay Kesitleri E-E, F-F (1/20)', en: 'Detail Sections E-E, F-F (1:20)' },
      { tr: 'Cephe Kesit Detayları', en: 'Façade Section Details' },
      { tr: 'Kuzey ve Doğu Görünüşler', en: 'North and East Elevations' },
      { tr: 'Aydınlatma Planı, Render ve Detaylar', en: 'Lighting Plan, Renders and Details' },
    ]),
    summary: {
      tr: 'Reklam panolarıyla kapatılmış eski bir evin duvarları içine, hafif çelik strüktürle kurulan çok katmanlı mekan.',
      en: 'A multi-layered space built with a light steel structure inside the walls of an old house closed off by advertising boards.',
    },
    description: {
      tr: [
        'Kuzguncuk\'ta dört yol köşesinde, etrafı reklam panoları ile kapatılmış eski evin dış duvarları içine, hafif çelik strüktür ile çok katmanlı bir mekan tasarladım.',
        'Çelik strüktür hem 120 cm aralıklı katları taşımakta hem de eski duvarın korunmasına destek olmaktadır.',
        'Katlar, yükseklik ile algı oyunları yaparken bir yandan da farklı manzaralara yönelir.',
      ],
      en: [
        'On a crossroads corner in Kuzguncuk, I designed a multi-layered space with a light steel structure set inside the outer walls of an old house closed off by advertising boards.',
        'The steel structure both carries the floors set at 120 cm intervals and supports the preservation of the old wall.',
        'The levels play perceptual games with height while turning towards different views.',
      ],
    },
  },

  {
    id: 'cundi-konut',
    title: { tr: "Cundi'de Konut", en: 'House in Cundi' },
    category: 'koruma',
    year: 2024,
    location: { tr: 'İstanbul / Cinci — Cundi Meydanı', en: 'Istanbul / Cinci — Cundi Square' },
    course: { tr: 'Mimari Koruma ve Rölöve II', en: 'Architectural Conservation and Survey II' },
    art: 'facade',
    featured: true,
    images: images('cundi-konut', 8),
    summary: {
      tr: "İstanbul'un en eski meydanlarından Cundi'ye çıkan sokakta, yıllardır boş bekleyen evin rölövesi ve arşiv araştırması.",
      en: 'A measured survey and archival study of a long-vacant house on a street leading to Cundi, one of Istanbul\'s oldest squares.',
    },
    description: {
      tr: [
        'İstanbul\'un en eski meydanlarından olan Cinci/Cundi Meydanına çıkan sokakta bulunan bu eski ev yıllardır boş halde beklemekteymiş.',
        'Konutun izin verilen alanlarında rölövesini alıp, raporlamanın yanı sıra arşiv çalışmaları ile orijinal durumuna dair tespitleri de yaptım.',
      ],
      en: [
        'This old house, on a street leading up to Cinci/Cundi Square — one of the oldest squares in Istanbul — had stood empty for years.',
        'I produced a measured survey of the areas I was permitted to access and, alongside the report, carried out archival work to establish findings about its original state.',
      ],
    },
  },

  {
    id: 'cevizlibag-kutuphane',
    title: {
      tr: 'Cevizlibağ Multimedya Kütüphanesi',
      en: 'Cevizlibağ Multimedia Library',
    },
    category: 'mimari',
    year: 2023,
    location: { tr: 'İstanbul / Cevizlibağ', en: 'Istanbul / Cevizlibağ' },
    course: { tr: 'Mimari Proje II', en: 'Architectural Design II' },
    art: 'plan',
    featured: true,
    images: images('cevizlibag-kutuphane', 4),
    summary: {
      tr: 'Eğitim kurumlarına yakın bölgede çalışma alanı eksikliğini gideren, gençlerin dijital üretimine alan açan kütüphane.',
      en: 'A library close to educational institutions, addressing the lack of study space and opening room for young people\'s digital production.',
    },
    description: {
      tr: [
        'Pek çok eğitim kurumuna yakın olan bölgede, hem çalışma alanı eksikliğini gidermek hem de gençlerin dijital üretimine katkıda bulunmasını sağlamak amacıyla planlanan bu proje, sesli alanlarıyla tamamen herkese açıktır.',
        'Sessiz alanı ve dijital erişilen kütüphanesi kayıt usulü ile çalışırken, üretim merkezleri ise başvuruyla çalışan sistemler olarak kurgulanmıştır.',
      ],
      en: [
        'Planned for an area close to many educational institutions, both to address the shortage of study space and to let young people contribute to digital production, this project is entirely open to the public in its sound-permitted areas.',
        'The quiet zone and the digitally accessed library operate by registration, while the production centres are set up as systems working by application.',
      ],
    },
  },

  {
    id: 'ogrenci-merkezi',
    title: {
      tr: 'Öğrenci ve Kulüpler Merkez Binası',
      en: 'Student and Clubs Centre',
    },
    category: 'mimari',
    year: 2023,
    location: { tr: 'İstanbul / Fındıklı', en: 'Istanbul / Fındıklı' },
    course: { tr: 'Mimari Proje II', en: 'Architectural Design II' },
    art: 'section',
    featured: false,
    images: images('ogrenci-merkezi', 12),
    summary: {
      tr: 'MSGSÜ ek binası ile Meclis-i Mebusan Caddesi arasında bağ kuran, eğimdeki tarihi ağaçları koruyup etraflarında teraslanan yapı.',
      en: 'A building linking the MSGSÜ annex to Meclis-i Mebusan Avenue, preserving the mature trees on the slope and terracing around them.',
    },
    description: {
      tr: [
        'Mimar Sinan Güzel Sanatlar Üniversitesi Öğrenci ve Kulüpler Merkez Binası projesini, üniversitenin Kulüpler Birliği Başkanı olduğum dönemde yapmıştım.',
        'Okulumuzun ek binası ile Meclis-i Mebusan Caddesi arasında bağ kuran yapı, yerleştiği eğimli alandaki tarihi/büyük ağaçları koruyup onlar etrafında katlar/teraslar oluşturarak kurgulanmıştır.',
      ],
      en: [
        'I developed the project for the Mimar Sinan Fine Arts University Student and Clubs Centre during my term as President of the university\'s Union of Clubs.',
        'Linking the university annex to Meclis-i Mebusan Avenue, the building preserves the mature and historic trees on its sloping site and is organised as floors and terraces formed around them.',
      ],
    },
  },

  {
    id: 'gedikpasa-guzeli',
    title: { tr: 'Gedikpaşa Güzeli', en: 'The Beauty of Gedikpaşa' },
    category: 'koruma',
    year: 2023,
    location: { tr: 'İstanbul / Gedikpaşa', en: 'Istanbul / Gedikpaşa' },
    course: { tr: 'Mimari Koruma ve Rölöve I', en: 'Architectural Conservation and Survey I' },
    art: 'facade',
    featured: false,
    images: images('gedikpasa-guzeli', 7),
    summary: {
      tr: 'Bir dönem otel olarak işletilen, bugün her katında ayakkabı üretimi yapılan eski Rum evinin zemin ve ikinci kat rölövesi.',
      en: 'A survey of the ground and second floors of a former Greek house, once run as a hotel and now producing shoes on every floor.',
    },
    description: {
      tr: [
        'İstanbul\'un önemli iki noktasını birleştiren hat olan Gedikpaşa\'da bulunan bu eski Rum evi, bir dönem otel olarak işletildikten sonra günümüzde her katında ayakkabı üretimi yapılan bir duruma gelmiştir.',
        'Son işlevi de binaya hiç iyi bakmamış olup, farklı birçok değişikliğe neden olmuştur.',
        'Üretim alanlarında gerekli ölçümleri yapmamıza izin veren markalar ile zemin ve ikinci katın planları kayda geçirilmiştir.',
      ],
      en: [
        'This old Greek house in Gedikpaşa — on the line joining two important points of Istanbul — was run for a time as a hotel and has since become a building producing shoes on every floor.',
        'This latest function has not treated the building well and has caused a great many alterations.',
        'With the permission of the manufacturers occupying the production areas, the plans of the ground and second floors were recorded.',
      ],
    },
  },
];

/** Ana sayfada gösterilecek seçili işler. */
export function featuredProjects() {
  return projects.filter((p) => p.featured);
}

/** id ile tek proje getirir. */
export function projectById(id) {
  return projects.find((p) => p.id === id);
}

/** Detay sayfasındaki önceki/sonraki gezinme için komşular. */
export function adjacentProjects(id) {
  const i = projects.findIndex((p) => p.id === id);
  if (i === -1) return { prev: null, next: null };

  return {
    prev: i > 0 ? projects[i - 1] : null,
    next: i < projects.length - 1 ? projects[i + 1] : null,
  };
}
