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

const clone = (value) => JSON.parse(JSON.stringify(value));

const state = {
  content: null,
  editor: null,        // açık kayıt: { def, kind, key, isNew, path, doc, saved, slugTouched }
  leaving: false,      // hashchange'i biz tetikledik, onay sorma
};

const view = () => document.getElementById('view');

/* ============================================
   BİLDİRİM
   ============================================ */
let toastTimer;

function toast(message, { error = false, sticky = false } = {}) {
  const box = document.getElementById('toast');
  box.textContent = message;
  box.classList.toggle('is-error', error);
  box.hidden = false;

  clearTimeout(toastTimer);
  if (!sticky) toastTimer = setTimeout(() => { box.hidden = true; }, error ? 6000 : 2600);
}

/* ============================================
   GEZİNME
   ============================================ */
function currentPath() {
  return window.location.hash.replace(/^#/, '') || '/projeler';
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

  document.getElementById('nav').innerHTML = items.map((item) => `
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

  const collection = Object.entries(collections).find(([, def]) => def.route === section);
  if (collection) {
    const [key, def] = collection;
    if (!slug) return renderList(key, def);
    return openEntry(key, def, slug);
  }

  const single = Object.entries(singles).find(([, def]) => def.route === section);
  if (single) return openSingle(single[0], single[1]);

  return go('/projeler');
}

/* ============================================
   LİSTE EKRANI
   ============================================ */
function renderList(key, def) {
  const entries = [...entriesOf(key)].sort((a, b) => def.sort(a.data, b.data));

  const rows = entries.map((entry, i) => {
    const doc = entry.data;
    const thumb = def.thumb?.(doc);

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
            <span class="meta">${esc(def.meta(doc))}</span>
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
  };
  renderEditor();
}

function openSingle(key, def) {
  const doc = { ...blankDoc(def.fields), ...clone(state.content[key]) };

  state.editor = {
    def, key, kind: 'single', isNew: false, doc,
    path: def.path,
    saved: JSON.stringify(doc),
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
  const { def, doc, isNew } = state.editor;
  const scroll = window.scrollY;

  document.getElementById('form').innerHTML = renderForm(def.fields, doc, { isNew });
  window.scrollTo(0, scroll);
  updateStatus();
}

function updateStatus() {
  const status = document.getElementById('status');
  if (!status) return;

  const dirty = isDirty();
  status.textContent = dirty ? 'Kaydedilmemiş değişiklik' : (state.editor.isNew ? '' : 'Kayıtlı');
  status.classList.toggle('is-dirty', dirty);
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
    form.querySelector(`[data-path="${path}"]`)?.classList.add('is-invalid');
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

  el.classList.remove('is-invalid');
  updateStatus();
}

function onChange(e) {
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
    getPath(doc, el.dataset.add).push(blankItem(fieldAt(def.fields, el.dataset.add)));
  } else if ((el = hit('[data-remove]'))) {
    getPath(doc, el.dataset.remove).splice(Number(el.dataset.index), 1);
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
}

init().catch((error) => {
  console.error(error);
  view().innerHTML = `<p class="field__error">Panel açılamadı: ${esc(error.message)}</p>`;
});
