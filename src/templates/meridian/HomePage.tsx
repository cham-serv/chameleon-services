/**
 * Meridian HomePage
 *
 * 4 variants:
 *  - split-hero   : image right, headline + CTA left. Responsive split layout.
 *  - full-hero    : cinematic full-bleed image with dark gradient overlay.
 *  - authority    : no image — pure typographic statement.
 *  - metrics      : hero + immediate animated counter strip.
 *
 * All variants share: services overview, testimonials, partner logos, CTA.
 */

import type { PageProps } from '@/lib/types';
import MeridianCounters from './MeridianCounters';
import { getServices } from '@/lib/api';
import type { Service } from '@/lib/api';

/* ─── Demo / fallback data (replaced by live data in Phase 3) ─── */

const DEMO_SERVICES = [
  { icon: '⚖️', title: 'Corporate Law',    desc: 'Mergers, acquisitions, corporate governance, and commercial contracts.' },
  { icon: '🏛️', title: 'Litigation',       desc: 'Expert representation in civil, commercial, and regulatory disputes.' },
  { icon: '📋', title: 'Tax Advisory',      desc: 'Strategic tax planning, compliance, and dispute resolution.' },
  { icon: '🏠', title: 'Property Law',      desc: 'Conveyancing, property development, and real estate transactions.' },
  { icon: '👨‍👩‍👧', title: 'Family Law',     desc: 'Divorce, custody, maintenance, and estate planning.' },
  { icon: '🌐', title: 'International Law', desc: 'Cross-border transactions, trade law, and international arbitration.' },
];

const DEMO_TESTIMONIALS = [
  {
    quote: "Their team guided us through a complex acquisition with remarkable clarity and professionalism. We couldn't have asked for better counsel.",
    author: 'Sarah M.',
    role: 'CEO, TechVentures Ltd',
    rating: 5,
  },
  {
    quote: 'The tax structuring advice saved our business a significant amount and gave us total confidence going into our funding round.',
    author: 'James K.',
    role: 'CFO, Growth Capital Partners',
    rating: 5,
  },
  {
    quote: 'Responsive, sharp, and genuinely invested in our outcome. Exceptional service from start to finish.',
    author: 'Dr. Priya N.',
    role: 'Director, MedGroup Holdings',
    rating: 5,
  },
];

const DEMO_METRICS = [
  { value: '30+',    label: 'Years in Practice' },
  { value: '2,400+', label: 'Matters Handled' },
  { value: '98%',    label: 'Client Satisfaction' },
  { value: '12',     label: 'Practice Areas' },
];

const DEMO_TRUST_SIGNALS = [
  { icon: '✓', text: 'Admitted attorneys in good standing' },
  { icon: '✓', text: 'ISO 9001 certified practice' },
  { icon: '✓', text: 'Member of the Law Society' },
  { icon: '✓', text: 'BEE Level 1 contributor' },
];

/* ─── Star rating ─── */
function Stars({ count }: { count: number }) {
  return (
    <span aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="mer-star" aria-hidden="true">
          {i < count ? '★' : '☆'}
        </span>
      ))}
    </span>
  );
}

/* ─── Shared sections ─── */

type ServiceItem = { icon?: string; title: string; desc?: string; shortDesc?: string; slug?: string };
type TestimonialItem = { quote: string; author: string; role?: string | null; rating?: number | null };

