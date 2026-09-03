/**
 * Meridian LegalPage
 *
 * Tabbed viewer for legal documents (Privacy Policy, T&Cs, Cookie Policy, etc.)
 * Uses the design system .mer-legal-tabs / .mer-legal-tab classes.
 * Tab state is managed client-side (MeridianLegalTabsClient) and updates
 * the URL ?tab= param for direct-linkability.
 *
 * Only tabs with actual content are rendered — empty docs are omitted.
 */

import type { PageProps } from '@/lib/types';
import { getLegalDocs } from '@/lib/api';
import type { LegalDocs } from '@/lib/api';
import MeridianLegalTabsClient from './MeridianLegalTabsClient';

// ─── Placeholder richText when no real content ─────────────────────────────

const PLACEHOLDER: Record<string, unknown> = {
  root: {
    children: [
      {
        type: 'paragraph',
        children: [{ type: 'text', text: 'This document has not been published yet. Please contact us if you have questions.' }],
      },
    ],
  },
};

// ─── Root export ────────────────────────────────────────────────────────────

export default async function LegalPage({ config, searchParams }: PageProps) {
  const tenantSlug = config.tenant.slug;
  const rawTab     = searchParams?.tab;
  const activeTab  = (Array.isArray(rawTab) ? rawTab[0] : rawTab) ?? 'privacy-policy';

  const docs = await getLegalDocs(tenantSlug);

  // Build tabs list from fields that are actually present
  const allPossibleTabs: { key: string; label: string; content: unknown }[] = [
    { key: 'privacy-policy',    label: 'Privacy Policy',    content: docs?.privacyPolicy },
    { key: 'terms-conditions',  label: 'Terms & Conditions', content: docs?.termsAndConditions ?? docs?.termsOfService },
    { key: 'cookie-policy',     label: 'Cookie Policy',     content: docs?.cookiePolicy },
    { key: 'refund-policy',     label: 'Refund Policy',     content: docs?.refundPolicy },
  ];

  // Include tab if the doc has real content, or always include privacy + T&Cs
  // (fallback to placeholder so the page never shows zero tabs)
  const coreTabs = ['privacy-policy', 'terms-conditions'];
  const tabs = allPossibleTabs
    .filter((t) => t.content != null || coreTabs.includes(t.key))
    .map((t) => ({ ...t, content: t.content ?? PLACEHOLDER }));

  // Validate activeTab — fall back to first tab if invalid
  const resolvedTab = tabs.find((t) => t.key === activeTab)?.key ?? tabs[0]?.key ?? 'privacy-policy';

  // Last reviewed date for display
  const lastReviewed = docs?.lastReviewedAt
    ? new Intl.DateTimeFormat('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(docs.lastReviewedAt))
    : null;

  return (
    <>
      {/* Hero */}
      <section className="mer-section-sm" style={{ borderBottom: '1px solid var(--mer-border-color)' }}>
        <div className="mer-container">
          <div data-reveal="up">
            <span className="mer-overline">Legal</span>
            <h1 className="mer-h1" style={{ marginTop: 'var(--mer-spacing-md)', marginBottom: lastReviewed ? 'var(--mer-spacing-sm)' : undefined }}>
              Legal Documents
            </h1>
            {lastReviewed && (
              <p className="mer-caption" style={{ marginTop: 'var(--mer-spacing-sm)' }}>
                Last reviewed: {lastReviewed}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Tabbed content — client component */}
      <section className="mer-section">
        <div className="mer-container" style={{ maxWidth: 860 }}>
          <MeridianLegalTabsClient tabs={tabs} activeTab={resolvedTab} />
        </div>
      </section>
    </>
  );
}