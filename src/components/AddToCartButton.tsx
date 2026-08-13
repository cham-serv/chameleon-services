/**
 * AddToCartButton Component
 *
 * Client Component that adds a product to the cart store.
 * Provides brief "Added ✓" feedback animation.
 * Templates override styling via the className prop.
 */

'use client';

import { useState, useCallback } from 'react';
import { useCartStore } from '@/stores/cart';
import type { Product, MediaItem } from '@/lib/api';

type AddToCartButtonProps = {
  product: Product;
  currency?: string;
  /** Text shown on the button. Default: 'Add to Cart' */
  label?: string;
  className?: string;
};

export function AddToCartButton({
  product,
  currency = 'ZAR',
  label = 'Add to Cart',
  className,
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const isOutOfStock =
    product.trackInventory &&
    product.stockLevel != null &&
    product.stockLevel <= 0;

  const handleClick = useCallback(() => {
    if (isOutOfStock) return;

    const image = resolveFirstImageUrl(product.images);

    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: image ?? undefined,
      currency: product.currency ?? currency,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }, [addItem, product, currency, isOutOfStock]);

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isOutOfStock}
      className={className}
      style={
        className
          ? undefined
          : {
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px 20px',
              fontSize: '0.9rem',
              fontWeight: 600,
              border: 'none',
              borderRadius: '6px',
              cursor: isOutOfStock ? 'not-allowed' : 'pointer',
              backgroundColor: isOutOfStock
                ? '#ccc'
                : added
                  ? '#38a169'
                  : '#1a1a2e',
              color: '#fff',
              transition: 'background-color 0.2s ease',
              opacity: isOutOfStock ? 0.6 : 1,
            }
      }
      aria-label={
        isOutOfStock
          ? 'Out of stock'
          : added
            ? `${product.name} added to cart`
            : `Add ${product.name} to cart`
      }
    >
      {isOutOfStock ? 'Out of Stock' : added ? 'Added ✓' : label}
    </button>
  );
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function resolveFirstImageUrl(
  images?: Array<{ image: MediaItem }>,
): string | null {
  if (!images?.length) return null;
  const first = images[0];
  return first?.image?.url ?? null;
}
