'use client';

/**
 * MeridianMobileNav
 *
 * Full-screen slide-in drawer for mobile navigation.
 * Locks body scroll when open. CTA pinned to bottom.
 */

import { useEffect } from 'react';
import Link from 'next/link';
import type { TenantConfig } from '@/lib/types';

type NavLink = { href: string; label: string };

type Props = {
  config: TenantConfig;
  navLinks: NavLink[];
  isOpen: boolean;
  onClose: () => void;
};

export default function MeridianMobileNav({ config, navLinks, isOpen, onClose }: Props) {
  const siteName = config.settings?.siteName ?? config.tenant.name;
  const logoUrl = config.pageConfig?.logo?.url ?? config.settings?.logo?.url ?? null;
  const contactEnabled = config.tenant.featureConfig.contact?.enabled;

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="mer-mobile-nav-overlay"
        data-open={isOpen || undefined}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <nav
        className="mer-mobile-nav-drawer"
        data-open={isOpen || undefined}
        aria-label="Mobile navigation"
        aria-hidden={!isOpen}
      >
        {/* Drawer header */}
        <div className="mer-mobile-nav-header">
          <Link
            href="/"
            onClick={onClose}
            className="mer-header-logo"
            aria-label={siteName}
          >
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt={siteName}
                className="mer-header-logo-img"
                width={140}
                height={40}
              />
            ) : (
              <span className="mer-header-logo-text">{siteName}</span>
            )}
          </Link>

          <button
            className="mer-btn-icon"
            onClick={onClose}
            aria-label="Close menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <div className="mer-mobile-nav-body">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="mer-mobile-nav-link"
              onClick={onClose}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Footer CTA */}
        {contactEnabled && (
          <div className="mer-mobile-nav-footer">
            <Link
              href="/contact"
              className="mer-btn mer-btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={onClose}
            >
              Get in Touch
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}
