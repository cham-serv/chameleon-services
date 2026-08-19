/**
 * AtlasBadge  Server Component
 *
 * A lightweight pill badge for eyebrow labels, trust signals, and status
 * indicators. Uses CSS custom properties so it inherits brand colours
 * automatically across any tenant palette.
 *
 * Usage:
 *   <AtlasBadge> New Collection</AtlasBadge>
 *   <AtlasBadge variant="accent" icon="">Free Shipping</AtlasBadge>
 *   <AtlasBadge variant="solid" size="sm">Sale</AtlasBadge>
 */

import type { ReactNode } from 'react';

type BadgeVariant = 'primary' | 'secondary' | 'accent' | 'solid' | 'outline';
type BadgeSize = 'sm' | 'md';

type Props = {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: string;
  className?: string;
};

export function AtlasBadge({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
}: Props) {
  const classes = [
    'atlas-badge',
    `atlas-badge--${variant}`,
    size === 'sm' ? 'atlas-badge--sm' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes}>
      {icon && <span className="atlas-badge-icon" aria-hidden="true">{icon}</span>}
      {children}
    </span>
  );
}
