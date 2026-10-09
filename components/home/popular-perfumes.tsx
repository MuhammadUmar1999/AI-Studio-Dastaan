'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { toggle } from '@/lib/store'
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
  type CarouselApi,
} from '@/components/ui/carousel'
import { categories, formatPrice, products, type ProductCategory } from '@/data/products'

function Pager({ category }: { category: ProductCategory }) {
  const { api, scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel()
  const [current, setCurrent] = useState(1)
  const [total, setTotal] = useState(1)

  useEffect(() => {
    if (!api) return
    const update = (emblaApi: NonNullable<CarouselApi>) => {
      setTotal(Math.max(1, emblaApi.scrollSnapList().length))
      setCurrent(emblaApi.selectedScrollSnap() + 1)
    }
    update(api)
    api.on('select', update)
    api.on('reInit', update)
    return () => {
      api.off('select', update)
      api.off('reInit', update)
    }
  }, [api])

  useEffect(() => {
    if (!api) return
    api.scrollTo(0)
    api.reInit()
    setTotal(Math.max(1, api.scrollSnapList().length))
    setCurrent(api.selectedScrollSnap() + 1)
  }, [api, category])

  return (
    <div className="mt-9 flex items-center justify-center gap-3 text-[11px] text-muted">
      <button
        type="button"
        aria-label="Previous perfumes"
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        className="p-2 transition-opacity disabled:opacity-30 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        <ChevronLeft className="size-3" />
      </button>
      <span aria-live="polite" className="tabular-nums">
        {current} / {total}
      </span>
      <button
        type="button"
        aria-label="Next perfumes"
        disabled={!canScrollNext}
        onClick={scrollNext}
        className="p-2 transition-opacity disabled:opacity-30 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        <ChevronRight className="size-3" />
      </button>
    </div>
  )
}

export function PopularPerfumes() {
  const [category, setCategory] = useState<ProductCategory>('all')
  const dispatch = useAppDispatch()
  const wishlist = useAppSelector((state) => state.wishlist.ids)
  const visible = useMemo(
    () => (category === 'all' ? products : products.filter((p) => p.category === category)),
    [category]
  )

  return (
    <section id="popular" className="mx-auto max-w-[1440px] px-3 py-28 sm:px-4 md:py-40">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.7 }}
        className="text-center"
      >
        <h2 className="font-display text-[clamp(2.25rem,4vw,3.2rem)]">Most Popular Perfumes</h2>
        <Tabs
          value={category}
          onValueChange={(value) => setCategory(value as ProductCategory)}
          className="mt-8"
        >
          <TabsList className="mx-auto h-auto flex-wrap justify-center gap-5 bg-transparent p-0">
            <TabsTrigger
              value="all"
              className="h-auto rounded-none bg-transparent px-0 pb-2 text-[10px] uppercase tracking-[.13em] text-muted data-[state=active]:border-b data-[state=active]:border-ink data-[state=active]:text-ink"
            >
              All perfumes
            </TabsTrigger>
            {categories.slice(1).map((item) => (
              <TabsTrigger
                key={item.value}
                value={item.value}
                className="h-auto rounded-none bg-transparent px-0 pb-2 text-[10px] uppercase tracking-[.13em] text-muted data-[state=active]:border-b data-[state=active]:border-ink data-[state=active]:text-ink"
              >
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </motion.div>
      <Carousel opts={{ align: 'start', loop: false }} className="mt-10 w-full">
        <CarouselContent className="-ml-3 md:-ml-4">
          {visible.map((product) => (
            <CarouselItem
              key={product.id}
              className="basis-1/2 pl-3 sm:basis-1/3 md:basis-1/4 md:pl-4"
            >
              <motion.article
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35 }}
              >
                <Link href={`/product/${product.slug}`} className="group block">
                  <div
                    className="relative aspect-square overflow-hidden"
                    style={{ backgroundColor: product.tileBg }}
                  >
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                    />
                    <button
                      type="button"
                      aria-label={`${wishlist.includes(product.id) ? 'Remove' : 'Add'} ${product.name} ${wishlist.includes(product.id) ? 'from' : 'to'} wishlist`}
                      onClick={(event) => {
                        event.preventDefault()
                        dispatch(toggle(product.id))
                      }}
                      className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-white/80 opacity-0 transition-opacity group-hover:opacity-100 max-md:opacity-100"
                    >
                      <Heart
                        className={`size-3.5 ${wishlist.includes(product.id) ? 'fill-ink' : ''}`}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                  <h3 className="mt-4 text-center font-display text-lg leading-tight">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-center text-[11px] text-muted">
                    {formatPrice(product.price)}
                  </p>
                </Link>
              </motion.article>
            </CarouselItem>
          ))}
        </CarouselContent>
        <Pager category={category} />
      </Carousel>
      <div className="mt-8 text-center">
        <Link
          href={category === 'all' ? '/shop' : `/shop?category=${category}`}
          className="link-underline"
        >
          View all {category === 'all' ? 'perfumes' : categories.find((c) => c.value === category)?.label.toLowerCase()}
        </Link>
      </div>
    </section>
  )
}
