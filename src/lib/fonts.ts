/**
 * Platform Font Registry - self-hosted via next/font/google.
 *
 * All fonts are downloaded at build time and served from the Vercel CDN.
 * Zero external DNS lookups, zero render-blocking requests, GDPR compliant.
 *
 * The curated list IS the feature: 20 excellent, carefully selected fonts
 * instead of 1,400+ from Google Fonts (most poor quality).
 *
 * CAPACITY: This registry is now at 20 fonts — the soft cap.
 * To add more, remove a font first or revisit the cap decision.
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
  Roboto,
  Nunito,
  Josefin_Sans,
  Merriweather,
  Oswald,
} from 'next/font/google';

// - Font instances (declared at module level - next/font requirement) -

// preload: false on ALL fonts — this is intentional and critical for performance.
// next/font defaults to preload: true, which injects a <link rel="preload"> for every
// font instantiated in a file that is imported. Because this registry file is imported
// on every tenant page, without preload: false the browser would be told to preload
// all 20 fonts on every single page load — destroying LCP and Lighthouse scores.
// With preload: false the @font-face rules are still generated and self-hosted;
// the browser downloads only the 1–3 fonts it actually encounters during layout.
const inter           = Inter({ subsets: ['latin'], variable: '--nf-inter', display: 'swap', preload: false });
const lato            = Lato({ subsets: ['latin'], weight: ['300', '400', '700'], variable: '--nf-lato', display: 'swap', preload: false });
const openSans        = Open_Sans({ subsets: ['latin'], variable: '--nf-opensans', display: 'swap', preload: false });
const dmSans          = DM_Sans({ subsets: ['latin'], variable: '--nf-dmsans', display: 'swap', preload: false });
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--nf-jakarta', display: 'swap', preload: false });
const outfit          = Outfit({ subsets: ['latin'], variable: '--nf-outfit', display: 'swap', preload: false });
const poppins         = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--nf-poppins', display: 'swap', preload: false });
const montserrat      = Montserrat({ subsets: ['latin'], variable: '--nf-montserrat', display: 'swap', preload: false });
const figtree         = Figtree({ subsets: ['latin'], variable: '--nf-figtree', display: 'swap', preload: false });
const raleway         = Raleway({ subsets: ['latin'], variable: '--nf-raleway', display: 'swap', preload: false });
const syne            = Syne({ subsets: ['latin'], variable: '--nf-syne', display: 'swap', preload: false });
const lora            = Lora({ subsets: ['latin'], variable: '--nf-lora', display: 'swap', preload: false });
const playfairDisplay = Playfair_Display({ subsets: ['latin'], variable: '--nf-playfair', display: 'swap', preload: false });
const jetbrainsMono   = JetBrains_Mono({ subsets: ['latin'], variable: '--nf-jetbrains', display: 'swap', preload: false });
const spaceGrotesk    = Space_Grotesk({ subsets: ['latin'], variable: '--nf-spacegrotesk', display: 'swap', preload: false });
const roboto          = Roboto({ subsets: ['latin'], weight: ['300', '400', '500', '700'], variable: '--nf-roboto', display: 'swap', preload: false });
const nunito          = Nunito({ subsets: ['latin'], variable: '--nf-nunito', display: 'swap', preload: false });
const josefinSans     = Josefin_Sans({ subsets: ['latin'], variable: '--nf-josefin', display: 'swap', preload: false });
const merriweather    = Merriweather({ subsets: ['latin'], weight: ['300', '400', '700'], variable: '--nf-merriweather', display: 'swap', preload: false });
const oswald          = Oswald({ subsets: ['latin'], variable: '--nf-oswald', display: 'swap', preload: false });

// - Public registry -

export const PLATFORM_FONTS = {
  // Sans-serif — neutral / versatile
  'DM Sans':           dmSans,
  'Inter':             inter,
  'Lato':              lato,
  'Nunito':            nunito,
  'Open Sans':         openSans,
  'Roboto':            roboto,
  // Sans-serif — modern / geometric
  'Figtree':           figtree,
  'Montserrat':        montserrat,
  'Outfit':            outfit,
  'Plus Jakarta Sans': plusJakartaSans,
  'Poppins':           poppins,
  'Raleway':           raleway,
  // Sans-serif — editorial / distinctive
  'Josefin Sans':      josefinSans,
  'Space Grotesk':     spaceGrotesk,
  'Syne':              syne,
  // Condensed / Display
  'Oswald':            oswald,
  // Serif
  'Lora':              lora,
  'Merriweather':      merriweather,
  'Playfair Display':  playfairDisplay,
  // Mono
  'JetBrains Mono':    jetbrainsMono,
} as const;

export type PlatformFont = keyof typeof PLATFORM_FONTS;

/**
 * Returns combined CSS class names for the tenant's selected fonts.
 * Falls back to Plus Jakarta Sans (heading) + Inter (body) if not found.
 */
export function getFontClasses(
  heading: string | null | undefined,
  body: string | null | undefined,
  display?: string | null,
): string {
  const h = PLATFORM_FONTS[heading as PlatformFont]?.className ?? plusJakartaSans.className;
  const b = PLATFORM_FONTS[body as PlatformFont]?.className ?? inter.className;
  // Display font: only add its class if it's a different font from heading
  const d = display && display !== heading
    ? (PLATFORM_FONTS[display as PlatformFont]?.className ?? '')
    : '';
  return [h, b, d].filter(Boolean).join(' ');
}

/**
 * Returns CSS variable declarations for the tenant's selected fonts.
 * Used in the tenant layout's <style> tag.
 */
export function getFontVariables(
  heading: string | null | undefined,
  body: string | null | undefined,
  display?: string | null,
): string {
  const h = PLATFORM_FONTS[heading as PlatformFont]?.style.fontFamily ?? plusJakartaSans.style.fontFamily;
  const b = PLATFORM_FONTS[body as PlatformFont]?.style.fontFamily ?? inter.style.fontFamily;
  // --font-display falls back to --font-heading if no separate display font is set
  const d = display
    ? (PLATFORM_FONTS[display as PlatformFont]?.style.fontFamily ?? h)
    : h;
  return `--font-display: ${d}; --font-heading: ${h}; --font-body: ${b};`;
}

/**
 * Returns the pre-computed CSS font-family stack for a named platform font.
 *
 * Used by DemoExplorer to update --font-heading / --font-body at runtime
 * WITHOUT making any request to Google Fonts CDN — the fonts are already
 * self-hosted via next/font/google and available immediately.
 *
 * Falls back to Plus Jakarta Sans (heading/display) or Inter (body) if the name
 * is not in the registry.
 */
export function getFontStack(
  fontName: string | null | undefined,
  role: 'display' | 'heading' | 'body' = 'body',
): string {
  const found = PLATFORM_FONTS[fontName as PlatformFont]?.style.fontFamily;
  if (found) return found;
  // Safe fallback — use the default for each role
  return role === 'body'
    ? inter.style.fontFamily
    : plusJakartaSans.style.fontFamily;
}
