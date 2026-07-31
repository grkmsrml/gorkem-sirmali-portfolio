/* ============================================
   PROJE VERİLERİ (TR & EN)
   Kaynak: 2024 tarihli öğrenci portfolyo sunumu.
   Proje adları, açıklamalar ve görseller oradan alındı.

   GÖRSELLER
   public/images/projects/<proje-id>/ altında, her görselden iki
   sürüm: 01.webp (1600px, slider) ve 01-thumb.webp (700px, ızgara).
   Yeni görsel eklerken .jpg/.png olarak klasöre at ve
   `npm run optimize:images` çalıştır.

   ⚠ CAPTION'LAR EKSİK
   Görsellerin hangi çizim olduğunu (plan, kesit, cephe) sunumdaki
   etiketlerden biliyoruz ama hangi dosyanın hangisi olduğunu
   göremedim. caption alanları bilerek boş bırakıldı —
   doldurdukça slider altında görünecekler.
   ============================================ */

import imageSizes from './image-sizes.js';

export const categories = [
  { id: 'all',      name: { tr: 'Tümü',              en: 'All' } },
  { id: 'mimari',   name: { tr: 'Mimari Tasarım',    en: 'Architectural Design' } },
  { id: 'koruma',   name: { tr: 'Koruma / Rölöve',   en: 'Conservation / Survey' } },
  { id: 'icmekan',  name: { tr: 'İç Mekan',          en: 'Interior' } },
  { id: 'kent',     name: { tr: 'Kent / Peyzaj',     en: 'Urban / Landscape' } },
  { id: 'arastirma', name: { tr: 'Araştırma',        en: 'Research' } },
];

/**
 * Bir projenin görsel dizisini üretir: 01..n arası, üç boyutuyla.
 *   thumb → ızgara kartı        (700px)
 *   src   → slider              (1600px)
 *   full  → lightbox yakınlaştırma (2600px, yalnız gerektiğinde iner)
 *
 * En/boy değerleri manifest'ten okunur — mimari çizimlerin oranları
 * 0.46 ile 6.8 arasında değişiyor, sabit bir orana zorlanamazlar.
 */
function images(projectId, count) {
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
      caption: null,   // yukarıdaki nota bak
    };
  });
}

export const projects = [
  {
    id: 'han-adasi',
    title: {
      tr: 'Tarihi Han Adası Yeniden Değerlendirilmesi',
      en: 'Reassessment of the Historic Han Block',
    },
    category: 'mimari',
    year: 2024,
    ongoing: true,
    location: { tr: 'Edremit / Balıkesir', en: 'Edremit / Balıkesir' },
    course: { tr: 'Mimari Proje III', en: 'Architectural Design III' },
    art: 'plan',
    featured: true,
    images: images('han-adasi', 10),
    summary: {
      tr: 'İstanbullular Hanı çevresinin dönüşümü: han ofise, hurdacıların işgalindeki alan sinemaya, konutlar yeniden kurgulanıyor.',
      en: 'The transformation of the area around the İstanbullular Han: the han becomes offices, the scrap-occupied zone a cinema, and the housing is reconfigured.',
    },
    description: {
      tr: [
        'Projem, en temelinde İstanbullular Hanını alarak çevresinin dönüşümü ve Edremit halkının daha çok kullanımını amaçlamakta.',
        'Han, bölgenin nadir taş yığma sağ kalan binalarındandır. Han binası ofis olarak yeniden işlevlendirilirken 1980\'li yıllarda hurdacılar tarafından işgal edilen bölgeye sinema planlandı.',
        'Konutlar yeniden kurgulanarak hem yaşam hem ticaret alanları artırılmıştır.',
      ],
      en: [
        'At its core the project takes the İstanbullular Han and works on the transformation of its surroundings, aiming to bring the people of Edremit into fuller use of the area.',
        'The han is among the few surviving stone masonry buildings in the region. While the han itself is given a new function as offices, a cinema is proposed for the zone occupied by scrap dealers in the 1980s.',
        'The housing is reconfigured so that both living and commercial areas are increased.',
      ],
    },
  },

  {
    id: 'acik-teras-kuzguncuk',
    title: { tr: 'Açık Teras Kuzguncuk', en: 'Open Terrace Kuzguncuk' },
    category: 'icmekan',
    year: 2024,
    ongoing: true,
    location: { tr: 'İstanbul / Kuzguncuk', en: 'Istanbul / Kuzguncuk' },
    course: { tr: 'Mekan Projesi', en: 'Space Project' },
    art: 'section',
    featured: true,
    video: 'https://youtu.be/eZkMsbmmEg0',
    images: images('acik-teras-kuzguncuk', 8),
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

  {
    id: 'ders-calismalari',
    title: { tr: 'Ders Çalışmaları', en: 'Coursework' },
    category: 'arastirma',
    year: 2024,
    location: { tr: 'MSGSÜ', en: 'MSGSÜ' },
    course: { tr: 'Çeşitli dersler', en: 'Various courses' },
    art: 'facade',
    featured: false,
    images: images('ders-calismalari', 6),
    summary: {
      tr: 'Temel sanat eğitimi, mimarlık tarihi, bina bilgisi, yapı bilgisi ve malzeme derslerinden seçme çalışmalar.',
      en: 'Selected work from basic design, architectural history, building studies and materials courses.',
    },
    description: {
      tr: [
        'Temel sanat eğitimi, mimarlık tarihi, bina bilgisi, yapı bilgisi, malzeme ve yapı yönetimi ile ilgili tüm zorunlu derslerimi ilgili dönemde verdim.',
        'Ayrıca rüzgar kapanlarının nasıl modernize edildiğini ve modern sistemlerinin nasıl kullanıldığını inceleyen 3500 kelimelik bir araştırma yürüttüm.',
      ],
      en: [
        'I completed all compulsory courses in basic design, architectural history, building studies, construction, materials and construction management in their respective terms.',
        'I also carried out a 3,500-word study examining how windcatchers have been modernised and how their contemporary systems are used.',
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
