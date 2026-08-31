import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import { ChameleonLogo } from '@/components/marketing/ChameleonLogo';
import Link from 'next/link';
import './marketing.css';
import { MarketingNav } from '@/components/marketing/MarketingNav';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: {
    default: 'Chameleon | The AI-Ready Storefront Platform',
    template: '%s | Chameleon',
  },
  description:
    'AI search has rewritten the rules. Chameleon builds high-performance, GEO-optimised storefronts that get found by AI and humans alike — with hosting, maintenance, and SEO all included.',
  keywords: [
    'AI-ready website',
    'GEO optimised',
    'generative engine optimisation',
    'ecommerce platform',
    'AI SEO',
    'storefront platform',
    'Chameleon',
  ],
  authors: [{ name: 'Chameleon' }],
  creator: 'Chameleon',
  metadataBase: new URL('https://chameleon.services'),
  icons: {
    icon: '/logo-icon.webp',
    shortcut: '/logo-icon.webp',
    apple: '/logo-icon.webp',
  },
  openGraph: {
    type: 'website',
    locale: 'en',
    url: 'https://chameleon.services',
    siteName: 'Chameleon',
    title: 'Chameleon | The AI-Ready Storefront Platform',
    description:
      'AI search has rewritten the rules. Chameleon builds high-performance, GEO-optimised storefronts that get found by AI and humans alike — with hosting, maintenance, and SEO all included.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Chameleon — The AI-Ready Storefront Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chameleon | The AI-Ready Storefront Platform',
    description: 'AI search has rewritten the rules. Get a GEO-optimised, high-performance storefront with hosting, maintenance, and SEO built in.',
    images: ['/og-image.jpg'],
  },
  robots: { index: true, follow: true },
};

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Chameleon',
  url: 'https://chameleon.services',
  description:
    'Chameleon builds AI-ready, GEO-optimised authority engines and ecommerce stores for South African businesses and agencies.',
  areaServed: 'ZA',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'chris@chameleon.services',
    contactType: 'customer service',
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-ZA" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(orgJsonLd).replace(/</g, '\\u003c'),
          }}
        />
      </head>
      <body>
        <div className="marketing-root">
          <a href="#main-content" className="m-skip-link">
            Skip to content
          </a>
          <MarketingNav />
          <main id="main-content">{children}</main>
          <MarketingFooter />
        </div>
      </body>
    </html>
  );
}

// - Footer -

function MarketingFooter() {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: '48px 0 32px',
        marginTop: '0',
      }}
    >
      <div className="m-container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '32px',
            alignItems: 'flex-start',
            marginBottom: '40px',
          }}
        >
          {/* Brand */}
          <div>
            <Link href="/" aria-label="Chameleon home">
              <ChameleonLogo size={42} />
            </Link>
            <p
              style={{
                marginTop: '12px',
                fontSize: '0.875rem',
                color: 'var(--m-text-muted)',
                maxWidth: '320px',
                lineHeight: 1.6,
              }}
            >
              Search has changed. We help South African businesses adapt to
              the new era of AI-powered search - beautifully and affordably.
            </p>
          </div>

          {/* Nav columns */}
          <div style={{ display: 'flex', gap: '48px' }}>
            <FooterCol
              title="Product"
              links={[
                { label: 'Why Chameleon', href: '/why-chameleon' },
                { label: 'Templates', href: '/templates' },
                { label: 'Pricing', href: '/pricing' },
                { label: 'Agencies', href: '/agencies' },
              ]}
            />
            <FooterCol
              title="Company"
              links={[
                { label: 'Contact', href: '/contact' },
              ]}
            />
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            color: 'var(--m-text-faint)',
          }}
        >
          <span> 2026 Chameleon. South Africa </span>
          <span>Built for businesses that refuse to fall behind.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <div
        style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'var(--m-text-muted)',
          marginBottom: '12px',
        }}
      >
        {title}
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {links.map((link) => (
          <li key={link.href} style={{ marginBottom: '8px' }}>
            <Link
              href={link.href}
              style={{
                fontSize: '0.875rem',
                color: 'var(--m-text-muted)',
                textDecoration: 'none',
                transition: 'color 0.15s',
              }}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
