/**
 * Tenant Resolution Library
 *
 * Core functions:
 * - fetchTenantConfig()     — Fetches tenant config from the engine API (ISR cached)
 * - getTemplateDefinition() — Loads a template's route map by slug
 * - resolvePage()           — Matches a URL path to a page component + variant
 */

import type {
  TemplateDefinition,
  TenantConfig,
  FeatureConfig,
  PageDefinition,
  ResolvedPage,
} from './types';

// ── Template Registry ───────────────────────────────────────────────────────
// Maps template slugs to lazy loaders. Adding a new template = one line here.

const TEMPLATE_REGISTRY: Record<string, () => Promise<{ definition: TemplateDefinition }>> = {
  'atlas': () => import('@/templates/atlas'),
  'meridian': () => import('@/templates/meridian'),
};

/**
 * Loads a template's route map and metadata by slug.
 * Returns null for unknown template slugs (→ 404 in catch-all).
 */
export async function getTemplateDefinition(slug: string): Promise<TemplateDefinition | null> {
  const loader = TEMPLATE_REGISTRY[slug];
  if (!loader) {
    console.warn(`[tenant] Unknown template slug: "${slug}"`);
    return null;
  }
  const mod = await loader();
  return mod.definition;
}

// ── Page Resolution ─────────────────────────────────────────────────────────

/**
 * Resolves a URL path to a page component and variant.
 *
 * Resolution order for variant:
 * 1. Template's defaultVariant (defined in route map)
 * 2. Overridden by tenant's featureConfig[key].variant
 * 3. Overridden by _dv query param (if allowed)
 *
 * Returns null if:
 * - No route matches the path
 * - The matched route's feature is disabled in featureConfig
 * - The resolved variant has no component (shouldn't happen if data is valid)
 */
export async function resolvePage(
  pathSegments: string[],
  templateDef: TemplateDefinition,
  featureConfig: FeatureConfig,
  devOverride?: string | null,
): Promise<ResolvedPage | null> {
  // 1. Match path to route key
  const routeKey = matchRoute(pathSegments, templateDef.routes);
  if (!routeKey) return null;

  const page = templateDef.routes[routeKey];

  // 2. Check if feature is enabled (null feature = always available, e.g. home)
  if (page.feature !== null) {
    const featureEntry = featureConfig[page.feature];
    if (!featureEntry?.enabled) return null;
  }

  // 3. Resolve variant (default → featureConfig → dev override)
  let variant = page.defaultVariant;

  // Check featureConfig for tenant's preferred variant
  const configKey = page.feature ?? routeKey.replace(/^\//, '');
  const configEntry = featureConfig[configKey];
  if (configEntry?.variant && page.variants[configEntry.variant]) {
    variant = configEntry.variant;
  }

  // Dev override (format: "routeKey:variantSlug", e.g. "contact:split-image")
  if (devOverride) {
    const colonIndex = devOverride.indexOf(':');
    if (colonIndex > 0) {
      const overrideRoute = devOverride.slice(0, colonIndex);
      const overrideVariant = devOverride.slice(colonIndex + 1);
      const normalizedRouteKey = routeKey.replace(/^\//, '').replace(/\/\*$/, '');
      if (overrideRoute === normalizedRouteKey && overrideVariant && page.variants[overrideVariant]) {
        variant = overrideVariant;
      }
    }
  }

  // 4. Load the component
  const pageVariant = page.variants[variant];
  if (!pageVariant) {
    console.warn(`[tenant] Variant "${variant}" not found for route "${routeKey}", falling back to default`);
    const fallback = page.variants[page.defaultVariant];
    if (!fallback) return null;
    const mod = await fallback.component();
    return { page, routeKey, variant: page.defaultVariant, Component: mod.default };
  }

  const mod = await pageVariant.component();
  return { page, routeKey, variant, Component: mod.default };
}

/**
 * Matches URL path segments to a route key in the template's route map.
 *
 * Strategy:
 * 1. Home page: segments=[] → matches "/"
 * 2. Exact match: segments=["shop"] → matches "/shop"
 * 3. Wildcard: segments=["shop","my-product"] → matches "/shop/*"
 */
function matchRoute(
  segments: string[],
  routes: Record<string, PageDefinition>,
): string | null {
  // Home page
  if (segments.length === 0) {
    return routes['/'] ? '/' : null;
  }

  // Exact match
  const exactPath = '/' + segments.join('/');
  if (routes[exactPath]) return exactPath;

  // Wildcard match (for detail pages like /shop/product-slug)
  if (segments.length >= 2) {
    const wildcardPath = '/' + segments[0] + '/*';
    if (routes[wildcardPath]) return wildcardPath;
  }

  return null;
}

// ── Tenant Config Fetching ──────────────────────────────────────────────────

const ENGINE_API_URL = process.env.CHAMELEON_API_URL ?? 'https://chameleon-engine-production.up.railway.app';

/**
 * Fetches tenant configuration from the engine API.
 * Uses ISR — cached for 1 hour, revalidated on-demand.
 *
 * The tenant slug is extracted from the domain by the middleware
 * (e.g. "atlas-demo.chameleon.services" → "atlas-demo").
 */
export async function fetchTenantConfig(tenantSlug: string): Promise<TenantConfig | null> {
  try {
    const res = await fetch(
      `${ENGINE_API_URL}/api/public/tenant-config?tenant=${encodeURIComponent(tenantSlug)}`,
      { next: { revalidate: 3600 } }, // ISR: re-fetch every hour
    );

    if (!res.ok) {
      console.warn(`[tenant] Failed to fetch config for "${tenantSlug}": ${res.status}`);
      return null;
    }

    return await res.json() as TenantConfig;
  } catch (error) {
    console.error(`[tenant] Error fetching config for "${tenantSlug}":`, error);
    return null;
  }
}
