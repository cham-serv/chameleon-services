import type { Metadata } from 'next';
import Link from 'next/link';
import { HeroTextCycler } from '@/components/marketing/HeroTextCycler';
import { ArrowRight, Zap, Brain, RefreshCw, Palette, Search, TrendingUp, Clock, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Chameleon — AI-Ready Websites for South African Businesses',
  description:
    'Search has changed. Chameleon builds AI-ready, GEO-optimised websites and ecommerce stores that adapt to the new era of AI-powered search.',
};

const features = [
  {
    id: 'geo-optimised',
    icon: Brain,
    title: 'GEO Optimised',
    desc: 'Every page is structured for Generative Engine Optimisation — so AI search engines like ChatGPT, Perplexity, and Google SGE can find, understand, and quote your business.',
  },
  {
    id: 'ai-content',
    icon: Zap,
    title: 'AI-Powered Content',
    desc: 'Product listings, articles, and meta content built with structured intelligence from day one. Not retrofitted — native.',
  },
  {
    id: 'beautiful-templates',
    icon: Palette,
    title: 'Beautiful Templates',
    desc: 'Professionally designed storefronts and business sites that look premium on day one, branded to your business, ready to launch.',
  },
  {
    id: 'always-updating',
    icon: RefreshCw,
    title: 'Always Updating',
    desc: 'AI and GEO move fast. Legacy platforms struggle to keep up. Chameleon evolves continuously — your site stays ahead without the costly upgrades.',
  },
];

const howItWorksSteps = [
  {
    step: '01',
    title: 'Choose a Template',
    desc: 'Browse our library of professionally designed templates. Each one is AI-ready, GEO-optimised, and built for your industry.',
  },
  {
    step: '02',
    title: 'Customise Your Brand',
    desc: 'Add your logo, brand colours, fonts, products, and content through a clean, intuitive admin panel. No code required.',
  },
  {
    step: '03',
    title: 'Go Live Today',
    desc: 'Connect your domain and launch. Your site is live, fast, and already speaking the language of modern AI search engines.',
  },
];

const templates = [
  {
    id: 'atlas',
    name: 'Atlas',
    tagline: 'Premium ecommerce, beautifully crafted.',
    features: ['Ecommerce', 'Articles', 'FAQ', 'Cart & Checkout'],
    demoHref: 'https://atlas-demo.chameleon.services',
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #0d1117 100%)',
  },
  {
    id: 'meridian',
    name: 'Meridian',
    tagline: 'Services & consulting, built to convert.',
    features: ['Services', 'Articles', 'Contact', 'Legal'],
    demoHref: 'https://meridian-demo.chameleon.services',
    gradient: 'linear-gradient(135deg, #1a1f2e 0%, #0d1117 100%)',
  },
];

