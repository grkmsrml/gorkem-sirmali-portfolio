/* ============================================
   KÜÇÜK MARKDOWN ÇEVİRİCİ
   Yönetim panelindeki metin alanlarının çıktısını HTML'e çevirir.
   Desteklenenler: paragraf, ## başlık, > alıntı, - liste,
   **kalın**, *italik*, [bağlantı](adres).

   İçerik depodaki kendi dosyalarımızdan geliyor (content/), o yüzden
   HTML kaçışı yapılmıyor — metne elle <br> gibi etiket yazılabilir.
   ============================================ */

function inline(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\n]+?)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,
      '<a href="$2" class="link" target="_blank" rel="noopener">$1</a>');
}

/** Markdown metnini blok blok HTML'e çevirir. */
export function md(source) {
  if (!source) return '';

  return String(source)
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = block.split('\n');

      if (/^#{1,3}\s/.test(block)) {
        return `<h2>${inline(block.replace(/^#{1,3}\s+/, ''))}</h2>`;
      }
      if (lines.every((l) => /^>\s?/.test(l))) {
        return `<blockquote>${inline(lines.map((l) => l.replace(/^>\s?/, '')).join(' '))}</blockquote>`;
      }
      if (lines.every((l) => /^[-*]\s+/.test(l))) {
        return `<ul>${lines.map((l) => `<li>${inline(l.replace(/^[-*]\s+/, ''))}</li>`).join('')}</ul>`;
      }
      return `<p>${inline(lines.join(' '))}</p>`;
    })
    .join('');
}

/** Okuma süresi (dakika) — metnin kelime sayısından hesaplanır. */
export function readingTime(source) {
  const words = String(source ?? '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
