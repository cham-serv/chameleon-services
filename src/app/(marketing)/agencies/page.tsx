import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Settings, BarChart3, Database, Workflow, ShieldCheck, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Agency Programme  The Chameleon Partner Model',
  description:
    'Chameleon for agencies. You own the retainer, we own the infrastructure. Build and manage AI-ready websites for your clients at scale.',
};

const agencyBenefits = [
  {
    icon: Database,
    title: 'You own the retainer. We own the infrastructure.',
    desc: 'If a client fires your agency, their site stays on Chameleon. You keep your relationship and your retainer, but their infrastructure is our problem. No more white-label lock-in risks.',
  },
  {
    icon: Settings,
    title: 'God Mode Dashboard',
    desc: 'See every client site, manage configurations, and monitor analytics from a single multi-tenant screen. No switching accounts.',
  },
  {
    icon: Zap,
    title: 'Built-in GEO/AEO',
    desc: "Walk into the next pitch already ahead of the WordPress agency down the road. Every site speaks natively to AI search engines.",
  },
  {
    icon: Workflow,
    title: 'Faster Delivery',
    desc: 'Spin up a client site in days, not months. Atlas, Meridian, or future templates  configured and live before traditional agencies even wireframe.',
  },
];

const tiers = [
  {
    name: 'Bronze',
    clients: '1-2 client sites',
    price: 'R2,500/mo',
    features: ['Agency Dashboard', 'Multi-tenant management'],
  },
  {
    name: 'Silver',
    clients: '3-9 client sites',
    price: 'R4,500/mo',
    features: ['Agency Dashboard', 'Multi-tenant management', 'Priority support'],
  },
  {
    name: 'Gold',
    clients: '10+ client sites (unlimited)',
    price: 'R6,000/mo flat cap',
    features: ['Agency Dashboard', 'Dedicated account manager', 'Early feature access'],
  },
];

