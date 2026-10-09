'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'

export function EditorialBanner() {
  const [videoOpen, setVideoOpen] = useState(false)

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="group relative h-[min(72vw,680px)] min-h-[440px] overflow-hidden"
      >
        <Image
          src="/images/hero-2.png"
          alt="Woman surrounded by blossom branches and pale green fabric"
          fill
          sizes="100vw"
          className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />
        <div className="absolute inset-x-0 bottom-12 text-center text-white">
          <h2 className="font-display text-2xl">Body Perfume</h2>
          <p className="mt-2 text-[11px]">
            Indulge in sophistication with our curated luxury fragrance collection.
          </p>
          <Link
            href="/collections/body-perfume"
            className="mt-4 inline-block text-[10px] uppercase tracking-[.16em] underline underline-offset-4 transition-opacity hover:opacity-75 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Explore now
          </Link>
        </div>
        <button
          type="button"
          onClick={() => setVideoOpen(true)}
          aria-label="Play body perfume film"
          className="absolute bottom-5 right-5 flex size-8 items-center justify-center rounded-full border border-white/50 bg-black/10 text-white transition-colors hover:bg-black/30 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <Play className="size-3 fill-current" aria-hidden="true" />
        </button>
      </motion.section>

      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent
          showCloseButton={true}
          className="max-w-4xl rounded-none border-0 bg-ink p-0 text-white sm:max-w-4xl"
        >
          <DialogTitle className="sr-only">Body Perfume Campaign Film</DialogTitle>
          <DialogDescription className="sr-only">
            A Whisper of Blossom and Silk — Dastaan Body Perfume campaign preview.
          </DialogDescription>
          <div className="relative aspect-video w-full overflow-hidden bg-black">
            <Image
              src="/images/hero-2.png"
              alt="Body Perfume campaign film poster"
              fill
              className="object-cover opacity-85"
              sizes="90vw"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 p-6 text-center">
              <span className="flex size-14 items-center justify-center rounded-full border border-white/60 bg-white/15 backdrop-blur-xs">
                <Play className="ml-0.5 size-5 fill-white text-white" aria-hidden="true" />
              </span>
              <p className="label-caps mt-4 text-white/80">Campaign Film · 01:42</p>
              <p className="mt-2 font-heading text-2xl font-normal text-white md:text-3xl">
                A Whisper of Blossom and Silk
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
