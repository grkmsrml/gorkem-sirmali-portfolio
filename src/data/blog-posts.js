/* ============================================
   BLOG YAZILARI (TR & EN)

   Aşağıdaki iki yazı ÖRNEKTİR — sayfanın nasıl göründüğünü
   göstermek için yazıldı. Konuları özgeçmişindeki ilgi
   alanlarından seçildi (bilim-kurgu literatürünün mekânsal
   yansımaları, mimarlık kuramı), ama metinler sana ait değil.
   Kendi yazılarınla değiştir ya da sil — dizi boşalırsa sayfa
   düzgün bir "henüz yazı yok" durumu gösterir.

   Yeni yazı eklerken: slug benzersiz olmalı, date ISO biçiminde
   (YYYY-MM-DD), body paragraf dizisi.
   ============================================ */

export const blogCategories = [
  { id: 'all',     name: { tr: 'Tümü',      en: 'All' } },
  { id: 'kuram',   name: { tr: 'Kuram',     en: 'Theory' } },
  { id: 'kurgu',   name: { tr: 'Bilim-Kurgu', en: 'Science Fiction' } },
  { id: 'atolye',  name: { tr: 'Atölye',    en: 'Workshop' } },
  { id: 'not',     name: { tr: 'Not',       en: 'Notes' } },
];

