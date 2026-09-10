'use client';

/**
 * MeridianLegalTabsClient
 *
 * Client component for the Legal page tab navigation.
 * - Reads ?tab= from URL on mount to support direct links
 * - Updates URL when user switches tabs (router.replace, no scroll)
 * - Renders the active tab's Lexical rich text via RichTextRenderer
 *
 * Uses .mer-legal-tabs and .mer-legal-tab CSS classes from meridian.css.
 */

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { RichTextRenderer } from '@/components/RichTextRenderer';

type LegalTab = {
  key: string;
  label: string;
  content: unknown;
};

interface Props {
  tabs: LegalTab[];
  activeTab: string;
}

export default function MeridianLegalTabsClient({ tabs, activeTab }: Props) {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  const currentKey = searchParams.get('tab') ?? activeTab;
  const current    = tabs.find((t) => t.key === currentKey) ?? tabs[0];

  function switchTab(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', key);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  if (!tabs.length) {
    return (
      <p className="mer-body" style={{ opacity: 0.6 }}>No legal documents have been published yet.</p>
    );
  }

  return (
    <>
      {/* Tab bar */}
      <div className="mer-legal-tabs" role="tablist" aria-label="Legal documents">
        {tabs.map((tab) => {
          const isActive = tab.key === current?.key;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`legal-panel-${tab.key}`}
              id={`legal-tab-${tab.key}`}
              data-active={isActive ? 'true' : 'false'}
              className="mer-legal-tab"
              onClick={() => switchTab(tab.key)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div
        role="tabpanel"
        id={`legal-panel-${current?.key}`}
        aria-labelledby={`legal-tab-${current?.key}`}
        style={{ marginTop: 'var(--mer-spacing-2xl)' }}
      >
        {current?.content != null ? (
          <div className="mer-prose">
            <RichTextRenderer content={current.content as Record<string, unknown>} />
          </div>
        ) : (
          <p className="mer-body" style={{ opacity: 0.55 }}>
            This document has not been published yet.
          </p>
        )}
      </div>
    </>
  );
}