# Contact form proxy (Brevo)

Serverless handler that receives contact form submissions from [jessicarocha.ca](https://jessicarocha.ca) and sends them via [Brevo transactional email](https://developers.brevo.com/reference/send-transac-email). The Brevo API key never ships to the browser.

## Security controls

- CORS allowlist (`ALLOWED_ORIGINS`)
- Per-IP rate limiting (KV: 5 requests / 15 minutes by default)
- Honeypot field (`company` must be empty)
- Subject allowlist (server maps keys to labels)
- Header-safe sanitization (CR/LF stripped from mail fields)
- Request body size cap (32 KB)
- Cloudflare Turnstile verification (when `TURNSTILE_SECRET` is set)
- HTML escaping in notification emails

See [`docs/SECURITY-HEADERS.md`](../../docs/SECURITY-HEADERS.md) for optional Cloudflare response headers on the static site.

## Brevo setup (one-time)

1. Sign in at [Brevo](https://www.brevo.com/).
2. **Senders & IP** — add and verify `hello@jessicarocha.ca` (or your chosen sender). Domain authentication is recommended.
3. **SMTP & API → API Keys** — create a v3 key with permission to send transactional email.
4. Store the key as a Worker secret (see below).

## Turnstile setup (one-time)

1. In the [Cloudflare dashboard](https://dash.cloudflare.com/), open **Turnstile** and add a site for `jessicarocha.ca` (and `localhost` for dev).
2. Copy the **site key** → Astro `PUBLIC_TURNSTILE_SITE_KEY` (local `.env` + GitHub Actions variable).
3. Copy the **secret key** → Worker secret:
   ```bash
   yarn wrangler secret put TURNSTILE_SECRET
   ```
4. Use Cloudflare’s test keys for local development if needed.

When `TURNSTILE_SECRET` is not set on the Worker, Turnstile verification is skipped (local dev only — always set in production).

## KV namespace (rate limiting)

If you clone this repo fresh, create namespaces and update `wrangler.toml`:

```bash
yarn wrangler kv namespace create RATE_LIMIT
yarn wrangler kv namespace create RATE_LIMIT --preview
```

Paste the returned `id` and `preview_id` into `[[kv_namespaces]]` in `wrangler.toml`.

## Deploy (Cloudflare Workers)

```bash
cd workers/contact-form
yarn install
yarn wrangler secret put BREVO_API_KEY
yarn wrangler secret put TURNSTILE_SECRET
yarn deploy
```

After deploy, copy the Worker URL into:

- Local: `.env` as `PUBLIC_CONTACT_FORM_ENDPOINT`
- GitHub: repository variable `PUBLIC_CONTACT_FORM_ENDPOINT` for the Pages build

Optional: edit `wrangler.toml` `[vars]` for `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, `ALLOWED_ORIGINS`, `RATE_LIMIT_MAX`, or `RATE_LIMIT_WINDOW_SEC`.

## Secrets vs vars

| Name | Where | Purpose |
|------|--------|---------|
| `BREVO_API_KEY` | `wrangler secret put` only | Brevo API authentication |
| `TURNSTILE_SECRET` | `wrangler secret put` only | Turnstile siteverify |
| `CONTACT_TO_EMAIL` | `wrangler.toml` | Inbox that receives submissions |
| `CONTACT_FROM_EMAIL` | `wrangler.toml` | Verified Brevo sender |
| `ALLOWED_ORIGINS` | `wrangler.toml` | CORS allowlist (comma-separated) |
| `RATE_LIMIT_MAX` | `wrangler.toml` | Max submissions per IP per window |
| `RATE_LIMIT_WINDOW_SEC` | `wrangler.toml` | Rate limit window in seconds |

Do not commit `BREVO_API_KEY`, `TURNSTILE_SECRET`, or add them to Astro `PUBLIC_*` variables.
