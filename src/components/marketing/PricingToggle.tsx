'use client';

import { useState } from 'react';

type PricingToggleProps = {
  onChange: (billing: 'monthly' | 'annual') => void;
  value: 'monthly' | 'annual';
};

export function PricingToggle({ onChange, value }: PricingToggleProps) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        padding: '4px',
        background: 'rgba(255,255,255,0.04)',
        borderRadius: '999px',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
      role="group"
      aria-label="Billing period"
    >
      <button
        type="button"
        onClick={() => onChange('monthly')}
        style={{
          padding: '7px 20px',
          borderRadius: '999px',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: '0.875rem',
          fontWeight: 600,
          transition: 'all 0.2s',
          background: value === 'monthly' ? '#3b82f6' : 'transparent',
          color: value === 'monthly' ? '#fff' : '#8b949e',
        }}
        aria-pressed={value === 'monthly'}
      >
        Monthly
      </button>
      <button
        type="button"
        onClick={() => onChange('annual')}
        style={{
          padding: '7px 20px',
          borderRadius: '999px',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: '0.875rem',
          fontWeight: 600,
          transition: 'all 0.2s',
          background: value === 'annual' ? '#3b82f6' : 'transparent',
          color: value === 'annual' ? '#fff' : '#8b949e',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
        aria-pressed={value === 'annual'}
      >
        Annual
        <span
          style={{
            fontSize: '0.7rem',
            padding: '2px 7px',
            borderRadius: '999px',
            background: 'rgba(34,197,94,0.15)',
            color: '#22c55e',
            fontWeight: 700,
            letterSpacing: '0.03em',
          }}
        >
          Save 20%
        </span>
      </button>
    </div>
  );
}

// ── Pricing page wrapper that manages toggle state ───────────────────────────

type PricingTier = {
  name: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  description: string;
  features: string[];
  cta: string;
  ctaHref: string;
  highlighted?: boolean;
};

type PricingCardsProps = {
  tiers: PricingTier[];
};

export function PricingCards({ tiers }: PricingCardsProps) {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');

  return (
    <div>
      {/* Toggle */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '48px' }}>
        <PricingToggle value={billing} onChange={setBilling} />
      </div>

      {/* Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          alignItems: 'stretch',
        }}
      >
        {tiers.map((tier) => {
          const price =
            billing === 'annual' && tier.annualPrice != null
              ? tier.annualPrice
              : tier.monthlyPrice;

          return (
            <div
              key={tier.name}
              style={{
                padding: '32px',
                borderRadius: '16px',
                border: tier.highlighted
                  ? '1px solid rgba(59,130,246,0.5)'
                  : '1px solid rgba(255,255,255,0.08)',
                background: tier.highlighted
                  ? 'rgba(59,130,246,0.08)'
                  : 'rgba(255,255,255,0.04)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                backdropFilter: 'blur(12px)',
                boxShadow: tier.highlighted ? '0 0 40px rgba(59,130,246,0.15)' : 'none',
              }}
            >
              {/* Popular badge */}
              {tier.highlighted && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-1px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#3b82f6',
                    color: '#fff',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '4px 14px',
                    borderRadius: '0 0 8px 8px',
                  }}
                >
                  Most Popular
                </div>
              )}

              {/* Tier name */}
              <div
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: tier.highlighted ? '#60a5fa' : '#8b949e',
                  marginBottom: '8px',
                }}
              >
                {tier.name}
              </div>

              {/* Price */}
              <div style={{ marginBottom: '4px' }}>
                {price != null ? (
                  <>
                    <span style={{ fontSize: '2.5rem', fontWeight: 700, color: '#f0f6fc' }}>
                      R{price.toLocaleString()}
                    </span>
                    <span style={{ fontSize: '0.9rem', color: '#8b949e', marginLeft: '4px' }}>
                      /mo
                    </span>
                  </>
                ) : (
                  <span style={{ fontSize: '2rem', fontWeight: 700, color: '#f0f6fc' }}>
                    Custom
                  </span>
                )}
              </div>

              {billing === 'annual' && price != null && (
                <div style={{ fontSize: '0.8rem', color: '#22c55e', marginBottom: '4px' }}>
                  Billed annually
                </div>
              )}

              {/* Description */}
              <p
                style={{
                  fontSize: '0.875rem',
                  color: '#8b949e',
                  marginBlock: '16px',
                  lineHeight: 1.5,
                }}
              >
                {tier.description}
              </p>

              {/* Divider */}
              <div
                style={{
                  height: '1px',
                  background: 'rgba(255,255,255,0.08)',
                  marginBottom: '20px',
                }}
              />

              {/* Features */}
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', flex: 1 }}>
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      fontSize: '0.875rem',
                      color: '#f0f6fc',
                      marginBottom: '10px',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginTop: '2px', flexShrink: 0 }}>
                      <circle cx="8" cy="8" r="7" fill="rgba(59,130,246,0.15)" />
                      <path d="M5 8l2 2 4-4" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href={tier.ctaHref}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '11px 24px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  background: tier.highlighted ? '#3b82f6' : 'transparent',
                  color: tier.highlighted ? '#fff' : '#f0f6fc',
                  border: tier.highlighted ? 'none' : '1px solid rgba(255,255,255,0.15)',
                }}
                id={`pricing-cta-${tier.name.toLowerCase()}`}
              >
                {tier.cta}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