const whyNowPoints = [
  {
    icon: Search,
    stat: '40%',
    label: 'of searches now return AI-generated answers',
    desc: 'Google SGE, ChatGPT, and Perplexity are changing where your customers find you.',
  },
  {
    icon: TrendingUp,
    stat: '62%',
    label: 'of users trust AI answers over organic results',
    desc: 'If the AI doesn\'t know about you, neither does your next customer.',
  },
  {
    icon: Clock,
    stat: '18 months',
    label: 'behind — the average legacy CMS platform',
    desc: 'GEO requires structured data, semantic markup, and AI-friendly content architecture that old platforms weren\'t built for.',
  },
  {
    icon: Globe,
    stat: 'R0',
    label: 'in additional ad spend required',
    desc: 'GEO is organic visibility in AI answers — earned through content structure, not paid media.',
  },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          paddingTop: '96px',
          overflow: 'hidden',
        }}
      >
        {/* Background glows */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '15%',
            right: '10%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(129,140,248,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Hex grid pattern */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='52' viewBox='0 0 60 52'%3E%3Cpath d='M30 1 L59 17.5 L59 34.5 L30 51 L1 34.5 L1 17.5 Z' fill='none' stroke='rgba(255,255,255,0.025)' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 52px',
            opacity: 0.8,
            pointerEvents: 'none',
          }}
        />

        <div className="m-container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', paddingBlock: '80px' }}>
          {/* Badge */}
          <div className="m-animate-fade-up" style={{ marginBottom: '24px' }}>
            <span className="m-badge">
              <Zap size={11} />
              AI-ready websites for South Africa
            </span>
          </div>

          {/* Headline */}
          <h1
            className="m-animate-fade-up m-animate-delay-1"
            style={{
              fontFamily: 'var(--m-font-display)',
              fontSize: 'clamp(2.8rem, 7vw, 5rem)',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: 'var(--m-text)',
              margin: '0 0 20px',
            }}
          >
            Search has changed.
            <br />
            <span className="m-gradient-text">Your website needs to be</span>
          </h1>

          {/* Cycling text */}
          <div
            className="m-animate-fade-up m-animate-delay-2"
            style={{
              fontFamily: 'var(--m-font-display)',
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: '#60a5fa',
              minHeight: '1.2em',
              marginBottom: '32px',
            }}
          >
            <HeroTextCycler />
          </div>

          {/* Subtext */}
          <p
            className="m-animate-fade-up m-animate-delay-2"
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.15rem)',
              color: 'var(--m-text-muted)',
              maxWidth: '560px',
              margin: '0 auto 40px',
              lineHeight: 1.7,
            }}
          >
            Chameleon builds AI-ready, GEO-optimised websites and ecommerce stores
            that adapt to the new era of search — so your business stays visible
            wherever customers are looking.
          </p>

          {/* CTAs */}
          <div
            className="m-animate-fade-up m-animate-delay-3"
            style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link
              href="/contact"
              className="m-btn m-btn-primary m-btn-lg"
              id="hero-cta-get-started"
            >
              Get Started
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/templates"
              className="m-btn m-btn-ghost m-btn-lg"
              id="hero-cta-templates"
            >
              View Templates
            </Link>
          </div>

          {/* Trust line */}
          <p
            className="m-animate-fade-up m-animate-delay-4"
            style={{ marginTop: '24px', fontSize: '0.8rem', color: 'var(--m-text-faint)' }}
          >
            South Africa-first platform. No lock-in. Cancel anytime.
          </p>
        </div>
      </section>

      {/* ── Feature Pillars ───────────────────────────────────────────────── */}
      <section className="m-section-sm" id="features">
        <div className="m-container">
          <div className="m-grid-4">
            {features.map((f) => (
              <div
                key={f.id}
                className="m-card"
                id={`feature-${f.id}`}
                style={{ padding: '28px 24px' }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: 'rgba(59,130,246,0.1)',
                    border: '1px solid rgba(59,130,246,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                    color: '#60a5fa',
                  }}
                >
                  <f.icon size={20} />
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--m-font-display)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'var(--m-text)',
                    margin: '0 0 8px',
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--m-text-muted)',
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Now? AI & SEO Explained ───────────────────────────────────── */}
      <section className="m-section" id="why-now">
        <div className="m-container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 64px' }}>
            <span className="m-label">Why this matters</span>
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
              Shopify, Wix, and WordPress weren&apos;t designed for this. Updating them for GEO
              is expensive, slow, and often impossible without breaking everything else.
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

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section
        className="m-section"
        id="how-it-works"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="m-container">
          <div style={{ textAlign: 'center', maxWidth: '580px', margin: '0 auto 64px' }}>
            <span className="m-label">How it works</span>
            <div className="m-divider" style={{ margin: '16px auto' }} />
            <h2
              style={{
                fontFamily: 'var(--m-font-display)',
                fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'var(--m-text)',
                margin: '0 0 16px',
              }}
            >
              From zero to live in a day.
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--m-text-muted)', lineHeight: 1.7, margin: 0 }}>
              No developers. No agencies. No 6-month projects.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0',
              position: 'relative',
            }}
          >
            {/* Connector lines */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: '32px',
                left: 'calc(33.333% - 1px)',
                right: 'calc(33.333% - 1px)',
                height: '1px',
                background: 'linear-gradient(90deg, rgba(59,130,246,0.4), rgba(59,130,246,0.4))',
                pointerEvents: 'none',
              }}
            />

            {howItWorksSteps.map((step, idx) => (
              <div
                key={step.step}
                id={`step-${idx + 1}`}
                style={{ padding: '0 32px 0', textAlign: 'center', position: 'relative' }}
              >
                {/* Step number circle */}
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
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
                    background: 'var(--m-bg)',
                  }}
                >
                  {step.step}
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--m-font-display)',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: 'var(--m-text)',
                    margin: '0 0 10px',
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

      {/* ── Template Gallery ──────────────────────────────────────────────── */}
      <section
        className="m-section"
        id="templates"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="m-container">
          <div style={{ textAlign: 'center', maxWidth: '560px', margin: '0 auto 56px' }}>
            <span className="m-label">Templates</span>
            <div className="m-divider" style={{ margin: '16px auto' }} />
            <h2
              style={{
                fontFamily: 'var(--m-font-display)',
                fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'var(--m-text)',
                margin: '0 0 16px',
              }}
            >
              Every store, perfectly crafted.
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--m-text-muted)', lineHeight: 1.7, margin: 0 }}>
              Each template is AI-ready from day one — not retrofitted. Pick one,
              brand it to your business, and launch.
            </p>
          </div>

          <div className="m-grid-2" style={{ gap: '24px' }}>
            {templates.map((template) => (
              <div
                key={template.id}
                className="m-card"
                id={`template-card-${template.id}`}
                style={{ overflow: 'hidden' }}
              >
                {/* Preview area */}
                <div
                  style={{
                    height: '220px',
                    background: template.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    fontSize: '2rem',
                    fontFamily: 'var(--m-font-display)',
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.15)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {template.name}
                </div>

                {/* Info */}
                <div style={{ padding: '24px' }}>
                  <h3
                    style={{
                      fontFamily: 'var(--m-font-display)',
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      color: 'var(--m-text)',
                      margin: '0 0 6px',
                    }}
                  >
                    {template.name}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--m-text-muted)', margin: '0 0 16px' }}>
                    {template.tagline}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                    {template.features.map((f) => (
                      <span
                        key={f}
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          padding: '3px 10px',
                          borderRadius: '999px',
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: 'var(--m-text-muted)',
                        }}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                  <a
                    href={template.demoHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="m-btn m-btn-ghost"
                    style={{ width: '100%', justifyContent: 'center' }}
                    id={`template-demo-${template.id}`}
                  >
                    View Live Demo
                    <ArrowRight size={15} />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link href="/templates" className="m-btn m-btn-ghost" id="home-view-all-templates">
              Browse all templates
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Pricing Teaser ────────────────────────────────────────────────── */}
      <section
        className="m-section"
        id="pricing-teaser"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="m-container" style={{ textAlign: 'center' }}>
          <span className="m-label">Pricing</span>
          <div className="m-divider" style={{ margin: '16px auto' }} />
          <h2
            style={{
              fontFamily: 'var(--m-font-display)',
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--m-text)',
              margin: '0 0 16px',
            }}
          >
            Simple, transparent pricing.
          </h2>
          <p
            style={{
              fontSize: '0.95rem',
              color: 'var(--m-text-muted)',
              maxWidth: '480px',
              margin: '0 auto 40px',
              lineHeight: 1.7,
            }}
          >
            Three tiers to match where your business is today.
            Start small, scale as you grow. No hidden fees.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '32px',
            }}
          >
            {[
              { name: 'Starter', price: 'R1,199', desc: '1 store' },
              { name: 'Growth', price: 'R3,499', desc: 'Up to 5 stores', popular: true },
              { name: 'Agency', price: 'Custom', desc: 'Unlimited stores' },
            ].map((tier) => (
              <div
                key={tier.name}
                style={{
                  padding: '24px 32px',
                  borderRadius: '12px',
                  border: tier.popular
                    ? '1px solid rgba(59,130,246,0.4)'
                    : '1px solid rgba(255,255,255,0.08)',
                  background: tier.popular ? 'rgba(59,130,246,0.06)' : 'rgba(255,255,255,0.03)',
                  minWidth: '180px',
                  textAlign: 'center',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: tier.popular ? '#60a5fa' : 'var(--m-text-muted)', marginBottom: '8px' }}>
                  {tier.name}
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--m-text)', marginBottom: '4px' }}>
                  {tier.price}
                  {tier.price !== 'Custom' && <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--m-text-muted)' }}>/mo</span>}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--m-text-muted)' }}>{tier.desc}</div>
              </div>
            ))}
          </div>

          <Link href="/pricing" className="m-btn m-btn-primary m-btn-lg" id="home-see-pricing">
            See full pricing
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="m-section" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div
          className="m-container-sm"
          style={{
            textAlign: 'center',
            padding: '64px 24px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(129,140,248,0.06) 100%)',
            border: '1px solid rgba(59,130,246,0.2)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Glow */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '500px',
              height: '300px',
              borderRadius: '50%',
              background: 'radial-gradient(ellipse, rgba(59,130,246,0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          <div style={{ position: 'relative' }}>
            <h2
              style={{
                fontFamily: 'var(--m-font-display)',
                fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'var(--m-text)',
                margin: '0 0 16px',
              }}
            >
              Ready to adapt?
            </h2>
            <p
              style={{
                fontSize: '1rem',
                color: 'var(--m-text-muted)',
                maxWidth: '400px',
                margin: '0 auto 32px',
                lineHeight: 1.7,
              }}
            >
              Join South African businesses already using Chameleon to stay visible
              in the AI era.
            </p>
            <Link href="/contact" className="m-btn m-btn-primary m-btn-lg" id="final-cta-get-started">
              Get Started
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
