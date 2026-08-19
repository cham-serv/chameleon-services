'use client';

/**
 * AtlasFaqAccordion  Client Component
 *
 * Renders FAQ groups with expand/collapse + client-side text search.
 */

import { useState, type CSSProperties } from 'react';
import type { FAQ } from '@/lib/api';

type AtlasFaqAccordionProps = {
  categories: [string, FAQ[]][];
};

export function AtlasFaqAccordion({ categories }: AtlasFaqAccordionProps) {
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState<number | null>(null);

  const query = search.toLowerCase().trim();

  const filteredCategories = categories
    .map(([cat, faqs]) => {
      const filtered = query
        ? faqs.filter(
            (f) =>
              f.question.toLowerCase().includes(query) ||
              (typeof f.answer === 'string' && f.answer.toLowerCase().includes(query)),
          )
        : faqs;
      return [cat, filtered] as [string, FAQ[]];
    })
    .filter(([, faqs]) => faqs.length > 0);

  const totalResults = filteredCategories.reduce((sum, [, faqs]) => sum + faqs.length, 0);

  return (
    <div style={{ marginTop: 'var(--atlas-spacing-2xl)' }}>
      {/* Search */}
      <div style={{ marginBottom: 'var(--atlas-spacing-xl)' }}>
        <input
          type="search"
          placeholder="Search questions..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpenId(null);
          }}
          className="atlas-input"
          style={{
            width: '100%',
            maxWidth: 480,
            padding: '0.75rem 1rem',
            border: '1px solid color-mix(in srgb, var(--brand-text, #1b1b1b) 15%, transparent)',
            borderRadius: 'var(--atlas-radius-sm)',
            fontSize: '0.9375rem',
            fontFamily: 'inherit',
            background: 'transparent',
          }}
        />
        {query && (
          <p className="atlas-caption" style={{ marginTop: 'var(--atlas-spacing-xs)', opacity: 0.6 }}>
            {totalResults} result{totalResults !== 1 ? 's' : ''} found
          </p>
        )}
      </div>

      {/* FAQ Groups */}
      {filteredCategories.length === 0 ? (
        <div className="atlas-card-flat" style={{ padding: 'var(--atlas-spacing-xl)', textAlign: 'center' }}>
          <p className="atlas-body" style={{ opacity: 0.6 }}>
            No questions match &ldquo;{search}&rdquo;. Try a different search.
          </p>
        </div>
      ) : (
        filteredCategories.map(([cat, faqs]) => (
          <div key={cat} style={{ marginBottom: 'var(--atlas-spacing-2xl)' }}>
            {/* Category heading (only if multiple categories) */}
            {categories.length > 1 && (
              <h2 className="atlas-h5" style={{ marginBottom: 'var(--atlas-spacing-md)', paddingBottom: 'var(--atlas-spacing-xs)', borderBottom: '1px solid color-mix(in srgb, var(--brand-text, #1b1b1b) 8%, transparent)' }}>
                {cat}
              </h2>
            )}

            {/* Accordion items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {faqs.map((faq) => {
                const isOpen = openId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="atlas-card-flat"
                    style={{
                      borderRadius: 'var(--atlas-radius-sm)',
                      overflow: 'hidden',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : faq.id)}
                      aria-expanded={isOpen}
                      style={accordionButtonStyle}
                    >
                      <span style={{ flex: 1, textAlign: 'left' }}>{faq.question}</span>
                      <span
                        style={{
                          fontSize: '1.25rem',
                          transition: 'transform 0.2s ease',
                          transform: isOpen ? 'rotate(45deg)' : 'rotate(0)',
                          flexShrink: 0,
                          lineHeight: 1,
                        }}
                        aria-hidden
                      >
                        +
                      </span>
                    </button>
                    <div
                      style={{
                        maxHeight: isOpen ? 500 : 0,
                        overflow: 'hidden',
                        transition: 'max-height 0.3s ease',
                      }}
                    >
                      <div style={{ padding: '0 var(--atlas-spacing-md) var(--atlas-spacing-md)' }}>
                        <p
                          className="atlas-body"
                          style={{ margin: 0, lineHeight: 1.7 }}
                          data-speakable="true"
                          id={`faq-answer-${faq.id}`}
                        >
                          {typeof faq.answer === 'string' ? faq.answer : 'Answer available on the full page.'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const accordionButtonStyle: CSSProperties = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--atlas-spacing-md)',
  padding: 'var(--atlas-spacing-md)',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '0.9375rem',
  fontWeight: 600,
  fontFamily: 'inherit',
  color: 'inherit',
};
