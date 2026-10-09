'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

const cards = [
  {
    image: '/images/feature-gold-dust.png',
    title: 'Gold Dust & Cracked Perfumes',
    copy: 'One of the most defining fragrance notes of Gold Dust is cinnamon.',
    href: '/collections/gold-dust',
  },
  {
    image: '/images/feature-womens.png',
    title: "Women's Fragrances Perfumes",
    copy: "Women's fragrances – 100ml Eau de Parfum, 100ml Aftershave Balm & a Pouch.",
    href: '/collections/womens',
  },
]

export function FeatureCards() {
  return (
    <section className="mx-auto grid max-w-[1440px] gap-4 px-3 pb-28 sm:px-4 md:grid-cols-2 md:gap-6 md:pb-40">
      {cards.map((card) => (
        <motion.article
          key={card.title}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-12% 0px' }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <div className="relative aspect-[1.25/1] overflow-hidden bg-tile">
            <Image
              src={card.image}
              alt={card.title}
              width={1000}
              height={800}
              className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.04] motion-reduce:transition-none motion-reduce:hover:scale-100"
            />
          </div>
          <h2 className="mt-6 font-display text-[clamp(1.35rem,2vw,2rem)] leading-tight">
            {card.title}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-[12px] text-muted">{card.copy}</p>
          <Link href={card.href} className="link-underline mt-4">
            Shop selection
          </Link>
        </motion.article>
      ))}
    </section>
  )
}
