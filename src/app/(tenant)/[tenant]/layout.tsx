/**
 * Tenant Layout — HTML shell for multi-tenant pages.
 *
 * Responsibilities:
 * 1. Fetches tenant config (React deduplicates with the catch-all page's fetch)
 * 2. Applies platform fonts via CSS class names on <html>
 * 3. Injects brand tokens as CSS custom properties
 * 4. Provides <html> and <body> tags
 *
 * The template-specific chrome (header/footer/nav) is NOT here —
 * that's provided by the template's own Layout component, rendered
 * by the catch-all page.
 */

import { getFontClasses, getFontVariables } from '@/lib/fonts';
import { fetchTenantConfig } from '@/lib/tenant';

type Props = {
  children: React.ReactNode;
  params: Promise<{ tenant: string }>;
};

export default async function TenantLayout({ children, params }: Props) {
  const { tenant } = await params;
  const config = await fetchTenantConfig(tenant);

  // Fonts — fall back to defaults if no config
  const fontHeading = config?.settings?.fontHeading ?? null;
  const fontBody = config?.settings?.fontBody ?? null;
  const fontClasses = getFontClasses(fontHeading, fontBody);

  // Brand tokens — inject as CSS custom properties
  const brandTokens = buildBrandTokens(config?.settings);

  return (
    <html lang="en" className={fontClasses}>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `:root { ${brandTokens} ${getFontVariables(fontHeading, fontBody)} }`,
          }}
        />
      </head>
      <body style={{
        fontFamily: 'var(--font-body, inherit)',
        color: 'var(--brand-text, #333)',
        background: 'var(--brand-background, #ffffff)',
        margin: 0,
      }}>
        {children}
      </body>
    </html>
  );
}

/**
 * Builds CSS custom property declarations from site settings.
 * Falls back to sensible defaults for each token.
 */
function buildBrandTokens(settings: {
  colourPrimary?: string;
  colourSecondary?: string;
  colourBackground?: string;
  colourText?: string;
} | null | undefined): string {
  const p = settings?.colourPrimary ?? '#0B132B';
  const s = settings?.colourSecondary ?? '#00E5FF';
  const bg = settings?.colourBackground ?? '#ffffff';
  const text = settings?.colourText ?? '#333333';

  return [
    `--brand-primary: ${p}`,
    `--brand-secondary: ${s}`,
    `--brand-background: ${bg}`,
    `--brand-text: ${text}`,
    `--brand-surface: color-mix(in oklch, ${bg} 95%, ${p} 5%)`,
  ].join('; ');
}
