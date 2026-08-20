'use client';

/**
 * OrderConfirmationPage — Order confirmation + live tracking.
 *
 * Route: /order/confirmation/[trackingToken]
 *
 * Fetches order data by tracking token from the engine (no auth required).
 * Renders one of four states based on order status:
 *   1. Just Paid        — "Thank you!" hero with confetti-like celebration
 *   2. Quote Submitted  — "We've received your request" state
 *   3. Tracking Mode    — Live status timeline + courier tracking card
 *   4. Delivered        — All of the above + delivery confirmation
 *
 * The tracking token is extracted from the URL path segments.
 * Re-fetches on a 30-second interval to show live status updates.
 */

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getOrderByTrackingToken } from '@/lib/api';
import type { OrderTrackingData } from '@/lib/api';
import { CurrencyFormatter } from '@/components/CurrencyFormatter';
import type { PageProps } from '@/lib/types';

// Status badge colours
const STATUS_COLOURS: Record<string, { bg: string; text: string; label: string }> = {
  pending:    { bg: '#fef3c7', text: '#d97706', label: 'Pending' },
  processing: { bg: '#dbeafe', text: '#2563eb', label: 'Processing' },
  shipped:    { bg: '#ede9fe', text: '#7c3aed', label: 'Shipped' },
  delivered:  { bg: '#d1fae5', text: '#059669', label: 'Delivered' },
  cancelled:  { bg: '#fee2e2', text: '#dc2626', label: 'Cancelled' },
  refunded:   { bg: '#f3f4f6', text: '#6b7280', label: 'Refunded' },
  quote:      { bg: '#fef9c3', text: '#ca8a04', label: 'Quote Requested' },
};

const STATUS_ICONS: Record<string, string> = {
  pending:    '⏳',
  processing: '⚙️',
  shipped:    '🚚',
  delivered:  '✅',
  cancelled:  '❌',
  refunded:   '↩️',
  quote:      '📋',
};

function StatusBadge({ status }: { status: string }) {
  const colours = STATUS_COLOURS[status] ?? STATUS_COLOURS.pending;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: '0.375rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.875rem',
        fontWeight: 600,
        background: colours.bg,
        color: colours.text,
      }}
    >
      {STATUS_ICONS[status] ?? '•'} {colours.label}
    </span>
  );
}

