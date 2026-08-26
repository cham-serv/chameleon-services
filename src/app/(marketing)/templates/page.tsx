import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Templates  AI-Ready Storefronts & Business Sites',
  description:
    'Browse Chameleon\'s library of AI-ready, GEO-optimised website templates. Every template is beautifully designed and built for modern AI-powered search.',
};

const templates = [
  {
    id: 'atlas',
    name: 'Atlas',
    tagline: 'For heavy retail, industrial supply, and mid-market B2B.',
    description:
      'Atlas is Chameleon\'s Commerce-tier template - built for product-first businesses that need a premium storefront with AI-powered product listings, authority-grade knowledge graphs, multi-variant page design, and full ecommerce. The most capable template in the library.',
    features: ['Ecommerce & Cart', 'AI Product Listings', 'Articles & Blog', 'FAQ', 'Contact', 'Legal Pages'],
    industries: ['Industrial Supply', 'Heavy Retail', 'B2B Products', 'DTC Brands'],
    demoHref: 'https://atlas-demo.chameleon.services',
    gradient: 'linear-gradient(135deg, #7f1d1d 0%, #450a0a 60%, #1a0505 100%)',
    accentColor: '#f87171',
    status: 'available',
  },
  {
    id: 'atlas-lite',
    name: 'Atlas Lite',
    tagline: 'A powerful catalogue and quote engine, without the ecommerce overhead.',
    description:
      'Atlas Lite is the perfect solution for businesses that want to showcase their products and allow customers to build a quote, without managing complex ecommerce payments or shipping. Get all the SEO power and beautiful design of Atlas, streamlined for quote generation.',
    features: ['Quote Request Flow', 'Product Catalogue', 'Articles & Blog', 'FAQ', 'Contact', 'Legal Pages'],
    industries: ['B2B Wholesale', 'Custom Manufacturing', 'Bulk Suppliers', 'High-Value Retail'],
    demoHref: 'https://atlas-lite-demo.chameleon.services',
    gradient: 'linear-gradient(135deg, #7c2d12 0%, #431407 60%, #1c0a03 100%)',
    accentColor: '#fb923c',
    status: 'available',
  },
  {
    id: 'meridian',
    name: 'Meridian',
    tagline: 'Services & consulting, built to convert.',
    description:
      'Meridian is designed for service-based businesses - consultants, agencies, clinics, and professionals - who need a credibility-first site that generates leads.',
    features: ['Services Showcase', 'Lead Generation', 'Articles & Blog', 'Contact with Map', 'Legal Pages', 'FAQ'],
    industries: ['Consulting', 'Professional Services', 'Healthcare', 'Agencies'],
    demoHref: 'https://meridian-demo.chameleon.services',
    gradient: 'linear-gradient(135deg, #1a2642 0%, #141a2e 50%, #0d1117 100%)',
    accentColor: '#818cf8',
    status: 'available',
  },
  {
    id: 'solstice',
    name: 'Solstice',
    tagline: 'Hospitality & experiences, warm and inviting.',
    description:
      'Coming soon - Solstice is being designed for restaurants, lodges, event venues, and experience-based businesses.',
    features: ['Menu / Experience Showcase', 'Booking Integration', 'Gallery', 'Reviews', 'Events'],
    industries: ['Hospitality', 'Restaurants', 'Events', 'Tourism'],
    demoHref: '#',
    gradient: 'linear-gradient(135deg, #2d1a0e 0%, #1a1209 50%, #0d0d10 100%)',
    accentColor: '#f59e0b',
    status: 'coming-soon',
  },
];

export default function TemplatesPage() {
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
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            Each template is AI-ready from day one  structured for GEO, built for performance,
            and branded to your business in minutes.
          </p>
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
                  opacity: template.status === 'coming-soon' ? 0.6 : 1,
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
                <div style={{ padding: '40px' }}>
                  <h2
                    style={{
                      fontFamily: 'var(--m-font-display)',
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: 'var(--m-text)',
                      margin: '0 0 4px',
                    }}
                  >
                    {template.name}
                  </h2>
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
