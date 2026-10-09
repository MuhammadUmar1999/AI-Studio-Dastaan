import type { Metadata } from 'next'
import { LegalLayout, type LegalSection } from '@/components/legal/legal-layout'

export const metadata: Metadata = {
  title: 'Terms & Conditions | Dastaan',
  description:
    'Terms and conditions governing purchases, intellectual property, and client privileges at the House of Dastaan.',
}

const termsSections: readonly LegalSection[] = [
  {
    id: 'introduction',
    title: '1. Introduction & Acceptance',
    paragraphs: [
      'Welcome to the digital flagship of the House of Dastaan (“Dastaan,” “we,” “us,” or “our”). These Terms & Conditions govern your access to and use of our website, mobile experiences, and online boutique services.',
      'By browsing our catalog, creating a private client profile, or placing an order, you acknowledge that you have read, understood, and agreed to be bound by these Terms.',
    ],
  },
  {
    id: 'eligibility',
    title: '2. Client Eligibility & Account Security',
    paragraphs: [
      'To place an order with Dastaan, you must be at least eighteen (18) years of age or the age of majority in your jurisdiction and possess a valid payment method issued by a recognized financial institution.',
      'You are responsible for maintaining the confidentiality of your Dastaan account credentials and for all activities that occur under your profile.',
    ],
  },
  {
    id: 'products-availability',
    title: '3. Fragrances & Small-Batch Availability',
    paragraphs: [
      'Because Dastaan perfumes are compounded with natural botanical extracts and macerated for six to eight weeks in small batches, availability is strictly limited. All descriptions, olfactory notes, and bottle capacities are presented as accurately as possible.',
      'Natural variations in the golden or amber hue of our fragrances occur from harvest to harvest and do not constitute a defect. We reserve the right to limit quantities of any creation per household.',
    ],
  },
  {
    id: 'pricing-payment',
    title: '4. Pricing, Currency & Payment',
    paragraphs: [
      'All prices displayed in the boutique are quoted in United States Dollars (USD) unless otherwise indicated and exclude applicable state or local sales taxes, which are calculated at checkout.',
      'We accept major credit cards, Apple Pay, and Dastaan gift certificates. By submitting payment details, you warrant that you are authorized to use the designated instrument.',
    ],
  },
  {
    id: 'shipping-hazmat',
    title: '5. Dispatch & Regulated Perfumery Transport',
    paragraphs: [
      'Fine fragrances contain alcohol and are classified as Class 3 Dangerous Goods under international aviation and ground transport regulations. Orders are shipped exclusively via certified couriers.',
      'Risk of loss and title for ordered items pass to you upon confirmed delivery to the shipping address specified at checkout.',
    ],
  },
  {
    id: 'returns-exchanges',
    title: '6. 14-Day Return Privilege',
    paragraphs: [
      'Every full-size Dastaan flacon is accompanied by a complimentary 2 ml sample vial. Clients may experience the sample vial before unsealing the main presentation box.',
      'Unopened, cello-sealed full-size boxes may be returned within 14 calendar days of delivery for a full refund in accordance with our Shipping & Returns policy.',
    ],
  },
  {
    id: 'intellectual-property',
    title: '7. Intellectual Property & Trademarks',
    paragraphs: [
      'All content featured on this site—including the DASTAAN wordmark, flacon designs, campaign films, photography, editorial essays, and typography—is the exclusive property of the House of Dastaan and protected by international copyright and trademark laws.',
      'No portion of the boutique may be reproduced, distributed, or exploited for commercial purposes without prior written consent from our atelier.',
    ],
  },
  {
    id: 'limitation-liability',
    title: '8. Limitation of Liability',
    paragraphs: [
      'Dastaan fragrances are formulated for external cosmetic use only. Complete ingredient disclosures (INCI) are printed on every outer carton. Clients with known botanical sensitivities should test the complimentary sample vial on a small patch of skin prior to regular wear.',
      'To the fullest extent permitted by law, Dastaan shall not be liable for indirect, incidental, or consequential damages arising from the use of our products or digital services.',
    ],
  },
  {
    id: 'governing-law',
    title: '9. Governing Law & Concierge Contact',
    paragraphs: [
      'These Terms & Conditions shall be governed by and construed in accordance with the laws of the State of New York, without regard to conflict-of-law principles.',
      'For questions regarding these Terms, please contact our Client Concierge at concierge@dastaan.com or write to 114 Mercer Street, New York, NY 10012.',
    ],
  },
] as const

export default function TermsPage() {
  return (
    <LegalLayout
      breadcrumbs={[{ label: 'Terms and Conditions' }]}
      title="Terms & Conditions"
      lastUpdated="October 1, 2025"
      subtitle="The terms governing online purchases, intellectual property, and private client privileges at the House of Dastaan."
      sections={termsSections}
    />
  )
}
