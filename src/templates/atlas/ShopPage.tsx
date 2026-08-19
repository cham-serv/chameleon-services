/**
 * Atlas ShopPage - Server Component
 *
 * Variant dispatch pattern:
 *   catalog  - Traditional 2-col layout: sticky left sidebar (categories + sort) + dense grid
 *   modern   - Full-width grid: sticky horizontal filter bar, image-swap on hover
 *   lookbook - Visual boutique: asymmetric grid, large portrait images, hover overlay
 *
 * All variants use the same server-side data fetching and URL-based filtering.
 * No client-side state management - category and sort changes navigate to a new URL.
 */

import Link from "next/link";
import React from "react";
import type { PageProps } from "@/lib/types";
import { getProducts, getCategories, getCategoryBySlug } from "@/lib/api";
import type { Product, ProductCategory } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RichTextRenderer } from "@/components/RichTextRenderer";
import { JsonLd } from "@/components/JsonLd";
import { buildBreadcrumbLd, buildCategoryHubLd } from "@/lib/jsonld";
import { AtlasSortSelect } from "./AtlasSortSelect";

//  Types 

type SortOption = "newest" | "price-asc" | "price-desc" | "name";

//  Helpers 

function resolveSort(raw: string | string[] | undefined): SortOption {
  const val = Array.isArray(raw) ? raw[0] : raw;
  if (val === "price-asc" || val === "price-desc" || val === "name") return val;
  return "newest";
}

function resolveStr(raw: string | string[] | undefined): string | undefined {
  if (!raw) return undefined;
  return Array.isArray(raw) ? raw[0] : raw;
}

function buildPageUrl(p: number, activeCategory?: string, sort?: SortOption): string {
  const params = new URLSearchParams();
  if (activeCategory) params.set("category", activeCategory);
  if (sort && sort !== "newest") params.set("sort", sort);
  if (p > 1) params.set("page", String(p));
  const qs = params.toString();
  return `/shop${qs ? `?${qs}` : ""}`;
}

function buildCatUrl(slug: string | null, sort: SortOption): string {
  const params = new URLSearchParams();
  if (slug) params.set("category", slug);
  if (sort !== "newest") params.set("sort", sort);
  return `/shop${params.toString() ? `?${params.toString()}` : ""}`;
}

function getSecondaryImage(product: Product): string | null {
  if (!product.images || product.images.length < 2) return null;
  return product.images[1]?.image?.url ?? null;
}

//  Main Component 

