'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ShoppingBag, Play, Heart, Bell } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { addItem, toggle } from '@/lib/store'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { formatPrice, type Product } from '@/data/products'
import { getRelated } from '@/lib/catalog'

const notifyEmailSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address.'),
})

const fallbackVolumes = [
  { label: '100 ml', price: 139 },
  { label: '70 ml', price: 99 },
  { label: '50 ml', price: 79 },
]

const fallbackGallery = [
  '/images/ashes-main.png',
  '/images/ashes-blossoms.png',
  '/images/ashes-petals.png',
  '/images/ashes-stem.png',
  '/images/ashes-rose.png',
]

function buildGallery(product: Product): string[] {
  const base = product.images.length > 0 ? product.images : [fallbackGallery[0]]
  if (base.length >= 5) return base
  const extras = fallbackGallery.filter((img) => !base.includes(img))
  return [...base, ...extras].slice(0, 5)
}

function Gallery({ product }: { product: Product }) {
  const gallery = buildGallery(product)
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const previous = () => setActive((index) => (index - 1 + gallery.length) % gallery.length)
  const next = () => setActive((index) => (index + 1) % gallery.length)
  return (
    <div className="flex flex-col gap-1 md:gap-2">
      <button
        type="button"
        className="relative aspect-[4/5] w-full overflow-hidden bg-tile-warm text-left"
        style={{ backgroundColor: product.tileBg }}
        onClick={() => setLightbox(true)}
        aria-label="Open product image"
      >
        <Image
          src={gallery[active]}
          alt={`${product.name} product image`}
          fill
          priority
          loading="eager"
          className="object-cover transition-transform duration-700 hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, 55vw"
        />
      </button>
      <div className="grid grid-cols-2 gap-1 md:gap-2">
        {gallery.slice(1).map((image, index) => (
          <button
            type="button"
            key={`${image}-${index}`}
            className="relative aspect-square overflow-hidden bg-tile-warm"
            onClick={() => {
              setActive(index + 1)
              setLightbox(true)
            }}
            aria-label={`View product image ${index + 2}`}
          >
            <Image
              src={image}
              alt={`${product.name} detail ${index + 2}`}
              fill
              loading="eager"
              className="object-cover transition-transform duration-700 hover:scale-[1.04]"
              sizes="(max-width: 768px) 50vw, 27vw"
            />
          </button>
        ))}
      </div>
      <div className="flex justify-center gap-1.5 pt-2 md:hidden" aria-label="Gallery pagination">
        {gallery.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Go to image ${index + 1}`}
            onClick={() => setActive(index)}
            aria-current={active === index}
            className={`flex size-11 items-center justify-center rounded-full ${active === index ? 'bg-ink/10' : 'bg-transparent'}`}
          >
            <span className={`size-2 rounded-full ${active === index ? 'bg-ink' : 'bg-ink/25'}`} />
          </button>
        ))}
      </div>
      <Dialog open={lightbox} onOpenChange={setLightbox}>
        <DialogContent
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') previous()
            if (event.key === 'ArrowRight') next()
          }}
          className="max-w-3xl border-0 bg-bg p-2"
        >
          <DialogTitle className="sr-only">
            {product.name} image {active + 1} of {gallery.length}
          </DialogTitle>
          <div className="relative aspect-[4/5] w-full">
            <Image
              src={gallery[active]}
              alt={`${product.name} enlarged image ${active + 1} of ${gallery.length}`}
              fill
              className="object-contain"
              sizes="80vw"
            />
            <button
              type="button"
              onClick={previous}
              aria-label="Previous product image"
              className="absolute left-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-ink"
            >
              ←
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next product image"
              className="absolute right-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-ink"
            >
              →
            </button>
            <p className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/80 px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-ink">
              {active + 1} / {gallery.length}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Details({ product }: { product: Product }) {
  const router = useRouter()
  const volumes = product.volumes.length > 0 ? product.volumes : fallbackVolumes
  const [volume, setVolume] = useState(volumes[0])
  const [qty] = useState(1)
  const [notifyOpen, setNotifyOpen] = useState(false)
  const [notifyEmail, setNotifyEmail] = useState('')
  const [notifyError, setNotifyError] = useState('')
  const dispatch = useAppDispatch()
  const wishlist = useAppSelector((state) => state.wishlist.ids)
  const isWishlisted = wishlist.includes(product.id)

  const addToBag = () => {
    if (!product.inStock) return
    const item = {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: volume.price,
      volumeLabel: volume.label,
      qty,
      image: product.images[0],
    }
    dispatch(addItem(item))
    try {
      const stored = JSON.parse(localStorage.getItem('dastaan-cart') || '{"items":[]}')
      const items = Array.isArray(stored.items) ? stored.items : []
      const existing = items.find(
        (entry: typeof item) =>
          entry.productId === item.productId && entry.volumeLabel === item.volumeLabel
      )
      if (existing) existing.qty += item.qty
      else items.push(item)
      localStorage.setItem('dastaan-cart', JSON.stringify({ items }))
    } catch {
      localStorage.setItem('dastaan-cart', JSON.stringify({ items: [item] }))
    }
    window.dispatchEvent(new CustomEvent('dastaan:open-cart'))
    toast.success(`${product.name} added to your bag.`)
  }

  const toggleWishlist = () => {
    dispatch(toggle(product.id))
    toast.success(
      isWishlisted
        ? `${product.name} removed from wishlist.`
        : `${product.name} saved to wishlist.`
    )
  }

  const handleNotifySubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const parsed = notifyEmailSchema.safeParse({ email: notifyEmail })
    if (!parsed.success) {
      setNotifyError(parsed.error.issues[0]?.message ?? 'Please enter a valid email address.')
      return
    }
    setNotifyError('')
    setNotifyOpen(false)
    setNotifyEmail('')
    toast.success(`We will notify ${parsed.data.email} when ${product.name} returns.`)
  }

  return (
    <div className="md:sticky md:top-24 md:self-start">
      <div className="flex items-center gap-3">
        <p className="label-caps text-ink/55">Perfume</p>
        {!product.inStock && (
          <span className="label-caps border border-hairline bg-cream px-2 py-0.5 text-[10px] text-ink">
            Sold out
          </span>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-4">
        <h1 className="font-heading text-3xl font-normal leading-none md:text-[28px]">
          {product.name}
        </h1>
        <button
          type="button"
          onClick={toggleWishlist}
          aria-pressed={isWishlisted}
          aria-label={
            isWishlisted
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          className="inline-flex size-9 shrink-0 items-center justify-center border border-hairline text-ink transition-colors hover:border-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          <Heart
            className={`size-4 ${isWishlisted ? 'fill-ink' : ''}`}
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </button>
      </div>
      <p className="mt-3 font-sans text-sm font-semibold">{formatPrice(volume.price)}</p>
      <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink/65">
        {product.description[0] ??
          'Step into the world of Dastaan, where each bottle unveils a tale of bold elegance and understated strength designed for those who command presence without a word.'}
      </p>
      <div className="mt-7 border-t border-hairline pt-5">
        <p className="label-caps text-ink/55">Volume:</p>
        <div className="mt-3 flex gap-5 text-sm">
          {volumes.map((item) => (
            <button
              type="button"
              key={item.label}
              onClick={() => setVolume(item)}
              aria-pressed={volume.label === item.label}
              className={`min-h-11 px-1 ${volume.label === item.label ? 'underline underline-offset-4' : 'text-ink/50'}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-2">
        {product.inStock ? (
          <>
            <Button
              onClick={addToBag}
              className="h-12 rounded-none bg-ink text-[11px] uppercase tracking-[0.14em] text-white hover:bg-ink/90"
            >
              <ShoppingBag data-icon="inline-start" /> Add to bag
            </Button>
            <Button
              onClick={() => {
                addToBag()
                router.push('/checkout')
              }}
              variant="outline"
              className="h-12 rounded-none border-hairline bg-transparent text-[11px] uppercase tracking-[0.14em] hover:bg-ink hover:text-white"
            >
              Buy now
            </Button>
          </>
        ) : (
          <Button
            onClick={() => setNotifyOpen(true)}
            className="h-12 rounded-none bg-ink text-[11px] uppercase tracking-[0.14em] text-white hover:bg-ink/90"
          >
            <Bell data-icon="inline-start" /> Notify me when available
          </Button>
        )}
      </div>
      <Accordion className="mt-8 border-t border-hairline">
        <AccordionItem value="characteristics">
          <AccordionTrigger className="py-4 text-[10px] uppercase tracking-[0.13em]">
            Characteristics
          </AccordionTrigger>
          <AccordionContent>
            <dl className="flex flex-col gap-2 pb-3 text-xs">
              <div className="flex justify-between">
                <dt className="text-ink/55">Brand</dt>
                <dd>{product.characteristics.brand}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/55">Collection</dt>
                <dd>{product.characteristics.collection}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/55">Scent family</dt>
                <dd className="capitalize">{product.scentFamily}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/55">Item no</dt>
                <dd>{product.characteristics.itemNo}</dd>
              </div>
            </dl>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="description">
          <AccordionTrigger className="py-4 text-[10px] uppercase tracking-[0.13em]">
            Description &amp; Notes
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-3 pb-3 text-xs leading-relaxed text-ink/65">
              {product.description.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
              <div className="mt-1 border-t border-hairline pt-2 text-[11px]">
                <p>
                  <strong className="font-medium text-ink">Top:</strong>{' '}
                  {product.notes.top.join(', ')}
                </p>
                <p className="mt-1">
                  <strong className="font-medium text-ink">Heart:</strong>{' '}
                  {product.notes.heart.join(', ')}
                </p>
                <p className="mt-1">
                  <strong className="font-medium text-ink">Base:</strong>{' '}
                  {product.notes.base.join(', ')}
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="delivery">
          <AccordionTrigger className="py-4 text-[10px] uppercase tracking-[0.13em]">
            Payment &amp; delivery
          </AccordionTrigger>
          <AccordionContent>
            <p className="pb-3 text-xs text-ink/65">
              Complimentary delivery on all orders. Ships within 2–4 business days.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="returns">
          <AccordionTrigger className="py-4 text-[10px] uppercase tracking-[0.13em]">
            Returns
          </AccordionTrigger>
          <AccordionContent>
            <p className="pb-3 text-xs text-ink/65">Returns accepted within 14 days of delivery.</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-hairline bg-bg/95 px-4 py-3 backdrop-blur md:hidden">
        <span className="text-sm font-semibold">{formatPrice(volume.price)}</span>
        {product.inStock ? (
          <Button
            onClick={addToBag}
            className="h-11 flex-1 rounded-none bg-ink text-[10px] uppercase tracking-[0.14em] text-white"
          >
            Add to bag
          </Button>
        ) : (
          <Button
            onClick={() => setNotifyOpen(true)}
            className="h-11 flex-1 rounded-none bg-ink text-[10px] uppercase tracking-[0.14em] text-white"
          >
            Notify me
          </Button>
        )}
      </div>

      <Dialog open={notifyOpen} onOpenChange={setNotifyOpen}>
        <DialogContent className="max-w-md rounded-none border border-hairline bg-bg p-6">
          <DialogTitle className="font-heading text-2xl font-normal text-ink">
            Back in Stock Concierge
          </DialogTitle>
          <DialogDescription className="text-xs leading-relaxed text-ink/65">
            Enter your email address to receive a private notification as soon as{' '}
            <span className="font-medium text-ink">{product.name}</span> returns from maceration.
          </DialogDescription>
          <form onSubmit={handleNotifySubmit} className="mt-4 flex flex-col gap-3" noValidate>
            <label htmlFor="notify-email" className="sr-only">
              Email address
            </label>
            <input
              id="notify-email"
              type="email"
              value={notifyEmail}
              onChange={(e) => {
                setNotifyEmail(e.target.value)
                if (notifyError) setNotifyError('')
              }}
              placeholder="Enter your email address..."
              className="h-11 border border-hairline bg-bg px-3 text-xs text-ink placeholder:text-muted focus-visible:border-ink focus-visible:outline-none"
            />
            {notifyError && (
              <p className="text-xs text-red-700" role="alert">
                {notifyError}
              </p>
            )}
            <Button
              type="submit"
              className="h-11 rounded-none bg-ink text-[11px] uppercase tracking-[0.14em] text-white hover:bg-ink/90"
            >
              Notify me
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export function ProductDetails({ product }: { product: Product }) {
  const related = getRelated(product, 3)
  const [videoOpen, setVideoOpen] = useState(false)
  return (
    <>
      <main className="mx-auto max-w-[1440px] px-3 pb-20 pt-6 sm:px-4 md:pt-10">
        <section
          id="acquire"
          className="scroll-mt-20 grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] md:gap-16 lg:gap-24"
        >
          <Gallery product={product} />
          <Details product={product} />
        </section>
      <section className="mx-auto max-w-xl py-24 text-center md:py-36"><h2 className="font-heading text-3xl font-normal">A bold burst of rich, fruity essence.</h2><p className="mx-auto mt-4 max-w-sm text-xs leading-relaxed text-ink/55">At the heart of this elegant body perfume is the essence of Parfs Parfum. A luminous jasmine infused with radiant fruity notes, softly embraced by warm, woody undertones.</p></section>
      <div className="relative aspect-[16/7] overflow-hidden bg-tile-petal"><Image src="/images/ashes-petals.png" alt="Ashes of Moonlight surrounded by warm petals" fill className="object-cover" sizes="100vw" /></div>
      <section className="grid items-center gap-8 py-20 md:grid-cols-[2fr_1fr] md:gap-14 md:py-28"><div className="relative aspect-[4/3] overflow-hidden bg-tile-stem"><Image src="/images/ashes-stem.png" alt="Ashes of Moonlight with a delicate flower" fill className="object-cover" sizes="65vw" /></div><div className="max-w-sm"><h2 className="font-heading text-3xl font-normal leading-tight">Enhances the luxurious trail of Dastaan Parfum.</h2><p className="mt-5 text-sm leading-relaxed text-ink/60">Indulge in a delicate floral ritual with Parfs. Lightly misted onto your hair, it releases the luminous scent of the perfume with every graceful movement.</p><Link href="#acquire" className="link-underline mt-7">Acquire</Link></div></section>
      <section className="text-center"><h2 className="font-heading text-3xl font-normal">Echo Your Love</h2><p className="mx-auto mt-3 max-w-sm text-xs leading-relaxed text-ink/55">Radiates confidence and sensuality, capturing the bold, romantic spirit of the new Dastaan perfume.</p><button type="button" className="group relative mt-8 block aspect-[16/8] w-full overflow-hidden text-left" onClick={() => setVideoOpen(true)} aria-label="Play Echo Your Love film"><Image src="/images/ashes-rose.png" alt="Coral rose in perfume liquid" fill className="object-cover transition-transform duration-700 group-hover:scale-[1.02]" sizes="100vw" /><span className="absolute bottom-4 right-4 flex size-10 items-center justify-center rounded-full bg-white/65 text-ink backdrop-blur-sm"><Play className="ml-0.5 size-4 fill-current" /></span></button></section>
      <Dialog open={videoOpen} onOpenChange={setVideoOpen}><DialogContent className="max-w-4xl border-0 bg-black p-0"><DialogTitle className="sr-only">Echo Your Love campaign still</DialogTitle><div className="relative aspect-video"><Image src="/images/ashes-rose.png" alt="Echo Your Love campaign still" fill className="object-cover" sizes="90vw" /></div></DialogContent></Dialog>
      <section className="py-24 md:py-36"><h2 className="text-center font-heading text-3xl font-normal">You may also like</h2><div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">{related.map((item) => <Link href={`/product/${item.slug}`} key={item.slug} className="group text-center"><div className="relative aspect-square overflow-hidden" style={{ backgroundColor: item.tileBg }}><Image src={item.images[0]} alt={item.name} fill className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" sizes="33vw" /></div><h3 className="mt-4 font-heading text-xl">{item.name}</h3><p className="mt-1 text-xs text-ink/60">{formatPrice(item.price)}</p></Link>)}</div></section>
    </main>
  </>
  )
}
