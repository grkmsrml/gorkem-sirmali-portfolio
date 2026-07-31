/* ============================================
   PROJE VERİLERİ (TR & EN)

   GÖRSEL EKLEME
   `images` dizisi boşken hücreler components/Drawing.js içindeki
   pafta çizimlerine düşer. Gerçek görselleri eklemek için:

     1) Dosyaları public/images/projects/<proje-id>/ altına koy
     2) images dizisine şu biçimde yaz:
        { src: '/images/projects/zeyrek/01.jpg',
          caption: { tr: 'Vaziyet planı', en: 'Site plan' } }

   Dizi dolduğu anda slider otomatik devreye girer, çizim devre dışı
   kalır — başka hiçbir yeri değiştirmen gerekmez.
   ============================================ */

export const categories = [
  { id: 'all',      name: { tr: 'Tümü',              en: 'All' } },
  { id: 'mimari',   name: { tr: 'Mimari Tasarım',    en: 'Architecture' } },
  { id: 'kent',     name: { tr: 'Kent / Peyzaj',     en: 'Urban / Landscape' } },
  { id: 'icmekan',  name: { tr: 'İç Mekan',          en: 'Interior' } },
  { id: 'konsept',  name: { tr: 'Konsept / Teorik',  en: 'Concept / Theory' } },
  { id: 'maket',    name: { tr: 'Maket',             en: 'Model' } },
  { id: 'render',   name: { tr: '3D Render',         en: '3D Render' } },
  { id: 'cizim',    name: { tr: 'Çizim / Eskiz',     en: 'Drawing / Sketch' } },
];

