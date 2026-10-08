import { defineConfig } from 'vite';
import { adminApi } from './scripts/admin-api.mjs';

export default defineConfig({
  plugins: [adminApi()],

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
