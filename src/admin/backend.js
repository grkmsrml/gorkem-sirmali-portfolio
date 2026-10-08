/* ============================================
   YÖNETİM PANELİ — KAYIT KATMANI

   Panelin geri kalanı içeriğin nereye yazıldığını bilmez; yalnız
   buradaki işlevleri çağırır. Şu an tek uygulama var:

     yerel → `npm run dev` çalışırken scripts/admin-api.mjs üzerinden
             doğrudan depodaki dosyalara yazar.

   Yayındaki siteden düzenleme (GitHub'a commit) eklenirken yalnız
   bu dosyaya aynı işlevlerin ikinci bir uygulaması yazılacak.
   ============================================ */

async function request(path, options) {
  const response = await fetch(`/__admin/${path}`, options);
  const body = await response.json().catch(() => null);

  if (!response.ok || !body) {
    throw new Error(body?.error ?? `Sunucu yanıt vermedi (${response.status}).`);
  }
  return body;
}

export const backend = {
  /** Panel bir kayıt katmanına bağlı mı? */
  async available() {
    try {
      return (await request('ping')).ok === true;
    } catch {
      return false;
    }
  },

  /** Tüm içerik: { projects: [{path, data}], blog: [...], photos, personal } */
  load() {
    return request('content');
  },

  save(path, data) {
    return request('entry', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, data }),
    });
  },

  /** Kaydı çöp kutusuna taşır; çöp kutusundaki kaydı kalıcı siler. */
  remove(path) {
    return request(`entry?path=${encodeURIComponent(path)}`, { method: 'DELETE' });
  },

  /** Çöp kutusundaki kaydı yerine geri koyar; yeni yolunu döndürür. */
  async restore(path) {
    const result = await request('restore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path }),
    });
    return result.path;
  },

  /** Yüklü görseller: [{ path, size, used }] */
  async media() {
    return (await request('media')).items;
  },

  removeMedia(path) {
    return request(`media?path=${encodeURIComponent(path)}`, { method: 'DELETE' });
  },

  /** İçeriğe dokunan son commit'ler: [{ hash, date, subject }] */
  async history() {
    return (await request('history')).items;
  },

  /** Dosyayı yükler; görselse dönüştürülmüş .webp adresini döndürür. */
  async upload(dir, file) {
    const query = `dir=${encodeURIComponent(dir)}&name=${encodeURIComponent(file.name)}`;
    const result = await request(`upload?${query}`, { method: 'POST', body: file });
    return result.path;
  },

  /** Türkçe metinleri İngilizceye çevirir; sıra korunur. */
  async translate(texts) {
    const result = await request('translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texts }),
    });
    return result.texts;
  },

  /** Yayınlanmamışlar: { changes: [{status, path}], ahead } */
  status() {
    return request('status');
  },

  /** İçerik değişikliklerini commit edip gönderir. */
  publish(message) {
    return request('publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
  },
};
