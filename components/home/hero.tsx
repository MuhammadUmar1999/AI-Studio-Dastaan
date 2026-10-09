'use client'

import { useCallback, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MotionConfig, motion } from 'framer-motion'
import { heroSlides } from '@/data/hero-slides'
import { cn } from '@/lib/utils'

const SLIDE_DURATION_S = 6
const EASE = [0.22, 1, 0.36, 1] as const

export function Hero() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => {
    setActive((current) => (current + 1) % heroSlides.length)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <section aria-roledescription="carousel" aria-label="Featured collections" aria-live={paused ? 'polite' : 'off'} className="mx-auto max-w-[1440px] px-3 pt-3 sm:px-4 sm:pt-4">
        <div
          className="relative aspect-[3/4] w-full overflow-hidden sm:aspect-[4/3] md:aspect-[2.1/1] motion-reduce:transition-none"
          style={{ backgroundColor: heroSlides[active].background }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          {heroSlides.map((slide, index) => {
            const isActive = index === active
            return (
              <div
                key={slide.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${heroSlides.length}`}
                aria-hidden={!isActive}
                className={cn(
                  'absolute inset-0 transition-opacity duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
                  isActive ? 'opacity-100' : 'pointer-events-none opacity-0',
                )}
                style={{ backgroundColor: slide.background }}
              >
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  loading="eager"
                  sizes="(min-width: 1440px) 1408px, 100vw"
                  className="object-cover"
                  style={{ objectPosition: slide.objectPosition }}
                />

                <div className="absolute inset-0 bg-gradient-to-r from-white/35 via-transparent to-transparent" aria-hidden="true" />
                <div className="absolute inset-0 flex flex-col items-start justify-start px-6 pt-10 sm:px-10 sm:pt-14 md:px-14 md:pt-[7%] lg:px-[5%]">
                  <motion.h1
                    key={isActive ? `active-${slide.id}` : slide.id}
                    initial={isActive ? { opacity: 0, y: 24 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: EASE }}
                    className="font-display text-[44px] uppercase leading-[1.02] text-ink sm:text-6xl md:text-7xl lg:text-[88px] xl:text-[96px]"
                  >
                    {slide.lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </motion.h1>
                  <Link
                    href={slide.cta.href}
                    tabIndex={isActive ? 0 : -1}
                    className="link-underline mt-5 text-ink md:mt-8"
                  >
                    {slide.cta.label}
                  </Link>
                </div>
              </div>
            )
          })}

          <div className="absolute bottom-5 left-6 flex items-center gap-2 sm:left-10 md:bottom-8 md:left-14 lg:left-[5%]">
            {heroSlides.map((slide, index) => {
              const isActive = index === active
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={isActive}
                  className={cn(
                    'relative flex size-11 items-center justify-center transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
                    isActive ? 'w-14' : 'w-11',
                  )}
                >
                  <span className="relative block h-px w-full bg-ink/30">
                    {isActive && (
                      <span
                        key={`progress-${active}`}
                        className="hero-progress absolute inset-y-0 left-0 block h-[2px] w-full origin-left -translate-y-px bg-ink"
                        style={{
                          animationDuration: `${SLIDE_DURATION_S}s`,
                          animationPlayState: paused ? 'paused' : 'running',
                        }}
                        onAnimationEnd={next}
                      />
                    )}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </section>
    </MotionConfig>
  )
}
