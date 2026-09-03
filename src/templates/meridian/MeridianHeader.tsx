'use client';

/**
 * MeridianHeader
 *
 * Sticky header with blur-on-scroll effect.
 * Logo + nav links (from featureConfig) + "Get in Touch" CTA.
 * Mobile: hamburger → MeridianMobileNav drawer.
 *
 * transparent prop: starts transparent (for full-hero variant),
 * transitions to solid on scroll.
 */

import { useState, useEffect, useCallback, type ReactNode } from 'react';
import Link from 'next/link';
import type { TenantConfig } from '@/lib/types';
import MeridianMobileNav from './MeridianMobileNav';

type NavLink = { href: string; label: string };

type Props = {
  config: TenantConfig;
  transparent?: boolean;
};

export default function MeridianHeader({ config, transparent = false }: Props) {
  const siteName = config.settings?.siteName ?? config.tenant.name;
  const fc = config.tenant.featureConfig;

  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [mounted, setMounted]         = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 12);
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => { setMounted(true); }, []);

  const navLinks: NavLink[] = [{ href: '/', label: 'Home' }];
  if (fc.about?.enabled)     navLinks.push({ href: '/about',     label: 'About' });
  if (fc.services?.enabled)  navLinks.push({ href: '/services',  label: 'Services' });
  if (fc.team?.enabled)      navLinks.push({ href: '/team',      label: 'Our People' });
  if (fc.blog?.enabled)      navLinks.push({ href: '/blog',      label: 'Insights' });
  if (fc.resources?.enabled) navLinks.push({ href: '/resources', label: 'Resources' });
  if (fc.faqs?.enabled)      navLinks.push({ href: '/faqs',      label: 'FAQs' });

  const logoUrl    = config.pageConfig?.logo?.url ?? config.settings?.logo?.url ?? null;
  const logoAlt    = (config.pageConfig?.logo as { alt?: string } | null)?.alt ?? siteName;
  const ctaLabel   = (config.pageConfig as any)?.homeCta1Text ?? 'Get in Touch';

  const contactEnabled = fc.contact?.enabled;

  return (
    <>
      <header
        className="mer-header"
        data-scrolled={scrolled || undefined}
        data-transparent={(transparent && !scrolled) || undefined}
        data-ready={mounted || undefined}
      >
        <div className="mer-header-inner">
          {/* Logo */}
          <Link href="/" className="mer-header-logo" aria-label={siteName}>
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt={logoAlt}
                className="mer-header-logo-img"
                width={180}
                height={48}
                // eslint-disable-next-line react/no-unknown-property
                fetchPriority="high"
              />
            ) : (
              <span className="mer-header-logo-text">{siteName}</span>
            )}
          </Link>

          {/* Desktop nav */}
          <nav className="mer-header-nav" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="mer-header-actions">
            {contactEnabled && (
              <Link
                href="/contact"
                className="mer-btn mer-btn-primary mer-btn-sm mer-header-cta"
              >
                {ctaLabel}
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              className="mer-hamburger"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls="mer-mobile-nav"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6"  x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav drawer — rendered outside header to avoid stacking context issues */}
      <MeridianMobileNav
        config={config}
        navLinks={navLinks}
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
}
