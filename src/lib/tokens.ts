/**
 * lib/tokens.ts
 *
 * Computes semantic CSS custom properties from a tenant's primitive brand
 * tokens (4 colours + 2 fonts).
 *
 * Runs server-side in the (tenant) layout — injected inline on <html> so
 * there is zero FOUC.
 *
 * CURRENT STATE:
 * The engine currently stores 4 colour fields: primary, secondary, accent, background.
 * We derive additional tokens (surface, text, muted, border) from those 4 using
 * simple heuristics. When the engine adds explicit colourSurface/colourText/colourMuted
 * fields to SiteSettings, we can switch to reading them directly.
 *
 * TODO (Batch 2): Use `culori` for perceptually-uniform oklch colour math
 * to derive hover states, auto-contrast foreground colours, etc.
 */

import type { TenantSettings } from '@/lib/api';

export type SemanticTokens = React.CSSProperties;

/**
 * Derives CSS custom properties from the tenant's brand settings.
 *
 * If settings is null (tenant has no SiteSettings record), returns
 * safe defaults so the page still renders.
 */
export function computeSemanticTokens(
  settings: TenantSettings | null,
): SemanticTokens {
  // Defaults — used when settings is null or a field is missing
  const primary = settings?.colourPrimary ?? '#1A1A2E';
  const secondary = settings?.colourSecondary ?? '#16213E';
  const accent = settings?.colourAccent ?? '#0F3460';
  const background = settings?.colourBackground ?? '#FFFFFF';
  const fontHeading = settings?.fontHeading ?? 'Plus Jakarta Sans';
  const fontBody = settings?.fontBody ?? 'Inter';

  // Derived tokens — simple heuristics until the engine has explicit fields.
  // "surface" = slightly tinted background (for cards, inputs)
  // "text" = high-contrast foreground against the background
  // "muted" = a dimmed version of text for secondary content
  const isLightBackground = isLightColour(background);
  const text = isLightBackground ? '#1A1A2E' : '#F5F5F5';
  const muted = isLightBackground ? '#6B7280' : '#9CA3AF';
  const surface = isLightBackground ? '#F9FAFB' : '#1F2937';
  const border = isLightBackground ? '#E5E7EB' : '#374151';

  return {
    // Brand colours (from engine)
    '--brand-primary': primary,
    '--brand-secondary': secondary,
    '--brand-accent': accent,
    '--brand-background': background,

    // Derived colours (computed here)
    '--brand-surface': surface,
    '--brand-text': text,
    '--brand-muted': muted,
    '--brand-border': border,

    // Typography
    '--font-heading': `'${fontHeading}', sans-serif`,
    '--font-body': `'${fontBody}', sans-serif`,

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

    // Border radius (static default — future: make configurable in SiteSettings)
    '--radius': '0.5rem',
  } as SemanticTokens;
}

/**
 * Naive light/dark check — returns true if the colour is perceptually "light".
 * Uses the simple luminance formula. Will be replaced by culori's oklch
 * lightness in Batch 2 for accuracy.
 */
function isLightColour(hex: string): boolean {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return true; // fallback to light

  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;

  // Relative luminance (simplified sRGB)
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.5;
}
