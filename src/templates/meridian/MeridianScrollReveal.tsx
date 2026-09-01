'use client';

/**
 * MeridianScrollReveal
 *
 * Lightweight IntersectionObserver that activates data-reveal and
 * data-reveal-stagger animations when elements enter the viewport.
 * Mirrors the pattern from AtlasScrollReveal.
 */

import { useEffect } from 'react';

export function MeridianScrollReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(
      '[data-reveal], [data-reveal-stagger]',
    );

    if (!targets.length) return;

    const observer = new IntersectionObserver(
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

    return () => observer.disconnect();
  }, []);

  return null;
}
