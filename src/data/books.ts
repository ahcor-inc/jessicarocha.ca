export const GOOGLE_PLAY_CURSED_BLOOD =
  'https://play.google.com/store/books/details/Jessica_Rocha_Cursed_Blood?id=ZnfBEQAAQBAJ';

export const PLACEHOLDER_COVER = '/images/covers/placeholder.jpg';

export type BookLink = { label: string; href: string };
export type BookStatus = 'released' | 'coming-soon';
export type ReleaseChannel = 'regular' | 'traditional' | 'galatea';

export enum BookSlug {
  CursedBlood = 'cursed-blood',
  Broken = 'broken',
  DeathLoveAndZombies = 'death-love-and-zombies',
  Hunt = 'hunt',
  SlapShot = 'slap-shot',
  TheAcademy = 'the-academy',
  ACollectionOfStories = 'a-collection-of-stories',
  RoyalBlood = 'royal-blood',
  LittleRedCloak = 'little-red-cloak',
  NewWorld = 'new-world',
  TheHalfFaeAndVampireCeo = 'the-half-fae-and-vampire-ceo',
}

export type Book = {
  title: string;
  slug: BookSlug;
  year?: string;
  genre: string;
  tagline?: string;
  description: string[];
  cover: string;
  coverDraft?: boolean;
  status?: BookStatus;
  releaseChannel?: ReleaseChannel;
  releaseLabel?: string;
  amazonLink?: string;
  links?: BookLink[];
  format?: string;
  isbn?: string;
  latest?: boolean;
};

export type BookPageEntry = {
  title: string;
  slug: BookSlug;
  year?: string;
  genre: string;
  description: string[];
  cover: string;
  coverDraft?: boolean;
  status?: BookStatus;
  releaseChannel?: ReleaseChannel;
  releaseLabel?: string;
  links?: BookLink[];
  format?: string;
  isbn?: string;
  tagline?: string;
};

export function getBook(slug: BookSlug): Book {
  const book = books.find((b) => b.slug === slug);
  if (!book) throw new Error(`Book not found: ${slug}`);
  return book;
}

