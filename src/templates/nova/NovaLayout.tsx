/**
 * Nova Template Layout — Header, Nav, Footer
 *
 * Clean, confident layout for sole traders and artisans.
 * Key features:
 * - Glassmorphic sticky header with backdrop blur
 * - Dynamic offerings label in navigation
 * - Mobile hamburger menu (client component)
 * - Social links in footer
 * - DemoExplorer drawer for demo tenants
 */

import './nova.css';
import '../atlas/demo-explorer.css';
import type { LayoutProps } from '@/lib/types';
import { NovaNavClient } from './NovaNavClient';
import { DemoExplorer } from '../atlas/DemoExplorer';
import { definition } from './definition';
import { buildExplorerRoutes } from '../atlas/demo-explorer-utils';

export default function NovaLayout({ config, children }: LayoutProps) {
  const siteName = config.settings?.siteName ?? config.tenant.name;
  const contactEmail = config.settings?.contactEmail ?? '';
  const contactPhone = config.settings?.contactPhone ?? '';
  const pc = config.pageConfig as any;

  // Build nav links from feature config
  // featureConfig is derived by the engine from pageConfig.pages and arrives as:
  //   { about: { enabled: true }, offerings: { enabled: true }, ... }
  // The isEnabled helper also handles the legacy raw-boolean shape as a safety net.
  const rawFc = config.tenant.featureConfig;
  const isEnabled = (key: string): boolean => {
    // Try direct key first (e.g. 'about' → { enabled: true })
    const direct = rawFc[key];
    if (direct !== undefined) {
      return typeof direct === 'object' ? !!direct.enabled : !!direct;
    }
    // Legacy fallback: suffixed key (e.g. 'aboutEnabled')
    const suffixed = rawFc[`${key}Enabled`];
    if (suffixed !== undefined) {
      return typeof suffixed === 'object' ? !!suffixed.enabled : !!suffixed;
    }
    // Default: enabled (graceful degradation — show pages unless explicitly disabled)
    return true;
  };

  // Build a normalised featureConfig for buildExplorerRoutes.
  // The util checks featureConfig[key]?.enabled, so we must use the canonical
  // key names (without the 'Enabled' suffix that NovaSiteConfig produces).
  const normalisedFc = {
    about:     { enabled: isEnabled('about') },
    offerings: { enabled: isEnabled('offerings') },
    faqs:      { enabled: isEnabled('faqs') },
    contact:   { enabled: isEnabled('contact') },
    legal:     { enabled: isEnabled('legal') },
  };

  // Build explorer routes only for demo tenants
  const explorerRoutes = config.tenant.isDemoTenant
    ? buildExplorerRoutes(definition, normalisedFc)
    : null;

  const offeringsSlug = pc?.offeringsSlug ?? 'services';
  const offeringsLabel = pc?.offeringsLabel ?? 'Services';
  const colourScheme = pc?.colourScheme ?? 'light';

  const navLinks: { href: string; label: string }[] = [
    { href: '/', label: 'Home' },
  ];

  if (isEnabled('about')) navLinks.push({ href: '/about', label: 'About' });
  if (isEnabled('offerings')) navLinks.push({ href: `/${offeringsSlug}`, label: offeringsLabel });
  if (isEnabled('faqs')) navLinks.push({ href: '/faqs', label: 'FAQs' });
  if (isEnabled('contact')) navLinks.push({ href: '/contact', label: 'Contact' });

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

      {/* DemoExplorer — only rendered for demo tenants */}
      {explorerRoutes && <DemoExplorer routes={explorerRoutes} basePath="" />}
    </div>
  );
}
