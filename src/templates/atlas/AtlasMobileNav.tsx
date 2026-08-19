'use client';

/**
 * AtlasMobileNav  Client Component
 *
 * Slide-out drawer from the left, full viewport height.
 * Focus-trapped for accessibility, closes on backdrop click or Escape.
 */

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import type { TenantConfig } from '@/lib/types';

type Props = {
  config: TenantConfig;
  isOpen: boolean;
  onClose: () => void;
};

export default function AtlasMobileNav({ config, isOpen, onClose }: Props) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const fc = config.tenant.featureConfig;
  const siteName = config.settings?.siteName ?? config.tenant.name;

  // Build nav links
  const navLinks: { href: string; label: string }[] = [
    { href: '/', label: 'Home' },
  ];
  if (fc.about?.enabled) navLinks.push({ href: '/about', label: 'About' });
  if (fc.shop?.enabled) navLinks.push({ href: '/shop', label: 'Shop' });
  if (fc.resources?.enabled) navLinks.push({ href: '/resources', label: 'Resources' });
  if (fc.faqs?.enabled) navLinks.push({ href: '/faqs', label: 'FAQs' });
  if (fc.contact?.enabled) navLinks.push({ href: '/contact', label: 'Contact' });
  if (fc.legal?.enabled) navLinks.push({ href: '/legal', label: 'Legal' });

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll when drawer is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Focus trap  keep focus within the drawer
  useEffect(() => {
    if (!isOpen || !drawerRef.current) return;

    const drawer = drawerRef.current;
    const focusable = drawer.querySelectorAll<HTMLElement>(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const trapFocus = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    drawer.addEventListener('keydown', trapFocus);
    first?.focus();

    return () => drawer.removeEventListener('keydown', trapFocus);
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="atlas-backdrop"
        data-open={isOpen}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="atlas-drawer atlas-drawer--left"
        data-open={isOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="atlas-drawer-header">
          <span
            style={{
              fontFamily: 'var(--font-heading, inherit)',
              fontWeight: 800,
              fontSize: '1.125rem',
              color: 'var(--brand-primary, #2d6a4f)',
            }}
          >
            {siteName}
          </span>
          <button
            className="atlas-btn-icon atlas-btn-ghost"
            onClick={onClose}
            aria-label="Close menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="atlas-drawer-body">
          <nav aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="atlas-mobile-nav-link"
                onClick={onClose}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
