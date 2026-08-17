'use client';

/**
 * DemoExplorer — Client Component
 *
 * A collapsible drawer that appears on demo tenant sites, allowing
 * visitors to browse template pages and switch between variants in
 * real time using the existing _dv query parameter mechanism.
 *
 * Triggered by a vertical edge tab on the right side of the screen.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import type { ExplorerRoute } from '@/lib/demo-explorer-types';

type DemoExplorerProps = {
  routes: ExplorerRoute[];
};

export function DemoExplorer({ routes }: DemoExplorerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // ── Derive current state from URL ─────────────────────────────────

  // Strip the tenant prefix from pathname: /atlas-demo/shop → /shop
  const tenantPath = useMemo(() => {
    const parts = pathname.split('/').filter(Boolean);
    // First segment is the tenant slug, rest is the page path
    if (parts.length <= 1) return '/';
    return '/' + parts.slice(1).join('/');
  }, [pathname]);

  // Find which route matches the current path
  const currentRoute = useMemo(() => {
    // Exact match first
    const exact = routes.find((r) => r.routeKey === tenantPath);
    if (exact) return exact;

    // For sub-pages like /shop/product-slug, match the parent /shop
    const firstSegment = tenantPath.split('/').filter(Boolean)[0];
    if (firstSegment) {
      return routes.find((r) => r.routeKey === '/' + firstSegment) ?? null;
    }

    return null;
  }, [routes, tenantPath]);

  // Read the active _dv override
  const currentDv = searchParams.get('_dv');

  // Determine which variant is active for the current route
  const activeVariant = useMemo(() => {
    if (!currentRoute) return null;

    if (currentDv) {
      // _dv format: "routeKey:variantSlug" e.g. "home:hero-video"
      const colonIdx = currentDv.indexOf(':');
      if (colonIdx > 0) {
        const overrideRoute = currentDv.slice(0, colonIdx);
        const overrideVariant = currentDv.slice(colonIdx + 1);
        const normalizedRouteKey = currentRoute.routeKey.replace(/^\//, '');
        if (overrideRoute === normalizedRouteKey) {
          return overrideVariant;
        }
      }
    }

    return currentRoute.defaultVariant;
  }, [currentRoute, currentDv]);

  // ── Actions ───────────────────────────────────────────────────────

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const navigateToPage = useCallback(
    (routeKey: string) => {
      const path = routeKey === '/' ? '' : routeKey;
      // Extract tenant slug from current pathname
      const tenantSlug = pathname.split('/').filter(Boolean)[0] ?? '';
      router.push(`/${tenantSlug}${path}`);
    },
    [pathname, router],
  );

  const selectVariant = useCallback(
    (routeKey: string, variantSlug: string) => {
      const normalizedRoute = routeKey === '/' ? 'home' : routeKey.replace(/^\//, '');
      const dvValue = `${normalizedRoute}:${variantSlug}`;

      // Build new URL preserving other params
      const params = new URLSearchParams(searchParams.toString());
      params.set('_dv', dvValue);

      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, searchParams, router],
  );

  const resetVariant = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('_dv');
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }, [pathname, searchParams, router]);

  // ── Keyboard & scroll lock ────────────────────────────────────────

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, close]);

  // ── Render ────────────────────────────────────────────────────────

  return (
    <>
      {/* Edge Tab */}
      <button
        className="demo-explorer-tab"
        data-open={isOpen}
        onClick={open}
        aria-label="Open demo explorer"
      >
        <span className="demo-explorer-tab-icon">🦎</span>
        Explore
      </button>

      {/* Backdrop */}
      <div
        className="demo-explorer-backdrop"
        data-open={isOpen}
        onClick={close}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="demo-explorer-drawer"
        data-open={isOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Demo Explorer"
      >
        {/* Header */}
        <div className="demo-explorer-header">
          <h2 className="demo-explorer-title">
            <span className="demo-explorer-title-icon">🦎</span>
            Demo Explorer
          </h2>
          <button
            className="demo-explorer-close"
            onClick={close}
            aria-label="Close demo explorer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="demo-explorer-body">
          {/* Page Navigation */}
          <p className="demo-explorer-section-label">Pages</p>
          <div className="demo-explorer-page-list">
            {routes.map((route) => (
              <button
                key={route.routeKey}
                className="demo-explorer-page-item"
                data-active={currentRoute?.routeKey === route.routeKey}
                onClick={() => navigateToPage(route.routeKey)}
              >
                <span className="demo-explorer-page-dot" />
                {route.label}
                {route.variants.length > 1 && (
                  <span className="demo-explorer-variant-count">
                    {route.variants.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Variant Selection for Current Page */}
          {currentRoute && currentRoute.variants.length > 1 && (
            <>
              <p className="demo-explorer-section-label">
                Variants — {currentRoute.label}
              </p>
              <div className="demo-explorer-variant-list">
                {currentRoute.variants.map((variant) => (
                  <button
                    key={variant.slug}
                    className="demo-explorer-variant-card"
                    data-active={activeVariant === variant.slug}
                    onClick={() => selectVariant(currentRoute.routeKey, variant.slug)}
                  >
                    <div className="demo-explorer-variant-radio" />
                    <div className="demo-explorer-variant-info">
                      <p className="demo-explorer-variant-name">{variant.label}</p>
                      {variant.description && (
                        <p className="demo-explorer-variant-desc">{variant.description}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Message when current page has only one variant */}
          {currentRoute && currentRoute.variants.length <= 1 && (
            <p style={{ fontSize: '0.75rem', color: '#6b7280', fontStyle: 'italic' }}>
              This page has a single layout variant. Navigate to a page with multiple variants to explore different styles.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="demo-explorer-footer">
          {currentDv && (
            <button className="demo-explorer-reset" onClick={resetVariant}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
              Reset to Default
            </button>
          )}
          <p className="demo-explorer-branding">
            Powered by <a href="https://chameleon.services" target="_blank" rel="noopener noreferrer">Chameleon</a>
          </p>
        </div>
      </div>
    </>
  );
}