function StatusTimeline({ history }: { history: OrderTrackingData['statusHistory'] }) {
  if (!history || history.length === 0) return null;

  return (
    <div className="atlas-status-timeline">
      {[...history].reverse().map((entry, i) => {
        const colours = STATUS_COLOURS[entry.status] ?? STATUS_COLOURS.pending;
        const isLatest = i === 0;
        return (
          <div key={i} className={`atlas-timeline-entry${isLatest ? ' atlas-timeline-entry--current' : ''}`}>
            <div className="atlas-timeline-dot" style={{ background: isLatest ? colours.text : undefined }} />
            <div className="atlas-timeline-content">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="atlas-h6" style={{ color: isLatest ? colours.text : undefined }}>
                  {STATUS_ICONS[entry.status] ?? '•'} {colours.label}
                </span>
                <span className="atlas-caption" style={{ opacity: 0.6 }}>
                  {new Date(entry.timestamp).toLocaleString('en-ZA', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
              {entry.note && (
                <p className="atlas-caption" style={{ marginTop: '0.25rem', opacity: 0.75 }}>
                  {entry.note}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ShippingCard({ order }: { order: OrderTrackingData }) {
  if (!order.shippingCarrier && !order.shippingTrackingNumber) return null;

  return (
    <div className="atlas-card-flat atlas-shipping-card">
      <h3 className="atlas-h6" style={{ marginBottom: 'var(--atlas-spacing-md)' }}>
        📦 Shipment Details
      </h3>
      {order.shippingCarrier && (
        <div className="atlas-shipping-card-row">
          <span className="atlas-caption">Carrier</span>
          <span className="atlas-body" style={{ fontWeight: 600 }}>
            {order.shippingCarrier}
          </span>
        </div>
      )}
      {order.shippingTrackingNumber && (
        <div className="atlas-shipping-card-row">
          <span className="atlas-caption">Tracking #</span>
          <span className="atlas-body" style={{ fontFamily: 'monospace', fontWeight: 600 }}>
            {order.shippingTrackingNumber}
          </span>
        </div>
      )}
      {order.estimatedDeliveryDate && (
        <div className="atlas-shipping-card-row">
          <span className="atlas-caption">Est. Delivery</span>
          <span className="atlas-body" style={{ fontWeight: 600 }}>
            {new Date(order.estimatedDeliveryDate).toLocaleDateString('en-ZA', {
              dateStyle: 'long',
            })}
          </span>
        </div>
      )}
      {order.shippingTrackingUrl && (
        <a
          href={order.shippingTrackingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="atlas-btn atlas-btn-outline"
          style={{ marginTop: 'var(--atlas-spacing-md)', width: '100%', textAlign: 'center' }}
        >
          Track My Parcel →
        </a>
      )}
    </div>
  );
}

export default function OrderConfirmationPage({ config, path }: PageProps) {
  // Extract tracking token from path: /order/confirmation/[token]
  // path arrives as ['order', 'confirmation', 'abc123...'] from the catch-all
  const trackingToken = path[path.length - 1] ?? '';

  const currency = config.settings?.currency ?? 'ZAR';

  const [order, setOrder] = useState<OrderTrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const fetchOrder = useCallback(async () => {
    if (!trackingToken) return;
    const data = await getOrderByTrackingToken(trackingToken);
    if (!data) {
      setNotFound(true);
    } else {
      setOrder(data);
    }
    setLoading(false);
  }, [trackingToken]);

  // Initial fetch
  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  // Poll every 30 seconds for live status updates
  useEffect(() => {
    const interval = setInterval(fetchOrder, 30_000);
    return () => clearInterval(interval);
  }, [fetchOrder]);

  // Loading state
  if (loading) {
    return (
      <main className="atlas-section">
        <div className="atlas-container" style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div className="atlas-empty-state" style={{ minHeight: '40vh' }}>
            <div
              className="atlas-skeleton"
              style={{ width: '60px', height: '60px', borderRadius: '50%', marginBottom: '1rem' }}
            />
            <div className="atlas-skeleton" style={{ width: '200px', height: '1.5rem' }} />
            <div className="atlas-skeleton" style={{ width: '300px', height: '1rem', marginTop: '0.5rem' }} />
          </div>
        </div>
      </main>
    );
  }

  // Not found
  if (notFound || !order) {
    return (
      <main className="atlas-section">
        <div className="atlas-container" style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '3rem' }}>🔍</p>
          <h1 className="atlas-h3" style={{ marginTop: '1rem' }}>Order Not Found</h1>
          <p className="atlas-body" style={{ marginTop: '0.5rem', opacity: 0.65 }}>
            We couldn&apos;t find an order with this link. It may have expired or the link may be incorrect.
          </p>
          <Link href="/shop" className="atlas-btn atlas-btn-primary" style={{ marginTop: '1.5rem' }}>
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  const isPaid = order.paymentStatus === 'paid';
  const isQuote = order.paymentStatus === 'unpaid' || order.status === 'quote';
  const isDelivered = order.status === 'delivered';
  const isShipped = order.status === 'shipped';
  const isTracking = isShipped || isDelivered || order.status === 'processing';

  // Helper for order total line items
  const lineItemsTotal = order.lineItems?.reduce(
    (sum, item) => sum + item.lineTotal,
    0,
  ) ?? order.subtotal;

  return (
    <main className="atlas-section">
      <div className="atlas-container" style={{ maxWidth: '760px', margin: '0 auto' }}>

        {/* ---- Hero (Just Paid) ---- */}
        {isPaid && !isTracking && (
          <div className="atlas-confirmation-hero">
            <div className="atlas-confirmation-hero-icon">🎉</div>
            <h1 className="atlas-h2" style={{ marginTop: '1rem' }}>
              Thank you for your order!
            </h1>
            <p className="atlas-body-lg" style={{ marginTop: '0.5rem', opacity: 0.75 }}>
              Your payment has been confirmed and your order is being prepared.
            </p>
          </div>
        )}

        {/* ---- Hero (Quote Submitted) ---- */}
        {isQuote && (
          <div className="atlas-confirmation-hero">
            <div className="atlas-confirmation-hero-icon">📋</div>
            <h1 className="atlas-h2" style={{ marginTop: '1rem' }}>
              Quote Request Received
            </h1>
            <p className="atlas-body-lg" style={{ marginTop: '0.5rem', opacity: 0.75 }}>
              We&apos;ve received your request and will be in touch within 1–2 business days.
            </p>
          </div>
        )}

        {/* ---- Hero (Delivered) ---- */}
        {isDelivered && (
          <div className="atlas-confirmation-hero">
            <div className="atlas-confirmation-hero-icon">✅</div>
            <h1 className="atlas-h2" style={{ marginTop: '1rem' }}>
              Your order has been delivered!
            </h1>
            <p className="atlas-body-lg" style={{ marginTop: '0.5rem', opacity: 0.75 }}>
              We hope you enjoy your purchase. Thank you for shopping with us.
            </p>
          </div>
        )}

        {/* ---- Order ID badge ---- */}
        <div className="atlas-confirmation-meta">
          <div>
            <span className="atlas-caption">Order number</span>
            <div className="atlas-h5" style={{ marginTop: '0.15rem' }}>
              {order.orderNumber}
            </div>
          </div>
          <StatusBadge status={order.status} />
        </div>

        {/* ---- Email confirmation notice ---- */}
        {(isPaid || isQuote) && (
          <div className="atlas-confirmation-notice">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <span>
              A confirmation has been sent to <strong>{order.customerEmail}</strong>
            </span>
          </div>
        )}

        {/* ---- Status timeline (tracking mode) ---- */}
        {order.statusHistory && order.statusHistory.length > 0 && (
          <div className="atlas-card-flat" style={{ padding: 'var(--atlas-spacing-xl)', marginBottom: 'var(--atlas-spacing-lg)' }}>
            <h2 className="atlas-h5" style={{ marginBottom: 'var(--atlas-spacing-lg)' }}>
              Order Status
            </h2>
            <StatusTimeline history={order.statusHistory} />
          </div>
        )}

        {/* ---- Shipping / courier card ---- */}
        {isTracking && <ShippingCard order={order} />}

        {/* ---- Line items summary ---- */}
        <div className="atlas-card-flat" style={{ padding: 'var(--atlas-spacing-xl)', marginBottom: 'var(--atlas-spacing-lg)' }}>
          <h2 className="atlas-h5" style={{ marginBottom: 'var(--atlas-spacing-lg)' }}>
            {isTracking ? 'Items in this order' : 'Your Order'}
          </h2>

          <div className="atlas-checkout-items">
            {order.lineItems?.map((item, i) => (
              <div key={i} className="atlas-checkout-item-row">
                <span className="atlas-body" style={{ flex: 1 }}>
                  {item.productName}
                  {item.variantLabel && (
                    <span className="atlas-caption" style={{ marginLeft: '0.35rem' }}>
                      — {item.variantLabel}
                    </span>
                  )}
                  {item.qty > 1 && (
                    <span className="atlas-caption" style={{ marginLeft: '0.35rem' }}>
                      × {item.qty}
                    </span>
                  )}
                </span>
                <CurrencyFormatter cents={item.lineTotal} currency={currency} />
              </div>
            ))}
          </div>

          <hr className="atlas-divider" style={{ margin: 'var(--atlas-spacing-md) 0' }} />

          <div className="atlas-checkout-summary-row">
            <span className="atlas-body">Subtotal</span>
            <CurrencyFormatter cents={order.subtotal} currency={currency} />
          </div>

          {order.shippingCost > 0 && (
            <div className="atlas-checkout-summary-row">
              <span className="atlas-body">Shipping</span>
              <CurrencyFormatter cents={order.shippingCost} currency={currency} />
            </div>
          )}

          {order.discountAmount > 0 && (
            <div className="atlas-checkout-summary-row">
              <span className="atlas-body">Discount</span>
              <span style={{ color: 'var(--brand-secondary, #52b788)', fontWeight: 600 }}>
                −<CurrencyFormatter cents={order.discountAmount} currency={currency} />
              </span>
            </div>
          )}

          <hr className="atlas-divider" style={{ margin: 'var(--atlas-spacing-md) 0' }} />

          <div className="atlas-checkout-summary-row atlas-checkout-summary-total">
            <span className="atlas-h5">Total</span>
            <span className="atlas-h5">
              <CurrencyFormatter cents={order.total} currency={currency} />
            </span>
          </div>
        </div>

        {/* ---- Invoice download (if available) ---- */}
        {order.invoiceUrl && (
          <div style={{ marginBottom: 'var(--atlas-spacing-lg)', textAlign: 'center' }}>
            <a
              href={order.invoiceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="atlas-btn atlas-btn-outline"
            >
              📄 Download Invoice (PDF)
            </a>
          </div>
        )}

        {/* ---- CTAs ---- */}
        <div className="atlas-confirmation-ctas">
          <Link href="/shop" className="atlas-btn atlas-btn-primary">
            Continue Shopping
          </Link>
          <Link href="/contact" className="atlas-btn atlas-btn-ghost">
            Need help? Contact us
          </Link>
        </div>
      </div>
    </main>
  );
}
