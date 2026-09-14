/**
 * Nova Home Page
 *
 * Two variants:
 * - clean: Typography-led hero with no hero image
 * - hero-image: Full-bleed hero image with overlay text
 *
 * Both share: trust signals → services preview → testimonials → CTA
 */

import type { PageProps } from '@/lib/types';
import { getServices } from '@/lib/api';
import { JsonLd } from '@/components/JsonLd';

export default async function HomePage({ config, variant, noCache }: PageProps) {
  const siteName = config.settings?.siteName ?? config.tenant.name;
  const pc = config.pageConfig as any;
  const offeringsSlug = pc?.offeringsSlug ?? 'services';
  const offeringsLabel = pc?.offeringsLabel ?? 'Services';

  // Content from NovaSiteConfig
  const headline = pc?.homeHeadline ?? `Welcome to ${siteName}`;
  const subheadline = pc?.homeSubheadline ?? `Professional ${offeringsLabel.toLowerCase()} you can trust.`;
  const heroImage = pc?.homeHeroImage?.url ?? null;
  const cta1Text = pc?.homeCta1Text ?? 'Get in Touch';
  const cta1Link = pc?.homeCta1Link ?? '/contact';
  const cta2Text = pc?.homeCta2Text ?? null;
  const cta2Link = pc?.homeCta2Link ?? null;
  const trustSignals: Array<{ icon?: string; text: string }> = pc?.homeTrustSignals ?? [];
  const testimonials: Array<{
    quote: string;
    author: string;
    role?: string;
    rating?: number;
  }> = pc?.homeTestimonials ?? [];

  // Fetch services for preview section
  const servicesData = await getServices(config.tenant.slug, noCache);
  const services = servicesData?.docs?.slice(0, 4) ?? [];

  const isHeroImage = variant === 'hero-image' && heroImage;

  // Build site URL for JSON-LD
  const siteUrl = config.tenant.slug.includes('.')
    ? `https://${config.tenant.slug}`
    : `https://${config.tenant.slug}.chameleon.services`;

  const s = config.settings;

  // LocalBusiness JSON-LD — the core GEO schema for the home page
  const localBusinessLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': s?.businessType ?? 'LocalBusiness',
    '@id': `${siteUrl}/#business`,
    name: siteName,
    url: siteUrl,
  };
  if (s?.tagline) localBusinessLd.description = s.tagline;
  if (s?.contactEmail) localBusinessLd.email = s.contactEmail;
  if (s?.contactPhone) localBusinessLd.telephone = s.contactPhone;
  if (s?.priceRange) localBusinessLd.priceRange = s.priceRange;
  if (s?.logo?.url) localBusinessLd.logo = s.logo.url;
  if (s?.addressStreet || s?.addressCity) {
    localBusinessLd.address = {
      '@type': 'PostalAddress',
      ...(s.addressStreet ? { streetAddress: s.addressStreet } : {}),
      ...(s.addressCity ? { addressLocality: s.addressCity } : {}),
      ...(s.addressProvince ? { addressRegion: s.addressProvince } : {}),
      ...(s.addressPostalCode ? { postalCode: s.addressPostalCode } : {}),
      ...(s.addressCountry ? { addressCountry: s.addressCountry } : {}),
    };
  }
  if (s?.geoLat && s?.geoLng) {
    localBusinessLd.geo = {
      '@type': 'GeoCoordinates',
      latitude: s.geoLat,
      longitude: s.geoLng,
    };
  }
  // sameAs links
  const sameAs = [
    s?.socialFacebook, s?.socialInstagram, s?.socialLinkedIn,
    s?.socialTwitter, s?.socialYoutube, s?.socialGoogle,
  ].filter(Boolean);
  if (sameAs.length > 0) localBusinessLd.sameAs = sameAs;

  // WebSite JSON-LD
  const websiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    publisher: { '@id': `${siteUrl}/#business` },
  };

  return (
    <>
      {/* ── Schema ────────────────────────────────────── */}
      <JsonLd data={localBusinessLd} />
      <JsonLd data={websiteLd} />

      {/* ── Hero ──────────────────────────────────────── */}
      <section className={`nova-hero${isHeroImage ? ' nova-hero--image' : ''}`}>
        {isHeroImage && (
          <img src={heroImage} alt="" className="nova-hero__bg" />
        )}
        <div className="nova-hero__content">
          <h1 className="nova-heading nova-heading--hero" data-speakable>
            {headline}
          </h1>
          <p className="nova-subheading" style={{ margin: '1.25rem auto 0', textAlign: 'center' }}>
            {subheadline}
          </p>
          <div className="nova-hero__cta-row">
            <a href={cta1Link} className="nova-btn nova-btn--primary">{cta1Text}</a>
            {cta2Text && cta2Link && (
              <a href={cta2Link} className="nova-btn nova-btn--secondary">{cta2Text}</a>
            )}
          </div>
        </div>
      </section>

      {/* ── Trust Signals ─────────────────────────────── */}
      {trustSignals.length > 0 && (
        <section className="nova-section--sm">
          <div className="nova-container">
            <div className="nova-trust">
              {trustSignals.map((signal, i) => (
                <div key={i} className="nova-trust__item">
                  {signal.icon && <span className="nova-trust__icon">{signal.icon}</span>}
                  <span>{signal.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Services Preview ──────────────────────────── */}
      {services.length > 0 && (
        <section className="nova-section">
          <div className="nova-container">
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span className="nova-label">What We Offer</span>
              <h2 className="nova-heading nova-heading--section" style={{ marginTop: '0.5rem' }}>
                Our {offeringsLabel}
              </h2>
            </div>
            <div className="nova-grid nova-grid--2">
              {services.map((service) => (
                <a
                  key={service.id}
                  href={`/${offeringsSlug}/${service.slug}`}
                  className="nova-card"
                  style={{ textDecoration: 'none' }}
                >
                  {service.image && typeof service.image === 'object' && 'url' in service.image && (
                    <img src={service.image.url} alt={service.name} className="nova-card__image" />
                  )}
                  <h3 className="nova-card__title">{service.name}</h3>
                  {service.shortDescription && (
                    <p className="nova-card__description">{service.shortDescription}</p>
                  )}
                </a>
              ))}
            </div>
            {services.length >= 4 && (
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <a href={`/${offeringsSlug}`} className="nova-btn nova-btn--secondary">
                  View All {offeringsLabel} →
                </a>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Testimonials ──────────────────────────────── */}
      {testimonials.length > 0 && (
        <section className="nova-section">
          <div className="nova-container">
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span className="nova-label">What People Say</span>
              <h2 className="nova-heading nova-heading--section" style={{ marginTop: '0.5rem' }}>
                Trusted by Our Clients
              </h2>
            </div>
            <div className="nova-testimonials">
              {testimonials.map((t, i) => (
                <div key={i} className="nova-testimonial">
                  {t.rating && (
                    <div className="nova-testimonial__stars">
                      {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                    </div>
                  )}
                  <p className="nova-testimonial__quote">{t.quote}</p>
                  <div className="nova-testimonial__author">{t.author}</div>
                  {t.role && <div className="nova-testimonial__role">{t.role}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ───────────────────────────────────────── */}
      <section className="nova-section">
        <div className="nova-container">
          <div className="nova-cta-section">
            <h2 className="nova-heading nova-heading--section">
              Ready to Get Started?
            </h2>
            <p className="nova-subheading" style={{ margin: '0.75rem auto 0' }}>
              Get in touch today and let&apos;s discuss how we can help.
            </p>
            <div style={{ marginTop: '1.75rem' }}>
              <a href="/contact" className="nova-btn nova-btn--primary">
                {cta1Text}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
