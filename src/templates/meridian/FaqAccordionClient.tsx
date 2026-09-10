'use client';

/**
 * FaqAccordionClient
 *
 * Client-side FAQ interactivity:
 *   - Category filter tabs (derived from FAQ category field)
 *   - Keyword search (filters question + answer text)
 *   - Accordion expand/collapse with animated chevron
 *
 * Uses the design system .mer-accordion-*, .mer-filter-tab classes.
 */

import { useState, useMemo } from 'react';
import type { FAQ } from '@/lib/api';

interface Props {
  faqs: FAQ[];
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      className="mer-accordion-chevron"
      style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  );
}

export default function FaqAccordionClient({ faqs }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch]                 = useState<string>('');
  const [openId, setOpenId]                 = useState<number | null>(null);

  // Derive unique categories in order of first appearance
  const categories = useMemo(() => {
    const seen = new Set<string>();
    for (const f of faqs) {
      if (f.category) seen.add(f.category);
    }
    return Array.from(seen);
  }, [faqs]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return faqs.filter((f) => {
      const matchesCategory = activeCategory === 'all' || f.category === activeCategory;
      const matchesSearch   = !q || f.question.toLowerCase().includes(q) || (typeof f.answer === 'string' && f.answer.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [faqs, activeCategory, search]);

  // Group filtered FAQs by category (preserve order)
  const grouped = useMemo(() => {
    const map = new Map<string, FAQ[]>();
    const ungrouped: FAQ[] = [];
    for (const f of filtered) {
      if (f.category) {
        const arr = map.get(f.category) ?? [];
        arr.push(f);
        map.set(f.category, arr);
      } else {
        ungrouped.push(f);
      }
    }
    // If only one category active, don't show category headings
    return { grouped: map, ungrouped };
  }, [filtered]);

  const showCategoryHeadings = activeCategory === 'all' && categories.length > 1;

  return (
    <>
      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 'var(--mer-spacing-xl)' }}>
        <span style={{ position: 'absolute', left: 'var(--mer-spacing-md)', top: '50%', transform: 'translateY(-50%)', color: 'color-mix(in srgb, var(--brand-text, #444) 45%, transparent)', pointerEvents: 'none' }}>
          <SearchIcon />
        </span>
        <input
          type="search"
          placeholder="Search questions…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpenId(null);
          }}
          aria-label="Search FAQs"
          style={{
            width: '100%',
            padding: '0.75rem var(--mer-spacing-md) 0.75rem calc(var(--mer-spacing-md) * 2 + 16px)',
            border: '1.5px solid var(--mer-border-color)',
            borderRadius: 'var(--mer-radius-lg)',
            fontSize: '0.9375rem',
            fontFamily: 'var(--font-body, inherit)',
            background: 'var(--brand-background, #fff)',
            color: 'var(--brand-text, #444)',
            outline: 'none',
            transition: 'border-color var(--mer-transition)',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => { e.target.style.borderColor = 'var(--brand-primary, #1a2b5e)'; }}
          onBlur={(e)  => { e.target.style.borderColor = 'var(--mer-border-color)'; }}
        />
      </div>

      {/* Category tabs */}
      {categories.length > 1 && (
        <div className="mer-filter-tabs" role="tablist" aria-label="Filter by category">
          <button
            type="button"
            role="tab"
            aria-selected={activeCategory === 'all'}
            data-active={activeCategory === 'all' ? 'true' : 'false'}
            className="mer-filter-tab"
            onClick={() => { setActiveCategory('all'); setOpenId(null); }}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat}
              data-active={activeCategory === cat ? 'true' : 'false'}
              className="mer-filter-tab"
              onClick={() => { setActiveCategory(cat); setOpenId(null); }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* FAQ list */}
      {filtered.length === 0 ? (
        <p className="mer-body" style={{ opacity: 0.6, textAlign: 'center', padding: 'var(--mer-spacing-3xl) 0' }}>
          No results found. Try a different search or category.
        </p>
      ) : (
        <>
          {showCategoryHeadings ? (
            /* Grouped by category */
            <>
              {Array.from(grouped.grouped.entries()).map(([cat, items]) => (
                <div key={cat} style={{ marginBottom: 'var(--mer-spacing-2xl)' }}>
                  <h2 style={{ fontFamily: 'var(--font-heading, inherit)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--brand-primary, #1a2b5e)', marginBottom: 'var(--mer-spacing-lg)', paddingBottom: 'var(--mer-spacing-sm)', borderBottom: '1px solid var(--mer-border-color)' }}>
                    {cat}
                  </h2>
                  <div className="mer-accordion-group">
                    {items.map((faq) => (
                      <AccordionItem key={faq.id} faq={faq} openId={openId} setOpenId={setOpenId} />
                    ))}
                  </div>
                </div>
              ))}
              {grouped.ungrouped.length > 0 && (
                <div className="mer-accordion-group">
                  {grouped.ungrouped.map((faq) => (
                    <AccordionItem key={faq.id} faq={faq} openId={openId} setOpenId={setOpenId} />
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Flat list (single category or search active) */
            <div className="mer-accordion-group">
              {filtered.map((faq) => (
                <AccordionItem key={faq.id} faq={faq} openId={openId} setOpenId={setOpenId} />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}

function AccordionItem({
  faq,
  openId,
  setOpenId,
}: {
  faq: FAQ;
  openId: number | null;
  setOpenId: (id: number | null) => void;
}) {
  const isOpen = openId === faq.id;

  return (
    <div className="mer-accordion-item">
      <button
        type="button"
        className="mer-accordion-trigger"
        aria-expanded={isOpen}
        aria-controls={`faq-body-${faq.id}`}
        id={`faq-trigger-${faq.id}`}
        onClick={() => setOpenId(isOpen ? null : faq.id)}
      >
        <span className="mer-accordion-question">{faq.question}</span>
        <ChevronIcon expanded={isOpen} />
      </button>
      {isOpen && (
        <div
          className="mer-accordion-body"
          id={`faq-body-${faq.id}`}
          role="region"
          aria-labelledby={`faq-trigger-${faq.id}`}
        >
          {typeof faq.answer === 'string' ? faq.answer : 'Please contact us for more information.'}
        </div>
      )}
    </div>
  );
}