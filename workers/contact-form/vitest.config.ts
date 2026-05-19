import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';

export default defineWorkersConfig({
  test: {
    poolOptions: {
      workers: {
        wrangler: { configPath: './wrangler.toml' },
        miniflare: {
          kvNamespaces: ['RATE_LIMIT'],
          bindings: {
            CONTACT_TO_EMAIL: 'test@example.com',
            CONTACT_FROM_EMAIL: 'noreply@example.com',
            CONTACT_FROM_NAME: 'Test',
            ALLOWED_ORIGINS: 'https://jessicarocha.ca,http://localhost:4321',
            RATE_LIMIT_MAX: '5',
            RATE_LIMIT_WINDOW_SEC: '900',
          },
        },
      },
    },
  },
});
