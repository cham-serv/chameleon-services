'use client';

/**
 * MeridianScrollReveal
 *
 * Lightweight IntersectionObserver that activates data-reveal and
 * data-reveal-stagger animations when elements enter the viewport.
 * Mirrors the pattern from AtlasScrollReveal.
 *
 * Uses usePathname() as a dependency so the observer is rebuilt on every
 * client-side route change (e.g. demo explorer variant switching). Without
 * this, the effect only runs once on initial mount — elements added to the
 * DOM after a client-side navigation are never observed and stay at opacity:0.
 *
 * requestAnimationFrame defers the query until React has finished committing
 * the new page's DOM, preventing a race condition on navigation.
 */

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function MeridianScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    let rafId: number;
    let observer: IntersectionObserver;

    // Defer until after React has committed the new DOM
    rafId = requestAnimationFrame(() => {
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
  }, [pathname]); // Re-run on every client-side route change

  return null;
}
