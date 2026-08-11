/**
 * lib/api.ts
 *
 * All data-fetching functions for chameleon-templates.
 * Each function uses Next.js fetch() with ISR cache tags so individual
 * pages can be revalidated on-demand when content changes in Payload.
 *
 * STUB — full implementation in Batch 2.
 */

const API_URL = process.env.CHAMELEON_API_URL ?? '';

if (!API_URL && process.env.NODE_ENV === 'production') {
  throw new Error('CHAMELEON_API_URL environment variable is not set.');
}

export type TenantConfig = {
  tenant: {
    id: string;
    name: string;
    domain: string;
    customDomain?: string;
    template: {
      slug: string;
      name: string;
      supportedFeatures: string[];
      featureVariants: Record<string, { variants: string[]; default: string }>;
    };
    featureConfig: Record<string, { enabled: boolean; variant?: string }>;
  };
  settings: {
    siteName: string;
    tagline?: string;
    contactEmail?: string;
    contactPhone?: string;
    colourPrimary: string;
    colourSecondary: string;
    colourAccent: string;
    colourBackground: string;
    colourSurface: string;
    colourText: string;
    colourMuted: string;
    fontHeading: string;
    fontBody: string;
    borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'pill';
    turnstileSiteKey?: string;
    currency: string;
    currencySymbol: string;
  };
};

/**
 * Fetches the full tenant config for a given domain.
 * Cached with ISR — revalidated on-demand via /api/revalidate.
 */
export async function getTenantConfig(domain: string): Promise<TenantConfig> {
  const url = `${API_URL}/api/public/tenant-config?domain=${encodeURIComponent(domain)}`;

  const res = await fetch(url, {
    next: {
      tags: [`tenant-config:${domain}`],
      revalidate: 3600, // 1 hour fallback — webhook revalidation is the primary mechanism
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch tenant config for ${domain}: ${res.status}`);
  }

  return res.json() as Promise<TenantConfig>;
}

// TODO (Batch 2): add getProducts(), getProductBySlug(), getArticles(),
// getServices(), getFaqs(), getLegal(), getPageSeo() etc.
