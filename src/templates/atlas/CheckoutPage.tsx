'use client';

/**
 * CheckoutPage — Single-page checkout.
 *
 * Variants:
 *   'standard' — customer info + shipping address + order summary
 *   'express'  — customer info only (no shipping address), for digital/collect-in-store
 *
 * Both variants share an Individual/Business pill toggle. Switching to
 * "Business" reveals company name, VAT number, PO number, and order notes.
 * In "standard" mode, Business also reveals a billing address toggle.
 *
 * Analytics events:
 *   - begin_checkout: on page mount
 *   - add_shipping_info: when shipping section fields are completed (standard only)
 *   - purchase: after successful order creation
 *
 * Submit flow:
 *   1. Validate client-side
 *   2. POST to engine /api/public/orders
 *   3a. If paymentUrl → redirect to payment gateway
 *   3b. If no paymentUrl → redirect to /order/confirmation/{token} (quote flow)
 *   4. clearCart()
 */

import { useState, useEffect, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/stores/cart';
import { CurrencyFormatter } from '@/components/CurrencyFormatter';
import { formatCurrency } from '@/lib/currency';
import { submitCheckout } from '@/lib/api';
import {
  trackBeginCheckout,
  trackAddShippingInfo,
  trackPurchase,
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

type CustomerType = 'individual' | 'business';
type SubmitStatus = 'idle' | 'submitting' | 'error' | 'redirecting';

export default function CheckoutPage({ config, variant }: PageProps) {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const clearCart = useCartStore((s) => s.clearCart);

  const currency = config.settings?.currency ?? 'ZAR';
  const tenantSlug = config.tenant.slug;
  const hasGateway = !!config.settings?.paymentGateway;
  const turnstileSiteKey = config.settings?.turnstileSiteKey;

  const flatShippingRate = config.settings?.flatShippingRate ?? 0;
  const freeShippingThreshold = config.settings?.freeShippingThreshold ?? 0;

  const isExpress = variant === 'express';

  // Shipping estimate (for display in summary)
  const shippingEstimate = isExpress
    ? 0
    : freeShippingThreshold > 0 && totalPrice >= freeShippingThreshold
    ? 0
    : flatShippingRate;

  const estimatedTotal = totalPrice + shippingEstimate;

  // Form state
  const [customerType, setCustomerType] = useState<CustomerType>('individual');
  const [billingDiffers, setBillingDiffers] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [shippingInfoFired, setShippingInfoFired] = useState(false);

  // Analytics: begin_checkout on mount
  useEffect(() => {
    if (items.length === 0) return;
    trackBeginCheckout(
      items.map(cartItemToEcommerceItem),
      totalPrice / 100,
      currency,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redirect to cart if empty — but NOT if we're in the middle of a payment redirect
  useEffect(() => {
    if (items.length === 0 && status !== 'redirecting') {
      router.replace('/cart');
    }
  }, [items.length, status, router]);

  // Analytics: add_shipping_info when province is chosen (proxy for "section complete")
  const handleProvinceChange = () => {
    if (!shippingInfoFired) {
      trackAddShippingInfo(
        items.map(cartItemToEcommerceItem),
        totalPrice / 100,
        shippingEstimate / 100,
        currency,
      );
      setShippingInfoFired(true);
    }
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    const form = e.currentTarget;
    const data = new FormData(form);

    const isBusiness = customerType === 'business';

    const payload = {
      tenant: tenantSlug,
      customerType,
      customerName: data.get('customerName') as string,
      customerEmail: data.get('customerEmail') as string,
      customerPhone: (data.get('customerPhone') as string) || undefined,
      // Shipping (standard only)
      ...(!isExpress && {
        shippingLine1: data.get('shippingLine1') as string,
        shippingLine2: (data.get('shippingLine2') as string) || undefined,
        shippingCity: data.get('shippingCity') as string,
        shippingProvince: data.get('shippingProvince') as string,
        shippingPostalCode: data.get('shippingPostalCode') as string,
        shippingCountry: 'ZA',
      }),
      // Business fields
      ...(isBusiness && {
        companyName: data.get('companyName') as string,
        customerVatNumber: (data.get('customerVatNumber') as string) || undefined,
        purchaseOrderNumber: (data.get('purchaseOrderNumber') as string) || undefined,
        orderNotes: (data.get('orderNotes') as string) || undefined,
      }),
      // Billing address (business + standard + billing differs)
      ...(!isExpress && isBusiness && billingDiffers && {
        billingLine1: data.get('billingLine1') as string,
        billingLine2: (data.get('billingLine2') as string) || undefined,
        billingCity: data.get('billingCity') as string,
        billingProvince: data.get('billingProvince') as string,
        billingPostalCode: data.get('billingPostalCode') as string,
        billingCountry: 'ZA',
      }),
      lineItems: items.map((item) => ({
        productId: item.productId,
        qty: item.quantity,
      })),
      turnstileToken: (data.get('cf-turnstile-response') as string) || 'dev-bypass',
    };

    const result = await submitCheckout(payload);

    if (!result) {
      setStatus('error');
      setErrorMessage('Something went wrong placing your order. Please try again.');
      return;
    }

    // Analytics: purchase event
    trackPurchase(
      result.orderNumber,
      items.map(cartItemToEcommerceItem),
      result.total / 100,
      shippingEstimate / 100,
      currency,
    );

    if (result.paymentUrl) {
      // Show redirect overlay BEFORE clearing cart to prevent empty-cart flash
      setStatus('redirecting');
      clearCart();
      window.location.href = result.paymentUrl;
    } else {
      // Quote flow — no payment gateway configured
      clearCart();
      router.push(`/order/confirmation/${result.trackingToken}`);
    }
  }

  if (items.length === 0 && status !== 'redirecting') return null;

  // Full-screen redirect overlay
  if (status === 'redirecting') {
    const gatewayName = config.settings?.paymentGateway === 'paystack' ? 'Paystack' : 'PayFast';
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'var(--atlas-surface, #ffffff)',
        gap: '1.25rem',
      }}>
        <span className="atlas-spinner" style={{ width: '2.5rem', height: '2.5rem' }} />
        <p style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--atlas-text, #1b1b1b)', margin: 0 }}>
          Redirecting to secure payment…
        </p>
        <p style={{ fontSize: '0.875rem', color: 'var(--atlas-text-muted, #888)', margin: 0 }}>
          You’re being taken to {gatewayName} to complete your purchase.
        </p>
      </div>
    );
  }

  const ctaLabel = hasGateway ? 'Proceed to Payment' : 'Request a Quote';

  return (
    <main className="atlas-section">
      <div className="atlas-container">
        <div className="atlas-checkout-layout">
          {/* ---- LEFT: Form ---- */}
          <div className="atlas-checkout-form-col">
            {/* Breadcrumb */}
            <nav className="atlas-checkout-breadcrumb">
              <Link href="/shop">Shop</Link>
              <span>›</span>
              <Link href="/cart">Cart</Link>
              <span>›</span>
              <span>Checkout</span>
            </nav>

            <h1 className="atlas-h3" style={{ marginTop: 'var(--atlas-spacing-lg)', marginBottom: 'var(--atlas-spacing-xl)' }}>
              {isExpress ? 'Your Details' : 'Checkout'}
            </h1>

            <form onSubmit={handleSubmit} className="atlas-checkout-form" noValidate>
              {/* ---- Individual / Business toggle ---- */}
              <div className="atlas-checkout-section">
                <div className="atlas-type-toggle">
                  <button
                    type="button"
                    className={`atlas-type-toggle-btn${customerType === 'individual' ? ' atlas-type-toggle-btn--active' : ''}`}
                    onClick={() => setCustomerType('individual')}
                    id="type-individual"
                  >
                    Individual
                  </button>
                  <button
                    type="button"
                    className={`atlas-type-toggle-btn${customerType === 'business' ? ' atlas-type-toggle-btn--active' : ''}`}
                    onClick={() => setCustomerType('business')}
                    id="type-business"
                  >
                    Business
                  </button>
                </div>
              </div>

              {/* ---- Customer Info ---- */}
              <div className="atlas-checkout-section">
                <h2 className="atlas-checkout-section-title">
                  {customerType === 'business' ? 'Contact Person' : 'Your Details'}
                </h2>

                <div className="atlas-form-row">
                  <div className="atlas-form-field">
                    <label htmlFor="customerName" className="atlas-form-label">
                      {customerType === 'business' ? 'Contact Person' : 'Full Name'}{' '}
                      <span className="atlas-form-required">*</span>
                    </label>
                    <input
                      id="customerName"
                      name="customerName"
                      type="text"
                      className="atlas-input"
                      placeholder={customerType === 'business' ? 'Jane Smith' : 'Your full name'}
                      required
                      autoComplete="name"
                    />
                  </div>
                  <div className="atlas-form-field">
                    <label htmlFor="customerPhone" className="atlas-form-label">
                      Phone
                    </label>
                    <input
                      id="customerPhone"
                      name="customerPhone"
                      type="tel"
                      className="atlas-input"
                      placeholder="+27 ..."
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <div className="atlas-form-field">
                  <label htmlFor="customerEmail" className="atlas-form-label">
                    Email <span className="atlas-form-required">*</span>
                  </label>
                  <input
                    id="customerEmail"
                    name="customerEmail"
                    type="email"
                    className="atlas-input"
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                  />
                  <p className="atlas-form-hint">
                    Order confirmation and updates will be sent here.
                  </p>
                </div>
              </div>

              {/* ---- Business Fields (conditional) ---- */}
              {customerType === 'business' && (
                <div className="atlas-checkout-section atlas-checkout-section--business atlas-fade-in">
                  <h2 className="atlas-checkout-section-title">Business Details</h2>

                  <div className="atlas-form-field">
                    <label htmlFor="companyName" className="atlas-form-label">
                      Company Name <span className="atlas-form-required">*</span>
                    </label>
                    <input
                      id="companyName"
                      name="companyName"
                      type="text"
                      className="atlas-input"
                      placeholder="Acme (Pty) Ltd"
                      required={customerType === 'business'}
                      autoComplete="organization"
                    />
                  </div>

                  <div className="atlas-form-row">
                    <div className="atlas-form-field">
                      <label htmlFor="customerVatNumber" className="atlas-form-label">
                        VAT Number
                      </label>
                      <input
                        id="customerVatNumber"
                        name="customerVatNumber"
                        type="text"
                        className="atlas-input"
                        placeholder="4123456789"
                      />
                    </div>
                    <div className="atlas-form-field">
                      <label htmlFor="purchaseOrderNumber" className="atlas-form-label">
                        PO Number
                      </label>
                      <input
                        id="purchaseOrderNumber"
                        name="purchaseOrderNumber"
                        type="text"
                        className="atlas-input"
                        placeholder="PO-2026-001"
                      />
                    </div>
                  </div>

                  <div className="atlas-form-field">
                    <label htmlFor="orderNotes" className="atlas-form-label">
                      Order Notes
                    </label>
                    <textarea
                      id="orderNotes"
                      name="orderNotes"
                      className="atlas-input atlas-textarea"
                      placeholder="Delivery instructions, special requirements, gate codes…"
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {/* ---- Shipping Address (standard variant only) ---- */}
              {!isExpress && (
                <div className="atlas-checkout-section">
                  <h2 className="atlas-checkout-section-title">Shipping Address</h2>

                  <div className="atlas-form-field">
                    <label htmlFor="shippingLine1" className="atlas-form-label">
                      Street Address <span className="atlas-form-required">*</span>
                    </label>
                    <input
                      id="shippingLine1"
                      name="shippingLine1"
                      type="text"
                      className="atlas-input"
                      placeholder="123 Main Street"
                      required
                      autoComplete="address-line1"
                    />
                  </div>

                  <div className="atlas-form-field">
                    <label htmlFor="shippingLine2" className="atlas-form-label">
                      Apartment / Suite / Unit
                    </label>
                    <input
                      id="shippingLine2"
                      name="shippingLine2"
                      type="text"
                      className="atlas-input"
                      placeholder="Apt 4B, Building Name…"
                      autoComplete="address-line2"
                    />
                  </div>

                  <div className="atlas-form-row atlas-form-row--3">
                    <div className="atlas-form-field">
                      <label htmlFor="shippingCity" className="atlas-form-label">
                        City <span className="atlas-form-required">*</span>
                      </label>
                      <input
                        id="shippingCity"
                        name="shippingCity"
                        type="text"
                        className="atlas-input"
                        placeholder="Cape Town"
                        required
                        autoComplete="address-level2"
                      />
                    </div>
                    <div className="atlas-form-field">
                      <label htmlFor="shippingProvince" className="atlas-form-label">
                        Province <span className="atlas-form-required">*</span>
                      </label>
                      <select
                        id="shippingProvince"
                        name="shippingProvince"
                        className="atlas-input atlas-select"
                        required
                        onChange={handleProvinceChange}
                        autoComplete="address-level1"
                      >
                        <option value="">Select province</option>
                        {SA_PROVINCES.map((p) => (
                          <option key={p.code} value={p.code}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="atlas-form-field">
                      <label htmlFor="shippingPostalCode" className="atlas-form-label">
                        Postal Code <span className="atlas-form-required">*</span>
                      </label>
                      <input
                        id="shippingPostalCode"
                        name="shippingPostalCode"
                        type="text"
                        className="atlas-input"
                        placeholder="8001"
                        required
                        autoComplete="postal-code"
                        inputMode="numeric"
                        maxLength={4}
                      />
                    </div>
                  </div>

                  {/* Billing address toggle (Business mode only) */}
                  {customerType === 'business' && (
                    <div className="atlas-checkout-billing-toggle">
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={billingDiffers}
                          onChange={(e) => setBillingDiffers(e.target.checked)}
                          id="billing-differs"
                          style={{ width: '1rem', height: '1rem', accentColor: 'var(--brand-primary, #2d6a4f)' }}
                        />
                        <span className="atlas-body">Billing address differs from shipping address</span>
                      </label>
                    </div>
                  )}

                  {/* Billing address fields */}
                  {customerType === 'business' && billingDiffers && (
                    <div className="atlas-checkout-billing-fields atlas-fade-in">
                      <h3 className="atlas-h6" style={{ marginBottom: 'var(--atlas-spacing-md)' }}>
                        Billing Address
                      </h3>

                      <div className="atlas-form-field">
                        <label htmlFor="billingLine1" className="atlas-form-label">
                          Street Address <span className="atlas-form-required">*</span>
                        </label>
                        <input
                          id="billingLine1"
                          name="billingLine1"
                          type="text"
                          className="atlas-input"
                          placeholder="123 Business Park"
                          required={billingDiffers}
                        />
                      </div>

                      <div className="atlas-form-field">
                        <label htmlFor="billingLine2" className="atlas-form-label">
                          Suite / Floor
                        </label>
                        <input
                          id="billingLine2"
                          name="billingLine2"
                          type="text"
                          className="atlas-input"
                          placeholder="Suite 5A"
                        />
                      </div>

                      <div className="atlas-form-row atlas-form-row--3">
                        <div className="atlas-form-field">
                          <label htmlFor="billingCity" className="atlas-form-label">
                            City <span className="atlas-form-required">*</span>
                          </label>
                          <input
                            id="billingCity"
                            name="billingCity"
                            type="text"
                            className="atlas-input"
                            placeholder="Johannesburg"
                            required={billingDiffers}
                          />
                        </div>
                        <div className="atlas-form-field">
                          <label htmlFor="billingProvince" className="atlas-form-label">
                            Province <span className="atlas-form-required">*</span>
                          </label>
                          <select
                            id="billingProvince"
                            name="billingProvince"
                            className="atlas-input atlas-select"
                            required={billingDiffers}
                          >
                            <option value="">Select province</option>
                            {SA_PROVINCES.map((p) => (
                              <option key={p.code} value={p.code}>
                                {p.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="atlas-form-field">
                          <label htmlFor="billingPostalCode" className="atlas-form-label">
                            Postal Code <span className="atlas-form-required">*</span>
                          </label>
                          <input
                            id="billingPostalCode"
                            name="billingPostalCode"
                            type="text"
                            className="atlas-input"
                            placeholder="2000"
                            required={billingDiffers}
                            inputMode="numeric"
                            maxLength={4}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ---- Error message ---- */}
              {status === 'error' && (
                <div className="atlas-checkout-error" role="alert">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {errorMessage}
                </div>
              )}

              {/* ---- Submit ---- */}
              <button
                type="submit"
                id="checkout-submit"
                disabled={status === 'submitting'}
                className="atlas-btn atlas-btn-primary atlas-btn-lg atlas-checkout-submit"
              >
                {status === 'submitting' ? (
                  <>
                    <span className="atlas-spinner" />
                    Processing…
                  </>
                ) : (
                  <>
                    {ctaLabel}
                    {hasGateway && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    )}
                  </>
                )}
              </button>

              {/* Trust signals */}
              <div className="atlas-checkout-trust">
                <span>🔒 Secure checkout</span>
                {hasGateway && <span>• Powered by {config.settings?.paymentGateway === 'paystack' ? 'Paystack' : 'PayFast'}</span>}
                <span>• No account required</span>
              </div>
            </form>
          </div>

          {/* ---- RIGHT: Order summary ---- */}
          <aside className="atlas-checkout-summary-col">
            <div className="atlas-checkout-summary-sticky">
              <div className="atlas-card-flat atlas-checkout-summary">
                <h2 className="atlas-h5" style={{ marginBottom: 'var(--atlas-spacing-lg)' }}>
                  Order Summary
                </h2>

                {/* Line items */}
                <div className="atlas-checkout-items">
                  {items.map((item) => (
                    <div key={item.productId} className="atlas-checkout-item-row">
                      <span className="atlas-body" style={{ flex: 1 }}>
                        {item.name}
                        {item.quantity > 1 && (
                          <span className="atlas-caption" style={{ marginLeft: '0.35rem' }}>
                            × {item.quantity}
                          </span>
                        )}
                      </span>
                      <CurrencyFormatter
                        cents={item.price * item.quantity}
                        currency={currency}
                      />
                    </div>
                  ))}
                </div>

                <hr className="atlas-divider" style={{ margin: 'var(--atlas-spacing-md) 0' }} />

                {/* Subtotal */}
                <div className="atlas-checkout-summary-row">
                  <span className="atlas-body">Subtotal</span>
                  <CurrencyFormatter cents={totalPrice} currency={currency} />
                </div>

                {/* Shipping */}
                {!isExpress && (
                  <div className="atlas-checkout-summary-row">
                    <span className="atlas-body">Shipping</span>
                    <span>
                      {shippingEstimate === 0 && freeShippingThreshold > 0 ? (
                        <span style={{ color: 'var(--brand-secondary, #52b788)', fontWeight: 600 }}>
                          Free
                        </span>
                      ) : shippingEstimate > 0 ? (
                        <CurrencyFormatter cents={shippingEstimate} currency={currency} />
                      ) : (
                        <span className="atlas-caption">TBD</span>
                      )}
                    </span>
                  </div>
                )}

                <hr className="atlas-divider" style={{ margin: 'var(--atlas-spacing-md) 0' }} />

                <div className="atlas-checkout-summary-row atlas-checkout-summary-total">
                  <span className="atlas-h5">Total</span>
                  <span className="atlas-h5">
                    <CurrencyFormatter cents={estimatedTotal} currency={currency} />
                  </span>
                </div>

                <p className="atlas-caption" style={{ marginTop: '0.5rem', opacity: 0.6 }}>
                  {currency === 'ZAR' ? 'Prices include VAT where applicable.' : ''}
                </p>
              </div>

              <p className="atlas-caption" style={{ marginTop: 'var(--atlas-spacing-md)', opacity: 0.55, textAlign: 'center' }}>
                Prices are locked at the time you place your order.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
