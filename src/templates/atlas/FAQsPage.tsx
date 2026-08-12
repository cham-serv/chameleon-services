import type { PageProps } from '@/lib/types';

export default function FAQsPage({ config, variant }: PageProps) {
  return (
    <section style={{ padding: '4rem 1.5rem' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <span style={{
          fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em',
          textTransform: 'uppercase' as const, color: 'var(--brand-secondary, #00E5FF)',
        }}>
          Atlas · FAQs · {variant}
        </span>
        <h1 style={{
          fontSize: '2.5rem', fontWeight: 700, marginTop: '0.5rem',
          color: 'var(--brand-primary, #0B132B)',
          fontFamily: 'var(--font-heading, inherit)',
        }}>
          Frequently Asked Questions
        </h1>
        <p style={{ color: 'var(--brand-text, #555)', marginTop: '1rem', lineHeight: 1.7 }}>
          Atlas FAQsPage stub — <strong>{variant}</strong> variant.
          Phase 4: accordion FAQ component with search and categories.
        </p>
      </div>
    </section>
  );
}
