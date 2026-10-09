import type { Metadata } from 'next'
import { LegalLayout, type LegalSection } from '@/components/legal/legal-layout'
import { CookiePreferences } from '@/components/legal/cookie-preferences'

export const metadata: Metadata = {
  title: 'Cookies Policy | Dastaan',
  description:
    'Learn how Dastaan uses cookies and local storage to personalize your boutique experience, and manage your preferences.',
}

const cookieSections: readonly LegalSection[] = [
  {
    id: 'what-are-cookies',
    title: '1. What Are Cookies & Local Storage?',
    paragraphs: [
      'Cookies are small text files placed on your device when you visit a website. Alongside modern browser localStorage, they allow our digital flagship to remember your actions—such as items placed in your shopping bag or fragrances saved to your wishlist—across page loads.',
    ],
  },
  {
    id: 'essential-storage',
    title: '2. Strictly Necessary Storage',
    paragraphs: [
      'Essential cookies and localStorage keys are required for the core operation of the Dastaan boutique. Without them, features such as your persistent shopping bag, wishlist count, and checkout session cannot function.',
      'Because these keys are strictly necessary to deliver the service you request, they remain active at all times.',
    ],
  },
  {
    id: 'storage-keys',
    title: '3. Dastaan Boutique Storage Keys',
    paragraphs: [
      'Our application stores specific client-side keys in your browser: “dastaan-cart” (your shopping bag items and quantities), “dastaan-wishlist” (your saved product IDs), “dastaan-recent-searches” (up to 5 recent search queries), and “dastaan-cookie-prefs” (your consent configuration).',
      'For newsletter subscriptions, an HTTP-only cookie named “dastaan-newsletter” is set to prevent duplicate enrollment.',
    ],
  },
  {
    id: 'analytics-cookies',
    title: '4. Atelier Performance & Analytics',
    paragraphs: [
      'When enabled, analytics storage helps us understand which collections, olfactory notes, and journal essays resonate with visitors, as well as diagnose page load speeds across mobile and desktop devices.',
      'All analytics metrics are aggregated and never identify individual patrons.',
    ],
  },
  {
    id: 'marketing-cookies',
    title: '5. Personalized Invitations & Marketing',
    paragraphs: [
      'Marketing preferences allow us to tailor campaign previews, scent-profile recommendations, and private coffret invitations to your demonstrated olfactory interests.',
    ],
  },
  {
    id: 'third-party',
    title: '6. Third-Party Embeds & Services',
    paragraphs: [
      'Our digital flagship minimizes external scripts. Fonts are self-hosted via Next.js font optimization, and campaign films are served directly from our atelier assets without third-party ad trackers.',
    ],
  },
  {
    id: 'browser-controls',
    title: '7. Managing Storage in Your Browser',
    paragraphs: [
      'In addition to the interactive preference panel on this page, most web browsers allow you to clear site data or block cookies entirely through their privacy settings. Please note that clearing site storage will empty your current Dastaan shopping bag and wishlist.',
    ],
  },
  {
    id: 'updates',
    title: '8. Policy Updates',
    paragraphs: [
      'We may update this Cookies Policy periodically to reflect enhancements to our boutique experience or changes in international privacy regulations. The “Last updated” date at the top of this page indicates the latest revision.',
    ],
  },
  {
    id: 'contact',
    title: '9. Questions & Concierge Assistance',
    paragraphs: [
      'If you have questions regarding our use of cookies or local storage, please reach out to privacy@dastaan.com or visit our Client Concierge page.',
    ],
  },
] as const

export default function CookiesPage() {
  return (
    <LegalLayout
      breadcrumbs={[{ label: 'Cookies Policy' }]}
      title="Cookies Policy"
      lastUpdated="October 1, 2025"
      subtitle="Details on essential storage, fragrance preferences, and analytics used across our digital flagship."
      sections={cookieSections}
    >
      <CookiePreferences />
    </LegalLayout>
  )
}
