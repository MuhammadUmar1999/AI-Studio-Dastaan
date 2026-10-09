import type { Metadata } from 'next'
import { PageHero } from '@/components/layout/page-hero'
import { DownloadAppClient } from '@/components/app/download-app-client'

export const metadata: Metadata = {
  title: 'Download App | Dastaan',
  description:
    'Download the Dastaan Private Client application for bespoke scent profiling, limited cellar allocations, and effortless replenishment.',
}

export default function DownloadAppPage() {
  return (
    <main>
      <PageHero
        breadcrumbs={[{ label: 'Download App' }]}
        eyebrow="Digital Atelier"
        title="The Dastaan App"
        subtitle="Private client access to bespoke scent profiling, archival releases, and effortless flacon replenishment."
      />
      <DownloadAppClient />
    </main>
  )
}
