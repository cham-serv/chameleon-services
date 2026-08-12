/**
 * SEO Metadata Helpers
 *
 * Generates Next.js Metadata objects from engine data.
 * Used in `generateMetadata()` exports across template pages.
 */

import type { Metadata } from 'next';
import type { TenantConfig } from './types';
import { getPageSEO, type PageSEO } from './api';

type GeneratePageMetadataParams = {
  /** Tenant slug for API lookup */
  tenantSlug: string;
  /** Page slug matching the PageSEO collection (e.g. 'home', 'shop', 'contact') */
  pageSlug: string;
  /** Full tenant config for fallback values */
  config: TenantConfig;
  /** Fallback title if no SEO record exists */
  fallbackTitle?: string;
  /** Fallback description */
  fallbackDescription?: string;
};

/**
 * Generates Next.js Metadata for a page by fetching the engine's PageSEO record
 * and falling back to tenant config / hardcoded defaults.
 */
export async function generatePageMetadata({
  tenantSlug,
  pageSlug,
  config,
  fallbackTitle,
  fallbackDescription,
}: GeneratePageMetadataParams): Promise<Metadata> {
  const seo = await getPageSEO(tenantSlug, pageSlug);
  const siteName = config.settings?.siteName ?? config.tenant.name;

  const title = seo?.metaTitle ?? fallbackTitle ?? siteName;
  const description =
    seo?.metaDescription ??
    fallbackDescription ??
    config.settings?.tagline ??
    `Welcome to ${siteName}`;

  const ogImage = resolveOgImage(seo);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName,
      type: 'website',
      ...(ogImage && { images: [ogImage] }),
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title,
      description,
    },
  };
}

/**
 * Generates metadata for a detail page (product, article, service).
 * These don't have a PageSEO record — metadata comes from the item itself.
 */
export function generateItemMetadata({
  title,
  description,
  image,
  siteName,
  type = 'article',
}: {
  title: string;
  description?: string;
  image?: { url: string; alt?: string; width?: number; height?: number } | null;
  siteName: string;
  type?: 'article' | 'product';
}): Metadata {
  const desc = description ?? `${title} — ${siteName}`;

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      siteName,
      type: type === 'product' ? 'website' : 'article',
      ...(image && {
        images: [
          {
            url: image.url,
            alt: image.alt ?? title,
            ...(image.width && { width: image.width }),
            ...(image.height && { height: image.height }),
          },
        ],
      }),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description: desc,
    },
  };
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function resolveOgImage(
  seo: PageSEO | null,
): { url: string; alt?: string; width?: number; height?: number } | null {
  if (!seo?.ogImage || typeof seo.ogImage === 'number') return null;
  return {
    url: seo.ogImage.url,
    alt: seo.ogImage.alt,
    width: seo.ogImage.width,
    height: seo.ogImage.height,
  };
}
