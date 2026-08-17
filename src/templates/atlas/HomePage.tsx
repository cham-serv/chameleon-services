import Link from 'next/link';
import type { PageProps } from '@/lib/types';
import { getProducts, getCategories, getArticles } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';
import { ArticleCard } from '@/components/ArticleCard';
import { JsonLd } from '@/components/JsonLd';

export default async function HomePage({ config, variant, noCache }: PageProps) {
  const tenant = config.tenant.slug;
  const siteName = config.settings?.siteName ?? config.tenant.name;
  const tagline = config.settings?.tagline ?? '';
  const currency = config.settings?.currency ?? 'ZAR';
  const siteUrl = `https://${tenant}.chameleon.services`;
  const pc = config.pageConfig;

  // Hero content — prefer pageConfig, fall back to existing behaviour
  const heroHeadline = pc?.homeHeroHeadline ?? (tagline || `Welcome to ${siteName}`);
  const heroSubheadline = pc?.homeHeroSubheadline ?? 'Discover our curated collection of products — crafted with quality and delivered with care.';
  const cta1Text = pc?.homeCta1Text ?? 'Shop Now';
  const cta1Link = pc?.homeCta1Link ?? '/shop';
  const cta2Text = pc?.homeCta2Text ?? 'Browse Resources';
  const cta2Link = pc?.homeCta2Link ?? '/resources';
  const heroImageUrl = pc?.homeHeroImage?.url ?? null;

  if (variant !== 'hero-static') {
    console.warn(
      `[Atlas HomePage] Variant "${variant}" is not yet implemented. Falling back to hero-static.`,
    );
  }

  // Parallel data fetching — all sections are conditional on data existing
  const [productsRes, categoriesRes, articlesRes] = await Promise.all([
    getProducts({ tenant, featured: true, limit: 8 }, noCache),
    getCategories({ tenant, featured: true }, noCache),
    getArticles({ tenant, featured: true, limit: 3 }, noCache),
  ]);

  const featuredProducts = productsRes?.docs ?? [];
  const featuredCategories = categoriesRes?.docs ?? [];
  const latestArticles = articlesRes?.docs ?? [];

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/shop?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <JsonLd data={websiteSchema} />

      {/* Hero Section */}
      <section
        className="atlas-hero"
        style={heroImageUrl ? {
          backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${heroImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : undefined}
      >
        <div className="atlas-hero-inner atlas-container">
          <p className="atlas-hero-eyebrow">{siteName}</p>
          <h1 className="atlas-hero-headline">
            {heroHeadline}
          </h1>
          <p className="atlas-hero-sub">
            {heroSubheadline}
          </p>
          <div className="atlas-hero-cta-row">
            <Link href={cta1Link} className="atlas-btn atlas-btn-primary atlas-btn-lg">
              {cta1Text}
            </Link>
            <Link href={cta2Link} className="atlas-btn atlas-btn-outline atlas-btn-lg">
              {cta2Text}
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      {featuredCategories.length > 0 && (
        <section className="atlas-section">
          <div className="atlas-container">
            <h2 className="atlas-section-heading">Shop by Category</h2>
            <div className="atlas-category-grid">
              {featuredCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  className="atlas-category-card"
                >
                  {cat.icon && (
                    <span className="atlas-category-icon" aria-hidden="true">
                      {cat.icon}
                    </span>
                  )}
                  <span className="atlas-category-name">{cat.name}</span>
                  {cat.description && (
                    <span className="atlas-category-desc">{cat.description}</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="atlas-section atlas-section-alt">
          <div className="atlas-container">
            <div className="atlas-section-header-row">
              <h2 className="atlas-section-heading">Featured Products</h2>
              <Link href="/shop" className="atlas-link-arrow">
                View All &rarr;
              </Link>
            </div>
            <div className="atlas-product-grid">
              {featuredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  currency={currency}
                  priority={index < 4}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Resources */}
      {latestArticles.length > 0 && (
        <section className="atlas-section">
          <div className="atlas-container">
            <div className="atlas-section-header-row">
              <h2 className="atlas-section-heading">Latest Resources</h2>
              <Link href="/resources" className="atlas-link-arrow">
                All Resources &rarr;
              </Link>
            </div>
            <div className="atlas-article-grid">
              {latestArticles.map((article, index) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  priority={index === 0}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="atlas-cta-banner">
        <div className="atlas-container">
          <h2 className="atlas-cta-heading">Ready to find what you need?</h2>
          <p className="atlas-cta-sub">
            Browse our full collection and find the perfect product for you.
          </p>
          <Link href="/shop" className="atlas-btn atlas-btn-primary atlas-btn-lg">
            Browse Collection
          </Link>
        </div>
      </section>
    </>
  );
}
