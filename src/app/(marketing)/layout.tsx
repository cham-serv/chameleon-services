import type { Metadata } from 'next';
import Link from 'next/link';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'Chameleon Services | The Next-Gen Storefront Platform',
  description:
    'High-performance, AI-optimised ecommerce templates for serious merchants.',
};

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          background: 'var(--mkt-bg, #FAFAFA)',
          color: 'var(--mkt-text, #1A1A2E)',
        }}
      >
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 2rem',
            borderBottom: '1px solid #E5E7EB',
          }}
        >
          <Link
            href="/"
            style={{ fontWeight: 700, fontSize: '1.125rem', letterSpacing: '-0.02em' }}
          >
            Chameleon Services
          </Link>
          {/* Nav links will be added in Batch 5 when pages exist */}
        </header>

        <main>{children}</main>

        <footer
          style={{
            padding: '2rem',
            textAlign: 'center',
            fontSize: '0.875rem',
            color: '#6B7280',
            borderTop: '1px solid #E5E7EB',
          }}
        >
          &copy; {new Date().getFullYear()} Chameleon Services. All rights
          reserved.
        </footer>
      </body>
    </html>
  );
}
