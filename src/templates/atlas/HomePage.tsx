import Link from 'next/link';
import Image from 'next/image';
import type { PageProps, PageConfig } from '@/lib/types';
import { getProducts, getCategories, getArticles } from '@/lib/api';
import type { Product, ProductCategory, Article, MediaItem } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';
import { ArticleCard } from '@/components/ArticleCard';
import { JsonLd } from '@/components/JsonLd';
import { AtlasBadge } from './AtlasBadge';
import { AtlasMarquee } from './AtlasMarquee';
import { AtlasCounter } from './AtlasCounter';

// - Constants -

const TRUST_SIGNALS = [
  { icon: '', text: 'Free Shipping' },
  { icon: '', text: 'Easy Returns' },
  { icon: '', text: 'Secure Payment' },
  { icon: '', text: '24/7 Support' },
];

// - Main Component -

export default async function HomePage({ config, variant, noCache }: PageProps) {
  const tenant = config.tenant.slug;
  const siteName = config.settings?.siteName ?? config.tenant.name;
  const tagline = config.settings?.tagline ?? '';
  const currency = config.settings?.currency ?? 'ZAR';
  const siteUrl = `https://${tenant}.chameleon.services`;
  const pc = config.pageConfig;

  // Shared CTA content
  const cta1Text = pc?.homeCta1Text ?? 'Shop Now';
  const cta1Link = pc?.homeCta1Link ?? '/shop';
  const cta2Text = pc?.homeCta2Text ?? 'Browse Resources';
  const cta2Link = pc?.homeCta2Link ?? '/resources';

  // Variant-specific hero content - each variant reads its own CMS fields
  const defaultHeadline = tagline || `Welcome to ${siteName}`;
  const defaultSubheadline = 'Discover our curated collection of products - crafted with quality and delivered with care.';

  let heroHeadline: string;
  let heroSubheadline: string;
  let heroImageUrl: string | null;

  switch (variant) {
    case 'editorial':
      heroHeadline = pc?.homeEditorialHeadline ?? defaultHeadline;
      heroSubheadline = pc?.homeEditorialSubheadline ?? defaultSubheadline;
      heroImageUrl = pc?.homeEditorialHeroImage?.url ?? null;
      break;
    case 'modern':
      heroHeadline = pc?.homeModernHeadline ?? defaultHeadline;
      heroSubheadline = pc?.homeModernSubheadline ?? defaultSubheadline;
      heroImageUrl = pc?.homeModernHeroImage?.url ?? null;
      break;
    case 'bold':
      heroHeadline = pc?.homeBoldHeadline ?? defaultHeadline;
      heroSubheadline = pc?.homeBoldSubheadline ?? defaultSubheadline;
      heroImageUrl = pc?.homeBoldHeroImage?.url ?? null;
      break;
    case 'minimalist':
      heroHeadline = pc?.homeMinimalistHeadline ?? defaultHeadline;
      heroSubheadline = pc?.homeMinimalistSubheadline ?? defaultSubheadline;
      heroImageUrl = pc?.homeMinimalistHeroImage?.url ?? null;
      break;
    case 'storefront':
    default:
      heroHeadline = pc?.homeStorefrontHeadline ?? defaultHeadline;
      heroSubheadline = pc?.homeStorefrontSubheadline ?? defaultSubheadline;
      heroImageUrl = pc?.homeStorefrontHeroImage?.url ?? null;
      break;
  }

  // JSON-LD - shared by all variants
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

  // - Variant-specific data fetching -

  let featuredProducts: Product[] = [];
  let featuredCategories: ProductCategory[] = [];
  let latestArticles: Article[] = [];

  let secondRowProducts: Product[] = [];

  switch (variant) {
    case 'editorial': {
      const [productsRes, articlesRes] = await Promise.all([
        getProducts({ tenant, featured: true, limit: 3 }, noCache),
        getArticles({ tenant, featured: true, limit: 1 }, noCache),
      ]);
      featuredProducts = productsRes?.docs ?? [];
      latestArticles = articlesRes?.docs ?? [];
      break;
    }
    case 'modern':
    case 'bold':
    case 'minimalist':
    case 'storefront':
    default: {
      const secondRowHeading = pc?.homeSecondRowHeading;
      const fetches: Promise<unknown>[] = [
        getProducts({ tenant, featured: true, limit: variant === 'storefront' ? 8 : 4 }, noCache),
        getCategories({ tenant, featured: true }, noCache),
      ];
      if (secondRowHeading) {
        fetches.push(
          getProducts({
            tenant,
            sort: pc?.homeSecondRowSort ?? 'newest',
            limit: pc?.homeSecondRowLimit ?? 4,
          }, noCache)
        );
      }
      const [productsRes, categoriesRes, secondRowRes] = await Promise.all(fetches) as [
        Awaited<ReturnType<typeof getProducts>>,
        Awaited<ReturnType<typeof getCategories>>,
        Awaited<ReturnType<typeof getProducts>> | undefined,
      ];
      featuredProducts = productsRes?.docs ?? [];
      featuredCategories = categoriesRes?.docs ?? [];
      secondRowProducts = secondRowRes?.docs ?? [];
      break;
    }
  }

  // Shared hero props
  const hero = {
    headline: heroHeadline,
    subheadline: heroSubheadline,
    cta1Text,
    cta1Link,
    cta2Text,
    cta2Link,
    imageUrl: heroImageUrl,
    siteName,
  };

  return (
    <>
      <JsonLd data={websiteSchema} />
      <div data-variant={variant}>
        {variant === 'editorial'
          ? renderEditorial(hero, featuredProducts, latestArticles, currency, pc ?? undefined)
          : variant === 'modern'
          ? renderModern(hero, featuredProducts, featuredCategories, currency, secondRowProducts, pc ?? undefined)
          : variant === 'bold'
          ? renderBold(hero, featuredProducts, featuredCategories, currency, secondRowProducts, pc ?? undefined)
          : variant === 'minimalist'
          ? renderMinimalist(hero, featuredProducts, featuredCategories, currency, secondRowProducts, pc ?? undefined)
          : renderStorefront(hero, featuredProducts, featuredCategories, currency, secondRowProducts, pc ?? undefined)}
      </div>
    </>
  );

}

