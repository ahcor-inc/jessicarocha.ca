# Security headers (jessicarocha.ca)

The site is served by GitHub Pages and proxied through Cloudflare (orange cloud). GitHub Pages cannot set custom HTTP response headers, so security headers are applied at the Cloudflare edge via **Transform Rules → Modify Response Header**.

## Current state

A fallback `Content-Security-Policy` `<meta>` tag is emitted on the contact page only (when Turnstile is enabled in production). See `src/layouts/BaseLayout.astro`. The intent is to migrate the CSP — and all other security headers — to Cloudflare Transform Rules so they apply site-wide as real HTTP headers, then drop the meta tag.

## Recommended Cloudflare Transform Rules

In the Cloudflare dashboard → your zone → **Rules → Transform Rules → Modify Response Header**, add one rule per header below. Scope each to: *Hostname equals* `jessicarocha.ca` (and `www.jessicarocha.ca` if applicable).

| Header | Value |
|---|---|
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `Content-Security-Policy` | (see below) |

### Content-Security-Policy

```
default-src 'self';
script-src 'self' https://challenges.cloudflare.com;
frame-src https://challenges.cloudflare.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
img-src 'self' data: https:;
font-src 'self' data: https://fonts.gstatic.com;
connect-src 'self' https:;
form-action 'self' https://buttondown.com;
frame-ancestors 'none';
base-uri 'self'
```

Notes on each directive:
- `script-src 'self' https://challenges.cloudflare.com` — contact-form logic is bundled to `/_astro/` (same-origin); Turnstile loads from `challenges.cloudflare.com`.
- `frame-src https://challenges.cloudflare.com` — Turnstile widget iframe.
- `style-src ... https://fonts.googleapis.com` — Google Fonts stylesheet.
- `font-src ... https://fonts.gstatic.com` — Google Fonts files.
- `connect-src 'self' https:` — Worker `*.workers.dev`, Buttondown subscribe, any HTTPS XHR. Tighten to specific hostnames if you want stricter exfil protection.
- `form-action 'self' https://buttondown.com` — Newsletter form posts to Buttondown.
- `frame-ancestors 'none'` — clickjacking protection (replaces and supersedes `X-Frame-Options` for modern browsers).

## After the Transform Rules are live

Once the rules above are confirmed deployed (verify with `curl -I https://jessicarocha.ca/`), do the following cleanup in this repo:
1. Remove the `<meta http-equiv="Content-Security-Policy" ...>` block from `src/layouts/BaseLayout.astro`.
2. Remove the `<meta name="referrer" ...>` tag from the same file (now an HTTP header).
3. Remove the `turnstileCsp` prop and `turnstileCspContent` constant from `BaseLayout.astro` and its caller in `src/pages/contact.astro`.
4. Revert `vite.build.assetsInlineLimit: 0` in `astro.config.mjs` — the workaround for `script-src 'self'` is no longer needed once the edge CSP allows hashed inline.

## Verification

```sh
curl -sI https://jessicarocha.ca/ | grep -iE 'content-security-policy|x-frame|x-content|referrer|permissions'
```

All five headers should appear, with the CSP matching the value configured in Cloudflare.
