/**
 * Nova Template Layout — Header, Nav, Footer
 *
 * Clean, confident layout for sole traders and artisans.
 * Key features:
 * - Glassmorphic sticky header with backdrop blur
 * - Dynamic offerings label in navigation
 * - Mobile hamburger menu (client component)
 * - Social links in footer
 */

import './nova.css';
import type { LayoutProps } from '@/lib/types';
import { NovaNavClient } from './NovaNavClient';

export default function NovaLayout({ config, children }: LayoutProps) {
  const siteName = config.settings?.siteName ?? config.tenant.name;
  const contactEmail = config.settings?.contactEmail ?? '';
  const contactPhone = config.settings?.contactPhone ?? '';
  const pc = config.pageConfig as any;

  // Build nav links from feature config
  const fc = config.tenant.featureConfig;
  const offeringsSlug = pc?.offeringsSlug ?? 'services';
  const offeringsLabel = pc?.offeringsLabel ?? 'Services';
  const colourScheme = pc?.colourScheme ?? 'light';

  const navLinks: { href: string; label: string }[] = [
    { href: '/', label: 'Home' },
  ];

  if (fc.about?.enabled) navLinks.push({ href: '/about', label: 'About' });
  if (fc.offerings?.enabled) navLinks.push({ href: `/${offeringsSlug}`, label: offeringsLabel });
  if (fc.faqs?.enabled) navLinks.push({ href: '/faqs', label: 'FAQs' });
  if (fc.contact?.enabled) navLinks.push({ href: '/contact', label: 'Contact' });

  // Social links
  const socials: { platform: string; url: string }[] = [];
  if (config.settings?.socialFacebook) socials.push({ platform: 'Facebook', url: config.settings.socialFacebook });
  if (config.settings?.socialInstagram) socials.push({ platform: 'Instagram', url: config.settings.socialInstagram });
  if (config.settings?.socialLinkedIn) socials.push({ platform: 'LinkedIn', url: config.settings.socialLinkedIn });

  // Logo
  const logoUrl = config.settings?.logo?.url ?? config.settings?.logoMark?.url ?? null;

  return (
    <div data-template="nova" data-scheme={colourScheme}>
      {/* ── Header ──────────────────────────────────────── */}
      <header className="nova-header">
        <div className="nova-header__inner">
          <a href="/" className="nova-header__logo">
            {logoUrl
              ? <img src={logoUrl} alt={siteName} />
              : siteName
            }
          </a>

          {/* Desktop nav (hidden on mobile via CSS) */}
          <nav className="nova-header__nav">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="nova-header__link">
                {link.label}
              </a>
            ))}
          </nav>

          {/* Mobile hamburger + slide-out (client component) */}
          <NovaNavClient navLinks={navLinks} />
        </div>
      </header>

      {/* ── Main Content ────────────────────────────────── */}
      <main style={{ minHeight: '60vh' }}>
        {children}
      </main>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="nova-footer">
        <div className="nova-footer__inner">
          <div>
            <div className="nova-footer__brand">{siteName}</div>
            {contactEmail && (
              <div className="nova-footer__meta">{contactEmail}</div>
            )}
            {contactPhone && (
              <div className="nova-footer__meta">{contactPhone}</div>
            )}
          </div>

          {socials.length > 0 && (
            <div className="nova-footer__links">
              {socials.map((s) => (
                <a
                  key={s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nova-footer__link"
                >
                  {s.platform}
                </a>
              ))}
            </div>
          )}

          <div className="nova-footer__copy">
            © {new Date().getFullYear()} {siteName}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
