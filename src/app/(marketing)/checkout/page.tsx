'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Check, Loader2, AlertCircle } from 'lucide-react';

// ── Plan metadata (mirrors engine plans.ts — display only) ───────────────────

type Tier = 'launch' | 'professional' | 'storefront' | 'commerce';
type PaymentPath = 'flexible' | 'spread' | 'allInclusive';

const PLAN_DISPLAY: Record<Tier, { name: string; monthlyFlexible: number; monthlyAllInclusive: number; setupFee: number; features: string[] }> = {
  launch: {
    name: 'Launch',
    monthlyFlexible: 999,
    monthlyAllInclusive: 1699,
    setupFee: 8000,
    features: ['Site-level GEO structure', 'Contact forms', 'Basic static pages', 'Custom domain', 'Email support'],
  },
  professional: {
    name: 'Professional',
    monthlyFlexible: 1999,
    monthlyAllInclusive: 2999,
    setupFee: 10000,
    features: ['Page-level GEO structure', 'Articles & FAQs', 'Service/practitioner pages', 'Custom domain', 'Priority email support'],
  },
  storefront: {
    name: 'Storefront',
    monthlyFlexible: 2999,
    monthlyAllInclusive: 4199,
    setupFee: 12000,
    features: ['Page-level GEO structure', 'Limited ecommerce (max 50)', 'Cart & checkout', 'Payment gateways', 'Priority SLA support'],
  },
  commerce: {
    name: 'Commerce',
    monthlyFlexible: 4500,
    monthlyAllInclusive: 5750,
    setupFee: 15000,
    features: ['Deep entity AI schema', 'Full ecommerce capabilities', 'Product intelligence', 'Unlimited products', 'Priority SLA support'],
  },
};

const PATH_DISPLAY: Record<PaymentPath, { label: string; sublabel: string }> = {
  flexible:     { label: 'Flexible Start',  sublabel: 'Setup fee + low monthly' },
  spread:       { label: 'Spread Start',    sublabel: 'Setup split over 6 months' },
  allInclusive: { label: 'All-Inclusive',   sublabel: 'No setup fee · 12 months' },
};

function getMonthlyDisplay(tier: Tier, path: PaymentPath): number {
  const p = PLAN_DISPLAY[tier];
  if (path === 'flexible') return p.monthlyFlexible;
  if (path === 'spread') return Math.round(p.monthlyFlexible + p.setupFee / 6);
  return p.monthlyAllInclusive;
}

function getFirstChargeDisplay(tier: Tier, path: PaymentPath): { amount: number; label: string } {
  const p = PLAN_DISPLAY[tier];
  if (path === 'flexible') return { amount: p.setupFee, label: 'Setup fee (one-time)' };
  if (path === 'spread') return { amount: Math.round(p.monthlyFlexible + p.setupFee / 6), label: 'First month (includes setup spread)' };
  return { amount: p.monthlyAllInclusive, label: 'First month' };
}

// ── Form component ────────────────────────────────────────────────────────────

