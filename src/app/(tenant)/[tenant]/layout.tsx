/**
 * Tenant Layout  HTML shell for multi-tenant pages.
 *
 * Responsibilities:
 * 1. Fetches tenant config (React deduplicates with the catch-all page's fetch)
 * 2. Applies platform fonts via CSS class names on <html>
 * 3. Injects brand tokens as CSS custom properties
 * 4. Provides <html> and <body> tags
 *
 * The template-specific chrome (header/footer/nav) is NOT here 
 * that's provided by the template's own Layout component, rendered
 * by the catch-all page.
 */

import type { Metadata, Viewport } from 'next';
import { getFontClasses, getFontVariables } from '@/lib/fonts';
import { fetchTenantConfig } from '@/lib/tenant';
import { DemoExplorer } from '@/templates/atlas/DemoExplorer';
import { definition as atlasDefinition } from '@/templates/atlas/definition';
import { buildExplorerRoutes } from '@/templates/atlas/demo-explorer-utils';

type Props = {
  children: React.ReactNode;
  params: Promise<{ tenant: string }>;
};

/**
 * generateMetadata — per-tenant browser tab favicon.
 *
 * Priority: SiteSettings.logoMark → AtlasSiteConfig.logoMark
 *         → SiteSettings.logo → AtlasSiteConfig.logo
 *         → Chameleon platform mark (fallback)
 *
 * Next.js deduplicates the fetchTenantConfig fetch between this
 * function and TenantLayout within the same request, so there is
 * no double network call.
 */
/**
 * viewport — sets viewport-fit=cover so that env(safe-area-inset-*)
 * CSS values are non-zero on iPhones with a notch / Dynamic Island / home bar.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export async function generateMetadata({ params }: { params: Promise<{ tenant: string }> }): Promise<Metadata> {
  const { tenant } = await params;
  const config = await fetchTenantConfig(tenant);

  const siteName =
    config?.settings?.siteName ??
    config?.pageConfig?.siteName ??
    tenant;

  // Prefer the logoMark (square/icon-only asset) over the full lockup logo
  const faviconUrl =
    config?.settings?.logoMark?.url ??
    config?.pageConfig?.logoMark?.url ??
    config?.settings?.logo?.url ??
    config?.pageConfig?.logo?.url ??
    null;

  const icons = faviconUrl
    ? { icon: faviconUrl, shortcut: faviconUrl, apple: faviconUrl }
    : { icon: '/logo-icon.webp', shortcut: '/logo-icon.webp', apple: '/logo-icon.webp' };

  return {
    title: { default: siteName, template: `%s | ${siteName}` },
    icons,
  };
}

export default async function TenantLayout({ children, params }: Props) {
  const { tenant } = await params;
  const config = await fetchTenantConfig(tenant);

  // Brand config coalesces from two sources:
  // 1. settings (from SiteSettings collection  generic, any template)
  // 2. pageConfig (from atlas-site-config  Atlas-specific, richer)
  // settings takes priority; pageConfig fills in what's missing.
  const pc = config?.pageConfig;
  const s = config?.settings;

  const fontHeading  = s?.fontHeading  ?? pc?.fontHeading  ?? null;
  const fontBody     = s?.fontBody     ?? pc?.fontBody     ?? null;
  const fontDisplay  = s?.fontDisplay  ?? pc?.fontDisplay  ?? null;
  const fontClasses  = getFontClasses(fontHeading, fontBody, fontDisplay);

  // Brand tokens  inject as CSS custom properties
  const brandTokens = buildBrandTokens({
    colourPrimary:    s?.colourPrimary    ?? pc?.colourPrimary    ?? undefined,
    colourSecondary:  s?.colourSecondary  ?? pc?.colourSecondary  ?? undefined,
    colourAccent:     s?.colourAccent     ?? pc?.colourAccent     ?? undefined,
    colourBackground: s?.colourBackground ?? pc?.colourBackground ?? undefined,
    colourText:       s?.colourText       ?? pc?.colourText       ?? undefined,
    colourHeading:    s?.colourHeading    ?? pc?.colourHeading    ?? undefined,
  });

  const buttonStyle = s?.buttonStyle ?? pc?.buttonStyle ?? 'filled';

  // Logo URL — preloaded in <head> to eliminate header CLS
  const logoUrl = s?.logo?.url ?? pc?.logo?.url ?? null;

  // Build demo explorer routes if this is a demo tenant.
  // DemoExplorer lives here (not in AtlasLayout) so it is rendered in the
  // persistent layout segment — it never remounts during client-side page
  // navigation, which means isOpen state survives naturally with no flicker.
  // TODO: select definition by config.tenant.template?.slug when multi-template support lands.
  const explorerRoutes =
    config?.tenant?.isDemoTenant
      ? buildExplorerRoutes(atlasDefinition, config.tenant.featureConfig)
      : null;

  return (
    <html lang="en" className={fontClasses}>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `:root { ${brandTokens} ${getFontVariables(fontHeading, fontBody, fontDisplay)} }`,
          }}
        />
        {/* Preload the logo so it arrives before the header <img> is discovered */}
        {logoUrl && (
          <link rel="preload" as="image" href={logoUrl} fetchPriority="high" />
        )}
      </head>
      <body
        data-btn-style={buttonStyle}
        style={{
          fontFamily: 'var(--font-body, inherit)',
          color: 'var(--brand-text, #333)',
          background: 'var(--brand-background, #ffffff)',
          margin: 0,
        }}
      >
        {children}
        {explorerRoutes && <DemoExplorer routes={explorerRoutes} basePath="" />}
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
  colourAccent?: string;
  colourBackground?: string;
  colourText?: string;
  colourHeading?: string;
} | null | undefined): string {
  const p    = settings?.colourPrimary    ?? '#0B132B';
  const s    = settings?.colourSecondary  ?? '#00E5FF';
  const a    = settings?.colourAccent     ?? '#f59e0b';
  const bg   = settings?.colourBackground ?? '#ffffff';
  const text = settings?.colourText       ?? '#333333';

  const tokens = [
    `--brand-primary: ${p}`,
    `--brand-secondary: ${s}`,
    `--brand-accent: ${a}`,
    `--brand-background: ${bg}`,
    `--brand-text: ${text}`,
    `--brand-surface: color-mix(in oklch, ${bg} 95%, ${p} 5%)`,
  ];

  // Only emit --brand-heading when the tenant has explicitly set a heading colour.
  // Otherwise the CSS :root default (var(--brand-text)) handles it,
  // which means changing text colour also updates heading colour automatically.
  if (settings?.colourHeading) {
    tokens.push(`--brand-heading: ${settings.colourHeading}`);
  }

  return tokens.join('; ');
}
