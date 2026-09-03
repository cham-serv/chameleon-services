import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Search, TrendingUp, Clock, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Why Chameleon - The Real Cost of Your Website',
  description:
    'See what the average business actually spends on their website each month, and how Chameleon consolidates those costs into one predictable fee.',
};

const whyNowPoints = [
  {
    icon: Search,
    stat: '40%',
    label: 'of searches now return AI-generated answers',
    desc: "If AI can't read your site, nearly half your potential customers will find a competitor instead.",
  },
  {
    icon: TrendingUp,
    stat: '62%',
    label: 'of users trust AI answers over organic results',
    desc: "The goal isn't just to rank on Google anymore. It's to be the answer AI gives.",
  },
  {
    icon: Clock,
    stat: '18 months',
    label: 'behind - the average legacy CMS platform',
    desc: "While you're paying to maintain WordPress, your competitors are already showing up in AI answers.",
  },
  {
    icon: Globe,
    stat: 'R0',
    label: 'in additional ad spend required',
    desc: "This isn't paid advertising. It's earned visibility - built into the way your site is structured.",
  },
];

const billKillerItems = [
  ['Web hosting (shared/VPS): R600–R1,500/mo', '✅ Included'],
  ['WordPress maintenance & updates: R800–R2,500/mo', '✅ Included'],
  ['Plugin subscriptions (Yoast, WooCommerce, etc.): R400–R1,200/mo', '✅ Included'],
  ['SSL Certificate renewal: R200–R600/yr', '✅ Included'],
  ['Developer call-out fees (when things break): R1,500–R5,000/incident', '✅ Included'],
  ['SEO agency retainer to "fix" your site: R5,000–R15,000/mo', '✅ Built in from day one'],
];

const revenuePoints = [
  {
    title: 'AI search is where your next customer is looking.',
    desc: "40% of searches now return AI-generated answers instead of a list of blue links. If your business isn't structured for AI to understand and cite, you're invisible to that 40%.",
  },
  {
    title: 'Fast sites sell more.',
    desc: 'Chameleon pages load in under a second - built on the same technology that powers Fortune 500 online stores. Every second of delay costs 7% in conversions.',
  },
  {
    title: 'Your product data works 24/7.',
    desc: 'Every product listing is structured so that when someone asks ChatGPT "where can I buy this in South Africa?" - Chameleon-powered sites are built to be part of the answer.',
  },
  {
    title: 'No maintenance window, no downtime.',
    desc: "You're not losing sales because your plugin broke at 2am and someone has to call a developer in the morning.",
  },
  {
    title: 'Your store keeps improving.',
    desc: "Platform updates - including new AI features - are deployed to your site automatically. You don't pay for upgrades. You don't need to re-platform every 3 years.",
  },
];

