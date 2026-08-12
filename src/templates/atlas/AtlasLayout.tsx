/**
 * Atlas Template Layout — Header, Nav, Footer
 *
 * Server Component. Wraps all Atlas page content with the template's
 * visual chrome. Uses CSS custom properties injected by the tenant layout.
 *
 * Stub implementation — renders basic header/footer to prove the
 * template pipeline works end-to-end. Full implementation in Phase 4.
 */

import type { LayoutProps } from '@/lib/types';

export default function AtlasLayout({ config, children }: LayoutProps) {
  const siteName = config.settings?.siteName ?? config.tenant.name;
  const contactEmail = config.settings?.contactEmail ?? '';

  // Build nav links from enabled features
  const navLinks: { href: string; label: string }[] = [
    { href: '/', label: 'Home' },
  ];

  const fc = config.tenant.featureConfig;
  if (fc.about?.enabled) navLinks.push({ href: '/about', label: 'About' });
  if (fc.shop?.enabled) navLinks.push({ href: '/shop', label: 'Shop' });
  if (fc.resources?.enabled) navLinks.push({ href: '/resources', label: 'Resources' });
  if (fc.faqs?.enabled) navLinks.push({ href: '/faqs', label: 'FAQs' });
  if (fc.contact?.enabled) navLinks.push({ href: '/contact', label: 'Contact' });

  return (
    <>
      {/* ── Header ─────────────────────────────────────────────── */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--brand-background, #ffffff)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        padding: '0 1.5rem',
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 64,
        }}>
          <a href="/" style={{
            fontWeight: 700,
            fontSize: '1.25rem',
            color: 'var(--brand-primary, #0B132B)',
            textDecoration: 'none',
            fontFamily: 'var(--font-heading, inherit)',
          }}>
            {siteName}
          </a>

          <nav style={{ display: 'flex', gap: '1.5rem' }}>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'var(--brand-text, #333)',
                  textDecoration: 'none',
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* ── Main Content ───────────────────────────────────────── */}
      <main style={{ minHeight: '60vh' }}>
        {children}
      </main>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer style={{
        background: 'var(--brand-primary, #0B132B)',
        color: 'rgba(255,255,255,0.7)',
        padding: '3rem 1.5rem',
        marginTop: '4rem',
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <div style={{
              fontWeight: 700,
              color: '#fff',
              marginBottom: '0.25rem',
              fontFamily: 'var(--font-heading, inherit)',
            }}>
              {siteName}
            </div>
            {contactEmail && (
              <div style={{ fontSize: '0.875rem' }}>{contactEmail}</div>
            )}
          </div>
          <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>
            © {new Date().getFullYear()} {siteName}. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
