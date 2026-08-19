'use client';

/**
 * AtlasHeader  Client Component
 *
 * Sticky header with scroll-aware background, dynamic nav links,
 * cart badge, and mobile hamburger. Uses next/link for SPA transitions.
 */

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import type { TenantConfig } from '@/lib/types';
import { useCartStore } from '@/stores/cart';

type Props = {
  config: TenantConfig;
  onOpenMobileNav: () => void;
  onOpenCart: () => void;
  /** When true, header starts transparent (for full-bleed hero variants) and
   *  transitions to solid once the user scrolls past the hero fold. */
  transparent?: boolean;
};

export default function AtlasHeader({ config, onOpenMobileNav, onOpenCart, transparent = false }: Props) {
  const siteName = config.settings?.siteName ?? config.tenant.name;
  const fc = config.tenant.featureConfig;
  const totalItems = useCartStore((s) => s.totalItems());
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 10);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Build nav from feature config
  const navLinks: { href: string; label: string }[] = [
    { href: '/', label: 'Home' },
  ];
  if (fc.about?.enabled) navLinks.push({ href: '/about', label: 'About' });
  if (fc.shop?.enabled) navLinks.push({ href: '/shop', label: 'Shop' });
  if (fc.resources?.enabled) navLinks.push({ href: '/resources', label: 'Resources' });
  if (fc.faqs?.enabled) navLinks.push({ href: '/faqs', label: 'FAQs' });
  if (fc.contact?.enabled) navLinks.push({ href: '/contact', label: 'Contact' });

  // Logo: prefer AtlasSiteConfig logo, fall back to SiteSettings logo, then text
  const logoUrl = config.pageConfig?.logo?.url ?? config.settings?.logo?.url ?? null;
  const logoAlt = config.pageConfig?.logo?.alt ?? siteName;

  return (
    <header className="atlas-header" data-scrolled={scrolled} data-transparent={transparent || undefined}>
      <div className="atlas-header-inner">
        {/* Logo */}
        <Link href="/" className="atlas-header-logo">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt={logoAlt}
              className="atlas-header-logo-img"
              height={72}
              style={{ height: '72px', width: 'auto', display: 'block' }}
            />
          ) : (
            siteName
          )}
        </Link>

        {/* Desktop nav */}
        <nav className="atlas-header-nav" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="atlas-header-actions">
          {/* Cart button (only if shop is enabled) */}
          {fc.shop?.enabled && (
            <button
              className="atlas-btn-icon atlas-btn-ghost atlas-cart-badge"
              onClick={onOpenCart}
              aria-label={`Cart (${totalItems} items)`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {totalItems > 0 && (
                <span className="atlas-cart-count">{totalItems > 99 ? '99+' : totalItems}</span>
              )}
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            className="atlas-hamburger"
            onClick={onOpenMobileNav}
            aria-label="Open menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