// - Type Helpers -

type HeroProps = {
  headline: string;
  subheadline: string;
  cta1Text: string;
  cta1Link: string;
  cta2Text: string;
  cta2Link: string;
  imageUrl: string | null;
  siteName: string;
};

function resolveImage(img: MediaItem | number | null | undefined): string | null {
  if (!img || typeof img === 'number') return null;
  return img.url;
}

// -
//  STOREFRONT - Product-forward, conversion-focused
// -

function renderStorefront(
  hero: HeroProps,
  products: Product[],
  categories: ProductCategory[],
  currency: string,
  secondRowProducts: Product[],
  pc?: PageConfig,
) {
  // Resolve trust signals:
  //   • tenant has defined their own list → use it (may be empty, hiding the bar)
  //   • field is absent / null            → fall back to built-in defaults
  const visibleSignals: Array<{ icon?: string | null; text: string }> =
    pc?.homeTrustSignals != null
      ? pc.homeTrustSignals
      : TRUST_SIGNALS;

  const testimonialsSection = renderTestimonialsSection(pc);
  const logosSection = renderLogosSection(pc);
  const swapOrder = pc?.homeLogosBeforeTestimonials === true;

  return (
    <>
      {/* Hero - split layout */}
      <section className="atlas-home-hero">
        <div className="atlas-container">
          <div className="atlas-home-hero-split">
            <div className="atlas-home-hero-content">
              <AtlasBadge variant="accent" icon="" size="sm">
                {hero.siteName}
              </AtlasBadge>
              <h1 className="atlas-hero-headline" style={{ textAlign: 'left', marginTop: '1rem' }}>
                {hero.headline}
              </h1>
              <p className="atlas-hero-sub" style={{ textAlign: 'left' }}>
                {hero.subheadline}
              </p>
              <div className="atlas-hero-cta-row" style={{ justifyContent: 'flex-start' }}>
                <Link href={hero.cta1Link} className="atlas-btn atlas-btn-primary atlas-btn-lg">
                  {hero.cta1Text}
                </Link>
                <Link href={hero.cta2Link} className="atlas-btn atlas-btn-outline atlas-btn-lg">
                  {hero.cta2Text}
                </Link>
              </div>
            </div>
            <div className="atlas-home-hero-media">
              {hero.imageUrl ? (
                <Image
                  src={hero.imageUrl}
                  alt={hero.headline}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                  priority
                />
              ) : (
                <div className="atlas-hero-media-placeholder" aria-hidden="true">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Value Bar - trust signals (hidden when array is empty) */}
      {visibleSignals.length > 0 && (
        <section className="atlas-value-bar">
          <div className="atlas-container">
            <div className="atlas-value-bar-inner">
              {visibleSignals.map((signal) => (
                <div key={signal.text} className="atlas-value-item">
                  {signal.icon && (
                    <span className="atlas-value-icon" aria-hidden="true">{signal.icon}</span>
                  )}
                  <span>{signal.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brand Story Snippet */}
      {renderStorySection(pc)}

      {/* Featured Categories - pill row */}
      {categories.length > 0 && (
        <section className="atlas-section">
          <div className="atlas-container">
            <h2 className="atlas-section-heading">Shop by Category</h2>
            <div className="atlas-category-pill-row">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  className="atlas-category-pill"
                >
                  {cat.icon && <span aria-hidden="true">{cat.icon}</span>}
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="atlas-section atlas-section-alt">
          <div className="atlas-container">
            <div className="atlas-section-header-row">
              <h2 className="atlas-section-heading">Featured Products</h2>
              <Link href="/shop" className="atlas-link-arrow">
                View All &rarr;
              </Link>
            </div>
            <div className="atlas-product-grid">
              {products.map((product, index) => (
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

      {/* Second Product Row */}
      {renderSecondRow(secondRowProducts, currency, pc)}

      {/* Testimonials / Logos — order controlled by swap boolean */}
      {swapOrder ? <>{logosSection}{testimonialsSection}</> : <>{testimonialsSection}{logosSection}</>}

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

// -
//  EDITORIAL - Brand-first, typography-driven
// -

function renderEditorial(
  hero: HeroProps,
  products: Product[],
  articles: Article[],
  currency: string,
  pc: PageConfig | undefined,
) {
  const brandStory = pc?.homeEditorialExcerpt ??
    'We believe in quality craftsmanship and thoughtful design. Every product tells a story - and we\u2019re here to share ours with you.';

  return (
    <>
      {/* Hero - split-screen editorial */}
      <section className="atlas-home-hero">
        <div className="atlas-container">
          <div className="atlas-home-hero-split">
            <div className="atlas-home-hero-content">
              <p className="atlas-overline" style={{ marginBottom: '1rem' }}>
                {hero.siteName}
              </p>
              <h1 className="atlas-home-hero-headline">
                {hero.headline}
              </h1>
              <p className="atlas-hero-sub" style={{ textAlign: 'left', maxWidth: '480px' }}>
                {hero.subheadline}
              </p>
              <Link href={hero.cta1Link} className="atlas-btn atlas-btn-primary atlas-btn-lg">
                {hero.cta1Text}
              </Link>
            </div>
            <div className="atlas-home-hero-media">
              {hero.imageUrl ? (
                <Image
                  src={hero.imageUrl}
                  alt={hero.headline}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                  priority
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, color-mix(in srgb, var(--brand-primary) 15%, transparent), color-mix(in srgb, var(--brand-secondary) 10%, transparent))',
                }} />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story Excerpt */}
      <section className="atlas-section">
        <div className="atlas-container">
          <div className="atlas-story-excerpt">
            <p>{brandStory}</p>
            <Link href="/about" className="atlas-link-arrow">
              Read our story &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {articles.length > 0 && (
        <section className="atlas-section atlas-section-alt">
          <div className="atlas-container">
            <h2 className="atlas-section-heading">Latest</h2>
            {articles.map((article) => {
              const articleImage = resolveImage(article.heroImage);
              return (
                <Link
                  key={article.id}
                  href={`/resources/${article.slug}`}
                  className="atlas-featured-article"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="atlas-featured-article-image">
                    {articleImage && (
                      <Image
                        src={articleImage}
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        style={{ objectFit: 'cover' }}
                      />
                    )}
                  </div>
                  <div className="atlas-featured-article-body">
                    {article.topic && typeof article.topic === 'object' && (
                      <AtlasBadge variant="secondary" size="sm">{article.topic.name}</AtlasBadge>
                    )}
                    <h3 className="atlas-h3" style={{ margin: 0 }}>
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="atlas-body" style={{ margin: 0, opacity: 0.7 }}>
                        {article.excerpt}
                      </p>
                    )}
                    <span className="atlas-link-arrow">
                      Read More &rarr;
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Product Highlight - editorial style (3 items max) */}
      {products.length > 0 && (
        <section className="atlas-section">
          <div className="atlas-container">
            <div className="atlas-section-header-row">
              <h2 className="atlas-section-heading">Selected Products</h2>
              <Link href="/shop" className="atlas-link-arrow">
                View All &rarr;
              </Link>
            </div>
            <div className="atlas-editorial-products">
              {products.slice(0, 3).map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  currency={currency}
                  priority={index === 0}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="atlas-cta-banner">
        <div className="atlas-container">
          <h2 className="atlas-cta-heading">Stay in the loop</h2>
          <p className="atlas-cta-sub">
            New stories, curated products, and brand updates - straight to your inbox.
          </p>
          <Link href="/resources" className="atlas-btn atlas-btn-primary atlas-btn-lg">
            Explore Resources
          </Link>
        </div>
      </section>
    </>
  );
}

// -
//  MODERN - Atmospheric, premium, interactive
// -

function renderModern(
  hero: HeroProps,
  products: Product[],
  categories: ProductCategory[],
  currency: string,
  secondRowProducts: Product[],
  pc?: PageConfig,
) {
  const testimonialsSection = renderTestimonialsSection(pc);
  const logosSection = renderLogosSection(pc);
  const swapOrder = pc?.homeLogosBeforeTestimonials === true;

  return (
    <>
      {/* Hero - deep slate with animated orbs and mesh */}
      <section className="atlas-home-hero">
        {/* Subtle grid mesh overlay */}
        <div className="atlas-home-hero-grid" aria-hidden="true" />
        {/* Geometric corner accent lines */}
        <div className="atlas-home-hero-lines" aria-hidden="true">
          <svg width="100%" height="100%" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Top-left corner bracket */}
            <path d="M 0 120 L 0 0 L 120 0" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            {/* Top-right corner bracket */}
            <path d="M 1320 0 L 1440 0 L 1440 120" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            {/* Bottom-left corner bracket */}
            <path d="M 0 680 L 0 800 L 120 800" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            {/* Bottom-right corner bracket */}
            <path d="M 1320 800 L 1440 800 L 1440 680" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            {/* Faint horizontal rule mid-left */}
            <line x1="0" y1="400" x2="180" y2="400" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            {/* Faint horizontal rule mid-right */}
            <line x1="1260" y1="400" x2="1440" y2="400" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          </svg>
        </div>
        <div className="atlas-container" style={{ padding: '0 var(--atlas-spacing-lg)' }}>
          <div className="atlas-home-hero-content">
            <AtlasBadge variant="accent" size="sm">
              {hero.siteName}
            </AtlasBadge>
            <h1 className="atlas-home-hero-headline" style={{ marginTop: '1.5rem' }}>
              {hero.headline}
            </h1>
            <p className="atlas-home-hero-sub">
              {hero.subheadline}
            </p>
            <Link href={hero.cta1Link} className="atlas-btn atlas-btn-accent atlas-btn-lg">
              {hero.cta1Text}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats / Social Proof Strip */}
      <section className="atlas-section-dark atlas-section">
        <div className="atlas-container">
          <div className="atlas-stats-strip" data-reveal="up">
            <AtlasCounter target={10000} label="Happy Customers" suffix="+" />
            <AtlasCounter target={500} label="Products" suffix="+" />
            <AtlasCounter target={98} label="Satisfaction" suffix="%" />
            <AtlasCounter target={4.9} label="Average Rating" prefix="" duration={1200} />
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="atlas-section-dark atlas-section">
          <div className="atlas-container">
            <h2 className="atlas-section-heading">Explore</h2>
            <div className="atlas-category-grid">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  className="atlas-category-card"
                  data-reveal="up"
                >
                  {cat.icon && (
                    <span className="atlas-category-icon" aria-hidden="true">{cat.icon}</span>
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
      {products.length > 0 && (
        <section className="atlas-section-dark atlas-section">
          <div className="atlas-container">
            <div className="atlas-section-header-row">
              <h2 className="atlas-section-heading">Featured</h2>
              <Link href="/shop" className="atlas-link-arrow">
                View All &rarr;
              </Link>
            </div>
            <div className="atlas-product-grid">
              {products.map((product, index) => (
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

      {/* Brand Story Snippet */}
      {renderStorySection(pc)}

      {/* Second Product Row */}
      {renderSecondRow(secondRowProducts, currency, pc)}

      {/* Testimonials / Logos — order controlled by swap boolean */}
      {swapOrder ? <>{logosSection}{testimonialsSection}</> : <>{testimonialsSection}{logosSection}</>}

      {/* CTA - gradient atmospheric */}
      <section className="atlas-cta-banner atlas-atmo-bg" style={{ overflow: 'hidden' }}>
        <div className="atlas-container" style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="atlas-cta-heading" data-reveal="up">Experience the difference</h2>
          <p className="atlas-cta-sub" data-reveal="up" data-reveal-delay="100">
            Premium products designed for those who demand the best.
          </p>
          <Link
            href="/shop"
            className="atlas-btn atlas-btn-accent atlas-btn-lg"
            data-reveal="up"
            data-reveal-delay="200"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </>
  );
}

// -
//  BOLD - Dark, dramatic, high-contrast
// -

function renderBold(
  hero: HeroProps,
  products: Product[],
  categories: ProductCategory[],
  currency: string,
  secondRowProducts: Product[],
  pc?: PageConfig,
) {
  const testimonialsSection = renderTestimonialsSection(pc);
  const logosSection = renderLogosSection(pc);
  const swapOrder = pc?.homeLogosBeforeTestimonials === true;

  return (
    <>
      {/* Hero - full-viewport dark */}
      <section
        className="atlas-home-hero"
        style={hero.imageUrl ? {
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${hero.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : undefined}
      >
        <div className="atlas-container">
          <div className="atlas-home-hero-content">
            <h1 className="atlas-home-hero-headline">
              {hero.headline}
            </h1>
            <p className="atlas-home-hero-sub">
              {hero.subheadline}
            </p>
            <Link href={hero.cta1Link} className="atlas-btn atlas-btn-primary atlas-btn-lg">
              {hero.cta1Text}
            </Link>
          </div>
        </div>
      </section>

      {/* Category Showcase - sharp cards */}
      {categories.length > 0 && (
        <section className="atlas-section-dark atlas-section">
          <div className="atlas-container">
            <h2 className="atlas-section-heading">Categories</h2>
            <div className="atlas-category-grid">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  className="atlas-category-card"
                >
                  {cat.icon && (
                    <span className="atlas-category-icon" aria-hidden="true">{cat.icon}</span>
                  )}
                  <span className="atlas-category-name">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products - dark grid */}
      {products.length > 0 && (
        <section className="atlas-section-dark atlas-section">
          <div className="atlas-container">
            <div className="atlas-section-header-row">
              <h2 className="atlas-section-heading">Featured</h2>
              <Link href="/shop" className="atlas-link-arrow" style={{ color: 'rgba(255,255,255,0.5)' }}>
                View All &rarr;
              </Link>
            </div>
            <div className="atlas-product-grid">
              {products.map((product, index) => (
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

      {/* Second Product Row */}
      {renderSecondRow(secondRowProducts, currency, pc)}

      {/* Brand Story Snippet (replaces hardcoded quote) */}
      {renderStorySection(pc)}

      {/* Testimonials / Logos — order controlled by swap boolean */}
      {swapOrder ? <>{logosSection}{testimonialsSection}</> : <>{testimonialsSection}{logosSection}</>}

      {/* CTA - inverted (light on dark) */}
      <section className="atlas-cta-banner" style={{ background: 'var(--brand-background, #ffffff)' }}>
        <div className="atlas-container">
          <h2 className="atlas-cta-heading" style={{ color: 'var(--brand-text, #1b1b1b)' }}>
            Make a statement
          </h2>
          <p className="atlas-cta-sub" style={{ color: 'var(--brand-text, #1b1b1b)', opacity: 0.6 }}>
            Explore products designed to stand out.
          </p>
          <Link
            href="/shop"
            className="atlas-btn atlas-btn-primary atlas-btn-lg"
            style={{
              background: 'var(--brand-primary, #1a1a2e)',
              color: '#ffffff',
              borderColor: 'var(--brand-primary, #1a1a2e)',
            }}
          >
            Shop Collection
          </Link>
        </div>
      </section>
    </>
  );
}

// -
//  MINIMALIST - Experiential, immersive, ultra-minimal
// -

function renderMinimalist(
  hero: HeroProps,
  products: Product[],
  categories: ProductCategory[],
  currency: string,
  secondRowProducts: Product[],
  pc?: PageConfig,
) {
  const testimonialsSection = renderTestimonialsSection(pc);
  const logosSection = renderLogosSection(pc);
  const swapOrder = pc?.homeLogosBeforeTestimonials === true;

  return (
    <>
      {/* Hero - full-viewport, centred, gentle */}
      <section className="atlas-home-hero">
        {hero.imageUrl && (
          <div className="atlas-home-hero-bg">
            <Image
              src={hero.imageUrl}
              alt=""
              fill
              sizes="100vw"
              style={{ objectFit: 'cover', opacity: 0.15 }}
              priority
            />
          </div>
        )}
        <div className="atlas-container">
          <div className="atlas-home-hero-content">
            <h1 className="atlas-home-hero-headline">
              {hero.headline}
            </h1>
            <p className="atlas-home-hero-sub">
              {hero.subheadline}
            </p>
            <Link href={hero.cta1Link} className="atlas-btn atlas-btn-primary atlas-btn-lg">
              {hero.cta1Text}
            </Link>
          </div>
        </div>
      </section>

      {/* Breathing space + feature highlights */}
      {categories.length > 0 && (
        <section className="atlas-section">
          <div className="atlas-container" style={{ maxWidth: '800px' }}>
            <div style={{
              display: 'grid',
              gap: 'var(--atlas-spacing-2xl)',
              textAlign: 'center',
            }}>
              {categories.slice(0, 3).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  data-reveal="up"
                >
                  <h3 className="atlas-h4" style={{ margin: '0 0 0.5rem' }}>
                    {cat.icon && <span aria-hidden="true">{cat.icon} </span>}
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="atlas-body" style={{ margin: 0, opacity: 0.6 }}>
                      {cat.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products - clean, widely spaced rows */}
      {products.length > 0 && (
        <section className="atlas-section atlas-section-alt">
          <div className="atlas-container">
            <h2 className="atlas-section-heading" style={{ textAlign: 'center' }}>
              Curated for you
            </h2>
            <div className="atlas-product-row-wide">
              {products.map((product, index) => (
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

      {/* Brand Story Snippet */}
      {renderStorySection(pc)}

      {/* Second Product Row */}
      {renderSecondRow(secondRowProducts, currency, pc)}

      {/* Testimonials / Logos — order controlled by swap boolean */}
      {swapOrder ? <>{logosSection}{testimonialsSection}</> : <>{testimonialsSection}{logosSection}</>}

      {/* Minimal CTA */}
      <section className="atlas-section">
        <div className="atlas-container">
          <div className="atlas-cta-minimal">
            <h2 className="atlas-cta-minimal-heading">
              Find your calm
            </h2>
            <Link href="/shop" className="atlas-btn atlas-btn-outline atlas-btn-lg">
              Browse Collection
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

// -
//  SHARED SECTION HELPERS
//  Used by all (or most) variants to render optional CMS-driven sections.
// -

function renderStorySection(pc?: PageConfig) {
  if (!pc?.homeStoryHeadline && !pc?.homeStoryBlurb) return null;
  const ctaLink = pc?.homeStoryCtaLink ?? '/about';
  const ctaText = pc?.homeStoryCtaText ?? 'Our Story';
  return (
    <section className="atlas-section">
      <div className="atlas-container">
        <div className="atlas-story-snippet" data-reveal="up">
          {pc?.homeStoryImage?.url && (
            <div className="atlas-story-snippet-media">
              <Image
                src={pc.homeStoryImage.url}
                alt={pc.homeStoryImage.alt ?? pc.homeStoryHeadline ?? ''}
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
          )}
          <div className="atlas-story-snippet-body">
            {pc?.homeStoryHeadline && (
              <h2 className="atlas-section-heading">{pc.homeStoryHeadline}</h2>
            )}
            {pc?.homeStoryBlurb && (
              <p className="atlas-body">{pc.homeStoryBlurb}</p>
            )}
            <Link href={ctaLink} className="atlas-link-arrow">
              {ctaText} &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function renderTestimonialsSection(pc?: PageConfig) {
  if (!pc?.homeTestimonials?.length) return null;
  return (
    <section className="atlas-section atlas-section-alt">
      <div className="atlas-container">
        {pc?.homeTestimonialsHeading && (
          <h2 className="atlas-section-heading" style={{ textAlign: 'center' }}>
            {pc.homeTestimonialsHeading}
          </h2>
        )}
        <div className="atlas-testimonials-grid" data-reveal="up">
          {pc.homeTestimonials.map((t, i) => (
            <div key={i} className="atlas-testimonial-card">
              {t.rating != null && (
                <div className="atlas-testimonial-stars" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, s) => (
                    <span key={s} className={s < t.rating! ? 'atlas-star atlas-star--filled' : 'atlas-star'} aria-hidden="true">&#9733;</span>
                  ))}
                </div>
              )}
              <blockquote className="atlas-testimonial-quote">&ldquo;{t.quote}&rdquo;</blockquote>
              <cite className="atlas-testimonial-author">
                <strong>{t.author}</strong>
                {t.role && <span className="atlas-testimonial-role">{t.role}</span>}
              </cite>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function renderLogosSection(pc?: PageConfig) {
  const logos = pc?.homeLogos?.filter((l) => l.logo?.url);
  if (!logos?.length) return null;
  return (
    <section className="atlas-section">
      <div className="atlas-container">
        {pc?.homeLogosHeading && (
          <h2 className="atlas-logos-heading">{pc.homeLogosHeading}</h2>
        )}
        <div className="atlas-logos-strip">
          {logos.map((item) => (
            item.url ? (
              <Link key={item.name} href={item.url} className="atlas-logo-item" target="_blank" rel="noopener noreferrer">
                <Image
                  src={item.logo!.url!}
                  alt={item.name}
                  width={item.logo!.width ?? 120}
                  height={item.logo!.height ?? 40}
                  style={{ objectFit: 'contain' }}
                />
              </Link>
            ) : (
              <div key={item.name} className="atlas-logo-item">
                <Image
                  src={item.logo!.url!}
                  alt={item.name}
                  width={item.logo!.width ?? 120}
                  height={item.logo!.height ?? 40}
                  style={{ objectFit: 'contain' }}
                />
              </div>
            )
          ))}
        </div>
      </div>
    </section>
  );
}

function renderSecondRow(products: Product[], currency: string, pc?: PageConfig) {
  if (!pc?.homeSecondRowHeading || !products.length) return null;
  return (
    <section className="atlas-section">
      <div className="atlas-container">
        <div className="atlas-section-header-row">
          <h2 className="atlas-section-heading">{pc.homeSecondRowHeading}</h2>
          <Link href="/shop" className="atlas-link-arrow">View All &rarr;</Link>
        </div>
        <div className="atlas-product-grid">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              currency={currency}
              priority={index < 2}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
