'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from '@/components/ui/carousel'

const promos = [
  {
    image: '/images/promo-sweet.png',
    title: 'Top 10 best Sweet Perfume',
    href: '/collections/best-sweet',
  },
  {
    image: '/images/promo-top-selling.png',
    title: "Women's 2025 Top Selling Perfume",
    href: '/collections/womens-top-selling',
  },
  {
    image: '/images/hero-3.png',
    title: 'Warm Amber & Resin Editions',
    href: '/collections/amber',
  },
  {
    image: '/images/hero-2.png',
    title: 'Luminous Body Perfume Rituals',
    href: '/collections/body-perfume',
  },
]

function PromoNavButtons() {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel()

  return (
    <>
      <button
        type="button"
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        aria-label="Previous editorial promos"
        className="absolute left-0 top-[38%] z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-hairline bg-white text-ink transition-opacity disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        <ChevronLeft className="size-4" />
      </button>
      <button
        type="button"
        onClick={scrollNext}
        disabled={!canScrollNext}
        aria-label="Next editorial promos"
        className="absolute right-0 top-[38%] z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-ink text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        <ChevronRight className="size-4" />
      </button>
    </>
  )
}

export function PromoCards() {
  return (
    <section className="relative mx-auto max-w-[1440px] px-3 pb-28 sm:px-4 md:pb-40">
      <Carousel opts={{ align: 'start', loop: false }} className="w-full">
        <CarouselContent className="-ml-4">
          {promos.map((promo) => (
            <CarouselItem key={promo.title} className="basis-full pl-4 md:basis-1/2">
              <motion.article
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                className="text-center"
              >
                <div className="overflow-hidden">
                  <Image
                    src={promo.image}
                    alt={promo.title}
                    width={1200}
                    height={900}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.04]"
                  />
                </div>
                <h2 className="mt-5 font-display text-xl">{promo.title}</h2>
                <Link href={promo.href} className="link-underline mt-3">
                  Discover more
                </Link>
              </motion.article>
            </CarouselItem>
          ))}
        </CarouselContent>
        <PromoNavButtons />
      </Carousel>
    </section>
  )
}
