/**
 * Nova Offerings Page (Overview)
 *
 * Displays all services/products/programmes in a card grid.
 * Two variants: cards (image + description) and list (clean vertical).
 * Each card links to the detail page and shows a modal preview on click.
 *
 * GEO: CollectionPage + ItemList JSON-LD.
 */

import type { PageProps } from '@/lib/types';
import { getServices } from '@/lib/api';
import { JsonLd } from '@/components/JsonLd';

export default async function OfferingsPage({ config, variant, noCache }: PageProps) {
  const siteName = config.settings?.siteName ?? config.tenant.name;
  const pc = config.pageConfig as any;
  const offeringsSlug = pc?.offeringsSlug ?? 'services';
  const offeringsLabel = pc?.offeringsLabel ?? 'Services';

  const headline = pc?.offeringsHeadline ?? `Our ${offeringsLabel}`;
  const subheadline = pc?.offeringsSubheadline ?? null;

  const servicesData = await getServices(config.tenant.slug, noCache);
  const services = servicesData?.docs ?? [];

  // CollectionPage + ItemList JSON-LD
  const siteUrl = config.tenant.slug.includes('.')
    ? `https://${config.tenant.slug}`
    : `https://${config.tenant.slug}.chameleon.services`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${offeringsLabel} | ${siteName}`,
    url: `${siteUrl}/${offeringsSlug}`,
    description: subheadline ?? `Browse our ${offeringsLabel.toLowerCase()}.`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: services.length,
      itemListElement: services.map((service, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${siteUrl}/${offeringsSlug}/${service.slug}`,
        name: service.name,
        ...(service.shortDescription ? { description: service.shortDescription } : {}),
      })),
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* ── Page Header ───────────────────────────────── */}
      <div className="nova-page-header">
        <div className="nova-container">
          <span className="nova-label">{offeringsLabel}</span>
          <h1 className="nova-heading nova-heading--page nova-page-header__title" style={{ marginTop: '0.5rem' }}>
            {headline}
          </h1>
          {subheadline && (
            <p className="nova-subheading" style={{ margin: '0 auto' }}>
              {subheadline}
            </p>
          )}
        </div>
      </div>

      {/* ── Offerings Grid ────────────────────────────── */}
      <section className="nova-section--sm">
        <div className="nova-container">
          {services.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--nova-text-muted)' }}>
              No {offeringsLabel.toLowerCase()} available yet. Check back soon!
            </p>
          ) : (
            <div className={`nova-grid ${variant === 'list' ? '' : 'nova-grid--2'}`}>
              {services.map((service) => (
                <a
                  key={service.id}
                  href={`/${offeringsSlug}/${service.slug}`}
                  className="nova-card"
                  style={{
                    textDecoration: 'none',
                    ...(variant === 'list' ? { display: 'flex', gap: '1.5rem', alignItems: 'center' } : {}),
                  }}
                >
                  {service.image && typeof service.image === 'object' && 'url' in service.image && (
                    <img
                      src={service.image.url}
                      alt={service.name}
                      className="nova-card__image"
                      style={variant === 'list' ? {
                        width: 160,
                        height: 100,
                        flexShrink: 0,
                        marginBottom: 0,
                        aspectRatio: 'auto',
                      } : {}}
                    />
                  )}
                  <div>
                    <h2 className="nova-card__title">{service.name}</h2>
                    {service.shortDescription && (
                      <p className="nova-card__description">{service.shortDescription}</p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────── */}
      <section className="nova-section">
        <div className="nova-container">
          <div className="nova-cta-section">
            <h2 className="nova-heading nova-heading--section">
              Interested in Our {offeringsLabel}?
            </h2>
            <p className="nova-subheading" style={{ margin: '0.75rem auto 0' }}>
              Get in touch to discuss your needs.
            </p>
            <div style={{ marginTop: '1.75rem' }}>
              <a href="/contact" className="nova-btn nova-btn--primary">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
