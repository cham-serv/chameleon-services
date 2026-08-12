import { Suspense } from 'react';
import type { PageProps } from '@/lib/types';

export default function ShopPage({ config, variant }: PageProps) {
  return (
    <section style={{ padding: '4rem 1.5rem' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <span style={{
          fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em',
          textTransform: 'uppercase' as const, color: 'var(--brand-secondary, #00E5FF)',
        }}>
          Atlas · Shop · {variant}
        </span>
        <h1 style={{
          fontSize: '2.5rem', fontWeight: 700, marginTop: '0.5rem',
          color: 'var(--brand-primary, #0B132B)',
          fontFamily: 'var(--font-heading, inherit)',
        }}>
          Shop
        </h1>
        <p style={{ color: 'var(--brand-text, #555)', marginTop: '1rem', lineHeight: 1.7 }}>
          Atlas ShopPage stub — <strong>{variant}</strong> variant.
          Phase 4: product grid with filters, sorting, and category navigation.
        </p>
        <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>Loading products...</div>}>
          <div style={{
            marginTop: '2rem', padding: '3rem',
            background: 'var(--brand-surface, #f8f9fa)',
            borderRadius: '0.75rem', textAlign: 'center',
            border: '1px dashed var(--brand-primary, #0B132B)', opacity: 0.4,
          }}>
            {variant === 'editorial' ? 'Editorial Product Grid' : 'Dense Product Grid'} Placeholder
          </div>
        </Suspense>
      </div>
    </section>
  );
}