export const books: Book[] = [
  {
    title: 'Slap Shot Book 1: A Hockey Romance',
    slug: BookSlug.SlapShot,
    year: '2026',
    genre: 'Hockey Romance',
    status: 'released',
    description: [
      "Molly and Aster have spent years side by side, growing from childhood best friends into fierce university hockey teammates with Olympic dreams shining ahead. They share everything: early practices, late-night laughs, and a bond that feels unbreakable. But one impulsive night tilts the balance they've always trusted.",
      "Suddenly, every glance lingers a little longer, every touch feels louder, and the lines between friendship and something more begin to blur. Just as emotions start skating into risky territory, an unsettling shadow creeps into their world, forcing them closer than ever. Between ambition, loyalty, and rising tension, Molly must face a truth she's long avoided. Because when hearts and dreams collide, staying safe might mean risking everything she thought she knew.",
    ],
    cover: '/images/covers/slap-shot.jpg',
    links: [
      { label: 'Galatea', href: 'https://galatea.com/en/story/slap-shot-book-1-a-hockey-romance-20091' },
      { label: 'Inkitt', href: 'https://www.inkitt.com/stories/1430321' },
    ],
    format: 'Galatea',
    latest: true,
  },
  {
    title: 'Cursed Blood',
    slug: BookSlug.CursedBlood,
    year: '2026',
    genre: 'Steamy Vampire Romance',
    status: 'released',
    description: [
      'Cursed Blood is a steamy vampire romance set in a world reminiscent of the medieval era, where danger and desire intertwine.',
      'Elizabeth',
      'Some call me cursed, others merely tolerate me and a few call me friend. Deep down, I\'ve always felt the weight of my past—the guilt of something that happened in my childhood, something that can never be erased.',
      'No matter how many times I\'m told I\'m not to blame, the burden of it eats at me. The only thing I can do is become stronger.',
      'Christopher is the first friend I\'ve made since I arrived at the academy all those years ago. But I want more than just his friendship… But will he accept me? Do I even deserve his love?',
    ],
    cover: '/images/covers/cursed-blood.jpg',
    amazonLink: 'https://www.amazon.com/Cursed-Blood-Jessica-Rocha-ebook/dp/B0GNDH8LN5',
    isbn: '978-1738894536',
  },
  {
    title: 'Broken?',
    slug: BookSlug.Broken,
    year: '2021',
    genre: 'Contemporary Romance',
    status: 'released',
    description: [
      'Natalie:',
      'Sometimes I wonder how I got here. When everything was so perfect… I feel numb. I get feeling like this sometimes when I think of us… Of him... Of Connor… He just left me like that… After all, we have been through… After 4 years together… He just up and leaves me… So he can sleep around… Bastard.',
      'My old high school friend Blake offers me comfort… Even though I\'m taking advantage… Just when I start to heal, Connor just keeps popping up… Will I be able to heal my wounded heart and move on? Will Connor let me?',
    ],
    cover: '/images/covers/broken.jpg',
    amazonLink: 'https://www.amazon.ca/Broken-Jessica-Rocha-ebook/dp/B08T84PWWH',
    isbn: '978-1777284985',
    links: [
      { label: 'Inkitt', href: 'https://www.inkitt.com/stories/808585' },
      { label: 'Goodreads', href: 'https://www.goodreads.com/book/show/56855094-broken' },
    ],
  },
  {
    title: 'Death, Love, and Zombies',
    slug: BookSlug.DeathLoveAndZombies,
    year: '2021',
    genre: 'Fantasy Romance · Werewolf',
    status: 'released',
    description: [
      'Death, Love, and Zombies is a fantasy, romance novel based not so far in the future. Featuring Octavia as a strong female lead and her love interest Anubis. They traverse the zombie apocalypse with a slight twist - Werewolves.',
      'Octavia It\'s the year 20... Well honestly the year doesn\'t matter, we have been spiraling towards this for a long time. Pollution, waste, overpopulation… Human greed, the destruction we have caused, the cruelty of humans… We are our own downfall. Some of us try to make a difference, but it only takes a few to ruin it for the rest of us… They say you reap what you sow...',
    ],
    cover: '/images/covers/death-love-and-zombies.jpg',
    amazonLink: 'https://www.amazon.com/Death-Love-Zombies-Jessica-Rocha/dp/1777284953',
  },
  {
    title: 'Hunt',
    slug: BookSlug.Hunt,
    year: '2020',
    genre: 'Steamy Werewolf Romance',
    status: 'released',
    description: [
      'Hunt is a steamy werewolf romance, featuring Ella and Leo.Ella and Leo cross paths when Leo\'s sister goes missing and his parents are murdered. When he returns home to find his sister he meets a young she-wolf Ella who is fighting her own battles within her pack run by a monstrous alpha. Ella and Leo must work together, can they resist the lusty tension, find Leo\'s sister, and defeat the alpha?',
    ],
    cover: '/images/covers/hunt.jpg',
    amazonLink: 'https://www.amazon.com/Hunt-Jessica-Rocha/dp/1777284929',
  },
  {
    title: 'The Half-Fae and Vampire CEO',
    slug: BookSlug.TheHalfFaeAndVampireCeo,
    genre: 'Romance',
    status: 'coming-soon',
    releaseChannel: 'regular',
    releaseLabel: 'Read on Inkitt',
    description: [
      'Being half-human and half-Fae has its drawbacks...',
      'I\'m not fully accepted by humans or Fae. Not Fae enough for them and not human enough for the humans. I don\'t even know who my parents are, maybe they abandoned me or maybe they are dead. I don\'t really have time to worry about that, just getting by day to day is hard enough.',
      'I am a professional Thief, it\'s what pays the bills... But will what was suppose to be a simple job turn into a complicated mess?',
    ],
    cover: '/images/covers/the-half-fae-and-vampire-ceo.jpg',
    links: [
      { label: 'Inkitt', href: 'https://www.inkitt.com/stories/1874858' },
    ],
  },
  {
    title: 'The Academy',
    slug: BookSlug.TheAcademy,
    genre: 'Steamy Werewolf Romance',
    status: 'coming-soon',
    releaseChannel: 'regular',
    releaseLabel: 'Read on Inkitt',
    description: [
      "Werewolves usually have a pack, but me? I'm more of a lone wolf. Life hasn't been kind to me, and I am done taking people\'s shit. With my parents gone and the only lead I have taking me to The Academy, I start a new chapter. Will I find the answers I am looking for? At the minimum, maybe I will find some distractions of the male variety..."
    ],
    cover: '/images/covers/the-academy.jpg',
    links: [
      { label: 'Inkitt', href: 'https://www.inkitt.com/stories/1721935' },
    ],
  },
  {
    title: 'A Collection Of Stories',
    slug: BookSlug.ACollectionOfStories,
    genre: 'Horror',
    status: 'coming-soon',
    releaseChannel: 'regular',
    releaseLabel: 'Read on Inkitt',
    description: [
      'Stories told by the fire in hushed voices, that have you turning on the light, checking the shadows and questioning yourself.',
      'Each chapter is a  new horror or psychological delight to be discovered…',
      'Hope you enjoy !',
      '*Possible trigger warnings - Blood, gore, violence, stalking etc.*',
    ],
    cover: '/images/covers/a-collection-of-stories.jpg',
    links: [
      { label: 'Inkitt', href: 'https://www.inkitt.com/stories/1643202' },
    ],
  },
  {
    title: 'Royal Blood',
    slug: BookSlug.RoyalBlood,
    genre: 'Steamy Vampire Romance',
    status: 'coming-soon',
    releaseChannel: 'regular',
    releaseLabel: 'Read on Inkitt',
    description: [
      'After we made it through the chaos that Devastato caused I truly believed peace was within our grasp. We could finally see the light at the end of the tunnel, but fate had other plans for us.',
      'A new threat wreaks havoc on our lives, peace no longer seems like an option. Secrets from the past are brought to light and with it comes new challenges. New dangers.',
      'As the darkness closes in on us and that light becomes smaller and further away, I am forced to confront a harrowing question…',
      'Can the bond I share with Christopher withstand what\'s to come? or will it be shattered forever....',
    ],
    cover: '/images/covers/royal-blood.jpg',
    links: [
      { label: 'Inkitt', href: 'https://www.inkitt.com/stories/1661625' },
    ],
  },
  {
    title: 'Little Red Cloak',
    slug: BookSlug.LittleRedCloak,
    year: '2025',
    genre: 'Steamy Werewolf Romance',
    status: 'released',
    description: [
      'My parents always warned me not to go out into the woods at night... But I am one that doesn\'t always listen... Secrets are revealed and the course of my life is changed forever. Will Hunter accept me? Or am I fated to another?',
      'Little Red Cloak is a "little red riding hood" variation story.',
      'Possible trigger warning for some violence and adult situations/talk or forced situations.',
    ],
    cover: '/images/covers/little-red-cloak.jpg',
    amazonLink: 'https://www.amazon.ca/dp/B0HG4VNLNF',
    isbn: '978-1738894550',
    links: [
      { label: 'Inkitt', href: 'https://www.inkitt.com/stories/1420529' },
    ],
  },
  {
    title: 'New World',
    slug: BookSlug.NewWorld,
    genre: 'Post-Apocalyptic Romance',
    status: 'coming-soon',
    releaseChannel: 'traditional',
    releaseLabel: 'Coming soon',
    description: [
      "The world wasn't always this way, the few books I've found about the past show large buildings, cars, normal bears - but less trees. I will say that at least, as humanity dwindled the vegetation took over. Food can be scarce and the top percent reap benefits that I can only dream of. The only equalizer as they call it is our mandatory training, we call it the games.",
      "Though it's not equal, the rich still have the scale stacked in their favour. And if you aren't careful this game can cost you your life. They say it's a new world, I just say it's the same shit, different day. I need to survive, not draw attention and get back to my Mom. Now if only Hunter would leave me alone to do that…",
    ],
    cover: '/images/covers/new-world.jpg',
  },
];

