/* ============================================
   YÖNETİM PANELİ — ALAN TANIMLARI

   Panelin bütün formları buradan üretilir. Yeni bir alan eklemek
   için ilgili listeye bir satır yazmak yeterli; form, doğrulama
   ve kayıt kendiliğinden gelir. (Sitede göstermek için ayrıca
   src/pages altındaki sayfada kullanmak gerekir.)

   Alan türleri (type):
     string | text | markdown | number | boolean | select | date
     image  | file | list | object
   Seçenekler:
     i18n: true        → Türkçe ve İngilizce iki kutu ({ tr, en })
     required: false   → boş bırakılabilir (i18n'de İngilizce hep serbest)
     hint              → alanın altındaki açıklama
     lockOnEdit: true  → yalnız ilk oluştururken yazılır
   ============================================ */

import { categories, blogCategories } from '../data/categories.js';

const options = (list) => list
  .filter((c) => c.id !== 'all')
  .map((c) => ({ value: c.id, label: c.name.tr }));

const slugField = {
  name: 'slug',
  label: 'Adres',
  type: 'string',
  lockOnEdit: true,
  pattern: /^[a-z0-9]+(-[a-z0-9]+)*$/,
  patternMessage: 'Yalnız küçük harf, rakam ve tire kullan.',
  hint: 'Sayfanın adresi. Başlıktan kendiliğinden üretilir; kaydettikten sonra değişmez.',
};

const caption = (label = 'Başlık') => ({
  name: 'caption', label, type: 'string', i18n: true, required: false,
});

const today = () => new Date().toISOString().slice(0, 10);

export const collections = {
  projects: {
    route: 'projeler',
    label: 'Projeler',
    singular: 'Proje',
    dir: 'content/projects',
    siteUrl: (doc) => `/#/projeler/${doc.slug}`,
    uploadDir: (doc) => `images/projects/${doc.slug}`,
    title: (doc) => doc.title?.tr,
    meta: (doc) => `${doc.year ?? '—'} · ${options(categories).find((o) => o.value === doc.category)?.label ?? doc.category}`,
    thumb: (doc) => doc.cover || doc.images?.[0]?.image,
    sort: (a, b) => (a.order ?? 0) - (b.order ?? 0),
    ordered: true,
    defaults: (all) => ({
      order: Math.max(0, ...all.map((d) => d.order ?? 0)) + 10,
      year: new Date().getFullYear(),
      category: 'mimari',
      art: 'plan',
    }),
    fields: [
      { name: 'title', label: 'Başlık', type: 'string', i18n: true },
      slugField,
      { name: 'summary', label: 'Özet', type: 'text', i18n: true, hint: 'Bir-iki cümle; başlığın altında ve katalogda görünür.' },
      {
        name: 'details', label: 'Künye', type: 'group',
        fields: [
          { name: 'category', label: 'Kategori', type: 'select', options: options(categories) },
          { name: 'year', label: 'Yıl', type: 'number' },
          { name: 'location', label: 'Konum', type: 'string', i18n: true },
          { name: 'course', label: 'Ders', type: 'string', i18n: true },
          { name: 'team', label: 'Ekip', type: 'string', required: false, hint: 'Grup çalışmasıysa diğer isimler, virgülle. Tek başına yaptıysan boş bırak.' },
          { name: 'video', label: 'Video adresi', type: 'string', required: false },
          { name: 'featured', label: 'Ana sayfada göster', type: 'boolean' },
        ],
      },
      {
        name: 'cover', label: 'Kapak görseli', type: 'image', required: false,
        hint: 'Kartlarda görünür. Aşağıdaki görsellerden birinde "Kapak yap"a basabilir ya da ayrı bir görsel yükleyebilirsin. Boşsa ilk görsel kullanılır.',
      },
      {
        name: 'images', label: 'Görseller', type: 'list', addLabel: 'Boş satır ekle',
        bulk: 'image', coverAction: true,
        hint: 'Birden çok dosyayı birlikte seçebilirsin; her biri kendiliğinden üç boyuta çevrilir.',
        item: { fields: [{ name: 'image', label: 'Görsel', type: 'image' }, caption()] },
      },
      { name: 'description', label: 'Açıklama', type: 'markdown', i18n: true },
      {
        name: 'art', label: 'Yedek çizim', type: 'select', required: false,
        hint: 'Hiç görsel yokken kartta görünen çizgisel çizim.',
        options: [
          { value: 'plan', label: 'Plan' },
          { value: 'section', label: 'Kesit' },
          { value: 'facade', label: 'Cephe' },
        ],
      },
    ],
  },

  blog: {
    route: 'blog',
    label: 'Blog',
    singular: 'Yazı',
    dir: 'content/blog',
    siteUrl: (doc) => `/#/blog/${doc.slug}`,
    uploadDir: (doc) => `images/blog/${doc.slug}`,
    title: (doc) => doc.title?.tr,
    meta: (doc) => `${doc.date ?? '—'} · ${options(blogCategories).find((o) => o.value === doc.category)?.label ?? doc.category}`,
    sort: (a, b) => String(b.date).localeCompare(String(a.date)),
    defaults: () => ({ date: today(), category: 'not' }),
    fields: [
      { name: 'title', label: 'Başlık', type: 'string', i18n: true },
      slugField,
      {
        name: 'details', label: 'Künye', type: 'group',
        fields: [
          { name: 'category', label: 'Kategori', type: 'select', options: options(blogCategories) },
          { name: 'date', label: 'Tarih', type: 'date' },
        ],
      },
      { name: 'excerpt', label: 'Özet', type: 'text', i18n: true, hint: 'Yazı listesinde görünen bir-iki cümle.' },
      {
        name: 'body', label: 'Metin', type: 'markdown', i18n: true,
        hint: 'Okuma süresi kendiliğinden hesaplanır. İngilizce boşsa Türkçe metin gösterilir.',
      },
    ],
  },
};

