import type { Metadata } from 'next'
import { PageHero } from '@/components/layout/page-hero'
import { FaqClient } from '@/components/faq/faq-client'

export const metadata: Metadata = {
  title: 'FAQ | Dastaan',
  description:
    'Frequently asked questions regarding Dastaan fragrances, shipping, returns, gifting, and payments.',
}

export default function FaqPage() {
  return (
    <main>
      <PageHero
        breadcrumbs={[{ label: 'FAQ' }]}
        eyebrow="Client Care"
        title="Frequently Asked Questions"
        subtitle="Answers to common inquiries regarding our perfumery craft, complimentary shipping, 14-day returns, and signature gifting."
      />
      <FaqClient />
    </main>
  )
}
