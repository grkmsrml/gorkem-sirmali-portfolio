/* ============================================
   KATEGORİLER
   İçerik: content/site.json — yönetim panelindeki "Site ayarları"
   sayfasından eklenir, sıralanır, adlandırılır. Boş kategoriler
   sitede kendiliğinden gizlenir.
   ============================================ */

import site from '../../content/site.json';

const all = { id: 'all', name: { tr: 'Tümü', en: 'All' } };

export const categories = [all, ...(site.projectCategories ?? [])];
export const blogCategories = [all, ...(site.blogCategories ?? [])];
