/**
 * Platform Font Registry - self-hosted via next/font/google.
 *
 * All fonts are downloaded at build time and served from the Vercel CDN.
 * Zero external DNS lookups, zero render-blocking requests, GDPR compliant.
 *
 * The curated list IS the feature: 15 excellent, carefully selected fonts
 * instead of 1,400+ from Google Fonts (most poor quality).
 *
 * Adding a new font: one line here + one import. ~6 slots remain
 * before hitting the 20-font soft cap.
 */

import {
  Inter,
  Lato,
  Open_Sans,
  DM_Sans,
  Plus_Jakarta_Sans,
  Outfit,
  Poppins,
  Montserrat,
  Figtree,
  Raleway,
  Syne,
  Lora,
  Playfair_Display,
  JetBrains_Mono,
  Space_Grotesk,
} from 'next/font/google';

// - Font instances (declared at module level - next/font requirement) -

const inter = Inter({ subsets: ['latin'], variable: '--nf-inter', display: 'swap' });
const lato = Lato({ subsets: ['latin'], weight: ['300', '400', '700'], variable: '--nf-lato', display: 'swap' });
const openSans = Open_Sans({ subsets: ['latin'], variable: '--nf-opensans', display: 'swap' });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--nf-dmsans', display: 'swap' });
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--nf-jakarta', display: 'swap' });
const outfit = Outfit({ subsets: ['latin'], variable: '--nf-outfit', display: 'swap' });
const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--nf-poppins', display: 'swap' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--nf-montserrat', display: 'swap' });
const figtree = Figtree({ subsets: ['latin'], variable: '--nf-figtree', display: 'swap' });
const raleway = Raleway({ subsets: ['latin'], variable: '--nf-raleway', display: 'swap' });
const syne = Syne({ subsets: ['latin'], variable: '--nf-syne', display: 'swap' });
const lora = Lora({ subsets: ['latin'], variable: '--nf-lora', display: 'swap' });
const playfairDisplay = Playfair_Display({ subsets: ['latin'], variable: '--nf-playfair', display: 'swap' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--nf-jetbrains', display: 'swap' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--nf-spacegrotesk', display: 'swap' });

// - Public registry -

export const PLATFORM_FONTS = {
  // Sans-serif - neutral / versatile
  'Inter': inter,
  'Lato': lato,
  'Open Sans': openSans,
  'DM Sans': dmSans,
  // Sans-serif - modern / geometric
  'Plus Jakarta Sans': plusJakartaSans,
  'Outfit': outfit,
  'Poppins': poppins,
  'Montserrat': montserrat,
  'Figtree': figtree,
  'Raleway': raleway,
  // Sans-serif - editorial / distinctive
  'Syne': syne,
  'Space Grotesk': spaceGrotesk,
  // Serif
  'Lora': lora,
  'Playfair Display': playfairDisplay,
  // Mono
  'JetBrains Mono': jetbrainsMono,
} as const;

export type PlatformFont = keyof typeof PLATFORM_FONTS;

/**
 * Returns combined CSS class names for the tenant's selected fonts.
 * Falls back to Plus Jakarta Sans (heading) + Inter (body) if not found.
 */
export function getFontClasses(heading: string | null | undefined, body: string | null | undefined): string {
  const h = PLATFORM_FONTS[heading as PlatformFont]?.className ?? plusJakartaSans.className;
  const b = PLATFORM_FONTS[body as PlatformFont]?.className ?? inter.className;
  return `${h} ${b}`;
}

/**
 * Returns CSS variable declarations for the tenant's selected fonts.
 * Used in the tenant layout's <style> tag.
 */
export function getFontVariables(heading: string | null | undefined, body: string | null | undefined): string {
  const h = PLATFORM_FONTS[heading as PlatformFont]?.style.fontFamily ?? plusJakartaSans.style.fontFamily;
  const b = PLATFORM_FONTS[body as PlatformFont]?.style.fontFamily ?? inter.style.fontFamily;
  return `--font-heading: ${h}; --font-body: ${b};`;
}
