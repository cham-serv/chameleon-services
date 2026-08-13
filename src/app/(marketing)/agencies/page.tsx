import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Users, Layers, BarChart3, Headphones } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Agency Programme — Build Client Sites at Scale',
  description:
    'Chameleon for agencies. Build, manage, and white-label AI-ready websites for your clients. Revenue share programme, unlimited stores, dedicated support.',
};

const agencyBenefits = [
  {
    icon: Layers,
    title: 'Unlimited Client Sites',
    desc: 'One Agency plan. Unlimited stores and websites. Manage every client from a single dashboard with full isolation between accounts.',
  },
  {
    icon: Users,
    title: 'White-Label Branding',
    desc: 'Remove Chameleon branding. Present the platform as your own product. Your clients see your brand, not ours.',
  },
  {
    icon: BarChart3,
    title: 'Revenue Share',
    desc: "Earn recurring revenue on every client you bring to the platform. The more you grow your book of business, the more you earn.",
  },
  {
    icon: Headphones,
    title: 'Dedicated Support',
    desc: 'Skip the queue. Agency partners get a dedicated account manager and SLA-backed technical support.',
  },
];

const agencyWorkflow = [
  {
    step: '01',
    title: 'You win the client',
    desc: "You do what you're already good at — selling, strategising, building relationships.",
  },
  {
    step: '02',
    title: 'We power the site',
    desc: 'Spin up a branded, AI-ready website for your client in hours. Configure, customise, and launch.',
  },
  {
    step: '03',
    title: 'Recurring revenue',
    desc: "Your client pays monthly. You earn your share — every month, for as long as they're active.",
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
              maxWidth: '700px',
              marginInline: 'auto',
            }}
          >
            Build client sites in days,{' '}
            <span className="m-gradient-text">not months.</span>
          </h1>
          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--m-text-muted)',
              maxWidth: '520px',
              margin: '0 auto 40px',
              lineHeight: 1.7,
            }}
          >
            Chameleon gives your agency a platform to deliver AI-ready, GEO-optimised
            websites to clients faster and more profitably than ever before.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="m-btn m-btn-primary m-btn-lg" id="agency-hero-cta">
              Talk to us about Agency pricing
              <ArrowRight size={18} />
            </Link>
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
                letterSpacing: '-0.02em',
                color: 'var(--m-text)',
                margin: '0 0 12px',
              }}
            >
              Everything your agency needs.
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--m-text-muted)', lineHeight: 1.7 }}>
              Designed for agencies who want to deliver more — without growing their team.
            </p>
          </div>

          <div className="m-grid-2" style={{ gap: '20px' }}>
            {agencyBenefits.map((benefit) => (
              <div
                key={benefit.title}
                className="m-card"
                style={{ padding: '32px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}
                id={`agency-benefit-${benefit.title.toLowerCase().replace(/\s+/g, '-')}`}
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

      {/* How it works for agencies */}
      <section
        className="m-section"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="m-container">
          <h2
            style={{
              fontFamily: 'var(--m-font-display)',
              fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--m-text)',
              margin: '0 0 48px',
              textAlign: 'center',
            }}
          >
            How the agency model works.
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0',
              position: 'relative',
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: '32px',
                left: 'calc(33.333% - 1px)',
                right: 'calc(33.333% - 1px)',
                height: '1px',
                background: 'rgba(59,130,246,0.3)',
                pointerEvents: 'none',
              }}
            />
            {agencyWorkflow.map((step) => (
              <div key={step.step} style={{ padding: '0 32px', textAlign: 'center' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'var(--m-bg)',
                    border: '1px solid rgba(59,130,246,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    fontFamily: 'var(--m-font-display)',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: '#60a5fa',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {step.step}
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--m-font-display)',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: 'var(--m-text)',
                    margin: '0 0 8px',
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--m-text-muted)', lineHeight: 1.6, margin: 0 }}>
                  {step.desc}
                </p>
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
            Interested in the Agency programme?
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--m-text-muted)', maxWidth: '400px', margin: '0 auto 28px', lineHeight: 1.7 }}>
            Let&apos;s have a conversation about how Chameleon can fit into your agency&apos;s offering.
          </p>
          <Link href="/contact" className="m-btn m-btn-primary m-btn-lg" id="agency-footer-cta">
            Get in Touch
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
