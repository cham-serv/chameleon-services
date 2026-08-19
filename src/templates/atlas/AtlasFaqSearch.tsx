'use client';

/**
 * AtlasFaqSearch - Client Component
 *
 * "Search" variant layout for the FAQs page.
 * Renders FAQs as category cards with a flat question list.
 * Clicking a question toggles an inline answer panel.
 * The search query instantly filters across all categories.
 */

import { useState } from 'react';
import type { FAQ } from '@/lib/api';

type AtlasFaqSearchProps = {
  categories: [string, FAQ[]][];
};

export function AtlasFaqSearch({ categories }: AtlasFaqSearchProps) {
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<number | null>(null);

  const q = query.toLowerCase().trim();

  const filtered = categories
    .map(([cat, faqs]) => {
      const matching = q
        ? faqs.filter(
            (f) =>
              f.question.toLowerCase().includes(q) ||
              (typeof f.answer === 'string' && f.answer.toLowerCase().includes(q)),
          )
        : faqs;
      return [cat, matching] as [string, FAQ[]];
    })
    .filter(([, faqs]) => faqs.length > 0);

  const totalResults = filtered.reduce((sum, [, faqs]) => sum + faqs.length, 0);

  return (
    <>
      {/* Search hero */}
      <div className="atlas-faq-search-hero">
        <div className="atlas-faq-search-hero-inner">
          <div className="atlas-faq-search-input-wrap">
            <svg className="atlas-faq-search-icon" aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              id="faq-search-input"
              type="search"
              placeholder="Search questions"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setOpenId(null); }}
              className="atlas-faq-search-input"
              autoComplete="off"
              aria-label="Search frequently asked questions"
            />
          </div>
          {q && (
            <p className="atlas-faq-search-hint" role="status" aria-live="polite">
              {totalResults > 0
                ? `${totalResults} result${totalResults !== 1 ? 's' : ''} found`
                : `No results for "${query}"`}
            </p>
          )}
        </div>
      </div>

      {/* Category card grid */}
      {filtered.length === 0 ? (
        <div className="atlas-faq-no-results">
          <p>No questions match <strong>&ldquo;{query}&rdquo;</strong>. Try a different search term.</p>
        </div>
      ) : (
        <div className="atlas-faq-card-grid">
          {filtered.map(([cat, faqs]) => (
            <div key={cat} className="atlas-faq-card">
              {categories.length > 1 && (
                <h2 className="atlas-faq-card-category">{cat}</h2>
              )}
              <ul className="atlas-faq-card-list">
                {faqs.map((faq) => {
                  const isOpen = openId === faq.id;
                  return (
                    <li key={faq.id} className="atlas-faq-card-item">
                      <button
                        type="button"
                        className="atlas-faq-card-question"
                        aria-expanded={isOpen}
                        onClick={() => setOpenId(isOpen ? null : faq.id)}
                      >
                        <span>{faq.question}</span>
                        <span className={`atlas-faq-card-chevron${isOpen ? ' is-open' : ''}`} aria-hidden>
                          
                        </span>
                      </button>
                      {isOpen && (
                        <div
                          className="atlas-faq-card-answer"
                          data-speakable="true"
                          id={`faq-answer-${faq.id}`}
                        >
                          <p>{typeof faq.answer === 'string' ? faq.answer : 'Answer available on the full page.'}</p>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </>
  );
}