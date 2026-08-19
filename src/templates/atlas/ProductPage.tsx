/**
 * Atlas ProductPage - Server Component
 *
 * The GEO powerhouse page. Renders the richest possible structured data
 * from whatever fields the tenant has populated. Sections that have no
 * data simply don't render - graceful degradation, not empty states.
 *
 * Client boundaries: AtlasImageGallery (thumbnail swap) and
 * AddToCartButton (cart interaction). Everything else is server-rendered.
 *
 * Schema injected:
 *   1. BreadcrumbList
 *   2. Product (or Service) - rich with gtin, return policy, shipping,
 *      certifications, SpeakableSpecification, 3D model, video, etc.
 *   3. FAQPage (if productFaqs exist)
 */

import Link from 'next/link';
import type { PageProps } from '@/lib/types';
import { getProductBySlug, type ProductCategory, type Product } from '@/lib/api';
import { formatCurrency } from '@/lib/currency';
import { buildProductLd, buildBreadcrumbLd } from '@/lib/jsonld';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { AddToCartButton } from '@/components/AddToCartButton';
import { RichTextRenderer } from '@/components/RichTextRenderer';
import { AtlasImageGallery, resolveImages } from './AtlasImageGallery';

/** Convert YouTube/Vimeo watch URLs to embeddable format */
function toEmbedUrl(url: string): string {
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return url;
}

