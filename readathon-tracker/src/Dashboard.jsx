import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  BookOpen,
  Sparkles,
  Dices,
  Award,
  Compass,
  Castle,
  GraduationCap,
  Library,
  Plus,
  ArrowLeftRight,
  CheckCircle2,
  Circle,
  Clock,
  Download,
  Upload,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  Star,
  Search,
  Trash2,
  Edit3,
  Feather,
  Trophy,
  MapPin,
  Scroll,
  X,
  Check,
  Sliders,
  Layers,
  GripVertical,
  Bookmark,
  Crown,
  Flame,
  Heart,
  Eye,
  Info
} from 'lucide-react';

/**
 * ============================================================================
 * THE TRAVELER'S READING LEDGER
 * Enchanted Storybook & Romantic Academia Readathon Dashboard
 * Tracks:
 *  1. Once Upon A Year (OYAY) — Volume 1 (Pre-populated) & Volume 2
 *  2. Romanceopoly 2027 — Interactive 20-Space Campus Board, Clubs & Events
 *  3. Master Bookshelf & Double-Dips — Unified Library & TBR Pool
 * ============================================================================
 */

const STORAGE_KEY = 'travelers_reading_ledger_v1';

// Palette & Department Configurations for Romanceopoly 2027
const ROMANCEOPOLY_DEPARTMENTS = {
  'Dark Psychology': {
    name: 'Dark Psychology',
    icon: '🕯️',
    color: '#5B2C4A',
    bgTint: '#F6EEF3',
    borderTint: '#DEC4D4',
    tagline: 'Morally grey devotion, psychological intrigue & gothic obsession.',
    prompts: [
      'A romance featuring a morally grey love interest or anti-hero.',
      'An enemies-to-lovers story with sharp psychological tension.',
      'A gothic romance set in an isolated manor, castle, or academy.',
      'A romance built around a dangerous secret, masquerade, or double life.',
      'A dark or angst-heavy romance with obsessive, protective devotion.'
    ]
  },
  'Fantasy Theory': {
    name: 'Fantasy Theory',
    icon: '🐉',
    color: '#1E3A2F',
    bgTint: '#EDF3F0',
    borderTint: '#C4D7CE',
    tagline: 'Fae bargains, enchanted realms, royal courts & magical bonds.',
    prompts: [
      'A romantasy featuring fae courts, royal intrigue, or magical politics.',
      'A romance with fated mates, soul bonds, or shared magic.',
      'A story where the couple embarks on a perilous quest across a fantasy realm.',
      'A romance involving a bargain, curse, or enchanted artifact.',
      'A cozy or epic fantasy romance featuring mythical creatures or dragons.'
    ]
  },
  'Historical Studies': {
    name: 'Historical Studies',
    icon: '📜',
    color: '#7C5229',
    bgTint: '#F7F1E8',
    borderTint: '#DFCEB6',
    tagline: 'Candlelit ballrooms, epistolary yearning & timeless eras.',
    prompts: [
      'A Regency or Victorian romance featuring a grand ball or season.',
      'A historical marriage of convenience or arranged betrothal.',
      'A romance featuring letters, diaries, or hidden correspondence.',
      'A romance bridging a strict class divide or rival family feud.',
      'A romance set in a non-Regency historical era or outside Europe.'
    ]
  },
  'Romantic Arts': {
    name: 'Romantic Arts',
    icon: '🌹',
    color: '#8B3A4A',
    bgTint: '#F9EFF1',
    borderTint: '#E2C3C9',
    tagline: 'Beloved tropes, sunlit banter, second chances & heartfelt warmth.',
    prompts: [
      'A classic grumpy × sunshine or opposites-attract romance.',
      'A fake-dating or mutual-pining slow burn romance.',
      'A heartfelt second-chance romance between former lovers or friends.',
      'A forced-proximity romance (only one bed, snowed in, or road trip).',
      'A cozy small-town, bookshop, or artistic passion romance.'
    ]
  },
  'Paranormal Studies': {
    name: 'Paranormal Studies',
    icon: '🌙',
    color: '#2B3A55',
    bgTint: '#EEF1F6',
    borderTint: '#C5CEDE',
    tagline: 'Vampires, witches, haunted estates & immortal yearning.',
    prompts: [
      'A witchy romance featuring covens, potions, or modern magic.',
      'A vampire, shifter, or immortal creature romance.',
      'A romance set in a haunted house or involving ghosts & spirits.',
      'A romance set within a hidden supernatural society or night market.',
      'A paranormal romance where one character hides their true nature.'
    ]
  }
};

const CORE_CURRICULUM_SPACES = [
  {
    id: 'rom-core-1',
    code: 'CORE 101',
    landmark: 'Romance Hall',
    category: 'Core Curriculum',
    accent: '#8B3A4A',
    defaultPrompt: 'A romance featuring a trope you never get tired of.'
  },
  {
    id: 'rom-core-2',
    code: 'CORE 102',
    landmark: 'Compass Wing',
    category: 'Core Curriculum',
    accent: '#1E3A2F',
    defaultPrompt: 'A romance set in a travel destination you dream of visiting.'
  },
  {
    id: 'rom-core-3',
    code: 'CORE 103',
    landmark: 'The Commons',
    category: 'Core Curriculum',
    accent: '#C59B27',
    defaultPrompt: 'A romance recommended by a friend, book club, or fellow student.'
  },
  {
    id: 'rom-core-4',
    code: 'CORE 104',
    landmark: "Registrar's Office",
    category: 'Core Curriculum',
    accent: '#7C5229',
    defaultPrompt: 'A backlist romance from your TBR that has been waiting the longest.'
  },
  {
    id: 'rom-core-5',
    code: 'CORE 105',
    landmark: 'Crying Room',
    category: 'Core Curriculum',
    accent: '#5B2C4A',
    defaultPrompt: 'An emotional, angsty romance guaranteed to tug at your heartstrings.'
  }
];

const INITIAL_CLUBS = [
  {
    id: 'club-hearts-spoons',
    name: 'Hearts & Spoons',
    icon: '🧁',
    color: '#8B3A4A',
    description: 'Culinary arts, cozy bakeries, tea parlors & comforting domesticity.',
    prompts: [
      { id: 'hs-1', text: 'A romance featuring a baker, chef, café, or restaurant.', bookId: null },
      { id: 'hs-2', text: 'A comfort read that feels like a warm cup of tea.', bookId: null },
      { id: 'hs-3', text: 'A romance with food, pastries, or drinks on the cover.', bookId: null },
      { id: 'hs-4', text: 'A domestic slice-of-life or found-family romance.', bookId: null }
    ]
  },
  {
    id: 'club-nightshade',
    name: 'Nightshade Society',
    icon: '🥀',
    color: '#5B2C4A',
    description: 'After-hours intrigue, villain romance, mysteries & gothic shadows.',
    prompts: [
      { id: 'ns-1', text: 'A romantic suspense, thriller, or murder mystery.', bookId: null },
      { id: 'ns-2', text: 'A villain gets the love interest (or morally grey couple).', bookId: null },
      { id: 'ns-3', text: 'A book with a dark, moody, or black-and-gold cover.', bookId: null },
      { id: 'ns-4', text: 'A romance involving revenge, heist, or secret society.', bookId: null }
    ]
  },
  {
    id: 'club-secret-stacks',
    name: 'Secret Stacks',
    icon: '📚',
    color: '#1E3A2F',
    description: 'Academic rivals, rare manuscripts, libraries & bookish protagonists.',
    prompts: [
      { id: 'ss-1', text: 'A romance featuring a librarian, bookseller, writer, or scholar.', bookId: null },
      { id: 'ss-2', text: 'Academic rivals-to-lovers or university/boarding school setting.', bookId: null },
      { id: 'ss-3', text: 'A story where books, letters, or stories bring the couple together.', bookId: null },
      { id: 'ss-4', text: 'A translated romance or classic love story.', bookId: null }
    ]
  },
  {
    id: 'club-theta',
    name: 'Theta Tau Theta',
    icon: '✨',
    color: '#C59B27',
    description: 'High-energy banter, bingeable series & iconic romance tropes.',
    prompts: [
      { id: 'ttt-1', text: 'A romance with witty banter that made you laugh out loud.', bookId: null },
      { id: 'ttt-2', text: 'First or next book in a beloved romance series.', bookId: null },
      { id: 'ttt-3', text: 'A sports, music, or celebrity spotlight romance.', bookId: null },
      { id: 'ttt-4', text: 'A graphic novel, manga, or webtoon romance.', bookId: null }
    ]
  }
];

const INITIAL_EVENTS = [
  {
    id: 'evt-frostbitten',
    name: 'Frostbitten Trials',
    season: 'Winter League',
    icon: '❄️',
    color: '#2B547E',
    prompts: [
      { id: 'ft-1', text: 'Snowed-in or cabin-in-the-woods forced proximity.', bookId: null },
      { id: 'ft-2', text: 'A winter holiday, New Year, or icy kingdom romance.', bookId: null },
      { id: 'ft-3', text: 'An ice-queen or stoic hero melting for their love interest.', bookId: null },
      { id: 'ft-4', text: 'A book with blue, silver, or white winter tones on the cover.', bookId: null }
    ]
  },
  {
    id: 'evt-bloom-brawl',
    name: 'Bloom & Brawl Games',
    season: 'Spring League',
    icon: '🌸',
    color: '#2E6F40',
    prompts: [
      { id: 'bb-1', text: 'A rivalry, tournament, or competition between love interests.', bookId: null },
      { id: 'bb-2', text: 'A romance featuring gardens, florists, or spring renewal.', bookId: null },
      { id: 'bb-3', text: 'A fresh-start romance in a brand-new town or job.', bookId: null },
      { id: 'bb-4', text: 'A pastel or floral-covered romance.', bookId: null }
    ]
  },
  {
    id: 'evt-heatwave',
    name: 'Heatwave Cup',
    season: 'Summer League',
    icon: '☀️',
    color: '#C57B27',
    prompts: [
      { id: 'hw-1', text: 'A coastal, island, or summer vacation fling turned real.', bookId: null },
      { id: 'hw-2', text: 'A road trip or sun-drenched travel romance.', bookId: null },
      { id: 'hw-3', text: 'A fast-paced beach read finished in under 48 hours.', bookId: null },
      { id: 'hw-4', text: 'A book with warm gold, orange, or sunset hues on the cover.', bookId: null }
    ]
  },
  {
    id: 'evt-final-frenzy',
    name: 'Final Frenzy Cup',
    season: 'Autumn League',
    icon: '🍂',
    color: '#8B3A4A',
    prompts: [
      { id: 'ff-1', text: 'A cozy autumn, harvest festival, or sweater-weather romance.', bookId: null },
      { id: 'ff-2', text: 'A spooky-season paranormal or witchy romance.', bookId: null },
      { id: 'ff-3', text: 'A chunky 400+ page romance to finish the year strong.', bookId: null },
      { id: 'ff-4', text: 'A 5-star prediction or anticipated 2027 release.', bookId: null }
    ]
  }
];

const MONTHS_2027 = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Spine colors for tactile book cards
const SPINE_PALETTE = [
  '#1E3A2F', '#8B3A4A', '#2B3A55', '#7C5229', '#5B2C4A',
  '#2E6F40', '#9A5B25', '#3B4D6B', '#6B2D3E', '#4A5D4E'
];

/**
 * Generates the initial state pre-populated with all 26 books from the user's
 * Once Upon A Year Volume 1 progress (80 points, 18 tokens, 26/36 main quests).
 */
