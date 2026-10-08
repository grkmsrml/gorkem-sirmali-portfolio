/* ============================================
   YÖNETİM PANELİ — FORM ÜRETİCİ
   schema.js'teki alan tanımlarından form HTML'i üretir, boş
   kayıt oluşturur ve doğrular. Her girdi, belgedeki yerini
   data-path ile taşır (ör. "images.3.caption.tr"); değerleri
   belgeye yazan dinleyiciler main.js'tedir.
   ============================================ */

export const esc = (value) => String(value ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function getPath(obj, path) {
  return path.split('.').reduce((o, key) => (o == null ? undefined : o[key]), obj);
}

export function setPath(obj, path, value) {
  const keys = path.split('.');
  const last = keys.pop();
  let target = obj;
  for (const key of keys) {
    if (target[key] == null) target[key] = {};
    target = target[key];
  }
  target[last] = value;
}

/** Küçük görsel adresi; -thumb sürümü yoksa <img onerror> ana dosyaya düşer. */
export function thumbOf(src) {
  return /\/cover\.webp$/.test(src) ? src : src.replace(/\.webp$/i, '-thumb.webp');
}

/* --- Boş değerler --- */

export function blank(field) {
  // Kimlik: sitede görünmez, yalnız kayıtları birbirine bağlar
  if (field.type === 'id') return `k${Math.random().toString(36).slice(2, 8)}`;
  if (field.type === 'list') return [];
  if (field.type === 'object') return blankDoc(field.fields);
  if (field.i18n) return { tr: '', en: '' };
  if (field.type === 'boolean') return false;
  if (field.type === 'number') return null;
  if (field.type === 'select') {
    return field.required === false || typeof field.options === 'function' ? '' : field.options[0].value;
  }
  return '';
}

export function blankDoc(fields) {
  const doc = {};
  for (const field of fields) {
    if (field.type === 'group') Object.assign(doc, blankDoc(field.fields));
    else doc[field.name] = blank(field);
  }
  return doc;
}

/** Liste alanının bir satırı için boş değer. */
export function blankItem(listField) {
  return listField.item.fields ? blankDoc(listField.item.fields) : blank(listField.item);
}

/** Yoldaki alan tanımını bulur (sayısal dizinler atlanır). */
export function fieldAt(fields, path) {
  let list = fields;
  let found = null;

  for (const key of path.split('.')) {
    if (/^\d+$/.test(key)) {
      list = found?.item?.fields ?? [];
      continue;
    }
    const flat = list.flatMap((f) => (f.type === 'group' ? f.fields : [f]));
    found = flat.find((f) => f.name === key) ?? null;
    if (!found) return null;
    list = found.fields ?? [];
  }
  return found;
}

/* --- Girdiler --- */

function input(field, value, path, ctx) {
  const locked = field.lockOnEdit && !ctx.isNew ? ' readonly' : '';
  const attrs = `class="field__control" data-path="${path}"${locked}`;

  switch (field.type) {
    case 'text':
      return `<textarea ${attrs} rows="3">${esc(value)}</textarea>`;
    case 'markdown':
      return `
        <div class="amd" role="toolbar" aria-label="Biçim">
          ${[
            ['bold', '<b>K</b>', 'Kalın'],
            ['italic', '<i>İ</i>', 'İtalik'],
            ['heading', 'Başlık', 'Ara başlık'],
            ['quote', 'Alıntı', 'Alıntı'],
            ['list', 'Liste', 'Madde listesi'],
            ['link', 'Bağlantı', 'Bağlantı'],
          ].map(([kind, label, title]) => `
            <button type="button" class="amd__btn" data-md="${kind}" data-for="${path}" title="${title}">${label}</button>
          `).join('')}
        </div>
        <textarea class="field__control afield__md" data-path="${path}" rows="12">${esc(value)}</textarea>
        <button type="button" class="alink" data-preview="${path}">Önizle</button>
        <div class="apreview prose" data-preview-for="${path}" hidden></div>`;
    case 'number':
      return `<input ${attrs} type="number" data-kind="number" value="${esc(value)}" />`;
    case 'date':
      return `<input ${attrs} type="date" value="${esc(String(value ?? '').slice(0, 10))}" />`;
    case 'select': {
      const options = typeof field.options === 'function' ? field.options(ctx.doc, ctx.content) : field.options;
      return `
        <select ${attrs}>
          ${field.required === false ? `<option value=""${value ? '' : ' selected'}>—</option>` : ''}
          ${options.map((o) => `
            <option value="${esc(o.value)}"${o.value === value ? ' selected' : ''}>${esc(o.label)}</option>
          `).join('')}
        </select>`;
    }
    default:
      return `<input ${attrs} type="text" value="${esc(value)}" />`;
  }
}

function media(field, value, path) {
  const isImage = field.type === 'image';
  const preview = !value
    ? `<div class="amedia__empty meta">${isImage ? 'Görsel yok' : 'Dosya yok'}</div>`
    : isImage
      ? `<img class="amedia__img" src="${esc(thumbOf(value))}" alt="" loading="lazy"
              onerror="this.onerror=null;this.src='${esc(value)}'" />`
      : `<a class="amedia__file link" href="${esc(value)}" target="_blank" rel="noopener">${esc(value)}</a>`;

  return `
    <div class="amedia${isImage ? '' : ' amedia--file'}">
      ${preview}
      <div class="amedia__actions">
        <label class="abtn">
          ${value ? 'Değiştir' : 'Yükle'}
          <input type="file" hidden data-upload="${path}"
                 accept="${isImage ? 'image/jpeg,image/png,image/webp' : 'application/pdf'}" />
        </label>
        ${value ? `<button type="button" class="abtn abtn--quiet" data-clear="${path}">Kaldır</button>` : ''}
      </div>
      ${value && isImage ? `<code class="amedia__path">${esc(value)}</code>` : ''}
    </div>
  `;
}

function control(field, value, path, ctx) {
  if (field.type === 'image' || field.type === 'file') return media(field, value, path);

  if (field.type === 'boolean') {
    return `
      <label class="acheck">
        <input type="checkbox" data-path="${path}" data-kind="boolean"${value ? ' checked' : ''} />
        <span>${esc(field.label)}</span>
      </label>`;
  }

  if (field.i18n) {
    return `
      <div class="afield__langs">
        ${['tr', 'en'].map((lang) => `
          <div class="afield__lang">
            <span class="afield__tag meta">${lang.toUpperCase()}</span>
            ${input(field, value?.[lang], `${path}.${lang}`, ctx)}
            ${lang === 'en' ? `
              <button type="button" class="alink alink--translate" data-translate="${path}"
                      title="Türkçe metni İngilizceye çevirip bu kutuya yazar">Türkçeden çevir</button>` : ''}
          </div>
        `).join('')}
      </div>`;
  }

  return input(field, value, path, ctx);
}

function listField(field, value, path, ctx) {
  const rows = (value ?? []).map((item, i) => {
    const itemPath = `${path}.${i}`;
    const isMedia = field.item.fields?.some((f) => f.type === 'image');
    const body = field.item.fields
      ? field.item.fields.map((f) => renderField(f, item?.[f.name], `${itemPath}.${f.name}`, ctx)).join('')
      : `${control(field.item, item, itemPath, ctx)}
         <p class="field__error" data-error="${itemPath}" hidden></p>`;

    const isCover = field.coverAction && item?.image && ctx.doc.cover === item.image;
    const coverButton = field.coverAction && item?.image
      ? (isCover
        ? '<span class="alist__badge meta">Kapak</span>'
        : `<button type="button" class="abtn abtn--quiet" data-cover="${itemPath}.image">Kapak yap</button>`)
      : '';

    return `
      <div class="alist__row${isMedia ? ' alist__row--media' : ''}${field.item.fields ? '' : ' alist__row--simple'}">
        <div class="alist__tools">
          <span class="alist__index meta">${String(i + 1).padStart(2, '0')}</span>
          <button type="button" class="aicon" data-move="${path}" data-index="${i}" data-dir="-1"
                  aria-label="Yukarı taşı"${i === 0 ? ' disabled' : ''}>↑</button>
          <button type="button" class="aicon" data-move="${path}" data-index="${i}" data-dir="1"
                  aria-label="Aşağı taşı"${i === value.length - 1 ? ' disabled' : ''}>↓</button>
          <button type="button" class="aicon aicon--danger" data-remove="${path}" data-index="${i}"
                  aria-label="Satırı sil">×</button>
          ${coverButton}
        </div>
        <div class="alist__body">${body}</div>
      </div>
    `;
  }).join('');

  return `
    <div class="alist"${field.bulk ? ` data-drop="${path}"` : ''}>
      ${rows || '<p class="alist__empty meta">Henüz kayıt yok.</p>'}
      <div class="alist__foot">
        ${field.bulk ? `
          <label class="abtn abtn--solid">
            Görselleri yükle
            <input type="file" hidden multiple data-bulk="${path}" accept="image/jpeg,image/png,image/webp" />
          </label>
          <span class="alist__drop meta">ya da dosyaları buraya sürükle</span>` : ''}
        <button type="button" class="abtn" data-add="${path}">${esc(field.addLabel ?? 'Ekle')}</button>
      </div>
    </div>
  `;
}

/** Tek bir alanı etiketi ve açıklamasıyla çizer. */
export function renderField(field, value, path, ctx) {
  if (field.type === 'id') return '';

  const hint = field.hint ? `<p class="afield__hint">${esc(field.hint)}</p>` : '';

  // Uzun formlarda (Kişisel) en üst düzey bölümler açılır-kapanır
  const collapsible = ctx.collapsible && !path.includes('.')
    && ['group', 'object', 'list'].includes(field.type);
  const section = (title, body) => (collapsible
    ? `<details class="agroup agroup--fold" data-section="${path}"${ctx.open?.has(path) ? ' open' : ''}>
         <summary class="agroup__title">${title}</summary>${body}
       </details>`
    : `<fieldset class="agroup"><legend class="agroup__title">${title}</legend>${body}</fieldset>`);
  const optional = field.required === false || field.type === 'boolean' || field.type === 'list';

  if (field.type === 'group' || field.type === 'object') {
    const base = field.type === 'object' ? `${path}.` : path.replace(/[^.]*$/, '');
    const source = field.type === 'object' ? value : getPath(ctx.doc, base.slice(0, -1)) ?? ctx.doc;

    return section(esc(field.label), `
      ${hint}
      <div class="agroup__grid">
        ${field.fields.map((f) => renderField(f, source?.[f.name], `${base}${f.name}`, ctx)).join('')}
      </div>
    `);
  }

  if (field.type === 'list') {
    return section(
      `${esc(field.label)} <span class="agroup__count meta">${(value ?? []).length}</span>`,
      `${hint}${listField(field, value, path, ctx)}`,
    );
  }

  const wide = field.i18n || ['text', 'markdown', 'image', 'file'].includes(field.type);

  return `
    <div class="afield${wide ? ' afield--wide' : ''}" data-field="${path}">
      ${field.type === 'boolean' ? '' : `
        <span class="afield__label meta">${esc(field.label)}${optional ? '' : ' *'}</span>`}
      ${control(field, value, path, ctx)}
      ${hint}
      <p class="field__error" data-error="${path}" hidden></p>
    </div>
  `;
}

export function renderForm(fields, doc, ctx) {
  return fields.map((f) => renderField(f, doc[f.name], f.name, { ...ctx, doc })).join('');
}

/**
 * Belgedeki tüm iki dilli alanları yollarıyla listeler.
 * Toplu çeviri ve "İngilizcesi eksik" sayımı bunu kullanır.
 * @returns {{path: string, tr: string, en: string, label: string}[]}
 */
export function i18nPaths(fields, doc, base = '') {
  const out = [];
  const add = (path, value, label) => out.push({
    path, label, tr: String(value?.tr ?? '').trim(), en: String(value?.en ?? '').trim(),
  });

  for (const field of fields) {
    if (field.type === 'group') {
      out.push(...i18nPaths(field.fields, doc, base));
      continue;
    }

    const path = `${base}${field.name}`;
    const value = doc?.[field.name];

    if (field.type === 'object') {
      out.push(...i18nPaths(field.fields, value ?? {}, `${path}.`));
    } else if (field.type === 'list') {
      (value ?? []).forEach((item, i) => {
        if (field.item.fields) out.push(...i18nPaths(field.item.fields, item, `${path}.${i}.`));
        else if (field.item.i18n) add(`${path}.${i}`, item, field.label);
      });
    } else if (field.i18n) {
      add(path, value, field.label);
    }
  }
  return out;
}

/* --- Doğrulama --- */

/** @returns {{path: string, message: string}[]} */
export function validate(fields, doc, base = '') {
  const errors = [];
  const empty = (v) => v == null || String(v).trim() === '';

  for (const field of fields) {
    if (field.type === 'group') {
      errors.push(...validate(field.fields, doc, base));
      continue;
    }

    const path = `${base}${field.name}`;
    const value = doc?.[field.name];

    if (field.type === 'object') {
      errors.push(...validate(field.fields, value ?? {}, `${path}.`));
    } else if (field.type === 'list') {
      (value ?? []).forEach((item, i) => {
        if (field.item.fields) errors.push(...validate(field.item.fields, item, `${path}.${i}.`));
        else if (empty(field.item.i18n ? item?.tr : item)) {
          errors.push({ path: field.item.i18n ? `${path}.${i}.tr` : `${path}.${i}`, message: 'Boş satır: doldur ya da sil.' });
        }
      });
    } else if (field.type !== 'boolean' && field.type !== 'id') {
      const main = field.i18n ? value?.tr : value;
      const mainPath = field.i18n ? `${path}.tr` : path;

      if (field.required !== false && empty(main)) {
        errors.push({ path: mainPath, message: `${field.label} boş bırakılamaz.` });
      } else if (field.pattern && !empty(main) && !field.pattern.test(main)) {
        errors.push({ path: mainPath, message: field.patternMessage });
      }
    }
  }
  return errors;
}

/** Türkçe başlıktan adres üretir: "Han Adası" → "han-adasi". */
export function slugify(text) {
  const map = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u', İ: 'i', I: 'i' };
  return String(text ?? '')
    .replace(/[çğıöşüİI]/g, (c) => map[c])
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
