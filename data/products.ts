export type ScentFamily = 'floral' | 'woody' | 'oriental' | 'fresh' | 'gourmand'

export type ProductCategoryValue = 'mens' | 'womens' | 'unisex' | 'bath-body' | 'gift-set'

export type ProductNotes = {
  top: string[]
  heart: string[]
  base: string[]
}

export type Product = {
  id: string
  slug: string
  name: string
  price: number
  category: ProductCategoryValue
  volumes: { label: string; price: number }[]
  notes: ProductNotes
  scentFamily: ScentFamily
  rating: number
  reviewCount: number
  tags: string[]
  isNew: boolean
  isBestseller: boolean
  inStock: boolean
  images: string[]
  collections: string[]
  description: string[]
  characteristics: { brand: string; collection: string; itemNo: string }
  tileBg: string
  setIncludes?: string[]
}

function buildVolumes(basePrice: number, isGiftSet = false): { label: string; price: number }[] {
  if (isGiftSet) {
    return [{ label: 'Coffret Set', price: basePrice }]
  }
  return [
    { label: '100 ml', price: basePrice },
    { label: '70 ml', price: Math.max(49, Math.round(basePrice * 0.75)) },
    { label: '50 ml', price: Math.max(39, Math.round(basePrice * 0.58)) },
  ]
}

