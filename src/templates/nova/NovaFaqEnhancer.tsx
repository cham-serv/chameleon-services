'use client';

/**
 * Nova FAQ Enhancer — Client Component
 *
 * Three responsibilities:
 * 1. Search input — filters FAQ items by toggling a CSS class (no re-render)
 * 2. Hash auto-open — opens the FAQ targeted by the URL hash on mount
 * 3. Smooth scroll — scrolls the targeted FAQ into view
 *
 * Zero framework dependencies. Uses vanilla DOM APIs for performance.
 */

import { useEffect, useRef, useCallback } from 'react';

export function NovaFaqEnhancer() {
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Hash auto-open ──────────────────────────────────
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const target = document.getElementById(hash.slice(1));
    if (target && target.tagName === 'DETAILS') {
      (target as HTMLDetailsElement).open = true;
      // Smooth scroll after a tick (let the browser expand the details)
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  }, []);

  // ── Search filter ───────────────────────────────────
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase().trim();
    const faqElements = document.querySelectorAll('.nova-faq[data-question]');

    faqElements.forEach((el) => {
      const question = el.getAttribute('data-question') ?? '';
      if (!query || question.includes(query)) {
        el.classList.remove('nova-faq--hidden');
      } else {
        el.classList.add('nova-faq--hidden');
      }
    });
  }, []);

  return (
    <input
      ref={inputRef}
      type="search"
      className="nova-faq__search"
      placeholder="Search questions…"
      onChange={handleSearch}
      aria-label="Search frequently asked questions"
    />
  );
}
