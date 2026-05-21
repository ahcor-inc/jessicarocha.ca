---
name: add-book
description: Adds or updates Jessica Rocha books on jessicarocha.ca, including coming-soon and partial-release states (Regular/Inkitt, Galatea, traditional retailers). Use when adding a new book, updating release links, or changing coming-soon status.
---

# Add Book (jessicarocha.ca)

## Data source

All book content lives in [`src/data/books.ts`](src/data/books.ts):

- `books` — homepage (spotlight, Upcoming grid, All Books grid)
- `booksPageEntries` — `/books` page (released entries, then Upcoming section)

Keep both arrays in sync for the same title (reuse `description` via `getBook(BookSlug.YourBook).description`). Append new titles at the end of both arrays and add a matching `BookSlug` enum member (value = kebab-case slug).

## Content rules (required)

Use **only verified source text** — from the author, retailer pages, Inkitt (`data-summary` / `.story-summary`), Amazon, Goodreads, etc.

| Field | Source | If missing |
|-------|--------|------------|
| **Synopsis** (`description`) | Copy from source verbatim (light typo fixes OK) | **Stop and ask the user** for synopsis text. Do not draft, expand, or infer from chapter excerpts. |
| **Genre** | Author/retailer listing or explicit user input | Ask the user. Do not guess from tags or story themes alone. |
| **Title, links, ISBN, year** | User message or source page | Ask if not provided and not on the page. |
| **Cover** | Download from provided URL or Inkitt `data-cover-url` | Use `PLACEHOLDER_COVER` only if no cover URL exists; do not substitute unrelated art. |

**Never** invent marketing copy, extra synopsis paragraphs, or plot details not present in an approved source.

## Release types (pick one)

| Type | `releaseChannel` | Use when |
|------|------------------|----------|
| **Regular** | `'regular'` | Standard Jessica Rocha title — **not** a Galatea deal. May be on Inkitt now; Amazon/retail later. |
| **Galatea** | `'galatea'` | Galatea partnership — Inkitt preview chapters, then Galatea app release. |
| **Traditional** | `'traditional'` | Retail-first (Amazon, etc.) — no platform links until retailers are live. |

**Do not** use `galatea` for Inkitt-only serials or books that will never go to Galatea.

## Prerequisites

Gather before editing:

- [ ] Title and `slug` (kebab-case, matches cover filename and `/books#slug` anchor)
- [ ] **Synopsis** (actual text from user or source — see Content rules)
- [ ] **Genre** (from source or user — do not infer)
- [ ] Release type: **Regular**, **Galatea**, or **Traditional** (see table)
- [ ] Cover file path or placeholder
- [ ] Retailer / platform URLs (if any)
- [ ] Year and/or `releaseLabel` (optional if TBD)

## Decision tree

```
New book?
├─ Galatea release (Inkitt preview may be live)
│  └─ status: 'coming-soon', releaseChannel: 'galatea'
│     links: Inkitt preview now; add Galatea when URL exists
├─ Regular release (Inkitt and/or retail — NOT Galatea)
│  ├─ Readable on Inkitt now, retail TBD
│  │  └─ status: 'coming-soon', releaseChannel: 'regular'
│  │     links: [{ label: 'Inkitt', href: '...' }]
│  └─ Already on retailers
│     └─ status: 'released', releaseChannel omitted or 'regular'
│        full links, format, isbn, final cover
├─ Traditional release (retailers not live yet, no Inkitt)
│  └─ status: 'coming-soon', releaseChannel: 'traditional'
│     omit links until live
└─ Already published (any channel)
   └─ status: 'released' (or omit — defaults to released)
      full links, format, isbn, final cover
```

## Where books appear

| `status` | Homepage spotlight | Upcoming Books (home + /books) | All Books grid |
|----------|-------------------|-------------------------------|----------------|
| `coming-soon` | No | Yes | No |
| `released` | Only if `latest: true` | No | Yes |

**Spotlight:** set `latest: true` on exactly one **released** book. Never on `coming-soon`.

