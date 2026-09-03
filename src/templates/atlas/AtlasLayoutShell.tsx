'use client';

/**
 * AtlasLayoutShell  Client Component
 *
 * Coordinates the interactive layout chrome: header, mobile nav drawer,
 * and cart drawer. Manages open/close state for both drawers.
 *
 * Also renders the global announcement strip (when configured), since
 * it requires client-side sessionStorage for dismissal.
 *
 * Sits inside AtlasLayout (server component) as a client boundary.
 */

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import type { TenantConfig } from '@/lib/types';
import AtlasHeader from './AtlasHeader';
import AtlasMobileNav from './AtlasMobileNav';
import AtlasCartDrawer from './AtlasCartDrawer';
import { AtlasScrollReveal } from './AtlasScrollReveal';

type Props = {
  config: TenantConfig;
  children: React.ReactNode;
  /** When true, renders the header transparent until user scrolls (for hero variants) */
  transparentHeader?: boolean;
};

export default function AtlasLayoutShell({ config, children, transparentHeader = false }: Props) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [announcementDismissed, setAnnouncementDismissed] = useState(true);

  const pc = config.pageConfig;
  const announcementKey = `announcement-dismissed-${config.tenant.slug}`;

  // Check sessionStorage on mount — avoids flash of announcement on return visits
  useEffect(() => {
    if (pc?.announcementEnabled && pc?.announcementText) {
      const dismissed = sessionStorage.getItem(announcementKey) === 'true';
      setAnnouncementDismissed(dismissed);
    }
  }, [pc?.announcementEnabled, pc?.announcementText, announcementKey]);

  const dismissAnnouncement = useCallback(() => {
    sessionStorage.setItem(announcementKey, 'true');
    setAnnouncementDismissed(true);
  }, [announcementKey]);

  const openMobileNav = useCallback(() => {
    setCartOpen(false);
    setMobileNavOpen(true);
  }, []);

  const closeMobileNav = useCallback(() => {
    setMobileNavOpen(false);
  }, []);

  const openCart = useCallback(() => {
    setMobileNavOpen(false);
    setCartOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setCartOpen(false);
  }, []);

  const showAnnouncement =
    !announcementDismissed &&
    pc?.announcementEnabled === true &&
    !!pc?.announcementText;

  return (
    <>
      {showAnnouncement && (
        <div
          className={`atlas-announcement-strip atlas-announcement-strip--${pc?.announcementStyle ?? 'info'}`}
          role="banner"
          aria-label="Site announcement"
        >
          <div className="atlas-announcement-inner">
            <p className="atlas-announcement-text">
              {pc?.announcementText}
              {pc?.announcementLink && pc?.announcementLinkText && (
                <Link href={pc.announcementLink} className="atlas-announcement-link">
                  {pc.announcementLinkText}
                </Link>
              )}
            </p>
            <button
              className="atlas-announcement-dismiss"
              onClick={dismissAnnouncement}
              aria-label="Dismiss announcement"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <AtlasHeader
        config={config}
        onOpenMobileNav={openMobileNav}
        onOpenCart={openCart}
        transparent={transparentHeader}
      />

      <AtlasMobileNav
        config={config}
        isOpen={mobileNavOpen}
        onClose={closeMobileNav}
      />

      <AtlasCartDrawer
        config={config}
        isOpen={cartOpen}
        onClose={closeCart}
      />

      {/* Scroll-reveal observer — activates data-reveal animations site-wide */}
      <AtlasScrollReveal />

      {children}
    </>
  );
}
