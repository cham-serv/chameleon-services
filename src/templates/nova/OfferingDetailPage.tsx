/**
 * Nova Offering Detail Page
 *
 * Individual offering page with rich GEO:
 * - Service JSON-LD with provider, areaServed
 * - FAQPage JSON-LD (if offering has associated FAQs)
 * - BreadcrumbList JSON-LD: Home → {Offerings} → {Name}
 * - data-speakable on the description paragraph
 *
 * This is the page that gives Nova its GEO punch — each offering
 * gets its own crawlable, schema-rich page that AI engines can
 * cite independently.
 */

import { notFound } from 'next/navigation';
import type { PageProps } from '@/lib/types';
import { getServiceBySlug, getFaqs } from '@/lib/api';
import { RichTextRenderer } from '@/components/RichTextRenderer';
import { JsonLd } from '@/components/JsonLd';

export default async function OfferingDetailPage({ config, path, noCache }: PageProps) {
  const siteName = config.settings?.siteName ?? config.tenant.name;
  const pc = config.pageConfig as any;
  const offeringsSlug = pc?.offeringsSlug ?? 'services';
  const offeringsLabel = pc?.offeringsLabel ?? 'Services';

  // The last segment is the offering slug
  const offeringSlug = path[path.length - 1];
  if (!offeringSlug) notFound();

  const service = await getServiceBySlug(config.tenant.slug, offeringSlug, noCache);
  if (!service) notFound();

  // Fetch FAQs for this offering (uses service slug as category filter)
  const faqsData = await getFaqs(config.tenant.slug, offeringSlug, noCache);
  const faqs = faqsData?.docs ?? [];

  // Build site URL
  const siteUrl = config.tenant.slug.includes('.')
    ? `https://${config.tenant.slug}`
    : `https://${config.tenant.slug}.chameleon.services`;

  const pageUrl = `${siteUrl}/${offeringsSlug}/${service.slug}`;

  // Service image
  const imageUrl = service.image && typeof service.image === 'object' && 'url' in service.image
    ? (service.image as { url: string }).url
    : null;

  // BreadcrumbList JSON-LD
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: offeringsLabel, item: `${siteUrl}/${offeringsSlug}` },
      { '@type': 'ListItem', position: 3, name: service.name, item: pageUrl },
    ],
  };

  // Service JSON-LD
  const serviceLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    url: pageUrl,
    provider: { '@id': `${siteUrl}/#business` },
  };
  if (service.shortDescription) serviceLd.description = service.shortDescription;
  if (imageUrl) serviceLd.image = imageUrl;
  if (config.settings?.addressCity) {
    serviceLd.areaServed = {
      '@type': 'City',
      name: config.settings.addressCity,
    };
  }

  // FAQPage JSON-LD (only if there are FAQs for this offering)
  const faqLd = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    name: `FAQs about ${service.name}`,
    mainEntity: faqs.map((faq: any) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.executiveSummary || faq.answer || faq.question,
      },
    })),
  } : null;

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={serviceLd} />
      {faqLd && <JsonLd data={faqLd} />}

      <div className="nova-section">
        <div className="nova-container">
          {/* ── Breadcrumbs ──────────────────────────────── */}
          <nav style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--nova-text-subtle)' }}>
              <a href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</a>
              {' / '}
              <a href={`/${offeringsSlug}`} style={{ color: 'inherit', textDecoration: 'none' }}>{offeringsLabel}</a>
              {' / '}
              <span style={{ color: 'var(--nova-text)' }}>{service.name}</span>
            </span>
          </nav>

          {/* ── Hero Image ────────────────────────────────── */}
          {imageUrl && (
            <img
              src={imageUrl}
              alt={service.name}
              className="nova-offering-hero"
            />
          )}

          {/* ── Title & Description ───────────────────────── */}
          <h1 className="nova-heading nova-heading--page" style={{ marginBottom: '1rem' }}>
            {service.name}
          </h1>

          {service.shortDescription && (
            <p
              className="nova-subheading"
              data-speakable
              style={{ marginBottom: '2rem' }}
            >
              {service.shortDescription}
            </p>
          )}

          {/* ── Full Description (richtext) ───────────────── */}
          {service.description ? (
            <div className="nova-richtext" style={{ marginBottom: '3rem' }}>
              <RichTextRenderer content={service.description} />
            </div>
          ) : null}

          {/* ── Per-Offering FAQs ─────────────────────────── */}
          {faqs.length > 0 && (
            <section style={{ marginBottom: '3rem' }}>
              <h2 className="nova-heading nova-heading--section" style={{ marginBottom: '1.25rem' }}>
                Common Questions about {service.name}
              </h2>
              {faqs.map((faq: any) => (
                <details
                  key={faq.id}
                  className="nova-faq"
                  id={faq.slug ? `faq-${faq.slug}` : undefined}
                >
                  <summary>{faq.question}</summary>
                  <div className="nova-faq__body">
                    {faq.executiveSummary && (
                      <p className="nova-faq__bluf" data-speakable>{faq.executiveSummary}</p>
                    )}
                    <p>{typeof faq.answer === 'string' ? faq.answer : ''}</p>
                  </div>
                </details>
              ))}
            </section>
          )}

          {/* ── CTA ───────────────────────────────────────── */}
          <div className="nova-cta-section">
            <h2 className="nova-heading nova-heading--section">
              Interested in {service.name}?
            </h2>
            <p className="nova-subheading" style={{ margin: '0.75rem auto 0' }}>
              Get in touch to discuss how we can help.
            </p>
            <div style={{ marginTop: '1.75rem' }}>
              <a href="/contact" className="nova-btn nova-btn--primary">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