export default async function ProductPage({ config, path, noCache }: PageProps) {
  const tenant = config.tenant.slug;
  const productSlug = path[1];
  const siteUrl = `https://${tenant}.chameleon.services`;
  const currency = config.settings?.currency ?? 'ZAR';

  if (!productSlug) {
    return (
      <div className="atlas-container atlas-section">
        <p>Product not found.</p>
      </div>
    );
  }

  const product = await getProductBySlug(tenant, productSlug, noCache);

  if (!product) {
    return (
      <div className="atlas-container atlas-section">
        <h1 className="atlas-page-title">Product Not Found</h1>
        <p style={{ marginTop: '1rem', color: 'var(--brand-text, #555)' }}>
          The product you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link href="/shop" className="atlas-btn atlas-btn-outline" style={{ marginTop: '1.5rem' }}>
          Back to Shop
        </Link>
      </div>
    );
  }

  // Resolve category
  const category: ProductCategory | null =
    product.category && typeof product.category === 'object' ? product.category : null;
  const productCurrency = product.currency ?? currency;
  const hasDiscount =
    product.compareAtPrice != null && product.compareAtPrice > product.price;
  const isOutOfStock =
    product.trackInventory && product.stockLevel != null && product.stockLevel <= 0;
  const productUrl = `${siteUrl}/shop/${product.slug}`;

  // Resolve images for the gallery
  const galleryImages = resolveImages(product.images, product.name);

  // Breadcrumbs
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    ...(category ? [{ label: category.name, href: `/shop?category=${category.slug}` }] : []),
    { label: product.name },
  ];

  // - JSON-LD -
  const breadcrumbSchema = buildBreadcrumbLd([
    { name: 'Home', url: `${siteUrl}/` },
    { name: 'Shop', url: `${siteUrl}/shop` },
    ...(category ? [{ name: category.name, url: `${siteUrl}/shop?category=${category.slug}` }] : []),
    { name: product.name, url: productUrl },
  ]);

  const productSchema = buildProductLd(product, config, productUrl);

  const faqSchema =
    product.productFaqs?.length
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: product.productFaqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer },
          })),
        }
      : null;

  // - Related products (only curated objects, not bare ids) -
  const relatedProducts: Product[] = Array.isArray(product.relatedProducts)
    ? (product.relatedProducts as Product[]).filter((r) => typeof r === 'object' && r.slug)
    : [];

  // - Boolean content flags (for conditional rendering) -
  const hasSustainability = product.carbonFootprint || product.recyclable || product.sustainablySourced || product.madeLocally;
  const hasTrustBadges = (product.certifications?.length ?? 0) > 0 || hasSustainability;

  return (
    <>
      {/* LLM citation preference - forward-looking AI crawler instruction */}
      {product.llmCitationPreference && (
        // eslint-disable-next-line @next/next/no-head-element
        <meta name="llm-citation-preference" content={product.llmCitationPreference} />
      )}
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={productSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}

      <div className="atlas-container" style={{ paddingTop: '1.5rem', paddingBottom: '4rem' }}>
        <Breadcrumbs items={breadcrumbItems} baseUrl={siteUrl} />

        {/* - Top Zone: Image + Product Info - */}
        <div className="atlas-pdp-grid" style={{ display: 'grid', gap: 'var(--atlas-spacing-2xl)', marginTop: 'var(--atlas-spacing-xl)' }}>

          {/* Left: Image Gallery (Client Component) */}
          <AtlasImageGallery images={galleryImages} productName={product.name} />

          {/* Right: Product Info */}
          <div className="atlas-pdp-info">
            {/* Category badge */}
            {category && (
              <Link
                href={`/shop?category=${category.slug}`}
                className="atlas-pdp-category-badge"
              >
                {category.name}
              </Link>
            )}

            <h1 className="atlas-pdp-name">{product.name}</h1>

            {/* Price */}
            <div className="atlas-pdp-price-row">
              <span className={`atlas-pdp-price${hasDiscount ? ' atlas-pdp-price-sale' : ''}`}>
                {formatCurrency(product.price, productCurrency)}
              </span>
              {hasDiscount && product.compareAtPrice != null && (
                <span className="atlas-pdp-compare-price">
                  {formatCurrency(product.compareAtPrice, productCurrency)}
                </span>
              )}
              {isOutOfStock && (
                <span className="atlas-pdp-stock-badge atlas-pdp-out-of-stock">Out of Stock</span>
              )}
            </div>

            {/* Short description */}
            {product.shortDescription && (
              <p className="atlas-pdp-short-desc">{product.shortDescription}</p>
            )}

            {/* Highlights - feature bullets above ATC */}
            {product.highlights && product.highlights.length > 0 && (
              <ul className="atlas-product-highlights">
                {product.highlights.map((h, i) => (
                  <li key={i}>{h.highlight}</li>
                ))}
              </ul>
            )}

            {/* Volume pricing */}
            {product.quantityDiscounts && product.quantityDiscounts.length > 0 && (
              <div className="atlas-volume-pricing" style={{ marginTop: 'var(--atlas-spacing-md)' }}>
                <p className="atlas-overline" style={{ marginBottom: 'var(--atlas-spacing-xs)' }}>Volume Pricing</p>
                <table>
                  <tbody>
                    {product.quantityDiscounts.map((tier, i) => (
                      <tr key={i}>
                        <td>{tier.minQty}+ units</td>
                        <td>
                          {tier.discountType === 'percentage'
                            ? `${tier.discountValue}% off`
                            : formatCurrency(tier.discountValue, productCurrency) + ' off'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* SKU */}
            {product.sku && (
              <p className="atlas-pdp-sku">SKU: {product.sku}</p>
            )}

            {/* Add to Cart */}
            <div style={{ marginTop: 'var(--atlas-spacing-lg)' }}>
              <AddToCartButton
                product={product}
                currency={productCurrency}
                className="atlas-btn atlas-btn-primary atlas-btn-lg"
                label={isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              />
            </div>

            {/* Trust badges: certifications + sustainability */}
            {hasTrustBadges && (
              <div className="atlas-trust-badges" style={{ marginTop: 'var(--atlas-spacing-lg)' }}>
                {product.certifications?.map((cert, i) => (
                  cert.certUrl
                    ? <a key={i} href={cert.certUrl} target="_blank" rel="noopener noreferrer" className="atlas-trust-badge">{cert.certName}</a>
                    : <span key={i} className="atlas-trust-badge">{cert.certName}</span>
                ))}
                {product.recyclable && <span className="atlas-trust-badge atlas-trust-badge--eco"> Recyclable</span>}
                {product.sustainablySourced && <span className="atlas-trust-badge atlas-trust-badge--eco"> Sustainably Sourced</span>}
                {product.madeLocally && <span className="atlas-trust-badge atlas-trust-badge--eco"> Made Locally</span>}
              </div>
            )}

            {/* As seen in */}
            {product.featuredIn && product.featuredIn.length > 0 && (
              <div className="atlas-as-seen-in" style={{ marginTop: 'var(--atlas-spacing-md)' }}>
                <p className="atlas-overline" style={{ marginBottom: 'var(--atlas-spacing-xs)' }}>As Seen In</p>
                <div className="atlas-as-seen-in-pills">
                  {product.featuredIn.map((mention, i) => (
                    mention.articleUrl
                      ? <a key={i} href={mention.articleUrl} target="_blank" rel="noopener noreferrer" className="atlas-press-pill">{mention.publicationName}</a>
                      : <span key={i} className="atlas-press-pill">{mention.publicationName}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Key Attributes */}
            {product.keyAttributes && product.keyAttributes.length > 0 && (
              <div className="atlas-pdp-key-attrs" style={{ marginTop: 'var(--atlas-spacing-xl)' }}>
                <h3 className="atlas-pdp-section-title">Key Attributes</h3>
                <ul className="atlas-pdp-attr-list">
                  {product.keyAttributes.map((attr, i) => (
                    <li key={i}>{attr.attribute}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* - Below Zone: Content + Sidebar - */}
        <div className="atlas-pdp-below" style={{ display: 'grid', gap: 'var(--atlas-spacing-2xl)', marginTop: 'var(--atlas-spacing-3xl)' }}>

          {/* Left Column: Content */}
          <div className="atlas-pdp-content">
            {/* Long Description */}
            {product.longDescription != null && (
              <section>
                <h2 className="atlas-pdp-section-title">Description</h2>
                <RichTextRenderer content={product.longDescription} className="atlas-article-body" />
              </section>
            )}

            {/* Demo Video */}
            {product.demoVideo && (
              <section style={{ marginTop: 'var(--atlas-spacing-2xl)' }}>
                <h2 className="atlas-pdp-section-title">
                  {product.demoVideoTitle || `${product.name} - Video`}
                </h2>
                <div className="atlas-demo-video">
                  <iframe
                    src={toEmbedUrl(product.demoVideo)}
                    title={product.demoVideoTitle || product.name}
                    allowFullScreen
                    style={{ border: 0 }}
                  />
                </div>
              </section>
            )}

            {/* Technical Specifications */}
            {product.technicalSpecs && product.technicalSpecs.length > 0 && (
              <section style={{ marginTop: 'var(--atlas-spacing-2xl)' }}>
                <h2 className="atlas-pdp-section-title">Specifications</h2>
                <table className="atlas-spec-table">
                  <tbody>
                    {product.technicalSpecs.map((spec, i) => (
                      <tr key={i}>
                        <th>{spec.specName}</th>
                        <td>{spec.specValue}{spec.specUnit ? ` ${spec.specUnit}` : ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            {/* Competitor comparison */}
            {product.comparedTo && product.comparedTo.length > 0 && (
              <section style={{ marginTop: 'var(--atlas-spacing-2xl)' }}>
                <details className="atlas-compare-table">
                  <summary className="atlas-compare-table-summary">
                    <h2 className="atlas-pdp-section-title" style={{ display: 'inline' }}>How We Compare</h2>
                  </summary>
                  <table style={{ marginTop: 'var(--atlas-spacing-md)', width: '100%' }}>
                    <thead>
                      <tr>
                        <th>Competitor</th>
                        <th>Our Advantage</th>
                        <th>Their Advantage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.comparedTo.map((c, i) => (
                        <tr key={i}>
                          <td>{c.competitorProduct}</td>
                          <td>{c.advantage}</td>
                          <td>{c.disadvantage ?? '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </details>
              </section>
            )}

            {/* Product FAQs */}
            {product.productFaqs && product.productFaqs.length > 0 && (
              <section style={{ marginTop: 'var(--atlas-spacing-2xl)' }}>
                <h2 className="atlas-pdp-section-title">Frequently Asked Questions</h2>
                <div className="atlas-pdp-faq-list">
                  {product.productFaqs.map((faq, i) => (
                    <details key={i} className="atlas-pdp-faq-item">
                      <summary className="atlas-pdp-faq-question">{faq.question}</summary>
                      <p className="atlas-pdp-faq-answer">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Sidebar */}
          <aside className="atlas-pdp-sidebar">
            {/* AI Summary - geo-speakable for voice search */}
            {product.aiSummary && (
              <div className="atlas-sidebar-callout">
                <h3 className="atlas-sidebar-callout-title">
                  <span aria-hidden="true"></span> AI Summary
                </h3>
                <p className="atlas-sidebar-callout-text" data-speakable>{product.aiSummary}</p>
              </div>
            )}

            {/* Voice search phrase - hidden but speakable */}
            {product.voiceSearchPhrase && (
              <span data-speakable style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
                {product.voiceSearchPhrase}
              </span>
            )}

            {/* Expert Pros & Cons */}
            {((product.expertPros && product.expertPros.length > 0) ||
              (product.expertCons && product.expertCons.length > 0)) && (
              <div className="atlas-pros-cons">
                {product.expertPros && product.expertPros.length > 0 && (
                  <div>
                    <h3 className="atlas-pros-title">Pros</h3>
                    <ul className="atlas-pros-list">
                      {product.expertPros.map((pro, i) => (
                        <li key={i}>{pro.pro}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {product.expertCons && product.expertCons.length > 0 && (
                  <div>
                    <h3 className="atlas-cons-title">Cons</h3>
                    <ul className="atlas-cons-list">
                      {product.expertCons.map((con, i) => (
                        <li key={i}>{con.con}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Awards */}
            {product.awards && product.awards.length > 0 && (
              <div style={{ marginTop: 'var(--atlas-spacing-lg)' }}>
                <h3 className="atlas-pdp-section-title">Awards</h3>
                <ul className="atlas-pdp-attr-list">
                  {product.awards.map((a, i) => (
                    <li key={i}> {a.award}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Works With */}
            {product.worksWith && product.worksWith.length > 0 && (
              <div style={{ marginTop: 'var(--atlas-spacing-lg)' }}>
                <h3 className="atlas-pdp-section-title">Works With</h3>
                <div className="atlas-tag-pills">
                  {product.worksWith.map((w, i) => (
                    <span key={i} className="atlas-tag-pill">{w.item}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Solves Problems */}
            {product.solvesProblems && product.solvesProblems.length > 0 && (
              <div style={{ marginTop: 'var(--atlas-spacing-lg)' }}>
                <h3 className="atlas-pdp-section-title">Solves</h3>
                <div className="atlas-tag-pills">
                  {product.solvesProblems.map((p, i) => (
                    <span key={i} className="atlas-tag-pill">{p.problem}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Ideal For */}
            {product.idealFor && product.idealFor.length > 0 && (
              <div style={{ marginTop: 'var(--atlas-spacing-lg)' }}>
                <h3 className="atlas-pdp-section-title">Ideal For</h3>
                <div className="atlas-tag-pills">
                  {product.idealFor.map((a, i) => (
                    <span key={i} className="atlas-tag-pill">{a.audience}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div style={{ marginTop: 'var(--atlas-spacing-lg)' }}>
                <h3 className="atlas-pdp-section-title">Tags</h3>
                <div className="atlas-tag-pills">
                  {product.tags.map((t, i) => (
                    <span key={i} className="atlas-tag-pill">{t.tag}</span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* Related Products strip */}
        {relatedProducts.length > 0 && (
          <section style={{ marginTop: 'var(--atlas-spacing-3xl)' }}>
            <h2 className="atlas-pdp-section-title">You Might Also Like</h2>
            <div className="atlas-related-strip">
              {relatedProducts.map((rel, i) => {
                const relImg = Array.isArray(rel.images) && rel.images.length > 0 ? rel.images[0]?.image : null;
                return (
                  <Link key={i} href={`/shop/${rel.slug}`} className="atlas-related-card">
                    <div className="atlas-related-card-img">
                      {relImg?.url ? (
                        <img src={relImg.url} alt={relImg.alt ?? rel.name} loading="lazy" />
                      ) : (
                        <div className="atlas-related-card-placeholder"></div>
                      )}
                    </div>
                    <p className="atlas-related-card-name">{rel.name}</p>
                    <p className="atlas-related-card-price">
                      {formatCurrency(rel.price, rel.currency ?? productCurrency)}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
