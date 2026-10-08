/* ============================================
   YÖNETİM PANELİ — GİRİŞ NOKTASI
   Gezinme, liste ve düzenleme ekranları, kaydetme akışı.
   Alanlar schema.js'te, form üretimi form.js'te, dosyaya yazma
   backend.js'te.
   ============================================ */

import './admin.css';

import { backend } from './backend.js';
import { collections, singles } from './schema.js';
import {
  esc, getPath, setPath, thumbOf, blankDoc, blankItem, fieldAt,
  renderForm, validate, slugify,
} from './form.js';
import { findGaps, countGaps, missingEnglish } from './overview.js';
import { md } from '../markdown.js';

const clone = (value) => JSON.parse(JSON.stringify(value));

const state = {
  content: null,
  editor: null,        // açık kayıt: { def, kind, key, isNew, path, doc, saved, slugTouched, open }
  publish: null,       // yayınlanmamışlar: { changes, ahead }
  leaving: false,      // hashchange'i biz tetikledik, onay sorma
};

const view = () => document.getElementById('view');

/* ============================================
   BİLDİRİM
   ============================================ */
let toastTimer;

let toastAction = null;

function toast(message, { error = false, sticky = false, action = null } = {}) {
  const box = document.getElementById('toast');
  box.innerHTML = `<span>${esc(message)}</span>${action
    ? `<button type="button" class="atoast__action" data-toast-action>${esc(action.label)}</button>` : ''}`;
  box.classList.toggle('is-error', error);
  box.hidden = false;
  toastAction = action;

  clearTimeout(toastTimer);
  if (!sticky) {
    toastTimer = setTimeout(() => { box.hidden = true; }, action ? 8000 : (error ? 6000 : 2600));
  }
}

/* ============================================
   GEZİNME
   ============================================ */
