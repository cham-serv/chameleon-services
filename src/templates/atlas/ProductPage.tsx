/**
 * Atlas ProductPage — Server Component
 *
 * The GEO powerhouse page. Renders the richest possible structured data
 * from whatever fields the tenant has populated. Sections that have no
 * data simply don't render — graceful degradation, not empty states.
 *
 * Client boundaries: AtlasImageGallery (thumbnail swap) and
 * AddToCartButton (cart interaction). Everything else is server-rendered.
 */

import Link from 'next/link';
import type { PageProps } from '@/lib/types';
import { getProductBySlug, type ProductCategory } from '@/lib/api';
import { formatCurrency } from '@/lib/currency';
import { buildProductLd } from '@/lib/jsonld';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { AddToCartButton } from '@/components/AddToCartButton';
import { RichTextRenderer } from '@/components/RichTextRenderer';
import { AtlasImageGallery, resolveImages } from './AtlasImageGallery';

export default async function ProductPage({ config, path }: PageProps) {
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

  const product = await getProductBySlug(tenant, productSlug);

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

  // JSON-LD
  const productSchema = buildProductLd(product, config, productUrl);

  // Enrich with FAQ JSON-LD if product has FAQs
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

  return (
    <>
      <JsonLd data={productSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}

      <div className="atlas-container" style={{ paddingTop: '1.5rem', paddingBottom: '4rem' }}>
        <Breadcrumbs items={breadcrumbItems} baseUrl={siteUrl} />

        {/* ── Top Zone: Image + Product Info ──────────────────────── */}
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

            {/* Key Attributes */}
            {product.keyAttributes && product.keyAttributes.length > 0 && (
              <div className="atlas-pdp-key-attrs" style={{ marginTop: 'var(--atlas-spacing-xl)' }}>
                <h3 className="atlas-pdp-section-title">Key Features</h3>
                <ul className="atlas-pdp-attr-list">
                  {product.keyAttributes.map((attr, i) => (
                    <li key={i}>
                      <strong>{attr.attribute}:</strong> {attr.value}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* ── Below Zone: Content + Sidebar ───────────────────────── */}
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

            {/* Technical Specifications */}
            {product.technicalSpecs && product.technicalSpecs.length > 0 && (
              <section style={{ marginTop: 'var(--atlas-spacing-2xl)' }}>
                <h2 className="atlas-pdp-section-title">Specifications</h2>
                <table className="atlas-spec-table">
                  <tbody>
                    {product.technicalSpecs.map((spec, i) => (
                      <tr key={i}>
                        <th>{spec.label}</th>
                        <td>{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
            {/* AI Summary */}
            {product.aiSummary && (
              <div className="atlas-sidebar-callout">
                <h3 className="atlas-sidebar-callout-title">
                  <span aria-hidden="true">✦</span> AI Summary
                </h3>
                <p className="atlas-sidebar-callout-text geo-speakable">{product.aiSummary}</p>
              </div>
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
                        <li key={i}>{pro.point}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {product.expertCons && product.expertCons.length > 0 && (
                  <div>
                    <h3 className="atlas-cons-title">Cons</h3>
                    <ul className="atlas-cons-list">
                      {product.expertCons.map((con, i) => (
                        <li key={i}>{con.point}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Solves Problems */}
            {product.solvesProblems && product.solvesProblems.length > 0 && (
              <div style={{ marginTop: 'var(--atlas-spacing-lg)' }}>
                <h3 className="atlas-pdp-section-title">Solves</h3>
                <div className="atlas-tag-pills">
                  {product.solvesProblems.map((problem, i) => (
                    <span key={i} className="atlas-tag-pill">{problem}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Ideal For */}
            {product.idealFor && product.idealFor.length > 0 && (
              <div style={{ marginTop: 'var(--atlas-spacing-lg)' }}>
                <h3 className="atlas-pdp-section-title">Ideal For</h3>
                <div className="atlas-tag-pills">
                  {product.idealFor.map((use, i) => (
                    <span key={i} className="atlas-tag-pill">{use}</span>
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
      </div>
    </>
  );
}
