/**
 * TeamMemberPage — Meridian individual profile page
 *
 * Route: /team/[slug]
 *
 * Phase 6 implementation target. This stub renders a working
 * placeholder so the route resolves and the site builds cleanly.
 */

import type { PageProps } from '@/lib/types';

export default function TeamMemberPage({ path }: PageProps) {
  const slug = path[path.length - 1] ?? '';

  return (
    <main style={{ padding: '4rem 2rem', textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'var(--meridian-font-heading, inherit)', marginBottom: '1rem' }}>
        Team Member Profile
      </h1>
      <p style={{ color: 'var(--meridian-text-muted, #666)' }}>
        Profile page for <strong>{slug}</strong>. Coming in Phase 6.
      </p>
    </main>
  );
}
