/**
 * AtlasMarquee  Server Component
 *
 * Pure-CSS infinite horizontal scroll ticker. No JavaScript. Driven entirely
 * by a CSS @keyframes animation defined in atlas-animations.css.
 *
 * Pauses on hover for accessibility. Respects prefers-reduced-motion.
 *
 * Usage:
 *   <AtlasMarquee items={['Free Shipping', 'Easy Returns', 'Secure Payment']} />
 *   <AtlasMarquee items={trustSignals} speed="slow" separator="" />
 */

type Props = {
  items: string[];
  /** Animation speed: fast ~20s, medium ~35s (default), slow ~55s */
  speed?: 'fast' | 'medium' | 'slow';
  /** Character rendered between items */
  separator?: string;
  className?: string;
};

const SPEED_MAP = {
  fast: '20s',
  medium: '35s',
  slow: '55s',
};

export function AtlasMarquee({
  items,
  speed = 'medium',
  separator = '',
  className = '',
}: Props) {
  if (!items || items.length === 0) return null;

  const duration = SPEED_MAP[speed];

  // Duplicate items so the seamless loop always has enough content
  const repeated = [...items, ...items];

  return (
    <div
      className={`atlas-marquee ${className}`.trim()}
      aria-label="Trust signals ticker"
      role="marquee"
    >
      <div
        className="atlas-marquee-track"
        style={{ animationDuration: duration }}
        aria-hidden="true"
      >
        {repeated.map((item, i) => (
          <span key={i} className="atlas-marquee-item">
            {item}
            <span className="atlas-marquee-sep" aria-hidden="true">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
