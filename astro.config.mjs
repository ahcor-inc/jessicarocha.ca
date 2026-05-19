import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://jessicarocha.ca',
  output: 'static',
  vite: {
    build: {
      // Keep scripts as external files so contact-page CSP (script-src 'self') can run them.
      assetsInlineLimit: 0,
    },
  },
});
