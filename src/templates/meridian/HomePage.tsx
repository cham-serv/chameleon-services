import { Suspense } from 'react';
import type { PageProps } from '@/lib/types';

export default function HomePage({ config, variant }: PageProps) {
  const siteName = config.settings?.siteName ?? config.tenant.name;

  return (
    <section style={{ padding: '4rem 1.5rem' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <span style={{
          fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em',
          textTransform: 'uppercase' as const, color: 'var(--brand-secondary, #6C63FF)',
        }}>
          Meridian  Home  {variant}
        </span>
        <h1 style={{
          fontSize: '2.75rem', fontWeight: 700, marginTop: '0.5rem',
          color: 'var(--brand-primary, #1a1a2e)',
          fontFamily: 'var(--font-heading, inherit)', lineHeight: 1.15,
        }}>
          Welcome to {siteName}
        </h1>
        <p style={{ color: 'var(--brand-text, #555)', marginTop: '1rem', lineHeight: 1.7, fontSize: '1.125rem' }}>
          Meridian HomePage stub  <strong>{variant}</strong> variant.
          Phase 4: professional hero with service highlights and social proof.
        </p>
        <Suspense fallback={null}>
          <div style={{
            marginTop: '2rem', padding: '3rem',
            background: 'var(--brand-surface, #f8f9fa)',
            borderRadius: '0.75rem', textAlign: 'center',
            border: '1px dashed var(--brand-primary, #1a1a2e)', opacity: 0.4,
          }}>
            {variant === 'split-hero' ? 'Split Hero Layout' : 'Full-Width Hero'} Placeholder
          </div>
        </Suspense>
      </div>
    </section>
  );
}
