/* ============================================
   YAYINLAMA — içerik değişikliklerini commit edip gönderir
   Yönetim panelindeki "Yayınla" düğmesi bunu kullanır.

   Yalnız içerik yolları commit edilir (CONTENT_PATHS); kod
   dosyalarına dokunulmaz. Gönderme (push) bu bilgisayardaki
   git kimliğiyle yapılır; yayın servisi push'u görünce siteyi
   kendiliğinden yeniden kurar.
   ============================================ */

import { execFile } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

export const CONTENT_PATHS = ['content', 'public/images', 'public/cv', 'src/data/image-sizes.js'];

function git(root, args) {
  return new Promise((resolve, reject) => {
    // core.quotepath=false: Türkçe karakterli dosya adları \303\274 gibi kaçışlanmasın
    execFile('git', ['-c', 'core.quotepath=false', ...args], { cwd: root, maxBuffer: 8 * 1024 * 1024 },
      (error, stdout, stderr) => {
        if (error) reject(new Error((stderr || stdout || error.message).trim()));
        else resolve(stdout);
      });
  });
}

/** Git, var olmayan yol verilince hata verir; yalnız mevcut olanları kullan. */
function contentPaths(root) {
  return CONTENT_PATHS.filter((p) => fs.existsSync(path.join(root, p)));
}

/** Yayınlanmamış içerik değişiklikleri ve gönderilmemiş commit sayısı. */
export async function publishStatus(root) {
  const raw = await git(root, ['status', '--porcelain', '--untracked-files=all', '--', ...contentPaths(root)]);
  const changes = raw.split('\n').filter(Boolean).map((line) => ({
    status: line.slice(0, 2).trim(),
    path: line.slice(3).replace(/^"|"$/g, ''),
  }));

  // Uzak dal tanımlı değilse (henüz hiç gönderilmemiş) sayılamaz
  const ahead = await git(root, ['rev-list', '--count', '@{u}..HEAD'])
    .then((out) => Number(out.trim()) || 0, () => 0);

  return { changes, ahead };
}

export async function publish(root, message) {
  const { changes } = await publishStatus(root);
  let committed = false;

  if (changes.length) {
    // Yalnız değişen dosyalar: klasör adıyla commit, içinde git'in
    // tanıdığı dosya yoksa hata veriyor. Yeniden adlandırma "eski -> yeni" gelir.
    const files = changes.flatMap((c) => c.path.split(' -> ').map((p) => p.replace(/^"|"$/g, '')));
    await git(root, ['add', '-A', '--', ...files]);
    await git(root, ['commit', '-m', message?.trim() || 'İçerik güncellendi (yönetim paneli)', '--', ...files]);
    committed = true;
  }

  // Uzakta yeni commit varsa (ör. GitHub'dan düzenleme) önce onları al
  await git(root, ['pull', '--rebase', '--autostash']);
  await git(root, ['push']);

  return { committed, files: changes.length };
}
