'use client';

/**
 * Nova Legal Tabs — Client Component
 *
 * Client-side tab switching for legal documents.
 * Toggles visibility of [data-legal-panel] elements.
 */

import { useState, useCallback, useEffect } from 'react';

type Props = {
  tabs: Array<{ id: string; label: string }>;
};

export function NovaLegalTabs({ tabs }: Props) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? '');

  // Show/hide panels based on active tab
  useEffect(() => {
    const panels = document.querySelectorAll('[data-legal-panel]');
    panels.forEach((panel) => {
      const panelId = panel.getAttribute('data-legal-panel');
      (panel as HTMLElement).style.display = panelId === activeTab ? 'block' : 'none';
    });
  }, [activeTab]);

  const handleTabClick = useCallback((id: string) => {
    setActiveTab(id);
  }, []);

  if (tabs.length <= 1) return null;

  return (
    <div className="nova-legal-tabs" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`nova-legal-tab${activeTab === tab.id ? ' nova-legal-tab--active' : ''}`}
          onClick={() => handleTabClick(tab.id)}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`legal-${tab.id}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
