export type HeroSlide = {
  id: string
  lines: [string, string, string]
  cta: { label: string; href: string }
  image: string
  alt: string
  background: string
  objectPosition: string
}

export const heroSlides: HeroSlide[] = [
  {
    id: 'memory',
    lines: ['Fragrance', 'Becomes', 'Memory'],
    cta: { label: 'All Collection', href: '/shop' },
    image: '/images/hero-1.png',
    alt: 'Smiling woman with braids and a gold hoop earring holding a gold-capped perfume bottle',
    background: '#7FB2D9',
    objectPosition: '70% center',
  },
  {
    id: 'whisper',
    lines: ['A Whisper', 'Of Blossom', 'And Silk'],
    cta: { label: 'Body Perfume', href: '/collections/body-perfume' },
    image: '/images/hero-2.png',
    alt: 'Woman wrapped in sheer green fabric beside a white blossom branch',
    background: '#C9D6C3',
    objectPosition: '70% center',
  },
  {
    id: 'amber',
    lines: ['Amber Light', 'On Every', 'Petal'],
    cta: { label: 'Shop Amber', href: '/collections/amber' },
    image: '/images/hero-3.png',
    alt: 'Amber perfume bottle with a wooden cap surrounded by soft orange petals',
    background: '#F2C9A5',
    objectPosition: '70% center',
  },
]
