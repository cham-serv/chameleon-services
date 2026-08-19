/**
 * Atlas FAQsPage — Server Component
 *
 * Variants:
 *   - accordion (default): Category-grouped expand/collapse with search filter.
 *   - search:              Help-center style — prominent search hero + category cards.
 *
 * Schema injected (multi-schema, matches Resources/Shop GEO standard):
 *   1. BreadcrumbList
 *   2. FAQPage — all published FAQs as Question/Answer structured data
 *
 * Data: server-fetches all FAQs, groups by category, passes pre-built
 * categories array to client components (no client-side API calls).
 */

import type { PageProps } from '@/lib/types';
import { getFaqs, type FAQ } from '@/lib/api';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { AtlasFaqAccordion } from './AtlasFaqAccordion';
import { AtlasFaqSearch } from './AtlasFaqSearch';
import { buildBreadcrumbLd, buildFAQPageLd } from '@/lib/jsonld';

export default async function FAQsPage({ config, variant, noCache }: PageProps) {
  const tenant = config.tenant.slug;
  const siteName = config.settings?.siteName ?? config.tenant.name;
  const siteUrl = `https://${tenant}.chameleon.services`;
  const pc = config.pageConfig;

  const headline    = pc?.faqsHeadline    ?? 'Frequently Asked Questions';
  const subheadline = pc?.faqsSubheadline ?? `Find answers to common questions about ${siteName} and our services.`;

  const res = await getFaqs(tenant, undefined, noCache);
  const faqs: FAQ[] = res?.docs ?? [];

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'FAQs' },
  ];

  // Group by category
  const grouped = new Map<string, FAQ[]>();
  for (const faq of faqs) {
    const cat = faq.category || 'General';
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(faq);
  }
  const categories = Array.from(grouped.entries());

  // JSON-LD schemas
  const breadcrumbSchema = buildBreadcrumbLd([
    { name: 'Home', url: `${siteUrl}/` },
    { name: 'FAQs', url: `${siteUrl}/faqs` },
  ]);

  const faqSchema = buildFAQPageLd(faqs, config, siteUrl);

  const schemas = (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
    </>
  );

  // Empty state — shared across variants
  const emptyState = (
    <div className="atlas-card-flat" style={{ padding: 'var(--atlas-spacing-2xl)', textAlign: 'center', marginTop: 'var(--atlas-spacing-2xl)' }}>
      <p className="atlas-body" style={{ opacity: 0.6 }}>
        No FAQs have been added yet. Check back soon.
      </p>
    </div>
  );

  // Variant: search — help-center layout with prominent search hero
  if (variant === 'search') {
    return (
      <>
        {schemas}
        <div className="atlas-container atlas-section-xs" style={{ marginBottom: 0 }}>
          <Breadcrumbs items={breadcrumbs} baseUrl={siteUrl} />
        </div>
        <div className="atlas-faq-search-page">
          <div className="atlas-container">
            <h1 className="atlas-h1 atlas-faq-page-headline" data-speakable="true">{headline}</h1>
            <p className="atlas-body-lg atlas-faq-page-subheadline">{subheadline}</p>
          </div>
          <div className="atlas-container" style={{ marginTop: 'var(--atlas-spacing-2xl)' }}>
            {faqs.length === 0 ? emptyState : (
              <AtlasFaqSearch categories={categories} />
            )}
          </div>
        </div>
      </>
    );
  }

  // Variant: accordion (default)
  return (
    <>
      {schemas}
      <div className="atlas-container atlas-section-sm">
        <Breadcrumbs items={breadcrumbs} baseUrl={siteUrl} />
        <h1 className="atlas-h1 atlas-faq-page-headline" data-speakable="true" style={{ marginTop: 'var(--atlas-spacing-lg)' }}>
          {headline}
        </h1>
        <p className="atlas-body-lg atlas-faq-page-subheadline" style={{ marginTop: 'var(--atlas-spacing-sm)', opacity: 0.7, maxWidth: 600 }}>
          {subheadline}
        </p>
        {faqs.length === 0 ? emptyState : (
          <AtlasFaqAccordion categories={categories} />
        )}
      </div>
    </>
  );
}