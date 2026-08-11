import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import '@/app/globals.css';
import { getTenantConfig } from '@/lib/api';
import { computeSemanticTokens } from '@/lib/tokens';
import { getFontEmbedUrl } from '@/lib/fonts';

/**
 * Tenant layout — wraps all tenant-served pages.
 *
 * This is a Server Component. It:
 * 1. Reads `x-tenant-domain` from the request headers (set by middleware)
 * 2. Fetches the tenant config from chameleon-engine (ISR cached)
 * 3. Computes semantic CSS tokens from the tenant's brand colours
 * 4. Injects them as inline CSS custom properties on <html>
 * 5. Loads the tenant's Google Fonts
 *
 * The token injection happens server-side so there is ZERO flash of
 * unstyled content (FOUC) — the correct brand colours are in the HTML
 * from the very first byte.
 */
export default async function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const tenantDomain = headersList.get('x-tenant-domain') ?? 'unknown';

  // Fetch tenant config from the engine — returns null if not found
  const config = await getTenantConfig(tenantDomain);

  if (!config) {
    // Tenant domain doesn't resolve to any tenant in the database.
    // Show the Next.js not-found page instead of crashing.
    notFound();
  }

  // Compute CSS custom properties from the tenant's brand settings
  const tokenStyle = computeSemanticTokens(config.settings);

  // Build Google Fonts embed URL
  const fontHeading = config.settings?.fontHeading ?? 'Plus Jakarta Sans';
  const fontBody = config.settings?.fontBody ?? 'Inter';
  const fontUrl = getFontEmbedUrl(fontHeading, fontBody);

  // Dynamic metadata from tenant settings
  const siteName = config.settings?.siteName ?? config.tenant.name;

  return (
    <html lang="en" style={tokenStyle} data-tenant={tenantDomain}>
      <head>
        {/* Google Fonts — preconnect + embed */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href={fontUrl} />
        <title>{siteName}</title>
      </head>
      <body
        style={{
          fontFamily: 'var(--font-body)',
          color: 'var(--brand-text)',
          backgroundColor: 'var(--brand-background)',
        }}
      >
        {children}
      </body>
    </html>
  );
}
