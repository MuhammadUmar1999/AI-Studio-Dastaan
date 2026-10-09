import { Hero } from '@/components/home/hero'
import { StatementBlock } from '@/components/home/statement-block'
import { FeatureCards } from '@/components/home/feature-cards'
import { EditorialBanner } from '@/components/home/editorial-banner'
import { PopularPerfumes } from '@/components/home/popular-perfumes'
import { PromoCards } from '@/components/home/promo-cards'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <StatementBlock />
      <FeatureCards />
      <EditorialBanner />
      <PopularPerfumes />
      <PromoCards />
    </main>
  )
} 