function createInitialState() {
  const books = {
    'bk-1': { id: 'bk-1', title: 'Midwinter Murder', author: 'Agatha Christie', status: 'completed', pages: 272, rating: 4, tag: 'Mystery', color: '#2B3A55', notes: 'Winter mystery set during snowy holidays.' },
    'bk-2': { id: 'bk-2', title: 'Osmosis III.', author: '', status: 'completed', pages: 220, rating: 4, tag: 'Dual POV', color: '#5B2C4A', notes: '' },
    'bk-3': { id: 'bk-3', title: 'Geronimo Stilton I.', author: 'Elisabetta Dami', status: 'completed', pages: 128, rating: 4, tag: 'Rolled D6 = 1 (100+ pgs)', color: '#C57B27', notes: 'Rolled 1 on D6 -> 100+ page requirement.' },
    'bk-4': { id: 'bk-4', title: 'The Apple Pie Ice Cream Parlor', author: '', status: 'completed', pages: 280, rating: 4, tag: 'Gifted Book', color: '#8B3A4A', notes: 'Gifted read!' },
    'bk-5': { id: 'bk-5', title: 'Villains Are Destined to Die III.', author: 'Gwon Gyeoeul / SUOL', status: 'completed', pages: 260, rating: 5, tag: 'Manhwa', color: '#5B2C4A', notes: 'Stand-out otome isekai world building.' },
    'bk-6': { id: 'bk-6', title: 'Heartstopper VI.', author: 'Alice Oseman', status: 'completed', pages: 320, rating: 5, tag: 'Graphic Novel', color: '#2B547E', notes: 'Found family & heartfelt friendship.' },
    'bk-7': { id: 'bk-7', title: 'X-Day 1', author: 'Setona Mizushiro', status: 'completed', pages: 192, rating: 4, tag: 'Manga', color: '#2E6F40', notes: 'Flowers & leaves on cover.' },
    'bk-8': { id: 'bk-8', title: 'Before the coffee gets cold', author: 'Toshikazu Kawaguchi', status: 'completed', pages: 213, rating: 5, tag: 'Japanese Lit', color: '#7C5229', notes: 'Second chances and bittersweet fresh starts.' },
    'bk-9': { id: 'bk-9', title: 'Harry Potter and the Half-Blood Prince', author: 'J.K. Rowling', status: 'completed', pages: 607, rating: 5, tag: 'Fantasy', color: '#1E3A2F', notes: 'Herbology greenhouses, mandrakes & potion ingredients.' },
    'bk-10': { id: 'bk-10', title: 'Le Petit Prince', author: 'Antoine de Saint-Exupéry', status: 'completed', pages: 96, rating: 5, tag: 'French Edition', color: '#3B4D6B', notes: 'Read in French!' },
    'bk-11': { id: 'bk-11', title: 'The Little Prince', author: 'Antoine de Saint-Exupéry', status: 'completed', pages: 96, rating: 5, tag: 'English Edition', color: '#C59B27', notes: '' },
    'bk-12': { id: 'bk-12', title: 'Il Piccolo Principe', author: 'Antoine de Saint-Exupéry', status: 'completed', pages: 96, rating: 5, tag: 'Italian Edition', color: '#2E6F40', notes: 'Read in Italian — beginning a journey across planets.' },
    'bk-13': { id: 'bk-13', title: 'Nemo', author: '', status: 'completed', pages: 160, rating: 4, tag: 'Creature Cover', color: '#2B547E', notes: '' },
    'bk-14': { id: 'bk-14', title: 'Villains is Meant to Die IV.', author: 'Gwon Gyeoeul / SUOL', status: 'completed', pages: 264, rating: 5, tag: 'Manhwa', color: '#1E3A2F', notes: 'Forest hunting grounds arc.' },
    'bk-15': { id: 'bk-15', title: 'Beauty and the Beast', author: '', status: 'completed', pages: 180, rating: 4, tag: 'Fairytale', color: '#8B3A4A', notes: 'Discovering the secret of the enchanted castle.' },
    'bk-16': { id: 'bk-16', title: 'A Magical Girl Retires', author: 'Park Seolyeon', status: 'completed', pages: 176, rating: 4, tag: 'Korean Fantasy', color: '#5B2C4A', notes: '' },
    'bk-17': { id: 'bk-17', title: 'The Poetry of Emily Dickinson', author: 'Emily Dickinson', status: 'completed', pages: 240, rating: 4, tag: 'Poetry', color: '#4A5D4E', notes: 'Outside usual genre!' },
    'bk-18': { id: 'bk-18', title: 'Hamupipoke', author: '', status: 'completed', pages: 140, rating: 4, tag: 'Hungarian', color: '#8B3A4A', notes: 'One-word title (Cinderella in Hungarian).' },
    'bk-19': { id: 'bk-19', title: 'Janos vitez', author: 'Sándor Petőfi', status: 'completed', pages: 150, rating: 5, tag: 'Hungarian Classic', color: '#7C5229', notes: 'Epic journey on foot.' },
    'bk-20': { id: 'bk-20', title: 'Anne Frank Diary', author: 'Anne Frank', status: 'completed', pages: 283, rating: 5, tag: 'Memoir / NL', color: '#1E3A2F', notes: 'Green/brown checkered cover.' },
    'bk-21': { id: 'bk-21', title: 'Sweet Anne', author: '', status: 'completed', pages: 230, rating: 4, tag: 'Autumn Cover', color: '#9A5B25', notes: '' },
    'bk-22': { id: 'bk-22', title: 'Killers of the Flower Moon', author: 'David Grann', status: 'completed', pages: 352, rating: 5, tag: 'Non-Fiction Saga', color: '#7C5229', notes: 'Generational Osage family history.' },
    'bk-23': { id: 'bk-23', title: 'Lips Touch', author: 'Laini Taylor', status: 'completed', pages: 261, rating: 4, tag: 'Folklore', color: '#8B3A4A', notes: 'Three tales inspired by folklore and myth.' },
    'bk-24': { id: 'bk-24', title: 'Wuthering Heights', author: 'Emily Brontë', status: 'completed', pages: 416, rating: 4, tag: 'Gothic Classic', color: '#2B3A55', notes: 'Haunting moors & spectral appearances.' },
    'bk-25': { id: 'bk-25', title: 'An Old-Fashioned Girl', author: 'Louisa May Alcott', status: 'completed', pages: 320, rating: 4, tag: 'Classic', color: '#6B2D3E', notes: 'Polly Milton finding her resilience and strength.' },
    'bk-26': { id: 'bk-26', title: 'Murder at the Grand Hotel', author: '', status: 'completed', pages: 304, rating: 4, tag: 'Historical Mystery', color: '#7C5229', notes: '' }
  };

  return {
    books,
    oyay: {
      travelerName: 'Traveler',
      yearBookGoal: 40,
      roles: [
        {
          id: 'role-herald',
          name: "Herald's Call",
          icon: '📯',
          active: true,
          lore: "The Storyteller speaks, and the Herald carries the word. Select this role to receive word when something new has been added to the Realm's record — new videos, premieres, and streams alike."
        },
        {
          id: 'role-spurriers',
          name: 'Spurriers',
          icon: '🏇',
          active: true,
          lore: 'The Arena welcomes those who read best in company. Select this role to join the Spurriers — access the sprint channels and receive notice when the next race is called.'
        },
        {
          id: 'role-village',
          name: 'Village Readers',
          icon: '🏘️',
          active: true,
          lore: 'The Village Read gathers travelers around a single story, one Chapter at a time. Select this role to join the reading circle — cast your vote for the next book, receive notices when submissions open, and find your way to the discussion when the season turns.'
        }
      ],
      volumes: [
        {
          id: 'vol-1',
          title: 'Volume 1: The Book of Beginnings',
          subtitle: 'Every story begins with a single page.',
          chapters: [
            {
              id: 'vol1-ch1',
              number: 1,
              title: 'Chapter 1: Once Upon a Time',
              season: 'Winter',
              icon: '❄️',
              accent: '#2B547E',
              coreQuests: [
                { id: 'c1-core-1', prompt: 'A mystery or thriller set during winter.', points: 4, bookId: 'bk-1' },
                { id: 'c1-core-2', prompt: 'A book with dual POV.', points: 4, bookId: 'bk-2' },
                { id: 'c1-core-3', prompt: 'Roll a D6 × 100 & read a book with at least that many pages.', points: 4, bookId: 'bk-3', diceRoll: 1 },
                { id: 'c1-core-4', prompt: 'A book you were gifted.', points: 4, bookId: 'bk-4' },
                { id: 'c1-core-5', prompt: 'A book with an immersive setting or stand-out world building.', points: 4, bookId: 'bk-5' }
              ],
              companionQuests: [
                { id: 'c1-comp-1', prompt: 'A book featuring friendship or found family.', tokens: 3, bookId: 'bk-6' },
                { id: 'c1-comp-2', prompt: 'A book that is at least 75% blue on the cover.', tokens: 3, bookId: null },
                { id: 'c1-comp-3', prompt: 'A graphic novel or manga you can finish in one sitting.', tokens: 3, bookId: null },
                { id: 'c1-comp-4', prompt: 'A book that includes a cafe, tavern, or bookshop.', tokens: 3, bookId: null }
              ],
              bonusTitle: "The Storyteller's Feast & Winter Side Stories",
              bonusQuests: [
                { id: 'c1-b-1', label: 'The Secret Gift', prompt: 'A book recommended by a fellow traveler or wrapped in mystery.', points: 2, tokens: 0, bookId: null },
                { id: 'c1-b-2', label: 'Candlelight Tales', prompt: 'A novella, short story collection, or cosy tale read by candlelight.', points: 2, tokens: 0, bookId: null },
                { id: 'c1-b-3', label: 'Snowbound', prompt: 'A story set in an isolated, remote, or snowed-in location.', points: 2, tokens: 0, bookId: null },
                { id: 'c1-b-4', label: 'Shared Feast', prompt: 'A book featuring memorable baking, tea, or celebratory feasts.', points: 2, tokens: 0, bookId: null },
                { id: 'c1-b-5', label: 'The Star Above', prompt: 'A book with stars, constellations, or winter night skies on the cover.', points: 2, tokens: 0, bookId: null },
                { id: 'c1-b-6', label: 'Cozy Fire', prompt: 'A comfort read or re-read that feels like sitting by a warm hearth.', points: 2, tokens: 0, bookId: null },
                { id: 'c1-m-1', label: 'January Side Story', prompt: 'First book of a brand-new series or year.', points: 0, tokens: 1, bookId: null },
                { id: 'c1-m-2', label: 'February Side Story', prompt: 'A story centered on letters, devotion, or heartfelt bonds.', points: 0, tokens: 1, bookId: null },
                { id: 'c1-m-3', label: 'March Side Story', prompt: 'A tale of thawing frost, awakening magic, or threshold crossings.', points: 0, tokens: 1, bookId: null }
              ]
            },
            {
              id: 'vol1-ch2',
              number: 2,
              title: 'Chapter 2: Call to Adventure',
              season: 'Spring',
              icon: '🌿',
              accent: '#2E6F40',
              coreQuests: [
                { id: 'c2-core-1', prompt: 'A book with flowers, leaves, or greenery on the cover.', points: 4, bookId: 'bk-7' },
                { id: 'c2-core-2', prompt: 'A story about a fresh start, new beginnings, or 2nd chances.', points: 4, bookId: 'bk-8' },
                { id: 'c2-core-3', prompt: 'A book that has plants, garden, or farming elements.', points: 4, bookId: 'bk-9' },
                { id: 'c2-core-4', prompt: 'A translated work or book set in another country from the one you currently live in.', points: 4, bookId: 'bk-10' },
                { id: 'c2-core-5', prompt: 'A new to you author or debut novel.', points: 4, bookId: 'bk-11' }
              ],
              companionQuests: [
                { id: 'c2-comp-1', prompt: 'A book with the word garden, seed, or bloom in the title.', tokens: 3, bookId: null },
                { id: 'c2-comp-2', prompt: 'A book where the Main Character begins a journey.', tokens: 3, bookId: 'bk-12' },
                { id: 'c2-comp-3', prompt: 'A book published in the last 90 days.', tokens: 3, bookId: null },
                { id: 'c2-comp-4', prompt: 'A book with a map.', tokens: 3, bookId: null }
              ],
              bonusTitle: 'The Festival of the Open Road & Spring Side Stories',
              bonusQuests: [
                { id: 'c2-b-1', label: 'Bramblewake', prompt: 'A story where paths tangle or wild nature reclaims the road.', points: 2, tokens: 0, bookId: null },
                { id: 'c2-b-2', label: 'Hearthsong Crossing', prompt: 'Crossing a river, border, or portal into the unknown.', points: 2, tokens: 0, bookId: null },
                { id: 'c2-b-3', label: 'Greenveil Hollow', prompt: 'A story set in a lush valley, meadow, or countryside.', points: 2, tokens: 0, bookId: null },
                { id: 'c2-b-4', label: 'Thistledown Square', prompt: 'A lively market, festival, or bustling town square scene.', points: 2, tokens: 0, bookId: null },
                { id: 'c2-b-5', label: "Wayfarer's Knot", prompt: 'An unlikely traveling companion joins the quest.', points: 2, tokens: 0, bookId: null },
                { id: 'c2-b-6', label: 'Larkswell', prompt: 'A hopeful dawn, morning ritual, or uplifting turning point.', points: 2, tokens: 0, bookId: null },
                { id: 'c2-m-1', label: 'April Side Story', prompt: 'April showers — a book with rain, storms, or emotional catharsis.', points: 0, tokens: 1, bookId: null },
                { id: 'c2-m-2', label: 'May Side Story', prompt: 'May blossoms — a colourful cover or vibrant spring setting.', points: 0, tokens: 1, bookId: null },
                { id: 'c2-m-3', label: 'June Side Story', prompt: 'Midsummer threshold — a road trip or sunlit expedition.', points: 0, tokens: 1, bookId: null }
              ]
            },
            {
              id: 'vol1-ch3',
              number: 3,
              title: 'Chapter 3: Into Greywood Forest',
              season: 'Summer',
              icon: '🌲',
              accent: '#1E3A2F',
              coreQuests: [
                { id: 'c3-core-1', prompt: 'A book with a creature, animal, or beast on the cover.', points: 4, bookId: 'bk-13' },
                { id: 'c3-core-2', prompt: 'A book set in or featuring a forest, jungle, or wilderness.', points: 4, bookId: 'bk-14' },
                { id: 'c3-core-3', prompt: 'A book where a character discovers a secret.', points: 4, bookId: 'bk-15' },
                { id: 'c3-core-4', prompt: 'A book with magic or magical elements.', points: 4, bookId: 'bk-16' },
                { id: 'c3-core-5', prompt: 'A book outside your usual genre.', points: 4, bookId: 'bk-17' }
              ],
              companionQuests: [
                { id: 'c3-comp-1', prompt: 'A book with a one-word title.', tokens: 3, bookId: 'bk-18' },
                { id: 'c3-comp-2', prompt: 'A book featuring a journey on foot.', tokens: 3, bookId: 'bk-19' },
                { id: 'c3-comp-3', prompt: 'A book you chose based on its first line alone.', tokens: 3, bookId: null },
                { id: 'c3-comp-4', prompt: 'A book with green, black, or brown on the cover.', tokens: 3, bookId: 'bk-20' }
              ],
              bonusTitle: 'Midsummer Revel & Summer Side Stories',
              bonusQuests: [
                { id: 'c3-b-1', label: 'Fairy Ring', prompt: 'A story featuring fae, spirits, or enchanted woodland rules.', points: 2, tokens: 0, bookId: null },
                { id: 'c3-b-2', label: "Trickster's Cap", prompt: 'A clever heist, mischief-maker, or unreliable narrator.', points: 2, tokens: 0, bookId: null },
                { id: 'c3-b-3', label: "Bard's Circle", prompt: 'Music, poetry, theatre, or storytelling woven into the plot.', points: 2, tokens: 0, bookId: null },
                { id: 'c3-b-4', label: 'Lanterns After Dark', prompt: 'A nocturnal adventure or glowing lights in the dark.', points: 2, tokens: 0, bookId: null },
                { id: 'c3-b-5', label: 'Longest Night', prompt: 'Staying up late to finish a page-turner in one rush.', points: 2, tokens: 0, bookId: null },
                { id: 'c3-b-6', label: "Fairy's Pick", prompt: 'Roll a die or pick randomly from your unread shelf.', points: 2, tokens: 0, bookId: null },
                { id: 'c3-m-1', label: 'July Side Story', prompt: 'High summer sun — an oceanic, coastal, or sun-drenched tale.', points: 0, tokens: 1, bookId: null },
                { id: 'c3-m-2', label: 'August Side Story', prompt: 'Starfall nights — a story of wishes, fate, or prophecy.', points: 0, tokens: 1, bookId: null },
                { id: 'c3-m-3', label: 'September Side Story', prompt: 'Edge of the woods — transitioning from summer into autumn.', points: 0, tokens: 1, bookId: null }
              ]
            },
            {
              id: 'vol1-ch4',
              number: 4,
              title: 'Chapter 4: Trials & Triumphs',
              season: 'Autumn',
              icon: '🍂',
              accent: '#8B3A4A',
              coreQuests: [
                { id: 'c4-core-1', prompt: 'A book with autumn colours (red, orange, brown, or gold) on the cover.', points: 4, bookId: 'bk-21' },
                { id: 'c4-core-2', prompt: 'A family saga or generational story.', points: 4, bookId: 'bk-22' },
                { id: 'c4-core-3', prompt: 'A book inspired by folklore, myth, or legends.', points: 4, bookId: 'bk-23' },
                { id: 'c4-core-4', prompt: 'A book with paranormal elements.', points: 4, bookId: 'bk-24' },
                { id: 'c4-core-5', prompt: 'A book where a character finds their strength.', points: 4, bookId: 'bk-25' }
              ],
              companionQuests: [
                { id: 'c4-comp-1', prompt: 'A book with skulls, bones, spiders, or birds on the cover.', tokens: 3, bookId: null },
                { id: 'c4-comp-2', prompt: 'A book set in a small town or village.', tokens: 3, bookId: null },
                { id: 'c4-comp-3', prompt: 'A historical fiction novel.', tokens: 3, bookId: 'bk-26' },
                { id: 'c4-comp-4', prompt: 'A cosy fantasy or romance.', tokens: 3, bookId: null }
              ],
              bonusTitle: 'The Harvest Crown & Autumn Side Stories',
              bonusQuests: [
                { id: 'c4-b-1', label: 'Amber Hearth', prompt: 'A story featuring warm candlelit interiors or autumn tea.', points: 2, tokens: 0, bookId: null },
                { id: 'c4-b-2', label: 'Gilded Crown', prompt: 'A story of hard-won victory, royalty, or crowning triumph.', points: 2, tokens: 0, bookId: null },
                { id: 'c4-m-1', label: 'October Side Story', prompt: 'Spooky season — shadows, mysteries, or gothic atmosphere.', points: 0, tokens: 1, bookId: null },
                { id: 'c4-m-2', label: 'November Side Story', prompt: 'Gratitude & kin — a story honoring memory, legacy, or loyalty.', points: 0, tokens: 1, bookId: null },
                { id: 'c4-m-3', label: 'December Side Story', prompt: 'Final chapter of the year — tying loose ends together.', points: 0, tokens: 1, bookId: null }
              ]
            }
          ]
        },
        {
          id: 'vol-2',
          title: 'Volume 2: The Next Journey',
          subtitle: 'Chart new chapters, custom quests & bonus realms.',
          chapters: [
            {
              id: 'vol2-ch1',
              number: 1,
              title: 'Chapter 1: Beyond the Horizon',
              season: 'New Chapter',
              icon: '🧭',
              accent: '#C59B27',
              coreQuests: [
                { id: 'v2-c1-core-1', prompt: 'A book that continues a series you started in Volume 1.', points: 5, bookId: null },
                { id: 'v2-c1-core-2', prompt: 'A book set in a library, archive, or university.', points: 5, bookId: null },
                { id: 'v2-c1-core-3', prompt: 'A book chosen by rolling the Fate Dice.', points: 5, bookId: null }
              ],
              companionQuests: [
                { id: 'v2-c1-comp-1', prompt: 'A buddy read with fellow Village Readers or Spurriers.', tokens: 3, bookId: null },
                { id: 'v2-c1-comp-2', prompt: 'A book in a language you are learning or love.', tokens: 3, bookId: null }
              ],
              bonusTitle: 'Volume 2 Side Chronicles',
              bonusQuests: []
            }
          ]
        }
      ]
    },
    romanceopoly: {
      major: 'Fantasy Theory',
      minor: 'Romantic Arts',
      pawnPosition: 0,
      pawnEmoji: '🎓',
      // Map of spaceIndex (0..19) -> { bookId, customPrompt }
      spaceData: {},
      clubs: INITIAL_CLUBS,
      events: INITIAL_EVENTS,
      monthlyStudy: MONTHS_2027.map((month, idx) => ({
        id: `study-${idx}`,
        month,
        prompt: `${month} Study Session`,
        bookId: null
      }))
    }
  };
}

/**
 * Helper: Builds the 20 Academic Board spaces dynamically from
 * Core Curriculum (5) + Major (5) + Minor (5) + Electives (5)
 * while preserving user's assigned books and custom prompt edits.
 */
function buildRomanceopolyBoard(romanceopolyState) {
  const { major, minor, spaceData } = romanceopolyState;
  const majorDept = ROMANCEOPOLY_DEPARTMENTS[major] || ROMANCEOPOLY_DEPARTMENTS['Fantasy Theory'];
  const minorDept = ROMANCEOPOLY_DEPARTMENTS[minor] || ROMANCEOPOLY_DEPARTMENTS['Romantic Arts'];

  const remainingDeptKeys = Object.keys(ROMANCEOPOLY_DEPARTMENTS).filter(
    (k) => k !== major && k !== minor
  );

  // Pick 5 elective prompts from the remaining 3 departments
  const electivePool = [];
  remainingDeptKeys.forEach((deptKey, dIdx) => {
    const dept = ROMANCEOPOLY_DEPARTMENTS[deptKey];
    electivePool.push({ dept, prompt: dept.prompts[0], code: `ELEC ${201 + dIdx * 2}` });
    if (electivePool.length < 5) {
      electivePool.push({ dept, prompt: dept.prompts[1], code: `ELEC ${202 + dIdx * 2}` });
    }
  });
  const electives = electivePool.slice(0, 5);

  const spaces = [];

  // 0..4: Core Curriculum
  CORE_CURRICULUM_SPACES.forEach((core, idx) => {
    const saved = spaceData[idx] || {};
    spaces.push({
      index: idx,
      id: `space-${idx}`,
      code: core.code,
      landmark: core.landmark,
      category: 'Core Curriculum',
      department: 'Core Curriculum',
      icon: '🏛️',
      accent: core.accent,
      defaultPrompt: core.defaultPrompt,
      prompt: saved.customPrompt || core.defaultPrompt,
      bookId: saved.bookId || null
    });
  });

  // 5..9: Major Classes
  majorDept.prompts.forEach((p, idx) => {
    const spaceIdx = 5 + idx;
    const saved = spaceData[spaceIdx] || {};
    spaces.push({
      index: spaceIdx,
      id: `space-${spaceIdx}`,
      code: `MAJ ${301 + idx}`,
      landmark: `${majorDept.name} I${'V'.repeat(idx === 3 ? 1 : 0)}${idx === 4 ? 'V' : idx < 3 ? 'I'.repeat(idx) : ''}`.replace('IIV', 'IV'),
      category: 'Major Classes',
      department: majorDept.name,
      icon: majorDept.icon,
      accent: majorDept.color,
      defaultPrompt: p,
      prompt: saved.customPrompt || p,
      bookId: saved.bookId || null
    });
  });

  // 10..14: Minor Classes
  minorDept.prompts.forEach((p, idx) => {
    const spaceIdx = 10 + idx;
    const saved = spaceData[spaceIdx] || {};
    const numerals = ['I', 'II', 'III', 'IV', 'V'];
    spaces.push({
      index: spaceIdx,
      id: `space-${spaceIdx}`,
      code: `MIN ${201 + idx}`,
      landmark: `${minorDept.name} ${numerals[idx]}`,
      category: 'Minor Classes',
      department: minorDept.name,
      icon: minorDept.icon,
      accent: minorDept.color,
      defaultPrompt: p,
      prompt: saved.customPrompt || p,
      bookId: saved.bookId || null
    });
  });

  // 15..19: Electives
  electives.forEach((el, idx) => {
    const spaceIdx = 15 + idx;
    const saved = spaceData[spaceIdx] || {};
    spaces.push({
      index: spaceIdx,
      id: `space-${spaceIdx}`,
      code: el.code,
      landmark: `${el.dept.name} Seminar`,
      category: 'Electives',
      department: el.dept.name,
      icon: el.dept.icon,
      accent: el.dept.color,
      defaultPrompt: el.prompt,
      prompt: saved.customPrompt || el.prompt,
      bookId: saved.bookId || null
    });
  });

  return spaces;
}

/**
 * Celebratory Sparkle & Confetti Micro-Animation Component
 */
function ConfettiBurst({ triggerKey }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!triggerKey) return;
    const colors = ['#C59B27', '#1E3A2F', '#8B3A4A', '#E6B84C', '#4E8B71'];
    const items = Array.from({ length: 28 }).map((_, i) => ({
      id: `${triggerKey}-${i}`,
      left: 15 + Math.random() * 70,
      delay: Math.random() * 0.25,
      duration: 1.1 + Math.random() * 0.7,
      color: colors[i % colors.length],
      size: 6 + Math.random() * 6,
      drift: (Math.random() - 0.5) * 140,
      shape: i % 3 === 0 ? '✦' : i % 3 === 1 ? '◆' : '●'
    }));
    setParticles(items);
    const timer = setTimeout(() => setParticles([]), 2000);
    return () => clearTimeout(timer);
  }, [triggerKey]);

  if (!particles.length) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: '38%',
            color: p.color,
            fontSize: `${p.size + 4}px`,
            animation: `ledgerSparkle ${p.duration}s cubic-bezier(0.22, 1, 0.36, 1) ${p.delay}s forwards`,
            '--drift-x': `${p.drift}px`
          }}
        >
          {p.shape}
        </span>
      ))}
    </div>
  );
}

/**
 * Main Application Component
 */