export const posts = [
  {
    slug: 'cerceve-ve-dolgu',
    category: 'kuram',
    date: '2026-06-18',
    readingTime: 6,
    example: true,
    title: {
      tr: 'Çerçeve ve Dolgu: Eames ile Eldem Aynı Cümleyi Kurar mı?',
      en: 'Frame and Infill: Do Eames and Eldem Speak the Same Sentence?',
    },
    excerpt: {
      tr: 'Biri Kaliforniya\'da çelik iskeletli bir ev, diğeri Zeyrek\'te betonarme bir çerçeve kurdu. İkisini yan yana koyduğumda gördüğüm şey benzer bir üslup değil, aynı gramerdi.',
      en: 'One built a steel-framed house in California, the other a concrete frame in Zeyrek. Placing them side by side, what I saw was not a shared style but a shared grammar.',
    },
    body: {
      tr: [
        'Eames House\'un cephesine ilk baktığında gördüğün şey renktir: kırmızı, mavi, beyaz panellerin ızgara içinde dağılışı. Zeyrek\'teki Sosyal Sigortalar Kurumu yerleşkesine baktığında ise önce gölge gelir — derin saçaklar, tuğla dolgular, kırılan kütle. Yüzeyde ortak hiçbir şey yok gibi.',
        'Ama ikisinde de aynı ayrım var: neyin taşıdığı ile neyin doldurduğu birbirinden ayrılmış, ve bu ayrım gizlenmek yerine cephede okunur bırakılmış. Çerçeve sabittir, dolgu değişkendir. Eames\'te dolgu bir renk panelidir, Eldem\'de tuğla ya da ahşap kafes. Kural aynı, malzeme farklı.',
        'Bu ayrımın önemi estetik değil, yöntemsel. Çerçeveyi sabitlediğin anda dolguyu özgürleştirmiş olursun; program değiştiğinde yapıyı yeniden düşünmen gerekmez, sadece dolguyu değiştirirsin. Eames\'in Case Study House programının ucuz ve hızlı üretim hedefi de, Eldem\'in yerel tipolojiyi modern strüktürle uzlaştırma çabası da bu esnekliğe dayanır.',
        'İkisini birbirine yaklaştıran asıl şey ise başka: her ikisi de tipoloji araştırmacısıydı. Eldem yüzlerce Türk evi planını tarayıp ortak kuralı çıkardı. Eames\'ler nesneleri, oyuncakları, görüntüleri sınıflandırmaktan hiç vazgeçmedi. Önce envanter, sonra kural, en sonunda tasarım. Sıra hep aynı.',
      ],
      en: [
        'The first thing you see on the façade of the Eames House is colour: red, blue and white panels distributed across a grid. Looking at the Social Insurance Complex in Zeyrek, shadow comes first — deep eaves, brick infill, a broken mass. On the surface they share nothing.',
        'Yet both make the same distinction: what carries and what fills are separated, and rather than being concealed, that separation is left legible on the façade. The frame is fixed, the infill variable. For Eames the infill is a colour panel; for Eldem, brick or a timber lattice. Same rule, different material.',
        'What matters here is not aesthetic but methodological. The moment you fix the frame you free the infill: when the programme changes you need not rethink the structure, only the fill. Both the Case Study House programme\'s aim of cheap, fast production and Eldem\'s effort to reconcile local typology with modern structure rest on this flexibility.',
        'What truly brings them close, though, is something else: both were researchers of typology. Eldem surveyed hundreds of Turkish house plans and extracted the shared rule. The Eameses never stopped classifying objects, toys, images. Inventory first, then rule, and design last. The order never changes.',
      ],
    },
  },
  {
    slug: 'kentin-lojistik-arka-yuzu',
    category: 'atolye',
    date: '2026-05-02',
    readingTime: 4,
    example: true,
    title: {
      tr: 'Kentin Lojistik Arka Yüzü',
      en: 'The Logistical Backside of the City',
    },
    excerpt: {
      tr: 'Fotoğraf atölyesinde üzerine çalıştığım dört temadan biri buydu. Kentin görülmesi istenen yüzü ile onu ayakta tutan yüzü arasındaki mesafe, çoğu zaman bir arka sokak kadar.',
      en: 'One of the four themes I worked on in the photography workshop. The distance between the face a city wants seen and the face that keeps it standing is often no more than a back street.',
    },
    body: {
      tr: [
        'Bir kentin vitrini ile deposu arasındaki mesafe çoğu zaman şaşırtıcı derecede kısadır. Beyoğlu\'nda cephesi restore edilmiş bir binanın arka cephesi, aynı binanın nasıl çalıştığını cepheden çok daha dürüst anlatır.',
        'Atölye boyunca bu arka yüzü aradım: yükleme rampaları, servis merdivenleri, klima üniteleri, kablo demetleri, el arabaları. Hiçbiri tasarlanmamıştı — hepsi zamanla, ihtiyaç oldukça eklenmişti. Yine de aralarında şaşırtıcı bir tutarlılık vardı.',
        'Bu tutarlılığın kaynağı üslup değil, kısıt. Aynı sorunla karşılaşan farklı insanlar, aynı malzemeyle, benzer çözümler üretiyor. Enformel mimarinin dili budur: yazılı olmayan ama herkesin bildiği bir kurallar dizisi.',
      ],
      en: [
        'The distance between a city\'s shop window and its storeroom is often surprisingly short. The rear elevation of a building whose front has been restored in Beyoğlu tells you far more honestly how that building works.',
        'Throughout the workshop I looked for this reverse face: loading ramps, service stairs, air-conditioning units, cable bundles, hand carts. None of it was designed — all of it accrued over time, as need arose. And yet there was a surprising consistency among them.',
        'The source of that consistency is not style but constraint. Different people meeting the same problem, with the same materials, arrive at similar solutions. This is the language of informal architecture: a set of rules that is unwritten yet known to everyone.',
      ],
    },
  },
];

/** Tarihe göre yeniden eskiye sıralı yazılar. */
export function sortedPosts() {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}

export function postBySlug(slug) {
  return posts.find((p) => p.slug === slug);
}

/** Yazı detayında önceki/sonraki gezinme (tarih sırasına göre). */
export function adjacentPosts(slug) {
  const list = sortedPosts();
  const i = list.findIndex((p) => p.slug === slug);
  if (i === -1) return { prev: null, next: null };

  return {
    prev: i > 0 ? list[i - 1] : null,
    next: i < list.length - 1 ? list[i + 1] : null,
  };
}
