/**
 * Atlas ShopPage — Server Component
 *
 * Product listing with category filter bar, sort controls, and pagination.
 * URL-driven state: ?category=slug&sort=price-asc&page=2
 *
 * Variants:
 *   - editorial: 3-col grid with larger first card
 *   - dense: 4-col uniform grid
 */

import Link from 'next/link';
import type { PageProps } from '@/lib/types';
import { getProducts, getCategories } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import AtlasSortSelect from './AtlasSortSelect';

export default async function ShopPage({ config, variant, searchParams }: PageProps) {
  const tenant = config.tenant.slug;
  const siteName = config.settings?.siteName ?? config.tenant.name;
  const currency = config.settings?.currency ?? 'ZAR';
  const siteUrl = `https://${tenant}.chameleon.services`;

  // Parse URL search params
  const activeCategory = typeof searchParams.category === 'string' ? searchParams.category : undefined;
  const activeSort = typeof searchParams.sort === 'string'
    ? searchParams.sort as 'price-asc' | 'price-desc' | 'newest' | 'name'
    : 'newest';
  const activePage = typeof searchParams.page === 'string' ? parseInt(searchParams.page, 10) || 1 : 1;
  const searchQuery = typeof searchParams.search === 'string' ? searchParams.search : undefined;

  // Parallel data fetches
  const [productsRes, categoriesRes] = await Promise.all([
    getProducts({
      tenant,
      category: activeCategory,
      sort: activeSort,
      search: searchQuery,
      page: activePage,
      limit: variant === 'dense' ? 24 : 12,
    }),
    getCategories({ tenant, includeCount: true }),
  ]);

  const products = productsRes?.docs ?? [];
  const categories = categoriesRes?.docs ?? [];
  const totalPages = productsRes?.totalPages ?? 1;
  const totalDocs = productsRes?.totalDocs ?? 0;

  // Active category name for breadcrumbs
  const activeCategoryName = activeCategory
    ? categories.find((c) => c.slug === activeCategory)?.name ?? activeCategory
    : null;

  // Build breadcrumbs
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    ...(activeCategoryName
      ? [{ label: 'Shop', href: '/shop' }, { label: activeCategoryName }]
      : [{ label: 'Shop' }]),
  ];

  // JSON-LD: CollectionPage
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: activeCategoryName ? `${activeCategoryName} — ${siteName}` : `Shop — ${siteName}`,
    url: `${siteUrl}/shop${activeCategory ? `?category=${activeCategory}` : ''}`,
    ...(products.length > 0 && {
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: totalDocs,
        itemListElement: products.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1 + (activePage - 1) * products.length,
          url: `${siteUrl}/shop/${p.slug}`,
          name: p.name,
        })),
      },
    }),
  };

  // Sort options
  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name', label: 'Name A-Z' },
  ];

  // Helper to build query strings
  function buildUrl(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams();
    const cat = 'category' in overrides ? overrides.category : activeCategory;
    const sort = 'sort' in overrides ? overrides.sort : activeSort;
    const page = 'page' in overrides ? overrides.page : (activePage > 1 ? String(activePage) : undefined);
    const search = 'search' in overrides ? overrides.search : searchQuery;

    if (cat) params.set('category', cat);
    if (sort && sort !== 'newest') params.set('sort', sort);
    if (page && page !== '1') params.set('page', page);
    if (search) params.set('search', search);

    const qs = params.toString();
    return `/shop${qs ? `?${qs}` : ''}`;
  }

  // Build the current base URL for the sort select to navigate from
  const currentBaseUrl = buildUrl({ sort: undefined });

  return (
    <>
      <JsonLd data={collectionSchema} />

      <div className="atlas-container atlas-section-sm">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} baseUrl={siteUrl} />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 'var(--atlas-spacing-lg)', flexWrap: 'wrap', gap: 'var(--atlas-spacing-md)' }}>
          <div>
            <h1 className="atlas-h1">{activeCategoryName ?? 'Shop'}</h1>
            <p className="atlas-caption" style={{ marginTop: 'var(--atlas-spacing-xs)' }}>
              {totalDocs} product{totalDocs !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Sort */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--atlas-spacing-sm)' }}>
            <label htmlFor="atlas-sort" className="atlas-caption">Sort by:</label>
            <AtlasSortSelect
              options={sortOptions}
              activeSort={activeSort}
              baseUrl={currentBaseUrl}
            />
          </div>
        </div>

        {/* Category filter bar */}
        {categories.length > 0 && (
          <nav
            aria-label="Product categories"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--atlas-spacing-sm)',
              marginTop: 'var(--atlas-spacing-lg)',
              marginBottom: 'var(--atlas-spacing-xl)',
            }}
          >
            <Link
              href={buildUrl({ category: undefined, page: '1' })}
              className={`atlas-btn atlas-btn-sm ${!activeCategory ? 'atlas-btn-primary' : 'atlas-btn-ghost'}`}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={buildUrl({ category: cat.slug, page: '1' })}
                className={`atlas-btn atlas-btn-sm ${activeCategory === cat.slug ? 'atlas-btn-primary' : 'atlas-btn-ghost'}`}
              >
                {cat.name}
                {cat.productCount != null && (
                  <span style={{ opacity: 0.6, marginLeft: '0.25rem' }}>({cat.productCount})</span>
                )}
              </Link>
            ))}
          </nav>
        )}

        {/* Product grid */}
        {products.length > 0 ? (
          <div className={variant === 'dense' ? 'atlas-product-grid' : 'atlas-article-grid'}>
            {products.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                currency={currency}
                className="atlas-card atlas-fade-in"
                priority={i < 4}
              />
            ))}
          </div>
        ) : (
          <div className="atlas-empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <p className="atlas-body" style={{ marginTop: 'var(--atlas-spacing-md)' }}>
              No products found{activeCategory ? ` in "${activeCategoryName}"` : ''}.
            </p>
            {activeCategory && (
              <Link href="/shop" className="atlas-btn atlas-btn-outline" style={{ marginTop: 'var(--atlas-spacing-md)' }}>
                Clear Filters
              </Link>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav
            aria-label="Product pagination"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 'var(--atlas-spacing-sm)',
              marginTop: 'var(--atlas-spacing-2xl)',
            }}
          >
            {activePage > 1 && (
              <Link
                href={buildUrl({ page: String(activePage - 1) })}
                className="atlas-btn atlas-btn-ghost atlas-btn-sm"
              >
                ← Previous
              </Link>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Link
                key={page}
                href={buildUrl({ page: String(page) })}
                className={`atlas-btn atlas-btn-sm ${page === activePage ? 'atlas-btn-primary' : 'atlas-btn-ghost'}`}
              >
                {page}
              </Link>
            ))}

            {activePage < totalPages && (
              <Link
                href={buildUrl({ page: String(activePage + 1) })}
                className="atlas-btn atlas-btn-ghost atlas-btn-sm"
              >
                Next →
              </Link>
            )}
          </nav>
        )}
      </div>
    </>
  );
}
