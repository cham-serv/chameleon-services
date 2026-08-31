import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Templates  AI-Ready Storefronts & Business Sites',
  description:
    'Browse Chameleon\'s library of AI-ready, GEO-optimised website templates. Every template is beautifully designed and built for modern AI-powered search.',
};

type Tier = 'Launch' | 'Professional' | 'Storefront' | 'Commerce';

const tierConfig: Record<Tier, { color: string; bg: string; border: string }> = {
  Launch:       { color: '#10b981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.3)'  },
  Professional: { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.3)'  },
  Storefront:   { color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',  border: 'rgba(139,92,246,0.3)'  },
  Commerce:     { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)'  },
};

const templates: {
  id: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  industries: string[];
  demoHref: string;
  gradient: string;
  accentColor: string;
  status: 'available' | 'coming-soon';
  tier: Tier;
}[] = [
  {
    id: 'atlas',
    name: 'Atlas',
    tagline: 'For heavy retail, industrial supply and mid-market B2B.',
    description:
      'Atlas is Chameleon\'s Commerce-tier template - built for product-first businesses that need a premium storefront with AI-powered product listings, authority-grade knowledge graphs, multi-variant page design and full ecommerce. The most capable template in the library.',
    features: ['Ecommerce & Cart', 'AI Product Listings', 'Articles & Blog', 'FAQ', 'Contact', 'Legal Pages'],
    industries: ['Industrial Supply', 'Heavy Retail', 'B2B Products', 'DTC Brands'],
    demoHref: 'https://atlas-demo.chameleon.services',
    gradient: 'linear-gradient(135deg, #7f1d1d 0%, #450a0a 60%, #1a0505 100%)',
    accentColor: '#f87171',
    status: 'available',
    tier: 'Commerce',
  },
  {
    id: 'atlas-lite',
    name: 'Atlas Lite',
    tagline: 'A powerful catalogue and quote engine, without the ecommerce overhead.',
    description:
      'Atlas Lite is the perfect solution for businesses that want to showcase their products and allow customers to build a quote, without managing complex ecommerce payments or shipping. Get all the SEO power and beautiful design of Atlas, streamlined for quote generation.',
    features: ['Quote Request Flow', 'Product Catalogue', 'Articles & Blog', 'FAQ', 'Contact', 'Legal Pages'],
    industries: ['B2B Wholesale', 'Custom Manufacturing', 'Bulk Suppliers', 'High-Value Retail'],
    demoHref: '#',
    gradient: 'linear-gradient(135deg, #7c2d12 0%, #431407 60%, #1c0a03 100%)',
    accentColor: '#fb923c',
    status: 'coming-soon',
    tier: 'Storefront',
  },
  {
    id: 'meridian',
    name: 'Meridian',
    tagline: 'Services and consulting, built to convert.',
    description:
      'Meridian is designed for service-based businesses - consultants, agencies, clinics and professionals - who need a credibility-first site that generates leads and gets found by AI search.',
    features: ['Services Showcase', 'Lead Generation', 'Articles & Blog', 'Contact with Map', 'Legal Pages', 'FAQ'],
    industries: ['Consulting', 'Professional Services', 'Healthcare', 'Agencies'],
    demoHref: '#',
    gradient: 'linear-gradient(135deg, #1a2642 0%, #141a2e 50%, #0d1117 100%)',
    accentColor: '#818cf8',
    status: 'coming-soon',
    tier: 'Professional',
  },
  {
    id: 'solstice',
    name: 'Solstice',
    tagline: 'Hospitality and experiences, warm and inviting.',
    description:
      'Solstice is being designed for restaurants, lodges, event venues and experience-based businesses. Warm, immersive design with booking integration and a gallery built for atmosphere.',
    features: ['Menu / Experience Showcase', 'Booking Integration', 'Gallery', 'Reviews', 'Events'],
    industries: ['Hospitality', 'Restaurants', 'Events', 'Tourism'],
    demoHref: '#',
    gradient: 'linear-gradient(135deg, #2d1a0e 0%, #1a1209 50%, #0d0d10 100%)',
    accentColor: '#f59e0b',
    status: 'coming-soon',
    tier: 'Storefront',
  },
  {
    id: 'nova',
    name: 'Nova',
    tagline: 'Clean, fast and GEO-ready for small businesses and sole traders.',
    description:
      'Nova is Chameleon\'s Launch-tier template - a minimal, high-performance presence for businesses that just need to be found. Clean design, quick setup, and fully structured for AI search from day one. No ecommerce, no complexity.',
    features: ['Site-level GEO', 'Services Overview', 'Contact Form', 'Legal Pages', 'Custom Domain'],
    industries: ['Sole Traders', 'Local Services', 'Freelancers', 'Small Business'],
    demoHref: '#',
    gradient: 'linear-gradient(135deg, #0f2027 0%, #111827 50%, #0d1117 100%)',
    accentColor: '#10b981',
    status: 'coming-soon',
    tier: 'Launch',
  },
];

function TierPill({ tier }: { tier: Tier }) {
  const { color, bg, border } = tierConfig[tier];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        fontSize: '0.7rem',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        padding: '3px 10px',
        borderRadius: '999px',
        color,
        background: bg,
        border: `1px solid ${border}`,
      }}
    >
      {tier}
    </span>
  );
}

