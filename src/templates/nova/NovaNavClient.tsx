'use client';

/**
 * Nova Mobile Navigation — Client Component
 *
 * Renders the hamburger button (visible on mobile via CSS) and
 * the full-screen slide-out mobile menu.
 *
 * Also handles:
 * - Body scroll lock when mobile nav is open
 * - aria-current="page" on active nav links (desktop + mobile)
 */

import { useState, useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';

type Props = {
  navLinks: { href: string; label: string }[];
};

export function NovaNavClient({ navLinks }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const toggle = useCallback(() => setOpen((v) => !v), []);
  const close = useCallback(() => setOpen(false), []);

  // Lock body scroll when mobile nav is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Set aria-current on desktop nav links (server-rendered in NovaLayout)
  useEffect(() => {
    const desktopLinks = document.querySelectorAll('.nova-header__link');
    desktopLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === pathname || (pathname === '/' && href === '/')) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }, [pathname]);

  // Check if a link matches the current path
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Hamburger button */}
      <button
        className="nova-header__toggle"
        onClick={toggle}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {open ? (
            <>
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="6" y1="18" x2="18" y2="6" />
            </>
          ) : (
            <>
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </>
          )}
        </svg>
      </button>

      {/* Mobile nav overlay */}
      <div className={`nova-mobile-nav${open ? ' nova-mobile-nav--open' : ''}`}>
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="nova-mobile-nav__link"
            onClick={close}
            aria-current={isActive(link.href) ? 'page' : undefined}
          >
            {link.label}
          </a>
        ))}
      </div>
    </>
  );
}