export const projects = [
  {
    id: 'zeyrek-kultur-merkezi',
    title: { tr: "Zeyrek'te Kültür Merkezi", en: 'Cultural Centre in Zeyrek' },
    category: 'mimari',
    year: 2025,
    location: { tr: 'İstanbul / Zeyrek', en: 'Istanbul / Zeyrek' },
    scale: '1/200',
    course: { tr: 'Mimari Proje V', en: 'Architectural Design V' },
    art: 'plan',
    featured: true,
    images: [],
    summary: {
      tr: 'Taşıyıcı ızgaranın cephede okunur bırakıldığı, dolgu panellerinin programa göre değiştiği bir çerçeve önerisi.',
      en: 'A frame proposal where the structural grid stays legible on the façade while infill panels shift with the programme.',
    },
    description: {
      tr: [
        'Proje, Zeyrek\'in eğimli dokusunda boşta kalmış bir parselde konumlanıyor. Çevredeki ahşap konut dokusunun parçalı ölçeğiyle, kültür merkezinin talep ettiği büyük programı uzlaştırmak tasarımın ana problemiydi.',
        'Çözüm, tek bir büyük kütle yerine ortak bir taşıyıcı ızgaraya oturan parçalı hacimler kurmak oldu. Betonarme çerçeve cephede okunur halde bırakıldı; dolgular ise programın gerektirdiği yerde saydam, gerektirdiği yerde masif.',
        'Ölçü sistemi 90 cm\'lik bir modüle oturuyor. Bu modül hem strüktürün açıklıklarını hem de cephe panellerinin boyutunu belirliyor, böylece çeşitlilik tek bir kuralın içinde kalıyor.',
      ],
      en: [
        'The project sits on a vacant plot within the sloping fabric of Zeyrek. Reconciling the fragmented scale of the surrounding timber houses with the large programme a cultural centre demands was the central problem.',
        'Rather than a single large mass, the answer was a set of fragmented volumes resting on a shared structural grid. The concrete frame is left legible on the façade; the infill is transparent where the programme asks for it and solid where it does not.',
        'The dimensional system rests on a 90 cm module, governing both structural spans and façade panel sizes, so that variety stays inside a single rule.',
      ],
    },
  },
  {
    id: 'yamac-evi',
    title: { tr: 'Kesit Denemesi — Yamaç Evi', en: 'Section Study — Hillside House' },
    category: 'konsept',
    year: 2024,
    location: { tr: 'Bursa / Uludağ', en: 'Bursa / Uludağ' },
    scale: '1/100',
    course: { tr: 'Mimari Proje III', en: 'Architectural Design III' },
    art: 'section',
    featured: true,
    images: [],
    summary: {
      tr: 'Eğimli araziye oturan tek aileli konutun kesit üzerinden kurgulanması; saçak ve gölge çalışması.',
      en: 'A single-family house on a slope, developed through section; a study of eaves and shadow.',
    },
    description: {
      tr: [
        'Plan yerine kesitten başlayan bir tasarım denemesi. Arazinin eğimi, mekânları birbirinin üstüne değil, birbirinin yarım kat kaydırılmış devamına yerleştirmeye izin veriyordu.',
        'Derin saçak burada yalnız iklimsel değil, kompozisyona ait bir karar: yapının kütlesini yatayda uzatıyor, altında kalan yarı açık alanı günün her saatinde kullanılabilir kılıyor.',
        'Gölgenin kesitteki davranışı, mevsimlere göre çizilerek test edildi; saçak derinliği bu çizimlerin sonucunda belirlendi.',
      ],
      en: [
        'A design study that begins from section rather than plan. The slope allowed the rooms to sit not on top of one another but as half-level shifted continuations.',
        'The deep eave is not only a climatic decision but a compositional one: it stretches the mass horizontally and keeps the semi-open space beneath usable throughout the day.',
        'The behaviour of shadow in section was tested by drawing it across the seasons; the eave depth follows from those drawings.',
      ],
    },
  },
  {
    id: 'moduler-cephe',
    title: { tr: 'Modüler Cephe Etüdü', en: 'Modular Façade Study' },
    category: 'cizim',
    year: 2025,
    location: { tr: 'İstanbul', en: 'Istanbul' },
    scale: '1/50',
    course: { tr: 'Yapı Elemanları', en: 'Building Elements' },
    art: 'facade',
    featured: true,
    images: [],
    summary: {
      tr: '90 cm modül üzerine kurulu cephe sisteminde dolgu panelinin varyasyonları.',
      en: 'Variations of the infill panel in a façade system built on a 90 cm module.',
    },
    description: {
      tr: [
        'Tek bir modül ölçüsünün ne kadar farklı cephe üretebileceğini araştıran bir çizim serisi. Çerçeve sabit, değişen yalnız dolgu.',
        'Dolgu paneli üç durumda ele alındı: saydam, yarı saydam ve masif. Bu üç durumun ızgara üzerindeki dizilişi değiştikçe, aynı strüktür bambaşka bir yapı gibi okunuyor.',
      ],
      en: [
        'A drawing series investigating how many different façades a single module can produce. The frame is fixed; only the infill changes.',
        'The infill panel is treated in three states: transparent, translucent and solid. As the arrangement of these three across the grid shifts, the same structure reads as an entirely different building.',
      ],
    },
  },
  {
    id: 'kiyi-duzenlemesi',
    title: { tr: 'Kıyı Bandı Düzenlemesi', en: 'Waterfront Regeneration' },
    category: 'kent',
    year: 2024,
    location: { tr: 'İzmir / Karşıyaka', en: 'Izmir / Karşıyaka' },
    scale: '1/500',
    course: { tr: 'Kent Tasarımı', en: 'Urban Design' },
    art: 'plan',
    featured: false,
    images: [],
    summary: {
      tr: 'Kıyı hattında yaya önceliğini kuran, kamusal boşlukları diziye bağlayan bir kent tasarımı çalışması.',
      en: 'An urban design study establishing pedestrian priority along the shore and linking public voids in sequence.',
    },
    description: {
      tr: [
        'Karşıyaka kıyı bandında araç trafiğinin kıyıdan geri çekilmesiyle açığa çıkan şeridin yeniden kurgulanması.',
        'Kamusal boşluklar tek bir büyük meydan olarak değil, birbirine yürüme mesafesinde bağlanan bir dizi küçük odak olarak ele alındı. Her odak farklı bir kullanım yoğunluğuna karşılık geliyor.',
      ],
      en: [
        'A reworking of the strip released when vehicular traffic is pulled back from the Karşıyaka shoreline.',
        'Public voids are treated not as one large square but as a series of small foci linked within walking distance, each corresponding to a different intensity of use.',
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
