# Add Book — Examples

Replace placeholders (`YOUR_*`) with **actual** values from the user or source pages.

**Synopsis:** paste verbatim from Inkitt `.story-summary`, Amazon description, etc. If you do not have synopsis text, ask the user — do not use placeholder prose like `Synopsis paragraph…` in the live site data.

## Regular + Inkitt only (coming soon, not Galatea)

Use for standard titles readable on Inkitt now, with retail release still pending.

`books` entry:

```typescript
{
  title: 'YOUR_TITLE',
  slug: BookSlug.YourBook, // enum value = 'your-slug'
  genre: 'YOUR_GENRE',
  status: 'coming-soon',
  releaseChannel: 'regular',
  releaseLabel: 'Read on Inkitt',
  description: [
    'PASTE_VERBATIM_SYNOPSIS_FROM_INKITT_OR_USER',
  ],
  cover: '/images/covers/your-slug.jpg', // or PLACEHOLDER_COVER
  links: [
    { label: 'Inkitt', href: 'https://www.inkitt.com/stories/YOUR_STORY_ID' },
  ],
},
```

Matching `booksPageEntries` entry (same `slug: BookSlug.YourBook`, `status`, `releaseChannel`, `links`, `description: getBook(BookSlug.YourBook).description`).

## Galatea + Inkitt preview (coming soon)

Use only for Galatea partnership titles — **not** for regular Inkitt serials.

`books` entry:

```typescript
{
  title: 'YOUR_TITLE',
  slug: BookSlug.YourBook, // enum value = 'your-slug'
  genre: 'YOUR_GENRE',
  status: 'coming-soon',
  releaseChannel: 'galatea',
  releaseLabel: 'Galatea · Coming soon', // optional; omit year if unknown
  description: [
    'PASTE_VERBATIM_SYNOPSIS_FROM_INKITT_OR_USER',
  ],
  cover: PLACEHOLDER_COVER,
  links: [
    { label: 'Inkitt', href: 'https://www.inkitt.com/stories/YOUR_STORY_ID' },
    // { label: 'Galatea', href: 'YOUR_GALATEA_URL' }, // add when live
  ],
},
```

Matching `booksPageEntries` entry (same `slug: BookSlug.YourBook`, `status`, `releaseChannel`, `links`, `description: getBook(BookSlug.YourBook).description`).

## Traditional coming soon (no links yet)

```typescript
{
  title: 'YOUR_TITLE',
  slug: BookSlug.YourBook, // enum value = 'your-slug'
  genre: 'YOUR_GENRE',
  status: 'coming-soon',
  releaseChannel: 'traditional',
  releaseLabel: 'Coming soon',
  description: ['PASTE_VERBATIM_SYNOPSIS_FROM_USER'],
  cover: PLACEHOLDER_COVER,
},
```

`booksPageEntries`: same fields, no `links`, no `format`/`isbn` until release.

## Released (full retail)

```typescript
{
  title: 'YOUR_TITLE',
  slug: BookSlug.YourBook, // enum value = 'your-slug'
  year: '2027',
  genre: 'YOUR_GENRE',
  status: 'released',
  description: ['PASTE_VERBATIM_SYNOPSIS_FROM_RETAILER_OR_USER'],
  cover: '/images/covers/your-slug.jpg',
  amazonLink: 'https://www.amazon.com/...',
  isbn: '978-...',
},
```

`booksPageEntries`:

```typescript
{
  title: 'YOUR_TITLE',
  year: '2027',
  genre: 'YOUR_GENRE',
  status: 'released',
  description: getBook(BookSlug.YourBook).description,
  cover: '/images/covers/your-slug.jpg',
  links: [
    { label: 'Amazon (eBook)', href: '...' },
    { label: 'Goodreads', href: '...' },
  ],
  format: 'eBook',
  isbn: '978-...',
},
```

## Graduating from coming soon to released

1. Change `status` to `'released'` in both arrays.
2. Add `year`, `format`, `isbn`, full `links`; add `amazonLink` on `books` if using homepage Amazon CTA.
3. Update `cover` path to final JPG.
4. Remove `releaseLabel` if `year` is set.
5. Optionally: `latest: true` on this book, remove `latest` from prior spotlight book.
