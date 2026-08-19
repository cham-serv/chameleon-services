'use client';

/**
 * AtlasLegalTabs  Client Component
 *
 * Tab navigation for legal documents. Updates URL searchParams for
 * direct-linkability. Renders content via RichTextRenderer.
 */

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { RichTextRenderer } from '@/components/RichTextRenderer';

type LegalTabData = {
  key: string;
  label: string;
  content: unknown;
};

type AtlasLegalTabsProps = {
  tabs: LegalTabData[];
  activeTab: string;
};

export function AtlasLegalTabs({ tabs, activeTab }: AtlasLegalTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function switchTab(tabKey: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tabKey);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const currentTab = tabs.find((t) => t.key === activeTab) ?? tabs[0];

  return (
    <div style={{ marginTop: 'var(--atlas-spacing-xl)' }}>
      {/* Tab buttons */}
      <div
        role="tablist"
        style={{
          display: 'flex',
          gap: 0,
          borderBottom: '2px solid color-mix(in srgb, var(--brand-text, #1b1b1b) 8%, transparent)',
          overflowX: 'auto',
        }}
      >
        {tabs.map((tab) => {
          const isActive = tab.key === currentTab?.key;
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={isActive}
              onClick={() => switchTab(tab.key)}
              style={{
                padding: 'var(--atlas-spacing-sm) var(--atlas-spacing-md)',
                border: 'none',
                borderBottom: isActive
                  ? '2px solid var(--brand-primary, #2d6a4f)'
                  : '2px solid transparent',
                marginBottom: -2,
                background: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 400,
                fontFamily: 'inherit',
                color: isActive ? 'var(--brand-primary, #2d6a4f)' : 'inherit',
                opacity: isActive ? 1 : 0.6,
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div style={{ marginTop: 'var(--atlas-spacing-xl)' }}>
        {currentTab?.content != null ? (
          <div className="atlas-body" style={{ lineHeight: 1.8, maxWidth: 720 }}>
            <RichTextRenderer content={currentTab.content as Record<string, unknown>} />
          </div>
        ) : (
          <p className="atlas-body" style={{ opacity: 0.5 }}>
            This document has not been published yet.
          </p>
        )}
      </div>
    </div>
  );
}
