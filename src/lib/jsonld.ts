/**
 * JSON-LD Structured Data Builders
 *
 * Generates schema.org JSON-LD objects for search engine rich results.
 * Each builder returns a plain object — use the <JsonLd> component to
 * inject it into the page as a <script> tag.
 */

import type { Product, Article, FAQ, Service, MediaItem } from './api';
import type { TenantConfig } from './types';

// ── Organization ────────────────────────────────────────────────────────────

export function buildOrganizationLd(config: TenantConfig, siteUrl: string) {
  const settings = config.settings;
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings?.siteName ?? config.tenant.name,
    url: siteUrl,
    ...(settings?.logo && { logo: settings.logo.url }),
    ...(settings?.contactEmail && {
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: settings.contactEmail,
      },
    }),
    ...(settings?.socialLinks && {
      sameAs: Object.values(settings.socialLinks).filter(Boolean),
    }),
  };
}

// ── Product ─────────────────────────────────────────────────────────────────

export function buildProductLd(
  product: Product,
  config: TenantConfig,
  productUrl: string,
) {
  const currency = product.currency ?? 'ZAR';
  const image = resolveFirstImage(product.images);

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription ?? product.aiSummary,
    ...(product.sku && { sku: product.sku }),
    ...(image && { image: image.url }),
    url: productUrl,
    brand: {
      '@type': 'Brand',
      name: config.settings?.siteName ?? config.tenant.name,
    },
    offers: {
      '@type': 'Offer',
      price: (product.price / 100).toFixed(2),
      priceCurrency: currency,
      availability:
        product.trackInventory && product.stockLevel != null && product.stockLevel <= 0
          ? 'https://schema.org/OutOfStock'
          : 'https://schema.org/InStock',
      url: productUrl,
      seller: {
        '@type': 'Organization',
        name: config.settings?.siteName ?? config.tenant.name,
      },
    },
    ...(product.expertPros?.length && {
      review: {
        '@type': 'Review',
        author: { '@type': 'Organization', name: 'Expert Review' },
        reviewBody: product.expertPros.map((p) => p.point).join('. '),
      },
    }),
  };
}

// ── Article ─────────────────────────────────────────────────────────────────

export function buildArticleLd(
  article: Article,
  config: TenantConfig,
  articleUrl: string,
) {
  const image = resolveMedia(article.heroImage);
  const siteName = config.settings?.siteName ?? config.tenant.name;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    ...(article.excerpt && { description: article.excerpt }),
    ...(image && { image: image.url }),
    url: articleUrl,
    ...(article.publishedAt && { datePublished: article.publishedAt }),
    dateModified: article.updatedAt,
    author: {
      '@type': article.author ? 'Person' : 'Organization',
      name: article.author ?? siteName,
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      ...(config.settings?.logo && { logo: { '@type': 'ImageObject', url: config.settings.logo.url } }),
    },
  };
}

// ── FAQ Page ────────────────────────────────────────────────────────────────

export function buildFAQPageLd(faqs: FAQ[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: typeof faq.answer === 'string' ? faq.answer : '',
      },
    })),
  };
}

// ── Service ─────────────────────────────────────────────────────────────────

export function buildServiceLd(
  service: Service,
  config: TenantConfig,
  serviceUrl: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    ...(service.shortDescription && { description: service.shortDescription }),
    url: serviceUrl,
    provider: {
      '@type': 'Organization',
      name: config.settings?.siteName ?? config.tenant.name,
    },
  };
}

// ── Breadcrumb List ─────────────────────────────────────────────────────────

export type BreadcrumbItem = {
  name: string;
  url: string;
};

export function buildBreadcrumbLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// ── Local Business (optional, for stores with physical locations) ────────

export function buildLocalBusinessLd(
  config: TenantConfig,
  siteUrl: string,
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  },
) {
  const siteName = config.settings?.siteName ?? config.tenant.name;

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: siteName,
    url: siteUrl,
    ...(config.settings?.contactEmail && { email: config.settings.contactEmail }),
    ...(config.settings?.logo && {
      image: config.settings.logo.url,
      logo: config.settings.logo.url,
    }),
    ...(address && {
      address: {
        '@type': 'PostalAddress',
        ...address,
      },
    }),
  };
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function resolveFirstImage(
  images?: Array<{ image: MediaItem }>,
): MediaItem | null {
  if (!images?.length) return null;
  const first = images[0];
  return first?.image ?? null;
}

function resolveMedia(
  media: MediaItem | number | null | undefined,
): MediaItem | null {
  if (!media || typeof media === 'number') return null;
  return media;
}
