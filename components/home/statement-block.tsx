'use client'

import Image from 'next/image'
import { MotionConfig, motion, type Variants } from 'framer-motion'
import { Play } from 'lucide-react'

type Token =
  | { type: 'word'; text: string }
  | { type: 'pill' | 'arch' | 'rect' }

const lines: Token[][] = [
  [
    { type: 'word', text: 'Where' },
    { type: 'word', text: 'every' },
    { type: 'pill' },
    { type: 'word', text: 'drop' },
    { type: 'word', text: 'is' },
    { type: 'word', text: 'a' },
  ],
  [
    { type: 'word', text: 'Portal' },
    { type: 'arch' },
    { type: 'word', text: 'to' },
    { type: 'word', text: 'a' },
    { type: 'word', text: 'hidden' },
    { type: 'rect' },
    { type: 'word', text: 'world' },
  ],
]

const STEP_S = 0.09

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * STEP_S },
  }),
}

const chipBase = 'relative mx-[0.1em] inline-block h-[0.8em] overflow-hidden align-baseline'

function Chip({ type }: { type: 'pill' | 'arch' | 'rect' }) {
  if (type === 'pill') {
    return (
      <span className={`${chipBase} w-[2.2em] rounded-full bg-tile`}>
        <Image
          src="/images/chip-pill.png"
          alt=""
          fill
          sizes="200px"
          className="object-cover"
        />
        <span className="absolute left-1/2 top-1/2 flex size-[0.3em] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-sm">
          <Play className="size-[0.14em] translate-x-[0.01em] fill-ink text-ink" aria-hidden="true" />
        </span>
      </span>
    )
  }
  if (type === 'arch') {
    return (
      <span className={`${chipBase} w-[0.7em] bg-hero-blue`} style={{ borderRadius: '999px 999px 0 0' }}>
        <Image src="/images/chip-arch.png" alt="" fill sizes="100px" className="object-cover" />
      </span>
    )
  }
  return (
    <span className={`${chipBase} w-[0.7em] rounded-[0.08em] bg-tile`}>
      <Image src="/images/chip-bottle.png" alt="" fill sizes="100px" className="object-cover" />
    </span>
  )
}

export function StatementBlock() {
  let counter = 0

  return (
    <MotionConfig reducedMotion="user">
      <section className="mx-auto max-w-[1440px] px-3 py-20 sm:px-4 md:py-32 lg:py-40">
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '0px 0px -15% 0px' }}
          className="text-balance text-center font-display text-[clamp(2.5rem,6vw,5.5rem)] uppercase leading-[1.08] text-ink"
        >
          {lines.map((line, lineIndex) => (
            <span key={lineIndex} className="block">
              {line.map((token, tokenIndex) => {
                const index = counter++
                return (
                  <motion.span
                    key={tokenIndex}
                    custom={index}
                    variants={itemVariants}
                    className="inline-block"
                  >
                    {token.type === 'word' ? (
                      <span className="mx-[0.12em]">{token.text}</span>
                    ) : (
                      <Chip type={token.type} />
                    )}
                  </motion.span>
                )
              })}
            </span>
          ))}
        </motion.h2>
      </section>
    </MotionConfig>
  )
}
