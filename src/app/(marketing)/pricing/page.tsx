import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pricing  Flexible Plans for Businesses & Agencies',
  description:
    'Chameleon pricing for South African businesses. Feature-based tiers for direct clients  flat monthly scaling for agency partners. No hidden fees.',
};

const businessTiers = [
  {
    name: 'Launch',
    monthlyFlexible: 999,
    monthlyAllInclusive: 1500,
    setupFee: 8000,
    description: 'Perfect for simple sites. No ecommerce, limited pages  standard GEO.',
    features: [
      'Standard GEO structure',
      'Contact forms',
      'Basic pages',
      'Custom domain',
      'Email support',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Grow',
    monthlyFlexible: 2500,
    monthlyAllInclusive: 3000,
    setupFee: 10000,
    description: 'For service businesses needing content pages, articles, FAQs  contact forms.',
    features: [
      'Standard GEO structure',
      'Articles & FAQs',
      'Service/content pages',
      'Custom domain',
      'Priority email support',
    ],
    cta: 'Get Started',
    highlighted: true,
  },
  {
    name: 'Commerce',
    monthlyFlexible: 3500,
    monthlyAllInclusive: 4500,
    setupFee: 12000,
    description: 'Full ecommerce, product intelligence, AI schema  advanced GEO.',
    features: [
      'Advanced GEO & AI schema',
      'Full ecommerce',
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
    features: [
      'Agency Dashboard',
      'Multi-tenant management',
    ],
  },
  {
    name: 'Silver',
    clients: '3-9 client sites',
    monthly: 4500,
    features: [
      'Agency Dashboard',
      'Multi-tenant management',
      'Priority support',
    ],
  },
  {
    name: 'Gold',
    clients: '10+ client sites (unlimited)',
    monthly: 6000,
    features: [
      'Agency Dashboard',
      'Multi-tenant management',
      'Dedicated account manager',
      'Early feature access',
    ],
  },
];

const faqs = [
  {
    q: 'Do my clients pay Chameleon directly?',
    a: "Yes. The client pays the platform fee to Chameleon  your agency fee to you. Two separate, transparent relationships.",
  },
  {
    q: 'What does the setup fee include?',
    a: 'It covers CMS configuration, template customisation, domain setup, initial content structure  onboarding.',
  },
  {
    q: 'What is the difference between Flexible Start and All-Inclusive?',
    a: 'Flexible Start requires a setup fee (R8,000 for Launch, R10,000 for Grow, R12,000 for Commerce) and has a lower monthly cost (month-to-month after 3 months). All-Inclusive has NO setup fee, a higher monthly cost  requires a 24-month commitment.',
  },
  {
    q: 'What happens if a client leaves our agency?',
    a: "Their site stays on Chameleon. Your dashboard tier automatically adjusts at the next billing cycle if your client count drops.",
  },
  {
    q: 'Is there a free trial?',
    a: "We offer a personalised demo instead of a self-serve trial. Reach out via the contact page to get started.",
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
            Direct features for businesses  flat monthly scaling for agencies.
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
                marginBottom: '16px'
              }}
            >
              Track 1: For Businesses
            </h2>
            <p style={{ color: 'var(--m-text-muted)', maxWidth: '600px', margin: '0 auto 24px' }}>
              Select your feature tier  then choose how you want to pay.
            </p>
            
            <div style={{ 
              display: 'inline-flex', 
              background: 'rgba(255,255,255,0.05)', 
              borderRadius: '8px', 
              padding: '16px',
              border: '1px solid rgba(255,255,255,0.1)',
              textAlign: 'left',
              gap: '24px',
              maxWidth: '800px'
            }}>
              <div style={{ flex: 1 }}>
                <strong style={{ display: 'block', color: 'white', marginBottom: '8px' }}>Flexible Start</strong>
                <p style={{ fontSize: '0.875rem', color: 'var(--m-text-muted)', margin: 0, lineHeight: 1.5 }}>
                  Pay a setup fee (from R8,000) for a lower monthly cost. Month-to-month after a 3-month minimum.
                </p>
              </div>
              <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
              <div style={{ flex: 1 }}>
                <strong style={{ display: 'block', color: 'white', marginBottom: '8px' }}>All-Inclusive</strong>
                <p style={{ fontSize: '0.875rem', color: 'var(--m-text-muted)', margin: 0, lineHeight: 1.5 }}>
                  No setup fee. Higher monthly cost with a <strong>24-month commitment</strong>. Protects your cash flow.
                </p>
              </div>
            </div>
          </div>

          <div className="m-grid-3">
            {businessTiers.map((tier) => (
              <div
                key={tier.name}
                className={`m-card ${tier.highlighted ? 'm-card-highlighted' : ''}`}
                style={{
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                }}
              >
                {tier.highlighted && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '4px 12px',
                      borderRadius: '999px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Most Popular
                  </div>
                )}
                
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--m-text)', margin: '0 0 12px' }}>
                  {tier.name}
                </h3>
                
                <p style={{ fontSize: '0.9rem', color: 'var(--m-text-muted)', margin: '0 0 24px', lineHeight: 1.6, minHeight: '60px' }}>
                  {tier.description}
                </p>

                <div style={{ marginBottom: '16px', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--m-text-muted)', marginBottom: '4px' }}>
                    Flexible Start
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--m-text)' }}>
                      R{tier.monthlyFlexible}
                    </span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--m-text-muted)' }}>/mo</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--m-text-faint)' }}>
                    + R{tier.setupFee.toLocaleString()} setup fee
                  </div>
                </div>

                <div style={{ marginBottom: '32px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--m-text-muted)', marginBottom: '4px' }}>
                    All-Inclusive (24mo)
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--m-text)' }}>
                      R{tier.monthlyAllInclusive}
                    </span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--m-text-muted)' }}>/mo</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#10b981' }}>
                    R0 setup fee
                  </div>
                </div>
                
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', flexGrow: 1 }}>
                  {tier.features.map((f) => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                      <Check size={16} style={{ color: tier.highlighted ? '#60a5fa' : 'var(--m-text-muted)', marginTop: '2px' }} />
                      <span style={{ fontSize: '0.9rem', color: 'var(--m-text-muted)', lineHeight: 1.5 }}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <Link
                  href="/contact"
                  className={`m-btn ${tier.highlighted ? 'm-btn-primary' : 'm-btn-ghost'}`}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
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
                marginBottom: '16px'
              }}
            >
              Track 2: For Agencies
            </h2>
            <p style={{ color: 'var(--m-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              One flat monthly fee for your Agency Dashboard. Scaled by client count, capped at 10+.
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
                    R{tier.monthly}
                  </span>
                  <span style={{ fontSize: '1rem', color: 'var(--m-text-muted)' }}>/mo flat</span>
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