export const booksPageEntries: BookPageEntry[] = [
  {
    title: 'Slap Shot Book 1: A Hockey Romance',
    slug: BookSlug.SlapShot,
    year: '2026',
    genre: 'Hockey Romance',
    status: 'released',
    description: getBook(BookSlug.SlapShot).description,
    cover: '/images/covers/slap-shot.jpg',
    links: [
      { label: 'Galatea', href: 'https://galatea.com/en/story/slap-shot-book-1-a-hockey-romance-20091' },
      { label: 'Inkitt', href: 'https://www.inkitt.com/stories/1430321' },
    ],
    format: 'Galatea',
  },
  {
    title: 'Cursed Blood',
    slug: BookSlug.CursedBlood,
    year: '2026',
    genre: 'Steamy Vampire Romance',
    status: 'released',
    description: getBook(BookSlug.CursedBlood).description,
    cover: '/images/covers/cursed-blood.jpg',
    links: [
      { label: 'Amazon (eBook)', href: 'https://www.amazon.com/Cursed-Blood-Jessica-Rocha-ebook/dp/B0GNDH8LN5' },
      { label: 'Google Play Books', href: GOOGLE_PLAY_CURSED_BLOOD },
      { label: 'Goodreads', href: 'https://www.goodreads.com/book/show/248002848-cursed-blood' },
    ],
    format: 'eBook',
    isbn: '978-1738894536',
  },
  {
    title: 'Broken?',
    slug: BookSlug.Broken,
    year: '2021',
    genre: 'Contemporary Romance',
    status: 'released',
    description: getBook(BookSlug.Broken).description,
    cover: '/images/covers/broken.jpg',
    links: [
      { label: 'Amazon (eBook)', href: 'https://www.amazon.ca/Broken-Jessica-Rocha-ebook/dp/B08T84PWWH' },
      { label: 'Goodreads', href: 'https://www.goodreads.com/book/show/56855094-broken' },
      { label: 'Inkitt', href: 'https://www.inkitt.com/stories/808585' },
    ],
    format: 'eBook',
    isbn: '978-1777284985',
  },
  {
    title: 'Death, Love, and Zombies',
    slug: BookSlug.DeathLoveAndZombies,
    year: '2021',
    genre: 'Fantasy Romance · Werewolf',
    status: 'released',
    description: getBook(BookSlug.DeathLoveAndZombies).description,
    cover: '/images/covers/death-love-and-zombies.jpg',
    links: [
      { label: 'Amazon (Paperback)', href: 'https://www.amazon.com/Death-Love-Zombies-Jessica-Rocha/dp/1777284953' },
      { label: 'Amazon (eBook)', href: 'https://www.amazon.com/Death-Love-Zombies-Jessica-Rocha-ebook/dp/B08T7G2G5Z' },
      { label: 'Bookshop.org', href: 'https://bookshop.org/p/books/death-love-and-zombies-jessica-rocha/16082328' },
      { label: 'Inkitt', href: 'https://www.inkitt.com/stories/739000' },
      { label: 'Goodreads', href: 'https://www.goodreads.com/book/show/56691628-death-love-and-zombies' },
    ],
    format: 'Paperback & eBook',
    isbn: '978-1777284954',
  },
  {
    title: 'Hunt',
    slug: BookSlug.Hunt,
    year: '2020',
    genre: 'Steamy Werewolf Romance',
    status: 'released',
    description: getBook(BookSlug.Hunt).description,
    cover: '/images/covers/hunt.jpg',
    links: [
      { label: 'Amazon (Paperback)', href: 'https://www.amazon.com/Hunt-Jessica-Rocha/dp/1777284929' },
      { label: 'Amazon (eBook)', href: 'https://www.amazon.com/Hunt-Jessica-Rocha-ebook/dp/B08C7622HL' },
      { label: 'Inkitt', href: 'https://www.inkitt.com/stories/739254' },
      { label: 'Goodreads', href: 'https://www.goodreads.com/book/show/57020307-hunt' },
    ],
    format: 'Paperback & eBook',
    isbn: '978-1777284923',
  },
  {
    title: 'The Academy',
    slug: BookSlug.TheAcademy,
    genre: 'Steamy Werewolf Romance',
    status: 'coming-soon',
    releaseChannel: 'regular',
    releaseLabel: 'Read on Inkitt',
    description: getBook(BookSlug.TheAcademy).description,
    cover: '/images/covers/the-academy.jpg',
    links: [
      { label: 'Inkitt', href: 'https://www.inkitt.com/stories/1721935' },
    ],
  },
  {
    title: 'A Collection Of Stories',
    slug: BookSlug.ACollectionOfStories,
    genre: 'Horror',
    status: 'coming-soon',
    releaseChannel: 'regular',
    releaseLabel: 'Read on Inkitt',
    description: getBook(BookSlug.ACollectionOfStories).description,
    cover: '/images/covers/a-collection-of-stories.jpg',
    links: [
      { label: 'Inkitt', href: 'https://www.inkitt.com/stories/1643202' },
    ],
  },
  {
    title: 'Royal Blood',
    slug: BookSlug.RoyalBlood,
    genre: 'Steamy Vampire Romance',
    status: 'coming-soon',
    releaseChannel: 'regular',
    releaseLabel: 'Read on Inkitt',
    description: getBook(BookSlug.RoyalBlood).description,
    cover: '/images/covers/royal-blood.jpg',
    links: [
      { label: 'Inkitt', href: 'https://www.inkitt.com/stories/1661625' },
    ],
  },
  {
    title: 'Little Red Cloak',
    slug: BookSlug.LittleRedCloak,
    year: '2025',
    genre: 'Steamy Werewolf Romance',
    status: 'released',
    description: getBook(BookSlug.LittleRedCloak).description,
    cover: '/images/covers/little-red-cloak.jpg',
    links: [
      { label: 'Amazon (eBook)', href: 'https://www.amazon.ca/dp/B0HG4VNLNF' },
      { label: 'Amazon (Paperback)', href: 'https://www.amazon.ca/dp/173889455X' },
      { label: 'Inkitt', href: 'https://www.inkitt.com/stories/1420529' },
    ],
    format: 'Paperback & eBook',
    isbn: '978-1738894550',
  },
  {
    title: 'New World',
    slug: BookSlug.NewWorld,
    genre: 'Post-Apocalyptic Romance',
    status: 'coming-soon',
    releaseChannel: 'traditional',
    releaseLabel: 'Coming soon',
    description: getBook(BookSlug.NewWorld).description,
    cover: '/images/covers/new-world.jpg',
  },
  {
    title: 'The Half-Fae and Vampire CEO',
    slug: BookSlug.TheHalfFaeAndVampireCeo,
    genre: 'Romance',
    status: 'coming-soon',
    releaseChannel: 'regular',
    releaseLabel: 'Read on Inkitt',
    description: getBook(BookSlug.TheHalfFaeAndVampireCeo).description,
    cover: '/images/covers/the-half-fae-and-vampire-ceo.jpg',
    links: [
      { label: 'Inkitt', href: 'https://www.inkitt.com/stories/1874858' },
    ],
  },
];