export default function WhyChameleonPage() {
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
            width: '700px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(59,130,246,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div className="m-container" style={{ position: 'relative' }}>
          <span className="m-label">The Case for Chameleon</span>
          <div className="m-divider" style={{ margin: '16px auto' }} />
          <h1
            style={{
              fontFamily: 'var(--m-font-display)',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--m-text)',
              margin: '0 0 20px',
            }}
          >
            What is your website{' '}
            <span className="m-gradient-text">actually costing you?</span>
          </h1>
          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--m-text-muted)',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            Most businesses are paying for a website they built years ago,
            maintaining it with a patchwork of subscriptions and retainers, 
            and losing ground to AI search every single month.
          </p>
        </div>
      </section>

      {/* Bill Killer */}
      <section className="m-section" id="bill-killer" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="m-container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 48px' }}>
            <h2 style={{ fontFamily: 'var(--m-font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--m-text)', margin: '0 0 16px' }}>
              Stop paying for problems Chameleon doesn&apos;t have.
            </h2>
          </div>

          {/* Bill killer: desktop table + mobile stacked cards */}
          <div className="m-bill-table-wrap">
            {/* Desktop table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th style={{ padding: '20px 24px', fontSize: '0.9rem', color: 'var(--m-text-muted)', fontWeight: 600 }}>
                    What you&apos;re paying for now
                  </th>
                  <th style={{ padding: '20px 24px', fontSize: '0.9rem', color: 'var(--m-text)', fontWeight: 600, width: '160px' }}>
                    With Chameleon
                  </th>
                </tr>
              </thead>
              <tbody>
                {billKillerItems.map(([cost, chameleon]) => (
                  <tr key={cost} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '16px 24px', color: 'var(--m-text-muted)', fontSize: '0.9rem' }}>{cost}</td>
                    <td style={{ padding: '16px 24px', color: '#10b981', fontWeight: 600, fontSize: '0.85rem' }}>{chameleon}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <td style={{ padding: '20px 24px', color: 'var(--m-text)', fontWeight: 700, fontSize: '1rem' }}>
                    Typical monthly total: R8,000–R25,000+
                  </td>
                  <td style={{ padding: '20px 24px', color: '#60a5fa', fontWeight: 700, fontSize: '1.1rem' }}>
                    Chameleon: from R999/mo
                  </td>
                </tr>
              </tfoot>
            </table>

            {/* Mobile stacked cards */}
            <div className="m-bill-cards">
              {billKillerItems.map(([cost, chameleon]) => (
                <div key={cost} className="m-bill-card">
                  <div className="m-bill-card-label">{cost}</div>
                  <div className="m-bill-card-value">{chameleon}</div>
                </div>
              ))}
              <div className="m-bill-card m-bill-card-total">
                <div className="m-bill-card-label">Typical monthly total: R8,000–R25,000+</div>
                <div className="m-bill-card-value">Chameleon: from R999/mo</div>
              </div>
            </div>
          </div>

          <p style={{ textAlign: 'center', color: 'var(--m-text-muted)', fontSize: '0.9rem', maxWidth: '600px', margin: '0 auto' }}>
            The average South African SME spends between R8,000 and R20,000 per month across IT support, web maintenance and SEO retainers - for a website that still doesn&apos;t get found by AI search. Chameleon consolidates all of that into one predictable monthly fee.
          </p>
        </div>
      </section>

      {/* Setup Cost Comparison */}
      <section className="m-section" id="setup-costs" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="m-container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 64px' }}>
            <h2 style={{ fontFamily: 'var(--m-font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--m-text)', margin: '0 0 16px' }}>
              Thinking of building a new website?
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--m-text-muted)', lineHeight: 1.7, margin: 0 }}>
              Traditional web builds are expensive, slow and hard to update. We replaced the 3-month agency build with a fast, predictable setup.
            </p>
          </div>

          {/* Setup cost table: horizontal scroll on mobile (complex two-column layout) */}
          <div className="m-table-scroll">
            <table style={{ borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th style={{ padding: '24px', fontSize: '0.95rem', color: 'var(--m-text-muted)', fontWeight: 600, width: '50%', borderRight: '1px solid rgba(255,255,255,0.04)' }}>The Traditional Agency Build</th>
                  <th style={{ padding: '24px', fontSize: '0.95rem', color: 'var(--m-text)', fontWeight: 600, width: '50%' }}>The Chameleon Setup</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '0.95rem' }}>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '24px', borderRight: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ color: 'var(--m-text)', fontWeight: 600, marginBottom: '4px' }}>High-Performance Custom Build</div>
                    <div style={{ color: '#ef4444', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>R40,000 - R80,000</div>
                    <div style={{ color: 'var(--m-text-faint)', fontSize: '0.85rem' }}>Bespoke UI, fast loading, SEO architecture</div>
                  </td>
                  <td style={{ padding: '24px' }}>
                    <div style={{ color: '#60a5fa', fontWeight: 600, marginBottom: '4px' }}>Launch Tier</div>
                    <div style={{ color: 'var(--m-text)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>R8,000 setup <span style={{ fontSize: '0.9rem', color: 'var(--m-text-muted)', fontWeight: 400 }}>(then R999/mo)</span></div>
                    <div style={{ color: 'var(--m-text-faint)', fontSize: '0.85rem' }}>AI-ready template, domain setup, onboarding</div>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '24px', borderRight: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ color: 'var(--m-text)', fontWeight: 600, marginBottom: '4px' }}>Advanced Next-Gen E-commerce</div>
                    <div style={{ color: '#ef4444', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>R85,000 - R250,000+</div>
                    <div style={{ color: 'var(--m-text-faint)', fontSize: '0.85rem' }}>Multi-channel sync, payment gateways, automation</div>
                  </td>
                  <td style={{ padding: '24px' }}>
                    <div style={{ color: '#60a5fa', fontWeight: 600, marginBottom: '4px' }}>Commerce Tier</div>
                    <div style={{ color: 'var(--m-text)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>R15,000 setup <span style={{ fontSize: '0.9rem', color: 'var(--m-text-muted)', fontWeight: 400 }}>(then R4,500/mo)</span></div>
                    <div style={{ color: 'var(--m-text-faint)', fontSize: '0.85rem' }}>Full ecommerce config, product intelligence</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px', borderRadius: '12px', background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '1.5rem', marginTop: '-2px' }}>🔒</div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--m-text)', margin: '0 0 8px' }}>You own your core business data.</h3>
              <p style={{ margin: 0, color: 'var(--m-text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Your original products, customer lists and content belong entirely to you and can be exported at any time. The proprietary AI schemas, GEO architecture and engine-generated optimisations are platform features that work tirelessly to power your site for as long as you&apos;re with us.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Now - AI Stats */}
      <section className="m-section" id="why-now" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="m-container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 64px' }}>
            <span className="m-label">Why this matters now</span>
            <div className="m-divider" style={{ margin: '16px auto' }} />
            <h2
              style={{
                fontFamily: 'var(--m-font-display)',
                fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'var(--m-text)',
                margin: '0 0 16px',
              }}
            >
              Legacy platforms{' '}
              <span className="m-gradient-text">can&apos;t keep up.</span>
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--m-text-muted)', lineHeight: 1.7, margin: 0 }}>
              AI-powered search has fundamentally changed how customers find businesses.
              Shopify, Wix and WordPress weren&apos;t designed for this. Updating them for GEO
              is expensive, slow and often impossible without breaking everything else.
              Chameleon was built for this moment.
            </p>
          </div>

          <div className="m-grid-2" style={{ gap: '16px' }}>
            {whyNowPoints.map((point) => (
              <div
                key={point.stat}
                style={{
                  display: 'flex',
                  gap: '20px',
                  padding: '24px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.06)',
                  background: 'rgba(255,255,255,0.02)',
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    width: '48px',
                    height: '48px',
                    borderRadius: '10px',
                    background: 'rgba(59,130,246,0.08)',
                    border: '1px solid rgba(59,130,246,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#60a5fa',
                  }}
                >
                  <point.icon size={22} />
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--m-font-display)',
                      fontSize: '1.6rem',
                      fontWeight: 700,
                      color: '#60a5fa',
                      lineHeight: 1.1,
                      marginBottom: '4px',
                    }}
                  >
                    {point.stat}
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--m-text)', marginBottom: '4px' }}>
                    {point.label}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--m-text-muted)', lineHeight: 1.5 }}>
                    {point.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue Connection */}
      <section className="m-section" id="revenue" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="m-container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 64px' }}>
            <h2 style={{ fontFamily: 'var(--m-font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--m-text)', margin: '0 0 16px' }}>
              More reach. Lower cost. More sales.
            </h2>
          </div>

          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {revenuePoints.map((point, i) => (
                <div key={i} style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(59,130,246,0.1)', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700, fontSize: '0.9rem' }}>
                    {i + 1}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--m-text)', margin: '0 0 8px', lineHeight: 1.4 }}>{point.title}</h3>
                    <p style={{ margin: 0, color: 'var(--m-text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>{point.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="m-section" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div
          className="m-container-sm m-cta-callout"
          style={{
            textAlign: 'center',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(129,140,248,0.06) 100%)',
            border: '1px solid rgba(59,130,246,0.2)',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--m-font-display)',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 700,
              color: 'var(--m-text)',
              margin: '0 0 16px',
            }}
          >
            Ready to make the switch?
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--m-text-muted)', maxWidth: '420px', margin: '0 auto 28px', lineHeight: 1.7 }}>
            See our plans or get in touch to talk through which tier fits your business.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/pricing" className="m-btn m-btn-primary m-btn-lg">
              See pricing
              <ArrowRight size={18} />
            </Link>
            <Link href="/contact" className="m-btn m-btn-ghost m-btn-lg">
              Talk to us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
