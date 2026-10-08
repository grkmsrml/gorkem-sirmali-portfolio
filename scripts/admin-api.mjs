/* ============================================
   YÖNETİM PANELİ — YEREL SUNUCU UCU

   Yalnız `npm run dev` sırasında çalışan bir Vite eklentisi.
   Panelin (admin/) isteklerini karşılar ve içeriği doğrudan
   depodaki dosyalara yazar:

     GET    /__admin/ping      panel bağlı mı
     GET    /__admin/content   tüm içerik tek istekte
     PUT    /__admin/entry     { path, data } → content/**.json yazar
     DELETE /__admin/entry     ?path=         → content/**.json siler
     POST   /__admin/upload    ?dir=&name=    → görseli dönüştürüp kaydeder
     POST   /__admin/translate { texts }      → Türkçeden İngilizceye çevirir
     POST   /__admin/restore   { path }       → çöp kutusundan geri yükler
     GET    /__admin/media     yüklü görseller ve kullanılıp kullanılmadıkları
     DELETE /__admin/media     ?path=         → kullanılmayan görseli siler
     GET    /__admin/history   içeriğe dokunan son commit'ler
     GET    /__admin/status    yayınlanmamış içerik değişiklikleri
     POST   /__admin/publish   { message }    → commit + push

   Güvenlik: yalnız bu bilgisayardan gelen istekler kabul edilir
   (dev:host ile ağa açılsa bile) ve yazılabilecek yerler
   content/, public/images/ ve public/cv/ ile sınırlıdır.
   Yayındaki sitede bu uçlar yoktur.

   Silinen kayıt yok edilmez, content/_trash/ altına taşınır; panelin
   çöp kutusundan geri yüklenebilir ya da kalıcı silinebilir.
   ============================================ */

import fs from 'node:fs/promises';
import path from 'node:path';
import { convertImage, writeManifest, walk, RASTER } from './lib/images.mjs';
import { translateAll } from './lib/translate.mjs';
import { publish, publishStatus, history } from './lib/publish.mjs';

const MAX_UPLOAD = 80 * 1024 * 1024;
const TRASH = 'content/_trash';
const posix = (p) => p.replace(/\\/g, '/');

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