function ServicesGrid({ siteName, services }: { siteName: string; services: ServiceItem[] }) {
  return (
    <section className="mer-section mer-surface">
      <div className="mer-container">
        <div className="mer-section-header" data-reveal="up">
          <span className="mer-overline">What We Do</span>
          <h2 className="mer-h2">Our Practice Areas</h2>
          <p className="mer-body-lg">
            Full-spectrum professional services tailored to your needs.
          </p>
        </div>

        <div className="mer-grid-3" data-reveal-stagger>
          {services.map((svc) => (
            <div key={svc.title} className="mer-service-card">
              {svc.icon && (
                <div className="mer-service-card-icon" aria-hidden="true">
                  {svc.icon}
                </div>
              )}
              <div className="mer-service-card-title">{svc.title}</div>
              <p className="mer-service-card-desc">{svc.shortDesc ?? svc.desc}</p>
              <a
                href={svc.slug ? `/services/${svc.slug}` : '/services'}
                className="mer-arrow-link"
              >
                Learn more
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection({ testimonials }: { testimonials: TestimonialItem[] }) {
  return (
    <section className="mer-section">
      <div className="mer-container">
        <div className="mer-section-header" data-reveal="up">
          <span className="mer-overline">Client Voices</span>
          <h2 className="mer-h2">What Our Clients Say</h2>
        </div>

        <div className="mer-grid-3" data-reveal-stagger>
          {testimonials.map((t) => (
            <div key={t.author} className="mer-testimonial">
              <Stars count={t.rating ?? 5} />
              <p className="mer-testimonial-quote">{t.quote}</p>
              <div className="mer-testimonial-author">
                <div className="mer-testimonial-avatar" aria-hidden="true" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                  {t.author[0]}
                </div>
                <div>
                  <div className="mer-testimonial-name">{t.author}</div>
                  {t.role && <div className="mer-testimonial-role">{t.role}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBanner({ siteName }: { siteName: string }) {
  return (
    <section className="mer-section-sm">
      <div className="mer-container">
        <div className="mer-cta-banner" data-reveal="scale">
          <span className="mer-overline" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Ready to get started?
          </span>
          <h2 className="mer-h2 mer-mt-sm" style={{ color: '#fff' }}>
            Let&apos;s discuss your matter
          </h2>
          <p className="mer-body-lg mer-mt-md" style={{ color: 'rgba(255,255,255,0.72)', maxWidth: '520px', margin: 'var(--mer-spacing-md) auto 0' }}>
            Our team is ready to provide expert guidance. Contact us today for a confidential consultation.
          </p>
          <div className="mer-cta-banner-actions">
            <a href="/contact" className="mer-btn mer-btn-white">
              Get in Touch
            </a>
            <a href="/services" className="mer-btn mer-btn-white-outline">
              Our Services
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   VARIANT: split-hero
   ───────────────────────────────────────────────────────────────────────────── */

function SplitHeroVariant({ config, services, testimonials }: { config: PageProps['config']; services: ServiceItem[]; testimonials: TestimonialItem[] }) {
  const siteName   = config.settings?.siteName ?? config.tenant.name;
  const tagline    = config.settings?.tagline ?? config.pageConfig?.tagline ?? null;
  const pc         = config.pageConfig;

  const headline   = (pc as any)?.homeSplitHeroHeadline   ?? `Expert Legal & Professional Services`;
  const subheadline = (pc as any)?.homeSplitHeroSubheadline ?? `${siteName} provides trusted counsel to individuals and businesses navigating complex matters with clarity, integrity, and commitment.`;
  const heroImage  = (pc as any)?.homeSplitHeroImage?.url  ?? null;

  const cta1Text   = pc?.homeCta1Text  ?? 'Get in Touch';
  const cta1Link   = pc?.homeCta1Link  ?? '/contact';
  const cta2Text   = pc?.homeCta2Text  ?? 'Our Services';
  const cta2Link   = pc?.homeCta2Link  ?? '/services';

  const trustSignals = (pc as any)?.homeTrustSignals ?? DEMO_TRUST_SIGNALS;

  return (
    <>
      {/* Hero */}
      <section className="mer-hero-split">
        <div className="mer-hero-split-content">
          <div className="mer-container" style={{ maxWidth: '100%', paddingInline: 0 }}>
            <span className="mer-overline" data-reveal="fade">{tagline ?? 'Professional Excellence'}</span>
            <h1 className="mer-h1 mer-mt-md" data-reveal="up" style={{ transitionDelay: '60ms' }}>
              {headline}
            </h1>
            <p className="mer-body-lg mer-mt-lg" data-reveal="up" style={{ transitionDelay: '120ms', maxWidth: '520px', opacity: 0.8 }}>
              {subheadline}
            </p>

            {/* CTA buttons */}
            <div style={{ display: 'flex', gap: 'var(--mer-spacing-md)', flexWrap: 'wrap', marginTop: 'var(--mer-spacing-xl)', transitionDelay: '180ms' }} data-reveal="up">
              <a href={cta1Link} className="mer-btn mer-btn-primary mer-btn-lg">{cta1Text}</a>
              <a href={cta2Link} className="mer-btn mer-btn-outline mer-btn-lg">{cta2Text}</a>
            </div>

            {/* Trust signals */}
            <div className="mer-trust-bar" data-reveal="fade" style={{ transitionDelay: '240ms' }}>
              {trustSignals.map((ts: { text: string }) => (
                <div key={ts.text} className="mer-trust-item">
                  <span className="mer-trust-icon" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </span>
                  {ts.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mer-hero-split-media mer-img-zoom">
          {heroImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={heroImage}
              alt={`${siteName} professional services`}
              // eslint-disable-next-line react/no-unknown-property
              fetchPriority="high"
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              minHeight: '100%',
              background: `linear-gradient(135deg, var(--brand-primary, #1a2b5e) 0%, color-mix(in srgb, var(--brand-primary, #1a2b5e) 70%, var(--brand-secondary, #3b6cb7) 30%) 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'var(--mer-spacing-3xl)',
            }}>
              <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '5rem' }}>⚖️</div>
            </div>
          )}
        </div>
      </section>

      <ServicesGrid siteName={siteName} services={services} />
      <TestimonialsSection testimonials={testimonials} />
      <CtaBanner siteName={siteName} />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   VARIANT: full-hero
   ───────────────────────────────────────────────────────────────────────────── */

function FullHeroVariant({ config, services, testimonials }: { config: PageProps['config']; services: ServiceItem[]; testimonials: TestimonialItem[] }) {
  const siteName    = config.settings?.siteName ?? config.tenant.name;
  const tagline     = config.settings?.tagline  ?? null;
  const pc          = config.pageConfig;

  const headline    = (pc as any)?.homeFullHeroHeadline    ?? 'Expertise You Can Trust. Results That Matter.';
  const subheadline = (pc as any)?.homeFullHeroSubheadline ?? 'Professional legal and advisory services with over three decades of excellence.';
  const heroImage   = (pc as any)?.homeFullHeroImage?.url  ?? null;

  const cta1Text    = pc?.homeCta1Text ?? 'Get in Touch';
  const cta1Link    = pc?.homeCta1Link ?? '/contact';
  const cta2Text    = pc?.homeCta2Text ?? 'Our Services';
  const cta2Link    = pc?.homeCta2Link ?? '/services';

  return (
    <>
      <section className="mer-hero-full">
        <div className="mer-hero-full-bg">
          {heroImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={heroImage} alt="" aria-hidden="true" fetchPriority="high" />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              background: `linear-gradient(135deg, var(--brand-primary, #1a2b5e), color-mix(in srgb, var(--brand-primary, #1a2b5e) 50%, var(--brand-secondary, #3b6cb7) 50%))`,
            }} />
          )}
          <div className="mer-hero-full-overlay" />
        </div>

        <div className="mer-hero-full-content">
          {tagline && <span className="mer-overline" style={{ color: 'rgba(255,255,255,0.7)' }}>{tagline}</span>}
          <h1 className="mer-h1 mer-mt-md" data-reveal="up">
            {headline}
          </h1>
          <p className="mer-body-lg mer-mt-lg" data-reveal="up" style={{ transitionDelay: '80ms', color: 'rgba(255,255,255,0.8)' }}>
            {subheadline}
          </p>
          <div style={{ display: 'flex', gap: 'var(--mer-spacing-md)', justifyContent: 'center', flexWrap: 'wrap', marginTop: 'var(--mer-spacing-2xl)', transitionDelay: '160ms' }} data-reveal="up">
            <a href={cta1Link} className="mer-btn mer-btn-white mer-btn-lg">{cta1Text}</a>
            <a href={cta2Link} className="mer-btn mer-btn-white-outline mer-btn-lg">{cta2Text}</a>
          </div>
        </div>
      </section>

      <ServicesGrid siteName={siteName} services={services} />
      <TestimonialsSection testimonials={testimonials} />
      <CtaBanner siteName={siteName} />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   VARIANT: authority
   No image. Pure typographic authority.
   ───────────────────────────────────────────────────────────────────────────── */

function AuthorityVariant({ config, services, testimonials, counters }: { config: PageProps['config']; services: ServiceItem[]; testimonials: TestimonialItem[]; counters: { value: string; label: string }[] }) {
  const siteName    = config.settings?.siteName ?? config.tenant.name;
  const pc          = config.pageConfig;

  const headline    = (pc as any)?.homeAuthorityHeadline    ?? `Trusted advisors.\nExceptional outcomes.`;
  const subheadline = (pc as any)?.homeAuthoritySubheadline ?? `${siteName} has been a pillar of professional excellence for over three decades. We combine deep expertise with an unwavering commitment to our clients.`;

  const cta1Text    = pc?.homeCta1Text ?? 'Speak to Our Team';
  const cta1Link    = pc?.homeCta1Link ?? '/contact';
  const cta2Text    = pc?.homeCta2Text ?? 'View Our Services';
  const cta2Link    = pc?.homeCta2Link ?? '/services';

  const trustSignals = (pc as any)?.homeTrustSignals ?? DEMO_TRUST_SIGNALS;

  return (
    <>
      <section className="mer-hero-authority">
        <div className="mer-hero-authority-inner">
          <p className="mer-overline" data-reveal="fade">{config.settings?.tagline ?? 'Professional Services'}</p>
          <h1
            className="mer-hero-authority-headline mer-mt-md"
            data-reveal="up"
            style={{ whiteSpace: 'pre-line' }}
          >
            {headline}
          </h1>

          {/* CSS class handles the 1fr/auto grid + responsive stacking at 1024px */}
          <div className="mer-hero-authority-body">
            {/* data-reveal-stagger replaces broken inline transitionDelay on individual data-reveal elements */}
            <div data-reveal-stagger>
              <p className="mer-body-lg" style={{ maxWidth: '580px', opacity: 0.8 }}>
                {subheadline}
              </p>
              <div style={{ display: 'flex', gap: 'var(--mer-spacing-md)', flexWrap: 'wrap', marginTop: 'var(--mer-spacing-xl)' }}>
                <a href={cta1Link} className="mer-btn mer-btn-primary mer-btn-lg">{cta1Text}</a>
                <a href={cta2Link} className="mer-btn mer-btn-ghost mer-btn-lg">{cta2Text}</a>
              </div>
            </div>

            {/* Vertical stat strip — live counters */}
            {counters.length > 0 && (
              <div className="mer-hero-authority-counters" data-reveal-stagger>
                {counters.slice(0, 3).map((m) => (
                  <div key={m.label}>
                    <div style={{ fontFamily: 'var(--font-heading, inherit)', fontSize: '2rem', fontWeight: 700, color: 'var(--brand-primary, #1a2b5e)', lineHeight: 1, letterSpacing: '-0.02em' }}>
                      {m.value}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'color-mix(in srgb, var(--brand-text, #444) 60%, transparent)', marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Trust signals row */}
        <div className="mer-hero-authority-inner" style={{ marginTop: 'var(--mer-spacing-2xl)', paddingTop: 'var(--mer-spacing-2xl)', borderTop: '1px solid var(--mer-border-color)' }}>
          <div className="mer-trust-bar" data-reveal-stagger>
            {trustSignals.map((ts: { text: string }) => (
              <div key={ts.text} className="mer-trust-item">
                <span className="mer-trust-icon" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </span>
                {ts.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      <ServicesGrid siteName={siteName} services={services} />
      <TestimonialsSection testimonials={testimonials} />
      <CtaBanner siteName={siteName} />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   VARIANT: metrics
   Hero headline + animated counter strip immediately below fold.
   ───────────────────────────────────────────────────────────────────────────── */

function MetricsVariant({ config, services, testimonials, counters }: { config: PageProps['config']; services: ServiceItem[]; testimonials: TestimonialItem[]; counters: { value: string; label: string }[] }) {
  const siteName    = config.settings?.siteName ?? config.tenant.name;
  const tagline     = config.settings?.tagline  ?? null;
  const pc          = config.pageConfig;

  const headline    = (pc as any)?.homeMetricsHeadline    ?? 'A Track Record Built on Results';
  const subheadline = (pc as any)?.homeMetricsSubheadline ?? `For over three decades, ${siteName} has delivered exceptional outcomes for our clients. Our numbers speak for themselves.`;
  const heroImage   = (pc as any)?.homeMetricsHeroImage?.url ?? null;

  const cta1Text    = pc?.homeCta1Text ?? 'Schedule a Consultation';
  const cta1Link    = pc?.homeCta1Link ?? '/contact';
  const cta2Text    = pc?.homeCta2Text ?? 'Our Practice Areas';
  const cta2Link    = pc?.homeCta2Link ?? '/services';

  return (
    <>
      <section className="mer-hero-metrics">
        {/* Hero top */}
        <div className="mer-hero-metrics-top">
          <div className="mer-container">
            <div style={{ display: 'grid', gridTemplateColumns: heroImage ? '1fr 1fr' : '1fr', gap: 'var(--mer-spacing-3xl)', alignItems: 'center', minHeight: '420px' }}>
              <div>
                {tagline && <span className="mer-overline" data-reveal="fade">{tagline}</span>}
                <h1 className="mer-h1 mer-mt-md" data-reveal="up">
                  {headline}
                </h1>
                <p className="mer-body-lg mer-mt-lg" data-reveal="up" style={{ transitionDelay: '80ms', opacity: 0.8, maxWidth: '500px' }}>
                  {subheadline}
                </p>
                <div style={{ display: 'flex', gap: 'var(--mer-spacing-md)', flexWrap: 'wrap', marginTop: 'var(--mer-spacing-xl)', transitionDelay: '160ms' }} data-reveal="up">
                  <a href={cta1Link} className="mer-btn mer-btn-primary mer-btn-lg">{cta1Text}</a>
                  <a href={cta2Link} className="mer-btn mer-btn-outline mer-btn-lg">{cta2Text}</a>
                </div>
              </div>

              {heroImage && (
                <div className="mer-img-zoom" style={{ borderRadius: 'var(--mer-radius-xl)', overflow: 'hidden', height: '420px' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={heroImage} alt="" aria-hidden="true" style={{ width: '100%', height: '100%', objectFit: 'cover' }} fetchPriority="high" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Animated counter strip */}
        <div className="mer-metrics-strip">
          <div className="mer-metrics-grid" data-reveal-stagger>
            {counters.map((c) => (
              <div key={c.label} className="mer-metric-item">
                <MeridianCounters targetValue={c.value} className="mer-metric-value" />
                <div className="mer-metric-label">{c.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ServicesGrid siteName={siteName} services={services} />
      <TestimonialsSection testimonials={testimonials} />
      <CtaBanner siteName={siteName} />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ROOT EXPORT — async, fetches shared data once, routes to variant
   ───────────────────────────────────────────────────────────────────────────── */

export default async function HomePage({ config, variant }: PageProps) {
  const tenantSlug = config.tenant.slug;
  const pc         = config.pageConfig as any;

  // Fetch live services (used in all variants' practice area grid)
  const svcRes = await getServices(tenantSlug);
  const services: ServiceItem[] = (svcRes?.docs ?? DEMO_SERVICES as any[])
    .filter((s: any) => s.published !== false)
    .slice(0, 6); // Cap at 6 for the home grid

  // Testimonials come from pageConfig (MeridianSiteConfig home tab)
  const testimonials: TestimonialItem[] =
    (pc?.homeTestimonials && pc.homeTestimonials.length > 0)
      ? pc.homeTestimonials
      : DEMO_TESTIMONIALS;

  // Counters for authority / metrics variants
  const counters: { value: string; label: string }[] =
    (pc?.homeMetricsCounters && pc.homeMetricsCounters.length > 0)
      ? pc.homeMetricsCounters
      : DEMO_METRICS;

  switch (variant) {
    case 'full-hero':  return <FullHeroVariant  config={config} services={services} testimonials={testimonials} />;
    case 'authority':  return <AuthorityVariant config={config} services={services} testimonials={testimonials} counters={counters} />;
    case 'metrics':    return <MetricsVariant   config={config} services={services} testimonials={testimonials} counters={counters} />;
    case 'split-hero':
    default:           return <SplitHeroVariant config={config} services={services} testimonials={testimonials} />;
  }
}
