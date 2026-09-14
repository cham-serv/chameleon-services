/**
 * Nova Legal Page
 *
 * Tabbed legal document viewer with:
 * - Privacy Policy, Terms & Conditions, Refund Policy tabs
 * - Rich text rendering for each document
 * - Client-side tab switching (no re-render)
 */

import type { PageProps } from '@/lib/types';
import { getLegalDocs } from '@/lib/api';
import { RichTextRenderer } from '@/components/RichTextRenderer';
import { NovaLegalTabs } from './NovaLegalTabs';

export default async function LegalPage({ config, noCache }: PageProps) {
  const pc = config.pageConfig as any;

  const headline = pc?.legalSeoTitle ?? 'Legal';

  const docs = await getLegalDocs(config.tenant.slug, noCache);

  // Build tabs from available documents
  const tabs: Array<{ id: string; label: string; content: unknown }> = [];

  if (docs?.privacyPolicy) {
    tabs.push({ id: 'privacy', label: 'Privacy Policy', content: docs.privacyPolicy });
  }
  if (docs?.termsAndConditions || docs?.termsOfService) {
    tabs.push({
      id: 'terms',
      label: 'Terms & Conditions',
      content: docs.termsAndConditions ?? docs.termsOfService,
    });
  }
  if (docs?.refundPolicy) {
    tabs.push({ id: 'refund', label: 'Refund Policy', content: docs.refundPolicy });
  }
  if (docs?.cookiePolicy) {
    tabs.push({ id: 'cookies', label: 'Cookie Policy', content: docs.cookiePolicy });
  }
  if (docs?.shippingPolicy) {
    tabs.push({ id: 'shipping', label: 'Shipping Policy', content: docs.shippingPolicy });
  }

  return (
    <>
      {/* ── Page Header ───────────────────────────────── */}
      <div className="nova-page-header">
        <div className="nova-container">
          <h1 className="nova-heading nova-heading--page nova-page-header__title">
            {headline}
          </h1>
        </div>
      </div>

      {/* ── Legal Content ─────────────────────────────── */}
      <section className="nova-section--sm">
        <div className="nova-container" style={{ maxWidth: 760 }}>
          {tabs.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--nova-text-muted)' }}>
              No legal documents have been published yet.
            </p>
          ) : (
            <>
              <NovaLegalTabs tabs={tabs.map((t) => ({ id: t.id, label: t.label }))} />
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  id={`legal-${tab.id}`}
                  className="nova-legal-content"
                  data-legal-panel={tab.id}
                >
                  <RichTextRenderer content={tab.content} />
                </div>
              ))}
            </>
          )}

          {docs?.lastReviewedAt && (
            <p style={{
              fontSize: '0.8125rem',
              color: 'var(--nova-text-subtle)',
              marginTop: '2rem',
              textAlign: 'center',
            }}>
              Last reviewed: {new Date(docs.lastReviewedAt).toLocaleDateString('en-ZA', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
