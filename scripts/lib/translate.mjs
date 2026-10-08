/* ============================================
   ÇEVİRİ — Türkçe → İngilizce
   Yönetim panelindeki "çevir" düğmeleri bunu kullanır.

   Google Translate'in anahtarsız genel ucuna gider. Resmî bir
   API değildir: ücretsizdir, hesap gerektirmez, ama garanti de
   vermez. Çalışmazsa panel hatayı gösterir, başka hiçbir şey
   bozulmaz. Çıkan metin taslaktır; özel adları ve terimleri
   kaydetmeden önce gözden geçir.

   Metin paragraf paragraf gönderilir ki boş satırlar ve
   **kalın** gibi işaretler yerinde kalsın.
   ============================================ */

const ENDPOINT = 'https://translate.googleapis.com/translate_a/single';

async function translateChunk(text, from, to) {
  const url = `${ENDPOINT}?client=gtx&sl=${from}&tl=${to}&dt=t`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body: new URLSearchParams({ q: text }),
    signal: AbortSignal.timeout(20000),
  });

  if (!response.ok) throw new Error(`Çeviri servisi yanıt vermedi (${response.status}).`);

  const data = await response.json();
  return (data?.[0] ?? []).map((segment) => segment?.[0] ?? '').join('');
}

/** Çeviride araya giren boşlukları toparlar: "** kalın **" → "**kalın**". */
function tidy(text) {
  return text
    .replace(/\*\*\s+([^*]+?)\s+\*\*/g, '**$1**')
    .replace(/\]\s+\(/g, '](')
    .trim();
}

export async function translateText(text, from = 'tr', to = 'en') {
  if (!String(text ?? '').trim()) return '';

  const blocks = String(text).replace(/\r\n/g, '\n').split(/\n{2,}/);
  const out = [];
  for (const block of blocks) {
    out.push(block.trim() ? tidy(await translateChunk(block, from, to)) : '');
  }
  return out.join('\n\n');
}

export async function translateAll(texts, from, to) {
  const out = [];
  for (const text of texts) out.push(await translateText(text, from, to));
  return out;
}
