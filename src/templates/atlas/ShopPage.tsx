import Link from 'next/link';
import type { PageProps } from '@/lib/types';
import { getProducts, getCategories } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { AtlasSortSelect } from './AtlasSortSelect';

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name';

function resolveSort(raw: string | string[] | undefined): SortOption {
  const val = Array.isArray(raw) ? raw[0] : raw;
  if (val === 'price-asc' || val === 'price-desc' || val === 'name') return val;
  return 'newest';
}

function resolveStr(raw: string | string[] | undefined): string | undefined {
  if (!raw) return undefined;
  return Array.isArray(raw) ? raw[0] : raw;
}

export default async function ShopPage({ config, variant, searchParams, noCache }: PageProps) {
  const tenant = config.tenant.slug;
  const currency = config.settings?.currency ?? 'ZAR';
  const siteUrl = `https://${tenant}.chameleon.services`;

  const activeCategory = resolveStr(searchParams.category);
  const sort = resolveSort(searchParams.sort);
  const page = Number(resolveStr(searchParams.page) ?? '1');
  const isDense = variant === 'dense';
  const pc = config.pageConfig;

  // Content from pageConfig with fallbacks
  const shopHeadline = pc?.shopHeadline ?? 'Shop';
  const shopSubheadline = pc?.shopSubheadline ?? null;

  const [productsRes, categoriesRes] = await Promise.all([
    getProducts({
      tenant,
      category: activeCategory,
      sort,
      page,
      limit: isDense ? 16 : 12,
    }, noCache),
    getCategories({ tenant, includeCount: true }, noCache),
  ]);

  const products = productsRes?.docs ?? [];
  const totalPages = productsRes?.totalPages ?? 1;
  const totalDocs = productsRes?.totalDocs ?? 0;
  const categories = categoriesRes?.docs ?? [];

  const activeCategoryObj = categories.find((c) => c.slug === activeCategory);

  // Build query string preserving relevant params
  function buildPageUrl(p: number): string {
    const params = new URLSearchParams();
    if (activeCategory) params.set('category', activeCategory);
    if (sort !== 'newest') params.set('sort', sort);
    if (p > 1) params.set('page', String(p));
    const qs = params.toString();
    return `/shop${qs ? `?${qs}` : ''}`;
  }

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: activeCategoryObj ? `${activeCategoryObj.name} -- Shop` : 'Shop',
    url: `${siteUrl}/shop${activeCategory ? `?category=${activeCategory}` : ''}`,
    ...(products.length > 0 && {
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: products.map((product, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${siteUrl}/shop/${product.slug}`,
          name: product.name,
        })),
      },
    }),
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: activeCategoryObj ? '/shop' : undefined },
    ...(activeCategoryObj ? [{ label: activeCategoryObj.name }] : []),
  ];

  return (
    <>
      <JsonLd data={collectionSchema} />
      <div className="atlas-container" style={{ paddingTop: '1.5rem', paddingBottom: '4rem' }}>
        <Breadcrumbs items={breadcrumbItems} baseUrl={siteUrl} />

        {/* Page Header */}
        <div className="atlas-shop-header">
          <h1 className="atlas-page-title">
            {activeCategoryObj ? activeCategoryObj.name : shopHeadline}
          </h1>
          {!activeCategoryObj && shopSubheadline && (
            <p className="atlas-body-lg" style={{ marginTop: 'var(--atlas-spacing-xs)', opacity: 0.7, maxWidth: 600 }}>
              {shopSubheadline}
            </p>
          )}
          <p className="atlas-shop-count">
            {totalDocs} product{totalDocs !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Category filter pills */}
        {categories.length > 0 && (
          <nav className="atlas-category-pills" aria-label="Filter by category">
            <Link
              href="/shop"
              className={`atlas-pill${!activeCategory ? ' atlas-pill-active' : ''}`}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}${sort !== 'newest' ? `&sort=${sort}` : ''}`}
                className={`atlas-pill${activeCategory === cat.slug ? ' atlas-pill-active' : ''}`}
              >
                {cat.name}
                {cat.productCount != null && (
                  <span className="atlas-pill-count">{cat.productCount}</span>
                )}
              </Link>
            ))}
          </nav>
        )}

        {/* Sort toolbar */}
        <div className="atlas-shop-toolbar">
          <AtlasSortSelect currentSort={sort} currentCategory={activeCategory} />
        </div>

        {/* Product grid */}
        {products.length > 0 ? (
          <>
            <div
              className={`atlas-product-grid${isDense ? ' atlas-product-grid-dense' : ''}`}
            >
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  currency={currency}
                  priority={index < 4}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="atlas-pagination" aria-label="Shop pages">
                {page > 1 && (
                  <Link href={buildPageUrl(page - 1)} className="atlas-page-link" aria-label="Previous page">
                    &larr;
                  </Link>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={buildPageUrl(p)}
                    className={`atlas-page-link${p === page ? ' atlas-page-link-active' : ''}`}
                    aria-current={p === page ? 'page' : undefined}
                  >
                    {p}
                  </Link>
                ))}
                {page < totalPages && (
                  <Link href={buildPageUrl(page + 1)} className="atlas-page-link" aria-label="Next page">
                    &rarr;
                  </Link>
                )}
              </nav>
            )}
          </>
        ) : (
          /* Empty state */
          <div className="atlas-empty-state">
            <p className="atlas-empty-title">No products found</p>
            <p className="atlas-empty-sub">
              {activeCategory
                ? 'No products match this category filter.'
                : 'Check back soon -- more products are on the way.'}
            </p>
            {activeCategory && (
              <Link href="/shop" className="atlas-btn atlas-btn-outline" style={{ marginTop: '1rem' }}>
                Clear Filters
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  );
}