export const products: Product[] = [
  {
    id: 'P001',
    slug: 'ashes-of-moonlight',
    name: 'Ashes of Moonlight',
    price: 139,
    category: 'womens',
    volumes: [
      { label: '100 ml', price: 139 },
      { label: '70 ml', price: 99 },
      { label: '50 ml', price: 79 },
    ],
    notes: {
      top: ['Bergamot', 'White Peach', 'Pink Pepper'],
      heart: ['Night-Blooming Jasmine', 'Damask Rose', 'Orris Butter'],
      base: ['Smoked Amber', 'White Musk', 'Sandalwood'],
    },
    scentFamily: 'floral',
    rating: 4.9,
    reviewCount: 142,
    tags: ['floral', 'amber', 'evening', 'signature'],
    isNew: false,
    isBestseller: true,
    inStock: true,
    images: [
      '/images/hero-3.png',
      '/images/ashes-main.png',
      '/images/ashes-blossoms.png',
      '/images/ashes-petals.png',
      '/images/ashes-stem.png',
    ],
    collections: ['womens', 'amber', 'womens-top-selling', 'signature'],
    description: [
      'A luminous nocturnal floral where night-blooming jasmine meets warm smoked amber.',
      'Composed for lingering evenings, leaving a trail of powdered iris and velvet sandalwood.',
    ],
    characteristics: { brand: 'DASTAAN', collection: 'Signature', itemNo: 'P001' },
    tileBg: 'var(--tile-warm)',
  },
  {
    id: 'P002',
    slug: 'whispers-of-ether',
    name: 'Whispers of Ether',
    price: 264,
    category: 'unisex',
    volumes: buildVolumes(264),
    notes: {
      top: ['Cardamom', 'Aldehydes', 'Elemi Resin'],
      heart: ['White Tea', 'Violet Leaf', 'Incense'],
      base: ['Cashmere Wood', 'Ambroxan', 'Silver Musk'],
    },
    scentFamily: 'woody',
    rating: 4.8,
    reviewCount: 98,
    tags: ['woody', 'musk', 'unisex', 'extrait'],
    isNew: true,
    isBestseller: true,
    inStock: true,
    images: ['/images/feature-womens.png', '/images/ashes-blossoms.png'],
    collections: ['signature', 'gold-dust', 'womens-top-selling'],
    description: [
      'An weightless architectural study in silver musk, cool incense, and cardamom.',
      'Designed to meld seamlessly with warm skin for an intimate, second-skin aura.',
    ],
    characteristics: { brand: 'DASTAAN', collection: 'Signature', itemNo: 'P002' },
    tileBg: 'var(--tile-soft)',
  },
  {
    id: 'P003',
    slug: 'memoire-sauvage',
    name: 'Memoire Sauvage',
    price: 124,
    category: 'mens',
    volumes: buildVolumes(124),
    notes: {
      top: ['Black Pepper', 'Calabrian Bergamot', 'Juniper Berry'],
      heart: ['Clary Sage', 'Dry Cypress', 'Geranium'],
      base: ['Haitian Vetiver', 'Cedarwood', 'Leather Accord'],
    },
    scentFamily: 'woody',
    rating: 4.7,
    reviewCount: 84,
    tags: ['woody', 'mens', 'vetiver', 'aromatic'],
    isNew: false,
    isBestseller: true,
    inStock: true,
    images: ['/images/promo-sweet.png', '/images/ashes-main.png'],
    collections: ['mens', 'signature', 'best-sweet'],
    description: [
      'A crisp, untamed composition of sun-warmed cypress, crushed juniper, and smoky vetiver.',
      'Crafted for commanding presence from morning light through dusk.',
    ],
    characteristics: { brand: 'DASTAAN', collection: 'Signature', itemNo: 'P003' },
    tileBg: 'var(--tile-green)',
  },
  {
    id: 'P004',
    slug: 'crimson-mirage',
    name: 'Crimson Mirage',
    price: 89,
    category: 'womens',
    volumes: buildVolumes(89),
    notes: {
      top: ['Blood Orange', 'Red Currant', 'Saffron'],
      heart: ['Turkish Rose', 'Praline Accord', 'Peony'],
      base: ['Vanilla Bean', 'Patchouli', 'Benzoin'],
    },
    scentFamily: 'gourmand',
    rating: 4.8,
    reviewCount: 116,
    tags: ['sweet', 'gourmand', 'rose', 'womens'],
    isNew: false,
    isBestseller: true,
    inStock: true,
    images: ['/images/promo-top-selling.png', '/images/ashes-rose.png'],
    collections: ['womens', 'best-sweet', 'womens-top-selling'],
    description: [
      'Velvet crimson rose spun with saffron threads and dark caramelized praline.',
      'Both radiant and addictive, balancing bright red berries against warm benzoin.',
    ],
    characteristics: { brand: 'DASTAAN', collection: 'Signature', itemNo: 'P004' },
    tileBg: 'var(--tile-neutral)',
  },
  {
    id: 'P005',
    slug: 'gold-dust',
    name: 'Gold Dust',
    price: 198,
    category: 'unisex',
    volumes: buildVolumes(198),
    notes: {
      top: ['Ceylon Cinnamon', 'Nutmeg', 'Mandarin Zest'],
      heart: ['Labdanum', 'Honeyed Tobacco', 'Osmanthus'],
      base: ['Golden Amber', 'Oud Wood', 'Madagascar Vanilla'],
    },
    scentFamily: 'oriental',
    rating: 4.9,
    reviewCount: 164,
    tags: ['cinnamon', 'amber', 'gold-dust', 'oriental'],
    isNew: false,
    isBestseller: true,
    inStock: true,
    images: ['/images/feature-gold-dust.png', '/images/ashes-petals.png'],
    collections: ['gold-dust', 'amber', 'best-sweet', 'signature'],
    description: [
      'One of the most defining fragrance notes of Gold Dust is warm Ceylon cinnamon layered over liquid amber.',
      'Rich honeyed tobacco and resinous labdanum create an opulent, shimmering trail.',
    ],
    characteristics: { brand: 'DASTAAN', collection: 'Gold Dust', itemNo: 'P005' },
    tileBg: 'var(--tile-gold)',
  },
  {
    id: 'P006',
    slug: 'velvet-fig',
    name: 'Velvet Fig',
    price: 118,
    category: 'womens',
    volumes: buildVolumes(118),
    notes: {
      top: ['Green Fig Leaf', 'Italian Mandarin', 'Pink Grapefruit'],
      heart: ['Ripe Black Fig', 'Iris Pallida', 'Coconut Milk'],
      base: ['Tonka Bean', 'White Cedar', 'Creamy Sandalwood'],
    },
    scentFamily: 'gourmand',
    rating: 4.6,
    reviewCount: 67,
    tags: ['fig', 'sweet', 'womens', 'creamy'],
    isNew: true,
    isBestseller: false,
    inStock: true,
    images: ['/images/hero-2.png', '/images/ashes-stem.png'],
    collections: ['womens', 'best-sweet', 'body-perfume'],
    description: [
      'Sun-ripened Mediterranean fig wrapped in cool green leaves and velvety iris.',
      'Settles into a comforting base of roasted tonka bean and pale sandalwood.',
    ],
    characteristics: { brand: 'DASTAAN', collection: 'Lumière', itemNo: 'P006' },
    tileBg: 'var(--tile-stone)',
  },
  {
    id: 'P007',
    slug: 'nocturne-cedar',
    name: 'Nocturne Cedar',
    price: 156,
    category: 'mens',
    volumes: buildVolumes(156),
    notes: {
      top: ['Black Cardamom', 'Grapefruit Peel', 'Coriander'],
      heart: ['Atlas Cedar', 'Smoked Guaiac', 'Violet'],
      base: ['Dark Amber', 'Oakmoss', 'Patchouli'],
    },
    scentFamily: 'woody',
    rating: 4.7,
    reviewCount: 73,
    tags: ['cedar', 'woody', 'mens', 'evening'],
    isNew: false,
    isBestseller: false,
    inStock: true,
    images: ['/images/feature-womens.png', '/images/ashes-main.png'],
    collections: ['mens', 'amber', 'signature'],
    description: [
      'Majestic Atlas cedarwood steeped in black cardamom and nocturnal resins.',
      'A refined woody signature with deep oakmoss and warm dark amber.',
    ],
    characteristics: { brand: 'DASTAAN', collection: 'Nocturne', itemNo: 'P007' },
    tileBg: 'var(--tile-sand)',
  },
  {
    id: 'P008',
    slug: 'luminous-iris',
    name: 'Luminous Iris',
    price: 104,
    category: 'bath-body',
    volumes: [
      { label: '100 ml', price: 104 },
      { label: '50 ml', price: 64 },
    ],
    notes: {
      top: ['Neroli', 'Bergamot Water', 'Pear Blossom'],
      heart: ['Florentine Iris', 'White Peony', 'Almond Milk'],
      base: ['Skin Musk', 'Heliotrope', 'Blonde Woods'],
    },
    scentFamily: 'floral',
    rating: 4.8,
    reviewCount: 91,
    tags: ['body-perfume', 'iris', 'floral', 'ritual'],
    isNew: false,
    isBestseller: true,
    inStock: true,
    images: ['/images/chip-bottle.png', '/images/hero-2.png'],
    collections: ['body-perfume', 'womens', 'womens-top-selling'],
    description: [
      'A featherlight body perfume mist enriched with botanical oils and Florentine iris.',
      'Leaves skin and hair delicately veiled in clean musk and pear blossom.',
    ],
    characteristics: { brand: 'DASTAAN', collection: 'Body Rituals', itemNo: 'P008' },
    tileBg: 'var(--tile-sage)',
  },
  {
    id: 'P009',
    slug: 'cassis-veil',
    name: 'Cassis Veil',
    price: 176,
    category: 'womens',
    volumes: buildVolumes(176),
    notes: {
      top: ['Blackcurrant Bud', 'Pink Champagne Accord', 'Lychee'],
      heart: ['Centifolia Rose', 'Magnolia', 'Freesia'],
      base: ['Ambrette Seed', 'Cedar', 'Velvet Musk'],
    },
    scentFamily: 'floral',
    rating: 4.9,
    reviewCount: 109,
    tags: ['cassis', 'rose', 'womens', 'bestseller'],
    isNew: true,
    isBestseller: true,
    inStock: true,
    images: ['/images/hero-1.png', '/images/ashes-rose.png'],
    collections: ['womens', 'womens-top-selling', 'best-sweet'],
    description: [
      'Tart blackcurrant buds and dewy Centifolia rose suspended in a translucent musk veil.',
      'Radiant, poised, and effortlessly modern.',
    ],
    characteristics: { brand: 'DASTAAN', collection: 'Signature', itemNo: 'P009' },
    tileBg: 'var(--tile-blush)',
  },
  {
    id: 'P010',
    slug: 'salted-amber',
    name: 'Salted Amber',
    price: 132,
    category: 'unisex',
    volumes: buildVolumes(132),
    notes: {
      top: ['Sea Salt', 'Sicilian Lemon', 'Pink Pepper'],
      heart: ['Solar Amber', 'Driftwood', 'Sage'],
      base: ['Ambergris Accord', 'Myrrh', 'Warm Vanilla'],
    },
    scentFamily: 'oriental',
    rating: 4.7,
    reviewCount: 79,
    tags: ['amber', 'marine', 'unisex', 'warm'],
    isNew: false,
    isBestseller: false,
    inStock: true,
    images: ['/images/hero-3.png', '/images/ashes-petals.png'],
    collections: ['amber', 'gold-dust', 'body-perfume'],
    description: [
      'Sun-bleached driftwood and mineral sea salt kissed by golden solar amber.',
      'Evokes late afternoon light over warm coastal cliffs.',
    ],
    characteristics: { brand: 'DASTAAN', collection: 'Amber', itemNo: 'P010' },
    tileBg: 'var(--tile-amber)',
  },
  {
    id: 'P011',
    slug: 'saffron-silk-mist',
    name: 'Saffron Silk Mist',
    price: 96,
    category: 'bath-body',
    volumes: [
      { label: '100 ml', price: 96 },
      { label: '50 ml', price: 58 },
    ],
    notes: {
      top: ['Red Saffron', 'Mandarin Blossom'],
      heart: ['Orange Flower Water', 'Silk Tree Blossom'],
      base: ['Honeyed Amber', 'Soft Musk'],
    },
    scentFamily: 'oriental',
    rating: 4.6,
    reviewCount: 52,
    tags: ['body-perfume', 'saffron', 'mist', 'amber'],
    isNew: true,
    isBestseller: false,
    inStock: true,
    images: ['/images/hero-2.png', '/images/ashes-stem.png'],
    collections: ['body-perfume', 'amber', 'gold-dust'],
    description: [
      'An alcohol-free conditioning body and hair perfume infused with red saffron and orange blossom.',
      'Designed for layering beneath your signature Dastaan Eau de Parfum.',
    ],
    characteristics: { brand: 'DASTAAN', collection: 'Body Rituals', itemNo: 'P011' },
    tileBg: 'var(--tile-warm)',
  },
  {
    id: 'P012',
    slug: 'oud-velours',
    name: 'Oud Velours',
    price: 245,
    category: 'mens',
    volumes: buildVolumes(245),
    notes: {
      top: ['Cinnamon Bark', 'Davana', 'Clove Bud'],
      heart: ['Aged Agarwood', 'Damask Rose', 'Suede'],
      base: ['Smoked Labdanum', 'Cypriol', 'Black Amber'],
    },
    scentFamily: 'oriental',
    rating: 4.9,
    reviewCount: 131,
    tags: ['oud', 'mens', 'amber', 'limited'],
    isNew: false,
    isBestseller: true,
    inStock: false,
    images: ['/images/feature-gold-dust.png', '/images/ashes-main.png'],
    collections: ['mens', 'gold-dust', 'amber', 'signature'],
    description: [
      'Rare aged agarwood softened by supple dark suede, cinnamon bark, and smoked labdanum.',
      'Produced in small numbered batches; currently awaiting the next atelier maceration.',
    ],
    characteristics: { brand: 'DASTAAN', collection: 'Gold Dust', itemNo: 'P012' },
    tileBg: 'var(--tile-gold)',
  },
  {
    id: 'P013',
    slug: 'neroli-botanica',
    name: 'Neroli Botanica',
    price: 112,
    category: 'bath-body',
    volumes: [
      { label: '100 ml', price: 112 },
      { label: '70 ml', price: 84 },
    ],
    notes: {
      top: ['Bitter Orange Leaf', 'Petitgrain', 'Green Bergamot'],
      heart: ['Moroccan Neroli', 'Jasmine Sambac'],
      base: ['Clean Vetiver', 'White Musk'],
    },
    scentFamily: 'fresh',
    rating: 4.7,
    reviewCount: 61,
    tags: ['fresh', 'neroli', 'body-perfume', 'citrus'],
    isNew: true,
    isBestseller: false,
    inStock: true,
    images: ['/images/ashes-blossoms.png', '/images/hero-2.png'],
    collections: ['body-perfume', 'womens'],
    description: [
      'Crisp petitgrain and sun-drenched Moroccan neroli captured in a revitalizing body parfum.',
      'Brings the brightness of a walled citrus garden to morning rituals.',
    ],
    characteristics: { brand: 'DASTAAN', collection: 'Body Rituals', itemNo: 'P013' },
    tileBg: 'var(--tile-green)',
  },
  {
    id: 'P014',
    slug: 'bergamot-santal',
    name: 'Bergamot Santal',
    price: 148,
    category: 'mens',
    volumes: buildVolumes(148),
    notes: {
      top: ['Earl Grey Bergamot', 'Grapefruit', 'Elemi'],
      heart: ['Mysore Sandalwood', 'Iris Root', 'Nutmeg'],
      base: ['Virginia Cedar', 'Vetiver', 'Tonka'],
    },
    scentFamily: 'fresh',
    rating: 4.8,
    reviewCount: 77,
    tags: ['mens', 'sandalwood', 'fresh', 'citrus'],
    isNew: false,
    isBestseller: false,
    inStock: true,
    images: ['/images/ashes-main.png', '/images/promo-sweet.png'],
    collections: ['mens', 'signature'],
    description: [
      'Sparkling Calabrian bergamot anchored by creamy Mysore sandalwood and dry cedar.',
      'Tailored, effortless, and quietly magnetic.',
    ],
    characteristics: { brand: 'DASTAAN', collection: 'Signature', itemNo: 'P014' },
    tileBg: 'var(--tile-stone)',
  },
  {
    id: 'P015',
    slug: 'signature-discovery-coffret',
    name: 'The Signature Discovery Coffret',
    price: 145,
    category: 'gift-set',
    volumes: [{ label: '5 × 15 ml', price: 145 }],
    notes: {
      top: ['Bergamot', 'Ceylon Cinnamon', 'Blackcurrant'],
      heart: ['Night Jasmine', 'Turkish Rose', 'White Tea'],
      base: ['Smoked Amber', 'Haitian Vetiver', 'Silver Musk'],
    },
    scentFamily: 'oriental',
    rating: 4.9,
    reviewCount: 154,
    tags: ['gift-set', 'discovery', 'coffret', 'bestseller'],
    isNew: false,
    isBestseller: true,
    inStock: true,
    images: ['/images/feature-gold-dust.png', '/images/hero-1.png'],
    collections: ['signature', 'gold-dust', 'womens-top-selling'],
    description: [
      'An introduction to the House of Dastaan featuring five travel-sized extraits in a linen-bound keepsake box.',
      'Ideal for gifting or discovering your personal olfactory signature across day and night.',
    ],
    characteristics: { brand: 'DASTAAN', collection: 'Gifting', itemNo: 'P015' },
    tileBg: 'var(--tile-gold)',
    setIncludes: [
      'Ashes of Moonlight Eau de Parfum (15 ml)',
      'Whispers of Ether Eau de Parfum (15 ml)',
      'Memoire Sauvage Eau de Parfum (15 ml)',
      'Gold Dust Eau de Parfum (15 ml)',
      'Crimson Mirage Eau de Parfum (15 ml)',
      'Numbered ceramic blotter stones',
    ],
  },
  {
    id: 'P016',
    slug: 'nocturne-duo-gift-set',
    name: 'Nocturne Amber & Woods Duo',
    price: 220,
    category: 'gift-set',
    volumes: [{ label: '2 × 70 ml', price: 220 }],
    notes: {
      top: ['Black Cardamom', 'Sea Salt', 'Cinnamon'],
      heart: ['Atlas Cedar', 'Solar Amber', 'Labdanum'],
      base: ['Oud Wood', 'Oakmoss', 'Myrrh'],
    },
    scentFamily: 'woody',
    rating: 4.8,
    reviewCount: 64,
    tags: ['gift-set', 'mens', 'amber', 'woody'],
    isNew: true,
    isBestseller: false,
    inStock: true,
    images: ['/images/hero-3.png', '/images/promo-sweet.png'],
    collections: ['mens', 'amber', 'gold-dust'],
    description: [
      'A curated pairing of our deepest resinous and woody compositions presented in a custom ink-lacquered box.',
      'Designed to be worn solo or layered together for evening depth.',
    ],
    characteristics: { brand: 'DASTAAN', collection: 'Gifting', itemNo: 'P016' },
    tileBg: 'var(--tile-amber)',
    setIncludes: [
      'Nocturne Cedar Eau de Parfum (70 ml)',
      'Salted Amber Eau de Parfum (70 ml)',
      'Refillable anodized travel atomizer (10 ml)',
    ],
  },
  {
    id: 'P017',
    slug: 'lumiere-floral-ritual-set',
    name: 'Lumière Floral & Body Ritual Set',
    price: 185,
    category: 'gift-set',
    volumes: [{ label: '100 ml + 100 ml', price: 185 }],
    notes: {
      top: ['White Peach', 'Neroli', 'Blackcurrant Bud'],
      heart: ['Florentine Iris', 'Centifolia Rose', 'Jasmine'],
      base: ['Skin Musk', 'Sandalwood', 'Ambrette'],
    },
    scentFamily: 'floral',
    rating: 4.9,
    reviewCount: 89,
    tags: ['gift-set', 'womens', 'floral', 'body-perfume'],
    isNew: true,
    isBestseller: true,
    inStock: true,
    images: ['/images/feature-womens.png', '/images/hero-2.png'],
    collections: ['womens', 'body-perfume', 'womens-top-selling'],
    description: [
      'A complete two-step layering ritual pairing our signature floral Eau de Parfum with a conditioning body mist.',
      'Presented with a woven organic cotton pouch.',
    ],
    characteristics: { brand: 'DASTAAN', collection: 'Gifting', itemNo: 'P017' },
    tileBg: 'var(--tile-blush)',
    setIncludes: [
      'Ashes of Moonlight Eau de Parfum (100 ml)',
      'Luminous Iris Body Perfume Mist (100 ml)',
      'Monogrammed raw-linen travel pouch',
    ],
  },
  {
    id: 'P018',
    slug: 'velvet-gourmand-trio-coffret',
    name: 'Velvet Gourmand Trio Coffret',
    price: 165,
    category: 'gift-set',
    volumes: [{ label: '3 × 50 ml', price: 165 }],
    notes: {
      top: ['Blood Orange', 'Green Fig', 'Ceylon Cinnamon'],
      heart: ['Praline Accord', 'Ripe Black Fig', 'Honeyed Tobacco'],
      base: ['Madagascar Vanilla', 'Tonka Bean', 'Benzoin'],
    },
    scentFamily: 'gourmand',
    rating: 4.8,
    reviewCount: 72,
    tags: ['gift-set', 'sweet', 'gourmand'],
    isNew: false,
    isBestseller: false,
    inStock: true,
    images: ['/images/promo-sweet.png', '/images/promo-top-selling.png'],
    collections: ['best-sweet', 'gold-dust'],
    description: [
      'Three decadent gourmand fragrances celebrating spiced vanilla, roasted tonka, and velvet fig.',
      'Wrapped in cream archival paper with a wax-sealed gift card.',
    ],
    characteristics: { brand: 'DASTAAN', collection: 'Gifting', itemNo: 'P018' },
    tileBg: 'var(--tile-soft)',
    setIncludes: [
      'Crimson Mirage Eau de Parfum (50 ml)',
      'Velvet Fig Eau de Parfum (50 ml)',
      'Gold Dust Eau de Parfum (50 ml)',
      'Complimentary personalized calligraphy card',
    ],
  },
]

export const categories = [
  { value: 'all', label: 'All perfumes' },
  { value: 'mens', label: "Men's" },
  { value: 'womens', label: "Women's" },
  { value: 'unisex', label: 'Unisex' },
  { value: 'bath-body', label: 'Bath & body' },
  { value: 'gift-set', label: 'Gift sets' },
] as const

export type ProductCategory = (typeof categories)[number]['value']

export const scentFamilies: { value: ScentFamily; label: string }[] = [
  { value: 'floral', label: 'Floral' },
  { value: 'woody', label: 'Woody' },
  { value: 'oriental', label: 'Oriental' },
  { value: 'fresh', label: 'Fresh' },
  { value: 'gourmand', label: 'Gourmand' },
]

export const volumeOptions = ['100 ml', '70 ml', '50 ml'] as const

export function getProduct(slug: string): Product | undefined {
  return products.find((item) => item.slug === slug)
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`
}
