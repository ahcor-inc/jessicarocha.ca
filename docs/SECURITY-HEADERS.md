# Security headers (jessicarocha.ca)

The contact page sets a Content-Security-Policy meta tag in **production** when Turnstile is enabled (dev skips it so Astro’s dev toolbar can run). See [`BaseLayout.astro`](../src/layouts/BaseLayout.astro).

GitHub Pages does not support custom HTTP response headers. If the domain is proxied through **Cloudflare** (orange cloud), add these as **Transform Rules → Modify response header** for stronger protection site-wide:

| Header | Suggested value |
|--------|-----------------|
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |

For CSP at the edge, include at minimum:

- `script-src 'self' https://challenges.cloudflare.com` (contact page + Turnstile)
- `frame-src https://challenges.cloudflare.com`
- `connect-src 'self' https://buttondown.com https://*.workers.dev` (newsletter + contact Worker)

Adjust `connect-src` to match your deployed Worker hostname and Buttondown embed URL.
