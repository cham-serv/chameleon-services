/**
 * Atlas LegalPage — Server Component (wraps a client tab navigator)
 *
 * Fetches legal documents, renders whichever tabs have content.
 * Active tab stored in searchParams.tab for direct-linkability.
 */

import type { PageProps } from '@/lib/types';
import { getLegalDocs } from '@/lib/api';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AtlasLegalTabs } from './AtlasLegalTabs';

type LegalTab = {
  key: string;
  label: string;
  content: unknown;
};

export default async function LegalPage({ config, searchParams }: PageProps) {
  const tenant = config.tenant.slug;
  const siteName = config.settings?.siteName ?? config.tenant.name;
  const siteUrl = `https://${tenant}.chameleon.services`;

  const docs = await getLegalDocs(tenant);

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Legal' },
  ];

  // Build tabs from available documents
  const allTabs: LegalTab[] = [
    { key: 'privacy', label: 'Privacy Policy', content: docs?.privacyPolicy },
    { key: 'terms', label: 'Terms & Conditions', content: docs?.termsAndConditions },
    { key: 'refund', label: 'Refund Policy', content: docs?.refundPolicy },
    { key: 'shipping', label: 'Shipping Policy', content: docs?.shippingPolicy },
    { key: 'cookies', label: 'Cookie Policy', content: docs?.cookiePolicy },
  ];

  const availableTabs = allTabs.filter((t) => t.content != null);

  // Determine active tab from searchParams
  const requestedTab = typeof searchParams.tab === 'string' ? searchParams.tab : undefined;
  const activeTab = availableTabs.find((t) => t.key === requestedTab)?.key ?? availableTabs[0]?.key ?? 'privacy';

  return (
    <div className="atlas-container atlas-section-sm">
      <Breadcrumbs items={breadcrumbs} baseUrl={siteUrl} />

      <h1 className="atlas-h1" style={{ marginTop: 'var(--atlas-spacing-lg)' }}>
        Legal
      </h1>
      <p className="atlas-body-lg" style={{ marginTop: 'var(--atlas-spacing-sm)', opacity: 0.7 }}>
        Important legal information for {siteName}.
      </p>

      {availableTabs.length === 0 ? (
        <div className="atlas-card-flat" style={{ padding: 'var(--atlas-spacing-2xl)', textAlign: 'center', marginTop: 'var(--atlas-spacing-2xl)' }}>
          <p className="atlas-body" style={{ opacity: 0.6 }}>
            No legal documents have been published yet.
          </p>
        </div>
      ) : (
        <AtlasLegalTabs
          tabs={availableTabs.map((t) => ({ key: t.key, label: t.label, content: t.content }))}
          activeTab={activeTab}
        />
      )}
    </div>
  );
}