export const singles = {
  photos: {
    route: 'fotograflar',
    label: 'Fotoğraflar',
    path: 'content/photos.json',
    siteUrl: () => '/#/fotograflar',
    uploadDir: () => 'images/photos',
    fields: [
      {
        name: 'photos', label: 'Fotoğraflar', type: 'list', addLabel: 'Boş satır ekle', bulk: 'image',
        hint: 'Sıra sitedeki sıradır. Yatay / dikey oranı kendiliğinden bulunur.',
        item: { fields: [{ name: 'image', label: 'Fotoğraf', type: 'image' }, caption('Başlık (yer, yıl)')] },
      },
    ],
  },

  personal: {
    route: 'kisisel',
    label: 'Kişisel',
    path: 'content/personal.json',
    siteUrl: () => '/#/hakkimda',
    uploadDir: () => 'cv',
    fields: [
      {
        name: 'profile', label: 'Profil', type: 'object',
        fields: [
          { name: 'name', label: 'Ad Soyad', type: 'string' },
          { name: 'title', label: 'Unvan', type: 'string', i18n: true },
          { name: 'location', label: 'Konum', type: 'string', i18n: true },
          { name: 'intro', label: 'Kısa tanıtım', type: 'text', i18n: true, hint: 'Hakkımda sayfasının solundaki iki-üç cümle.' },
          { name: 'bio', label: 'Biyografi', type: 'markdown', i18n: true },
        ],
      },
      {
        name: 'contact', label: 'İletişim', type: 'object',
        fields: [
          { name: 'email', label: 'E-posta', type: 'string' },
          { name: 'phone', label: 'Telefon', type: 'string', required: false, hint: 'Sitede gösterilmez.' },
          {
            name: 'social', label: 'Sosyal hesaplar', type: 'list', addLabel: 'Hesap ekle',
            hint: 'Adresi boş bırakılan hesap sitede görünmez.',
            item: {
              fields: [
                {
                  name: 'id', label: 'Simge', type: 'select',
                  options: ['linkedin', 'instagram', 'github'].map((v) => ({ value: v, label: v })),
                },
                { name: 'label', label: 'Ad', type: 'string' },
                { name: 'url', label: 'Adres', type: 'string', required: false },
              ],
            },
          },
        ],
      },
      {
        name: 'cvFiles', label: 'CV dosyaları', type: 'object',
        fields: [
          { name: 'tr', label: 'Türkçe PDF', type: 'file', required: false },
          { name: 'en', label: 'İngilizce PDF', type: 'file', required: false, hint: 'Boşken sitede "hazırlanıyor" notu görünür.' },
        ],
      },
      {
        name: 'education', label: 'Eğitim', type: 'list', addLabel: 'Okul ekle',
        item: {
          fields: [
            { name: 'institution', label: 'Kurum', type: 'string', i18n: true },
            { name: 'program', label: 'Bölüm', type: 'string', i18n: true },
            { name: 'start', label: 'Başlangıç yılı', type: 'number' },
            { name: 'end', label: 'Bitiş yılı', type: 'number', required: false, hint: 'Sürüyorsa boş bırak.' },
          ],
        },
      },
      {
        name: 'experience', label: 'Deneyim', type: 'list', addLabel: 'Deneyim ekle',
        item: {
          fields: [
            { name: 'org', label: 'Kurum', type: 'string', i18n: true },
            { name: 'role', label: 'Görev', type: 'string', i18n: true },
            { name: 'project', label: 'Proje', type: 'string', i18n: true, required: false },
            { name: 'period', label: 'Dönem', type: 'string', i18n: true },
            { name: 'year', label: 'Yıl', type: 'number' },
            { name: 'description', label: 'Açıklama', type: 'text', i18n: true },
          ],
        },
      },
      {
        name: 'involvement', label: 'Projeler, araştırmalar, gönüllü çalışmalar', type: 'list', addLabel: 'Çalışma ekle',
        item: {
          fields: [
            { name: 'title', label: 'Başlık', type: 'string', i18n: true },
            { name: 'org', label: 'Kurum / kişiler', type: 'string', i18n: true, required: false },
            { name: 'year', label: 'Yıl', type: 'number' },
            { name: 'description', label: 'Açıklama', type: 'text', i18n: true },
          ],
        },
      },
      {
        name: 'leadership', label: 'Liderlik', type: 'list', addLabel: 'Görev ekle',
        item: {
          fields: [
            { name: 'title', label: 'Başlık', type: 'string', i18n: true },
            { name: 'note', label: 'Not', type: 'string', i18n: true, required: false },
          ],
        },
      },
      {
        name: 'coursework', label: 'Dersler', type: 'object',
        fields: [
          { name: 'summary', label: 'Özet', type: 'text', i18n: true },
          { name: 'note', label: 'Not', type: 'text', i18n: true, required: false },
        ],
      },
      {
        name: 'software', label: 'Yazılımlar', type: 'list', addLabel: 'Yazılım ekle',
        hint: 'Seviye eklemek istersen yanına yaz: Revit (ileri)',
        item: { type: 'string' },
      },
      {
        name: 'languages', label: 'Diller', type: 'list', addLabel: 'Dil ekle',
        item: {
          fields: [
            { name: 'name', label: 'Dil', type: 'string', i18n: true },
            { name: 'level', label: 'Seviye', type: 'string', i18n: true },
          ],
        },
      },
      {
        name: 'competencies', label: 'Yetkinlikler', type: 'list', addLabel: 'Yetkinlik ekle',
        item: { type: 'string', i18n: true },
      },
    ],
  },
};
