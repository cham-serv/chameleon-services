'use client';

/**
 * AtlasCounter  Client Component
 *
 * Animates a number from 0 to the target value when it scrolls into view.
 * Uses IntersectionObserver  fires once then disconnects. No scroll event
 * listeners. Respects prefers-reduced-motion.
 *
 * Usage:
 *   <AtlasCounter target={4900000} label="Trees Planted" prefix="" suffix="+" />
 *   <AtlasCounter target={98} label="Satisfaction" suffix="%" duration={1500} />
 */

import { useEffect, useRef, useState } from 'react';

type Props = {
  target: number;
  label: string;
  prefix?: string;
  suffix?: string;
  /** Animation duration in ms (default 1800) */
  duration?: number;
  className?: string;
};

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(n >= 10_000 ? 0 : 1) + 'K';
  return String(Math.round(n));
}

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function AtlasCounter({
  target,
  label,
  prefix = '',
  suffix = '',
  duration = 1800,
  className = '',
}: Props) {
  const [value, setValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion  snap directly to target
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setValue(target);
      setHasAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          observer.disconnect();

          const startTime = performance.now();

          function tick(now: number) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOut(progress);
            setValue(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          }

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration, hasAnimated]);

  return (
    <div ref={ref} className={`atlas-counter ${className}`.trim()}>
      <span className="atlas-counter-value" aria-live="polite">
        {prefix}
        {formatNumber(value)}
        {suffix}
      </span>
      <span className="atlas-counter-label">{label}</span>
    </div>
  );
}
