export const GOOGLE_PLAY_CURSED_BLOOD =
  'https://play.google.com/store/books/details/Jessica_Rocha_Cursed_Blood?id=ZnfBEQAAQBAJ';

export type BookLink = { label: string; href: string };

export type Book = {
  title: string;
  slug: string;
  year: string;
  genre: string;
  tagline?: string;
  description: string[];
  cover: string;
  amazonLink?: string;
  links?: BookLink[];
  format?: string;
  isbn?: string;
  latest?: boolean;
};

export const books: Book[] = [
  {
    title: 'Cursed Blood',
    slug: 'cursed-blood',
    year: '2026',
    genre: 'Steamy Vampire Romance',
    description: [
      'Cursed Blood is a steamy vampire romance set in a world reminiscent of the medieval era, where danger and desire intertwine.',
      'Elizabeth',
      'Some call me cursed, others merely tolerate me and a few call me friend. Deep down, I’ve always felt the weight of my past—the guilt of something that happened in my childhood, something that can never be erased.',
      'No matter how many times I’m told I’m not to blame, the burden of it eats at me. The only thing I can do is become stronger.',
      'Christopher is the first friend I’ve made since I arrived at the academy all those years ago. But I want more than just his friendship… But will he accept me? Do I even deserve his love?',
    ],
    cover: '/images/covers/cursed-blood.jpg',
    amazonLink: 'https://www.amazon.com/Cursed-Blood-Jessica-Rocha-ebook/dp/B0GNDH8LN5',
    isbn: '978-1738894536',
    latest: true,
  },
  {
    title: 'Broken?',
    slug: 'broken',
    year: '2021',
    genre: 'Contemporary Romance',
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
    slug: 'death-love-and-zombies',
    year: '2021',
    genre: 'Fantasy Romance · Werewolf',
    description: [
      'Death, Love, and Zombies is a fantasy, romance novel based not so far in the future. Featuring Octavia as a strong female lead and her love interest Anubis. They traverse the zombie apocalypse with a slight twist - Werewolves.',
      'Octavia It\'s the year 20... Well honestly the year doesn\'t matter, we have been spiraling towards this for a long time. Pollution, waste, overpopulation… Human greed, the destruction we have caused, the cruelty of humans… We are our own downfall. Some of us try to make a difference, but it only takes a few to ruin it for the rest of us… They say you reap what you sow...',
    ],
    cover: '/images/covers/death-love-and-zombies.jpg',
    amazonLink: 'https://www.amazon.com/Death-Love-Zombies-Jessica-Rocha/dp/1777284953',
  },
  {
    title: 'Hunt',
    slug: 'hunt',
    year: '2020',
    genre: 'Steamy Werewolf Romance',
    description: [
      'Hunt is a steamy werewolf romance, featuring Ella and Leo.Ella and Leo cross paths when Leo\'s sister goes missing and his parents are murdered. When he returns home to find his sister he meets a young she-wolf Ella who is fighting her own battles within her pack run by a monstrous alpha. Ella and Leo must work together, can they resist the lusty tension, find Leo\'s sister, and defeat the alpha?',
    ],
    cover: '/images/covers/hunt.jpg',
    amazonLink: 'https://www.amazon.com/Hunt-Jessica-Rocha/dp/1777284929',
  },
];

export type BookPageEntry = {
  title: string;
  year: string;
  genre: string;
  description: string[];
  cover: string;
  links: BookLink[];
  format: string;
  isbn?: string;
  tagline?: string;
};

export const booksPageEntries: BookPageEntry[] = [
  {
    title: 'Cursed Blood',
    year: '2026',
    genre: 'Steamy Vampire Romance',
    description: books[0].description,
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
    year: '2021',
    genre: 'Contemporary Romance',
    description: books[1].description,
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
    year: '2021',
    genre: 'Fantasy Romance · Werewolf',
    description: books[2].description,
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
    year: '2020',
    genre: 'Steamy Werewolf Romance',
    description: books[3].description,
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
];

export function bookExcerpt(book: Book, maxParagraphs = 2): string {
  const paragraphs = book.description.filter((p) => p.trim().length > 20);
  return paragraphs.slice(0, maxParagraphs).join(' ');
}
