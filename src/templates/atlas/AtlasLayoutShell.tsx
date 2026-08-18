'use client';

/**
 * AtlasLayoutShell — Client Component
 *
 * Coordinates the interactive layout chrome: header, mobile nav drawer,
 * and cart drawer. Manages open/close state for both drawers.
 *
 * Sits inside AtlasLayout (server component) as a client boundary.
 */

import { useState, useCallback } from 'react';
import type { TenantConfig } from '@/lib/types';
import AtlasHeader from './AtlasHeader';
import AtlasMobileNav from './AtlasMobileNav';
import AtlasCartDrawer from './AtlasCartDrawer';

type Props = {
  config: TenantConfig;
  children: React.ReactNode;
  /** When true, renders the header transparent until user scrolls (for hero variants) */
  transparentHeader?: boolean;
};

export default function AtlasLayoutShell({ config, children, transparentHeader = false }: Props) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

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

  return (
    <>
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

      {children}
    </>
  );
}
