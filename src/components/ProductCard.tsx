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
};

export function ProductCard({
  product,
  currency = 'ZAR',
  basePath = '/shop',
  className,
  priority = false,
  secondaryImageUrl,
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
      className={className}
      style={{
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
        position: 'relative',
      }}
    >
      {/* Image */}
      <div
        style={{
          position: 'relative',
          aspectRatio: '1 / 1',
          overflow: 'hidden',
          borderRadius: '8px',
          backgroundColor: '#f5f5f5',
        }}
      >
        {image ? (
          <>
            <Image
              src={image.url}
              alt={image.alt ?? product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              style={{ objectFit: 'cover' }}
              priority={priority}
              className="atlas-product-img-primary"
            />
            {secondaryImageUrl && (
              <Image
                src={secondaryImageUrl}
                alt={`${product.name} - alternate view`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
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

        {hasDiscount && !isOutOfStock && (
          <span
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              padding: '4px 8px',
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: '4px',
              backgroundColor: '#e53e3e',
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
              color: '#888',
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

        {/* Price */}
        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: hasDiscount ? '#e53e3e' : 'inherit',
            }}
          >
            {formatCurrency(product.price, productCurrency)}
          </span>

          {hasDiscount && product.compareAtPrice != null && (
            <span
              style={{
                fontSize: '0.85rem',
                color: '#999',
                textDecoration: 'line-through',
              }}
            >
              {formatCurrency(product.compareAtPrice, productCurrency)}
            </span>
          )}
        </div>
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
