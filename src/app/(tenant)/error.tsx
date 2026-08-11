'use client';

/**
 * Tenant error boundary — catches unhandled errors during rendering
 * or data fetching within the (tenant) route group.
 *
 * This is a Client Component (required by Next.js for error boundaries).
 * It prevents the raw Next.js error screen from appearing in production
 * when something goes wrong (malformed API response, token computation
 * crash, etc.).
 */
export default function TenantError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log the error in development so it's not silently swallowed
  if (process.env.NODE_ENV === 'development') {
    console.error('[tenant] Unhandled error:', error);
  }

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
      <div style={{ textAlign: 'center', maxWidth: '28rem' }}>
        <h1
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: '0.75rem',
            fontFamily: 'var(--font-heading, system-ui, sans-serif)',
          }}
        >
          Something went wrong
        </h1>
        <p
          style={{
            fontSize: '1rem',
            color: 'var(--brand-muted, #6B7280)',
            lineHeight: 1.6,
            marginBottom: '1.5rem',
          }}
        >
          We hit an unexpected error loading this page. Please try again.
        </p>
        <button
          onClick={reset}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'var(--brand-accent, #0F3460)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 'var(--radius, 0.5rem)',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
