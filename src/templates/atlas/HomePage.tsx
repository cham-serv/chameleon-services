/**
 * Atlas HomePage — Server Component
 *
 * Fetches featured products, categories, and latest resources from
 * the engine API and renders them in a premium, brand-adaptive layout.
 *
 * Variant support:
 *   - hero-static: Image + headline + CTA (default)
 *   - hero-video: Background video (future)
 *   - hero-carousel: Rotating images (future)
 *
 * All variants render the same below-the-fold content sections.
 */

import Link from 'next/link';
import Image from 'next/image';
import type { PageProps } from '@/lib/types';
import type { MediaItem } from '@/lib/api';
import { getProducts, getCategories, getArticles } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';
import { ArticleCard } from '@/components/ArticleCard';
import { JsonLd } from '@/components/JsonLd';

export default async function HomePage({ config, variant }: PageProps) {
  const tenant = config.tenant.slug;
  const siteName = config.settings?.siteName ?? config.tenant.name;
  const tagline = config.settings?.tagline ?? `Welcome to ${siteName}`;
  const currency = config.settings?.currency ?? 'ZAR';
  const fc = config.tenant.featureConfig;

  // Parallel data fetches
  const [productsRes, categoriesRes, articlesRes] = await Promise.all([
    fc.shop?.enabled ? getProducts({ tenant, featured: true, limit: 8 }) : null,
    fc.shop?.enabled ? getCategories({ tenant, featured: true }) : null,
    fc.resources?.enabled ? getArticles({ tenant, section: 'resources', featured: true, limit: 3 }) : null,
  ]);

  const products = productsRes?.docs ?? [];
  const categories = categoriesRes?.docs ?? [];
  const articles = articlesRes?.docs ?? [];

  // JSON-LD: WebSite with SearchAction
  const siteUrl = `https://${config.tenant.slug}.chameleon.services`;
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    ...(fc.shop?.enabled && {
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/shop?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    }),
  };

  return (
    <>
      <JsonLd data={websiteSchema} />

      {/* ── Hero Section ───────────────────────────────────────── */}
      <section
        className="atlas-section"
        style={{
          background: 'var(--brand-primary, #2d6a4f)',
          color: '#ffffff',
          paddingTop: 'var(--atlas-spacing-4xl)',
          paddingBottom: 'var(--atlas-spacing-4xl)',
        }}
      >
        <div className="atlas-container" style={{ textAlign: 'center', maxWidth: 720 }}>
          <span className="atlas-overline" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {siteName}
          </span>
          <h1
            className="atlas-h1"
            style={{
              color: '#ffffff',
              marginTop: 'var(--atlas-spacing-sm)',
              marginBottom: 'var(--atlas-spacing-lg)',
            }}
          >
            {tagline}
          </h1>
          {fc.shop?.enabled && (
            <div style={{ display: 'flex', gap: 'var(--atlas-spacing-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/shop" className="atlas-btn atlas-btn-lg" style={{ background: '#fff', color: 'var(--brand-primary, #2d6a4f)', borderColor: '#fff' }}>
                Shop Now
              </Link>
              {fc.resources?.enabled && (
                <Link href="/resources" className="atlas-btn atlas-btn-lg atlas-btn-outline" style={{ borderColor: 'rgba(255,255,255,0.5)', color: '#fff' }}>
                  Explore Resources
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Featured Categories ─────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="atlas-section">
          <div className="atlas-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--atlas-spacing-xl)' }}>
              <h2 className="atlas-h2">Shop by Category</h2>
              <Link href="/shop" className="atlas-btn atlas-btn-ghost atlas-btn-sm">
                View All →
              </Link>
            </div>
            <div className="atlas-category-grid">
              {categories.map((cat) => {
                const img = resolveMedia(cat.image);
                return (
                  <Link
                    key={cat.id}
                    href={`/shop?category=${cat.slug}`}
                    className="atlas-card"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden' }}>
                      {img ? (
                        <Image
                          src={img.url}
                          alt={img.alt ?? cat.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{
                          width: '100%', height: '100%',
                          background: 'linear-gradient(135deg, color-mix(in srgb, var(--brand-primary) 80%, #000), var(--brand-primary, #2d6a4f))',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {cat.icon && <span style={{ fontSize: '2rem' }}>{cat.icon}</span>}
                        </div>
                      )}
                    </div>
                    <div style={{ padding: 'var(--atlas-spacing-md)' }}>
                      <h3 className="atlas-h5" style={{ margin: 0 }}>{cat.name}</h3>
                      {cat.description && (
                        <p className="atlas-caption" style={{ marginTop: '0.25rem', marginBottom: 0 }}>
                          {cat.description}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Products ──────────────────────────────────── */}
      {products.length > 0 && (
        <section className="atlas-section" style={{ background: 'color-mix(in srgb, var(--brand-text, #1b1b1b) 3%, transparent)' }}>
          <div className="atlas-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--atlas-spacing-xl)' }}>
              <h2 className="atlas-h2">Featured Products</h2>
              <Link href="/shop" className="atlas-btn atlas-btn-ghost atlas-btn-sm">
                View All →
              </Link>
            </div>
            <div className="atlas-product-grid">
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
          </div>
        </section>
      )}

      {/* ── Latest Resources ───────────────────────────────────── */}
      {articles.length > 0 && (
        <section className="atlas-section">
          <div className="atlas-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--atlas-spacing-xl)' }}>
              <h2 className="atlas-h2">Latest Resources</h2>
              <Link href="/resources" className="atlas-btn atlas-btn-ghost atlas-btn-sm">
                View All →
              </Link>
            </div>
            <div className="atlas-article-grid">
              {articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  basePath="/resources"
                  className="atlas-card atlas-fade-in"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA Banner ─────────────────────────────────────────── */}
      {fc.shop?.enabled && (
        <section
          className="atlas-section"
          style={{
            background: 'var(--brand-secondary, #52b788)',
            color: '#ffffff',
            textAlign: 'center',
          }}
        >
          <div className="atlas-container" style={{ maxWidth: 600 }}>
            <h2 className="atlas-h2" style={{ color: '#ffffff' }}>
              Ready to get started?
            </h2>
            <p className="atlas-body-lg" style={{ color: 'rgba(255,255,255,0.85)', marginTop: 'var(--atlas-spacing-sm)' }}>
              Browse our full collection and find exactly what you need.
            </p>
            <Link
              href="/shop"
              className="atlas-btn atlas-btn-lg"
              style={{
                marginTop: 'var(--atlas-spacing-xl)',
                background: '#ffffff',
                color: 'var(--brand-secondary, #52b788)',
                borderColor: '#ffffff',
              }}
            >
              Browse Collection
            </Link>
          </div>
        </section>
      )}
    </>
  );
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function resolveMedia(
  media: MediaItem | number | null | undefined,
): MediaItem | null {
  if (!media || typeof media === 'number') return null;
  return media;
}
