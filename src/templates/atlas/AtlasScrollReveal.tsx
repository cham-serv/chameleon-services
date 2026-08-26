'use client';

/**
 * AtlasScrollReveal — Client Component
 *
 * Watches all [data-reveal] elements in the DOM via IntersectionObserver
 * and sets data-revealed="true" once they enter the viewport. The CSS
 * animation in atlas.css then plays (opacity: 0 → 1, translateY(24px) → 0).
 *
 * - Fires once per element then unobserves (no repeated animation on scroll back)
 * - Falls back to immediately revealing everything if IntersectionObserver is unavailable
 * - prefers-reduced-motion: CSS handles this — no bounce, just instant reveal
 *
 * Rendered via AtlasLayoutShell so it covers every page.
 */

import { useEffect } from 'react';

export function AtlasScrollReveal() {
  useEffect(() => {
    // Reveal all immediately if browser doesn't support IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
        el.setAttribute('data-revealed', 'true');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-revealed', 'true');
            observer.unobserve(entry.target); // fire once, then disconnect this element
          }
        });
      },
      {
        threshold: 0.08,
        // Trigger slightly before the element fully enters (looks snappier)
        rootMargin: '0px 0px -40px 0px',
      },
    );

    // Observe all current [data-reveal] elements
    const observe = () => {
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
        observer.observe(el);
      });
    };

    observe();

    return () => {
      observer.disconnect();
    };
  }, []);

  // Renders nothing — side-effect only
  return null;
}
