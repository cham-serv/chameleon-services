/**
 * Meridian ServicesPage
 *
 * 3 variants:
 *  cards        - responsive grid of service cards (default)
 *  sticky-scroll - left sticky nav + right scrolling detail blocks
 *  modal-grid   - department filter tabs + click-to-open inline modals
 *
 * Fetches live services + departments from engine API.
 * Falls back to demo data when no services are configured.
 */

import type { PageProps, Service, Department } from '@/lib/types';
import { MeridianIcon } from './MeridianIcon';
import { getServices, getDepartments } from '@/lib/api';
import ModalGridClient from './ServicesModalGridClient';

// ─── Demo fallback ────────────────────────────────────────────────────────

const DEMO_SERVICES: Service[] = [
  { id: 1, slug: 'corporate-law',    title: 'Corporate Law',    icon: 'Scale',      shortDesc: 'Expert advice on mergers, acquisitions, corporate governance, and commercial contracts.', published: true, createdAt: '', updatedAt: '' },
  { id: 2, slug: 'litigation',       title: 'Litigation',       icon: 'Gavel',      shortDesc: 'Robust representation in civil, commercial, and regulatory disputes at all court levels.', published: true, createdAt: '', updatedAt: '' },
  { id: 3, slug: 'tax-advisory',     title: 'Tax Advisory',     icon: 'Receipt',    shortDesc: 'Strategic tax planning, VAT compliance, and dispute resolution with SARS.', published: true, createdAt: '', updatedAt: '' },
  { id: 4, slug: 'property-law',     title: 'Property Law',     icon: 'Home',       shortDesc: 'Conveyancing, property development, sectional title, and real estate transactions.', published: true, createdAt: '', updatedAt: '' },
  { id: 5, slug: 'family-law',       title: 'Family Law',       icon: 'Heart',      shortDesc: 'Compassionate guidance on divorce, custody, maintenance, and estate planning.', published: true, createdAt: '', updatedAt: '' },
  { id: 6, slug: 'international-law',title: 'International Law', icon: 'Globe',     shortDesc: 'Cross-border transactions, trade compliance, and international arbitration.', published: true, createdAt: '', updatedAt: '' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function ServiceCard({ svc, onClick }: { svc: Service; onClick?: (svc: Service) => void }) {
  const dept = svc.department && typeof svc.department === 'object' && 'name' in svc.department
    ? (svc.department as Department) : null;

  const inner = (
    <div className="mer-service-card" style={{ cursor: onClick ? 'pointer' : 'default', height: '100%' }} onClick={onClick ? () => onClick(svc) : undefined}>
      {svc.icon && (
        <div className="mer-service-card-icon" aria-hidden="true">
          <MeridianIcon name={svc.icon} size={24} strokeWidth={1.5} />
        </div>
      )}
      {dept && <span className="mer-tag mer-tag-dept" style={{ marginBottom: 'var(--mer-spacing-sm)', display: 'inline-flex' }}>{dept.name}</span>}
      {svc.badge && <span className="mer-badge mer-badge-accent" style={{ marginBottom: 'var(--mer-spacing-sm)', marginLeft: dept ? 'var(--mer-spacing-xs)' : 0, display: 'inline-flex' }}>{svc.badge}</span>}
      <div className="mer-service-card-title">{svc.title}</div>
      <p className="mer-service-card-desc">{svc.shortDesc ?? svc.shortDescription ?? ''}</p>
      {(svc.priceRange && svc.displayPricing) && (
        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--brand-primary, #1a2b5e)', marginBottom: 'var(--mer-spacing-md)' }}>{svc.priceRange}</div>
      )}
      {!onClick && (
        <a href={`/services/${svc.slug}`} className="mer-arrow-link" aria-label={`Learn more about ${svc.title}`}>
          Learn more <ArrowIcon />
        </a>
      )}
      {onClick && (
        <div className="mer-arrow-link" aria-hidden="true" style={{ marginTop: 'auto' }}>
          View details <ArrowIcon />
        </div>
      )}
    </div>
  );

  return onClick ? inner : <a href={`/services/${svc.slug}`} style={{ textDecoration: 'none', display: 'contents' }}>{inner}</a>;
}

// ─── VARIANT: cards ───────────────────────────────────────────────────────

function CardsVariant({ services, headline, subheadline, tenantSlug }: {
  services: Service[];
  headline: string;
  subheadline?: string | null;
  tenantSlug: string;
}) {
  return (
    <>
      {/* Page hero */}
      <section className="mer-section-sm" style={{ borderBottom: '1px solid var(--mer-border-color)' }}>
        <div className="mer-container">
          <div className="mer-section-header--left" data-reveal="up">
            <span className="mer-overline">What We Do</span>
            <h1 className="mer-h1 mer-mt-md">{headline}</h1>
            {subheadline && <p className="mer-body-lg mer-mt-lg" style={{ maxWidth: 600, opacity: 0.8 }}>{subheadline}</p>}
          </div>
        </div>
      </section>

      {/* Cards grid */}
      <section className="mer-section">
        <div className="mer-container">
          <div className="mer-grid-3" data-reveal-stagger>
            {services.map((svc) => (
              <ServiceCard key={svc.id} svc={svc} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <div className="mer-cta-strip">
        <div className="mer-cta-strip-inner">
          <div>
            <h2 className="mer-h3" style={{ color: '#fff' }}>Not sure which service is right for you?</h2>
            <p className="mer-body-lg" style={{ color: 'rgba(255,255,255,0.72)', marginTop: 'var(--mer-spacing-sm)' }}>Speak to our team — we&apos;ll guide you to the right solution.</p>
          </div>
          <a href="/contact" className="mer-btn mer-btn-white" style={{ flexShrink: 0 }}>Get in Touch</a>
        </div>
      </div>
    </>
  );
}

// ─── VARIANT: sticky-scroll ───────────────────────────────────────────────

function StickyScrollVariant({ services, headline, subheadline }: {
  services: Service[];
  headline: string;
  subheadline?: string | null;
}) {
  return (
    <>
      <section className="mer-section-sm" style={{ borderBottom: '1px solid var(--mer-border-color)' }}>
        <div className="mer-container">
          <div className="mer-section-header--left" data-reveal="up">
            <span className="mer-overline">Practice Areas</span>
            <h1 className="mer-h1 mer-mt-md">{headline}</h1>
            {subheadline && <p className="mer-body-lg mer-mt-lg" style={{ maxWidth: 600, opacity: 0.8 }}>{subheadline}</p>}
          </div>
        </div>
      </section>

      <section className="mer-section">
        <div className="mer-container">
          <div className="mer-sticky-scroll">
            {/* Sticky sidebar nav */}
            <nav className="mer-sticky-nav" aria-label="Services navigation">
              <ul className="mer-sticky-nav-list">
                {services.map((svc, i) => (
                  <li key={svc.id}>
                    <a
                      href={`#service-${svc.slug}`}
                      className="mer-sticky-nav-item"
                      data-active={i === 0 ? 'true' : 'false'}
                    >
                      {svc.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Scrolling detail sections */}
            <div className="mer-sticky-content">
              {services.map((svc) => {
                const heroUrl = svc.heroImage && typeof svc.heroImage === 'object' && 'url' in svc.heroImage
                  ? (svc.heroImage as { url: string }).url : null;
                const dept = svc.department && typeof svc.department === 'object' && 'name' in svc.department
                  ? (svc.department as Department) : null;

                return (
                  <div id={`service-${svc.slug}`} key={svc.id} className="mer-sticky-section" data-reveal="up">
                    {dept && <span className="mer-tag mer-tag-dept" style={{ marginBottom: 'var(--mer-spacing-md)', display: 'inline-flex' }}>{dept.name}</span>}
                    {svc.badge && <span className="mer-badge mer-badge-accent" style={{ marginBottom: 'var(--mer-spacing-md)', marginLeft: dept ? 'var(--mer-spacing-xs)' : 0, display: 'inline-flex' }}>{svc.badge}</span>}
                    <h2 className="mer-h2" style={{ marginBottom: 'var(--mer-spacing-lg)' }}>{svc.title}</h2>

                    {heroUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={heroUrl} alt={svc.title} style={{ width: '100%', aspectRatio: '16/7', objectFit: 'cover', borderRadius: 'var(--mer-radius-lg)', marginBottom: 'var(--mer-spacing-xl)' }} />
                    )}

                    {svc.shortDesc && <p className="mer-body-lg" style={{ marginBottom: 'var(--mer-spacing-xl)', opacity: 0.85 }}>{svc.shortDesc}</p>}

                    {(svc.processSteps ?? []).length > 0 && (
                      <div style={{ marginBottom: 'var(--mer-spacing-xl)' }}>
                        <h3 className="mer-h4" style={{ marginBottom: 'var(--mer-spacing-lg)' }}>How It Works</h3>
                        <div className="mer-steps">
                          {svc.processSteps!.map((step, i) => (
                            <div key={i} className="mer-step">
                              <div className="mer-step-number">{i + 1}</div>
                              <div>
                                <div className="mer-step-title">{step.title}</div>
                                <p className="mer-step-desc">{step.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(svc.outcomes ?? []).length > 0 && (
                      <div style={{ marginBottom: 'var(--mer-spacing-xl)' }}>
                        <h3 className="mer-h4" style={{ marginBottom: 'var(--mer-spacing-md)' }}>Client Outcomes</h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                          {svc.outcomes!.map((o, i) => (
                            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625em', fontSize: '0.9375rem', color: 'var(--brand-text, #444)' }}>
                              <span style={{ color: 'var(--brand-primary)', flexShrink: 0, marginTop: '0.15em' }}>✓</span>
                              {o.text}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: 'var(--mer-spacing-md)', flexWrap: 'wrap' }}>
                      <a href={`/contact?service=${encodeURIComponent(svc.slug)}`} className="mer-btn mer-btn-primary">{svc.ctaLabel ?? 'Get in Touch'} <ArrowIcon /></a>
                      <a href={`/services/${svc.slug}`} className="mer-btn mer-btn-ghost">Full Details</a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────

export default async function ServicesPage({ config, variant }: PageProps) {
  const tenantSlug = config.tenant.slug;
  const pc         = config.pageConfig as any;

  const headline    = pc?.servicesHeadline    ?? 'Our Services';
  const subheadline = pc?.servicesSubheadline ?? null;

  // Fetch live data in parallel
  const [svcRes, deptRes] = await Promise.all([
    getServices(tenantSlug),
    getDepartments(tenantSlug),
  ]);

  const services    = (svcRes?.docs  ?? DEMO_SERVICES).filter((s) => s.published !== false);
  const departments = deptRes?.docs ?? [];

  // ── Variant routing ────────────────────────────────────────────────────
  if (variant === 'sticky-scroll') {
    return <StickyScrollVariant services={services} headline={headline} subheadline={subheadline} />;
  }

  if (variant === 'modal-grid') {
    // Client component handles interactivity
    return <ModalGridClient services={services} departments={departments} headline={headline} subheadline={subheadline} tenantSlug={tenantSlug} />;
  }

  // Default: cards
  return <CardsVariant services={services} headline={headline} subheadline={subheadline} tenantSlug={tenantSlug} />;
}
