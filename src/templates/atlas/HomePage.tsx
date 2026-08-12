import { Suspense } from 'react';
import type { PageProps } from '@/lib/types';

export default function HomePage({ config, variant }: PageProps) {
  const siteName = config.settings?.siteName ?? config.tenant.name;

  return (
    <section style={{ padding: '4rem 1.5rem' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <span style={{
          fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em',
          textTransform: 'uppercase' as const, color: 'var(--brand-secondary, #00E5FF)',
        }}>
          Atlas · Home · {variant}
        </span>
        <h1 style={{
          fontSize: '2.75rem', fontWeight: 700, marginTop: '0.5rem',
          color: 'var(--brand-primary, #0B132B)',
          fontFamily: 'var(--font-heading, inherit)',
          lineHeight: 1.15,
        }}>
          Welcome to {siteName}
        </h1>
        <p style={{
          color: 'var(--brand-text, #555)', marginTop: '1rem',
          lineHeight: 1.7, fontSize: '1.125rem',
        }}>
          This is the Atlas HomePage stub rendering the <strong>{variant}</strong> variant.
          In Phase 4, this will feature a full hero section, featured products, and dynamic content.
        </p>
        <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>Loading content...</div>}>
          <div style={{
            marginTop: '2rem', padding: '3rem',
            background: 'var(--brand-surface, #f8f9fa)',
            borderRadius: '0.75rem', textAlign: 'center',
            border: '1px dashed var(--brand-primary, #0B132B)',
            opacity: 0.4,
          }}>
            Hero Section Placeholder — {variant}
          </div>
        </Suspense>
      </div>
    </section>
  );
}
