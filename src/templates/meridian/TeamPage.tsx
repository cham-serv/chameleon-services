/**
 * TeamPage — Meridian Our People page
 *
 * Variants: grid | portfolio | department-sections | list
 *
 * Phase 6 implementation target. This stub renders a working
 * placeholder so the route resolves and the site builds cleanly.
 */

import type { PageProps } from '@/lib/types';

export default function TeamPage({ variant }: PageProps) {
  return (
    <main style={{ padding: '4rem 2rem', textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'var(--meridian-font-heading, inherit)', marginBottom: '1rem' }}>
        Our People
      </h1>
      <p style={{ color: 'var(--meridian-text-muted, #666)' }}>
        Team page — <strong>{variant}</strong> variant. Coming in Phase 6.
      </p>
    </main>
  );
}
