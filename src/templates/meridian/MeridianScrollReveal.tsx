'use client';

/**
 * MeridianScrollReveal
 *
 * Lightweight IntersectionObserver that activates data-reveal and
 * data-reveal-stagger animations when elements enter the viewport.
 *
 * Depends on both usePathname() AND the _dv query param so the observer
 * is rebuilt on:
 *   a) Client-side page navigations (pathname changes)
 *   b) Demo Explorer variant switches (same pathname, ?_dv=home:authority)
 *
 * Without (b), switching to a variant with data-reveal elements on the same
 * page (e.g. home split-hero → authority) would leave all elements at
 * opacity:0 because the observer was set up for the old variant's DOM and
 * the new elements are never observed.
 *
 * useSearchParams() requires a Suspense boundary in the parent — wrap
 * <MeridianScrollReveal /> in <Suspense fallback={null}> in MeridianLayout.
 *
 * requestAnimationFrame defers the query until React has committed the DOM.
 */

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function MeridianScrollReveal() {
  const pathname   = usePathname();
  const searchParams = useSearchParams();
  // Only re-run when the variant override changes — ignore other params
  const dvParam    = searchParams.get('_dv');

  useEffect(() => {
    let rafId: number;
    let observer: IntersectionObserver;

    // Defer until after React has committed the new DOM.
    // Also reset any previously-revealed elements so they animate in fresh.
    rafId = requestAnimationFrame(() => {
      // Reset all elements that were already revealed so the new variant
      // gets its own entry animation instead of appearing pre-visible.
      document.querySelectorAll<HTMLElement>('[data-revealed="true"]').forEach(
        (el) => { delete el.dataset.revealed; }
      );

      const targets = document.querySelectorAll<HTMLElement>(
        '[data-reveal], [data-reveal-stagger]',
      );

      if (!targets.length) return;

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              (entry.target as HTMLElement).dataset.revealed = 'true';
              observer.unobserve(entry.target);
            }
          }
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -40px 0px',
        },
      );

      targets.forEach((el) => observer.observe(el));
    });

    return () => {
      cancelAnimationFrame(rafId);
      observer?.disconnect();
    };
  // Re-run on pathname change (page nav) OR _dv change (variant switch)
  }, [pathname, dvParam]);

  return null;
}
