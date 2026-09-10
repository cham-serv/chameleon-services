/**
 * schema-utils.ts — Structural Schema Utilities
 *
 * Contains schema.org helpers that are legitimately computed at
 * render time in the frontend because they depend on runtime data:
 *
 *  buildBreadcrumbLd      — BreadcrumbList from current URL/path context
 *  buildCategoryHubLd     — CollectionPage + FAQPage for a product category
 *                           (depends on active URL filter param, not pre-computable)
 *
 * ────────────────────────────────────────────────────────────────────────────
 * All GEO/SEO *intelligence* (LocalBusiness, Organization, Product, Article,
 * Service, Person, FAQPage schemas) has been moved to chameleon-engine and is
 * pre-computed at the tenant-config API level. The frontend is a "blind
 * injector" of those schemas via <PageSchemas> and <JsonLd>.
 *
 * @see src/templates/atlas/AtlasLayout.tsx    — global schema injection
 * @see src/app/(tenant)/[tenant]/layout.tsx   — global schema injection
 * @see src/components/JsonLd.tsx              — PageSchemas / JsonLd components
 * ────────────────────────────────────────────────────────────────────────────
 */

import type { Product, ProductCategory } from './api';

// ─── BreadcrumbList ─────────────────────────────────────────────────────────

export type BreadcrumbItem = {
  name: string;
  url: string;
};

/**
 * Builds a BreadcrumbList schema.org object.
 * Used by the <Breadcrumbs> UI component and individual page files
 * where a local breadcrumb is simpler than a pre-computed engine schema.
 */
export function buildBreadcrumbLd(items: BreadcrumbItem[]): Record<string, unknown> {
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

// ─── Category Hub ────────────────────────────────────────────────────────────

/**
 * Builds CollectionPage + optional FAQPage schemas for a product category hub.
 *
 * This remains in the frontend because it depends on:
 *   - The active category filter (runtime URL search param)
 *   - The live product list for that category (fetched per-request)
 *   - The category's categoryFaqs (may be empty or populated)
 *
 * These are not known at tenant-config time, so the engine cannot pre-compute them.
 * When a category is active, this replaces the engine's static shop page schema.
 */
export function buildCategoryHubLd(
  category: ProductCategory,
  products: Product[],
  siteUrl: string,
  siteName: string,
): Record<string, unknown>[] {
  const schemas: Record<string, unknown>[] = [];
  const categoryUrl = `${siteUrl}/shop?category=${category.slug}`;

  // CollectionPage with entity linking via wikidataUrl
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.metaTitle || category.name,
    description: category.aiSummary || category.metaDescription || category.description,
    url: categoryUrl,
    ...(category.wikidataUrl && {
      about: {
        '@type': 'Thing',
        name: category.name,
        sameAs: category.wikidataUrl,
      },
    }),
    ...(products.length > 0 && {
      hasPart: {
        '@type': 'ItemList',
        numberOfItems: products.length,
        itemListElement: products.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Product',
            name: p.name,
            url: `${siteUrl}/shop/${p.slug}`,
          },
        })),
      },
    }),
    isPartOf: { '@type': 'WebSite', name: siteName, url: siteUrl },
  });

  // FAQPage if categoryFaqs populated
  if (category.categoryFaqs?.length) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: category.categoryFaqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    });
  }

  return schemas;
}
