'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { ChameleonLogo } from '@/components/marketing/ChameleonLogo';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/templates', label: 'Templates' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/agencies', label: 'Agencies' },
  { href: '/contact', label: 'Contact' },
];

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'background 0.3s, border-color 0.3s, backdrop-filter 0.3s',
        background: scrolled
          ? 'rgba(13, 17, 23, 0.85)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled
          ? '1px solid rgba(255,255,255,0.08)'
          : '1px solid transparent',
      }}
    >
      <div
        className="m-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
        }}
      >
        {/* Logo */}
        <Link href="/" aria-label="Chameleon home">
          <ChameleonLogo size={32} />
        </Link>

        {/* Desktop Nav */}
        <nav className="m-desktop-nav" aria-label="Main navigation" style={{ display: 'flex', gap: '4px' }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: pathname === link.href ? 600 : 400,
                color: pathname === link.href
                  ? 'var(--m-text)'
                  : 'var(--m-text-muted)',
                textDecoration: 'none',
                transition: 'color 0.15s, background 0.15s',
                background: pathname === link.href
                  ? 'rgba(255,255,255,0.06)'
                  : 'transparent',
              }}
              id={`nav-${link.label.toLowerCase()}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA + Mobile toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            href="/contact"
            className="m-btn m-btn-primary m-desktop-cta"
            id="navbar-cta-desktop"
          >
            Get Started
          </Link>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            id="mobile-menu-toggle"
            className="m-mobile-toggle"
            style={{
              padding: '8px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '6px',
              color: 'var(--m-text)',
              cursor: 'pointer',
            }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            top: '64px',
            background: 'rgba(13,17,23,0.97)',
            backdropFilter: 'blur(20px)',
            zIndex: 99,
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: '14px 16px',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: 500,
                color: pathname === link.href ? 'var(--m-accent-light)' : 'var(--m-text)',
                textDecoration: 'none',
                background: pathname === link.href ? 'rgba(59,130,246,0.08)' : 'transparent',
              }}
              id={`mobile-nav-${link.label.toLowerCase()}`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="m-btn m-btn-primary m-btn-lg"
            style={{ marginTop: '16px' }}
            id="mobile-nav-cta"
          >
            Get Started
          </Link>
        </div>
      )}
    </header>
  );
}
