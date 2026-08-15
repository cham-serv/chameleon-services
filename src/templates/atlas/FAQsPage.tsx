/**
 * Atlas FAQsPage — Server Component (wraps a client accordion)
 *
 * Fetches FAQs, groups by category, renders with FAQPage JSON-LD.
 * Client-side search filter is handled by AtlasFaqAccordion.
 */

import type { PageProps } from '@/lib/types';
import { getFaqs, type FAQ } from '@/lib/api';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { AtlasFaqAccordion } from './AtlasFaqAccordion';

export default async function FAQsPage({ config }: PageProps) {
  const tenant = config.tenant.slug;
  const siteName = config.settings?.siteName ?? config.tenant.name;
  const siteUrl = `https://${tenant}.chameleon.services`;

  const res = await getFaqs(tenant);
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

  // FAQPage JSON-LD
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    name: `Frequently Asked Questions — ${siteName}`,
    url: `${siteUrl}/faqs`,
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: typeof faq.answer === 'string' ? faq.answer : '',
      },
    })),
  };

  return (
    <>
      <JsonLd data={faqSchema} />

      <div className="atlas-container atlas-section-sm">
        <Breadcrumbs items={breadcrumbs} baseUrl={siteUrl} />

        <h1 className="atlas-h1" style={{ marginTop: 'var(--atlas-spacing-lg)' }}>
          Frequently Asked Questions
        </h1>
        <p className="atlas-body-lg" style={{ marginTop: 'var(--atlas-spacing-sm)', opacity: 0.7, maxWidth: 600 }}>
          Find answers to common questions about {siteName} and our services.
        </p>

        {faqs.length === 0 ? (
          <div className="atlas-card-flat" style={{ padding: 'var(--atlas-spacing-2xl)', textAlign: 'center', marginTop: 'var(--atlas-spacing-2xl)' }}>
            <p className="atlas-body" style={{ opacity: 0.6 }}>
              No FAQs have been added yet. Check back soon.
            </p>
          </div>
        ) : (
          <AtlasFaqAccordion categories={categories} />
        )}
      </div>
    </>
  );
}