export default function App() {
  // Load persisted state or fall back to pre-populated initial state
  const [ledger, setLedger] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.books && parsed.oyay && parsed.romanceopoly) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Could not load saved ledger, starting fresh:', err);
    }
    return createInitialState();
  });

  // Navigation & UI state
  const [activeTab, setActiveTab] = useState('oyay'); // 'oyay' | 'romanceopoly' | 'bookshelf'
  const [activeVolumeId, setActiveVolumeId] = useState('vol-1');
  const [chapterFilter, setChapterFilter] = useState('all');
  const [expandedBonusChapters, setExpandedBonusChapters] = useState({});
  const [editingTravelerName, setEditingTravelerName] = useState(false);
  const [editingGoal, setEditingGoal] = useState(false);
  const [activeRoleTooltip, setActiveRoleTooltip] = useState(null);

  // Romanceopoly UI state
  const [romViewMode, setRomViewMode] = useState('board'); // 'board' | 'list'
  const [romAddonTab, setRomAddonTab] = useState('clubs'); // 'clubs' | 'events' | 'monthly'
  const [isPawnRolling, setIsPawnRolling] = useState(false);
  const [lastBoardRoll, setLastBoardRoll] = useState(null);
  const [editingSpaceIdx, setEditingSpaceIdx] = useState(null);
  const [editingSpaceDraft, setEditingSpaceDraft] = useState('');

  // Bookshelf UI state
  const [shelfFilter, setShelfFilter] = useState('all'); // 'all' | 'oyay' | 'romanceopoly' | 'doubledip' | 'unassigned'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'completed' | 'reading' | 'planned'
  const [searchQuery, setSearchQuery] = useState('');

  // Drag & Drop state
  const [dragSource, setDragSource] = useState(null); // { volumeId, chapterId, section, questId, bookId }
  const [dragOverQuestId, setDragOverQuestId] = useState(null);

  // Modals & Notifications
  const [diceModal, setDiceModal] = useState({ open: false, sides: 6, context: 'general', targetQuest: null });
  const [bookModal, setBookModal] = useState({ open: false, book: null, presetTarget: null });
  const [slotModal, setSlotModal] = useState({ open: false, mode: 'assign', source: null });
  const [customQuestModal, setCustomQuestModal] = useState({ open: false, volumeId: 'vol-1', chapterId: 'vol1-ch1' });
  const [newChapterModal, setNewChapterModal] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);

  // Inject Google Fonts & Tactile Storybook CSS
  useEffect(() => {
    const fontId = 'travelers-ledger-fonts';
    if (!document.getElementById(fontId)) {
      const link = document.createElement('link');
      link.id = fontId;
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap';
      document.head.appendChild(link);
    }

    const styleId = 'travelers-ledger-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        body {
          background-color: #FAF6F0;
          color: #2A211C;
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .font-display {
          font-family: 'Cinzel', Georgia, serif;
        }
        .font-editorial {
          font-family: 'Playfair Display', Georgia, serif;
        }
        .parchment-bg {
          background-color: #FAF6F0;
          background-image:
            radial-gradient(at 15% 10%, rgba(197, 155, 39, 0.07) 0px, transparent 50%),
            radial-gradient(at 85% 90%, rgba(30, 58, 47, 0.06) 0px, transparent 50%);
        }
        .storybook-card {
          background-color: #FFFDF9;
          border: 1px solid #E6DCCB;
          box-shadow: 0 2px 10px rgba(42, 33, 28, 0.04);
        }
        .storybook-card-hover {
          transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
        }
        .storybook-card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(42, 33, 28, 0.08);
          border-color: #C59B27;
        }
        @keyframes ledgerSparkle {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(0.7) rotate(0deg);
          }
          60% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(var(--drift-x), -140px) scale(1.25) rotate(220deg);
          }
        }
        @keyframes diceWobble {
          0%, 100% { transform: rotate(0deg) scale(1); }
          20% { transform: rotate(-16deg) scale(1.08); }
          40% { transform: rotate(14deg) scale(1.12); }
          60% { transform: rotate(-10deg) scale(1.08); }
          80% { transform: rotate(8deg) scale(1.04); }
        }
        .animate-dice {
          animation: diceWobble 0.55s ease-in-out infinite;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ledger));
    } catch (err) {
      console.warn('Failed to persist ledger:', err);
    }
  }, [ledger]);

  const showToast = (message, tone = 'emerald') => {
    setToast({ message, tone, id: Date.now() });
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const triggerCelebration = () => {
    setConfettiKey((k) => k + 1);
  };

  // ==========================================================================
  // COMPUTED METRICS & DERIVED VIEWS
  // ==========================================================================

  const oyayStats = useMemo(() => {
    let totalPoints = 0;
    let totalTokens = 0;
    let mainCompleted = 0;
    let mainTotal = 0;
    let bonusCompleted = 0;
    const assignedBookIds = new Set();

    ledger.oyay.volumes.forEach((vol) => {
      vol.chapters.forEach((ch) => {
        ch.coreQuests.forEach((q) => {
          mainTotal += 1;
          if (q.bookId && ledger.books[q.bookId]) {
            assignedBookIds.add(q.bookId);
            if (ledger.books[q.bookId].status === 'completed') {
              totalPoints += Number(q.points || 0);
              mainCompleted += 1;
            }
          }
        });
        ch.companionQuests.forEach((q) => {
          mainTotal += 1;
          if (q.bookId && ledger.books[q.bookId]) {
            assignedBookIds.add(q.bookId);
            if (ledger.books[q.bookId].status === 'completed') {
              totalTokens += Number(q.tokens || 0);
              mainCompleted += 1;
            }
          }
        });
        (ch.bonusQuests || []).forEach((q) => {
          if (q.bookId && ledger.books[q.bookId]) {
            assignedBookIds.add(q.bookId);
            if (ledger.books[q.bookId].status === 'completed') {
              totalPoints += Number(q.points || 0);
              totalTokens += Number(q.tokens || 0);
              bonusCompleted += 1;
            }
          }
        });
      });
    });

    return {
      totalPoints,
      totalTokens,
      mainCompleted,
      mainTotal,
      bonusCompleted,
      booksLogged: assignedBookIds.size
    };
  }, [ledger]);

  const romanceopolySpaces = useMemo(
    () => buildRomanceopolyBoard(ledger.romanceopoly),
    [ledger.romanceopoly]
  );

  const romanceopolyStats = useMemo(() => {
    const academicCompleted = romanceopolySpaces.filter(
      (sp) => sp.bookId && ledger.books[sp.bookId]?.status === 'completed'
    ).length;

    const completedClubs = ledger.romanceopoly.clubs.filter((club) =>
      club.prompts.every((p) => p.bookId && ledger.books[p.bookId]?.status === 'completed')
    );

    const completedEvents = ledger.romanceopoly.events.filter((evt) =>
      evt.prompts.every((p) => p.bookId && ledger.books[p.bookId]?.status === 'completed')
    );

    const monthlyCompleted = ledger.romanceopoly.monthlyStudy.filter(
      (m) => m.bookId && ledger.books[m.bookId]?.status === 'completed'
    ).length;

    const hasDegree = academicCompleted >= 20;
    const hasDeansList = hasDegree && completedClubs.length >= 1;
    const hasValedictorian = hasDegree && completedClubs.length >= 1 && completedEvents.length >= 1;

    const achievements = [
      {
        id: 'ach-degree',
        title: 'Romanceopoly Degree',
        icon: '🎓',
        desc: 'Complete all 20 Academic Board prompts.',
        unlocked: hasDegree,
        progress: `${academicCompleted}/20`
      },
      {
        id: 'ach-deans',
        title: "Dean's List",
        icon: '📜',
        desc: 'Earn your Degree + complete 1 Campus Club.',
        unlocked: hasDeansList,
        progress: hasDegree ? `${completedClubs.length}/1 Club` : 'Requires Degree'
      },
      {
        id: 'ach-valedictorian',
        title: 'Valedictorian',
        icon: '🏆',
        desc: 'Earn your Degree + 1 Club + 1 Seasonal Event.',
        unlocked: hasValedictorian,
        progress: hasDeansList ? `${completedEvents.length}/1 Event` : "Requires Dean's List"
      },
      {
        id: 'ach-varsity',
        title: 'Varsity Letter',
        icon: '🏅',
        desc: 'Complete any 1 Seasonal Sports League Event.',
        unlocked: completedEvents.length >= 1,
        progress: `${Math.min(completedEvents.length, 1)}/1 Event`
      },
      {
        id: 'ach-captain',
        title: 'Cross-Season Captain',
        icon: '⚡',
        desc: 'Complete 2 or more Seasonal Events.',
        unlocked: completedEvents.length >= 2,
        progress: `${Math.min(completedEvents.length, 2)}/2 Events`
      },
      {
        id: 'ach-mvp',
        title: 'Hallroom MVP',
        icon: '👑',
        desc: 'Sweep all 4 Seasonal Sports League Events.',
        unlocked: completedEvents.length >= 4,
        progress: `${completedEvents.length}/4 Events`
      },
      {
        id: 'ach-honorary',
        title: 'Honorary Club Member',
        icon: '🏛️',
        desc: 'Complete all 4 prompts in any Campus Club.',
        unlocked: completedClubs.length >= 1,
        progress: `${Math.min(completedClubs.length, 1)}/1 Club`
      },
      {
        id: 'ach-powerhouse',
        title: 'Extracurricular Powerhouse',
        icon: '🌟',
        desc: 'Complete 2 or more Campus Clubs.',
        unlocked: completedClubs.length >= 2,
        progress: `${Math.min(completedClubs.length, 2)}/2 Clubs`
      },
      {
        id: 'ach-legend',
        title: 'Student Union Legend',
        icon: '🦉',
        desc: 'Master all 4 Campus Clubs.',
        unlocked: completedClubs.length >= 4,
        progress: `${completedClubs.length}/4 Clubs`
      }
    ];

    return {
      academicCompleted,
      completedClubsCount: completedClubs.length,
      completedEventsCount: completedEvents.length,
      monthlyCompleted,
      achievements
    };
  }, [romanceopolySpaces, ledger]);

  // Build reverse index: bookId -> array of assignments across OYAY & Romanceopoly
  const bookAssignmentsMap = useMemo(() => {
    const map = {};
    Object.keys(ledger.books).forEach((id) => {
      map[id] = [];
    });

    ledger.oyay.volumes.forEach((vol) => {
      vol.chapters.forEach((ch) => {
        ch.coreQuests.forEach((q) => {
          if (q.bookId && map[q.bookId]) {
            map[q.bookId].push({
              realm: 'oyay',
              label: `OYAY Ch.${ch.number}: ${q.prompt}`,
              badge: `🏰 Ch.${ch.number} Core (${q.points} pts)`
            });
          }
        });
        ch.companionQuests.forEach((q) => {
          if (q.bookId && map[q.bookId]) {
            map[q.bookId].push({
              realm: 'oyay',
              label: `OYAY Ch.${ch.number}: ${q.prompt}`,
              badge: `🏰 Ch.${ch.number} Companion (${q.tokens} tokens)`
            });
          }
        });
        (ch.bonusQuests || []).forEach((q) => {
          if (q.bookId && map[q.bookId]) {
            map[q.bookId].push({
              realm: 'oyay',
              label: `OYAY Bonus (${q.label}): ${q.prompt}`,
              badge: `✨ Ch.${ch.number} Bonus`
            });
          }
        });
      });
    });

    romanceopolySpaces.forEach((sp) => {
      if (sp.bookId && map[sp.bookId]) {
        map[sp.bookId].push({
          realm: 'romanceopoly',
          label: `Romanceopoly ${sp.code} (${sp.landmark}): ${sp.prompt}`,
          badge: `🎓 ${sp.landmark}`
        });
      }
    });

    ledger.romanceopoly.clubs.forEach((club) => {
      club.prompts.forEach((p) => {
        if (p.bookId && map[p.bookId]) {
          map[p.bookId].push({
            realm: 'romanceopoly',
            label: `Club ${club.name}: ${p.text}`,
            badge: `${club.icon} ${club.name}`
          });
        }
      });
    });

    ledger.romanceopoly.events.forEach((evt) => {
      evt.prompts.forEach((p) => {
        if (p.bookId && map[p.bookId]) {
          map[p.bookId].push({
            realm: 'romanceopoly',
            label: `Event ${evt.name}: ${p.text}`,
            badge: `${evt.icon} ${evt.name}`
          });
        }
      });
    });

    ledger.romanceopoly.monthlyStudy.forEach((m) => {
      if (m.bookId && map[m.bookId]) {
        map[m.bookId].push({
          realm: 'romanceopoly',
          label: `2027 Study (${m.month})`,
          badge: `📅 ${m.month} Study`
        });
      }
    });

    return map;
  }, [ledger, romanceopolySpaces]);

  // ==========================================================================
  // MUTATION HANDLERS (BOOKS, QUESTS, SWAPPING, ROMANCEOPOLY)
  // ==========================================================================

  const toggleBookStatus = (bookId) => {
    const book = ledger.books[bookId];
    if (!book) return;
    const order = ['completed', 'reading', 'planned'];
    const nextStatus = order[(order.indexOf(book.status) + 1) % order.length];

    setLedger((prev) => ({
      ...prev,
      books: {
        ...prev.books,
        [bookId]: { ...book, status: nextStatus }
      }
    }));

    if (nextStatus === 'completed') {
      triggerCelebration();
      showToast(`Marked "${book.title}" as Completed!`, 'emerald');
    } else {
      showToast(`Updated "${book.title}" to ${nextStatus === 'reading' ? 'Currently Reading' : 'Planned TBR'}.`, 'gold');
    }
  };

  // Assign a bookId to any OYAY quest slot
  const setOyayQuestBook = (volumeId, chapterId, section, questId, bookId) => {
    setLedger((prev) => {
      const volumes = prev.oyay.volumes.map((vol) => {
        if (vol.id !== volumeId) return vol;
        return {
          ...vol,
          chapters: vol.chapters.map((ch) => {
            if (ch.id !== chapterId) return ch;
            const listKey =
              section === 'core'
                ? 'coreQuests'
                : section === 'companion'
                ? 'companionQuests'
                : 'bonusQuests';
            return {
              ...ch,
              [listKey]: (ch[listKey] || []).map((q) =>
                q.id === questId ? { ...q, bookId } : q
              )
            };
          })
        };
      });
      return { ...prev, oyay: { ...prev.oyay, volumes } };
    });

    if (bookId && ledger.books[bookId]?.status === 'completed') {
      triggerCelebration();
    }
  };

  // Move or Swap books between two OYAY quest slots
  const moveOrSwapOyayBooks = (source, target) => {
    if (
      source.volumeId === target.volumeId &&
      source.chapterId === target.chapterId &&
      source.section === target.section &&
      source.questId === target.questId
    ) {
      return;
    }

    let sourceBookId = null;
    let targetBookId = null;

    // Locate both current bookIds
    ledger.oyay.volumes.forEach((vol) => {
      vol.chapters.forEach((ch) => {
        const listKey =
          source.section === 'core'
            ? 'coreQuests'
            : source.section === 'companion'
            ? 'companionQuests'
            : 'bonusQuests';
        if (vol.id === source.volumeId && ch.id === source.chapterId) {
          const found = (ch[listKey] || []).find((q) => q.id === source.questId);
          if (found) sourceBookId = found.bookId;
        }
        const tListKey =
          target.section === 'core'
            ? 'coreQuests'
            : target.section === 'companion'
            ? 'companionQuests'
            : 'bonusQuests';
        if (vol.id === target.volumeId && ch.id === target.chapterId) {
          const found = (ch[tListKey] || []).find((q) => q.id === target.questId);
          if (found) targetBookId = found.bookId;
        }
      });
    });

    if (!sourceBookId) return;

    setLedger((prev) => {
      const volumes = prev.oyay.volumes.map((vol) => ({
        ...vol,
        chapters: vol.chapters.map((ch) => {
          const updateList = (list, sec) =>
            (list || []).map((q) => {
              if (vol.id === source.volumeId && ch.id === source.chapterId && sec === source.section && q.id === source.questId) {
                return { ...q, bookId: targetBookId || null };
              }
              if (vol.id === target.volumeId && ch.id === target.chapterId && sec === target.section && q.id === target.questId) {
                return { ...q, bookId: sourceBookId };
              }
              return q;
            });

          return {
            ...ch,
            coreQuests: updateList(ch.coreQuests, 'core'),
            companionQuests: updateList(ch.companionQuests, 'companion'),
            bonusQuests: updateList(ch.bonusQuests, 'bonus')
          };
        })
      }));
      return { ...prev, oyay: { ...prev.oyay, volumes } };
    });

    const sourceTitle = ledger.books[sourceBookId]?.title || 'Book';
    if (targetBookId) {
      const targetTitle = ledger.books[targetBookId]?.title || 'Book';
      showToast(`Swapped "${sourceTitle}" ↔ "${targetTitle}"`, 'emerald');
    } else {
      showToast(`Moved "${sourceTitle}" to new quest slot!`, 'emerald');
    }
    triggerCelebration();
  };

  // Update reward points/tokens or D6 roll on an OYAY quest
  const updateOyayQuestMeta = (volumeId, chapterId, section, questId, patch) => {
    setLedger((prev) => {
      const volumes = prev.oyay.volumes.map((vol) => {
        if (vol.id !== volumeId) return vol;
        return {
          ...vol,
          chapters: vol.chapters.map((ch) => {
            if (ch.id !== chapterId) return ch;
            const listKey =
              section === 'core'
                ? 'coreQuests'
                : section === 'companion'
                ? 'companionQuests'
                : 'bonusQuests';
            return {
              ...ch,
              [listKey]: (ch[listKey] || []).map((q) =>
                q.id === questId ? { ...q, ...patch } : q
              )
            };
          })
        };
      });
      return { ...prev, oyay: { ...prev.oyay, volumes } };
    });
  };

  // Save new or edited book, and optionally link to target slot(s)
  const handleSaveBook = (bookPayload, targetLinks) => {
    const id = bookPayload.id || `bk-${Date.now()}`;
    const savedBook = {
      ...bookPayload,
      id,
      color: bookPayload.color || SPINE_PALETTE[Object.keys(ledger.books).length % SPINE_PALETTE.length]
    };

    setLedger((prev) => {
      let nextState = {
        ...prev,
        books: {
          ...prev.books,
          [id]: savedBook
        }
      };

      // Optional direct assignment to OYAY quest
      if (targetLinks?.oyay) {
        const { volumeId, chapterId, section, questId } = targetLinks.oyay;
        const volumes = nextState.oyay.volumes.map((vol) => {
          if (vol.id !== volumeId) return vol;
          return {
            ...vol,
            chapters: vol.chapters.map((ch) => {
              if (ch.id !== chapterId) return ch;
              const listKey =
                section === 'core'
                  ? 'coreQuests'
                  : section === 'companion'
                  ? 'companionQuests'
                  : 'bonusQuests';
              return {
                ...ch,
                [listKey]: (ch[listKey] || []).map((q) =>
                  q.id === questId ? { ...q, bookId: id } : q
                )
              };
            })
          };
        });
        nextState = { ...nextState, oyay: { ...nextState.oyay, volumes } };
      }

      // Optional direct assignment to Romanceopoly space/club/event/study
      if (targetLinks?.romanceopoly) {
        const { type, spaceIndex, groupId, promptId } = targetLinks.romanceopoly;
        if (type === 'board' && typeof spaceIndex === 'number') {
          nextState = {
            ...nextState,
            romanceopoly: {
              ...nextState.romanceopoly,
              spaceData: {
                ...nextState.romanceopoly.spaceData,
                [spaceIndex]: {
                  ...(nextState.romanceopoly.spaceData[spaceIndex] || {}),
                  bookId: id
                }
              }
            }
          };
        } else if (type === 'club') {
          nextState = {
            ...nextState,
            romanceopoly: {
              ...nextState.romanceopoly,
              clubs: nextState.romanceopoly.clubs.map((c) =>
                c.id === groupId
                  ? {
                      ...c,
                      prompts: c.prompts.map((p) => (p.id === promptId ? { ...p, bookId: id } : p))
                    }
                  : c
              )
            }
          };
        } else if (type === 'event') {
          nextState = {
            ...nextState,
            romanceopoly: {
              ...nextState.romanceopoly,
              events: nextState.romanceopoly.events.map((e) =>
                e.id === groupId
                  ? {
                      ...e,
                      prompts: e.prompts.map((p) => (p.id === promptId ? { ...p, bookId: id } : p))
                    }
                  : e
              )
            }
          };
        } else if (type === 'monthly') {
          nextState = {
            ...nextState,
            romanceopoly: {
              ...nextState.romanceopoly,
              monthlyStudy: nextState.romanceopoly.monthlyStudy.map((m) =>
                m.id === promptId ? { ...m, bookId: id } : m
              )
            }
          };
        }
      }

      return nextState;
    });

    if (savedBook.status === 'completed') {
      triggerCelebration();
    }
    showToast(`Saved "${savedBook.title}" to your Ledger!`, 'emerald');
    setBookModal({ open: false, book: null, presetTarget: null });
  };

  // Delete a book completely and clear references
  const handleDeleteBook = (bookId) => {
    const title = ledger.books[bookId]?.title || 'Book';
    setLedger((prev) => {
      const nextBooks = { ...prev.books };
      delete nextBooks[bookId];

      const volumes = prev.oyay.volumes.map((vol) => ({
        ...vol,
        chapters: vol.chapters.map((ch) => ({
          ...ch,
          coreQuests: ch.coreQuests.map((q) => (q.bookId === bookId ? { ...q, bookId: null } : q)),
          companionQuests: ch.companionQuests.map((q) => (q.bookId === bookId ? { ...q, bookId: null } : q)),
          bonusQuests: (ch.bonusQuests || []).map((q) => (q.bookId === bookId ? { ...q, bookId: null } : q))
        }))
      }));

      const nextSpaceData = {};
      Object.entries(prev.romanceopoly.spaceData).forEach(([k, v]) => {
        nextSpaceData[k] = v.bookId === bookId ? { ...v, bookId: null } : v;
      });

      return {
        ...prev,
        books: nextBooks,
        oyay: { ...prev.oyay, volumes },
        romanceopoly: {
          ...prev.romanceopoly,
          spaceData: nextSpaceData,
          clubs: prev.romanceopoly.clubs.map((c) => ({
            ...c,
            prompts: c.prompts.map((p) => (p.bookId === bookId ? { ...p, bookId: null } : p))
          })),
          events: prev.romanceopoly.events.map((e) => ({
            ...e,
            prompts: e.prompts.map((p) => (p.bookId === bookId ? { ...p, bookId: null } : p))
          })),
          monthlyStudy: prev.romanceopoly.monthlyStudy.map((m) =>
            m.bookId === bookId ? { ...m, bookId: null } : m
          )
        }
      };
    });
    showToast(`Removed "${title}" from the Ledger.`, 'gold');
  };

  // Export / Import / Reset JSON
  const handleExportJson = () => {
    const dataStr = JSON.stringify(ledger, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `travelers-reading-ledger-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported your Reading Ledger backup (.json)!', 'emerald');
  };

  const handleImportJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (parsed && parsed.books && parsed.oyay && parsed.romanceopoly) {
          setLedger(parsed);
          triggerCelebration();
          showToast('Successfully imported your Reading Ledger!', 'emerald');
        } else {
          showToast('Invalid ledger JSON file format.', 'rose');
        }
      } catch (err) {
        showToast('Could not parse the selected JSON file.', 'rose');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleConfirmReset = () => {
    const fresh = createInitialState();
    setLedger(fresh);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    setResetModalOpen(false);
    showToast('Reset Ledger to your pre-populated Volume 1 state.', 'gold');
  };

  // Romanceopoly Board Pawn Dice Roller
  const handleRollBoardDice = () => {
    if (isPawnRolling) return;
    setIsPawnRolling(true);
    let ticks = 0;
    const interval = setInterval(() => {
      ticks += 1;
      const tempRoll = Math.floor(Math.random() * 6) + 1;
      setLastBoardRoll(tempRoll);
      if (ticks >= 8) {
        clearInterval(interval);
        const finalRoll = Math.floor(Math.random() * 6) + 1;
        setLastBoardRoll(finalRoll);
        setIsPawnRolling(false);
        setLedger((prev) => {
          const nextPos = (prev.romanceopoly.pawnPosition + finalRoll) % 20;
          return {
            ...prev,
            romanceopoly: {
              ...prev.romanceopoly,
              pawnPosition: nextPos
            }
          };
        });
        triggerCelebration();
      }
    }, 65);
  };

  // ==========================================================================
  // RENDER: HEADER & REALM SWITCHER
  // ==========================================================================

  return (
    <div className="min-h-screen parchment-bg text-[#2A211C] pb-16">
      <ConfettiBurst triggerKey={confettiKey} />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-xl border border-[#C59B27]/50 bg-[#1E3A2F] px-4 py-3 text-sm font-medium text-[#FFFDF9] shadow-xl transition-all">
          <Sparkles className="h-4 w-4 text-[#E6B84C] shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Ornamental Ribbon & Header */}
      <header className="sticky top-0 z-30 border-b border-[#E6DCCB] bg-[#FFFDF9]/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 py-3.5 lg:flex-row lg:items-center lg:justify-between">
            {/* Title & Crest */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#C59B27]/50 bg-[#1E3A2F] text-[#E6B84C] shadow-inner">
                <Feather className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-lg font-bold tracking-wide text-[#1E3A2F] sm:text-xl">
                    The Traveler&apos;s Reading Ledger
                  </h1>
                  <span className="hidden rounded-full border border-[#C59B27]/40 bg-[#FAF6F0] px-2.5 py-0.5 text-[11px] font-semibold text-[#8B3A4A] sm:inline-block">
                    2026–2027 Edition
                  </span>
                </div>
                <p className="font-editorial italic text-xs text-[#6B5B50]">
                  Enchanted Quest Chronicle &amp; Romantic Academia Tracker
                </p>
              </div>
            </div>

            {/* Utility Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setDiceModal({ open: true, sides: 6, context: 'general', targetQuest: null })}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#C59B27] bg-gradient-to-b from-[#FFF9EB] to-[#F5E8C7] px-3 py-2 text-xs font-semibold text-[#2A211C] shadow-sm transition hover:brightness-95 active:scale-95"
              >
                <Dices className="h-4 w-4 text-[#8B3A4A]" />
                <span>Roll Fate Dice</span>
              </button>

              <button
                onClick={() => setBookModal({ open: true, book: null, presetTarget: null })}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#1E3A2F] px-3.5 py-2 text-xs font-semibold text-[#FFFDF9] shadow-sm transition hover:bg-[#274B3D] active:scale-95"
              >
                <Plus className="h-4 w-4 text-[#E6B84C]" />
                <span>Add Book</span>
              </button>

              <div className="h-5 w-px bg-[#E6DCCB] mx-0.5 hidden sm:block" />

              <button
                onClick={handleExportJson}
                title="Save / Export Backup JSON"
                className="inline-flex items-center gap-1 rounded-xl border border-[#E6DCCB] bg-[#FAF6F0] px-2.5 py-2 text-xs font-medium text-[#2A211C] transition hover:border-[#C59B27] hover:bg-[#FFFDF9]"
              >
                <Download className="h-3.5 w-3.5 text-[#1E3A2F]" />
                <span className="hidden md:inline">Export</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                title="Import Backup JSON"
                className="inline-flex items-center gap-1 rounded-xl border border-[#E6DCCB] bg-[#FAF6F0] px-2.5 py-2 text-xs font-medium text-[#2A211C] transition hover:border-[#C59B27] hover:bg-[#FFFDF9]"
              >
                <Upload className="h-3.5 w-3.5 text-[#1E3A2F]" />
                <span className="hidden md:inline">Import</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportJson}
                className="hidden"
              />

              <button
                onClick={() => setResetModalOpen(true)}
                title="Reset to Default Pre-populated State"
                className="inline-flex items-center gap-1 rounded-xl border border-[#E6DCCB] bg-[#FAF6F0] px-2.5 py-2 text-xs font-medium text-[#8B3A4A] transition hover:border-[#8B3A4A]/50 hover:bg-[#FFFDF9]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Reset</span>
              </button>
            </div>
          </div>

          {/* Realm Switcher Navigation Tabs */}
          <nav className="flex gap-1.5 overflow-x-auto pb-2.5 pt-1">
            {[
              {
                id: 'oyay',
                label: '🏰 Once Upon A Year (Vol. 1 & 2)',
                badge: `${oyayStats.totalPoints} pts • ${oyayStats.totalTokens} tokens`
              },
              {
                id: 'romanceopoly',
                label: '🎓 Romanceopoly 2027',
                badge: `${romanceopolyStats.academicCompleted}/20 Spaces`
              },
              {
                id: 'bookshelf',
                label: '📚 Master Bookshelf & Double-Dips',
                badge: `${Object.keys(ledger.books).length} Books`
              }
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                    active
                      ? 'bg-[#1E3A2F] text-[#FFFDF9] shadow-sm ring-1 ring-[#C59B27]/50'
                      : 'bg-[#FAF6F0] text-[#5C4D43] border border-[#E6DCCB] hover:border-[#C59B27] hover:text-[#2A211C]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      active
                        ? 'bg-[#FFFDF9]/15 text-[#E6B84C]'
                        : 'bg-[#E6DCCB]/60 text-[#5C4D43]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* TAB 1: ONCE UPON A YEAR (OYAY)                                       */}
      {/* ==================================================================== */}
      {activeTab === 'oyay' && (
        <main className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 space-y-6">
          {/* Traveler Profile Banner */}
          <section className="storybook-card relative overflow-hidden rounded-2xl p-5 sm:p-6">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-[#C59B27]/10 blur-2xl pointer-events-none" />
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              {/* Left: Traveler Identity & Roles */}
              <div className="space-y-3.5 max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#C59B27]/40 bg-[#FAF6F0] px-3 py-1 text-xs font-semibold text-[#8B3A4A]">
                  <Castle className="h-3.5 w-3.5" />
                  <span>A storybook-inspired readathon adventure. Every story begins with a single page.</span>
                </div>

                {/* Editable Traveler Name + Year Goal */}
                <div className="flex flex-wrap items-center gap-3">
                  {editingTravelerName ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        setEditingTravelerName(false);
                      }}
                      className="flex items-center gap-2"
                    >
                      <input
                        autoFocus
                        value={ledger.oyay.travelerName}
                        onChange={(e) =>
                          setLedger((prev) => ({
                            ...prev,
                            oyay: { ...prev.oyay, travelerName: e.target.value }
                          }))
                        }
                        className="rounded-lg border border-[#C59B27] bg-[#FAF6F0] px-3 py-1 font-display text-xl font-bold text-[#1E3A2F] focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="rounded-lg bg-[#1E3A2F] p-1.5 text-[#FFFDF9]"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h2 className="font-display text-2xl font-bold text-[#1E3A2F] sm:text-3xl">
                        {ledger.oyay.travelerName}&apos;s Chronicle
                      </h2>
                      <button
                        onClick={() => setEditingTravelerName(true)}
                        title="Edit Traveler Name"
                        className="rounded-lg p-1.5 text-[#6B5B50] hover:bg-[#FAF6F0] hover:text-[#1E3A2F]"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {/* Year Book Goal Pill */}
                  <div className="flex items-center gap-2 rounded-xl border border-[#E6DCCB] bg-[#FAF6F0] px-3 py-1.5 text-xs">
                    <span className="font-semibold text-[#5C4D43]">Year Goal:</span>
                    {editingGoal ? (
                      <input
                        type="number"
                        min={1}
                        max={500}
                        autoFocus
                        value={ledger.oyay.yearBookGoal}
                        onBlur={() => setEditingGoal(false)}
                        onChange={(e) =>
                          setLedger((prev) => ({
                            ...prev,
                            oyay: {
                              ...prev.oyay,
                              yearBookGoal: Math.max(1, parseInt(e.target.value || '1', 10))
                            }
                          }))
                        }
                        className="w-16 rounded border border-[#C59B27] bg-[#FFFDF9] px-1.5 py-0.5 font-bold text-[#1E3A2F]"
                      />
                    ) : (
                      <button
                        onClick={() => setEditingGoal(true)}
                        className="font-bold text-[#1E3A2F] underline decoration-[#C59B27] decoration-dotted underline-offset-2"
                      >
                        {oyayStats.booksLogged} / {ledger.oyay.yearBookGoal} Books
                      </button>
                    )}
                    <div className="h-2 w-20 overflow-hidden rounded-full bg-[#E6DCCB]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#1E3A2F] to-[#C59B27] transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round((oyayStats.booksLogged / Math.max(1, ledger.oyay.yearBookGoal)) * 100)
                          )}%`
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Interactive Traveler Role Seals */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {ledger.oyay.roles.map((role) => {
                      const isTooltipOpen = activeRoleTooltip === role.id;
                      return (
                        <div key={role.id} className="relative">
                          <div
                            className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                              role.active
                                ? 'border-[#C59B27] bg-[#1E3A2F] text-[#FFFDF9] shadow-sm'
                                : 'border-[#E6DCCB] bg-[#FAF6F0] text-[#7A6A5E] opacity-75'
                            }`}
                          >
                            <button
                              onClick={() => {
                                setLedger((prev) => ({
                                  ...prev,
                                  oyay: {
                                    ...prev.oyay,
                                    roles: prev.oyay.roles.map((r) =>
                                      r.id === role.id ? { ...r, active: !r.active } : r
                                    )
                                  }
                                }));
                              }}
                              className="flex items-center gap-1.5"
                              title="Click to toggle role active status"
                            >
                              <span>{role.icon}</span>
                              <span>{role.name}</span>
                            </button>
                            <button
                              onClick={() =>
                                setActiveRoleTooltip(isTooltipOpen ? null : role.id)
                              }
                              title="View Role Lore"
                              className={`rounded-full p-0.5 ${
                                role.active ? 'text-[#E6B84C] hover:bg-white/10' : 'text-[#7A6A5E]'
                              }`}
                            >
                              <Info className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Lore Box if a role tooltip is clicked */}
                  {activeRoleTooltip && (
                    <div className="flex items-start justify-between gap-3 rounded-xl border border-[#C59B27]/40 bg-[#FAF6F0] p-3 text-xs text-[#2A211C]">
                      <p className="font-editorial italic leading-relaxed">
                        <strong className="not-italic font-semibold text-[#1E3A2F]">
                          {ledger.oyay.roles.find((r) => r.id === activeRoleTooltip)?.icon}{' '}
                          {ledger.oyay.roles.find((r) => r.id === activeRoleTooltip)?.name}:
                        </strong>{' '}
                        {ledger.oyay.roles.find((r) => r.id === activeRoleTooltip)?.lore}
                      </p>
                      <button
                        onClick={() => setActiveRoleTooltip(null)}
                        className="text-[#6B5B50] hover:text-[#2A211C]"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: 4 Live Scoreboard Cards */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-[460px] shrink-0">
                <div className="rounded-xl border border-[#C59B27]/50 bg-gradient-to-b from-[#FFFDF9] to-[#FAF4E4] p-3.5 text-center shadow-sm">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#7C5229]">
                    Total Points
                  </div>
                  <div className="mt-1 font-display text-2xl font-bold text-[#1E3A2F]">
                    {oyayStats.totalPoints}
                  </div>
                  <div className="mt-0.5 text-[11px] text-[#6B5B50]">Core &amp; Bonus</div>
                </div>

                <div className="rounded-xl border border-[#8B3A4A]/30 bg-gradient-to-b from-[#FFFDF9] to-[#F9EFF1] p-3.5 text-center shadow-sm">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8B3A4A]">
                    Tokens
                  </div>
                  <div className="mt-1 font-display text-2xl font-bold text-[#8B3A4A]">
                    {oyayStats.totalTokens}
                  </div>
                  <div className="mt-0.5 text-[11px] text-[#6B5B50]">Companion Guild</div>
                </div>

                <div className="rounded-xl border border-[#1E3A2F]/25 bg-gradient-to-b from-[#FFFDF9] to-[#EDF3F0] p-3.5 text-center shadow-sm">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#1E3A2F]">
                    Main Quests
                  </div>
                  <div className="mt-1 font-display text-2xl font-bold text-[#1E3A2F]">
                    {oyayStats.mainCompleted}
                    <span className="text-sm font-normal text-[#6B5B50]">/{oyayStats.mainTotal}</span>
                  </div>
                  <div className="mt-0.5 text-[11px] text-[#6B5B50]">
                    +{oyayStats.bonusCompleted} Side Quests
                  </div>
                </div>

                <div className="rounded-xl border border-[#E6DCCB] bg-[#FAF6F0] p-3.5 text-center shadow-sm">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#5C4D43]">
                    Books Logged
                  </div>
                  <div className="mt-1 font-display text-2xl font-bold text-[#2A211C]">
                    {oyayStats.booksLogged}
                  </div>
                  <div className="mt-0.5 text-[11px] text-[#6B5B50]">In Realm</div>
                </div>
              </div>
            </div>
          </section>

          {/* Volume Switcher & Chapter Filter Bar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Volume Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {ledger.oyay.volumes.map((vol) => {
                const isSelected = vol.id === activeVolumeId;
                return (
                  <button
                    key={vol.id}
                    onClick={() => {
                      setActiveVolumeId(vol.id);
                      setChapterFilter('all');
                    }}
                    className={`rounded-xl px-4 py-2.5 text-left transition-all ${
                      isSelected
                        ? 'bg-[#1E3A2F] text-[#FFFDF9] shadow-md ring-1 ring-[#C59B27]'
                        : 'storybook-card text-[#2A211C] hover:border-[#C59B27]'
                    }`}
                  >
                    <div className="font-display text-xs sm:text-sm font-bold">{vol.title}</div>
                    <div
                      className={`text-[11px] ${
                        isSelected ? 'text-[#E6B84C]' : 'text-[#6B5B50]'
                      }`}
                    >
                      {vol.subtitle}
                    </div>
                  </button>
                );
              })}

              {activeVolumeId === 'vol-2' && (
                <button
                  onClick={() => setNewChapterModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-[#C59B27] bg-[#FFFDF9] px-3.5 py-2.5 text-xs font-semibold text-[#1E3A2F] hover:bg-[#FAF6F0]"
                >
                  <Plus className="h-4 w-4 text-[#C59B27]" />
                  <span>Add Chapter to Vol. 2</span>
                </button>
              )}
            </div>

            {/* Chapter Filter Pills */}
            {(() => {
              const currentVol = ledger.oyay.volumes.find((v) => v.id === activeVolumeId);
              if (!currentVol) return null;
              return (
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => setChapterFilter('all')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      chapterFilter === 'all'
                        ? 'bg-[#8B3A4A] text-[#FFFDF9]'
                        : 'bg-[#FFFDF9] border border-[#E6DCCB] text-[#5C4D43] hover:border-[#8B3A4A]'
                    }`}
                  >
                    All Chapters
                  </button>
                  {currentVol.chapters.map((ch) => (
                    <button
                      key={ch.id}
                      onClick={() => setChapterFilter(ch.id)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                        chapterFilter === ch.id
                          ? 'bg-[#8B3A4A] text-[#FFFDF9]'
                          : 'bg-[#FFFDF9] border border-[#E6DCCB] text-[#5C4D43] hover:border-[#8B3A4A]'
                      }`}
                    >
                      {ch.icon} Ch. {ch.number}
                    </button>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Drag & Drop Hint Banner */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#E6DCCB] bg-[#FFFDF9]/80 px-4 py-2.5 text-xs text-[#5C4D43]">
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-[#C59B27]" />
              <span>
                <strong>Tip:</strong> Drag &amp; drop any assigned book onto another quest card to{' '}
                <strong>move or swap</strong> books automatically, or click{' '}
                <strong className="text-[#1E3A2F]">⇄ Move / Swap</strong> on any card!
              </span>
            </div>
            <span className="text-[11px] italic text-[#8B3A4A]">
              All changes &amp; points recalculate automatically
            </span>
          </div>

          {/* Chapters Render */}
          {(() => {
            const currentVol = ledger.oyay.volumes.find((v) => v.id === activeVolumeId);
            if (!currentVol) return null;
            const visibleChapters =
              chapterFilter === 'all'
                ? currentVol.chapters
                : currentVol.chapters.filter((c) => c.id === chapterFilter);

            return visibleChapters.map((chapter) => {
              // Calculate chapter subtotal
              const chPoints = chapter.coreQuests.reduce((acc, q) => {
                if (q.bookId && ledger.books[q.bookId]?.status === 'completed') {
                  return acc + Number(q.points || 0);
                }
                return acc;
              }, 0) +
                (chapter.bonusQuests || []).reduce((acc, q) => {
                  if (q.bookId && ledger.books[q.bookId]?.status === 'completed') {
                    return acc + Number(q.points || 0);
                  }
                  return acc;
                }, 0);

              const chTokens = chapter.companionQuests.reduce((acc, q) => {
                if (q.bookId && ledger.books[q.bookId]?.status === 'completed') {
                  return acc + Number(q.tokens || 0);
                }
                return acc;
              }, 0) +
                (chapter.bonusQuests || []).reduce((acc, q) => {
                  if (q.bookId && ledger.books[q.bookId]?.status === 'completed') {
                    return acc + Number(q.tokens || 0);
                  }
                  return acc;
                }, 0);

              const isBonusExpanded = !!expandedBonusChapters[chapter.id];

              return (
                <section
                  key={chapter.id}
                  className="storybook-card rounded-2xl p-5 sm:p-6 space-y-6"
                >
                  {/* Chapter Header */}
                  <div className="flex flex-col gap-3 border-b border-[#E6DCCB] pb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-xl text-xl text-white shadow-sm"
                        style={{ backgroundColor: chapter.accent }}
                      >
                        {chapter.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display text-lg font-bold text-[#1E3A2F] sm:text-xl">
                            {chapter.title}
                          </h3>
                          <span className="rounded-full bg-[#FAF6F0] border border-[#E6DCCB] px-2.5 py-0.5 text-[11px] font-semibold text-[#6B5B50]">
                            {chapter.season}
                          </span>
                        </div>
                        <p className="text-xs text-[#6B5B50]">
                          Complete Core Quests for Realm Points &amp; Companion Quests for Guild Tokens
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-xl border border-[#C59B27]/50 bg-[#FAF4E4] px-3 py-1.5 text-xs font-bold text-[#7C5229]">
                        ✦ {chPoints} pts
                      </span>
                      <span className="rounded-xl border border-[#8B3A4A]/30 bg-[#F9EFF1] px-3 py-1.5 text-xs font-bold text-[#8B3A4A]">
                        ◈ {chTokens} tokens
                      </span>
                      <button
                        onClick={() =>
                          setCustomQuestModal({
                            open: true,
                            volumeId: currentVol.id,
                            chapterId: chapter.id
                          })
                        }
                        className="inline-flex items-center gap-1 rounded-xl border border-[#1E3A2F]/30 bg-[#EDF3F0] px-3 py-1.5 text-xs font-semibold text-[#1E3A2F] transition hover:bg-[#1E3A2F] hover:text-[#FFFDF9]"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Custom Quest / Points</span>
                      </button>
                    </div>
                  </div>

                  {/* CORE QUESTS */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display text-sm font-bold uppercase tracking-wider text-[#1E3A2F] flex items-center gap-2">
                        <Scroll className="h-4 w-4 text-[#C59B27]" />
                        <span>Core Quests (Realm Points)</span>
                      </h4>
                      <span className="text-xs text-[#6B5B50]">
                        {chapter.coreQuests.filter((q) => q.bookId && ledger.books[q.bookId]?.status === 'completed').length}{' '}
                        / {chapter.coreQuests.length} Completed
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 lg:grid-cols-3">
                      {chapter.coreQuests.map((quest) => (
                        <OyayQuestCard
                          key={quest.id}
                          quest={quest}
                          section="core"
                          volumeId={currentVol.id}
                          chapterId={chapter.id}
                          book={quest.bookId ? ledger.books[quest.bookId] : null}
                          isDragOver={dragOverQuestId === quest.id}
                          onDragStart={() =>
                            setDragSource({
                              volumeId: currentVol.id,
                              chapterId: chapter.id,
                              section: 'core',
                              questId: quest.id,
                              bookId: quest.bookId
                            })
                          }
                          onDragOver={(e) => {
                            e.preventDefault();
                            setDragOverQuestId(quest.id);
                          }}
                          onDragLeave={() => setDragOverQuestId(null)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setDragOverQuestId(null);
                            if (dragSource) {
                              moveOrSwapOyayBooks(dragSource, {
                                volumeId: currentVol.id,
                                chapterId: chapter.id,
                                section: 'core',
                                questId: quest.id
                              });
                              setDragSource(null);
                            }
                          }}
                          onToggleStatus={() => quest.bookId && toggleBookStatus(quest.bookId)}
                          onAssignClick={() =>
                            setSlotModal({
                              open: true,
                              mode: 'assign',
                              source: {
                                volumeId: currentVol.id,
                                chapterId: chapter.id,
                                section: 'core',
                                questId: quest.id,
                                prompt: quest.prompt
                              }
                            })
                          }
                          onMoveSwapClick={() =>
                            setSlotModal({
                              open: true,
                              mode: 'moveswap',
                              source: {
                                volumeId: currentVol.id,
                                chapterId: chapter.id,
                                section: 'core',
                                questId: quest.id,
                                bookId: quest.bookId,
                                prompt: quest.prompt
                              }
                            })
                          }
                          onUnassignClick={() => {
                            setOyayQuestBook(currentVol.id, chapter.id, 'core', quest.id, null);
                            showToast('Unassigned book back to your Master Bookshelf.', 'gold');
                          }}
                          onRollD6Inline={() =>
                            setDiceModal({
                              open: true,
                              sides: 6,
                              context: 'oyay-pages',
                              targetQuest: {
                                volumeId: currentVol.id,
                                chapterId: chapter.id,
                                section: 'core',
                                questId: quest.id
                              }
                            })
                          }
                          onUpdateReward={(val) =>
                            updateOyayQuestMeta(currentVol.id, chapter.id, 'core', quest.id, {
                              points: Math.max(0, Number(val) || 0)
                            })
                          }
                        />
                      ))}
                    </div>
                  </div>

                  {/* COMPANION QUESTS */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display text-sm font-bold uppercase tracking-wider text-[#8B3A4A] flex items-center gap-2">
                        <Award className="h-4 w-4 text-[#8B3A4A]" />
                        <span>Companion Quests (Guild Tokens)</span>
                      </h4>
                      <span className="text-xs text-[#6B5B50]">
                        {chapter.companionQuests.filter((q) => q.bookId && ledger.books[q.bookId]?.status === 'completed').length}{' '}
                        / {chapter.companionQuests.length} Completed
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 lg:grid-cols-4">
                      {chapter.companionQuests.map((quest) => (
                        <OyayQuestCard
                          key={quest.id}
                          quest={quest}
                          section="companion"
                          volumeId={currentVol.id}
                          chapterId={chapter.id}
                          book={quest.bookId ? ledger.books[quest.bookId] : null}
                          isDragOver={dragOverQuestId === quest.id}
                          onDragStart={() =>
                            setDragSource({
                              volumeId: currentVol.id,
                              chapterId: chapter.id,
                              section: 'companion',
                              questId: quest.id,
                              bookId: quest.bookId
                            })
                          }
                          onDragOver={(e) => {
                            e.preventDefault();
                            setDragOverQuestId(quest.id);
                          }}
                          onDragLeave={() => setDragOverQuestId(null)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setDragOverQuestId(null);
                            if (dragSource) {
                              moveOrSwapOyayBooks(dragSource, {
                                volumeId: currentVol.id,
                                chapterId: chapter.id,
                                section: 'companion',
                                questId: quest.id
                              });
                              setDragSource(null);
                            }
                          }}
                          onToggleStatus={() => quest.bookId && toggleBookStatus(quest.bookId)}
                          onAssignClick={() =>
                            setSlotModal({
                              open: true,
                              mode: 'assign',
                              source: {
                                volumeId: currentVol.id,
                                chapterId: chapter.id,
                                section: 'companion',
                                questId: quest.id,
                                prompt: quest.prompt
                              }
                            })
                          }
                          onMoveSwapClick={() =>
                            setSlotModal({
                              open: true,
                              mode: 'moveswap',
                              source: {
                                volumeId: currentVol.id,
                                chapterId: chapter.id,
                                section: 'companion',
                                questId: quest.id,
                                bookId: quest.bookId,
                                prompt: quest.prompt
                              }
                            })
                          }
                          onUnassignClick={() => {
                            setOyayQuestBook(currentVol.id, chapter.id, 'companion', quest.id, null);
                            showToast('Unassigned book back to your Master Bookshelf.', 'gold');
                          }}
                          onUpdateReward={(val) =>
                            updateOyayQuestMeta(currentVol.id, chapter.id, 'companion', quest.id, {
                              tokens: Math.max(0, Number(val) || 0)
                            })
                          }
                        />
                      ))}
                    </div>
                  </div>

                  {/* COLLAPSIBLE BONUS / FESTIVAL & SIDE STORIES */}
                  {chapter.bonusQuests && chapter.bonusQuests.length > 0 && (
                    <div className="rounded-xl border border-[#E6DCCB] bg-[#FAF6F0]/80">
                      <button
                        onClick={() =>
                          setExpandedBonusChapters((prev) => ({
                            ...prev,
                            [chapter.id]: !prev[chapter.id]
                          }))
                        }
                        className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-[#FAF6F0]"
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-[#C59B27]" />
                          <span className="font-display text-xs sm:text-sm font-bold text-[#1E3A2F]">
                            {chapter.bonusTitle}
                          </span>
                          <span className="rounded-full bg-[#E6DCCB]/70 px-2 py-0.5 text-[11px] font-semibold text-[#5C4D43]">
                            {chapter.bonusQuests.filter((b) => b.bookId).length} /{' '}
                            {chapter.bonusQuests.length} Filled
                          </span>
                        </div>
                        {isBonusExpanded ? (
                          <ChevronDown className="h-4 w-4 text-[#6B5B50]" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-[#6B5B50]" />
                        )}
                      </button>

                      {isBonusExpanded && (
                        <div className="grid grid-cols-1 gap-3 border-t border-[#E6DCCB] p-4 sm:grid-cols-2 lg:grid-cols-3">
                          {chapter.bonusQuests.map((bq) => {
                            const assignedBook = bq.bookId ? ledger.books[bq.bookId] : null;
                            return (
                              <div
                                key={bq.id}
                                onDragOver={(e) => {
                                  e.preventDefault();
                                  setDragOverQuestId(bq.id);
                                }}
                                onDragLeave={() => setDragOverQuestId(null)}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  setDragOverQuestId(null);
                                  if (dragSource) {
                                    moveOrSwapOyayBooks(dragSource, {
                                      volumeId: currentVol.id,
                                      chapterId: chapter.id,
                                      section: 'bonus',
                                      questId: bq.id
                                    });
                                    setDragSource(null);
                                  }
                                }}
                                className={`rounded-xl border p-3 transition ${
                                  dragOverQuestId === bq.id
                                    ? 'border-[#C59B27] bg-[#FFF9EB] ring-2 ring-[#C59B27]/40'
                                    : 'border-[#E6DCCB] bg-[#FFFDF9]'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-display text-xs font-bold text-[#8B3A4A]">
                                    {bq.label}
                                  </span>
                                  <span className="rounded-md bg-[#FAF6F0] px-2 py-0.5 text-[10px] font-semibold text-[#7C5229]">
                                    {bq.points > 0 ? `+${bq.points} pts` : `+${bq.tokens} token`}
                                  </span>
                                </div>
                                <p className="mt-1 text-xs text-[#5C4D43]">{bq.prompt}</p>

                                {assignedBook ? (
                                  <div className="mt-2.5 flex items-center justify-between gap-2 rounded-lg border border-[#E6DCCB] bg-[#FAF6F0] px-2.5 py-1.5">
                                    <button
                                      onClick={() => toggleBookStatus(assignedBook.id)}
                                      className="flex items-center gap-1.5 text-left text-xs font-semibold text-[#1E3A2F] truncate"
                                    >
                                      {assignedBook.status === 'completed' ? (
                                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#2E6F40]" />
                                      ) : (
                                        <Clock className="h-3.5 w-3.5 shrink-0 text-[#C59B27]" />
                                      )}
                                      <span className="truncate">{assignedBook.title}</span>
                                    </button>
                                    <button
                                      onClick={() =>
                                        setOyayQuestBook(
                                          currentVol.id,
                                          chapter.id,
                                          'bonus',
                                          bq.id,
                                          null
                                        )
                                      }
                                      className="text-[#6B5B50] hover:text-[#8B3A4A]"
                                      title="Unassign"
                                    >
                                      <X className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() =>
                                      setSlotModal({
                                        open: true,
                                        mode: 'assign',
                                        source: {
                                          volumeId: currentVol.id,
                                          chapterId: chapter.id,
                                          section: 'bonus',
                                          questId: bq.id,
                                          prompt: `${bq.label}: ${bq.prompt}`
                                        }
                                      })
                                    }
                                    className="mt-2.5 inline-flex items-center gap-1 rounded-lg border border-dashed border-[#C59B27]/60 px-2.5 py-1 text-[11px] font-semibold text-[#1E3A2F] hover:bg-[#FAF6F0]"
                                  >
                                    <Plus className="h-3 w-3" />
                                    <span>Assign Side Read</span>
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </section>
              );
            });
          })()}
        </main>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: ROMANCEOPOLY 2027 (BOARD & CAMPUS TRACKER)                    */}
      {/* ==================================================================== */}
      {activeTab === 'romanceopoly' && (
        <main className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 space-y-6">
          {/* Campus Degree & Board Control Banner */}
          <section className="storybook-card rounded-2xl p-5 sm:p-6 space-y-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#8B3A4A]/30 bg-[#F9EFF1] px-3 py-1 text-xs font-semibold text-[#8B3A4A]">
                  <GraduationCap className="h-3.5 w-3.5" />
                  <span>Class of 2027 • Academic Board &amp; Campus Extracurriculars</span>
                </div>
                <h2 className="mt-2 font-display text-2xl font-bold text-[#1E3A2F] sm:text-3xl">
                  Romanceopoly University 2027
                </h2>
                <p className="font-editorial italic text-xs sm:text-sm text-[#6B5B50]">
                  Declare your Major &amp; Minor faculties, roll the campus dice, and earn your scholarly seals.
                </p>
              </div>

              {/* Roll Board Dice & View Switcher */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={handleRollBoardDice}
                  disabled={isPawnRolling}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#8B3A4A] to-[#6B2D3E] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#FFFDF9] shadow-md transition hover:brightness-110 active:scale-95"
                >
                  <Dices className={`h-4 w-4 text-[#E6B84C] ${isPawnRolling ? 'animate-dice' : ''}`} />
                  <span>
                    {isPawnRolling
                      ? 'Rolling Campus Die...'
                      : lastBoardRoll
                      ? `Rolled ${lastBoardRoll}! Roll Again`
                      : 'Roll the Board Dice'}
                  </span>
                </button>

                <div className="inline-flex rounded-xl border border-[#E6DCCB] bg-[#FAF6F0] p-1">
                  <button
                    onClick={() => setRomViewMode('board')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      romViewMode === 'board'
                        ? 'bg-[#1E3A2F] text-[#FFFDF9]'
                        : 'text-[#5C4D43] hover:text-[#2A211C]'
                    }`}
                  >
                    🎲 Board Track
                  </button>
                  <button
                    onClick={() => setRomViewMode('list')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      romViewMode === 'list'
                        ? 'bg-[#1E3A2F] text-[#FFFDF9]'
                        : 'text-[#5C4D43] hover:text-[#2A211C]'
                    }`}
                  >
                    📋 Syllabus Checklist
                  </button>
                </div>
              </div>
            </div>

            {/* Major & Minor Selectors + Pawn Customizer */}
            <div className="grid grid-cols-1 gap-4 rounded-xl border border-[#E6DCCB] bg-[#FAF6F0] p-4 md:grid-cols-3">
              {/* Major Selector */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E3A2F]">
                  Major Department (5 Classes)
                </label>
                <select
                  value={ledger.romanceopoly.major}
                  onChange={(e) => {
                    const nextMajor = e.target.value;
                    setLedger((prev) => ({
                      ...prev,
                      romanceopoly: {
                        ...prev.romanceopoly,
                        major: nextMajor,
                        minor:
                          prev.romanceopoly.minor === nextMajor
                            ? Object.keys(ROMANCEOPOLY_DEPARTMENTS).find((k) => k !== nextMajor)
                            : prev.romanceopoly.minor
                      }
                    }));
                  }}
                  className="mt-1.5 w-full rounded-xl border border-[#E6DCCB] bg-[#FFFDF9] px-3 py-2 text-xs sm:text-sm font-semibold text-[#2A211C] focus:border-[#C59B27] focus:outline-none"
                >
                  {Object.keys(ROMANCEOPOLY_DEPARTMENTS).map((dept) => (
                    <option key={dept} value={dept}>
                      {ROMANCEOPOLY_DEPARTMENTS[dept].icon} {dept}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-[#6B5B50]">
                  {ROMANCEOPOLY_DEPARTMENTS[ledger.romanceopoly.major]?.tagline}
                </p>
              </div>

              {/* Minor Selector */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8B3A4A]">
                  Minor Department (5 Classes)
                </label>
                <select
                  value={ledger.romanceopoly.minor}
                  onChange={(e) =>
                    setLedger((prev) => ({
                      ...prev,
                      romanceopoly: { ...prev.romanceopoly, minor: e.target.value }
                    }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-[#E6DCCB] bg-[#FFFDF9] px-3 py-2 text-xs sm:text-sm font-semibold text-[#2A211C] focus:border-[#C59B27] focus:outline-none"
                >
                  {Object.keys(ROMANCEOPOLY_DEPARTMENTS)
                    .filter((d) => d !== ledger.romanceopoly.major)
                    .map((dept) => (
                      <option key={dept} value={dept}>
                        {ROMANCEOPOLY_DEPARTMENTS[dept].icon} {dept}
                      </option>
                    ))}
                </select>
                <p className="mt-1 text-[11px] text-[#6B5B50]">
                  {ROMANCEOPOLY_DEPARTMENTS[ledger.romanceopoly.minor]?.tagline}
                </p>
              </div>

              {/* Active Pawn Location Card */}
              <div className="flex flex-col justify-between rounded-xl border border-[#C59B27]/40 bg-[#FFFDF9] p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#7C5229]">
                    Current Pawn Space (#{ledger.romanceopoly.pawnPosition + 1}/20)
                  </span>
                  <div className="flex items-center gap-1">
                    {['🎓', '🦉', '🌹', '🕯️', '🏰'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() =>
                          setLedger((prev) => ({
                            ...prev,
                            romanceopoly: { ...prev.romanceopoly, pawnEmoji: emoji }
                          }))
                        }
                        className={`rounded-md px-1.5 py-0.5 text-xs ${
                          ledger.romanceopoly.pawnEmoji === emoji
                            ? 'bg-[#1E3A2F] text-white'
                            : 'hover:bg-[#FAF6F0]'
                        }`}
                        title="Choose Board Pawn"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                {(() => {
                  const landed = romanceopolySpaces[ledger.romanceopoly.pawnPosition];
                  if (!landed) return null;
                  return (
                    <div className="mt-1.5">
                      <div className="text-xs font-bold text-[#1E3A2F]">
                        {ledger.romanceopoly.pawnEmoji} {landed.landmark}{' '}
                        <span className="font-normal text-[#6B5B50]">({landed.code})</span>
                      </div>
                      <p className="line-clamp-1 text-[11px] text-[#5C4D43]">{landed.prompt}</p>
                    </div>
                  );
                })()}
              </div>
            </div>
          </section>

          {/* BOARD VIEW OR CHECKLIST VIEW */}
          {romViewMode === 'board' ? (
            <section className="storybook-card rounded-2xl p-4 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-display text-base sm:text-lg font-bold text-[#1E3A2F]">
                  Campus Board Track (Click any space to move pawn, edit prompt, or assign a book)
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
                  <span className="rounded-md bg-[#F9EFF1] px-2 py-0.5 text-[#8B3A4A]">
                    1–5 Core
                  </span>
                  <span className="rounded-md bg-[#EDF3F0] px-2 py-0.5 text-[#1E3A2F]">
                    6–10 Major ({ledger.romanceopoly.major})
                  </span>
                  <span className="rounded-md bg-[#FAF4E4] px-2 py-0.5 text-[#7C5229]">
                    11–15 Minor ({ledger.romanceopoly.minor})
                  </span>
                  <span className="rounded-md bg-[#EEF1F6] px-2 py-0.5 text-[#2B3A55]">
                    16–20 Electives
                  </span>
                </div>
              </div>

              {/* 20-Space Interactive Tabletop Grid */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
                {romanceopolySpaces.map((sp) => {
                  const isPawnHere = ledger.romanceopoly.pawnPosition === sp.index;
                  const assignedBook = sp.bookId ? ledger.books[sp.bookId] : null;
                  const isCompleted = assignedBook?.status === 'completed';

                  return (
                    <div
                      key={sp.id}
                      onClick={() =>
                        setLedger((prev) => ({
                          ...prev,
                          romanceopoly: { ...prev.romanceopoly, pawnPosition: sp.index }
                        }))
                      }
                      className={`group relative flex flex-col justify-between rounded-xl border-2 bg-[#FFFDF9] p-3 transition-all cursor-pointer ${
                        isPawnHere
                          ? 'border-[#C59B27] shadow-lg ring-2 ring-[#C59B27]/35 scale-[1.01]'
                          : isCompleted
                          ? 'border-[#2E6F40]/50 bg-[#F7FBF8]'
                          : 'border-[#E6DCCB] hover:border-[#C59B27]/70'
                      }`}
                    >
                      {/* Top Color Property Header (Monopoly-style strip) */}
                      <div>
                        <div
                          className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-white"
                          style={{ backgroundColor: sp.accent }}
                        >
                          <span className="text-[10px] font-bold uppercase tracking-wider">
                            #{sp.index + 1} • {sp.code}
                          </span>
                          <span className="text-xs">{sp.icon}</span>
                        </div>

                        {/* Pawn Badge if landed here */}
                        {isPawnHere && (
                          <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#C59B27] px-2.5 py-0.5 text-[11px] font-bold text-[#2A211C] shadow-sm">
                            <span>{ledger.romanceopoly.pawnEmoji}</span>
                            <span>You Are Here</span>
                          </div>
                        )}

                        <div className="mt-2 font-display text-xs font-bold text-[#1E3A2F]">
                          {sp.landmark}
                        </div>

                        {/* Editable Prompt Text */}
                        {editingSpaceIdx === sp.index ? (
                          <div
                            className="mt-1.5 space-y-1.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <textarea
                              rows={3}
                              value={editingSpaceDraft}
                              onChange={(e) => setEditingSpaceDraft(e.target.value)}
                              className="w-full rounded-lg border border-[#C59B27] bg-[#FAF6F0] p-1.5 text-xs text-[#2A211C] focus:outline-none"
                            />
                            <div className="flex justify-end gap-1">
                              <button
                                onClick={() => setEditingSpaceIdx(null)}
                                className="rounded px-2 py-0.5 text-[11px] text-[#6B5B50]"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => {
                                  setLedger((prev) => ({
                                    ...prev,
                                    romanceopoly: {
                                      ...prev.romanceopoly,
                                      spaceData: {
                                        ...prev.romanceopoly.spaceData,
                                        [sp.index]: {
                                          ...(prev.romanceopoly.spaceData[sp.index] || {}),
                                          customPrompt: editingSpaceDraft.trim() || sp.defaultPrompt
                                        }
                                      }
                                    }
                                  }));
                                  setEditingSpaceIdx(null);
                                  showToast('Updated 2027 board prompt!', 'emerald');
                                }}
                                className="rounded bg-[#1E3A2F] px-2 py-0.5 text-[11px] font-semibold text-white"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-1 flex items-start justify-between gap-1">
                            <p className="text-xs leading-snug text-[#4A3E36]">{sp.prompt}</p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingSpaceIdx(sp.index);
                                setEditingSpaceDraft(sp.prompt);
                              }}
                              title="Edit Prompt Text"
                              className="opacity-0 group-hover:opacity-100 rounded p-1 text-[#6B5B50] hover:bg-[#FAF6F0] hover:text-[#1E3A2F] transition"
                            >
                              <Edit3 className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Assigned Book Footer */}
                      <div className="mt-3 pt-2 border-t border-[#E6DCCB]/80" onClick={(e) => e.stopPropagation()}>
                        {assignedBook ? (
                          <div className="flex items-center justify-between gap-1.5 rounded-lg bg-[#FAF6F0] px-2 py-1.5 border border-[#E6DCCB]">
                            <button
                              onClick={() => toggleBookStatus(assignedBook.id)}
                              className="flex items-center gap-1.5 text-left text-xs font-semibold text-[#1E3A2F] truncate"
                              title="Click to toggle status"
                            >
                              {assignedBook.status === 'completed' ? (
                                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#2E6F40]" />
                              ) : (
                                <Clock className="h-3.5 w-3.5 shrink-0 text-[#C59B27]" />
                              )}
                              <span className="truncate">{assignedBook.title}</span>
                            </button>
                            <button
                              onClick={() => {
                                setLedger((prev) => ({
                                  ...prev,
                                  romanceopoly: {
                                    ...prev.romanceopoly,
                                    spaceData: {
                                      ...prev.romanceopoly.spaceData,
                                      [sp.index]: {
                                        ...(prev.romanceopoly.spaceData[sp.index] || {}),
                                        bookId: null
                                      }
                                    }
                                  }
                                }));
                              }}
                              className="text-[#6B5B50] hover:text-[#8B3A4A]"
                              title="Remove from space"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              setSlotModal({
                                open: true,
                                mode: 'assign-rom',
                                source: {
                                  type: 'board',
                                  spaceIndex: sp.index,
                                  prompt: `${sp.landmark} (${sp.code}): ${sp.prompt}`
                                }
                              })
                            }
                            className="flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-[#C59B27]/70 py-1.5 text-[11px] font-semibold text-[#1E3A2F] hover:bg-[#FAF6F0]"
                          >
                            <Plus className="h-3 w-3" />
                            <span>Assign Book</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ) : (
            /* SYLLABUS CHECKLIST VIEW */
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {['Core Curriculum', 'Major Classes', 'Minor Classes', 'Electives'].map((cat) => {
                const catSpaces = romanceopolySpaces.filter((s) => s.category === cat);
                return (
                  <div key={cat} className="storybook-card rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between border-b border-[#E6DCCB] pb-2.5">
                      <h3 className="font-display text-base font-bold text-[#1E3A2F]">{cat}</h3>
                      <span className="rounded-full bg-[#FAF6F0] px-2.5 py-0.5 text-xs font-semibold text-[#8B3A4A]">
                        {
                          catSpaces.filter(
                            (s) => s.bookId && ledger.books[s.bookId]?.status === 'completed'
                          ).length
                        }{' '}
                        / {catSpaces.length}
                      </span>
                    </div>
                    <div className="space-y-2.5">
                      {catSpaces.map((sp) => {
                        const assignedBook = sp.bookId ? ledger.books[sp.bookId] : null;
                        return (
                          <div
                            key={sp.id}
                            className="flex flex-col gap-2 rounded-xl border border-[#E6DCCB] bg-[#FAF6F0]/60 p-3 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className="rounded px-1.5 py-0.5 text-[10px] font-bold text-white"
                                  style={{ backgroundColor: sp.accent }}
                                >
                                  {sp.code}
                                </span>
                                <span className="font-display text-xs font-bold text-[#1E3A2F]">
                                  {sp.landmark}
                                </span>
                              </div>
                              <p className="text-xs text-[#4A3E36]">{sp.prompt}</p>
                            </div>
                            <div className="shrink-0">
                              {assignedBook ? (
                                <div className="flex items-center gap-1.5 rounded-lg border border-[#E6DCCB] bg-[#FFFDF9] px-2.5 py-1.5">
                                  <button
                                    onClick={() => toggleBookStatus(assignedBook.id)}
                                    className="flex items-center gap-1.5 text-xs font-semibold text-[#1E3A2F]"
                                  >
                                    {assignedBook.status === 'completed' ? (
                                      <CheckCircle2 className="h-3.5 w-3.5 text-[#2E6F40]" />
                                    ) : (
                                      <Clock className="h-3.5 w-3.5 text-[#C59B27]" />
                                    )}
                                    <span className="max-w-[140px] truncate">{assignedBook.title}</span>
                                  </button>
                                  <button
                                    onClick={() =>
                                      setLedger((prev) => ({
                                        ...prev,
                                        romanceopoly: {
                                          ...prev.romanceopoly,
                                          spaceData: {
                                            ...prev.romanceopoly.spaceData,
                                            [sp.index]: {
                                              ...(prev.romanceopoly.spaceData[sp.index] || {}),
                                              bookId: null
                                            }
                                          }
                                        }
                                      }))
                                    }
                                    className="text-[#6B5B50] hover:text-[#8B3A4A]"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() =>
                                    setSlotModal({
                                      open: true,
                                      mode: 'assign-rom',
                                      source: {
                                        type: 'board',
                                        spaceIndex: sp.index,
                                        prompt: `${sp.landmark}: ${sp.prompt}`
                                      }
                                    })
                                  }
                                  className="inline-flex items-center gap-1 rounded-lg border border-dashed border-[#C59B27] bg-[#FFFDF9] px-2.5 py-1.5 text-xs font-semibold text-[#1E3A2F] hover:bg-[#FAF6F0]"
                                >
                                  <Plus className="h-3 w-3" />
                                  <span>Assign Book</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </section>
          )}

          {/* LIVE ACHIEVEMENT & WAX SEAL SHELF */}
          <section className="storybook-card rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-[#C59B27]" />
                <h3 className="font-display text-lg font-bold text-[#1E3A2F]">
                  Honors, Degrees &amp; Campus Seals
                </h3>
              </div>
              <span className="text-xs font-semibold text-[#8B3A4A]">
                {romanceopolyStats.achievements.filter((a) => a.unlocked).length} /{' '}
                {romanceopolyStats.achievements.length} Unlocked
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {romanceopolyStats.achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`flex items-start gap-3 rounded-xl border p-3.5 transition-all ${
                    ach.unlocked
                      ? 'border-[#C59B27] bg-gradient-to-br from-[#FFFDF9] to-[#FAF1D6] shadow-sm'
                      : 'border-[#E6DCCB] bg-[#FAF6F0]/60 opacity-75'
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg shadow-inner ${
                      ach.unlocked
                        ? 'bg-[#1E3A2F] text-[#E6B84C] ring-2 ring-[#C59B27]'
                        : 'bg-[#E6DCCB] text-[#6B5B50] grayscale'
                    }`}
                  >
                    {ach.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-display text-xs font-bold text-[#1E3A2F] truncate">
                        {ach.title}
                      </h4>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          ach.unlocked
                            ? 'bg-[#2E6F40] text-white'
                            : 'bg-[#E6DCCB] text-[#5C4D43]'
                        }`}
                      >
                        {ach.unlocked ? 'Unlocked!' : ach.progress}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] leading-snug text-[#5C4D43]">{ach.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* OVERACHIEVER ADD-ONS: CLUBS, SEASONAL EVENTS & MONTHLY STUDY */}
          <section className="storybook-card rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#E6DCCB] pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-[#1E3A2F]">
                  Overachiever Extracurriculars
                </h3>
                <p className="text-xs text-[#6B5B50]">
                  Join Campus Clubs, compete in Seasonal Sports Leagues, and log Monthly Study Sessions.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'clubs', label: '🏛️ Campus Clubs (4)' },
                  { id: 'events', label: '🏅 Seasonal Events (4)' },
                  { id: 'monthly', label: '📅 Monthly Study (Jan–Dec 2027)' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setRomAddonTab(t.id)}
                    className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                      romAddonTab === t.id
                        ? 'bg-[#8B3A4A] text-[#FFFDF9]'
                        : 'bg-[#FAF6F0] border border-[#E6DCCB] text-[#5C4D43] hover:border-[#8B3A4A]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {romAddonTab === 'clubs' && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {ledger.romanceopoly.clubs.map((club) => {
                  const doneCount = club.prompts.filter(
                    (p) => p.bookId && ledger.books[p.bookId]?.status === 'completed'
                  ).length;
                  return (
                    <div
                      key={club.id}
                      className="rounded-xl border border-[#E6DCCB] bg-[#FAF6F0]/70 p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{club.icon}</span>
                          <div>
                            <h4 className="font-display text-sm font-bold text-[#1E3A2F]">
                              {club.name}
                            </h4>
                            <p className="text-[11px] text-[#6B5B50]">{club.description}</p>
                          </div>
                        </div>
                        <span className="rounded-full bg-[#FFFDF9] border border-[#E6DCCB] px-2.5 py-0.5 text-xs font-bold text-[#8B3A4A]">
                          {doneCount}/4
                        </span>
                      </div>
                      <div className="space-y-2">
                        {club.prompts.map((p) => {
                          const assigned = p.bookId ? ledger.books[p.bookId] : null;
                          return (
                            <div
                              key={p.id}
                              className="flex items-center justify-between gap-2 rounded-lg border border-[#E6DCCB] bg-[#FFFDF9] px-3 py-2 text-xs"
                            >
                              <span className="text-[#2A211C]">{p.text}</span>
                              {assigned ? (
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    onClick={() => toggleBookStatus(assigned.id)}
                                    className="flex items-center gap-1 font-semibold text-[#1E3A2F]"
                                  >
                                    {assigned.status === 'completed' ? (
                                      <CheckCircle2 className="h-3.5 w-3.5 text-[#2E6F40]" />
                                    ) : (
                                      <Clock className="h-3.5 w-3.5 text-[#C59B27]" />
                                    )}
                                    <span className="max-w-[110px] truncate">{assigned.title}</span>
                                  </button>
                                  <button
                                    onClick={() =>
                                      setLedger((prev) => ({
                                        ...prev,
                                        romanceopoly: {
                                          ...prev.romanceopoly,
                                          clubs: prev.romanceopoly.clubs.map((c) =>
                                            c.id === club.id
                                              ? {
                                                  ...c,
                                                  prompts: c.prompts.map((pr) =>
                                                    pr.id === p.id ? { ...pr, bookId: null } : pr
                                                  )
                                                }
                                              : c
                                          )
                                        }
                                      }))
                                    }
                                    className="text-[#6B5B50] hover:text-[#8B3A4A]"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() =>
                                    setSlotModal({
                                      open: true,
                                      mode: 'assign-rom',
                                      source: {
                                        type: 'club',
                                        groupId: club.id,
                                        promptId: p.id,
                                        prompt: `${club.name}: ${p.text}`
                                      }
                                    })
                                  }
                                  className="shrink-0 rounded-md border border-dashed border-[#C59B27] px-2 py-1 text-[11px] font-semibold text-[#1E3A2F] hover:bg-[#FAF6F0]"
                                >
                                  + Book
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {romAddonTab === 'events' && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {ledger.romanceopoly.events.map((evt) => {
                  const doneCount = evt.prompts.filter(
                    (p) => p.bookId && ledger.books[p.bookId]?.status === 'completed'
                  ).length;
                  return (
                    <div
                      key={evt.id}
                      className="rounded-xl border border-[#E6DCCB] bg-[#FAF6F0]/70 p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{evt.icon}</span>
                          <div>
                            <h4 className="font-display text-sm font-bold text-[#1E3A2F]">
                              {evt.name}
                            </h4>
                            <p className="text-[11px] text-[#6B5B50]">{evt.season}</p>
                          </div>
                        </div>
                        <span className="rounded-full bg-[#FFFDF9] border border-[#E6DCCB] px-2.5 py-0.5 text-xs font-bold text-[#1E3A2F]">
                          {doneCount}/4
                        </span>
                      </div>
                      <div className="space-y-2">
                        {evt.prompts.map((p) => {
                          const assigned = p.bookId ? ledger.books[p.bookId] : null;
                          return (
                            <div
                              key={p.id}
                              className="flex items-center justify-between gap-2 rounded-lg border border-[#E6DCCB] bg-[#FFFDF9] px-3 py-2 text-xs"
                            >
                              <span className="text-[#2A211C]">{p.text}</span>
                              {assigned ? (
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    onClick={() => toggleBookStatus(assigned.id)}
                                    className="flex items-center gap-1 font-semibold text-[#1E3A2F]"
                                  >
                                    {assigned.status === 'completed' ? (
                                      <CheckCircle2 className="h-3.5 w-3.5 text-[#2E6F40]" />
                                    ) : (
                                      <Clock className="h-3.5 w-3.5 text-[#C59B27]" />
                                    )}
                                    <span className="max-w-[110px] truncate">{assigned.title}</span>
                                  </button>
                                  <button
                                    onClick={() =>
                                      setLedger((prev) => ({
                                        ...prev,
                                        romanceopoly: {
                                          ...prev.romanceopoly,
                                          events: prev.romanceopoly.events.map((e) =>
                                            e.id === evt.id
                                              ? {
                                                  ...e,
                                                  prompts: e.prompts.map((pr) =>
                                                    pr.id === p.id ? { ...pr, bookId: null } : pr
                                                  )
                                                }
                                              : e
                                          )
                                        }
                                      }))
                                    }
                                    className="text-[#6B5B50] hover:text-[#8B3A4A]"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() =>
                                    setSlotModal({
                                      open: true,
                                      mode: 'assign-rom',
                                      source: {
                                        type: 'event',
                                        groupId: evt.id,
                                        promptId: p.id,
                                        prompt: `${evt.name}: ${p.text}`
                                      }
                                    })
                                  }
                                  className="shrink-0 rounded-md border border-dashed border-[#C59B27] px-2 py-1 text-[11px] font-semibold text-[#1E3A2F] hover:bg-[#FAF6F0]"
                                >
                                  + Book
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {romAddonTab === 'monthly' && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {ledger.romanceopoly.monthlyStudy.map((m) => {
                  const assigned = m.bookId ? ledger.books[m.bookId] : null;
                  return (
                    <div
                      key={m.id}
                      className="rounded-xl border border-[#E6DCCB] bg-[#FAF6F0]/70 p-3 flex flex-col justify-between space-y-2"
                    >
                      <div className="font-display text-xs font-bold text-[#1E3A2F]">{m.month}</div>
                      {assigned ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs font-semibold text-[#2E6F40]">
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{assigned.title}</span>
                          </div>
                          <button
                            onClick={() =>
                              setLedger((prev) => ({
                                ...prev,
                                romanceopoly: {
                                  ...prev.romanceopoly,
                                  monthlyStudy: prev.romanceopoly.monthlyStudy.map((item) =>
                                    item.id === m.id ? { ...item, bookId: null } : item
                                  )
                                }
                              }))
                            }
                            className="text-[10px] text-[#8B3A4A] hover:underline"
                          >
                            Clear
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            setSlotModal({
                              open: true,
                              mode: 'assign-rom',
                              source: {
                                type: 'monthly',
                                promptId: m.id,
                                prompt: `${m.month} 2027 Study Session`
                              }
                            })
                          }
                          className="rounded-lg border border-dashed border-[#C59B27] bg-[#FFFDF9] py-1.5 text-[11px] font-semibold text-[#1E3A2F] hover:bg-[#FAF6F0]"
                        >
                          + Log Read
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </main>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: MASTER BOOKSHELF & DOUBLE-DIPS                                */}
      {/* ==================================================================== */}
      {activeTab === 'bookshelf' && (
        <main className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 space-y-6">
          {/* Bookshelf Overview Banner */}
          <section className="storybook-card rounded-2xl p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#1E3A2F]">
                  Master Bookshelf &amp; Double-Dip Registry
                </h2>
                <p className="font-editorial italic text-xs sm:text-sm text-[#6B5B50]">
                  Every book across Once Upon A Year, Romanceopoly 2027, and your Unassigned TBR Pool. One book can fulfill prompts in both realms!
                </p>
              </div>
              <button
                onClick={() => setBookModal({ open: true, book: null, presetTarget: null })}
                className="inline-flex items-center gap-2 self-start rounded-xl bg-[#1E3A2F] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#FFFDF9] shadow-sm hover:bg-[#274B3D]"
              >
                <Plus className="h-4 w-4 text-[#E6B84C]" />
                <span>Add Book to Shelf / TBR Pool</span>
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: 'All Books' },
                  { id: 'oyay', label: '🏰 Once Upon A Year' },
                  { id: 'romanceopoly', label: '🎓 Romanceopoly 2027' },
                  { id: 'doubledip', label: '✨ Double-Dips (2+ Quests)' },
                  { id: 'unassigned', label: '🧺 Unassigned / TBR Pool' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setShelfFilter(f.id)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                      shelfFilter === f.id
                        ? 'bg-[#1E3A2F] text-[#FFFDF9]'
                        : 'bg-[#FAF6F0] border border-[#E6DCCB] text-[#5C4D43] hover:border-[#C59B27]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-[#E6DCCB] bg-[#FAF6F0] px-3 py-1.5 text-xs font-semibold text-[#2A211C]"
                >
                  <option value="all">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="reading">Currently Reading</option>
                  <option value="planned">Planned TBR</option>
                </select>

                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#6B5B50]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search title, author, tag..."
                    className="rounded-xl border border-[#E6DCCB] bg-[#FAF6F0] pl-8 pr-3 py-1.5 text-xs text-[#2A211C] focus:border-[#C59B27] focus:bg-[#FFFDF9] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Books Grid */}
          {(() => {
            const allBooks = Object.values(ledger.books);
            const filtered = allBooks.filter((bk) => {
              const assignments = bookAssignmentsMap[bk.id] || [];
              const hasOyay = assignments.some((a) => a.realm === 'oyay');
              const hasRom = assignments.some((a) => a.realm === 'romanceopoly');

              if (shelfFilter === 'oyay' && !hasOyay) return false;
              if (shelfFilter === 'romanceopoly' && !hasRom) return false;
              if (shelfFilter === 'doubledip' && assignments.length < 2) return false;
              if (shelfFilter === 'unassigned' && assignments.length > 0) return false;

              if (statusFilter !== 'all' && bk.status !== statusFilter) return false;

              if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const match =
                  bk.title.toLowerCase().includes(q) ||
                  (bk.author || '').toLowerCase().includes(q) ||
                  (bk.tag || '').toLowerCase().includes(q) ||
                  (bk.notes || '').toLowerCase().includes(q);
                if (!match) return false;
              }
              return true;
            });

            if (filtered.length === 0) {
              return (
                <div className="storybook-card rounded-2xl p-10 text-center space-y-2">
                  <BookOpen className="mx-auto h-8 w-8 text-[#C59B27]" />
                  <h3 className="font-display text-base font-bold text-[#1E3A2F]">
                    No books match this filter yet
                  </h3>
                  <p className="text-xs text-[#6B5B50]">
                    Try clearing your search filter or add a new book to your Unassigned TBR Pool!
                  </p>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map((bk) => {
                  const assignments = bookAssignmentsMap[bk.id] || [];
                  const isDoubleDip = assignments.length >= 2;
                  return (
                    <div
                      key={bk.id}
                      className="storybook-card storybook-card-hover relative flex overflow-hidden rounded-2xl"
                    >
                      {/* Tactile Book Spine Strip */}
                      <div
                        className="w-3 shrink-0"
                        style={{ backgroundColor: bk.color || '#1E3A2F' }}
                      />
                      <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-editorial text-base font-bold text-[#2A211C] leading-snug">
                                {bk.title}
                              </h3>
                              {bk.author && (
                                <p className="text-xs text-[#6B5B50]">by {bk.author}</p>
                              )}
                            </div>

                            {isDoubleDip && (
                              <span className="shrink-0 rounded-full border border-[#C59B27] bg-[#FAF4E4] px-2.5 py-0.5 text-[10px] font-bold text-[#7C5229]">
                                ✨ Double-Dip ({assignments.length}×)
                              </span>
                            )}
                          </div>

                          {/* Status, Pages, Tag, Rating */}
                          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                            <button
                              onClick={() => toggleBookStatus(bk.id)}
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                                bk.status === 'completed'
                                  ? 'bg-[#EDF3F0] text-[#1E3A2F]'
                                  : bk.status === 'reading'
                                  ? 'bg-[#FAF4E4] text-[#7C5229]'
                                  : 'bg-[#F9EFF1] text-[#8B3A4A]'
                              }`}
                            >
                              {bk.status === 'completed' ? (
                                <CheckCircle2 className="h-3 w-3 text-[#2E6F40]" />
                              ) : bk.status === 'reading' ? (
                                <Clock className="h-3 w-3 text-[#C59B27]" />
                              ) : (
                                <Circle className="h-3 w-3" />
                              )}
                              <span>
                                {bk.status === 'completed'
                                  ? 'Completed'
                                  : bk.status === 'reading'
                                  ? 'Reading'
                                  : 'Planned TBR'}
                              </span>
                            </button>

                            {bk.pages > 0 && (
                              <span className="rounded-full bg-[#FAF6F0] border border-[#E6DCCB] px-2 py-0.5 text-[11px] text-[#5C4D43]">
                                {bk.pages} pgs
                              </span>
                            )}

                            {bk.tag && (
                              <span className="rounded-full bg-[#FAF6F0] border border-[#E6DCCB] px-2 py-0.5 text-[11px] font-medium text-[#5C4D43]">
                                {bk.tag}
                              </span>
                            )}
                          </div>

                          {/* Star Rating */}
                          <div className="mt-2 flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() =>
                                  setLedger((prev) => ({
                                    ...prev,
                                    books: {
                                      ...prev.books,
                                      [bk.id]: { ...bk, rating: star }
                                    }
                                  }))
                                }
                                className="p-0.5"
                              >
                                <Star
                                  className={`h-3.5 w-3.5 ${
                                    star <= (bk.rating || 0)
                                      ? 'fill-[#C59B27] text-[#C59B27]'
                                      : 'text-[#D6CBB8]'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>

                          {/* Assigned Quests List */}
                          <div className="mt-3 space-y-1">
                            {assignments.length > 0 ? (
                              assignments.map((a, idx) => (
                                <div
                                  key={idx}
                                  className="rounded-lg bg-[#FAF6F0] border border-[#E6DCCB] px-2.5 py-1 text-[11px] text-[#2A211C] truncate"
                                  title={a.label}
                                >
                                  {a.badge}
                                </div>
                              ))
                            ) : (
                              <div className="rounded-lg border border-dashed border-[#E6DCCB] px-2.5 py-1 text-[11px] italic text-[#7A6A5E]">
                                Unassigned — Ready in TBR / Shelf Pool
                              </div>
                            )}
                          </div>

                          {bk.notes && (
                            <p className="mt-2 text-[11px] italic text-[#6B5B50] line-clamp-2">
                              &ldquo;{bk.notes}&rdquo;
                            </p>
                          )}
                        </div>

                        {/* Card Actions */}
                        <div className="flex items-center justify-between border-t border-[#E6DCCB] pt-2.5">
                          <button
                            onClick={() =>
                              setBookModal({ open: true, book: bk, presetTarget: null })
                            }
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E3A2F] hover:underline"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                            <span>Edit / Double-Dip</span>
                          </button>
                          <button
                            onClick={() => handleDeleteBook(bk.id)}
                            className="inline-flex items-center gap-1 text-xs text-[#8B3A4A] hover:underline"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </main>
      )}

      {/* ==================================================================== */}
      {/* MODALS: FATE DICE, BOOK EDITOR, QUEST ASSIGN/SWAP, CUSTOM QUEST      */}
      {/* ==================================================================== */}

      {diceModal.open && (
        <FateDiceModal
          initialSides={diceModal.sides}
          context={diceModal.context}
          targetQuest={diceModal.targetQuest}
          oyayVolumes={ledger.oyay.volumes}
          romanceopolySpaces={romanceopolySpaces}
          books={ledger.books}
          onClose={() => setDiceModal({ open: false, sides: 6, context: 'general', targetQuest: null })}
          onApplyOyayRoll={(rollVal) => {
            if (diceModal.targetQuest) {
              const { volumeId, chapterId, section, questId } = diceModal.targetQuest;
              updateOyayQuestMeta(volumeId, chapterId, section, questId, { diceRoll: rollVal });
              showToast(`Rolled ${rollVal}! Updated quest requirement to ${rollVal * 100}+ pages.`, 'emerald');
              triggerCelebration();
            }
          }}
          onJumpToAssign={(target) => {
            setDiceModal({ open: false, sides: 6, context: 'general', targetQuest: null });
            if (target.realm === 'oyay') {
              setActiveTab('oyay');
              setSlotModal({ open: true, mode: 'assign', source: target.source });
            } else {
              setActiveTab('romanceopoly');
              setSlotModal({ open: true, mode: 'assign-rom', source: target.source });
            }
          }}
        />
      )}

      {bookModal.open && (
        <BookEditorModal
          book={bookModal.book}
          presetTarget={bookModal.presetTarget}
          oyayVolumes={ledger.oyay.volumes}
          romanceopolySpaces={romanceopolySpaces}
          onClose={() => setBookModal({ open: false, book: null, presetTarget: null })}
          onSave={handleSaveBook}
        />
      )}

      {slotModal.open && (
        <QuestSlotModal
          mode={slotModal.mode}
          source={slotModal.source}
          books={ledger.books}
          oyayVolumes={ledger.oyay.volumes}
          onClose={() => setSlotModal({ open: false, mode: 'assign', source: null })}
          onSelectExistingBook={(bookId) => {
            if (slotModal.mode === 'assign') {
              const { volumeId, chapterId, section, questId } = slotModal.source;
              setOyayQuestBook(volumeId, chapterId, section, questId, bookId);
              showToast(`Assigned "${ledger.books[bookId]?.title}" to quest!`, 'emerald');
            } else if (slotModal.mode === 'assign-rom') {
              const src = slotModal.source;
              if (src.type === 'board') {
                setLedger((prev) => ({
                  ...prev,
                  romanceopoly: {
                    ...prev.romanceopoly,
                    spaceData: {
                      ...prev.romanceopoly.spaceData,
                      [src.spaceIndex]: {
                        ...(prev.romanceopoly.spaceData[src.spaceIndex] || {}),
                        bookId
                      }
                    }
                  }
                }));
              } else if (src.type === 'club') {
                setLedger((prev) => ({
                  ...prev,
                  romanceopoly: {
                    ...prev.romanceopoly,
                    clubs: prev.romanceopoly.clubs.map((c) =>
                      c.id === src.groupId
                        ? {
                            ...c,
                            prompts: c.prompts.map((p) =>
                              p.id === src.promptId ? { ...p, bookId } : p
                            )
                          }
                        : c
                    )
                  }
                }));
              } else if (src.type === 'event') {
                setLedger((prev) => ({
                  ...prev,
                  romanceopoly: {
                    ...prev.romanceopoly,
                    events: prev.romanceopoly.events.map((e) =>
                      e.id === src.groupId
                        ? {
                            ...e,
                            prompts: e.prompts.map((p) =>
                              p.id === src.promptId ? { ...p, bookId } : p
                            )
                          }
                        : e
                    )
                  }
                }));
              } else if (src.type === 'monthly') {
                setLedger((prev) => ({
                  ...prev,
                  romanceopoly: {
                    ...prev.romanceopoly,
                    monthlyStudy: prev.romanceopoly.monthlyStudy.map((m) =>
                      m.id === src.promptId ? { ...m, bookId } : m
                    )
                  }
                }));
              }
              if (ledger.books[bookId]?.status === 'completed') triggerCelebration();
              showToast(`Assigned "${ledger.books[bookId]?.title}" to Romanceopoly 2027!`, 'emerald');
            }
            setSlotModal({ open: false, mode: 'assign', source: null });
          }}
          onCreateNewBookForSlot={() => {
            const preset =
              slotModal.mode === 'assign'
                ? { oyay: slotModal.source }
                : { romanceopoly: slotModal.source };
            setSlotModal({ open: false, mode: 'assign', source: null });
            setBookModal({ open: true, book: null, presetTarget: preset });
          }}
          onMoveSwapTarget={(target) => {
            moveOrSwapOyayBooks(slotModal.source, target);
            setSlotModal({ open: false, mode: 'assign', source: null });
          }}
        />
      )}

      {customQuestModal.open && (
        <CustomQuestModal
          onClose={() => setCustomQuestModal({ open: false, volumeId: 'vol-1', chapterId: 'vol1-ch1' })}
          onCreate={({ prompt, rewardType, rewardAmount }) => {
            const { volumeId, chapterId } = customQuestModal;
            const newQuest = {
              id: `custom-${Date.now()}`,
              prompt,
              ...(rewardType === 'points'
                ? { points: Number(rewardAmount) || 5 }
                : { tokens: Number(rewardAmount) || 3 }),
              bookId: null
            };
            setLedger((prev) => ({
              ...prev,
              oyay: {
                ...prev.oyay,
                volumes: prev.oyay.volumes.map((v) =>
                  v.id === volumeId
                    ? {
                        ...v,
                        chapters: v.chapters.map((c) =>
                          c.id === chapterId
                            ? {
                                ...c,
                                [rewardType === 'points' ? 'coreQuests' : 'companionQuests']: [
                                  ...(rewardType === 'points' ? c.coreQuests : c.companionQuests),
                                  newQuest
                                ]
                              }
                            : c
                        )
                      }
                    : v
                )
              }
            }));
            setCustomQuestModal({ open: false, volumeId: 'vol-1', chapterId: 'vol1-ch1' });
            showToast('Added custom quest to chapter!', 'emerald');
          }}
        />
      )}

      {newChapterModal && (
        <NewChapterModal
          onClose={() => setNewChapterModal(false)}
          onCreate={({ title, season, icon }) => {
            setLedger((prev) => ({
              ...prev,
              oyay: {
                ...prev.oyay,
                volumes: prev.oyay.volumes.map((v) => {
                  if (v.id !== 'vol-2') return v;
                  const nextNum = v.chapters.length + 1;
                  return {
                    ...v,
                    chapters: [
                      ...v.chapters,
                      {
                        id: `vol2-ch${nextNum}-${Date.now()}`,
                        number: nextNum,
                        title: title || `Chapter ${nextNum}: Uncharted Realm`,
                        season: season || 'Volume 2',
                        icon: icon || '✨',
                        accent: '#1E3A2F',
                        coreQuests: [
                          {
                            id: `v2-c${nextNum}-q1-${Date.now()}`,
                            prompt: 'A book that sweeps you into a new adventure.',
                            points: 5,
                            bookId: null
                          }
                        ],
                        companionQuests: [
                          {
                            id: `v2-c${nextNum}-comp1-${Date.now()}`,
                            prompt: 'A companion read shared with the guild.',
                            tokens: 3,
                            bookId: null
                          }
                        ],
                        bonusTitle: 'Side Chronicles',
                        bonusQuests: []
                      }
                    ]
                  };
                })
              }
            }));
            setNewChapterModal(false);
            showToast('Created new Chapter in Volume 2!', 'emerald');
          }}
        />
      )}

      {resetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2A211C]/60 p-4 backdrop-blur-xs">
          <div className="storybook-card w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="font-display text-lg font-bold text-[#8B3A4A]">
              Reset Reading Ledger to Default?
            </h3>
            <p className="text-xs sm:text-sm text-[#4A3E36] leading-relaxed">
              This will restore your original pre-populated Once Upon A Year Volume 1 progress (80 points, 18 tokens, 26 books) and clear any unsaved Romanceopoly or custom edits.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setResetModalOpen(false)}
                className="rounded-xl border border-[#E6DCCB] px-4 py-2 text-xs font-semibold text-[#5C4D43] hover:bg-[#FAF6F0]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="rounded-xl bg-[#8B3A4A] px-4 py-2 text-xs font-semibold text-[#FFFDF9] hover:bg-[#6B2D3E]"
              >
                Yes, Restore Default
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * ============================================================================
 * SUB-COMPONENT: OYAY QUEST CARD (Supports Drag/Drop, Swap, D6 Inline, Reward Edit)
 * ============================================================================
 */
function OyayQuestCard({
  quest,
  section,
  book,
  isDragOver,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onToggleStatus,
  onAssignClick,
  onMoveSwapClick,
  onUnassignClick,
  onRollD6Inline,
  onUpdateReward
}) {
  const [editingReward, setEditingReward] = useState(false);
  const [rewardDraft, setRewardDraft] = useState(
    section === 'core' ? quest.points : quest.tokens
  );

  const isCompleted = book?.status === 'completed';
  const hasD6Roll = typeof quest.diceRoll === 'number';

  return (
    <div
      draggable={!!book}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`group relative flex flex-col justify-between rounded-xl border p-3.5 transition-all ${
        isDragOver
          ? 'border-[#C59B27] bg-[#FFF9EB] ring-2 ring-[#C59B27]/40 scale-[1.01]'
          : isCompleted
          ? 'border-[#2E6F40]/40 bg-gradient-to-b from-[#FFFDF9] to-[#F3F8F5]'
          : 'border-[#E6DCCB] bg-[#FFFDF9] hover:border-[#C59B27]/70'
      }`}
    >
      <div>
        {/* Top Row: Reward Badge & D6 Mini Roll if applicable */}
        <div className="flex items-center justify-between gap-2">
          {editingReward ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onUpdateReward(rewardDraft);
                setEditingReward(false);
              }}
              className="flex items-center gap-1"
            >
              <input
                type="number"
                min={0}
                max={100}
                autoFocus
                value={rewardDraft}
                onChange={(e) => setRewardDraft(e.target.value)}
                className="w-14 rounded border border-[#C59B27] bg-[#FAF6F0] px-1.5 py-0.5 text-xs font-bold text-[#1E3A2F]"
              />
              <button
                type="submit"
                className="rounded bg-[#1E3A2F] px-1.5 py-0.5 text-[10px] font-bold text-white"
              >
                OK
              </button>
            </form>
          ) : (
            <button
              onClick={() => {
                setRewardDraft(section === 'core' ? quest.points : quest.tokens);
                setEditingReward(true);
              }}
              title="Click to customize point/token value"
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold transition ${
                section === 'core'
                  ? 'bg-[#FAF4E4] text-[#7C5229] border border-[#C59B27]/40 hover:border-[#C59B27]'
                  : 'bg-[#F9EFF1] text-[#8B3A4A] border border-[#8B3A4A]/30 hover:border-[#8B3A4A]'
              }`}
            >
              <span>
                {section === 'core' ? `✦ ${quest.points} pts` : `◈ ${quest.tokens} tokens`}
              </span>
              <Edit3 className="h-2.5 w-2.5 opacity-60" />
            </button>
          )}

          {hasD6Roll && (
            <button
              onClick={onRollD6Inline}
              title="Roll D6 for page requirement"
              className="inline-flex items-center gap-1 rounded-lg border border-[#C59B27]/50 bg-[#FAF6F0] px-2 py-0.5 text-[11px] font-semibold text-[#1E3A2F] hover:bg-[#FFF9EB]"
            >
              <Dices className="h-3 w-3 text-[#8B3A4A]" />
              <span>
                Rolled {quest.diceRoll} ({quest.diceRoll * 100}+ pgs)
              </span>
            </button>
          )}
        </div>

        {/* Quest Prompt Description */}
        <p className="mt-2 text-xs sm:text-[13px] font-medium leading-snug text-[#2A211C]">
          {quest.prompt}
        </p>
      </div>

      {/* Bottom Assigned Book Slot or Empty Slot CTA */}
      <div className="mt-3.5 pt-2.5 border-t border-[#E6DCCB]/70">
        {book ? (
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2 rounded-lg border border-[#E6DCCB] bg-[#FAF6F0] p-2">
              <div className="flex items-start gap-2 min-w-0">
                <button
                  onClick={onToggleStatus}
                  title="Click to cycle status: Completed / Reading / Planned"
                  className="mt-0.5 shrink-0"
                >
                  {book.status === 'completed' ? (
                    <CheckCircle2 className="h-4 w-4 text-[#2E6F40]" />
                  ) : book.status === 'reading' ? (
                    <Clock className="h-4 w-4 text-[#C59B27]" />
                  ) : (
                    <Circle className="h-4 w-4 text-[#8B3A4A]" />
                  )}
                </button>
                <div className="min-w-0">
                  <div className="font-editorial text-xs font-bold text-[#1E3A2F] leading-tight truncate">
                    {book.title}
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-[#6B5B50]">
                    <span>
                      {book.status === 'completed'
                        ? 'Completed'
                        : book.status === 'reading'
                        ? 'Reading'
                        : 'Planned'}
                    </span>
                    {book.tag && <span>• {book.tag}</span>}
                  </div>
                </div>
              </div>
              <GripVertical
                className="h-4 w-4 shrink-0 cursor-grab text-[#9A8B7E]"
                title="Drag to move or swap"
              />
            </div>

            {/* Move/Swap & Unassign mini actions */}
            <div className="flex items-center justify-between text-[11px]">
              <button
                onClick={onMoveSwapClick}
                className="inline-flex items-center gap-1 font-semibold text-[#1E3A2F] hover:text-[#8B3A4A]"
              >
                <ArrowLeftRight className="h-3 w-3" />
                <span>Move / Swap</span>
              </button>
              <button
                onClick={onUnassignClick}
                className="text-[#7A6A5E] hover:text-[#8B3A4A]"
              >
                Unassign
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={onAssignClick}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#C59B27]/80 bg-[#FAF6F0]/60 py-2 text-xs font-semibold text-[#1E3A2F] transition hover:border-[#1E3A2F] hover:bg-[#EDF3F0]"
          >
            <Plus className="h-3.5 w-3.5 text-[#C59B27]" />
            <span>Assign Book</span>
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * MODAL: INTERACTIVE FATE DICE ROLLER (D6 & D20)
 * ============================================================================
 */
function FateDiceModal({
  initialSides,
  context,
  oyayVolumes,
  romanceopolySpaces,
  onClose,
  onApplyOyayRoll,
  onJumpToAssign
}) {
  const [sides, setSides] = useState(initialSides || 6);
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState(null);
  const [pickedPrompt, setPickedPrompt] = useState(null);

  const rollDie = (dieSides = sides) => {
    if (rolling) return;
    setRolling(true);
    setPickedPrompt(null);
    let count = 0;
    const timer = setInterval(() => {
      count += 1;
      setResult(Math.floor(Math.random() * dieSides) + 1);
      if (count >= 9) {
        clearInterval(timer);
        const finalVal = Math.floor(Math.random() * dieSides) + 1;
        setResult(finalVal);
        setRolling(false);

        if (dieSides === 20) {
          // Pick a random open prompt from OYAY or Romanceopoly
          const candidates = [];
          oyayVolumes.forEach((vol) => {
            vol.chapters.forEach((ch) => {
              ch.coreQuests.forEach((q) => {
                if (!q.bookId) {
                  candidates.push({
                    realm: 'oyay',
                    title: `OYAY ${vol.title.split(':')[0]} • Ch.${ch.number}`,
                    prompt: q.prompt,
                    source: {
                      volumeId: vol.id,
                      chapterId: ch.id,
                      section: 'core',
                      questId: q.id,
                      prompt: q.prompt
                    }
                  });
                }
              });
              ch.companionQuests.forEach((q) => {
                if (!q.bookId) {
                  candidates.push({
                    realm: 'oyay',
                    title: `OYAY ${vol.title.split(':')[0]} • Ch.${ch.number} Companion`,
                    prompt: q.prompt,
                    source: {
                      volumeId: vol.id,
                      chapterId: ch.id,
                      section: 'companion',
                      questId: q.id,
                      prompt: q.prompt
                    }
                  });
                }
              });
            });
          });
          romanceopolySpaces.forEach((sp) => {
            if (!sp.bookId) {
              candidates.push({
                realm: 'romanceopoly',
                title: `Romanceopoly 2027 • ${sp.landmark} (${sp.code})`,
                prompt: sp.prompt,
                source: {
                  type: 'board',
                  spaceIndex: sp.index,
                  prompt: `${sp.landmark}: ${sp.prompt}`
                }
              });
            }
          });
          if (candidates.length > 0) {
            const pick = candidates[(finalVal - 1) % candidates.length];
            setPickedPrompt(pick);
          }
        }
      }
    }, 60);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2A211C]/60 p-4 backdrop-blur-xs">
      <div className="storybook-card w-full max-w-md rounded-2xl p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dices className="h-5 w-5 text-[#8B3A4A]" />
            <h3 className="font-display text-lg font-bold text-[#1E3A2F]">
              Oracle &amp; Fate Dice Roller
            </h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-[#6B5B50] hover:bg-[#FAF6F0]">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Die Type Selector */}
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-[#FAF6F0] p-1 border border-[#E6DCCB]">
          <button
            onClick={() => {
              setSides(6);
              setResult(null);
              setPickedPrompt(null);
            }}
            className={`rounded-lg py-2 text-xs font-bold transition ${
              sides === 6 ? 'bg-[#1E3A2F] text-[#FFFDF9]' : 'text-[#5C4D43]'
            }`}
          >
            🎲 D6 (OYAY Pages &amp; Board)
          </button>
          <button
            onClick={() => {
              setSides(20);
              setResult(null);
              setPickedPrompt(null);
            }}
            className={`rounded-lg py-2 text-xs font-bold transition ${
              sides === 20 ? 'bg-[#8B3A4A] text-[#FFFDF9]' : 'text-[#5C4D43]'
            }`}
          >
            ✨ D20 (Random Prompt Oracle)
          </button>
        </div>

        {/* Animated Die Display */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[#C59B27]/40 bg-gradient-to-b from-[#FAF6F0] to-[#F3E9D2] py-8">
          <div
            className={`flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-[#C59B27] bg-[#1E3A2F] font-display text-4xl font-bold text-[#E6B84C] shadow-lg ${
              rolling ? 'animate-dice' : ''
            }`}
          >
            {result ?? `D${sides}`}
          </div>
          <p className="mt-3 text-xs font-medium text-[#5C4D43] text-center px-4">
            {sides === 6
              ? result
                ? `OYAY Page Challenge: Read a book with at least ${result * 100} pages!`
                : 'Roll a D6 × 100 for page prompts or board movement.'
              : result
              ? 'Fate has chosen an open prompt from your realms!'
              : 'Roll a D20 to let fate select your next open readathon prompt.'}
          </p>
        </div>

        {/* D20 Chosen Prompt Card */}
        {pickedPrompt && (
          <div className="rounded-xl border border-[#C59B27] bg-[#FFFDF9] p-3.5 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#8B3A4A]">
              {pickedPrompt.title}
            </div>
            <p className="text-xs font-medium text-[#2A211C]">{pickedPrompt.prompt}</p>
            <button
              onClick={() => onJumpToAssign(pickedPrompt)}
              className="inline-flex items-center gap-1 rounded-lg bg-[#1E3A2F] px-3 py-1.5 text-xs font-semibold text-[#FFFDF9]"
            >
              <Plus className="h-3.5 w-3.5 text-[#E6B84C]" />
              <span>Assign a Book to This Prompt</span>
            </button>
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          {context === 'oyay-pages' && result && !rolling ? (
            <button
              onClick={() => {
                onApplyOyayRoll(result);
                onClose();
              }}
              className="flex-1 rounded-xl bg-[#2E6F40] py-2.5 text-xs font-semibold text-white"
            >
              Apply {result} ({result * 100}+ pgs) to Quest
            </button>
          ) : (
            <button
              onClick={() => rollDie(sides)}
              disabled={rolling}
              className="flex-1 rounded-xl bg-[#1E3A2F] py-2.5 text-xs sm:text-sm font-semibold text-[#FFFDF9] shadow-sm hover:bg-[#274B3D]"
            >
              {rolling ? 'Rolling...' : `Roll D${sides}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * MODAL: ADD OR EDIT BOOK (Supports Direct Assignment & Double-Dipping)
 * ============================================================================
 */
function BookEditorModal({ book, presetTarget, oyayVolumes, romanceopolySpaces, onClose, onSave }) {
  const [title, setTitle] = useState(book?.title || '');
  const [author, setAuthor] = useState(book?.author || '');
  const [status, setStatus] = useState(book?.status || 'completed');
  const [pages, setPages] = useState(book?.pages || '');
  const [rating, setRating] = useState(book?.rating || 0);
  const [tag, setTag] = useState(book?.tag || '');
  const [color, setColor] = useState(book?.color || SPINE_PALETTE[0]);
  const [notes, setNotes] = useState(book?.notes || '');

  // Optional direct slot selectors (allows double-dipping!)
  const [selectedOyayKey, setSelectedOyayKey] = useState(
    presetTarget?.oyay
      ? `${presetTarget.oyay.volumeId}|${presetTarget.oyay.chapterId}|${presetTarget.oyay.section}|${presetTarget.oyay.questId}`
      : ''
  );
  const [selectedRomSpaceIdx, setSelectedRomSpaceIdx] = useState(
    presetTarget?.romanceopoly?.type === 'board'
      ? String(presetTarget.romanceopoly.spaceIndex)
      : ''
  );

  // Flatten OYAY slots for easy dropdown
  const oyaySlotOptions = useMemo(() => {
    const list = [];
    oyayVolumes.forEach((vol) => {
      vol.chapters.forEach((ch) => {
        ch.coreQuests.forEach((q) => {
          list.push({
            key: `${vol.id}|${ch.id}|core|${q.id}`,
            label: `${vol.title.split(':')[0]} • Ch.${ch.number} Core: ${q.prompt}`
          });
        });
        ch.companionQuests.forEach((q) => {
          list.push({
            key: `${vol.id}|${ch.id}|companion|${q.id}`,
            label: `${vol.title.split(':')[0]} • Ch.${ch.number} Companion: ${q.prompt}`
          });
        });
      });
    });
    return list;
  }, [oyayVolumes]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const targetLinks = {};
    if (selectedOyayKey) {
      const [volumeId, chapterId, section, questId] = selectedOyayKey.split('|');
      targetLinks.oyay = { volumeId, chapterId, section, questId };
    }
    if (selectedRomSpaceIdx !== '') {
      targetLinks.romanceopoly = {
        type: 'board',
        spaceIndex: Number(selectedRomSpaceIdx)
      };
    } else if (presetTarget?.romanceopoly && presetTarget.romanceopoly.type !== 'board') {
      targetLinks.romanceopoly = presetTarget.romanceopoly;
    }

    onSave(
      {
        id: book?.id,
        title: title.trim(),
        author: author.trim(),
        status,
        pages: pages ? Number(pages) : 0,
        rating: Number(rating) || 0,
        tag: tag.trim(),
        color,
        notes: notes.trim()
      },
      targetLinks
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2A211C]/60 p-4 backdrop-blur-xs overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="storybook-card w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl my-8"
      >
        <div className="flex items-center justify-between border-b border-[#E6DCCB] pb-3">
          <h3 className="font-display text-lg font-bold text-[#1E3A2F]">
            {book ? 'Edit Book & Quests' : 'Log a Book in Your Ledger'}
          </h3>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-[#6B5B50]">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-[#2A211C]">Book Title *</label>
            <input
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., The Starless Sea"
              className="mt-1 w-full rounded-xl border border-[#E6DCCB] bg-[#FAF6F0] px-3 py-2 text-sm focus:border-[#C59B27] focus:bg-[#FFFDF9] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2A211C]">Author</label>
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Optional"
              className="mt-1 w-full rounded-xl border border-[#E6DCCB] bg-[#FAF6F0] px-3 py-2 text-xs focus:border-[#C59B27] focus:bg-[#FFFDF9] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2A211C]">Reading Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#E6DCCB] bg-[#FAF6F0] px-3 py-2 text-xs font-semibold text-[#2A211C]"
            >
              <option value="completed">✅ Completed (Awards Pts/Tokens)</option>
              <option value="reading">📖 Currently Reading</option>
              <option value="planned">🗓️ Planned TBR</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2A211C]">Pages</label>
            <input
              type="number"
              min={0}
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              placeholder="e.g., 320"
              className="mt-1 w-full rounded-xl border border-[#E6DCCB] bg-[#FAF6F0] px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2A211C]">Format / Language Tag</label>
            <input
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="e.g., Hungarian, Manga, Fantasy"
              className="mt-1 w-full rounded-xl border border-[#E6DCCB] bg-[#FAF6F0] px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2A211C]">Rating</label>
            <div className="mt-1.5 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setRating(s)}
                  className="p-0.5"
                >
                  <Star
                    className={`h-4 w-4 ${
                      s <= rating ? 'fill-[#C59B27] text-[#C59B27]' : 'text-[#D6CBB8]'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2A211C]">Spine Accent Color</label>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {SPINE_PALETTE.map((hex) => (
                <button
                  type="button"
                  key={hex}
                  onClick={() => setColor(hex)}
                  style={{ backgroundColor: hex }}
                  className={`h-5 w-5 rounded-full transition ${
                    color === hex ? 'ring-2 ring-[#C59B27] ring-offset-2' : ''
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Optional Dual-Readathon Quest Assignment (Double-Dipping!) */}
        <div className="rounded-xl border border-[#C59B27]/40 bg-[#FAF6F0] p-3.5 space-y-2.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#7C5229]">
            ✨ Optional Quest Slot Assignment (Supports Double-Dipping!)
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#1E3A2F]">
              🏰 Once Upon A Year Quest
            </label>
            <select
              value={selectedOyayKey}
              onChange={(e) => setSelectedOyayKey(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#E6DCCB] bg-[#FFFDF9] px-2.5 py-1.5 text-xs"
            >
              <option value="">— Leave unassigned / keep in Shelf Pool —</option>
              {oyaySlotOptions.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#8B3A4A]">
              🎓 Romanceopoly 2027 Board Space
            </label>
            <select
              value={selectedRomSpaceIdx}
              onChange={(e) => setSelectedRomSpaceIdx(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#E6DCCB] bg-[#FFFDF9] px-2.5 py-1.5 text-xs"
            >
              <option value="">— None —</option>
              {romanceopolySpaces.map((sp) => (
                <option key={sp.id} value={sp.index}>
                  #{sp.index + 1} {sp.landmark} ({sp.code}) — {sp.prompt}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#2A211C]">Traveler Notes</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Favorite quotes, cover details, or thoughts..."
            className="mt-1 w-full rounded-xl border border-[#E6DCCB] bg-[#FAF6F0] px-3 py-2 text-xs focus:border-[#C59B27] focus:bg-[#FFFDF9] focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#E6DCCB] px-4 py-2 text-xs font-semibold text-[#5C4D43]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-xl bg-[#1E3A2F] px-5 py-2 text-xs font-semibold text-[#FFFDF9] shadow-sm hover:bg-[#274B3D]"
          >
            Save to Ledger
          </button>
        </div>
      </form>
    </div>
  );
}

/**
 * ============================================================================
 * MODAL: ASSIGN BOOK OR MOVE/SWAP BETWEEN QUESTS
 * ============================================================================
 */
function QuestSlotModal({
  mode,
  source,
  books,
  oyayVolumes,
  onClose,
  onSelectExistingBook,
  onCreateNewBookForSlot,
  onMoveSwapTarget
}) {
  const [filterText, setFilterText] = useState('');
  const allBooks = Object.values(books);

  const filteredBooks = allBooks.filter(
    (b) =>
      b.title.toLowerCase().includes(filterText.toLowerCase()) ||
      (b.author || '').toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2A211C]/60 p-4 backdrop-blur-xs">
      <div className="storybook-card w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-start justify-between gap-2 border-b border-[#E6DCCB] pb-3">
          <div>
            <h3 className="font-display text-base sm:text-lg font-bold text-[#1E3A2F]">
              {mode === 'moveswap' ? '⇄ Move or Swap Quest Book' : '📖 Assign a Book to Quest'}
            </h3>
            <p className="mt-0.5 text-xs text-[#6B5B50] line-clamp-2">{source?.prompt}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-[#6B5B50]">
            <X className="h-4 w-4" />
          </button>
        </div>

        {mode === 'moveswap' ? (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            <p className="text-xs text-[#5C4D43]">
              Choose a destination quest below. Empty slots will <strong>move</strong>{' '}
              <strong>&ldquo;{books[source.bookId]?.title}&rdquo;</strong>; occupied slots will{' '}
              <strong>swap</strong> the two books automatically.
            </p>
            {oyayVolumes.map((vol) => (
              <div key={vol.id} className="space-y-2">
                <div className="font-display text-xs font-bold uppercase tracking-wider text-[#8B3A4A]">
                  {vol.title}
                </div>
                {vol.chapters.map((ch) => (
                  <div key={ch.id} className="space-y-1.5">
                    <div className="text-xs font-bold text-[#1E3A2F]">{ch.title}</div>
                    {[
                      ...ch.coreQuests.map((q) => ({ ...q, sec: 'core', tag: `${q.points} pts` })),
                      ...ch.companionQuests.map((q) => ({
                        ...q,
                        sec: 'companion',
                        tag: `${q.tokens} tokens`
                      }))
                    ].map((q) => {
                      const isCurrent =
                        vol.id === source.volumeId &&
                        ch.id === source.chapterId &&
                        q.sec === source.section &&
                        q.id === source.questId;
                      if (isCurrent) return null;
                      const occupant = q.bookId ? books[q.bookId] : null;
                      return (
                        <button
                          key={q.id}
                          onClick={() =>
                            onMoveSwapTarget({
                              volumeId: vol.id,
                              chapterId: ch.id,
                              section: q.sec,
                              questId: q.id
                            })
                          }
                          className="flex w-full items-center justify-between gap-2 rounded-xl border border-[#E6DCCB] bg-[#FAF6F0] px-3 py-2 text-left text-xs transition hover:border-[#C59B27] hover:bg-[#FFF9EB]"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-medium text-[#2A211C]">{q.prompt}</div>
                            <div className="text-[10px] text-[#6B5B50]">
                              {occupant
                                ? `Occupied by "${occupant.title}" (Will Swap)`
                                : 'Empty Slot (Will Move)'}
                            </div>
                          </div>
                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              occupant
                                ? 'bg-[#F9EFF1] text-[#8B3A4A]'
                                : 'bg-[#EDF3F0] text-[#1E3A2F]'
                            }`}
                          >
                            {occupant ? '⇄ Swap' : '→ Move'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <>
            <button
              onClick={onCreateNewBookForSlot}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E3A2F] py-2.5 text-xs sm:text-sm font-semibold text-[#FFFDF9] shadow-sm hover:bg-[#274B3D]"
            >
              <Plus className="h-4 w-4 text-[#E6B84C]" />
              <span>Add a Brand-New Book to This Slot</span>
            </button>

            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#6B5B50]" />
              <input
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="Or pick an existing book from your Shelf / TBR Pool..."
                className="w-full rounded-xl border border-[#E6DCCB] bg-[#FAF6F0] pl-8 pr-3 py-2 text-xs focus:border-[#C59B27] focus:outline-none"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {filteredBooks.map((bk) => (
                <button
                  key={bk.id}
                  onClick={() => onSelectExistingBook(bk.id)}
                  className="flex w-full items-center justify-between gap-2 rounded-xl border border-[#E6DCCB] bg-[#FFFDF9] px-3 py-2 text-left text-xs transition hover:border-[#C59B27] hover:bg-[#FAF6F0]"
                >
                  <div className="min-w-0">
                    <div className="font-editorial font-bold text-[#1E3A2F] truncate">
                      {bk.title}
                    </div>
                    <div className="text-[10px] text-[#6B5B50]">
                      {bk.status === 'completed' ? '✅ Completed' : '📖 TBR / Reading'}
                      {bk.tag ? ` • ${bk.tag}` : ''}
                    </div>
                  </div>
                  <span className="shrink-0 rounded-lg bg-[#FAF6F0] border border-[#E6DCCB] px-2 py-1 text-[11px] font-semibold text-[#1E3A2F]">
                    Select
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * MODAL: CREATE CUSTOM QUEST / EXTRA POINTS
 * ============================================================================
 */
function CustomQuestModal({ onClose, onCreate }) {
  const [prompt, setPrompt] = useState('');
  const [rewardType, setRewardType] = useState('points');
  const [rewardAmount, setRewardAmount] = useState(5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2A211C]/60 p-4 backdrop-blur-xs">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!prompt.trim()) return;
          onCreate({ prompt: prompt.trim(), rewardType, rewardAmount });
        }}
        className="storybook-card w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[#E6DCCB] pb-3">
          <h3 className="font-display text-lg font-bold text-[#1E3A2F]">
            Create Custom Quest or Bonus Points
          </h3>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-[#6B5B50]">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#2A211C]">Quest Prompt *</label>
          <input
            required
            autoFocus
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Read a book in Hungarian or finish a series finale"
            className="mt-1 w-full rounded-xl border border-[#E6DCCB] bg-[#FAF6F0] px-3 py-2 text-xs focus:border-[#C59B27] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-[#2A211C]">Reward Type</label>
            <select
              value={rewardType}
              onChange={(e) => {
                setRewardType(e.target.value);
                setRewardAmount(e.target.value === 'points' ? 5 : 3);
              }}
              className="mt-1 w-full rounded-xl border border-[#E6DCCB] bg-[#FAF6F0] px-3 py-2 text-xs font-semibold"
            >
              <option value="points">✦ Realm Points (Core)</option>
              <option value="tokens">◈ Guild Tokens (Companion)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#2A211C]">Amount</label>
            <input
              type="number"
              min={1}
              max={100}
              value={rewardAmount}
              onChange={(e) => setRewardAmount(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#E6DCCB] bg-[#FAF6F0] px-3 py-2 text-xs font-bold"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#E6DCCB] px-4 py-2 text-xs font-semibold text-[#5C4D43]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-xl bg-[#1E3A2F] px-4 py-2 text-xs font-semibold text-[#FFFDF9]"
          >
            Add Quest
          </button>
        </div>
      </form>
    </div>
  );
}

/**
 * ============================================================================
 * MODAL: ADD NEW CHAPTER TO VOLUME 2
 * ============================================================================
 */
function NewChapterModal({ onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [season, setSeason] = useState('Chapter Arc');
  const [icon, setIcon] = useState('✨');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2A211C]/60 p-4 backdrop-blur-xs">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onCreate({ title, season, icon });
        }}
        className="storybook-card w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[#E6DCCB] pb-3">
          <h3 className="font-display text-lg font-bold text-[#1E3A2F]">
            Add New Chapter to Volume 2
          </h3>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-[#6B5B50]">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#2A211C]">Chapter Title</label>
          <input
            required
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Chapter 2: The Starlit Archive"
            className="mt-1 w-full rounded-xl border border-[#E6DCCB] bg-[#FAF6F0] px-3 py-2 text-xs"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-[#2A211C]">Season / Theme</label>
            <input
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#E6DCCB] bg-[#FAF6F0] px-3 py-2 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#2A211C]">Chapter Emblem</label>
            <div className="mt-1 flex gap-1.5">
              {['✨', '🧭', '🐉', '🕯️', '🌙'].map((em) => (
                <button
                  type="button"
                  key={em}
                  onClick={() => setIcon(em)}
                  className={`rounded-lg px-2 py-1 text-sm ${
                    icon === em ? 'bg-[#1E3A2F] text-white' : 'bg-[#FAF6F0]'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#E6DCCB] px-4 py-2 text-xs font-semibold text-[#5C4D43]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-xl bg-[#1E3A2F] px-4 py-2 text-xs font-semibold text-[#FFFDF9]"
          >
            Create Chapter
          </button>
        </div>
      </form>
    </div>
  );
}