/** Fragment id and path for deep-linking to a book on `/books`. */
export function bookDetailsHref(slug: BookSlug): string {
  return `/books#${slug}`;
}

export function isComingSoon(book: { status?: BookStatus }): boolean {
  return book.status === 'coming-soon';
}

export function bookMetaLabel(book: { genre: string; year?: string; releaseLabel?: string }): string {
  const datePart = book.releaseLabel ?? book.year;
  return datePart ? `${book.genre} · ${datePart}` : book.genre;
}

function releaseYear(book: { year?: string }): number {
  const parsed = Number.parseInt(book.year ?? '', 10);
  return Number.isFinite(parsed) ? parsed : Number.NEGATIVE_INFINITY;
}

/** Newest published year first; same-year titles keep source order. */
export function byReleaseYearDesc<T extends { year?: string }>(a: T, b: T): number {
  return releaseYear(b) - releaseYear(a);
}

export const releasedBooks = books.filter((b) => !isComingSoon(b)).sort(byReleaseYearDesc);
export const upcomingBooks = books.filter(isComingSoon);
export const releasedBooksPageEntries = booksPageEntries
  .filter((b) => !isComingSoon(b))
  .sort(byReleaseYearDesc);
export const upcomingBooksPageEntries = booksPageEntries.filter(isComingSoon);

export function bookExcerpt(book: Book, maxParagraphs = 2): string {
  const paragraphs = book.description.filter((p) => p.trim().length > 20);
  return paragraphs.slice(0, maxParagraphs).join(' ');
}

export function pickQuoteBook(pool: Book[], excludeTitle?: string): Book | undefined {
  const candidates = excludeTitle
    ? pool.filter((b) => b.title !== excludeTitle)
    : pool;
  if (candidates.length === 0) return undefined;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export function getLatestBook(): Book {
  return releasedBooks.find((b) => b.latest) ?? releasedBooks[0];
}
