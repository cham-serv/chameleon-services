/**
 * URL Utilities
 *
 * Shared helpers for building URLs from tenant data.
 */

/**
 * Builds the canonical site URL for a tenant.
 *
 * Resolution:
 * - If the slug contains a dot, it's a custom domain → https://{slug}
 * - Otherwise it's a platform subdomain → https://{slug}.chameleon.services
 *
 * Used for JSON-LD @id references, canonical links, and OG URLs.
 */
export function buildSiteUrl(tenantSlug: string): string {
  return tenantSlug.includes('.')
    ? `https://${tenantSlug}`
    : `https://${tenantSlug}.chameleon.services`;
}
