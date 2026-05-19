import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://jessicarocha.ca',
  output: 'static',
  integrations: [sitemap()],
  vite: {
    build: {
      // Keep scripts as external files so contact-page CSP (script-src 'self') can run them.
      assetsInlineLimit: 0,
    },
  },
});
