/**
 * Atlas ProductPage — Server Component
 *
 * Full product detail page — the GEO powerhouse. Renders the richest
 * possible structured data from whatever fields the tenant has populated.
 * Only renders sections for fields that exist (graceful degradation).
 *
 * Layout: Hero images → 2-column (8/4) content + sidebar
 */

import Link from 'next/link';
import Image from 'next/image';
import type { PageProps } from '@/lib/types';
import type { Product, MediaItem } from '@/lib/api';
import { getProductBySlug, getProducts } from '@/lib/api';
import { formatCurrency } from '@/lib/currency';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AddToCartButton } from '@/components/AddToCartButton';
import { RichTextRenderer } from '@/components/RichTextRenderer';
import { JsonLd } from '@/components/JsonLd';
import { ProductCard } from '@/components/ProductCard';
import { notFound } from 'next/navigation';

// ── Availability / Condition Maps ───────────────────────────────────────────

const availabilityMap: Record<string, string> = {
  inStock: 'InStock',
  outOfStock: 'OutOfStock',
  preOrder: 'PreOrder',
  backOrder: 'BackOrder',
  discontinued: 'Discontinued',
};

const conditionMap: Record<string, string> = {
  new: 'NewCondition',
  refurbished: 'RefurbishedCondition',
  used: 'UsedCondition',
  damaged: 'DamagedCondition',
};

const statusLabel: Record<string, string> = {
  inStock: 'In Stock',
  outOfStock: 'Out of Stock',
  preOrder: 'Pre-Order',
  backOrder: 'Back Order',
  discontinued: 'Discontinued',
};

