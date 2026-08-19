'use client';

/**
 * AtlasCartDrawer  Client Component
 *
 * Slide-out drawer from the right. Shows cart items with quantity
 * controls, subtotal, and CTA buttons. Empty state when cart is empty.
 */

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/stores/cart';
import { CurrencyFormatter } from '@/components/CurrencyFormatter';
import type { TenantConfig } from '@/lib/types';

type Props = {
  config: TenantConfig;
  isOpen: boolean;
  onClose: () => void;
};

export default function AtlasCartDrawer({ config, isOpen, onClose }: Props) {
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const totalItems = useCartStore((s) => s.totalItems());
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const hasGateway = !!config.settings?.paymentGateway;
  const ctaLabel = hasGateway ? 'Checkout' : 'Request a Quote';
  const currency = config.settings?.currency ?? 'ZAR';

  // Close on Escape and prevent body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="atlas-backdrop"
        data-open={isOpen}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="atlas-drawer atlas-drawer--right"
        data-open={isOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        <div className="atlas-drawer-header">
          <span className="atlas-h5" style={{ margin: 0 }}>
            Cart ({totalItems})
          </span>
          <button
            className="atlas-btn-icon atlas-btn-ghost"
            onClick={onClose}
            aria-label="Close cart"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="atlas-drawer-body" style={{ flex: 1, overflowY: 'auto' }}>
          {items.length === 0 ? (
            <div className="atlas-empty-state" style={{ padding: '3rem 0' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <p className="atlas-body" style={{ marginTop: '1rem' }}>
                Your cart is empty
              </p>
              <Link
                href="/shop"
                className="atlas-btn atlas-btn-primary"
                style={{ marginTop: '1rem' }}
                onClick={onClose}
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div>
              {items.map((item) => (
                <div key={item.productId} className="atlas-cart-item">
                  {/* Thumbnail */}
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="atlas-cart-item-image"
                    />
                  ) : (
                    <div
                      className="atlas-cart-item-image"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                      }}
                    >
                      
                    </div>
                  )}

                  {/* Info */}
                  <div className="atlas-cart-item-info">
                    <div className="atlas-cart-item-name">{item.name}</div>
                    <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {/* Qty stepper */}
                      <div className="atlas-qty-stepper">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <CurrencyFormatter
                        cents={item.price * item.quantity}
                        currency={currency}
                      />

                      {/* Remove */}
                      <button
                        className="atlas-btn-icon atlas-btn-ghost"
                        onClick={() => removeItem(item.productId)}
                        aria-label={`Remove ${item.name}`}
                        style={{ marginLeft: 'auto' }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer  only show if items exist */}
        {items.length > 0 && (
          <div className="atlas-drawer-footer">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span className="atlas-h5">Subtotal</span>
              <span className="atlas-h5">
                <CurrencyFormatter cents={totalPrice} currency={currency} />
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link
                href="/checkout"
                className="atlas-btn atlas-btn-primary"
                style={{ width: '100%', textAlign: 'center' }}
                onClick={onClose}
              >
                {ctaLabel}
              </Link>
              <Link
                href="/cart"
                className="atlas-btn atlas-btn-outline"
                style={{ width: '100%', textAlign: 'center' }}
                onClick={onClose}
              >
                View Cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
