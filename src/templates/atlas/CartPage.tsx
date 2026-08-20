'use client';

/**
 * CartPage — Full-page cart review.
 *
 * Reads from the Zustand cart store. Shows all items with quantity controls,
 * a shipping estimate based on tenant config, an order summary sidebar, and
 * stub slots for a coupon code and cross-sell section.
 *
 * Fires the 'view_cart' GA4 analytics event on mount.
 */

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/stores/cart';
import { CurrencyFormatter } from '@/components/CurrencyFormatter';
import { formatCurrency } from '@/lib/currency';
import {
  trackViewCart,
  trackRemoveFromCart,
  cartItemToEcommerceItem,
} from '@/lib/analytics';
import type { PageProps } from '@/lib/types';

const SA_PROVINCES = [
  { code: 'EC', label: 'Eastern Cape' },
  { code: 'FS', label: 'Free State' },
  { code: 'GP', label: 'Gauteng' },
  { code: 'KZN', label: 'KwaZulu-Natal' },
  { code: 'LP', label: 'Limpopo' },
  { code: 'MP', label: 'Mpumalanga' },
  { code: 'NW', label: 'North West' },
  { code: 'NC', label: 'Northern Cape' },
  { code: 'WC', label: 'Western Cape' },
];

export default function CartPage({ config }: PageProps) {
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const totalItems = useCartStore((s) => s.totalItems());
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const currency = config.settings?.currency ?? 'ZAR';
  const flatShippingRate = config.settings?.flatShippingRate ?? 0;
  const freeShippingThreshold = config.settings?.freeShippingThreshold ?? 0;
  const hasGateway = !!config.settings?.paymentGateway;

  // Calculate shipping estimate
  const shippingEstimate =
    freeShippingThreshold > 0 && totalPrice >= freeShippingThreshold
      ? 0
      : flatShippingRate;

  const remainingForFreeShipping =
    freeShippingThreshold > 0 && totalPrice < freeShippingThreshold
      ? freeShippingThreshold - totalPrice
      : 0;

  const estimatedTotal = totalPrice + shippingEstimate;

  // Analytics: view_cart on mount
  useEffect(() => {
    if (items.length === 0) return;
    trackViewCart(
      items.map(cartItemToEcommerceItem),
      totalPrice / 100,
      currency,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemove = (item: (typeof items)[0]) => {
    trackRemoveFromCart(cartItemToEcommerceItem(item), currency);
    removeItem(item.productId);
  };

  // Empty cart state
  if (items.length === 0) {
    return (
      <main className="atlas-section">
        <div className="atlas-container">
          <div className="atlas-empty-state" style={{ minHeight: '40vh' }}>
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <h1 className="atlas-h3" style={{ marginTop: '1rem' }}>
              Your cart is empty
            </h1>
            <p className="atlas-body" style={{ marginTop: '0.5rem', opacity: 0.65 }}>
              Looks like you haven&apos;t added anything yet.
            </p>
            <Link
              href="/shop"
              className="atlas-btn atlas-btn-primary"
              style={{ marginTop: '1.5rem' }}
            >
              Browse Products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="atlas-section">
      <div className="atlas-container">
        {/* Page title */}
        <h1 className="atlas-h2" style={{ marginBottom: 'var(--atlas-spacing-xl)' }}>
          Your Cart
          <span
            className="atlas-caption"
            style={{ marginLeft: '0.75rem', fontWeight: 400 }}
          >
            ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </span>
        </h1>

        {/* Free shipping progress banner */}
        {freeShippingThreshold > 0 && (
          <div className="atlas-cart-shipping-banner" style={{ marginBottom: 'var(--atlas-spacing-lg)' }}>
            {remainingForFreeShipping > 0 ? (
              <>
                <span>🚚</span>
                <span>
                  Add{' '}
                  <strong>{formatCurrency(remainingForFreeShipping, currency)}</strong>{' '}
                  more for <strong>free shipping!</strong>
                </span>
                {/* Progress bar */}
                <div className="atlas-shipping-progress">
                  <div
                    className="atlas-shipping-progress-fill"
                    style={{
                      width: `${Math.min(100, (totalPrice / freeShippingThreshold) * 100)}%`,
                    }}
                  />
                </div>
              </>
            ) : (
              <>
                <span>🎉</span>
                <span>
                  <strong>You qualify for free shipping!</strong>
                </span>
              </>
            )}
          </div>
        )}

        {/* Main layout: items left, summary right */}
        <div className="atlas-cart-layout">
          {/* ---- LEFT: Line items ---- */}
          <div className="atlas-cart-items">
            {items.map((item) => (
              <div key={item.productId} className="atlas-cart-row">
                {/* Thumbnail */}
                <div className="atlas-cart-row-image">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={96}
                      height={96}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 'var(--atlas-radius-md)',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        background: 'color-mix(in srgb, var(--brand-primary, #2d6a4f) 6%, transparent)',
                        borderRadius: 'var(--atlas-radius-md)',
                      }}
                    >
                      📦
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="atlas-cart-row-info">
                  <Link
                    href={`/shop/${item.slug}`}
                    className="atlas-h5"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    {item.name}
                  </Link>
                  <div
                    className="atlas-caption"
                    style={{ marginTop: '0.25rem', opacity: 0.65 }}
                  >
                    {formatCurrency(item.price, currency)} each
                  </div>
                </div>

                {/* Qty stepper */}
                <div className="atlas-cart-row-qty">
                  <div className="atlas-qty-stepper">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      aria-label="Decrease quantity"
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Line total */}
                <div className="atlas-cart-row-total">
                  <CurrencyFormatter
                    cents={item.price * item.quantity}
                    currency={currency}
                  />
                </div>

                {/* Remove */}
                <button
                  className="atlas-btn-icon atlas-btn-ghost atlas-cart-row-remove"
                  onClick={() => handleRemove(item)}
                  aria-label={`Remove ${item.name}`}
                  title="Remove"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            ))}

            {/* Coupon code stub */}
            <div className="atlas-cart-coupon">
              <label htmlFor="coupon-code" className="atlas-caption" style={{ fontWeight: 600 }}>
                🏷️ Discount code
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <input
                  id="coupon-code"
                  type="text"
                  className="atlas-input"
                  placeholder="Enter code"
                  disabled
                  title="Discount codes coming soon"
                  style={{ maxWidth: '240px' }}
                />
                <button
                  className="atlas-btn atlas-btn-outline"
                  disabled
                  title="Discount codes coming soon"
                >
                  Apply
                </button>
              </div>
              <p className="atlas-caption" style={{ marginTop: '0.35rem', opacity: 0.55 }}>
                Discount codes coming soon
              </p>
            </div>
          </div>

          {/* ---- RIGHT: Order summary ---- */}
          <aside className="atlas-cart-summary">
            <div className="atlas-card-flat atlas-cart-summary-inner">
              <h2 className="atlas-h5" style={{ marginBottom: 'var(--atlas-spacing-lg)' }}>
                Order Summary
              </h2>

              <div className="atlas-cart-summary-row">
                <span className="atlas-body">Subtotal</span>
                <CurrencyFormatter cents={totalPrice} currency={currency} />
              </div>

              <div className="atlas-cart-summary-row">
                <span className="atlas-body">Shipping</span>
                <span>
                  {shippingEstimate === 0 && freeShippingThreshold > 0 ? (
                    <span style={{ color: 'var(--brand-secondary, #52b788)', fontWeight: 600 }}>
                      Free
                    </span>
                  ) : shippingEstimate > 0 ? (
                    <CurrencyFormatter cents={shippingEstimate} currency={currency} />
                  ) : (
                    <span className="atlas-caption">Calculated at checkout</span>
                  )}
                </span>
              </div>

              {/* Discount placeholder */}
              <div className="atlas-cart-summary-row" style={{ opacity: 0.45 }}>
                <span className="atlas-body">Discount</span>
                <span>—</span>
              </div>

              <hr className="atlas-divider" style={{ margin: 'var(--atlas-spacing-md) 0' }} />

              <div className="atlas-cart-summary-row atlas-cart-summary-total">
                <span className="atlas-h5">Estimated Total</span>
                <span className="atlas-h5">
                  <CurrencyFormatter cents={estimatedTotal} currency={currency} />
                </span>
              </div>

              <p className="atlas-caption" style={{ marginTop: '0.5rem', opacity: 0.6 }}>
                Final total confirmed at checkout. Prices include VAT.
              </p>

              <Link
                href="/checkout"
                className="atlas-btn atlas-btn-primary atlas-btn-lg"
                style={{
                  width: '100%',
                  textAlign: 'center',
                  marginTop: 'var(--atlas-spacing-lg)',
                }}
              >
                {hasGateway ? 'Proceed to Checkout' : 'Request a Quote'}
              </Link>

              <Link
                href="/shop"
                className="atlas-btn atlas-btn-ghost"
                style={{
                  width: '100%',
                  textAlign: 'center',
                  marginTop: 'var(--atlas-spacing-sm)',
                }}
              >
                ← Continue Shopping
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
