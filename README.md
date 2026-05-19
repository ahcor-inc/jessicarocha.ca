# jessicarocha.ca

Source for [jessicarocha.ca](https://jessicarocha.ca), the official website of Canadian supernatural-romance author Jessica Rocha.

Static [Astro](https://astro.build) site deployed to GitHub Pages, with a Cloudflare Worker (`workers/contact-form/`) that proxies contact-form submissions to [Brevo](https://www.brevo.com) for delivery. Newsletter signups go to [Buttondown](https://buttondown.com).

## Stack

- **Frontend:** Astro 4 (static output), vanilla HTML/CSS/JS
- **Hosting:** GitHub Pages (apex `jessicarocha.ca`, proxied through Cloudflare)
- **Contact form backend:** Cloudflare Worker → Brevo transactional API
- **Bot mitigation:** Cloudflare Turnstile + honeypot + KV rate limiting
- **Newsletter:** Buttondown embed
- **CI/CD:** GitHub Actions (Pages deploy + Worker deploy)

## Local development

```sh
cp .env.example .env       # fill in the three PUBLIC_* values
yarn install
yarn dev                   # http://localhost:4321
```

Useful scripts:

| Command | What it does |
|---|---|
| `yarn dev` | Astro dev server |
| `yarn build` | Production build to `dist/` |
| `yarn preview` | Serve the built site locally |
| `yarn typecheck` | `astro check` — type-check `.astro` files |
| `yarn format` | Format all source files with Prettier |
| `yarn format:check` | Verify formatting without writing |

To test the contact form end-to-end against a local Worker, run the Worker separately and point `PUBLIC_CONTACT_FORM_ENDPOINT` in `.env` at its dev URL:

```sh
cd workers/contact-form
yarn install
yarn run dev               # wrangler dev — usually http://localhost:8787
```

## First-time setup (fork / new deployment)

If you're standing this site up fresh (your own fork, or a different domain), the order below works end-to-end. Most steps are one-time.

### Prerequisites
- Node 22+
- Yarn
- Wrangler: `npm i -g wrangler && wrangler login`
- Cloudflare account (free tier is fine)
- GitHub repo with Pages enabled

### 1. Buttondown (newsletter)
1. Sign up at [buttondown.com](https://buttondown.com).
2. Your username appears in the embed URL: `https://buttondown.com/<username>`.
3. Save the username for `PUBLIC_BUTTONDOWN_USERNAME`.

### 2. Brevo (transactional email)
1. Sign up at [brevo.com](https://brevo.com).
2. **Verify your sender address** under Senders, Domains & Dedicated IPs → Senders → Add a Sender. Brevo blocks delivery from unverified senders, so this step is non-optional. The address you verify is what you'll set as `CONTACT_FROM_EMAIL`.
3. (Recommended) Add SPF + DKIM records for your domain so deliverability isn't trash. Brevo provides the exact records under Senders → Domains.
4. Generate an API key under Account → SMTP & API → API Keys → Create. Save it — it's only shown once. This becomes the Worker secret `BREVO_API_KEY`.

### 3. Cloudflare Turnstile (CAPTCHA)
1. Cloudflare dashboard → Turnstile → **Add Site**.
2. Widget mode: **Managed** is the safe default.
3. **Hostnames:** add every origin the contact form will be submitted from. For this site that's `jessicarocha.ca`, `www.jessicarocha.ca`, and `localhost` (for dev).
4. You'll get a **Site Key** (public, frontend) and a **Secret Key** (private, Worker).
   - Site Key → `PUBLIC_TURNSTILE_SITE_KEY` (GitHub Actions Variable + local `.env`).
   - Secret Key → Worker secret `TURNSTILE_SECRET` (see next section).

### 4. Cloudflare Worker (contact form backend)

From `workers/contact-form/`:

```sh
wrangler login                                          # if you haven't already
wrangler kv namespace create RATE_LIMIT
wrangler kv namespace create RATE_LIMIT --preview
```

Copy the two returned namespace IDs into `wrangler.toml` under `[[kv_namespaces]]` (`id` and `preview_id`).

Edit `wrangler.toml` `[vars]`:
- `CONTACT_TO_EMAIL` — the inbox that receives messages.
- `CONTACT_FROM_EMAIL` — the Brevo-verified sender from step 2.
- `CONTACT_FROM_NAME` — display name on outgoing mail.
- `ALLOWED_ORIGINS` — comma-separated list of every origin the form will POST from. Include apex, `www`, and any localhost dev ports.

Set the secrets:

```sh
wrangler secret put BREVO_API_KEY
wrangler secret put TURNSTILE_SECRET   # optional but strongly recommended
```

Deploy:

```sh
wrangler deploy
```

The deployed URL (`https://<worker-name>.<account>.workers.dev`) becomes `PUBLIC_CONTACT_FORM_ENDPOINT`.

### 5. GitHub Pages + Actions

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
2. **Settings → Secrets and variables → Actions → Variables** tab (the **Variables** tab, **not** Secrets — these are public values inlined into the built HTML):
   - `PUBLIC_BUTTONDOWN_USERNAME`
   - `PUBLIC_CONTACT_FORM_ENDPOINT`
   - `PUBLIC_TURNSTILE_SITE_KEY`

   The build will fail fast with a clear error if any of these are missing.

3. **For the Worker deploy workflow** (`.github/workflows/deploy-worker.yml`), add a **Secret** (not a Variable):
   - `CLOUDFLARE_API_TOKEN` — create in Cloudflare dashboard → My Profile → API Tokens → **Create Token** → **Create Custom Token**.

     **Permissions** (add each as a row):
     | Type | Resource | Access |
     |---|---|---|
     | Account | Workers Scripts | Edit |
     | Account | Workers KV Storage | Edit |
     | Account | Account Settings | Read |

     **Account Resources:** Include → your specific account (not "All accounts").

     No zone permissions are needed — this Worker runs on its `*.workers.dev` subdomain, not on a custom route. If you later attach the Worker to a route on your zone, add **Zone → Workers Routes → Edit** as well.

4. If using a custom domain, confirm `public/CNAME` matches and add the matching DNS record in Cloudflare. Apex + orange-cloud (proxied) is recommended so [Transform Rules can set security headers site-wide](#security-headers).

5. Push to `main`. The workflow at `.github/workflows/deploy.yml` builds the site; `.github/workflows/deploy-worker.yml` re-deploys the Worker when files under `workers/contact-form/**` change.

## Security headers

GitHub Pages cannot serve custom HTTP response headers. With the domain proxied through Cloudflare, security headers are applied at the edge via **Transform Rules → Modify Response Header**:

| Header | Value |
|---|---|
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `Content-Security-Policy` | See `docs/SECURITY-HEADERS.md` |

Until those rules are in place, a fallback CSP `<meta>` tag is emitted on the contact page only (see `src/layouts/BaseLayout.astro`). Once the edge headers are deployed, the meta tag can be removed.

## Testing

```sh
yarn typecheck                                 # type-check the Astro project
cd workers/contact-form && yarn test           # vitest against the worker
```

The Worker test suite (`workers/contact-form/test/index.test.ts`) covers method handling, origin allowlist, and input validation. It runs under `@cloudflare/vitest-pool-workers` so the actual `fetch` handler is exercised against the workerd runtime with an in-memory KV namespace.

## Project structure

```
.
├── astro.config.mjs               # site, output, sitemap, trailingSlash
├── package.json                   # site deps + scripts
├── src/
│   ├── pages/                     # index, about, books, contact, thank-you
│   ├── layouts/BaseLayout.astro   # head, JSON-LD, header/footer, skip-link, CSP
│   ├── components/                # Header, Footer, NewsletterForm
│   ├── data/books.ts              # book metadata (typed)
│   └── styles/global.css          # design tokens + base styles
├── public/                        # static assets (CNAME, robots.txt, favicon, images)
├── workers/contact-form/          # Cloudflare Worker (Brevo + KV rate limit + Turnstile)
├── docs/SECURITY-HEADERS.md       # CSP + Transform Rules reference
└── .github/workflows/             # Pages deploy + Worker deploy
```

## Where secrets and config live

| Value | Where | Notes |
|---|---|---|
| `PUBLIC_BUTTONDOWN_USERNAME` | Local `.env` + GitHub Actions Variable | Public, inlined into HTML |
| `PUBLIC_CONTACT_FORM_ENDPOINT` | Local `.env` + GitHub Actions Variable | Public, the Worker URL |
| `PUBLIC_TURNSTILE_SITE_KEY` | Local `.env` + GitHub Actions Variable | Public, contact page only |
| `BREVO_API_KEY` | Worker secret (`wrangler secret put`) | Private, never in repo or build |
| `TURNSTILE_SECRET` | Worker secret (`wrangler secret put`) | Private, never in repo or build |
| `CLOUDFLARE_API_TOKEN` | GitHub Actions Secret | For `wrangler deploy` from CI |

## License

[MIT](LICENSE) © Scott Rocha