function CheckoutForm() {
  const searchParams = useSearchParams();
  const rawTier = searchParams.get('tier') as Tier | null;
  const rawPath = searchParams.get('path') as PaymentPath | null;

  // If no valid tier is provided, redirect to pricing so the user
  // can consciously choose their plan rather than silently landing
  // on a pre-selected Professional tier.
  const hasValidTier = rawTier && PLAN_DISPLAY[rawTier];
  if (!hasValidTier) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '420px' }}>
          <h2 style={{ fontFamily: 'var(--m-font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--m-text)', margin: '0 0 12px' }}>
            Choose your plan first
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--m-text-muted)', lineHeight: 1.7, marginBottom: '28px' }}>
            Head over to our pricing page to select the tier and payment path that fits your business.
          </p>
          <Link href="/pricing" className="m-btn m-btn-primary m-btn-lg">
            View Pricing
            <ArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />
          </Link>
        </div>
      </div>
    );
  }

  const tier: Tier = rawTier as Tier;
  const path: PaymentPath = rawPath && PATH_DISPLAY[rawPath] ? rawPath : 'flexible';

  const plan = PLAN_DISPLAY[tier];
  const pathInfo = PATH_DISPLAY[path];
  const monthly = getMonthlyDisplay(tier, path);
  const firstCharge = getFirstChargeDisplay(tier, path);

  const [form, setForm] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.businessName.trim() || !form.contactName.trim() || !form.email.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const engineUrl =
        process.env.NEXT_PUBLIC_CHAMELEON_ENGINE_URL ??
        'https://chameleon-engine-production.up.railway.app';

      const res = await fetch(`${engineUrl}/api/billing/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier,
          path,
          businessName: form.businessName.trim(),
          contactName: form.contactName.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        setLoading(false);
        return;
      }

      // Redirect to Paystack — page leave, don't reset loading state
      window.location.href = data.paymentUrl;
    } catch {
      setError('Network error. Please check your connection and try again.');
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--m-bg)',
        color: 'var(--m-text)',
        fontFamily: 'var(--m-font-body)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <header
        style={{
          borderBottom: '1px solid var(--m-border)',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <Link
          href="/pricing"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--m-text-muted)',
            textDecoration: 'none',
            fontSize: '0.875rem',
            transition: 'color 0.15s',
          }}
        >
          <ArrowLeft size={16} />
          Back to Pricing
        </Link>
      </header>

      {/* Main */}
      <main
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 400px',
          maxWidth: '960px',
          margin: '0 auto',
          width: '100%',
          gap: '48px',
          padding: '48px 24px',
          alignItems: 'start',
        }}
      >
        {/* Left — Form */}
        <div>
          <h1
            style={{
              fontFamily: 'var(--m-font-display)',
              fontSize: '1.75rem',
              fontWeight: 700,
              color: 'var(--m-text)',
              marginBottom: '8px',
            }}
          >
            Complete your signup
          </h1>
          <p style={{ color: 'var(--m-text-muted)', marginBottom: '32px', fontSize: '0.9rem' }}>
            You'll be redirected to Paystack to enter your card details securely.
          </p>

          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <FormField
              label="Business name"
              name="businessName"
              value={form.businessName}
              onChange={handleChange}
              placeholder="Acme Digital"
              required
            />
            <FormField
              label="Your name"
              name="contactName"
              value={form.contactName}
              onChange={handleChange}
              placeholder="Jane Smith"
              required
            />
            <FormField
              label="Email address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="jane@acme.co.za"
              required
            />
            <FormField
              label="Phone number"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="+27 82 000 0000"
            />

            {error && (
              <div
                role="alert"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '14px',
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  borderRadius: '8px',
                  color: '#fca5a5',
                  fontSize: '0.875rem',
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                {error}
              </div>
            )}

            <button
              id="checkout-submit"
              type="submit"
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '14px 24px',
                borderRadius: '8px',
                border: 'none',
                background: loading
                  ? 'rgba(59,130,246,0.5)'
                  : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.2s',
                boxShadow: loading ? 'none' : '0 4px 16px rgba(59,130,246,0.35)',
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  Redirecting to payment…
                </>
              ) : (
                `Pay R${firstCharge.amount.toLocaleString()} to get started`
              )}
            </button>

            <p style={{ fontSize: '0.75rem', color: 'var(--m-text-faint)', textAlign: 'center', lineHeight: 1.6 }}>
              Secured by Paystack. Your card details are never stored by Chameleon.
              By continuing, you agree to our{' '}
              <Link href="/legal/terms" style={{ color: 'var(--m-text-muted)' }}>Terms of Service</Link>.
            </p>
          </form>
        </div>

        {/* Right — Order Summary */}
        <div
          style={{
            background: 'var(--m-bg-elevated)',
            border: '1px solid var(--m-border)',
            borderRadius: '12px',
            padding: '28px',
            position: 'sticky',
            top: '24px',
          }}
        >
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--m-text)', marginBottom: '20px' }}>
            Order Summary
          </h2>

          <div style={{ marginBottom: '20px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '4px',
              }}
            >
              <span
                style={{
                  background: 'rgba(59,130,246,0.15)',
                  color: '#60a5fa',
                  padding: '2px 10px',
                  borderRadius: '100px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                {plan.name}
              </span>
              <span style={{ color: 'var(--m-text-muted)', fontSize: '0.8rem' }}>
                {pathInfo.label}
              </span>
            </div>
            <p style={{ color: 'var(--m-text-faint)', fontSize: '0.8rem' }}>{pathInfo.sublabel}</p>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
            {plan.features.map((f) => (
              <li
                key={f}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  marginBottom: '10px',
                  fontSize: '0.85rem',
                  color: 'var(--m-text-muted)',
                }}
              >
                <Check size={14} style={{ color: '#60a5fa', marginTop: '2px', flexShrink: 0 }} />
                {f}
              </li>
            ))}
          </ul>

          <div
            style={{
              borderTop: '1px solid var(--m-border)',
              paddingTop: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <LineItem label={firstCharge.label} value={`R${firstCharge.amount.toLocaleString()}`} bold />
            <LineItem
              label="Monthly thereafter"
              value={`R${monthly.toLocaleString()}/mo`}
            />
          </div>
        </div>
      </main>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        @media (max-width: 720px) {
          main { grid-template-columns: 1fr !important; }
          .order-summary { position: static !important; }
        }
      `}</style>
    </div>
  );
}

function FormField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label
        htmlFor={`field-${name}`}
        style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--m-text-muted)' }}
      >
        {label}
        {required && <span style={{ color: '#60a5fa', marginLeft: '2px' }}>*</span>}
      </label>
      <input
        id={`field-${name}`}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={name === 'email' ? 'email' : name === 'phone' ? 'tel' : 'on'}
        required={required}
        style={{
          padding: '12px 14px',
          borderRadius: '8px',
          border: '1px solid var(--m-border)',
          background: 'var(--m-bg-elevated)',
          color: 'var(--m-text)',
          fontSize: '0.95rem',
          outline: 'none',
          transition: 'border-color 0.15s',
          fontFamily: 'var(--m-font-body)',
        }}
        onFocus={(e) => { e.target.style.borderColor = 'var(--m-accent)'; }}
        onBlur={(e) => { e.target.style.borderColor = 'var(--m-border)'; }}
      />
    </div>
  );
}

function LineItem({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--m-text-muted)' }}>{label}</span>
      <span
        style={{
          fontSize: bold ? '1.1rem' : '0.9rem',
          fontWeight: bold ? 700 : 400,
          color: bold ? 'var(--m-text)' : 'var(--m-text-muted)',
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ── Page export ───────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--m-bg)',
          }}
        >
          <Loader2 size={32} style={{ color: 'var(--m-text-muted)', animation: 'spin 1s linear infinite' }} />
        </div>
      }
    >
      <CheckoutForm />
    </Suspense>
  );
}