export default async function ShopPage({ config, variant, searchParams, noCache }: PageProps) {
  const tenant = config.tenant.slug;
  const currency = config.settings?.currency ?? "ZAR";
  const siteUrl = `https://${tenant}.chameleon.services`;

  const activeCategory = resolveStr(searchParams?.category);
  const sort = resolveSort(searchParams?.sort);
  const page = Number(resolveStr(searchParams?.page) ?? "1");
  const pc = config.pageConfig;

  const shopHeadline = pc?.shopHeadline ?? "Shop";
  const shopSubheadline = pc?.shopSubheadline ?? null;

  // Lookbook uses portrait cards - fewer per page looks better
  const limit = variant === "lookbook" ? 9 : 12;

  const [productsRes, categoriesRes] = await Promise.all([
    getProducts({ tenant, category: activeCategory, sort, page, limit }, noCache),
    getCategories({ tenant, includeCount: true }, noCache),
  ]);

  const products = productsRes?.docs ?? [];
  const totalPages = productsRes?.totalPages ?? 1;
  const totalDocs = productsRes?.totalDocs ?? 0;
  const categories = categoriesRes?.docs ?? [];

  // Fetch full category Intelligence data when filtering by category
  const activeCategoryObj = categories.find((c) => c.slug === activeCategory) ?? null;
  const activeCategoryFull = activeCategory
    ? await getCategoryBySlug(tenant, activeCategory, noCache)
    : null;

  //  Shared: JSON-LD 

  // BreadcrumbList - injected on all variants
  const breadcrumbSchema = buildBreadcrumbLd([
    { name: "Home", url: `${siteUrl}/` },
    { name: "Shop", url: `${siteUrl}/shop` },
    ...(activeCategoryObj ? [{ name: activeCategoryObj.name, url: `${siteUrl}/shop?category=${activeCategoryObj.slug}` }] : []),
  ]);

  // Category hub schemas - CollectionPage + optional FAQPage
  const categoryHubSchemas = activeCategoryFull
    ? buildCategoryHubLd(activeCategoryFull, products, siteUrl, config.settings?.siteName ?? config.tenant.name)
    : [];

  // Fallback CollectionPage for the main shop index
  const shopIndexSchema: Record<string, unknown> | null = !activeCategory ? {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: shopHeadline,
    description: shopSubheadline ?? undefined,
    url: `${siteUrl}/shop`,
    ...(products.length > 0 && {
      mainEntity: {
        "@type": "ItemList",
        itemListElement: products.map((product, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${siteUrl}/shop/${product.slug}`,
          name: product.name,
        })),
      },
    }),
  } : null;

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Shop", href: activeCategoryObj ? "/shop" : undefined },
    ...(activeCategoryObj ? [{ label: activeCategoryObj.name }] : []),
  ];

  //  Shared: Pagination 

  const Pagination = totalPages > 1 ? (
    <nav className="atlas-pagination" aria-label="Shop pages">
      {page > 1 && (
        <Link href={buildPageUrl(page - 1, activeCategory, sort)} className="atlas-page-link" aria-label="Previous page">
          &larr;
        </Link>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={buildPageUrl(p, activeCategory, sort)}
          className={`atlas-page-link${p === page ? " atlas-page-link-active" : ""}`}
          aria-current={p === page ? "page" : undefined}
        >
          {p}
        </Link>
      ))}
      {page < totalPages && (
        <Link href={buildPageUrl(page + 1, activeCategory, sort)} className="atlas-page-link" aria-label="Next page">
          &rarr;
        </Link>
      )}
    </nav>
  ) : null;

  //  Shared: Empty State 

  const EmptyState = (
    <div className="atlas-empty-state">
      <p className="atlas-empty-title">No products found</p>
      <p className="atlas-empty-sub">
        {activeCategory
          ? "No products match this category filter."
          : "Check back soon - more products are on the way."}
      </p>
      {activeCategory && (
        <Link href="/shop" className="atlas-btn atlas-btn-outline" style={{ marginTop: "1rem" }}>
          Clear Filters
        </Link>
      )}
    </div>
  );

  //  Variant Dispatch 

  const renderProps: RenderProps = {
    products, categories, activeCategory, activeCategoryObj, activeCategoryFull,
    sort, page, currency, shopHeadline, shopSubheadline, totalDocs,
    breadcrumbSchema, categoryHubSchemas, shopIndexSchema, breadcrumbItems,
    siteUrl, Pagination, EmptyState,
  };

  switch (variant) {
    case "modern":   return renderModern(renderProps);
    case "lookbook": return renderLookbook(renderProps);
    case "catalog":
    default:         return renderCatalog(renderProps);
  }
}

//  Shared render props type 

type RenderProps = {
  products: Product[];
  categories: ProductCategory[];
  activeCategory: string | undefined;
  activeCategoryObj: ProductCategory | null;
  activeCategoryFull: ProductCategory | null;
  sort: SortOption;
  page: number;
  currency: string;
  shopHeadline: string;
  shopSubheadline: string | null;
  totalDocs: number;
  breadcrumbSchema: Record<string, unknown>;
  categoryHubSchemas: Record<string, unknown>[];
  shopIndexSchema: Record<string, unknown> | null;
  breadcrumbItems: { label: string; href?: string }[];
  siteUrl: string;
  Pagination: React.ReactNode;
  EmptyState: React.ReactNode;
};

//  Render: Catalog (Sidebar Layout) 

function renderCatalog({
  products, categories, activeCategory, activeCategoryObj, activeCategoryFull,
  sort, currency, shopHeadline, shopSubheadline, totalDocs,
  breadcrumbSchema, categoryHubSchemas, shopIndexSchema, breadcrumbItems,
  siteUrl, Pagination, EmptyState,
}: RenderProps) {
  const totalCategoryProducts = categories.reduce((s, c) => s + (c.productCount ?? 0), 0);
  return (
    <div data-variant="catalog">
      <JsonLd data={breadcrumbSchema} />
      {categoryHubSchemas.map((s, i) => <JsonLd key={i} data={s} />)}
      {shopIndexSchema && <JsonLd data={shopIndexSchema} />}
      <div className="atlas-container" style={{ paddingTop: "1.5rem", paddingBottom: "4rem" }}>
        <Breadcrumbs items={breadcrumbItems} baseUrl={siteUrl} />
        <div className="atlas-shop-header">
          <h1 className="atlas-page-title">
            {activeCategoryObj ? activeCategoryObj.name : shopHeadline}
          </h1>
          {!activeCategoryObj && shopSubheadline && (
            <p className="atlas-body-lg" style={{ marginTop: "var(--atlas-spacing-xs)", opacity: 0.7, maxWidth: 600 }}>
              {shopSubheadline}
            </p>
          )}
          <p className="atlas-shop-count">{totalDocs} product{totalDocs !== 1 ? "s" : ""}</p>
        </div>

        <div className="atlas-catalog-layout">
          {/* Sidebar - hidden on mobile */}
          <aside className="atlas-catalog-sidebar" aria-label="Shop filters">
            {categories.length > 0 && (
              <nav aria-label="Filter by category">
                <p className="atlas-overline" style={{ marginBottom: "var(--atlas-spacing-sm)" }}>Categories</p>
                <ul className="atlas-catalog-cat-list" style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  <li>
                    <Link
                      href={buildCatUrl(null, sort)}
                      className={`atlas-catalog-cat-link${!activeCategory ? " atlas-catalog-cat-link--active" : ""}`}
                    >
                      <span>All Products</span>
                      <span className="atlas-catalog-cat-count">{totalCategoryProducts}</span>
                    </Link>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <Link
                        href={buildCatUrl(cat.slug, sort)}
                        className={`atlas-catalog-cat-link${activeCategory === cat.slug ? " atlas-catalog-cat-link--active" : ""}`}
                      >
                        <span>{cat.name}</span>
                        {cat.productCount != null && (
                          <span className="atlas-catalog-cat-count">{cat.productCount}</span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            <div style={{ marginTop: "var(--atlas-spacing-xl)" }}>
              <p className="atlas-overline" style={{ marginBottom: "var(--atlas-spacing-sm)" }}>Sort by</p>
              <AtlasSortSelect currentSort={sort} currentCategory={activeCategory} />
            </div>
          </aside>

          {/* Content */}
          <div className="atlas-catalog-content">
            {/* Mobile pill bar */}
            {categories.length > 0 && (
              <nav className="atlas-category-pills atlas-catalog-pills-mobile" aria-label="Filter by category">
                <Link href={buildCatUrl(null, sort)} className={`atlas-pill${!activeCategory ? " atlas-pill-active" : ""}`}>All</Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={buildCatUrl(cat.slug, sort)}
                    className={`atlas-pill${activeCategory === cat.slug ? " atlas-pill-active" : ""}`}
                  >
                    {cat.name}
                    {cat.productCount != null && <span className="atlas-pill-count">{cat.productCount}</span>}
                  </Link>
                ))}
              </nav>
            )}
            {products.length > 0 ? (
              <>
                <div className="atlas-product-grid">
                  {products.map((product, index) => (
                    <ProductCard key={product.id} product={product} currency={currency} priority={index < 4} />
                  ))}
                </div>
                {Pagination}
              </>
            ) : EmptyState}

            {/* Category Hub Content: Buyers Guide */}
            {activeCategoryFull?.buyersGuide != null && (
              <section className="atlas-buyers-guide" style={{ marginTop: 'var(--atlas-spacing-3xl)' }}>
                <RichTextRenderer content={activeCategoryFull.buyersGuide} className="atlas-article-body" />
              </section>
            )}

            {/* Category Hub Content: Category FAQs */}
            {activeCategoryFull?.categoryFaqs && activeCategoryFull.categoryFaqs.length > 0 && (
              <section style={{ marginTop: 'var(--atlas-spacing-2xl)' }}>
                <h2 className="atlas-pdp-section-title">Frequently Asked Questions</h2>
                <div className="atlas-pdp-faq-list">
                  {activeCategoryFull.categoryFaqs.map((faq, i) => (
                    <details key={i} className="atlas-pdp-faq-item">
                      <summary className="atlas-pdp-faq-question">{faq.question}</summary>
                      <p className="atlas-pdp-faq-answer">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

//  Render: Modern (Full-width + sticky filter bar) 

function renderModern({
  products, categories, activeCategory, activeCategoryObj, activeCategoryFull,
  sort, currency, shopHeadline, shopSubheadline, totalDocs,
  breadcrumbSchema, categoryHubSchemas, shopIndexSchema, breadcrumbItems,
  siteUrl, Pagination, EmptyState,
}: RenderProps) {
  return (
    <div data-variant="modern">
      <JsonLd data={breadcrumbSchema} />
      {categoryHubSchemas.map((s, i) => <JsonLd key={i} data={s} />)}
      {shopIndexSchema && <JsonLd data={shopIndexSchema} />}
      <div className="atlas-container" style={{ paddingTop: "1.5rem", paddingBottom: "1.5rem" }}>
        <Breadcrumbs items={breadcrumbItems} baseUrl={siteUrl} />
        <div className="atlas-shop-header">
          <h1 className="atlas-page-title">
            {activeCategoryObj ? activeCategoryObj.name : shopHeadline}
          </h1>
          {!activeCategoryObj && shopSubheadline && (
            <p className="atlas-body-lg" style={{ marginTop: "var(--atlas-spacing-xs)", opacity: 0.7, maxWidth: 600 }}>
              {shopSubheadline}
            </p>
          )}
          <p className="atlas-shop-count">{totalDocs} product{totalDocs !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* Sticky horizontal filter bar */}
      <div className="atlas-modern-filter-bar">
        <div className="atlas-container atlas-modern-filter-inner">
          {categories.length > 0 && (
            <nav className="atlas-modern-filter-pills" aria-label="Filter by category">
              <Link href={buildCatUrl(null, sort)} className={`atlas-pill${!activeCategory ? " atlas-pill-active" : ""}`}>All</Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={buildCatUrl(cat.slug, sort)}
                  className={`atlas-pill${activeCategory === cat.slug ? " atlas-pill-active" : ""}`}
                >
                  {cat.name}
                  {cat.productCount != null && <span className="atlas-pill-count">{cat.productCount}</span>}
                </Link>
              ))}
            </nav>
          )}
          <div className="atlas-modern-filter-sort">
            <AtlasSortSelect currentSort={sort} currentCategory={activeCategory} />
          </div>
        </div>
      </div>

      <div className="atlas-container" style={{ paddingBottom: "4rem", paddingTop: "var(--atlas-spacing-xl)" }}>
        {products.length > 0 ? (
          <>
            <div className="atlas-product-grid atlas-modern-grid">
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  currency={currency}
                  priority={index < 4}
                  secondaryImageUrl={getSecondaryImage(product)}
                  className="atlas-modern-card"
                />
              ))}
            </div>
            {Pagination}
          </>
        ) : EmptyState}

        {/* Category Hub Content */}
        {activeCategoryFull?.buyersGuide != null && (
          <section className="atlas-buyers-guide" style={{ marginTop: 'var(--atlas-spacing-3xl)' }}>
            <RichTextRenderer content={activeCategoryFull.buyersGuide} className="atlas-article-body" />
          </section>
        )}
        {activeCategoryFull?.categoryFaqs && activeCategoryFull.categoryFaqs.length > 0 && (
          <section style={{ marginTop: 'var(--atlas-spacing-2xl)' }}>
            <h2 className="atlas-pdp-section-title">Frequently Asked Questions</h2>
            <div className="atlas-pdp-faq-list">
              {activeCategoryFull.categoryFaqs.map((faq, i) => (
                <details key={i} className="atlas-pdp-faq-item">
                  <summary className="atlas-pdp-faq-question">{faq.question}</summary>
                  <p className="atlas-pdp-faq-answer">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

//  Render: Lookbook (Asymmetric visual grid) 

function renderLookbook({
  products, categories, activeCategory, activeCategoryObj, activeCategoryFull,
  sort, currency, shopHeadline, shopSubheadline, totalDocs,
  breadcrumbSchema, categoryHubSchemas, shopIndexSchema, breadcrumbItems,
  siteUrl, Pagination, EmptyState,
}: RenderProps) {
  return (
    <div data-variant="lookbook">
      <JsonLd data={breadcrumbSchema} />
      {categoryHubSchemas.map((s, i) => <JsonLd key={i} data={s} />)}
      {shopIndexSchema && <JsonLd data={shopIndexSchema} />}

      {/* Editorial hero header */}
      <div className="atlas-lookbook-hero">
        <div className="atlas-container">
          <Breadcrumbs items={breadcrumbItems} baseUrl={siteUrl} />
          <h1 className="atlas-lookbook-headline">
            {activeCategoryObj ? activeCategoryObj.name : shopHeadline}
          </h1>
          {!activeCategoryObj && shopSubheadline && (
            <p className="atlas-lookbook-subheadline">{shopSubheadline}</p>
          )}
          <p className="atlas-lookbook-count">{totalDocs} piece{totalDocs !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* Horizontal scroll category bar */}
      {categories.length > 0 && (
        <div className="atlas-lookbook-filter-bar">
          <div className="atlas-container">
            <nav className="atlas-lookbook-filter-pills" aria-label="Filter by category">
              <Link href="/shop" className={`atlas-pill${!activeCategory ? " atlas-pill-active" : ""}`}>All</Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  className={`atlas-pill${activeCategory === cat.slug ? " atlas-pill-active" : ""}`}
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Asymmetric product grid */}
      <div className="atlas-container" style={{ paddingBottom: "4rem", paddingTop: "var(--atlas-spacing-xl)" }}>
        {products.length > 0 ? (
          <>
            <div className="atlas-lookbook-grid">
              {products.map((product, index) => {
                const img = product.images?.[0]?.image;
                const hasDiscount = product.compareAtPrice != null && product.compareAtPrice > product.price;
                return (
                  <Link
                    key={product.id}
                    href={`/shop/${product.slug}`}
                    className="atlas-lookbook-card"
                    style={{ textDecoration: "none", color: "inherit", display: "block" }}
                  >
                    <div className="atlas-lookbook-img-wrap">
                      {img ? (
                        <img
                          src={img.url}
                          alt={img.alt ?? product.name}
                          className="atlas-lookbook-img"
                          loading={index < 3 ? "eager" : "lazy"}
                        />
                      ) : (
                        <div className="atlas-lookbook-img-placeholder" aria-label="No product image">
                          <span style={{ fontSize: "3rem", opacity: 0.2 }}></span>
                        </div>
                      )}
                      <div className="atlas-lookbook-overlay" aria-hidden="true">
                        <span className="atlas-lookbook-overlay-label">View &rarr;</span>
                      </div>
                      {hasDiscount && <span className="atlas-lookbook-badge">Sale</span>}
                    </div>
                    <div className="atlas-lookbook-info">
                      <p className="atlas-lookbook-name">{product.name}</p>
                      <p className="atlas-lookbook-price">
                        {new Intl.NumberFormat("en-ZA", {
                          style: "currency",
                          currency: product.currency ?? currency,
                        }).format(product.price)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
            {Pagination}
          </>
        ) : EmptyState}

        {/* Category Hub Content */}
        {activeCategoryFull?.buyersGuide != null && (
          <section className="atlas-buyers-guide" style={{ marginTop: 'var(--atlas-spacing-3xl)' }}>
            <RichTextRenderer content={activeCategoryFull.buyersGuide} className="atlas-article-body" />
          </section>
        )}
        {activeCategoryFull?.categoryFaqs && activeCategoryFull.categoryFaqs.length > 0 && (
          <section style={{ marginTop: 'var(--atlas-spacing-2xl)' }}>
            <h2 className="atlas-pdp-section-title">Frequently Asked Questions</h2>
            <div className="atlas-pdp-faq-list">
              {activeCategoryFull.categoryFaqs.map((faq, i) => (
                <details key={i} className="atlas-pdp-faq-item">
                  <summary className="atlas-pdp-faq-question">{faq.question}</summary>
                  <p className="atlas-pdp-faq-answer">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
