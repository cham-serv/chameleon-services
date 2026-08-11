/**
 * Tenant not-found page — shown when:
 * - The domain doesn't resolve to any tenant in the database
 * - A tenant page/path doesn't exist
 */
export default function TenantNotFound() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        fontFamily: 'var(--font-body, system-ui, sans-serif)',
        color: 'var(--brand-text, #1A1A2E)',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h1
          style={{
            fontSize: '3rem',
            fontWeight: 700,
            marginBottom: '0.5rem',
            fontFamily: 'var(--font-heading, system-ui, sans-serif)',
          }}
        >
          404
        </h1>
        <p style={{ fontSize: '1.125rem', color: 'var(--brand-muted, #6B7280)' }}>
          This page could not be found.
        </p>
        <a
          href="/"
          style={{
            display: 'inline-block',
            marginTop: '1.5rem',
            padding: '0.75rem 1.5rem',
            background: 'var(--brand-accent, #0F3460)',
            color: '#FFFFFF',
            borderRadius: 'var(--radius, 0.5rem)',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
