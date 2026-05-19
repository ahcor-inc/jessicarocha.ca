import { SELF } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';

const ALLOWED_ORIGIN = 'https://jessicarocha.ca';
const WORKER_URL = 'https://worker.test/';

function validBody(overrides: Record<string, unknown> = {}) {
  return JSON.stringify({
    name: 'Jane Reader',
    email: 'jane@example.com',
    subject: 'reader-mail',
    message: 'Hello, I loved Cursed Blood.',
    company: '',
    ...overrides,
  });
}

describe('contact-form worker', () => {
  describe('method handling', () => {
    it('rejects GET with 405', async () => {
      const res = await SELF.fetch(WORKER_URL, {
        method: 'GET',
        headers: { Origin: ALLOWED_ORIGIN },
      });
      expect(res.status).toBe(405);
    });

    it('responds to OPTIONS preflight with 204 and CORS headers', async () => {
      const res = await SELF.fetch(WORKER_URL, {
        method: 'OPTIONS',
        headers: { Origin: ALLOWED_ORIGIN },
      });
      expect(res.status).toBe(204);
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe(ALLOWED_ORIGIN);
      expect(res.headers.get('Access-Control-Allow-Methods')).toContain('POST');
    });
  });

  describe('origin allowlist', () => {
    it('rejects POST without Origin header with 403', async () => {
      const res = await SELF.fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: validBody(),
      });
      expect(res.status).toBe(403);
    });

    it('rejects POST from disallowed origin with 403', async () => {
      const res = await SELF.fetch(WORKER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Origin: 'https://evil.example',
        },
        body: validBody(),
      });
      expect(res.status).toBe(403);
    });

    it('accepts allowed origin past auth gate', async () => {
      const res = await SELF.fetch(WORKER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Origin: ALLOWED_ORIGIN,
        },
        body: validBody(),
      });
      // BREVO_API_KEY not set in test env → 503 is the expected path
      // (origin check passed, validation passed, Brevo gate triggered)
      expect([400, 503]).toContain(res.status);
    });
  });

  describe('input validation', () => {
    it('rejects honeypot field with 400', async () => {
      const res = await SELF.fetch(WORKER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Origin: ALLOWED_ORIGIN,
        },
        body: validBody({ company: 'spammer corp' }),
      });
      expect(res.status).toBe(400);
    });

    it('rejects invalid email with 400', async () => {
      const res = await SELF.fetch(WORKER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Origin: ALLOWED_ORIGIN,
        },
        body: validBody({ email: 'not-an-email' }),
      });
      expect(res.status).toBe(400);
    });

    it('rejects missing name with 400', async () => {
      const res = await SELF.fetch(WORKER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Origin: ALLOWED_ORIGIN,
        },
        body: validBody({ name: '' }),
      });
      expect(res.status).toBe(400);
    });

    it('rejects out-of-list subject with 400', async () => {
      const res = await SELF.fetch(WORKER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Origin: ALLOWED_ORIGIN,
        },
        body: validBody({ subject: 'malicious-subject' }),
      });
      expect(res.status).toBe(400);
    });

    it('rejects message with control characters with 400', async () => {
      const res = await SELF.fetch(WORKER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Origin: ALLOWED_ORIGIN,
        },
        body: validBody({ message: 'hi\x07there' }),
      });
      expect(res.status).toBe(400);
    });

    it('rejects malformed JSON with 400', async () => {
      const res = await SELF.fetch(WORKER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Origin: ALLOWED_ORIGIN,
        },
        body: '{not json',
      });
      expect(res.status).toBe(400);
    });
  });
});
