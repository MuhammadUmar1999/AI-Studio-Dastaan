export type JournalCategory = 'Craftsmanship' | 'Campaigns' | 'Rituals' | 'Ingredients'

export type JournalBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'quote'; text: string; attribution?: string }
  | { type: 'image'; src: string; alt: string; caption?: string }

export type JournalArticle = {
  slug: string
  title: string
  category: JournalCategory
  excerpt: string
  date: string
  readTime: string
  heroImage: string
  body: JournalBlock[]
  relatedProductSlugs: string[]
}

export const journalCategories: readonly ('All' | JournalCategory)[] = [
  'All',
  'Craftsmanship',
  'Campaigns',
  'Rituals',
  'Ingredients',
] as const

export const journalArticles: JournalArticle[] = [
  {
    slug: 'the-art-of-amber',
    title: 'The Art of Amber & Resin',
    category: 'Ingredients',
    excerpt:
      'How golden labdanum, Siam benzoin, and smoked Atlas cedar form the nocturnal backbone of the House of Dastaan.',
    date: 'October 2, 2025',
    readTime: '4 min read',
    heroImage: '/images/hero-3.png',
    relatedProductSlugs: ['gold-dust', 'salted-amber', 'ashes-of-moonlight'],
    body: [
      {
        type: 'paragraph',
        text: 'In classical perfumery, amber is not a single raw material harvested from the earth, but an olfactory chord—a slow-burning architecture built from labdanum resin, vanilla absolute, and benzoin tears. At Dastaan, this chord serves as the emotional anchor across our most coveted compositions.',
      },
      {
        type: 'heading',
        text: 'Harvesting the Golden Hour',
      },
      {
        type: 'paragraph',
        text: 'Our cistus labdanum is gathered in late summer from wild rockrose shrubs along the sun-baked hillsides of Andalusia. Under the heat of the afternoon sun, the leaves exude a protective, balsamic resin with leathery, woody, and subtly honeyed facets.',
      },
      {
        type: 'quote',
        text: 'True amber should feel like late afternoon sunlight trapped in smoked glass—warm on the skin, yet translucent in the air.',
        attribution: 'Master Perfumer, House of Dastaan',
      },
      {
        type: 'image',
        src: '/images/ashes-petals.png',
        alt: 'Amber flacon surrounded by warm autumn petals',
        caption: 'Maceration trials pairing Andalusian labdanum with Ceylon cinnamon bark.',
      },
      {
        type: 'heading',
        text: 'Balancing Warmth and Air',
      },
      {
        type: 'paragraph',
        text: 'To keep our amber compositions from feeling heavy, we counterpoint dark resins with mineral sea salt in Salted Amber and cold-pressed Calabrian bergamot in Ashes of Moonlight. The result is an amber that breathes with the wearer from dusk until dawn.',
      },
    ],
  },
  {
    slug: 'echo-your-love-campaign',
    title: 'Behind the Film: Echo Your Love',
    category: 'Campaigns',
    excerpt:
      'An intimate look at the visual poetry, choreography, and floral alchemy behind our signature autumn campaign.',
    date: 'September 18, 2025',
    readTime: '3 min read',
    heroImage: '/images/ashes-rose.png',
    relatedProductSlugs: ['ashes-of-moonlight', 'crimson-mirage', 'cassis-veil'],
    body: [
      {
        type: 'paragraph',
        text: 'Shot on 35mm film over three quiet nights, Echo Your Love explores the invisible trace a fragrance leaves in a room long after someone has departed. Rather than illustrating scent literally, the film studies texture: coral roses submerged in amber water, raw silk catching the wind, and shadow play across limestone walls.',
      },
      {
        type: 'heading',
        text: 'A Study in Botanical Contrast',
      },
      {
        type: 'paragraph',
        text: 'Central to the campaign is the duality of Turkish Damask rose and night-blooming jasmine. When distilled at dawn, rose petals hold a crisp, almost metallic brightness; by midnight, paired with smoked sandalwood and orris butter, they transform into something velvet and secretive.',
      },
      {
        type: 'image',
        src: '/images/ashes-stem.png',
        alt: 'Ashes of Moonlight bottle beside a single stem blossom',
        caption: 'Set still from Scene II: The Stillness Before Dusk.',
      },
      {
        type: 'quote',
        text: 'We wanted the camera to move the way sillage moves—unhurried, enveloping, and impossible to hold in your hand.',
        attribution: 'Creative Director, Dastaan',
      },
      {
        type: 'paragraph',
        text: 'Each frame was color-graded to match the natural amber hue of our extraits, eschewing artificial dyes in favor of the raw tint imparted by aged vanilla bean and labdanum.',
      },
    ],
  },
  {
    slug: 'rituals-of-scent-layering',
    title: 'Rituals of Scent Layering',
    category: 'Rituals',
    excerpt:
      'Pairing conditioning hair mists, botanical body perfumes, and extraits to compose a deeply personal olfactory trail.',
    date: 'August 29, 2025',
    readTime: '5 min read',
    heroImage: '/images/hero-2.png',
    relatedProductSlugs: ['luminous-iris', 'saffron-silk-mist', 'lumiere-floral-ritual-set'],
    body: [
      {
        type: 'paragraph',
        text: 'Historically, fragrance was never applied as a single, hurried spritz before stepping out the door. Across Persian, Indian, and Mediterranean traditions, scent was built in quiet layers—beginning with infused bath waters and botanical oils, and culminating in smoked resins brushed through the hair.',
      },
      {
        type: 'heading',
        text: 'Step One: The Botanical Foundation',
      },
      {
        type: 'paragraph',
        text: 'Moisture is the secret to longevity. Applying an alcohol-free mist like Luminous Iris or Saffron Silk Mist to warm, damp skin immediately after bathing locks aromatic molecules into the epidermis, creating a soft cushion for heavier woods and extraits.',
      },
      {
        type: 'quote',
        text: 'Layering is not about volume; it is about dimension. One fragrance stays close to the pulse, while the other greets the room.',
        attribution: 'Dastaan Atelier Guide',
      },
      {
        type: 'heading',
        text: 'Step Two: Contrasting Families',
      },
      {
        type: 'paragraph',
        text: 'Some of the most compelling pairings come from unexpected contrasts. Try misting Neroli Botanica across the collarbones to bring crisp citrus clarity, then anchoring the wrists with a single drop of Gold Dust or Nocturne Cedar.',
      },
    ],
  },
  {
    slug: 'inside-the-maceration-cellar',
    title: 'Inside the Maceration Cellar',
    category: 'Craftsmanship',
    excerpt:
      'Why patience remains our rarest ingredient: six weeks of cool darkness that turn raw distillations into liquid silk.',
    date: 'August 11, 2025',
    readTime: '4 min read',
    heroImage: '/images/ashes-main.png',
    relatedProductSlugs: ['whispers-of-ether', 'oud-velours', 'signature-discovery-coffret'],
    body: [
      {
        type: 'paragraph',
        text: 'When a fragrance formula is first compounded, its raw materials sit side by side like strangers in a room. The top notes of bergamot and cardamom announce themselves sharply, while the base notes of agarwood and musk remain muted beneath the surface.',
      },
      {
        type: 'heading',
        text: 'The Alchemy of Time',
      },
      {
        type: 'paragraph',
        text: 'In our temperature-controlled cellar, each batch rests in dark glass demijohns for a minimum of six to eight weeks. During this slow maceration, natural esters form and sharp edges dissolve, binding thirty distinct botanicals into a single, seamless voice.',
      },
      {
        type: 'image',
        src: '/images/ashes-blossoms.png',
        alt: 'Dastaan flacon resting on stone beside white blossoms',
        caption: 'Final filtration at 4°C preserves delicate floral top notes.',
      },
      {
        type: 'paragraph',
        text: 'Only when our master perfumer approves the olfactory maturity of the batch is the liquid chilled, filtered through unbleached linen paper, and hand-filled into our architectural flacons.',
      },
    ],
  },
  {
    slug: 'florentine-orris-white-gold',
    title: 'Florentine Orris: Perfumery’s White Gold',
    category: 'Ingredients',
    excerpt:
      'Three years in the Tuscan soil and three years drying in linen sacks—the extraordinary journey of Iris Pallida.',
    date: 'July 24, 2025',
    readTime: '4 min read',
    heroImage: '/images/feature-womens.png',
    relatedProductSlugs: ['luminous-iris', 'velvet-fig', 'ashes-of-moonlight'],
    body: [
      {
        type: 'paragraph',
        text: 'Despite its name, the scent of iris does not come from the vivid purple petals that bloom across Tuscan hillsides each May. Instead, the fragrance lies hidden underground inside the rhizome—the knotted root of the Iris Pallida plant.',
      },
      {
        type: 'heading',
        text: 'A Six-Year Harvest',
      },
      {
        type: 'paragraph',
        text: 'Freshly dug iris roots are entirely odorless. Only after they are washed, peeled by hand, and aged in ventilated lofts for three full years do natural irones develop—yielding a cool, powdery, violet-inflected butter that feels like crushed velvet on the skin.',
      },
      {
        type: 'quote',
        text: 'Orris butter is the bridge between earth and air; it gives floral fragrances the structural poise of marble.',
        attribution: 'Botanical Archivist, Dastaan',
      },
      {
        type: 'paragraph',
        text: 'In both Luminous Iris and Velvet Fig, Florentine orris butter provides an unmistakable creamy luminosity that endures for twelve hours on skin.',
      },
    ],
  },
  {
    slug: 'architecture-of-the-flacon',
    title: 'The Architecture of the Flacon',
    category: 'Craftsmanship',
    excerpt:
      'From heavy-base crystal glass to sustainably turned ashwood caps, how tactile design shapes the ritual of scent.',
    date: 'July 5, 2025',
    readTime: '3 min read',
    heroImage: '/images/feature-gold-dust.png',
    relatedProductSlugs: ['memoire-sauvage', 'nocturne-cedar', 'bergamot-santal'],
    body: [
      {
        type: 'paragraph',
        text: 'Before a perfume is ever smelled, it is held. The weight of the glass in the palm, the cool resistance of the atomizer, and the quiet click of the cap set the tempo for the olfactory experience to follow.',
      },
      {
        type: 'heading',
        text: 'Restraint in Form',
      },
      {
        type: 'paragraph',
        text: 'Our signature bottles are molded with crisp architectural shoulders and a weighted base that refracts light through the natural tint of the perfume within. Each cap is turned from FSC-certified European ashwood, ensuring no two grain patterns are ever identical.',
      },
      {
        type: 'paragraph',
        text: 'Every outer carton is milled from 100% recycled cotton-rag and FSC paper in our signature warm cream shade, designed to be kept as an object of quiet beauty on your dressing table.',
      },
    ],
  },
]

export function getJournalArticle(slug: string): JournalArticle | undefined {
  return journalArticles.find((article) => article.slug === slug)
}
