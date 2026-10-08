/* ============================================
   SİTE KÜNYESİ — index.html'deki başlık, açıklama ve paylaşım
   etiketlerini content/site.json'dan doldurur.

   Arama motorları ve paylaşım kartları (WhatsApp, LinkedIn…) bu
   etiketleri sayfa çalışmadan önce okur; o yüzden tarayıcıda
   değil, derleme sırasında yazılmaları gerekir. Panelde "Site
   ayarları"nı değiştirmek, bir sonraki derlemede bunları günceller.
   ============================================ */

import fs from 'node:fs';
import path from 'node:path';

const attr = (value) => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;');

export function siteMeta() {
  let root = process.cwd();

  return {
    name: 'portfolyo-site-meta',

    configResolved(config) {
      root = config.root;
    },

    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        // Yalnız sitenin kendi sayfası; yönetim paneline dokunma
        if (!/(^|\/)index\.html$/.test(ctx.path) || ctx.path.includes('admin')) return html;

        const { seo = {} } = JSON.parse(fs.readFileSync(path.join(root, 'content/site.json'), 'utf8'));
        const title = seo.title?.tr;
        const description = seo.description?.tr;
        const base = (seo.url ?? '').replace(/\/+$/, '');
        const image = seo.ogImage ? `${base}${seo.ogImage}` : null;

        const setContent = (source, selector, value) => (value
          ? source.replace(new RegExp(`(<meta ${selector} content=")[^"]*(")`), `$1${attr(value)}$2`)
          : source);

        let out = html;
        if (title) out = out.replace(/<title>[^<]*<\/title>/, `<title>${attr(title)}</title>`);
        out = setContent(out, 'name="description"', description);
        out = setContent(out, 'property="og:title"', title);
        out = setContent(out, 'name="twitter:title"', title);
        out = setContent(out, 'property="og:description"', description);
        out = setContent(out, 'name="twitter:description"', description);
        out = setContent(out, 'property="og:image"', image);
        out = setContent(out, 'name="twitter:image"', image);
        if (base) {
          out = setContent(out, 'property="og:url"', `${base}/`);
          out = out.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${attr(base)}/$2`);
        }
        return out;
      },
    },
  };
}