/** Yolu kök klasöre göre çözer; izinli klasörlerin dışına çıkıyorsa reddeder. */
function resolveInside(root, relative, allowed) {
  const full = path.resolve(root, relative);
  const rel = posix(path.relative(root, full));
  if (rel.startsWith('..') || !allowed.some((dir) => rel === dir || rel.startsWith(`${dir}/`))) {
    throw new HttpError(403, `Bu yola yazılamaz: ${relative}`);
  }
  return full;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_UPLOAD) {
        reject(new HttpError(413, 'Dosya çok büyük (en fazla 80 MB).'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

async function readCollection(root, dir) {
  const folder = path.join(root, dir);
  const names = (await fs.readdir(folder).catch(() => [])).filter((n) => n.endsWith('.json'));
  return Promise.all(names.map(async (name) => ({
    path: `${dir}/${name}`,
    data: await readJson(path.join(folder, name)),
  })));
}

/** Dosya adını adres dostu hale getirir: küçük harf, Türkçe karakter yok. */
function safeName(name) {
  const map = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u' };
  const ext = path.extname(name).toLowerCase();
  const base = path.basename(name, path.extname(name))
    .toLocaleLowerCase('tr')
    .replace(/[çğıöşü]/g, (c) => map[c])
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'dosya';
  return { base, ext };
}

async function exists(file) {
  return fs.access(file).then(() => true, () => false);
}

export function adminApi() {
  let root = process.cwd();
  const handlers = {
    'GET /ping': async () => ({ ok: true, backend: 'local' }),

    'GET /content': async () => ({
      projects: await readCollection(root, 'content/projects'),
      blog: await readCollection(root, 'content/blog'),
      photos: await readJson(path.join(root, 'content/photos.json')),
      personal: await readJson(path.join(root, 'content/personal.json')),
      site: await readJson(path.join(root, 'content/site.json')),
      trash: [
        ...await readCollection(root, `${TRASH}/projects`),
        ...await readCollection(root, `${TRASH}/blog`),
      ],
    }),

    'PUT /entry': async (req) => {
      const { path: rel, data } = JSON.parse((await readBody(req)).toString('utf8'));
      if (!rel?.endsWith('.json') || data == null) throw new HttpError(400, 'Eksik istek.');

      const file = resolveInside(root, rel, ['content']);
      await fs.mkdir(path.dirname(file), { recursive: true });
      await fs.writeFile(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
      return { ok: true, path: rel };
    },

    'DELETE /entry': async (req, url) => {
      const rel = url.searchParams.get('path') ?? '';
      if (!rel.endsWith('.json')) throw new HttpError(400, 'Eksik istek.');

      const file = resolveInside(root, rel, ['content']);

      // Çöp kutusundaki kayıt kalıcı silinir; diğerleri çöp kutusuna taşınır
      if (rel.startsWith(`${TRASH}/`)) {
        await fs.unlink(file);
        return { ok: true, trashed: null };
      }

      const trashed = `${TRASH}/${rel.replace(/^content\//, '')}`;
      const target = resolveInside(root, trashed, ['content']);
      await fs.mkdir(path.dirname(target), { recursive: true });
      await fs.rename(file, target);
      return { ok: true, trashed };
    },

    'POST /restore': async (req) => {
      const { path: rel } = JSON.parse((await readBody(req)).toString('utf8'));
      if (!rel?.startsWith(`${TRASH}/`) || !rel.endsWith('.json')) throw new HttpError(400, 'Eksik istek.');

      const restored = `content/${rel.slice(TRASH.length + 1)}`;
      const target = resolveInside(root, restored, ['content']);
      if (await exists(target)) {
        throw new HttpError(409, 'Aynı adreste başka bir kayıt var; önce onu sil ya da adını değiştir.');
      }

      await fs.mkdir(path.dirname(target), { recursive: true });
      await fs.rename(resolveInside(root, rel, ['content']), target);
      return { ok: true, path: restored };
    },

    'GET /media': async () => {
      // Bir görsel, adresi herhangi bir içerik dosyasında geçiyorsa kullanılıyordur
      // (çöp kutusundaki kayıtlar dahil: geri yüklenince görseli yerinde olsun)
      let haystack = '';
      for (const file of await walk(path.join(root, 'content'), /\.json$/i)) {
        haystack += await fs.readFile(file, 'utf8');
      }

      const items = [];
      for (const file of await walk(path.join(root, 'public/images'), /\.webp$/i)) {
        if (/-(thumb|full)\.webp$/i.test(file)) continue;

        const url = `/${posix(path.relative(path.join(root, 'public'), file))}`;
        let size = 0;
        for (const variant of ['.webp', '-thumb.webp', '-full.webp']) {
          size += await fs.stat(file.replace(/\.webp$/i, variant)).then((s) => s.size, () => 0);
        }
        items.push({ path: url, size, used: haystack.includes(url) });
      }
      return { items: items.sort((a, b) => a.path.localeCompare(b.path)) };
    },

    'DELETE /media': async (req, url) => {
      const rel = (url.searchParams.get('path') ?? '').replace(/^\/+/, '');
      if (!/\.webp$/i.test(rel) || /-(thumb|full)\.webp$/i.test(rel)) throw new HttpError(400, 'Eksik istek.');

      const file = resolveInside(root, `public/${rel}`, ['public/images']);
      for (const content of await walk(path.join(root, 'content'), /\.json$/i)) {
        if ((await fs.readFile(content, 'utf8')).includes(`/${rel}`)) {
          throw new HttpError(409, 'Bu görsel bir kayıtta kullanılıyor; önce oradan kaldır.');
        }
      }

      for (const variant of ['.webp', '-thumb.webp', '-full.webp']) {
        await fs.unlink(file.replace(/\.webp$/i, variant)).catch(() => {});
      }
      await writeManifest();
      return { ok: true };
    },

    'GET /history': async () => ({ items: await history(root) }),

    'POST /upload': async (req, url) => {
      const dir = (url.searchParams.get('dir') ?? '').replace(/^\/+|\/+$/g, '');
      const { base, ext } = safeName(url.searchParams.get('name') ?? '');
      const isImage = RASTER.test(ext) || ext === '.webp';
      if (!isImage && ext !== '.pdf') {
        throw new HttpError(415, 'Yalnız .jpg, .png, .webp ve .pdf yüklenebilir.');
      }

      const folder = resolveInside(root, `public/${dir}`, ['public/images', 'public/cv']);
      await fs.mkdir(folder, { recursive: true });

      // Aynı adla dosya varsa üstüne yazma: ad-2, ad-3...
      const finalExt = RASTER.test(ext) ? '.webp' : ext;
      let name = base;
      for (let n = 2; await exists(path.join(folder, `${name}${finalExt}`)); n += 1) {
        name = `${base}-${n}`;
      }

      const target = path.join(folder, `${name}${ext}`);
      await fs.writeFile(target, await readBody(req));

      if (RASTER.test(ext)) {
        await convertImage(target);
        await writeManifest();
      } else if (ext === '.webp') {
        await writeManifest();
      }

      return { ok: true, path: `/${dir}/${name}${finalExt}` };
    },
  };

  handlers['POST /translate'] = async (req) => {
    const { texts } = JSON.parse((await readBody(req)).toString('utf8'));
    if (!Array.isArray(texts)) throw new HttpError(400, 'Eksik istek.');
    return { texts: await translateAll(texts, 'tr', 'en') };
  };

  handlers['GET /status'] = () => publishStatus(root);

  handlers['POST /publish'] = async (req) => {
    const { message } = JSON.parse((await readBody(req)).toString('utf8') || '{}');
    return { ok: true, ...await publish(root, message) };
  };

  return {
    name: 'portfolyo-admin-api',
    apply: 'serve',

    configResolved(config) {
      root = config.root;
    },

    configureServer(server) {
      server.middlewares.use('/__admin', async (req, res) => {
        const send = (status, body) => {
          res.statusCode = status;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.setHeader('Cache-Control', 'no-store');
          res.end(JSON.stringify(body));
        };

        try {
          const remote = req.socket.remoteAddress ?? '';
          if (!['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(remote)) {
            throw new HttpError(403, 'Panel yalnız bu bilgisayardan kullanılabilir.');
          }

          const url = new URL(req.url, 'http://localhost');
          const handler = handlers[`${req.method} ${url.pathname}`];
          if (!handler) throw new HttpError(404, 'Bilinmeyen istek.');

          send(200, await handler(req, url));
        } catch (error) {
          send(error.status ?? 500, { error: error.message });
        }
      });
    },
  };
}
