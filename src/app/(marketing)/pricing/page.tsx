'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

type PaymentPath = 'flexible' | 'spread' | 'allInclusive';

const businessTiers = [
  {
    name: 'Launch',
    monthlyFlexible: 999,
    monthlyAllInclusive: 1699,
    setupFee: 8000,
    description: 'Perfect for simple sites. No ecommerce, limited pages, and site-level GEO.',
    features: [
      'Site-level GEO structure',
      'Contact forms',
      'Basic static pages',
      'Custom domain',
      'Email support',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Professional',
    monthlyFlexible: 1999,
    monthlyAllInclusive: 2999,
    setupFee: 10000,
    description: 'For clinics, law firms, and consultants needing page-level entity structure.',
    features: [
      'Page-level GEO structure',
      'Articles & FAQs',
      'Service/practitioner pages',
      'Custom domain',
      'Priority email support',
    ],
    cta: 'Get Started',
    highlighted: true,
  },
  {
    name: 'Storefront',
    monthlyFlexible: 2999,
    monthlyAllInclusive: 4199,
    setupFee: 12000,
    description: 'For boutique retailers and makers. Up to 50 products with page-level GEO.',
    features: [
      'Page-level GEO structure',
      'Limited ecommerce (max 50)',
      'Cart & checkout',
      'Payment gateways',
      'Priority SLA support',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Commerce',
    monthlyFlexible: 4500,
    monthlyAllInclusive: 5750,
    setupFee: 15000,
    description: 'Full ecommerce, deep product intelligence, and unlimited SKUs.',
    features: [
      'Deep entity AI schema',
      'Full ecommerce capabilities',
      'Product intelligence',
      'Unlimited products',
      'Priority SLA support',
    ],
    cta: 'Talk to us',
    highlighted: false,
  },
];

const agencyTiers = [
  {
    name: 'Bronze',
    clients: '1-2 client sites',
    monthly: 2500,
    features: ['Agency Dashboard', 'Multi-tenant management'],
  },
  {
    name: 'Silver',
    clients: '3-9 client sites',
    monthly: 4500,
    features: ['Agency Dashboard', 'Multi-tenant management', 'Priority support'],
  },
  {
    name: 'Gold',
    clients: '10+ clients (Professional+)',
    monthly: 'Free',
    features: [
      'Agency Dashboard (R0/mo)',
      'Multi-tenant management',
      'Dedicated account manager',
      'Early feature access',
    ],
  },
];

const faqs = [
  {
    q: 'Do my clients pay Chameleon directly?',
    a: "Yes. The client pays the platform fee to Chameleon, and your agency fee to you. Two separate, transparent relationships.",
  },
  {
    q: 'What does the setup fee include?',
    a: 'It covers CMS configuration, template customisation, domain setup, initial content structure, and onboarding.',
  },
  {
    q: 'What is the difference between the three payment paths?',
    a: 'Flexible Start requires an upfront setup fee but gives you a lower monthly cost (month-to-month after 3 months). Spread Start splits the setup fee over your first 6 months. All-Inclusive has NO setup fee, requires a 12-month commitment, and has a slightly higher monthly cost to protect your cash flow.',
  },
  {
    q: 'What happens if a client leaves our agency?',
    a: "Their site stays on Chameleon. Your dashboard tier automatically adjusts at the next billing cycle if your qualifying client count drops.",
  },
  {
    q: 'How do clients count towards the Gold Agency tier?',
    a: "To unlock the free Gold tier dashboard, you need 10 or more clients on the Professional tier (R1,999/mo) or higher. Launch clients can still be managed in your dashboard, but do not count toward the Gold threshold.",
  },
];

const paymentPaths: { id: PaymentPath; label: string; sublabel: string }[] = [
  { id: 'flexible', label: 'Flexible Start', sublabel: 'Setup fee + low monthly' },
  { id: 'spread', label: 'Spread Start', sublabel: 'Setup split over 6 months' },
  { id: 'allInclusive', label: 'All-Inclusive', sublabel: 'No setup fee · 12 months' },
];

function getPrice(tier: typeof businessTiers[0], path: PaymentPath) {
  if (path === 'flexible') return tier.monthlyFlexible;
  if (path === 'spread') return Math.round(tier.monthlyFlexible + tier.setupFee / 6);
  return tier.monthlyAllInclusive;
}

function getPriceNote(tier: typeof businessTiers[0], path: PaymentPath) {
  if (path === 'flexible') return `+ R${tier.setupFee.toLocaleString()} setup fee`;
  if (path === 'spread') return `for 6 mo, then R${tier.monthlyFlexible.toLocaleString()}/mo`;
  return 'R0 setup fee · 12-month commitment';
}

export default function PricingPage() {
  const [activePath, setActivePath] = useState<PaymentPath>('flexible');

  return (
    <>
      {/* Header */}
      <section
        className="m-hero-pt"
        style={{
          paddingBottom: '64px',
          textAlign: 'center',
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
            Choose the track that fits your business model.
            Direct features for businesses, or flat monthly scaling for agencies.
          </p>
        </div>
      </section>

      {/* Track 1: For Businesses */}
      <section className="m-section" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '64px' }}>
        <div className="m-container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2
              style={{
                fontFamily: 'var(--m-font-display)',
                fontSize: '2rem',
                fontWeight: 700,
                color: 'var(--m-text)',
                marginBottom: '8px',
              }}
            >
              Track 1: For Businesses
            </h2>
            <p style={{ color: 'var(--m-text-muted)', maxWidth: '500px', margin: '0 auto 32px' }}>
              Select your feature tier, then choose how you want to pay.
            </p>

            {/* Payment Path Toggle */}
            <div className="m-pricing-toggle">
              {paymentPaths.map((path) => {
                const isActive = activePath === path.id;
                return (
                  <button
                    key={path.id}
                    onClick={() => setActivePath(path.id)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      background: isActive
                        ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                        : 'transparent',
                      color: isActive ? 'white' : 'var(--m-text-muted)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '2px',
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{path.label}</span>
                    <span style={{ fontSize: '0.72rem', opacity: 0.75 }}>{path.sublabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="m-grid-4">
            {businessTiers.map((tier) => {
              const price = getPrice(tier, activePath);
              const note = getPriceNote(tier, activePath);
              return (
                <div
                  key={tier.name}
                  className={`m-card ${tier.highlighted ? 'm-card-highlighted' : ''}`}
                  style={{
                    padding: '28px',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  {tier.highlighted && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'linear-gradient(90deg, #3b82f6, #2563eb)',
                        borderRadius: '8px 8px 0 0',
                      }}
                    />
                  )}

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--m-text)', margin: '0 0 10px' }}>
                    {tier.name}
                  </h3>

                  <p style={{ fontSize: '0.85rem', color: 'var(--m-text-muted)', margin: '0 0 24px', lineHeight: 1.6, minHeight: '56px' }}>
                    {tier.description}
                  </p>

                  {/* Single price block — changes based on toggle */}
                  <div
                    style={{
                      marginBottom: '24px',
                      padding: '16px',
                      background: tier.highlighted ? 'rgba(59,130,246,0.08)' : 'rgba(0,0,0,0.2)',
                      borderRadius: '10px',
                      border: tier.highlighted ? '1px solid rgba(59,130,246,0.25)' : '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '6px' }}>
                      <span
                        style={{
                          fontSize: '2rem',
                          fontWeight: 700,
                          color: 'var(--m-text)',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        R{price.toLocaleString()}
                      </span>
                      <span style={{ fontSize: '0.9rem', color: 'var(--m-text-muted)' }}>/mo</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: activePath === 'allInclusive' ? '#10b981' : 'var(--m-text-faint)' }}>
                      {note}
                    </div>
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', flexGrow: 1 }}>
                    {tier.features.map((f) => (
                      <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                        <Check
                          size={14}
                          style={{ color: tier.highlighted ? '#60a5fa' : 'var(--m-text-muted)', marginTop: '3px', flexShrink: 0 }}
                        />
                        <span style={{ fontSize: '0.85rem', color: 'var(--m-text-muted)', lineHeight: 1.5 }}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/contact"
                    className={`m-btn ${tier.highlighted ? 'm-btn-primary' : 'm-btn-ghost'}`}
                    style={{ width: '100%', justifyContent: 'center', fontSize: '0.9rem' }}
                  >
                    {tier.cta}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Track 2: For Agencies */}
      <section className="m-section" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'linear-gradient(180deg, rgba(255,255,255,0.01) 0%, transparent 100%)' }}>
        <div className="m-container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="m-label">Agencies</span>
            <div className="m-divider" style={{ margin: '16px auto' }} />
            <h2
              style={{
                fontFamily: 'var(--m-font-display)',
                fontSize: '2rem',
                fontWeight: 700,
                color: 'var(--m-text)',
                marginBottom: '16px',
              }}
            >
              Track 2: For Agencies
            </h2>
            <p style={{ color: 'var(--m-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              One flat monthly fee for your Agency Dashboard. Scaled by client count, and free at scale.
            </p>
          </div>

          <div className="m-grid-3">
            {agencyTiers.map((tier) => (
              <div
                key={tier.name}
                className="m-card"
                style={{
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  borderTop: '2px solid rgba(59,130,246,0.3)',
                }}
              >
                <div style={{ color: '#60a5fa', fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px' }}>
                  {tier.clients}
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--m-text)', margin: '0 0 16px' }}>
                  {tier.name}
                </h3>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '24px' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 700, color: 'white' }}>
                    {typeof tier.monthly === 'number' ? `R${tier.monthly.toLocaleString()}` : tier.monthly}
                  </span>
                  {typeof tier.monthly === 'number' && (
                    <span style={{ fontSize: '1rem', color: 'var(--m-text-muted)' }}>/mo flat</span>
                  )}
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', flexGrow: 1 }}>
                  {tier.features.map((f) => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                      <Check size={16} style={{ color: 'var(--m-text-muted)', marginTop: '2px' }} />
                      <span style={{ fontSize: '0.9rem', color: 'var(--m-text-muted)', lineHeight: 1.5 }}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link href="/agencies" className="m-btn m-btn-primary">
              Learn about the Agency model
              <ArrowRight size={16} style={{ marginLeft: '8px' }} />
            </Link>
          </div>
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
