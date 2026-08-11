/**
 * lib/tokens.ts
 *
 * Computes semantic CSS custom properties from a tenant's primitive brand
 * tokens (colours, fonts, border-radius).
 *
 * Runs server-side in the (tenant) layout — injected inline on <html> so
 * there is zero FOUC. Uses the `culori` library for perceptually-uniform
 * colour transformations in oklch colour space.
 *
 * STUB — full implementation in Batch 2.
 */

import type { TenantConfig } from '@/lib/api';

export type SemanticTokens = React.CSSProperties;

const BORDER_RADIUS_MAP: Record<string, string> = {
  none: '0',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '1rem',
  pill: '9999px',
};

/**
 * Derives ~30 CSS custom properties from the tenant's 10 primitive brand tokens.
 *
 * TODO (Batch 2): replace with full oklch computation using culori.
 */
export function computeSemanticTokens(
  settings: TenantConfig['settings'],
): SemanticTokens {
  const radius = BORDER_RADIUS_MAP[settings.borderRadius] ?? '0.5rem';

  // Stub: in Batch 2 this will use culori to compute hover states,
  // auto-contrast foreground colours, subtle background tints etc.
  return {
    '--brand-primary': settings.colourPrimary,
    '--brand-secondary': settings.colourSecondary,
    '--brand-accent': settings.colourAccent,
    '--brand-background': settings.colourBackground,
    '--brand-surface': settings.colourSurface,
    '--brand-text': settings.colourText,
    '--brand-muted': settings.colourMuted,
    '--font-heading': settings.fontHeading,
    '--font-body': settings.fontBody,
    '--radius': radius,
    // Motion tokens (static — not tenant-configurable)
    '--duration-fast': '100ms',
    '--duration-normal': '200ms',
    '--duration-slow': '400ms',
    '--ease-default': 'cubic-bezier(0.4, 0, 0.2, 1)',
    // Spacing tokens (static)
    '--space-xs': '0.25rem',
    '--space-sm': '0.5rem',
    '--space-md': '1rem',
    '--space-lg': '1.5rem',
    '--space-xl': '2rem',
    '--space-2xl': '3rem',
    '--space-section': '4rem',
  } as SemanticTokens;
}
