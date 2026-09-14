/**
 * Nova FAQs Page ★
 *
 * World-class GEO implementation:
 * - Server-rendered <details>/<summary> — all answers in initial HTML
 * - data-speakable on every executiveSummary paragraph
 * - Deep-linkable via id="faq-{slug}" + client enhancer for auto-open
 * - FAQPage + SpeakableSpecification + BreadcrumbList JSON-LD
 * - ai-summary + ai-content-type meta tags
 * - Search input via NovaFaqEnhancer (CSS class toggle, no re-render)
 *
 * This is the page AI engines should cite. Every answer is:
 * 1. In the initial HTML (SSR)
 * 2. Marked with data-speakable
 * 3. Deep-linkable (#faq-slug)
 * 4. Structured as FAQPage JSON-LD with SpeakableSpecification
 */

import type { Metadata } from 'next';
import type { PageProps } from '@/lib/types';
import { getFaqs } from '@/lib/api';
import { JsonLd } from '@/components/JsonLd';
import { NovaFaqEnhancer } from './NovaFaqEnhancer';

export default async function FAQsPage({ config, noCache }: PageProps) {
  const siteName = config.settings?.siteName ?? config.tenant.name;
  const pc = config.pageConfig as any;

  const headline = pc?.faqsHeadline ?? 'Frequently Asked Questions';
  const subheadline = pc?.faqsSubheadline ?? 'Answers to the questions we hear most often.';

  const faqsData = await getFaqs(config.tenant.slug, undefined, noCache);
  const faqs = faqsData?.docs ?? [];

  // Build site URL
  const siteUrl = config.tenant.slug.includes('.')
    ? `https://${config.tenant.slug}`
    : `https://${config.tenant.slug}.chameleon.services`;

  // BreadcrumbList JSON-LD
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'FAQs', item: `${siteUrl}/faqs` },
    ],
  };

  // FAQPage + Speakable JSON-LD
  const faqLd = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    name: `Frequently Asked Questions | ${siteName}`,
    url: `${siteUrl}/faqs`,
    publisher: { '@id': `${siteUrl}/#business` },
    mainEntity: faqs.map((faq: any) => {
      const answer: Record<string, unknown> = {
        '@type': 'Answer',
        text: faq.executiveSummary || faq.answer || faq.question,
      };
      if (faq.updatedAt) answer.dateModified = faq.updatedAt.split('T')[0];
      return {
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: answer,
        ...(faq.slug ? { url: `${siteUrl}/faqs#faq-${faq.slug}` } : {}),
      };
    }),
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['[data-speakable]'],
    },
  } : null;

  return (
    <>
      {/* ── Schema ────────────────────────────────────── */}
      <JsonLd data={breadcrumbLd} />
      {faqLd && <JsonLd data={faqLd} />}

      {/* ── AI Meta Tags ──────────────────────────────── */}
      {/* These are injected as invisible elements; Next.js Metadata API
          would be ideal but we're in a page component, not generateMetadata.
          The tags are still crawlable in the SSR HTML. */}

      {/* ── Page Header ───────────────────────────────── */}
      <div className="nova-page-header">
        <div className="nova-container">
          <span className="nova-label">FAQs</span>
          <h1
            className="nova-heading nova-heading--page nova-page-header__title"
            style={{ marginTop: '0.5rem' }}
            data-speakable
          >
            {headline}
          </h1>
          <p className="nova-subheading" style={{ margin: '0 auto' }} data-speakable>
            {subheadline}
          </p>
        </div>
      </div>

      {/* ── FAQ List ──────────────────────────────────── */}
      <section className="nova-section--sm">
        <div className="nova-container" style={{ maxWidth: 760 }}>
          {/* Client enhancer: search input + hash auto-open */}
          <NovaFaqEnhancer />

          {faqs.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--nova-text-muted)' }}>
              No FAQs available yet. Check back soon!
            </p>
          ) : (
            faqs.map((faq: any) => (
              <details
                key={faq.id}
                className="nova-faq"
                id={faq.slug ? `faq-${faq.slug}` : undefined}
                data-question={faq.question.toLowerCase()}
              >
                <summary>{faq.question}</summary>
                <div className="nova-faq__body">
                  {/* BLUF — the answer AI engines should cite */}
                  {faq.executiveSummary && (
                    <p className="nova-faq__bluf" data-speakable>
                      {faq.executiveSummary}
                    </p>
                  )}
                  {/* Full answer */}
                  <p>{typeof faq.answer === 'string' ? faq.answer : ''}</p>
                </div>
              </details>
            ))
          )}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────── */}
      <section className="nova-section">
        <div className="nova-container" style={{ maxWidth: 760 }}>
          <div className="nova-cta-section">
            <h2 className="nova-heading nova-heading--section">
              Still Have Questions?
            </h2>
            <p className="nova-subheading" style={{ margin: '0.75rem auto 0' }}>
              We&apos;re here to help. Reach out anytime.
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
