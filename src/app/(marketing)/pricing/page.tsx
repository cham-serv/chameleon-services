import type { Metadata } from 'next';
import Link from 'next/link';
import { PricingCards } from '@/components/marketing/PricingToggle';

export const metadata: Metadata = {
  title: 'Pricing — Simple, Transparent Plans',
  description:
    'Chameleon pricing for South African businesses. Starter, Growth, and Agency plans. No hidden fees, no lock-in.',
};

const tiers = [
  {
    name: 'Starter',
    monthlyPrice: 1199,
    annualPrice: 959,
    description: 'Everything you need to launch a professional AI-ready website for one business.',
    features: [
      '1 store / website',
      'All standard templates',
      'AI-powered content structure',
      'GEO & SEO optimised',
      'Ecommerce (up to 100 products)',
      'Contact forms',
      'Custom domain',
      'Email support',
    ],
    cta: 'Get Started',
    ctaHref: '/contact',
    highlighted: false,
  },
  {
    name: 'Growth',
    monthlyPrice: 3499,
    annualPrice: 2799,
    description: 'For growing businesses managing multiple brands or locations.',
    features: [
      'Up to 5 stores / websites',
      'All templates (including new releases)',
      'AI-powered content structure',
      'GEO & SEO optimised',
      'Unlimited products per store',
      'Priority support',
      'Custom domains per store',
      'Advanced analytics',
      'Early access to new features',
    ],
    cta: 'Get Started',
    ctaHref: '/contact',
    highlighted: true,
  },
  {
    name: 'Agency',
    monthlyPrice: null,
    annualPrice: null,
    description: 'For agencies and resellers who want to build and manage client sites at scale.',
    features: [
      'Unlimited stores / websites',
      'White-label branding option',
      'All templates',
      'Client management dashboard',
      'Revenue share programme',
      'Dedicated account manager',
      'SLA-backed support',
      'Custom template development (on request)',
      'Priority feature requests',
    ],
    cta: 'Talk to us',
    ctaHref: '/agencies',
    highlighted: false,
  },
];

const faqs = [
  {
    q: 'Is there a free trial?',
    a: "We offer a personalised demo instead of a self-serve trial, so we can show you exactly how Chameleon fits your business. Reach out via the contact page to get started.",
  },
  {
    q: 'Can I switch plans?',
    a: 'Yes — you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major South African payment methods including credit/debit cards, EFT, and PayFast.',
  },
  {
    q: 'Do I need technical knowledge to use Chameleon?',
    a: "Not at all. The admin panel is built for business owners, not developers. If you can use email, you can manage your Chameleon site.",
  },
  {
    q: 'What happens to my site if I cancel?',
    a: 'Your site remains accessible until the end of your billing period. We provide a full data export so you can migrate elsewhere if you choose.',
  },
];

export default function PricingPage() {
  return (
    <>
      {/* Header */}
      <section
        style={{
          paddingTop: '120px',
          paddingBottom: '64px',
          textAlign: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(59,130,246,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div className="m-container" style={{ position: 'relative' }}>
          <span className="m-label">Pricing</span>
          <div className="m-divider" style={{ margin: '16px auto' }} />
          <h1
            style={{
              fontFamily: 'var(--m-font-display)',
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--m-text)',
              margin: '0 0 16px',
            }}
          >
            Simple, transparent pricing.
          </h1>
          <p
            style={{
              fontSize: '1rem',
              color: 'var(--m-text-muted)',
              maxWidth: '480px',
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            Three tiers to match where your business is today.
            No hidden fees. No lock-in. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="m-section">
        <div className="m-container">
          <PricingCards tiers={tiers} />
        </div>
      </section>

      {/* FAQ */}
      <section
        className="m-section"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="m-container-sm">
          <h2
            style={{
              fontFamily: 'var(--m-font-display)',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--m-text)',
              margin: '0 0 40px',
              textAlign: 'center',
            }}
          >
            Frequently asked questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {faqs.map((faq) => (
              <div
                key={faq.q}
                style={{
                  padding: '24px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.02)',
                }}
              >
                <h3 style={{ fontWeight: 600, color: 'var(--m-text)', margin: '0 0 8px', fontSize: '0.95rem' }}>
                  {faq.q}
                </h3>
                <p style={{ color: 'var(--m-text-muted)', margin: 0, fontSize: '0.875rem', lineHeight: 1.6 }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
