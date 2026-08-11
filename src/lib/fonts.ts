/**
 * lib/fonts.ts
 *
 * Google Fonts registry for chameleon-templates.
 * Exports a curated list of approved font pairings and a helper that
 * returns Next.js font class names for injection into the <html> element.
 *
 * STUB — full implementation in Batch 2.
 */

/** Approved heading fonts — matches the select options in SiteSettings */
export const HEADING_FONTS = [
  'Plus Jakarta Sans',
  'Inter',
  'Outfit',
  'Playfair Display',
  'Fraunces',
  'DM Serif Display',
  'Space Grotesk',
  'Syne',
] as const;

/** Approved body fonts */
export const BODY_FONTS = [
  'Inter',
  'Plus Jakarta Sans',
  'Outfit',
  'DM Sans',
  'Lato',
  'Source Sans 3',
  'Nunito',
] as const;

export type HeadingFont = (typeof HEADING_FONTS)[number];
export type BodyFont = (typeof BODY_FONTS)[number];

/**
 * Returns the Google Fonts embed URL for the tenant's chosen fonts.
 * Used in the (tenant) layout's <head> to load the typefaces.
 *
 * TODO (Batch 2): replace with next/font/google dynamic loading so fonts
 * are self-hosted by Next.js (better performance, no third-party request).
 */
export function getFontEmbedUrl(heading: string, body: string): string {
  const families = [...new Set([heading, body])]
    .map((f) => `family=${encodeURIComponent(f)}:wght@400;500;600;700`)
    .join('&');
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}
