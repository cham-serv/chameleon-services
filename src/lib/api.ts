/**
 * lib/api.ts
 *
 * All data-fetching functions for chameleon-services.
 * Each function uses Next.js fetch() with ISR cache tags so individual
 * pages can be revalidated on-demand when content changes in Payload.
 *
 * IMPORTANT: The TenantConfig type MUST match the actual response shape from
 * chameleon-engine's GET /api/public/tenant-config endpoint.
 * Source of truth: chameleon-engine/src/app/api/public/tenant-config/route.ts
 */

const API_URL = process.env.CHAMELEON_API_URL ?? '';

// ── Types ────────────────────────────────────────────────────────────────────
// These types are derived line-by-line from the curated response in
// tenant-config/route.ts (lines 99–191). If the engine API changes,
// update these types to match.

/** Media object shape when Payload resolves an upload at depth: 1 */
export type PayloadMedia = {
  id: number;
  url: string;
  filename: string;
  mimeType: string;
  width?: number;
  height?: number;
  alt?: string;
} | null;

/** Opening hours block from the openingHours array field */
export type OpeningHoursBlock = {
  dayOfWeek: string[];
  isClosed: boolean;
  opens?: string;
  closes?: string;
};

/** Delivery region from the defaultDeliveryRegions array field */
export type DeliveryRegion = {
  region: string;
};

/**
 * Template metadata — the safe subset returned by the API.
 * Does NOT include status, previewImage, description, or assetRequirements.
 */
export type TenantTemplate = {
  slug: string;
  name: string;
  category: 'ecommerce' | 'services' | 'local-business' | 'artisan';
  supportedFeatures: string[];
  featureVariants: Record<string, { variants: string[]; default: string }> | null;
};

/**
 * Curated SiteSettings — ONLY the fields the API actually returns.
 * Excludes: paymentGatewayMerchantId, paymentGatewaySecret, brandVoice,
 * brandToneKeywords, avoidPhrases, enableWholesale, b2bAccessCode,
 * turnstileSecretKey, socialAccounts.
 */
export type TenantSettings = {
  // Identity
  siteName: string | null;
  tagline: string | null;
  logo: PayloadMedia;
  logoMark: PayloadMedia;

  // Contact
  contactEmail: string | null;
  contactPhone: string | null;

  // Address (PostalAddress schema)
  addressStreet: string | null;
  addressCity: string | null;
  addressProvince: string | null;
  addressPostalCode: string | null;
  addressCountry: string | null;
  geoLat: number | null;
  geoLng: number | null;

  // Opening hours (OpeningHoursSpecification schema)
  openingHours: OpeningHoursBlock[] | null;

  // Social links (sameAs schema)
  socialFacebook: string | null;
  socialInstagram: string | null;
  socialLinkedIn: string | null;
  socialTwitter: string | null;
  socialYoutube: string | null;
  socialGoogle: string | null;

  // Brand tokens (CSS variables)
  fontHeading: string | null;
  fontBody: string | null;
  colourPrimary: string | null;
  colourSecondary: string | null;
  colourAccent: string | null;
  colourBackground: string | null;

  // Reviews
  enableReviews: boolean;

  // Turnstile (public site key only — secret is never sent)
  turnstileSiteKey: string | null;

  // Ecommerce
  currency: string | null;
  currencySymbol: string | null;
  paymentGateway: 'payfast' | 'paystack' | 'stripe' | null;
  flatShippingRate: number | null;
  freeShippingThreshold: number | null;

  // Global schema defaults
  defaultReturnDays: number | null;
  defaultReturnMethod: 'mail' | 'in-store' | 'both' | null;
  defaultReturnFees: 'free' | 'buyer-pays' | null;
  defaultDeliveryLeadTime: string | null;
  defaultHandlingTimeDays: number | null;
  defaultDeliveryRegions: DeliveryRegion[] | null;

  // Feature flags
  enableSubscriptions: boolean;
  enableReorderLinks: boolean;
  enableWishlist: boolean;
  enableStockUrgency: boolean;
  enableQuickView: boolean;
  enableProductComparison: boolean;
};

export type TenantConfig = {
  tenant: {
    id: number;
    slug: string;
    name: string;
    template: TenantTemplate | null;
    featureConfig: Record<string, { enabled: boolean; variant?: string }>;
  };
  settings: TenantSettings | null;
};

// ── Fetch functions ──────────────────────────────────────────────────────────

/**
 * Fetches the full tenant config for a given domain.
 * Cached with ISR — revalidated on-demand via /api/revalidate.
 *
 * Returns null (instead of throwing) when the tenant is not found,
 * so the tenant layout can render a "not found" page gracefully.
 */
export async function getTenantConfig(
  domain: string,
): Promise<TenantConfig | null> {
  if (!API_URL) {
    console.warn(
      '[api] CHAMELEON_API_URL not set — returning null. Set it in .env.local.',
    );
    return null;
  }

  const url = `${API_URL}/api/public/tenant-config?domain=${encodeURIComponent(domain)}`;

  try {
    const res = await fetch(url, {
      next: {
        tags: [`tenant-config:${domain}`],
        revalidate: 3600, // 1-hour fallback; webhook revalidation is primary
      },
    });

    if (res.status === 404) {
      return null;
    }

    if (!res.ok) {
      console.error(
        `[api] tenant-config failed for ${domain}: ${res.status} ${res.statusText}`,
      );
      return null;
    }

    return (await res.json()) as TenantConfig;
  } catch (err) {
    console.error(`[api] tenant-config fetch error for ${domain}:`, err);
    return null;
  }
}

// TODO (Batch 2+): add getProducts(), getProductBySlug(), getArticles(),
// getServices(), getFaqs(), getLegal(), getPageSeo() etc.
