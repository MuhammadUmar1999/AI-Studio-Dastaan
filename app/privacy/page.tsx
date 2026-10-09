import type { Metadata } from 'next'
import { LegalLayout, type LegalSection } from '@/components/legal/legal-layout'

export const metadata: Metadata = {
  title: 'Privacy Policy | Dastaan',
  description:
    'How the House of Dastaan collects, safeguards, and respects your personal information.',
}

const privacySections: readonly LegalSection[] = [
  {
    id: 'commitment',
    title: '1. Our Commitment to Discretion',
    paragraphs: [
      'At the House of Dastaan, we regard privacy as an essential pillar of luxury hospitality. This Privacy Policy explains what information we collect when you visit our digital flagship, consult with our fragrance specialists, or place an order.',
      'We never sell, rent, or trade your personal data to third-party data brokers.',
    ],
  },
  {
    id: 'information-collected',
    title: '2. Information We Collect',
    paragraphs: [
      'When you interact with Dastaan, we may collect personal details you voluntarily provide, including your full name, billing and shipping addresses, email address, telephone number, and olfactory preferences shared during scent profiling.',
      'We also collect technical session data—such as browser type, device resolution, and pages visited—to ensure optimal performance across mobile and desktop viewports.',
    ],
  },
  {
    id: 'use-of-information',
    title: '3. How We Use Your Information',
    paragraphs: [
      'Your personal information is used to fulfill and dispatch your fragrance orders, send transactional updates, manage your private client profile, and respond to inquiries submitted to our Client Concierge.',
      'Where you have opted into our newsletter or private invitations, we may send dispatches regarding new small-batch releases, journal essays, and salon events.',
    ],
  },
  {
    id: 'payment-security',
    title: '4. Payment Processing & Encryption',
    paragraphs: [
      'All checkout transactions are encrypted using Transport Layer Security (TLS 1.3) and processed by PCI-DSS Level 1 compliant payment partners. Dastaan does not store raw credit card numbers or security codes on its servers.',
    ],
  },
  {
    id: 'cookies-local-storage',
    title: '5. Cookies & Browser Storage',
    paragraphs: [
      'We utilize essential browser storage (including localStorage) to preserve your shopping bag, wishlist, recent search history, and cookie consent choices across sessions.',
      'You may inspect or modify your non-essential analytics and marketing preferences at any time via our dedicated Cookies Policy page.',
    ],
  },
  {
    id: 'data-sharing',
    title: '6. Trusted Service Partners',
    paragraphs: [
      'We share only the minimum necessary details with vetted partners who assist in operating our boutique—specifically regulated dangerous-goods couriers (such as DHL and UPS) and payment processors.',
      'All service partners are contractually bound to safeguard your information and use it solely for the performance of their designated services.',
    ],
  },
  {
    id: 'data-retention',
    title: '7. Data Retention',
    paragraphs: [
      'We retain order records for the period required by applicable tax, accounting, and consumer protection laws. Client account profiles and saved addresses remain active until you request deletion.',
    ],
  },
  {
    id: 'client-rights',
    title: '8. Your Privacy Rights (GDPR & CCPA)',
    paragraphs: [
      'Depending on your jurisdiction, you have the right to request access to the personal data we hold about you, request correction of inaccuracies, request erasure of your record, or withdraw consent for marketing communications.',
      'Every Dastaan email includes a one-click unsubscribe link in the footer.',
    ],
  },
  {
    id: 'privacy-contact',
    title: '9. Contact Our Privacy Officer',
    paragraphs: [
      'To exercise your privacy rights or inquire about our data practices, please contact our Data Protection & Client Care team at privacy@dastaan.com or write to House of Dastaan, 114 Mercer Street, New York, NY 10012.',
    ],
  },
] as const

export default function PrivacyPage() {
  return (
    <LegalLayout
      breadcrumbs={[{ label: 'Privacy Policy' }]}
      title="Privacy Policy"
      lastUpdated="October 1, 2025"
      subtitle="Our commitment to discretion, cryptographic security, and transparency in handling private client information."
      sections={privacySections}
    />
  )
}