export default function TemplatesPage() {
  return (
    <>
      {/* Header */}
      <section
        className="m-hero-pt"
        style={{
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
          <span className="m-label">Templates</span>
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
            Every store, perfectly crafted.
          </h1>
          <p
            style={{
              fontSize: '1rem',
              color: 'var(--m-text-muted)',
              maxWidth: '520px',
              margin: '0 auto 24px',
              lineHeight: 1.7,
            }}
          >
            Each template is AI-ready from day one - structured for GEO, built for performance and branded to your business in minutes.
          </p>
          {/* Tier legend */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {(Object.keys(tierConfig) as Tier[]).map((tier) => (
              <TierPill key={tier} tier={tier} />
            ))}
          </div>
        </div>
      </section>

      {/* Template Cards */}
      <section className="m-section">
        <div className="m-container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {templates.map((template) => (
              <div
                key={template.id}
                className="m-card m-template-card"
                id={`template-${template.id}`}
                style={{
                  overflow: 'hidden',
                  opacity: template.status === 'coming-soon' ? 0.75 : 1,
                }}
              >
                {/* Preview */}
                <div
                  style={{
                    background: template.gradient,
                    minHeight: '280px',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    padding: '48px 32px',
                  }}
                >
                  {/* Radial glow */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: `radial-gradient(ellipse at 50% 40%, ${template.accentColor}22 0%, transparent 70%)`,
                      pointerEvents: 'none',
                    }}
                  />
                  {/* Template name */}
                  <div
                    style={{
                      fontFamily: 'var(--m-font-display)',
                      fontSize: 'clamp(3rem, 6vw, 5rem)',
                      fontWeight: 800,
                      color: 'rgba(255,255,255,0.08)',
                      letterSpacing: '-0.04em',
                      lineHeight: 1,
                      userSelect: 'none',
                    }}
                  >
                    {template.name}
                  </div>
                  {/* Accent label */}
                  <div
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: template.accentColor,
                      opacity: 0.85,
                    }}
                  >
                    {template.tagline}
                  </div>
                  {template.status === 'coming-soon' && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'rgba(245,158,11,0.15)',
                        border: '1px solid rgba(245,158,11,0.3)',
                        color: '#f59e0b',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: '999px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                      }}
                    >
                      Coming Soon
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="m-template-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                    <h2
                      style={{
                        fontFamily: 'var(--m-font-display)',
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        color: 'var(--m-text)',
                        margin: 0,
                      }}
                    >
                      {template.name}
                    </h2>
                    <TierPill tier={template.tier} />
                  </div>
                  <p
                    style={{
                      fontSize: '0.9rem',
                      color: template.accentColor,
                      fontWeight: 500,
                      margin: '0 0 16px',
                    }}
                  >
                    {template.tagline}
                  </p>
                  <p
                    style={{
                      fontSize: '0.9rem',
                      color: 'var(--m-text-muted)',
                      lineHeight: 1.7,
                      margin: '0 0 24px',
                    }}
                  >
                    {template.description}
                  </p>

                  {/* Features */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--m-text-muted)', marginBottom: '8px' }}>
                      Includes
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {template.features.map((f) => (
                        <span
                          key={f}
                          style={{
                            fontSize: '0.75rem',
                            padding: '3px 10px',
                            borderRadius: '999px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            color: 'var(--m-text-muted)',
                          }}
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Industries */}
                  <div style={{ marginBottom: '28px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--m-text-muted)', marginBottom: '8px' }}>
                      Best for
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--m-text-muted)' }}>
                      {template.industries.join(' · ')}
                    </div>
                  </div>

                  {/* CTA */}
                  {template.status === 'available' ? (
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <a
                        href={template.demoHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="m-btn m-btn-primary"
                        id={`template-view-demo-${template.id}`}
                      >
                        View Live Demo
                        <ArrowRight size={15} />
                      </a>
                      <Link href="/contact" className="m-btn m-btn-ghost" id={`template-get-started-${template.id}`}>
                        Get Started
                      </Link>
                    </div>
                  ) : (
                    <Link href="/contact" className="m-btn m-btn-ghost" id={`template-notify-${template.id}`}>
                      Get notified when available
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
