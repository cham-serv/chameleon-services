'use client';

import { useState, useEffect } from 'react';

const words = ['AI-ready.', 'GEO-optimised.', 'always adapting.', 'built to rank.'];

type HeroTextCyclerProps = {
  className?: string;
};

export function HeroTextCycler({ className }: HeroTextCyclerProps) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % words.length);
        setVisible(true);
      }, 350);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className={className}
      style={{
        display: 'inline-block',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
      }}
      aria-live="polite"
      aria-atomic="true"
    >
      {words[index]}
    </span>
  );
}
