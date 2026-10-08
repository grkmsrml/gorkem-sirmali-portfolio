/* ============================================
   YÖNETİM PANELİ — İÇERİK EKSİKLERİ
   İçeriği tarar ve tamamlanması gerekenleri listeler: boş zorunlu
   alan, İngilizcesi olmayan metin, başlıksız görsel, eksik dosya.
   Liste her açılışta yeniden hesaplanır; elle tutulan bir yapılacaklar
   listesi değildir, eksik giderilince satır kendiliğinden kaybolur.

   Önem sırası:  hata (sitede bozuk görünür)
                 uyarı (ziyaretçi fark eder)
                 öneri (daha iyi olur)
   ============================================ */

import { collections, singles } from './schema.js';
import { validate, i18nPaths } from './form.js';

const LEVELS = { hata: 0, uyarı: 1, öneri: 2, bilgi: 3 };

/** İngilizcesi yazılmamış alanlar (Türkçesi dolu, İngilizcesi boş). */
export function missingEnglish(fields, doc) {
  return i18nPaths(fields, doc).filter((f) => f.tr && !f.en);
}

function common(def, doc) {
  const items = [];

  for (const error of validate(def.fields, doc)) {
    items.push({ level: 'hata', text: error.message });
  }

  const english = missingEnglish(def.fields, doc);
  if (english.length) {
    const labels = [...new Set(english.map((f) => f.label))].slice(0, 4).join(', ');
    items.push({
      level: 'uyarı',
      text: `${english.length} alanın İngilizcesi yok (${labels}${english.length > 4 ? '…' : ''}). Kayıtta "İngilizceleri çevir" ile doldurabilirsin.`,
    });
  }

  if (doc.draft) items.push({ level: 'bilgi', text: 'Taslak: yayındaki sitede görünmüyor.' });
  return items;
}

function projectGaps(doc) {
  const items = [];
  const images = doc.images ?? [];
  const uncaptioned = images.filter((img) => !img.caption?.tr).length;
  const length = String(doc.description?.tr ?? '').length;

  if (!images.length) items.push({ level: 'uyarı', text: 'Hiç görsel yok.' });
  if (uncaptioned) items.push({ level: 'öneri', text: `${uncaptioned} görselin başlığı yok.` });
  if (images.length && !doc.cover) {
    items.push({ level: 'öneri', text: 'Kapak seçilmemiş; kartlarda ilk görsel kullanılıyor.' });
  }
  if (length && length < 400) {
    items.push({ level: 'öneri', text: `Açıklama kısa (${length} karakter). Süreç ve kararlar eklenebilir.` });
  }
  return items;
}

function photoGaps(doc) {
  const uncaptioned = (doc.photos ?? []).filter((p) => !p.caption?.tr).length;
  return uncaptioned
    ? [{ level: 'öneri', text: `${uncaptioned} fotoğrafın başlığı yok (yer, yıl).` }]
    : [];
}

function personalGaps(doc) {
  const items = [];
  if (!doc.cvFiles?.en) {
    items.push({ level: 'uyarı', text: 'İngilizce CV PDF\'i yok; sitede "hazırlanıyor" notu görünüyor.' });
  }
  if (!doc.cvFiles?.tr) items.push({ level: 'uyarı', text: 'Türkçe CV PDF\'i yok.' });

  const hidden = (doc.contact?.social ?? []).filter((s) => !s.url).map((s) => s.label);
  if (hidden.length) {
    items.push({ level: 'bilgi', text: `Adresi boş, sitede gizli: ${hidden.join(', ')}.` });
  }
  return items;
}

/**
 * Tüm içeriği tarar.
 * @returns {{title: string, kind: string, href: string, items: {level, text}[]}[]}
 *          en önemli eksiği olan kayıt en üstte
 */
export function findGaps(content) {
  const records = [];
  const push = (title, kind, href, items) => {
    if (!items.length) return;
    items.sort((a, b) => LEVELS[a.level] - LEVELS[b.level]);
    records.push({ title, kind, href, items });
  };

  for (const entry of content.projects) {
    const def = collections.projects;
    push(def.title(entry.data) || entry.data.slug, def.singular, `#/${def.route}/${entry.data.slug}`,
      [...common(def, entry.data), ...projectGaps(entry.data)]);
  }

  for (const entry of content.blog) {
    const def = collections.blog;
    push(def.title(entry.data) || entry.data.slug, def.singular, `#/${def.route}/${entry.data.slug}`,
      common(def, entry.data));
  }

  push(singles.photos.label, 'Sayfa', `#/${singles.photos.route}`,
    [...common(singles.photos, content.photos), ...photoGaps(content.photos)]);

  push(singles.personal.label, 'Sayfa', `#/${singles.personal.route}`,
    [...common(singles.personal, content.personal), ...personalGaps(content.personal)]);

  return records.sort((a, b) => LEVELS[a.items[0].level] - LEVELS[b.items[0].level]);
}

/** Seviye başına toplam: { hata: 2, uyarı: 5, ... } */
export function countGaps(records) {
  const totals = {};
  for (const record of records) {
    for (const item of record.items) totals[item.level] = (totals[item.level] ?? 0) + 1;
  }
  return totals;
}
