import { defineConfig } from 'vite';
import { adminApi } from './scripts/admin-api.mjs';
import { siteMeta } from './scripts/site-meta.mjs';

export default defineConfig({
  plugins: [adminApi(), siteMeta()],

  build: {
    rollupOptions: {
      // İki sayfa: site ve yönetim paneli (/admin/)
      input: {
        main: 'index.html',
        admin: 'admin/index.html',
      },
    },
  },
});
