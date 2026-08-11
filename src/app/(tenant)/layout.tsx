import { headers } from 'next/headers';
import '@/app/globals.css';

/**
 * Tenant layout — wraps all tenant-served pages.
 *
 * This is a Server Component. It:
 * 1. Reads `x-tenant-domain` from the request headers (set by middleware)
 * 2. Fetches the tenant config from chameleon-engine (ISR cached)
 * 3. Computes semantic CSS tokens from the tenant's brand colours
 * 4. Injects them as inline CSS custom properties on <html>
 *
 * The token injection happens server-side so there is ZERO flash of
 * unstyled content (FOUC) — the correct brand colours are in the HTML
 * from the very first byte.
 *
 * NOTE: computeSemanticTokens() and getTenantConfig() are stubbed for
 * now and will be fully implemented in Batch 2 (lib/tokens.ts, lib/api.ts).
 */
export default async function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const tenantDomain = headersList.get('x-tenant-domain') ?? 'unknown';

  // TODO (Batch 2): replace stub with real implementation
  // const config = await getTenantConfig(tenantDomain);
  // const tokenStyle = computeSemanticTokens(config.settings);
  // const fontClasses = getFontClasses(config.settings.fontHeading, config.settings.fontBody);

  // Stub token style — will be replaced by real brand tokens in Batch 2
  const tokenStyle = {
    '--brand-primary': '#1A1A2E',
    '--brand-accent': '#E94560',
    '--brand-background': '#FFFFFF',
    '--brand-text': '#1A1A2E',
  } as React.CSSProperties;

  return (
    <html lang="en" style={tokenStyle} data-tenant={tenantDomain}>
      <body>
        {children}
      </body>
    </html>
  );
}