export default async function ProductPage({ config, path }: PageProps) {
  const tenant = config.tenant.slug;
  const productSlug = path[1];
  if (!productSlug) notFound();

  const product = await getProductBySlug(tenant, productSlug);
  if (!product) notFound();

  const siteName = config.settings?.siteName ?? config.tenant.name;
  const currency = product.currency ?? config.settings?.currency ?? 'ZAR';
  const siteUrl = `https://${tenant}.chameleon.services`;
  const productUrl = `${siteUrl}/shop/${product.slug}`;

  // Category info
  const category = product.category && typeof product.category === 'object' ? product.category : null;

  // Images
  const images = product.images?.map((i) => i.image).filter(Boolean) ?? [];
  const mainImage = images[0] ?? null;

  // Breadcrumbs
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    ...(category ? [{ label: category.name, href: `/shop?category=${category.slug}` }] : []),
    { label: product.name },
  ];

  // Pricing
  const hasDiscount = product.compareAtPrice != null && product.compareAtPrice > product.price;
  const availability = product.availabilityStatus ?? 'inStock';
  const isAvailable = availability === 'inStock' || availability === 'preOrder' || availability === 'backOrder';

  // Related products — fetch by same category or fallback
  let relatedProducts: Product[] = [];
  if (category) {
    const res = await getProducts({ tenant, category: category.slug, limit: 4 });
    relatedProducts = (res?.docs ?? []).filter((p) => p.id !== product.id).slice(0, 4);
  }

  // JSON-LD: Full Product schema
  const productSchema = buildProductSchema(product, config, productUrl, currency);

  return (
    <>
      <JsonLd data={productSchema} />

      <div className="atlas-container atlas-section-sm">
        <Breadcrumbs items={breadcrumbs} baseUrl={siteUrl} />

        {/* ── Product Hero: Images + Info ─────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 'var(--atlas-spacing-2xl)',
            marginTop: 'var(--atlas-spacing-lg)',
          }}
          className="atlas-pdp-grid"
        >
          {/* Left: Image gallery */}
          <div>
            {/* Main image */}
            <div
              style={{
                position: 'relative',
                aspectRatio: '1/1',
                borderRadius: 'var(--atlas-radius-lg)',
                overflow: 'hidden',
                background: 'color-mix(in srgb, var(--brand-text, #1b1b1b) 4%, transparent)',
              }}
            >
              {mainImage ? (
                <Image
                  src={mainImage.url}
                  alt={mainImage.alt ?? product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                  priority
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', color: '#ccc' }}>
                  📦
                </div>
              )}

              {/* Badges */}
              {hasDiscount && (
                <span className="atlas-badge atlas-badge-solid" style={{ position: 'absolute', top: 12, right: 12, background: '#e53e3e' }}>
                  Sale
                </span>
              )}
              {!isAvailable && (
                <span className="atlas-badge atlas-badge-solid" style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.7)' }}>
                  {statusLabel[availability] ?? 'Unavailable'}
                </span>
              )}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 'var(--atlas-spacing-sm)', marginTop: 'var(--atlas-spacing-sm)', overflowX: 'auto' }}>
                {images.map((img, i) => (
                  <div
                    key={i}
                    style={{
                      width: 72, height: 72, flexShrink: 0,
                      borderRadius: 'var(--atlas-radius-sm)',
                      overflow: 'hidden',
                      border: i === 0 ? '2px solid var(--brand-primary, #2d6a4f)' : '2px solid transparent',
                    }}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt ?? `${product.name} image ${i + 1}`}
                      width={72}
                      height={72}
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div>
            {/* Category badge */}
            {category && (
              <Link href={`/shop?category=${category.slug}`} className="atlas-badge" style={{ textDecoration: 'none', marginBottom: 'var(--atlas-spacing-sm)', display: 'inline-block' }}>
                {category.name}
              </Link>
            )}

            <h1 className="atlas-h1" style={{ marginTop: category ? 'var(--atlas-spacing-sm)' : 0 }}>
              {product.name}
            </h1>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--atlas-spacing-md)', marginTop: 'var(--atlas-spacing-md)' }}>
              <span className="atlas-h2" style={{ color: hasDiscount ? '#e53e3e' : 'var(--brand-primary, #2d6a4f)' }}>
                {formatCurrency(product.price, currency)}
              </span>
              {hasDiscount && product.compareAtPrice != null && (
                <span className="atlas-body" style={{ textDecoration: 'line-through', opacity: 0.5 }}>
                  {formatCurrency(product.compareAtPrice, currency)}
                </span>
              )}
            </div>

            {/* Short description */}
            {product.shortDescription && (
              <p className="atlas-body-lg" style={{ marginTop: 'var(--atlas-spacing-md)', lineHeight: 1.7 }}>
                {product.shortDescription}
              </p>
            )}

            {/* Availability status */}
            <div style={{ marginTop: 'var(--atlas-spacing-md)', display: 'flex', alignItems: 'center', gap: 'var(--atlas-spacing-sm)' }}>
              <span
                style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: isAvailable ? '#38a169' : '#e53e3e',
                  display: 'inline-block',
                }}
              />
              <span className="atlas-caption" style={{ fontWeight: 600 }}>
                {statusLabel[availability] ?? 'Available'}
              </span>
              {product.sku && (
                <span className="atlas-caption" style={{ marginLeft: 'auto' }}>
                  SKU: {product.sku}
                </span>
              )}
            </div>

            {/* Add to Cart */}
            <div style={{ marginTop: 'var(--atlas-spacing-xl)' }}>
              <AddToCartButton
                product={product}
                currency={currency}
                className="atlas-btn atlas-btn-primary atlas-btn-lg"
                label={
                  availability === 'preOrder' ? 'Pre-Order'
                    : availability === 'backOrder' ? 'Back Order'
                      : 'Add to Cart'
                }
              />
            </div>

            {/* Highlights */}
            {product.highlights && product.highlights.length > 0 && (
              <ul style={{ marginTop: 'var(--atlas-spacing-xl)', paddingLeft: '1.25rem', lineHeight: 1.8 }}>
                {product.highlights.map((h, i) => (
                  <li key={i} className="atlas-body">{h.highlight}</li>
                ))}
              </ul>
            )}

            {/* Brand & Identity */}
            {(product.brand || product.manufacturer || product.countryOfOrigin) && (
              <div className="atlas-card-flat" style={{ padding: 'var(--atlas-spacing-md)', marginTop: 'var(--atlas-spacing-xl)' }}>
                <h3 className="atlas-h6" style={{ marginBottom: 'var(--atlas-spacing-sm)' }}>Brand & Identity</h3>
                <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.25rem 1rem', fontSize: '0.875rem', margin: 0 }}>
                  {product.brand && (
                    <>
                      <dt className="atlas-caption" style={{ fontWeight: 600 }}>Brand</dt>
                      <dd style={{ margin: 0 }}>
                        {product.brandUrl ? (
                          <a href={product.brandUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand-primary)' }}>
                            {product.brand}
                          </a>
                        ) : product.brand}
                      </dd>
                    </>
                  )}
                  {product.manufacturer && (
                    <>
                      <dt className="atlas-caption" style={{ fontWeight: 600 }}>Manufacturer</dt>
                      <dd style={{ margin: 0 }}>{product.manufacturer}</dd>
                    </>
                  )}
                  {product.countryOfOrigin && (
                    <>
                      <dt className="atlas-caption" style={{ fontWeight: 600 }}>Origin</dt>
                      <dd style={{ margin: 0 }}>{product.countryOfOrigin}</dd>
                    </>
                  )}
                  {product.material && (
                    <>
                      <dt className="atlas-caption" style={{ fontWeight: 600 }}>Material</dt>
                      <dd style={{ margin: 0 }}>{product.material}</dd>
                    </>
                  )}
                </dl>
              </div>
            )}
          </div>
        </div>

        {/* ── Below Hero: 2-column layout ─────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 'var(--atlas-spacing-2xl)',
            marginTop: 'var(--atlas-spacing-3xl)',
          }}
          className="atlas-pdp-below"
        >
          {/* Left column (content) */}
          <div>
            {/* Long description */}
            {product.longDescription != null && (
              <section>
                <h2 className="atlas-h3" style={{ marginBottom: 'var(--atlas-spacing-lg)' }}>Description</h2>
                <div className="atlas-body">
                  <RichTextRenderer content={product.longDescription as Record<string, unknown>} />
                </div>
              </section>
            )}

            {/* Technical Specifications */}
            {product.technicalSpecs && product.technicalSpecs.length > 0 && (
              <section style={{ marginTop: 'var(--atlas-spacing-2xl)' }}>
                <h2 className="atlas-h3" style={{ marginBottom: 'var(--atlas-spacing-lg)' }}>Technical Specifications</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    {product.technicalSpecs.map((spec, i) => (
                      <tr
                        key={i}
                        style={{
                          borderBottom: '1px solid color-mix(in srgb, var(--brand-text, #1b1b1b) 6%, transparent)',
                          background: i % 2 === 0 ? 'color-mix(in srgb, var(--brand-text, #1b1b1b) 2%, transparent)' : 'transparent',
                        }}
                      >
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 600, fontSize: '0.875rem', width: '40%' }}>{spec.label}</td>
                        <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem' }}>{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            {/* Product FAQs */}
            {product.productFaqs && product.productFaqs.length > 0 && (
              <section style={{ marginTop: 'var(--atlas-spacing-2xl)' }}>
                <h2 className="atlas-h3" style={{ marginBottom: 'var(--atlas-spacing-lg)' }}>Frequently Asked Questions</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--atlas-spacing-md)' }}>
                  {product.productFaqs.map((faq, i) => (
                    <details key={i} className="atlas-card-flat" style={{ padding: 'var(--atlas-spacing-md)' }}>
                      <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9375rem' }}>{faq.question}</summary>
                      <p className="atlas-body" style={{ marginTop: 'var(--atlas-spacing-sm)' }}>{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* Demo Video */}
            {product.demoVideo && (
              <section style={{ marginTop: 'var(--atlas-spacing-2xl)' }}>
                <h2 className="atlas-h3" style={{ marginBottom: 'var(--atlas-spacing-lg)' }}>
                  {product.demoVideoTitle ?? `${product.name} Demo`}
                </h2>
                <div style={{ position: 'relative', paddingBottom: '56.25%', borderRadius: 'var(--atlas-radius-lg)', overflow: 'hidden' }}>
                  <iframe
                    src={toEmbedUrl(product.demoVideo)}
                    title={product.demoVideoTitle ?? `${product.name} Demo`}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </section>
            )}
          </div>

          {/* Right column (sidebar) */}
          <div>
            {/* AI Summary */}
            {product.aiSummary && (
              <div
                className="atlas-card-flat"
                style={{
                  padding: 'var(--atlas-spacing-lg)',
                  background: 'color-mix(in srgb, var(--brand-primary, #2d6a4f) 5%, transparent)',
                  borderLeft: '4px solid var(--brand-primary, #2d6a4f)',
                }}
              >
                <h3 className="atlas-h6" style={{ marginBottom: 'var(--atlas-spacing-sm)' }}>AI Summary</h3>
                <p className="atlas-body" style={{ margin: 0 }}>{product.aiSummary}</p>
              </div>
            )}

            {/* Expert Pros/Cons */}
            {((product.expertPros && product.expertPros.length > 0) || (product.expertCons && product.expertCons.length > 0)) && (
              <div style={{ marginTop: 'var(--atlas-spacing-xl)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--atlas-spacing-md)' }}>
                {product.expertPros && product.expertPros.length > 0 && (
                  <div>
                    <h4 className="atlas-h6" style={{ color: '#38a169', marginBottom: 'var(--atlas-spacing-sm)' }}>✓ Pros</h4>
                    <ul style={{ paddingLeft: '1rem', margin: 0, lineHeight: 1.8, fontSize: '0.875rem' }}>
                      {product.expertPros.map((p, i) => <li key={i}>{p.point}</li>)}
                    </ul>
                  </div>
                )}
                {product.expertCons && product.expertCons.length > 0 && (
                  <div>
                    <h4 className="atlas-h6" style={{ color: '#d69e2e', marginBottom: 'var(--atlas-spacing-sm)' }}>⚠ Cons</h4>
                    <ul style={{ paddingLeft: '1rem', margin: 0, lineHeight: 1.8, fontSize: '0.875rem' }}>
                      {product.expertCons.map((c, i) => <li key={i}>{c.point}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Key Attributes */}
            {product.keyAttributes && product.keyAttributes.length > 0 && (
              <div style={{ marginTop: 'var(--atlas-spacing-xl)' }}>
                <h3 className="atlas-h6" style={{ marginBottom: 'var(--atlas-spacing-sm)' }}>Key Attributes</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--atlas-spacing-xs)' }}>
                  {product.keyAttributes.map((attr, i) => (
                    <span key={i} className="atlas-badge">
                      {attr.attribute}: {attr.value}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Solves Problems / Ideal For */}
            {product.solvesProblems && product.solvesProblems.length > 0 && (
              <div style={{ marginTop: 'var(--atlas-spacing-xl)' }}>
                <h3 className="atlas-h6" style={{ marginBottom: 'var(--atlas-spacing-sm)' }}>Solves</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--atlas-spacing-xs)' }}>
                  {product.solvesProblems.map((p, i) => <span key={i} className="atlas-badge atlas-badge-secondary">{p}</span>)}
                </div>
              </div>
            )}
            {product.idealFor && product.idealFor.length > 0 && (
              <div style={{ marginTop: 'var(--atlas-spacing-lg)' }}>
                <h3 className="atlas-h6" style={{ marginBottom: 'var(--atlas-spacing-sm)' }}>Ideal For</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--atlas-spacing-xs)' }}>
                  {product.idealFor.map((p, i) => <span key={i} className="atlas-badge">{p}</span>)}
                </div>
              </div>
            )}

            {/* Certifications */}
            {product.certifications && product.certifications.length > 0 && (
              <div style={{ marginTop: 'var(--atlas-spacing-xl)' }}>
                <h3 className="atlas-h6" style={{ marginBottom: 'var(--atlas-spacing-sm)' }}>Certifications</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--atlas-spacing-sm)' }}>
                  {product.certifications.map((cert, i) => (
                    <div key={i} className="atlas-card-flat" style={{ padding: 'var(--atlas-spacing-sm) var(--atlas-spacing-md)', display: 'flex', alignItems: 'center', gap: 'var(--atlas-spacing-sm)' }}>
                      <span style={{ fontSize: '1.25rem' }}>🏅</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{cert.certName}</div>
                        {cert.issuedBy && <div className="atlas-caption">{cert.issuedBy}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery Info */}
            {(product.deliveryMethod || product.deliveryLeadTime || product.returnDays != null) && (
              <div className="atlas-card-flat" style={{ padding: 'var(--atlas-spacing-md)', marginTop: 'var(--atlas-spacing-xl)' }}>
                <h3 className="atlas-h6" style={{ marginBottom: 'var(--atlas-spacing-sm)' }}>Delivery & Returns</h3>
                <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.25rem 1rem', fontSize: '0.875rem', margin: 0 }}>
                  {product.deliveryMethod && (
                    <>
                      <dt className="atlas-caption" style={{ fontWeight: 600 }}>Delivery</dt>
                      <dd style={{ margin: 0, textTransform: 'capitalize' }}>{product.deliveryMethod}</dd>
                    </>
                  )}
                  {product.deliveryLeadTime && (
                    <>
                      <dt className="atlas-caption" style={{ fontWeight: 600 }}>Lead Time</dt>
                      <dd style={{ margin: 0 }}>{product.deliveryLeadTime}</dd>
                    </>
                  )}
                  {product.returnDays != null && (
                    <>
                      <dt className="atlas-caption" style={{ fontWeight: 600 }}>Returns</dt>
                      <dd style={{ margin: 0 }}>
                        {product.returnDays} day{product.returnDays !== 1 ? 's' : ''}
                        {product.returnFees === 'free' ? ' (free returns)' : ''}
                      </dd>
                    </>
                  )}
                </dl>
              </div>
            )}

            {/* Sustainability */}
            {(product.recyclable || product.sustainablySourced || product.madeLocally) && (
              <div style={{ marginTop: 'var(--atlas-spacing-xl)', display: 'flex', flexWrap: 'wrap', gap: 'var(--atlas-spacing-sm)' }}>
                {product.recyclable && <span className="atlas-badge atlas-badge-secondary">♻️ Recyclable</span>}
                {product.sustainablySourced && <span className="atlas-badge atlas-badge-secondary">🌿 Sustainably Sourced</span>}
                {product.madeLocally && <span className="atlas-badge atlas-badge-secondary">🇿🇦 Made Locally</span>}
              </div>
            )}
          </div>
        </div>

        {/* ── Related Products ─────────────────────────────────── */}
        {relatedProducts.length > 0 && (
          <section style={{ marginTop: 'var(--atlas-spacing-3xl)' }}>
            <hr className="atlas-divider" />
            <h2 className="atlas-h3" style={{ marginBottom: 'var(--atlas-spacing-xl)' }}>Related Products</h2>
            <div className="atlas-product-grid">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} currency={currency} className="atlas-card atlas-fade-in" />
              ))}
            </div>
          </section>
        )}
      </div>

    </>
  );
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function buildProductSchema(
  product: Product,
  config: PageProps['config'],
  productUrl: string,
  currency: string,
) {
  const image = product.images?.[0]?.image;
  const availability = product.availabilityStatus ?? 'inStock';

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.aiSummary || product.shortDescription,
    ...(image && { image: image.url }),
    url: productUrl,
    ...(product.sku && { sku: product.sku }),
    ...(product.gtin && { gtin: product.gtin }),
    ...(product.brand && { brand: { '@type': 'Brand', name: product.brand } }),
    ...(product.manufacturer && { manufacturer: { '@type': 'Organization', name: product.manufacturer } }),
    ...(product.countryOfOrigin && { countryOfOrigin: { '@type': 'Country', name: product.countryOfOrigin } }),
    ...(product.material && { material: product.material }),
    ...(product.color && { color: product.color }),
    ...(product.weight && {
      weight: {
        '@type': 'QuantitativeValue',
        value: product.weight,
        unitCode: product.weightUnit ?? 'kg',
      },
    }),
    itemCondition: `https://schema.org/${conditionMap[product.condition ?? 'new']}`,
    offers: {
      '@type': 'Offer',
      price: (product.price / 100).toFixed(2),
      priceCurrency: currency,
      availability: `https://schema.org/${availabilityMap[availability]}`,
      url: productUrl,
      ...(product.availableUntil && { priceValidUntil: product.availableUntil }),
      seller: {
        '@type': 'Organization',
        name: config.settings?.siteName ?? config.tenant.name,
      },
      ...(product.shippingCost != null && {
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingRate: {
            '@type': 'MonetaryAmount',
            value: (product.shippingCost / 100).toFixed(2),
            currency,
          },
        },
      }),
      ...(product.returnDays != null && {
        hasMerchantReturnPolicy: {
          '@type': 'MerchantReturnPolicy',
          merchantReturnDays: product.returnDays,
          returnFees: product.returnFees === 'free'
            ? 'https://schema.org/FreeReturn'
            : 'https://schema.org/ReturnFeesCustomerResponsibility',
        },
      }),
    },
    ...(product.technicalSpecs?.length && {
      additionalProperty: product.technicalSpecs.map((s) => ({
        '@type': 'PropertyValue',
        name: s.label,
        value: s.value,
      })),
    }),
    ...(product.productFaqs?.length && {
      subjectOf: {
        '@type': 'FAQPage',
        mainEntity: product.productFaqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
    }),
    ...(product.demoVideo && {
      video: {
        '@type': 'VideoObject',
        name: product.demoVideoTitle || `${product.name} Demo`,
        contentUrl: product.demoVideo,
      },
    }),
  };
}

function toEmbedUrl(url: string): string {
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  return url;
}
