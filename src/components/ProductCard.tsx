/**
 * ProductCard Component
 *
 * Renders a product card for shop listing grids. Server Component.
 * Templates override styling via the className prop.
 */

import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/lib/currency';
import type { Product, MediaItem } from '@/lib/api';

type ProductCardProps = {
  product: Product;
  currency?: string;
  /** Base path for the product detail link. Default: '/shop' */
  basePath?: string;
  className?: string;
  /** Set to true for above-the-fold images to disable lazy loading */
  priority?: boolean;
  /** Optional secondary image URL for CSS hover-swap (modern variant) */
  secondaryImageUrl?: string | null;
  /** When false (quote/catalogue mode), prices are hidden. Default: true */
  showPrices?: boolean;
};

export function ProductCard({
  product,
  currency = 'ZAR',
  basePath = '/shop',
  className,
  priority = false,
  secondaryImageUrl,
  showPrices = true,
}: ProductCardProps) {
  const image = resolveFirstImage(product.images);
  const productCurrency = product.currency ?? currency;
  const isOutOfStock =
    product.trackInventory &&
    product.stockLevel != null &&
    product.stockLevel <= 0;
  const hasDiscount =
    product.compareAtPrice != null && product.compareAtPrice > product.price;

  return (
    <Link
      href={`${basePath}/${product.slug}`}
      className={`atlas-product-card${className ? ` ${className}` : ''}`}
    >
      {/* Image */}
      <div className="atlas-product-card-img-wrap">
        {image ? (
          <>
            <Image
              src={image.url}
              alt={image.alt ?? product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
              style={{ objectFit: 'cover' }}
              priority={priority}
              className="atlas-product-img-primary"
            />
            {secondaryImageUrl && (
              <Image
                src={secondaryImageUrl}
                alt={`${product.name} - alternate view`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
                style={{ objectFit: 'cover' }}
                className="atlas-product-img-secondary"
                aria-hidden="true"
              />
            )}
          </>
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              color: '#ccc',
            }}
            aria-label="No product image"
          >
            
          </div>
        )}

        {/* Hover overlay */}
        <div className="atlas-product-card-overlay" aria-hidden="true">
          <span className="atlas-product-card-overlay-label">View Product</span>
        </div>

        {/* Badges */}
        {isOutOfStock && (
          <span
            style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              padding: '4px 8px',
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: '4px',
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: '#fff',
            }}
          >
            Out of Stock
          </span>
        )}

        {/* Sale badge — only shown when prices are visible */}
        {hasDiscount && !isOutOfStock && showPrices && (
          <span
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              padding: '4px 8px',
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: '4px',
              /* WCAG AA: #c0392b on white = 4.5:1 (was #e53e3e = 3.3:1) */
              backgroundColor: '#c0392b',
              color: '#fff',
            }}
          >
            Sale
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ marginTop: '12px' }}>
        {/* Category badge */}
        {product.category && typeof product.category === 'object' && (
          <span
            style={{
              display: 'inline-block',
              fontSize: '0.7rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              /* WCAG AA: #767676 on white = 4.54:1 (was #888 = 3.4:1) */
              color: '#767676',
              marginBottom: '4px',
            }}
          >
            {product.category.name}
          </span>
        )}

        {/* Name */}
        <h3
          style={{
            margin: 0,
            fontSize: '1rem',
            fontWeight: 500,
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.name}
        </h3>

        {/* Short description */}
        {product.shortDescription && (
          <p
            style={{
              margin: '4px 0 0',
              fontSize: '0.85rem',
              color: '#666',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {product.shortDescription}
          </p>
        )}

        {/* Price — hidden in quote/catalogue mode */}
        {showPrices ? (
          <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '1rem',
                fontWeight: 600,
                /* WCAG AA: #c0392b on white = 4.5:1 (was #e53e3e = 3.3:1) */
                color: hasDiscount ? '#c0392b' : 'inherit',
              }}
            >
              {formatCurrency(product.price, productCurrency)}
            </span>

            {hasDiscount && product.compareAtPrice != null && (
              <span
                style={{
                  fontSize: '0.85rem',
                  /* WCAG AA: #767676 on white = 4.54:1 (was #999 = 2.7:1) */
                  color: '#767676',
                  textDecoration: 'line-through',
                }}
              >
                {formatCurrency(product.compareAtPrice, productCurrency)}
              </span>
            )}
          </div>
        ) : (
          <div style={{ marginTop: '8px' }}>
            <span
              style={{
                display: 'inline-block',
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '3px 8px',
                borderRadius: '4px',
                border: '1px solid currentColor',
                /* WCAG AA: explicit colour instead of opacity:0.6 which creates contrast failure */
                color: '#767676',
              }}
            >
              Request a Quote
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

// - Helpers -

function resolveFirstImage(
  images?: Array<{ image: MediaItem }>,
): MediaItem | null {
  if (!images?.length) return null;
  const first = images[0];
  return first?.image ?? null;
}
