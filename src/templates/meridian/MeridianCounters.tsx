'use client';

/**
 * MeridianCounters
 *
 * Animated counter — counts up from 0 to the target value when
 * the element enters the viewport (IntersectionObserver).
 *
 * Handles values like "30+", "2,400+", "98%", "12".
 * The suffix (+ or %) and commas are preserved.
 */

import { useEffect, useRef, useState } from 'react';

type Props = {
  targetValue: string;    // e.g. "30+", "2,400+", "98%", "12"
  duration?: number;      // ms — default 1400
  className?: string;
};

function parseTarget(value: string): { numeric: number; suffix: string } {
  // Strip commas, then extract trailing non-numeric suffix
  const clean   = value.replace(/,/g, '');
  const match   = clean.match(/^(\d+(?:\.\d+)?)(.*)/);
  if (!match) return { numeric: 0, suffix: value };
  return { numeric: parseFloat(match[1]), suffix: match[2] };
}

function formatNumber(n: number, originalValue: string): string {
  // If original had commas, format with commas
  if (originalValue.includes(',')) {
    return Math.floor(n).toLocaleString('en-US');
  }
  return String(Math.floor(n));
}

export default function MeridianCounters({ targetValue, duration = 1400, className }: Props) {
  const ref     = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState('0');
  const hasAnimated = useRef(false);

  const { numeric, suffix } = parseTarget(targetValue);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(formatNumber(numeric, targetValue));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;
        observer.disconnect();

        const startTime = performance.now();

        function easeOutCubic(t: number) {
          return 1 - Math.pow(1 - t, 3);
        }

        function tick(now: number) {
          const elapsed  = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased    = easeOutCubic(progress);
          const current  = eased * numeric;
          setDisplay(formatNumber(current, targetValue));
          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [numeric, duration, targetValue]);

  return (
    <span ref={ref} className={className}>
      {display}{suffix}
    </span>
  );
}
