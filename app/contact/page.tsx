import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/layout/page-hero'
import { ContactForm } from '@/components/contact/contact-form'

export const metadata: Metadata = {
  title: 'Contact Us | Dastaan',
  description:
    'Connect with the Dastaan Client Concierge for bespoke fragrance consultations, order assistance, and salon appointments.',
}

export default function ContactPage() {
  return (
    <main>
      <PageHero
        breadcrumbs={[{ label: 'Contact Us' }]}
        eyebrow="Client Concierge"
        title="Connect with the Atelier"
        subtitle="Our fragrance specialists are available Monday through Saturday to assist with scent profiling, order inquiries, and private gifting."
      />

      <section className="mx-auto max-w-[1440px] px-3 pb-24 sm:px-4 md:pb-32">
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-[1.15fr_0.85fr] md:gap-16">
          {/* Contact Form Column */}
          <div>
            <h2 className="font-heading text-2xl font-normal text-ink md:text-3xl">
              Send an Inquiry
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-ink/60">
              Complete the form below and a specialist will respond within one business day.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          {/* Side Column: Hours, Contact Info, Boutiques & Quick Links */}
          <aside className="flex flex-col gap-8 border-t border-hairline pt-8 md:border-l md:border-t-0 md:pl-12 md:pt-0">
            <div>
              <p className="label-caps text-ink/55">Direct Concierge</p>
              <dl className="mt-3 flex flex-col gap-2 text-xs">
                <div className="flex justify-between gap-4">
                  <dt className="text-ink/55">Email</dt>
                  <dd className="font-medium text-ink">concierge@dastaan.com</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink/55">Telephone</dt>
                  <dd className="font-medium text-ink">+1 (212) 555-0194</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink/55">Press</dt>
                  <dd className="font-medium text-ink">press@dastaan.com</dd>
                </div>
              </dl>
            </div>

            <div className="border-t border-hairline pt-6">
              <p className="label-caps text-ink/55">Client Care Hours</p>
              <p className="mt-3 text-xs leading-relaxed text-ink/70">
                Monday – Friday: 9:00 AM – 7:00 PM EST
                <br />
                Saturday: 10:00 AM – 5:00 PM EST
                <br />
                Sunday: Closed
              </p>
            </div>

            <div className="border-t border-hairline pt-6">
              <p className="label-caps text-ink/55">Flagship Salons</p>
              <div className="mt-3 space-y-4 text-xs leading-relaxed text-ink/70">
                <div>
                  <p className="font-medium text-ink">New York · SoHo</p>
                  <p>114 Mercer Street, New York, NY 10012</p>
                </div>
                <div>
                  <p className="font-medium text-ink">Paris · Le Marais</p>
                  <p>28 Rue des Francs-Bourgeois, 75003 Paris</p>
                </div>
                <div>
                  <p className="font-medium text-ink">Dubai · DIFC</p>
                  <p>Gate Village Building 4, Pavilion Level</p>
                </div>
              </div>
            </div>

            <div className="border-t border-hairline pt-6">
              <p className="label-caps text-ink/55">Client Resources</p>
              <div className="mt-4 flex flex-col items-start gap-3">
                <Link href="/faq" className="link-underline">
                  Frequently asked questions
                </Link>
                <Link href="/shipping-returns" className="link-underline">
                  Shipping &amp; 14-day returns
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}