## Step-by-step

1. **Gather copy** — pull title, synopsis, genre, and links from the source page or user message. If synopsis (or genre) is not available, **ask the user before editing** `books.ts`.

2. **Cover** — add `public/images/covers/{slug}.jpg`, or use `PLACEHOLDER_COVER` (`/images/covers/placeholder.jpg`) until final art exists. For Inkitt: prefer vertical `data-cover-url` (`cdn-gcs.inkitt.com/vertical_storycovers/iphone_*.jpg`); horizontal `og:image` is fallback only.

3. **Append to `books`** — new coming-soon titles go at end of array (order within Upcoming grid only).

4. **Append to `booksPageEntries`** — matching title; same `status`, `releaseChannel`, `links`, `year` / `releaseLabel`.

5. **Set fields** per scenario (see [examples.md](examples.md)).

6. **On full release** — change `status` to `'released'`, add `format`, `isbn`, retailer `links`, swap `cover` if needed. Book moves to All Books automatically. Remove from upcoming by changing status only.

7. **Verify** — `npm run build`; check `/` order: latest quote → Upcoming (if any) → random quote (only when Upcoming exists) → All Books; `/books`: released list → Upcoming Books header.

## Field reference

```typescript
status?: 'released' | 'coming-soon';      // default released
releaseChannel?: 'regular' | 'traditional' | 'galatea';
releaseLabel?: string;                    // when year unknown, e.g. "Read on Inkitt"
year?: string;
links?: { label: string; href: string }[];
latest?: boolean;                         // released spotlight only
```

**Meta line:** `bookMetaLabel()` → `Genre · year` or `Genre · releaseLabel`.

**Helpers:** `releasedBooks`, `upcomingBooks`, `releasedBooksPageEntries`, `upcomingBooksPageEntries`, `getLatestBook()`, `isComingSoon()`, `bookDetailsHref(slug)` → `/books#slug`.

**Deep links:** `BookSlug` is the HTML `id` on each `/books` entry (e.g. `BookSlug.TheAcademy` → `the-academy`). Homepage “More details” links use `bookDetailsHref(BookSlug.YourBook)`.

**`BookSlug` enum:** string slug shared by `books` and `booksPageEntries` — e.g. `BookSlug.TheAcademy = 'the-academy'`. Use `slug: BookSlug.YourBook` in both arrays; use `getBook(BookSlug.YourBook)` to reference the `books` entry from page entries.

## Regular + Inkitt (coming soon)

- `releaseChannel: 'regular'`
- `links`: Inkitt only while serial is on Inkitt and retail is pending
- `releaseLabel`: e.g. `'Read on Inkitt'`
- Cover: pull from Inkitt `og:image` or use placeholder
- **Not** Galatea — do not set `releaseChannel: 'galatea'`

## Galatea + Inkitt preview

- `releaseChannel: 'galatea'`
- First link: `{ label: 'Inkitt', href: '...' }` (preview chapters)
- When Galatea URL is ready: `{ label: 'Galatea', href: '...' }`
- `releaseLabel` often mentions Galatea (e.g. `'Galatea · July 24, 2026'`)
- Cover: placeholder until finalized

## Traditional coming soon

- `releaseChannel: 'traditional'`
- Omit `links` (or empty array)
- UI shows “Retailer links coming soon.” on `/books`
- No JSON-LD until released

## Graduating to released

1. `status: 'released'`
2. Add `format`, `isbn`, full `links`
3. Replace placeholder cover if needed
4. Set `year` if known; remove `releaseLabel` if redundant
5. Optionally set `latest: true` and clear `latest` on previous spotlight book

## Files to touch

| Change | Files |
|--------|-------|
| New/update book | `src/data/books.ts`, cover in `public/images/covers/` |
| Rare UI change | `src/pages/index.astro`, `src/pages/books.astro`, `src/styles/global.css` |

Do not edit page templates when only adding book data.

## Additional resources

- Copy-paste templates: [examples.md](examples.md)
