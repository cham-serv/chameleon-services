/**
 * ChameleonLogo — SVG brand mark + wordmark
 *
 * Hand-coded SVG based on the v2 design direction:
 * - Minimal flat chameleon silhouette in electric blue gradient
 * - Clean lowercase wordmark in white
 * - Horizontal lockup
 *
 * Props:
 *   size    — controls height; width scales proportionally (default: 32)
 *   variant — 'full' (icon + wordmark) | 'icon' (icon only) | 'wordmark' (text only)
 *   color   — 'default' (white wordmark) | 'dark' (dark wordmark for light backgrounds)
 */

type ChameleonLogoProps = {
  size?: number;
  variant?: 'full' | 'icon' | 'wordmark';
  color?: 'default' | 'dark';
  className?: string;
};

export function ChameleonLogo({
  size = 32,
  variant = 'full',
  color = 'default',
  className,
}: ChameleonLogoProps) {
  const textColor = color === 'dark' ? '#0d1117' : '#f0f6fc';
  const iconHeight = size;
  const iconWidth = size * 1.1; // slight horizontal stretch for the chameleon

  if (variant === 'icon') {
    return (
      <svg
        width={iconWidth}
        height={iconHeight}
        viewBox="0 0 44 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Chameleon"
        role="img"
      >
        <defs>
          <linearGradient id="chameleon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <ChameleonIcon />
      </svg>
    );
  }

  if (variant === 'wordmark') {
    return (
      <svg
        width={size * 5.5}
        height={size * 0.75}
        viewBox="0 0 176 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Chameleon"
        role="img"
      >
        <text
          x="0"
          y="19"
          fontFamily="'Inter', 'Syne', system-ui, sans-serif"
          fontSize="20"
          fontWeight="600"
          letterSpacing="-0.3"
          fill={textColor}
        >
          chameleon
        </text>
      </svg>
    );
  }

  // Full lockup
  const totalWidth = iconWidth + 8 + size * 5.5;
  return (
    <svg
      width={totalWidth}
      height={iconHeight}
      viewBox={`0 0 ${Math.round(totalWidth)} ${iconHeight}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Chameleon"
      role="img"
    >
      <defs>
        <linearGradient id="chameleon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>

      {/* Icon — scaled to fit height */}
      <g transform={`scale(${iconHeight / 40})`}>
        <ChameleonIcon />
      </g>

      {/* Wordmark — positioned after icon with gap */}
      <text
        x={iconWidth + 8}
        y={iconHeight * 0.72}
        fontFamily="'Inter', 'Syne', system-ui, sans-serif"
        fontSize={iconHeight * 0.6}
        fontWeight="600"
        letterSpacing="-0.3"
        fill={textColor}
      >
        chameleon
      </text>
    </svg>
  );
}

// ── The actual chameleon icon path ───────────────────────────────────────────
// A minimal side-profile chameleon: body, head bump, eye, curled tail, 4 legs

function ChameleonIcon() {
  return (
    <g fill="url(#chameleon-gradient)">
      {/* Body */}
      <ellipse cx="22" cy="22" rx="13" ry="9" />
      {/* Head — protruding bump forward */}
      <ellipse cx="35" cy="18" rx="7" ry="6" />
      {/* Casque (the distinctive chameleon head ridge) */}
      <polygon points="33,12 40,14 38,8" />
      {/* Eye — white dot */}
      <circle cx="38" cy="17" r="2.5" fill="white" opacity="0.9" />
      <circle cx="38.5" cy="16.5" r="1" fill="#1e3a5f" />
      {/* Snout */}
      <ellipse cx="43" cy="20" rx="2" ry="1.5" />

      {/* Curled tail */}
      <path
        d="M9 24 C4 26 2 30 5 34 C8 37 12 35 11 31"
        stroke="url(#chameleon-gradient)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Front legs */}
      <rect x="30" y="28" width="3" height="7" rx="1.5" />
      <rect x="24" y="29" width="3" height="6" rx="1.5" />
      {/* Back legs */}
      <rect x="16" y="28" width="3" height="7" rx="1.5" />
      <rect x="11" y="27" width="3" height="6" rx="1.5" />
    </g>
  );
}
