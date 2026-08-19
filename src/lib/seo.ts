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
  /** Per-page SEO from atlas-site-config (highest priority) */
  pageConfigSeo?: {
    title?: string | null;
    description?: string | null;
    ogImage?: { url: string; alt?: string; width?: number; height?: number } | null;
  };
};

/**
 * Generates Next.js Metadata for a page.
 *
 * Priority chain:
 *   1. pageConfigSeo (from atlas-site-config - tenant-editable)
 *   2. PageSEO collection record (legacy, being deprecated)
 *   3. Fallback title/description (hardcoded in template)
 */
export async function generatePageMetadata({
  tenantSlug,
  pageSlug,
  config,
  fallbackTitle,
  fallbackDescription,
  pageConfigSeo,
}: GeneratePageMetadataParams): Promise<Metadata> {
  const seo = await getPageSEO(tenantSlug, pageSlug);
  const siteName = config.settings?.siteName ?? config.tenant.name;

  // Priority: pageConfig  PageSEO  fallback  default
  const title =
    pageConfigSeo?.title ??
    seo?.metaTitle ??
    fallbackTitle ??
    siteName;
  const description =
    pageConfigSeo?.description ??
    seo?.metaDescription ??
    fallbackDescription ??
    config.settings?.tagline ??
    `Welcome to ${siteName}`;

  // OG image: prefer pageConfig, then PageSEO, then null
  const ogImage = pageConfigSeo?.ogImage ?? resolveOgImage(seo);

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
 * These don't have a PageSEO record - metadata comes from the item itself.
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
  const desc = description ?? `${title} - ${siteName}`;

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

// - Helpers -

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
