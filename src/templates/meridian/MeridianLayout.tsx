/**
 * Meridian Template Layout - Header, Nav, Footer
 *
 * Clean, authority-driven design for professional services.
 * Stub implementation - full design in Phase 4.
 */

import type { LayoutProps } from '@/lib/types';

export default function MeridianLayout({ config, children }: LayoutProps) {
  const siteName = config.settings?.siteName ?? config.tenant.name;
  const contactEmail = config.settings?.contactEmail ?? '';

  const navLinks: { href: string; label: string }[] = [
    { href: '/', label: 'Home' },
  ];

  const fc = config.tenant.featureConfig;
  if (fc.about?.enabled) navLinks.push({ href: '/about', label: 'About' });
  if (fc.services?.enabled) navLinks.push({ href: '/services', label: 'Services' });
  if (fc.blog?.enabled) navLinks.push({ href: '/blog', label: 'Blog' });
  if (fc.resources?.enabled) navLinks.push({ href: '/resources', label: 'Resources' });
  if (fc.faqs?.enabled) navLinks.push({ href: '/faqs', label: 'FAQs' });
  if (fc.contact?.enabled) navLinks.push({ href: '/contact', label: 'Contact' });

  return (
    <>
      {/* - Header - */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--brand-background, #ffffff)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        padding: '0 1.5rem',
      }}>
        <div style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 60,
        }}>
          <a href="/" style={{
            fontWeight: 600,
            fontSize: '1.125rem',
            color: 'var(--brand-primary, #1a1a2e)',
            textDecoration: 'none',
            fontFamily: 'var(--font-heading, inherit)',
            letterSpacing: '-0.01em',
          }}>
            {siteName}
          </a>

          <nav style={{ display: 'flex', gap: '1.75rem' }}>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  color: 'var(--brand-text, #555)',
                  textDecoration: 'none',
                  letterSpacing: '0.01em',
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* - Main Content - */}
      <main style={{ minHeight: '60vh' }}>
        {children}
      </main>

      {/* - Footer - */}
      <footer style={{
        background: 'var(--brand-primary, #1a1a2e)',
        color: 'rgba(255,255,255,0.65)',
        padding: '2.5rem 1.5rem',
        marginTop: '4rem',
      }}>
        <div style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <div style={{
              fontWeight: 600,
              color: '#fff',
              marginBottom: '0.25rem',
              fontFamily: 'var(--font-heading, inherit)',
            }}>
              {siteName}
            </div>
            {contactEmail && (
              <div style={{ fontSize: '0.8125rem' }}>{contactEmail}</div>
            )}
          </div>
          <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>
             {new Date().getFullYear()} {siteName}
          </div>
        </div>
      </footer>
    </>
  );
}
