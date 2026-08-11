/**
 * Global not-found page — catches 404s for routes that don't match
 * either the (marketing) or (tenant) route groups.
 */
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          fontFamily: 'system-ui, sans-serif',
          background: '#FAFAFA',
          color: '#1A1A2E',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            404
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#6B7280' }}>
            This page could not be found.
          </p>
          <a
            href="/"
            style={{
              display: 'inline-block',
              marginTop: '1.5rem',
              padding: '0.75rem 1.5rem',
              background: '#1A1A2E',
              color: '#FFFFFF',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            Go Home
          </a>
        </div>
      </body>
    </html>
  );
}
