export type Collection = {
  slug: string
  title: string
  subtitle: string
  story: string
  notes: string[]
  heroImage: string
  productSlugs: string[]
}

export const collections: Collection[] = [
  {
    slug: 'gold-dust',
    title: 'Gold Dust & Cracked Perfumes',
    subtitle: 'Opulent spiced resins and warm Ceylon cinnamon suspended in liquid amber.',
    story:
      'Inspired by the shimmer of desert dusk and ancient spice routes, the Gold Dust chapter pairs fiery Ceylon cinnamon with honeyed tobacco leaf and aged resins. Each composition is macerated in small batches to achieve a molten, second-skin warmth that lingers from twilight until dawn. Designed for those who gravitate toward rich, textured trails.',
    notes: ['Ceylon Cinnamon', 'Golden Labdanum', 'Honeyed Tobacco', 'Oud Wood'],
    heroImage: '/images/feature-gold-dust.png',
    productSlugs: [
      'gold-dust',
      'whispers-of-ether',
      'salted-amber',
      'oud-velours',
      'saffron-silk-mist',
      'signature-discovery-coffret',
    ],
  },
  {
    slug: 'womens',
    title: "Women's Fragrances",
    subtitle: 'Luminous florals, velvet fruits, and sensual musks crafted for timeless poise.',
    story:
      'Our Women’s collection celebrates the tension between delicate botanical petals and deep, nocturnal woods. From night-blooming jasmine and Centifolia rose to sun-ripened Mediterranean fig, every bottle unfolds on the skin like an intimate memoir. Composed to be worn as both a daily ritual and an unforgettable evening signature.',
    notes: ['Night-Blooming Jasmine', 'Centifolia Rose', 'Blackcurrant Bud', 'White Musk'],
    heroImage: '/images/feature-womens.png',
    productSlugs: [
      'ashes-of-moonlight',
      'crimson-mirage',
      'velvet-fig',
      'cassis-veil',
      'luminous-iris',
      'lumiere-floral-ritual-set',
    ],
  },
  {
    slug: 'mens',
    title: "Men's Fragrances",
    subtitle: 'Architectural woods, dry vetiver, and spiced leather tailored for quiet authority.',
    story:
      'Built on a foundation of Atlas cedar, Haitian vetiver, and smoked agarwood, the Men’s collection balances crisp aromatic top notes against dark resinous bases. Cold-pressed Calabrian bergamot and crushed black pepper bring immediate clarity before settling into warm suede and oakmoss. Crafted for enduring character in every season.',
    notes: ['Haitian Vetiver', 'Atlas Cedar', 'Black Cardamom', 'Smoked Agarwood'],
    heroImage: '/images/ashes-main.png',
    productSlugs: [
      'memoire-sauvage',
      'nocturne-cedar',
      'oud-velours',
      'bergamot-santal',
      'nocturne-duo-gift-set',
    ],
  },
  {
    slug: 'body-perfume',
    title: 'Body Perfume',
    subtitle: 'Silken mists and intimate skin scents composed for luminous daily rituals.',
    story:
      'Conceived as a weightless veil for skin and hair, our Body Perfume collection merges fine fragrance concentration with conditioning botanical waters. Florentine iris, red saffron, and Moroccan neroli release their aroma gently with every movement. Wear each mist solo for an effortless glow or layer beneath our Eau de Parfums to amplify their trail.',
    notes: ['Florentine Iris', 'Moroccan Neroli', 'Red Saffron', 'Skin Musk'],
    heroImage: '/images/hero-2.png',
    productSlugs: [
      'luminous-iris',
      'saffron-silk-mist',
      'neroli-botanica',
      'velvet-fig',
      'salted-amber',
      'lumiere-floral-ritual-set',
    ],
  },
  {
    slug: 'amber',
    title: 'Amber Collection',
    subtitle: 'Warm resins, golden labdanum, and smoked woods that linger into the night.',
    story:
      'Amber is the beating heart of the House of Dastaan—radiant, enveloping, and endlessly multifaceted. In this collection, solar ambergris, benzoin tears, and roasted labdanum are illuminated by sea salt, saffron, and night florals. Every drop captures the golden hour in glass.',
    notes: ['Solar Amber', 'Smoked Labdanum', 'Benzoin Resin', 'Madagascar Vanilla'],
    heroImage: '/images/hero-3.png',
    productSlugs: [
      'ashes-of-moonlight',
      'gold-dust',
      'salted-amber',
      'nocturne-cedar',
      'oud-velours',
      'nocturne-duo-gift-set',
    ],
  },
  {
    slug: 'best-sweet',
    title: 'Top 10 Best Sweet Perfume',
    subtitle: 'Gourmand accords balanced with spiced woods, roasted tonka, and dark vanilla.',
    story:
      'Far from conventional confections, Dastaan approaches sweetness through the lens of haute perfumery. Dark caramelized praline, ripe black fig, and roasted tonka bean are tempered by dry cypress, saffron, and patchouli. The result is an editorial curation of our most magnetic gourmand-inflected creations.',
    notes: ['Dark Praline', 'Ripe Black Fig', 'Roasted Tonka', 'Ceylon Cinnamon'],
    heroImage: '/images/promo-sweet.png',
    productSlugs: [
      'crimson-mirage',
      'gold-dust',
      'velvet-fig',
      'cassis-veil',
      'memoire-sauvage',
      'velvet-gourmand-trio-coffret',
    ],
  },
  {
    slug: 'womens-top-selling',
    title: "Women's 2025 Top Selling Perfume",
    subtitle: 'Our most coveted compositions celebrated for their unforgettable trail.',
    story:
      'Chosen by patrons of the House across the globe, these perennial icons represent the pinnacle of Dastaan floral and amber craftsmanship. Each composition in our 2025 edit has earned its acclaim through extraordinary longevity and unmistakable sillage. Discover the signatures that define modern luxury.',
    notes: ['Damask Rose', 'Orris Butter', 'Silver Musk', 'Blackcurrant'],
    heroImage: '/images/promo-top-selling.png',
    productSlugs: [
      'ashes-of-moonlight',
      'whispers-of-ether',
      'crimson-mirage',
      'cassis-veil',
      'luminous-iris',
      'lumiere-floral-ritual-set',
    ],
  },
  {
    slug: 'signature',
    title: 'The Signature Archive',
    subtitle: 'Foundational extraits and Eau de Parfums from the Dastaan permanent collection.',
    story:
      'The Signature Archive brings together the foundational pillars of Dastaan—timeless studies in wood, resin, and blossom that transcend gender and season. Bottled in our architectural glass flacons, these creations embody the restraint and poetry of our atelier. Begin here to experience the essential language of the House.',
    notes: ['Cashmere Wood', 'Smoked Amber', 'Mysore Sandalwood', 'Calabrian Bergamot'],
    heroImage: '/images/hero-1.png',
    productSlugs: [
      'ashes-of-moonlight',
      'whispers-of-ether',
      'memoire-sauvage',
      'gold-dust',
      'nocturne-cedar',
      'bergamot-santal',
      'signature-discovery-coffret',
    ],
  },
]