export default function AgenciesPage() {
  return (
    <>
      {/* Hero */}
      <section
        style={{
          paddingTop: '120px',
          paddingBottom: '80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '700px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(59,130,246,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div className="m-container" style={{ position: 'relative', textAlign: 'center' }}>
          <span className="m-label">For Agencies</span>
          <div className="m-divider" style={{ margin: '16px auto' }} />
          <h1
            style={{
              fontFamily: 'var(--m-font-display)',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--m-text)',
              margin: '0 0 20px',
              maxWidth: '800px',
              marginInline: 'auto',
            }}
          >
            Your clients pay us. You keep your retainer.{' '}
            <span className="m-gradient-text">Everyone wins.</span>
          </h1>
          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--m-text-muted)',
              maxWidth: '600px',
              margin: '0 auto 40px',
              lineHeight: 1.7,
            }}
          >
            Chameleon gives your agency a platform to deliver AI-ready websites 
            faster and more profitably. The modern partner model for ambitious agencies.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="m-btn m-btn-primary m-btn-lg">
              Become an Agency Partner
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* The Model Explained */}
      <section className="m-section" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="m-container">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2
              style={{
                fontFamily: 'var(--m-font-display)',
                fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                fontWeight: 700,
                color: 'var(--m-text)',
                margin: '0 0 12px',
              }}
            >
              The Chameleon Model
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--m-text-muted)' }}>
              Transparent billing. No white-label lock-in risks.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            <div className="m-card" style={{ padding: '32px', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ color: '#60a5fa', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
                Step 1
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'white', marginBottom: '16px' }}>
                Client pays Chameleon
              </h3>
              <p style={{ color: 'var(--m-text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                The client pays the R3,500-R4,500/mo platform infrastructure fee directly to us.
              </p>
            </div>
            
            <div className="m-card" style={{ padding: '32px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(59,130,246,0.3)' }}>
              <div style={{ color: '#60a5fa', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
                Step 2
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'white', marginBottom: '16px' }}>
                Client pays Agency
              </h3>
              <p style={{ color: 'var(--m-text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                The client pays you your R15k-R20k/mo retainer for strategy, content, and management.
              </p>
            </div>

            <div className="m-card" style={{ padding: '32px', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ color: '#60a5fa', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
                Step 3
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'white', marginBottom: '16px' }}>
                Agency pays Chameleon
              </h3>
              <p style={{ color: 'var(--m-text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                You pay a flat R2,500-R6,000/mo fee for the multi-tenant God Mode dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Math */}
      <section className="m-section" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="m-container-sm">
          <div className="m-card" style={{ 
            padding: '48px', 
            background: 'linear-gradient(135deg, rgba(59,130,246,0.05) 0%, rgba(13,17,23,1) 100%)',
            border: '1px solid rgba(59,130,246,0.2)',
            textAlign: 'center'
          }}>
            <h2 style={{ fontFamily: 'var(--m-font-display)', fontSize: '2rem', fontWeight: 700, color: 'white', margin: '0 0 24px' }}>
              The Math at Scale
            </h2>
            <div style={{ fontSize: '1.1rem', color: 'var(--m-text)', lineHeight: 1.8, maxWidth: '500px', margin: '0 auto' }}>
              <p><strong>5 clients</strong> on your books.</p>
              <p><strong>R75,000/mo</strong> in combined retainer revenue.</p>
              <p>Your dashboard costs: <strong>R2,500/mo</strong>.</p>
              <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', color: '#60a5fa', fontWeight: 600 }}>
                That&apos;s a 3.3% overhead. Whether you have 2 clients or 20.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Tiers */}
      <section className="m-section" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="m-container">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontFamily: 'var(--m-font-display)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, color: 'var(--m-text)' }}>
              Partner Tiers
            </h2>
          </div>

          <div className="m-grid-3">
            {tiers.map((tier) => (
              <div key={tier.name} className="m-card" style={{ padding: '32px' }}>
                <div style={{ color: '#60a5fa', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>
                  {tier.clients}
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', margin: '0 0 16px' }}>{tier.name}</h3>
                <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'white', marginBottom: '24px' }}>
                  {tier.price}
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {tier.features.map(f => (
                    <li key={f} style={{ display: 'flex', gap: '8px', marginBottom: '12px', fontSize: '0.9rem', color: 'var(--m-text-muted)' }}>
                      <ShieldCheck size={16} color="#60a5fa" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section
        className="m-section"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        id="agency-benefits"
      >
        <div className="m-container">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2
              style={{
                fontFamily: 'var(--m-font-display)',
                fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                fontWeight: 700,
                color: 'var(--m-text)',
                margin: '0 0 12px',
              }}
            >
              The Agency Advantage
            </h2>
          </div>

          <div className="m-grid-2" style={{ gap: '20px' }}>
            {agencyBenefits.map((benefit) => (
              <div
                key={benefit.title}
                className="m-card"
                style={{ padding: '32px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    width: '48px',
                    height: '48px',
                    borderRadius: '10px',
                    background: 'rgba(59,130,246,0.1)',
                    border: '1px solid rgba(59,130,246,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#60a5fa',
                  }}
                >
                  <benefit.icon size={22} />
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--m-font-display)',
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      color: 'var(--m-text)',
                      margin: '0 0 8px',
                    }}
                  >
                    {benefit.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--m-text-muted)', margin: 0, lineHeight: 1.6 }}>
                    {benefit.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="m-section" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div
          className="m-container-sm"
          style={{
            textAlign: 'center',
            padding: '64px 24px',
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
            Ready to partner?
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--m-text-muted)', maxWidth: '420px', margin: '0 auto 28px', lineHeight: 1.7 }}>
            Let&apos;s have a conversation about how Chameleon can fit into your agency&apos;s offering.
          </p>
          <Link href="/contact" className="m-btn m-btn-primary m-btn-lg">
            Talk to us
            <ArrowRight size={18} />
          </Link>
          <p style={{ marginTop: '20px', fontSize: '0.8rem', color: 'var(--m-text-faint)' }}>
            Revenue share for high-volume partners &mdash; talk to us.
          </p>
        </div>
      </section>
    </>
  );
}