function currentPath() {
  return window.location.hash.replace(/^#/, '') || '/';
}

function go(path) {
  state.leaving = true;
  window.location.hash = path;
}

function isDirty() {
  return Boolean(state.editor) && JSON.stringify(state.editor.doc) !== state.editor.saved;
}

function entriesOf(key) {
  return state.content[key];
}

function renderNav() {
  const path = currentPath();
  const items = [
    ...Object.entries(collections).map(([key, def]) => ({ ...def, count: entriesOf(key).length })),
    ...Object.values(singles),
  ];

  const totals = countGaps(findGaps(state.content));
  const urgent = (totals.hata ?? 0) + (totals['uyarı'] ?? 0);

  document.getElementById('nav').innerHTML = `
    <a href="#/" class="anav__link${path === '/' ? ' is-active' : ''}">
      <span>Genel bakış</span>
      ${urgent ? `<span class="meta anav__alert">${urgent}</span>` : ''}
    </a>
  ` + items.map((item) => `
    <a href="#/${item.route}" class="anav__link${path.startsWith(`/${item.route}`) ? ' is-active' : ''}">
      <span>${esc(item.label)}</span>
      ${item.count != null ? `<span class="meta">${item.count}</span>` : ''}
    </a>
  `).join('');
}

function route() {
  const path = currentPath();
  const [, section, slug] = path.split('/');

  state.editor = null;
  renderNav();

  if (!section) return renderOverview();

  const collection = Object.entries(collections).find(([, def]) => def.route === section);
  if (collection) {
    const [key, def] = collection;
    if (!slug) return renderList(key, def);
    return openEntry(key, def, slug);
  }

  const single = Object.entries(singles).find(([, def]) => def.route === section);
  if (single) return openSingle(single[0], single[1]);

  return go('/');
}

/* ============================================
   GENEL BAKIŞ — içerik eksikleri
   ============================================ */
function renderOverview() {
  const records = findGaps(state.content);
  const totals = countGaps(records);
  const drafts = [...state.content.projects, ...state.content.blog].filter((e) => e.data.draft).length;

  const stat = (value, label) => `
    <div class="cell astat">
      <span class="astat__value">${value}</span>
      <span class="meta">${label}</span>
    </div>`;

  const list = records.map((record) => `
    <a href="${esc(record.href)}" class="agap">
      <div class="agap__head">
        <span class="agap__title">${esc(record.title)}</span>
        <span class="meta">${esc(record.kind)}</span>
      </div>
      <ul class="agap__items" role="list">
        ${record.items.map((item) => `
          <li class="agap__item agap__item--${item.level === 'uyarı' ? 'uyari' : item.level === 'öneri' ? 'oneri' : item.level}">
            <span class="agap__level meta">${item.level}</span>
            <span>${esc(item.text)}</span>
          </li>`).join('')}
      </ul>
    </a>
  `).join('');

  view().innerHTML = `
    <header class="ahead">
      <div>
        <span class="overline">Yönetim</span>
        <h1 class="ahead__title">Genel bakış</h1>
      </div>
    </header>

    <div class="frame frame--4 astats">
      ${stat(state.content.projects.length, 'proje')}
      ${stat(state.content.blog.length, 'yazı')}
      ${stat(state.content.photos.photos?.length ?? 0, 'fotoğraf')}
      ${stat(drafts, 'taslak')}
    </div>

    <section class="asection">
      <div class="asection__head">
        <h2 class="asection__title">Eksikler</h2>
        <span class="meta">
          ${['hata', 'uyarı', 'öneri'].filter((l) => totals[l]).map((l) => `${totals[l]} ${l}`).join(' · ') || 'eksik yok'}
        </span>
      </div>
      <p class="afield__hint">İçerikten kendiliğinden hesaplanır. Bir eksiği giderip kaydedince satır kaybolur.</p>
      <div class="agaps">
        ${list || '<p class="alist__empty meta">Tamamlanacak bir şey görünmüyor.</p>'}
      </div>
    </section>
  `;
}

/* ============================================
   YAYINLAMA
   ============================================ */
async function refreshPublish() {
  try {
    state.publish = await backend.status();
  } catch {
    state.publish = null;
  }
  renderPublish();
}

function renderPublish() {
  const box = document.getElementById('publish');
  if (!box) return;

  const status = state.publish;
  if (!status) {
    box.innerHTML = '';
    return;
  }

  const pending = status.changes.length;
  const waiting = pending || status.ahead;

  box.innerHTML = `
    <p class="apublish__state meta${waiting ? ' is-pending' : ''}">
      ${pending ? `● ${pending} yayınlanmamış değişiklik`
        : status.ahead ? `● ${status.ahead} gönderilmemiş commit`
          : '○ Yayın güncel'}
    </p>
    ${waiting ? '<button type="button" class="abtn abtn--solid apublish__btn" data-publish>Yayınla</button>' : ''}
  `;
}

async function publishNow() {
  if (isDirty()) {
    toast('Önce açık kaydı kaydet.', { error: true });
    return;
  }

  const status = await backend.status();
  const files = status.changes.map((c) => `  ${c.path}`);
  const shown = files.slice(0, 12).join('\n') + (files.length > 12 ? `\n  … ve ${files.length - 12} dosya daha` : '');
  const summary = files.length
    ? `${files.length} dosya yayına gönderilecek:\n\n${shown}`
    : `${status.ahead} gönderilmemiş commit yayına gönderilecek.`;

  if (!window.confirm(`${summary}\n\nSite birkaç dakika içinde güncellenir. Devam edilsin mi?`)) return;

  toast('Yayınlanıyor…', { sticky: true });
  await backend.publish();
  toast('Yayına gönderildi. Site birkaç dakika içinde güncellenir.');
  await refreshPublish();
}

/* ============================================
   LİSTE EKRANI
   ============================================ */
function renderList(key, def) {
  const entries = [...entriesOf(key)].sort((a, b) => def.sort(a.data, b.data));
  const gaps = new Map(findGaps(state.content).map((record) => [
    record.href, record.items.filter((item) => item.level !== 'bilgi').length,
  ]));

  const rows = entries.map((entry, i) => {
    const doc = entry.data;
    const thumb = def.thumb?.(doc);
    const missing = gaps.get(`#/${def.route}/${doc.slug}`) ?? 0;

    return `
      <div class="arow">
        <a href="#/${def.route}/${esc(doc.slug)}" class="arow__main">
          ${def.thumb ? `
            <span class="arow__thumb">
              ${thumb ? `<img src="${esc(thumbOf(thumb))}" alt="" loading="lazy"
                              onerror="this.onerror=null;this.src='${esc(thumb)}'" />` : ''}
            </span>` : ''}
          <span class="arow__text">
            <span class="arow__title">${esc(def.title(doc) || doc.slug)}</span>
            <span class="meta">${esc(def.meta(doc))}${doc.draft ? ' · <b class="arow__draft">Taslak</b>' : ''}${missing ? ` · ${missing} eksik` : ''}</span>
          </span>
        </a>
        <div class="arow__tools">
          ${'featured' in doc ? `
            <button type="button" class="abtn abtn--quiet${doc.featured ? ' is-on' : ''}"
                    data-feature="${esc(entry.path)}"
                    title="Ana sayfada göster / gizle">${doc.featured ? '● Ana sayfada' : '○ Ana sayfada değil'}</button>` : ''}
          ${def.ordered ? `
            <button type="button" class="aicon" data-order="${esc(entry.path)}" data-dir="-1"
                    aria-label="Yukarı taşı"${i === 0 ? ' disabled' : ''}>↑</button>
            <button type="button" class="aicon" data-order="${esc(entry.path)}" data-dir="1"
                    aria-label="Aşağı taşı"${i === entries.length - 1 ? ' disabled' : ''}>↓</button>` : ''}
        </div>
      </div>
    `;
  }).join('');

  view().innerHTML = `
    <header class="ahead">
      <div>
        <span class="overline">Yönetim</span>
        <h1 class="ahead__title">${esc(def.label)}</h1>
      </div>
      <a href="#/${def.route}/yeni" class="abtn abtn--solid">+ Yeni ${esc(def.singular.toLowerCase())}</a>
    </header>
    <div class="arows">
      ${rows || '<p class="alist__empty meta">Henüz kayıt yok.</p>'}
    </div>
    ${def.ordered ? '<p class="afield__hint">Sıra, sitedeki sıradır. Oklarla değiştirince hemen kaydedilir.</p>' : ''}
  `;
}

async function toggleFeatured(path) {
  const entry = entriesOf('projects').find((e) => e.path === path);
  entry.data.featured = !entry.data.featured;
  await backend.save(entry.path, entry.data);
  toast(entry.data.featured ? 'Ana sayfaya eklendi.' : 'Ana sayfadan kaldırıldı.');
  route();
  refreshPublish();
}

async function moveEntry(key, def, path, dir) {
  const sorted = [...entriesOf(key)].sort((a, b) => def.sort(a.data, b.data));
  const i = sorted.findIndex((e) => e.path === path);
  const other = sorted[i + dir];
  if (!other) return;

  // Sırayı baştan numarala: aynı değerli ya da eksik kayıtlar da düzelir
  [sorted[i], sorted[i + dir]] = [sorted[i + dir], sorted[i]];
  const changed = [];
  sorted.forEach((entry, n) => {
    const order = (n + 1) * 10;
    if (entry.data.order !== order) {
      entry.data.order = order;
      changed.push(entry);
    }
  });

  await Promise.all(changed.map((entry) => backend.save(entry.path, entry.data)));
  toast('Sıra kaydedildi.');
  route();
  refreshPublish();
}

/* ============================================
   DÜZENLEME EKRANI
   ============================================ */
function openEntry(key, def, slug) {
  const isNew = slug === 'yeni';
  const entry = isNew ? null : entriesOf(key).find((e) => e.data.slug === slug);

  if (!isNew && !entry) {
    view().innerHTML = `
      <header class="ahead"><h1 class="ahead__title">Kayıt bulunamadı</h1></header>
      <a href="#/${def.route}" class="abtn">← ${esc(def.label)}</a>`;
    return;
  }

  const doc = isNew
    ? { ...blankDoc(def.fields), ...def.defaults(entriesOf(key).map((e) => e.data)) }
    : { ...blankDoc(def.fields), ...clone(entry.data) };

  state.editor = {
    def, key, kind: 'collection', isNew, doc,
    path: entry?.path ?? null,
    // Yeni kayıt boş haliyle "kayıtlı" sayılır: dokunmadan çıkınca sormaz
    saved: JSON.stringify(doc),
    slugTouched: false,
    open: new Set(),
  };
  renderEditor();
}

function openSingle(key, def) {
  const doc = { ...blankDoc(def.fields), ...clone(state.content[key]) };

  state.editor = {
    def, key, kind: 'single', isNew: false, doc,
    path: def.path,
    saved: JSON.stringify(doc),
    // Açılır-kapanır formda ilk bölüm açık başlar
    open: new Set(def.collapsible ? [def.fields[0].name] : []),
  };
  renderEditor();
}

function renderEditor() {
  const { def, kind, isNew, doc } = state.editor;
  const title = kind === 'single'
    ? def.label
    : (isNew ? `Yeni ${def.singular.toLowerCase()}` : def.title(doc) || doc.slug);

  view().innerHTML = `
    <div class="abar">
      <div class="abar__left">
        ${kind === 'collection' ? `<a href="#/${def.route}" class="meta abar__back">← ${esc(def.label)}</a>` : ''}
        <span class="abar__title">${esc(title)}</span>
        <span class="abar__status meta" id="status"></span>
      </div>
      <div class="abar__right">
        <button type="button" class="abtn abtn--quiet" data-translate-all
                title="İngilizcesi boş olan bütün alanları Türkçeden çevirir">İngilizceleri çevir</button>
        ${!isNew ? `<a href="${esc(def.siteUrl(doc))}" target="_blank" rel="noopener" class="abtn abtn--quiet">Sitede gör ↗</a>` : ''}
        ${kind === 'collection' && !isNew ? '<button type="button" class="abtn abtn--danger" data-delete>Sil</button>' : ''}
        <button type="button" class="abtn abtn--solid" data-save>Kaydet</button>
      </div>
    </div>
    <form class="aform" id="form" novalidate autocomplete="off"></form>
  `;

  renderFormBody();
}

/** Formu belgeden yeniden çizer (liste ekleme/silme, görsel yükleme sonrası). */
function renderFormBody() {
  const { def, doc, isNew, open } = state.editor;
  const scroll = window.scrollY;

  document.getElementById('form').innerHTML = renderForm(def.fields, doc, {
    isNew, open, collapsible: def.collapsible,
  });
  window.scrollTo(0, scroll);
  updateStatus();
}

function updateStatus() {
  const status = document.getElementById('status');
  if (!status) return;

  const dirty = isDirty();
  status.textContent = dirty ? 'Kaydedilmemiş değişiklik' : (state.editor.isNew ? '' : 'Kayıtlı');
  status.classList.toggle('is-dirty', dirty);
  document.title = `${dirty ? '● ' : ''}Yönetim — Görkem Sırmalı`;
}

function showErrors(errors) {
  const form = document.getElementById('form');
  form.querySelectorAll('[data-error]').forEach((box) => { box.hidden = true; });
  form.querySelectorAll('.is-invalid').forEach((el) => el.classList.remove('is-invalid'));

  for (const { path, message } of errors) {
    // Görsel alanlarında girdi yok; hata kutusu alanın kendi yolundadır
    const fieldPath = form.querySelector(`[data-error="${path}"]`) ? path : path.replace(/\.(tr|en)$/, '');
    const box = form.querySelector(`[data-error="${fieldPath}"]`);
    if (box) {
      box.textContent = message;
      box.hidden = false;
    }
    const input = form.querySelector(`[data-path="${path}"]`);
    input?.classList.add('is-invalid');

    // Hata kapalı bir bölümdeyse bölümü aç
    const fold = (input ?? box)?.closest('details');
    if (fold && !fold.open) {
      fold.open = true;
      state.editor.open.add(fold.dataset.section);
    }
  }

  const first = errors[0];
  if (!first) return;
  const target = form.querySelector(`[data-path="${first.path}"]`)
    ?? form.querySelector(`[data-field="${first.path}"]`);
  target?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  target?.focus?.({ preventScroll: true });
}

async function save() {
  const editor = state.editor;
  const { def, doc, kind, key } = editor;

  def.normalize?.(doc);

  const errors = validate(def.fields, doc);
  if (kind === 'collection' && editor.isNew && doc.slug
      && entriesOf(key).some((e) => e.data.slug === doc.slug)) {
    errors.unshift({ path: 'slug', message: 'Bu adres başka bir kayıtta kullanılıyor.' });
  }

  showErrors(errors);
  if (errors.length) {
    toast(`${errors.length} alan düzeltilmeli.`, { error: true });
    return;
  }

  const path = kind === 'single' ? def.path : (editor.path ?? `${def.dir}/${doc.slug}.json`);
  const data = clone(doc);

  await backend.save(path, data);

  if (kind === 'single') {
    state.content[key] = data;
  } else if (editor.isNew) {
    entriesOf(key).push({ path, data });
  } else {
    entriesOf(key).find((e) => e.path === path).data = data;
  }

  editor.saved = JSON.stringify(doc);
  toast('Kaydedildi.');
  refreshPublish();

  if (editor.isNew) {
    go(`/${def.route}/${doc.slug}`);
  } else {
    updateStatus();
    renderNav();
  }
}

async function removeEntry() {
  const { def, key, path, doc } = state.editor;
  const name = def.title(doc) || doc.slug;
  if (!window.confirm(`"${name}" silinsin mi?\n\nKayıt silinir; yüklenmiş görseller diskte kalır.`)) return;

  await backend.remove(path);
  state.content[key] = entriesOf(key).filter((e) => e.path !== path);
  state.editor.saved = JSON.stringify(state.editor.doc);
  toast('Silindi.');
  refreshPublish();
  go(`/${def.route}`);
}

/* --- Yükleme --- */

/** Yükleme klasörü kaydın adresine bağlı; adres yoksa yüklemeyi durdurur. */
function uploadDir() {
  const { def, doc, kind } = state.editor;
  if (kind === 'collection' && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(doc.slug ?? '')) {
    toast('Önce başlığı yaz: görseller kaydın adresiyle adlandırılan klasöre gider.', { error: true });
    return null;
  }
  return def.uploadDir(doc);
}

async function uploadSingle(path, file) {
  const dir = uploadDir();
  if (!dir || !file) return;

  toast(`Yükleniyor: ${file.name}`, { sticky: true });
  setPath(state.editor.doc, path, await backend.upload(dir, file));
  toast('Yüklendi.');
  renderFormBody();
}

async function uploadBulk(path, files) {
  const dir = uploadDir();
  if (!dir || !files.length) return;

  const { def, doc } = state.editor;
  const field = fieldAt(def.fields, path);
  const list = getPath(doc, path);

  for (const [i, file] of files.entries()) {
    toast(`Yükleniyor ${i + 1} / ${files.length}: ${file.name}`, { sticky: true });
    const item = blankItem(field);
    item[field.bulk] = await backend.upload(dir, file);
    list.push(item);
    renderFormBody();
  }
  toast(`${files.length} görsel yüklendi. Kaydetmeyi unutma.`);
  refreshPublish();
}

/* --- Çeviri --- */

/** Tek alan: Türkçe kutudaki metni çevirip İngilizce kutuya yazar. */
async function translateField(path) {
  const { doc } = state.editor;
  const source = String(getPath(doc, `${path}.tr`) ?? '').trim();
  if (!source) {
    toast('Önce Türkçe metni yaz.', { error: true });
    return;
  }

  const current = String(getPath(doc, `${path}.en`) ?? '').trim();
  if (current && !window.confirm('İngilizce kutusu dolu. Üzerine yazılsın mı?')) return;

  toast('Çevriliyor…', { sticky: true });
  const [result] = await backend.translate([source]);
  setPath(doc, `${path}.en`, result);

  const input = document.querySelector(`[data-path="${path}.en"]`);
  if (input) input.value = result;
  updateStatus();
  toast('Çevrildi. Özel adları ve terimleri gözden geçir.');
}

/** Kayıttaki İngilizcesi boş bütün alanları çevirir; dolu olanlara dokunmaz. */
async function translateMissing() {
  const { def, doc } = state.editor;
  const missing = missingEnglish(def.fields, doc);
  if (!missing.length) {
    toast('İngilizcesi boş alan yok.');
    return;
  }

  toast(`${missing.length} alan çevriliyor…`, { sticky: true });
  const results = await backend.translate(missing.map((f) => f.tr));
  missing.forEach((field, i) => setPath(doc, `${field.path}.en`, results[i]));

  renderFormBody();
  toast(`${missing.length} alan çevrildi. Kaydetmeden önce gözden geçir.`);
}

function togglePreview(path) {
  const box = document.querySelector(`[data-preview-for="${path}"]`);
  if (!box) return;

  box.hidden = !box.hidden;
  if (!box.hidden) box.innerHTML = md(getPath(state.editor.doc, path));
}

/* ============================================
   OLAYLAR
   ============================================ */
/** Hata yakalayıp bildirim olarak gösterir. */
function guarded(task) {
  return Promise.resolve().then(task).catch((error) => {
    console.error(error);
    toast(error.message || 'Beklenmeyen bir hata oluştu.', { error: true });
  });
}

function onInput(e) {
  const el = e.target.closest('[data-path]');
  if (!el || !state.editor) return;

  const { doc } = state.editor;
  const path = el.dataset.path;
  let value = el.value;

  if (el.dataset.kind === 'boolean') value = el.checked;
  else if (el.dataset.kind === 'number') value = el.value === '' ? null : Number(el.value);

  setPath(doc, path, value);

  // Yeni kayıtta adres başlıktan üretilir — elle dokunulana kadar
  const editor = state.editor;
  if (editor.kind === 'collection' && editor.isNew) {
    if (path === 'slug') {
      editor.slugTouched = true;
    } else if (path === 'title.tr' && !editor.slugTouched) {
      doc.slug = slugify(value);
      const slugInput = document.querySelector('[data-path="slug"]');
      if (slugInput) slugInput.value = doc.slug;
    }
  }

  const preview = document.querySelector(`[data-preview-for="${path}"]`);
  if (preview && !preview.hidden) preview.innerHTML = md(value);

  el.classList.remove('is-invalid');
  updateStatus();
}

function onChange(e) {
  const input = e.target.closest('[data-path]');
  if (input && state.editor) {
    const field = fieldAt(state.editor.def.fields, input.dataset.path.replace(/\.(tr|en)$/, ''));
    if (field?.refresh) renderFormBody();
  }

  const single = e.target.closest('[data-upload]');
  if (single) {
    const file = single.files[0];
    guarded(() => uploadSingle(single.dataset.upload, file));
    return;
  }

  const bulk = e.target.closest('[data-bulk]');
  if (bulk) {
    const files = [...bulk.files];
    guarded(() => uploadBulk(bulk.dataset.bulk, files));
  }
}

function onClick(e) {
  const hit = (selector) => e.target.closest(selector);
  let el;

  if (hit('[data-save]')) return guarded(save);
  if (hit('[data-delete]')) return guarded(removeEntry);
  if (hit('[data-publish]')) return guarded(publishNow);
  if (hit('[data-translate-all]')) return guarded(translateMissing);

  if ((el = hit('[data-translate]'))) {
    const path = el.dataset.translate;
    return guarded(() => translateField(path));
  }

  if ((el = hit('[data-preview]'))) return togglePreview(el.dataset.preview);

  if ((el = hit('[data-feature]'))) {
    const path = el.dataset.feature;
    return guarded(() => toggleFeatured(path));
  }

  if ((el = hit('[data-order]'))) {
    const section = currentPath().split('/')[1];
    const [key, def] = Object.entries(collections).find(([, d]) => d.route === section);
    const { order, dir } = el.dataset;
    return guarded(() => moveEntry(key, def, order, Number(dir)));
  }

  if (!state.editor) return undefined;
  const { def, doc } = state.editor;

  if ((el = hit('[data-add]'))) {
    const path = el.dataset.add;
    getPath(doc, path).push(blankItem(fieldAt(def.fields, path)));
    renderFormBody();
    // Yeni satırın ilk kutusuna geç
    const rows = document.querySelectorAll(`[data-add="${path}"]`)[0]
      ?.closest('.alist')?.querySelectorAll(':scope > .alist__row');
    rows?.[rows.length - 1]?.querySelector('input:not([type=file]), textarea, select')?.focus();
    return undefined;
  } else if ((el = hit('[data-remove]'))) {
    const path = el.dataset.remove;
    const index = Number(el.dataset.index);
    const [removed] = getPath(doc, path).splice(index, 1);
    const editor = state.editor;
    renderFormBody();
    toast('Satır silindi.', {
      action: {
        label: 'Geri al',
        run: () => {
          if (state.editor !== editor) return;
          getPath(doc, path).splice(index, 0, removed);
          renderFormBody();
        },
      },
    });
    return undefined;
  } else if ((el = hit('[data-move]'))) {
    const list = getPath(doc, el.dataset.move);
    const i = Number(el.dataset.index);
    const j = i + Number(el.dataset.dir);
    if (j < 0 || j >= list.length) return undefined;
    [list[i], list[j]] = [list[j], list[i]];
  } else if ((el = hit('[data-clear]'))) {
    setPath(doc, el.dataset.clear, '');
  } else if ((el = hit('[data-cover]'))) {
    doc.cover = getPath(doc, el.dataset.cover);
  } else {
    return undefined;
  }

  renderFormBody();
  return undefined;
}

/* ============================================
   BAŞLAT
   ============================================ */
function offlineScreen() {
  document.getElementById('nav').innerHTML = '';
  view().innerHTML = `
    <header class="ahead">
      <div>
        <span class="overline">Yönetim</span>
        <h1 class="ahead__title">Panel şu an yalnız bilgisayarında çalışıyor</h1>
      </div>
    </header>
    <div class="aoffline prose">
      <p>Yayındaki siteden düzenleme henüz kurulmadı. İçeriği değiştirmek için:</p>
      <ul>
        <li>Proje klasöründe <code>npm run dev</code> çalıştır.</li>
        <li>Tarayıcıda <code>http://localhost:5173/admin/</code> adresini aç.</li>
        <li>Değişiklikleri kaydet, ardından commit edip gönder; site kendiliğinden güncellenir.</li>
      </ul>
    </div>
  `;
}

async function init() {
  document.documentElement.setAttribute('data-theme', localStorage.getItem('theme') || 'light');

  if (!await backend.available()) {
    offlineScreen();
    return;
  }

  // İçerik ya da görsel kaydedilince geliştirme sunucusu açık sayfaları
  // yeniler. Site için doğru; panel yenilenirse yarım kalan form
  // kaybolur. Vite'ta yenilemeyi iptal etmenin tek yolu bu dinleyicide
  // hata fırlatmak. Panelin kendi kodu değişince yenileme sürer.
  if (import.meta.hot) {
    import.meta.hot.on('vite:beforeFullReload', (payload) => {
      const file = String(payload.triggeredBy ?? '').replace(/\\/g, '/');
      if (/\/(content|public)\/|\/src\/data\//.test(file)) {
        throw new Error('(panel: içerik değişti, sayfa yenilenmedi)');
      }
    });
  }

  state.content = await backend.load();

  const app = document.getElementById('admin');
  app.addEventListener('input', onInput);
  app.addEventListener('change', onChange);
  app.addEventListener('click', onClick);
  app.addEventListener('submit', (e) => e.preventDefault());

  document.getElementById('toast').addEventListener('click', (e) => {
    if (!e.target.closest('[data-toast-action]')) return;
    const action = toastAction;
    document.getElementById('toast').hidden = true;
    action?.run();
  });

  // Bölüm aç/kapa durumu, form yeniden çizilince kaybolmasın
  // (toggle olayı yukarı çıkmaz; yakalama aşamasında dinlenir)
  app.addEventListener('toggle', (e) => {
    const section = e.target.dataset?.section;
    if (!section || !state.editor) return;
    if (e.target.open) state.editor.open.add(section);
    else state.editor.open.delete(section);
  }, true);

  // Dosyaları görsel listesine sürükleyip bırakma
  const dropTarget = (e) => (e.dataTransfer?.types?.includes('Files')
    ? e.target.closest?.('[data-drop]') : null);

  app.addEventListener('dragover', (e) => {
    if (!e.dataTransfer?.types?.includes('Files')) return;
    e.preventDefault();   // yoksa tarayıcı dosyayı açıp panelden çıkar
    document.querySelectorAll('.is-dropping').forEach((el) => el.classList.remove('is-dropping'));
    dropTarget(e)?.classList.add('is-dropping');
  });

  app.addEventListener('dragleave', (e) => {
    if (!e.relatedTarget) {
      document.querySelectorAll('.is-dropping').forEach((el) => el.classList.remove('is-dropping'));
    }
  });

  app.addEventListener('drop', (e) => {
    if (!e.dataTransfer?.types?.includes('Files')) return;
    e.preventDefault();
    document.querySelectorAll('.is-dropping').forEach((el) => el.classList.remove('is-dropping'));

    const target = dropTarget(e);
    if (!target) return;
    const files = [...e.dataTransfer.files].filter((f) => /^image\/(jpeg|png|webp)$/.test(f.type));
    if (files.length) guarded(() => uploadBulk(target.dataset.drop, files));
    else toast('Yalnız .jpg, .png ve .webp bırakılabilir.', { error: true });
  });

  // Ctrl/Cmd+S ile kaydet
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's' && state.editor) {
      e.preventDefault();
      guarded(save);
    }
  });

  let lastHash = window.location.hash;
  window.addEventListener('hashchange', () => {
    if (!state.leaving && isDirty()
        && !window.confirm('Kaydedilmemiş değişiklikler var. Çıkılsın mı?')) {
      // Vazgeçildi: adresi geri al, ekranı yeniden çizme
      state.leaving = true;
      window.location.hash = lastHash;
      return;
    }
    const restoring = state.leaving && window.location.hash === lastHash;
    state.leaving = false;
    lastHash = window.location.hash;
    if (!restoring) route();
  });

  window.addEventListener('beforeunload', (e) => {
    if (isDirty()) e.preventDefault();
  });

  route();
  refreshPublish();
}

init().catch((error) => {
  console.error(error);
  view().innerHTML = `<p class="field__error">Panel açılamadı: ${esc(error.message)}</p>`;
});
