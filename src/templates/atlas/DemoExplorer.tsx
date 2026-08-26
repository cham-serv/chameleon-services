'use client';

/**
 * DemoExplorer - Client Component
 *
 * A collapsible drawer that appears on demo tenant sites, allowing
 * visitors to browse template pages and switch between variants in
 * real time using the existing _dv query parameter mechanism.
 *
 * Also provides a Brand Preview panel for live colour/font/button
 * style preview via CSS custom property injection on :root.
 *
 * Triggered by a vertical edge tab on the right side of the screen.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import type { ExplorerRoute } from '@/lib/demo-explorer-types';
import { getFontStack } from '@/lib/fonts';

// - Types -

type DemoExplorerProps = {
  routes: ExplorerRoute[];
  /** The URL prefix for this tenant (e.g. '' for domain-based, '/atlas-demo' for path-based). */
  basePath: string;
};

type BrandPreview = {
  primary: string;
  secondary: string;
  accent: string;
  textColour: string;   // maps to --brand-text
  bgColour: string;     // maps to --brand-background
  buttonStyle: 'filled' | 'outline' | 'pill' | 'soft';
  fontHeading: string;
  fontBody: string;
};

// - Preset Palettes -

const PRESET_PALETTES: { label: string; primary: string; secondary: string; accent: string }[] = [
  { label: 'Forest',   primary: '#2d6a4f', secondary: '#52b788', accent: '#f59e0b' },
  { label: 'Ocean',    primary: '#0369a1', secondary: '#38bdf8', accent: '#f97316' },
  { label: 'Midnight', primary: '#1e1b4b', secondary: '#7c3aed', accent: '#f43f5e' },
  { label: 'Rose',     primary: '#be123c', secondary: '#fb7185', accent: '#f59e0b' },
  { label: 'Stone',    primary: '#292524', secondary: '#78716c', accent: '#16a34a' },
  { label: 'Slate',    primary: '#0f172a', secondary: '#334155', accent: '#06b6d4' },
];

// - Font Pair Presets -

const FONT_PAIRS: { label: string; heading: string; body: string }[] = [
  { label: 'Modern',    heading: 'Plus Jakarta Sans', body: 'Inter'          },
  { label: 'Editorial', heading: 'Playfair Display',  body: 'Lato'           },
  { label: 'Bold',      heading: 'Syne',              body: 'DM Sans'        },
  { label: 'Clean',     heading: 'Outfit',            body: 'Open Sans'      },
  { label: 'Elegant',   heading: 'Raleway',           body: 'Figtree'        },
  { label: 'Techy',     heading: 'Space Grotesk',     body: 'JetBrains Mono' },
  { label: 'Luxury',    heading: 'Lora',              body: 'Poppins'        },
  { label: 'Classic',   heading: 'Montserrat',        body: 'Lato'           },
  { label: 'Warm',      heading: 'Poppins',           body: 'Figtree'        },
  { label: 'Sharp',     heading: 'Syne',              body: 'Poppins'        },
];

// - Button Style Options -

const BTN_STYLES: { label: string; value: BrandPreview['buttonStyle'] }[] = [
  { label: 'Filled',  value: 'filled'  },
  { label: 'Outline', value: 'outline' },
  { label: 'Pill',    value: 'pill'    },
  { label: 'Soft',    value: 'soft'    },
];

// - Tab type -

type ExplorerTab = 'pages' | 'brand';

// - Component -

export function DemoExplorer({ routes, basePath }: DemoExplorerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ExplorerTab>('pages');
  // Hint arrow: shown on first visit, never again after drawer is opened
  const [showHint, setShowHint] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Brand preview state - starts from current CSS vars on :root
  const [brand, setBrand] = useState<BrandPreview>({
    primary:     '#2d6a4f',
    secondary:   '#52b788',
    accent:      '#f59e0b',
    textColour:  '#1b1b1b',
    bgColour:    '#ffffff',
    buttonStyle: 'filled',
    fontHeading: 'Plus Jakarta Sans',
    fontBody:    'Inter',
  });

  // - Derive current state from URL -

  const tenantPath = useMemo(() => {
    // Strip the basePath prefix (e.g. '' or '/atlas-demo') to get the page path
    if (basePath && pathname.startsWith(basePath)) {
      return pathname.slice(basePath.length) || '/';
    }
    return pathname || '/';
  }, [pathname, basePath]);

  const currentRoute = useMemo(() => {
    const exact = routes.find((r) => r.routeKey === tenantPath);
    if (exact) return exact;
    const firstSegment = tenantPath.split('/').filter(Boolean)[0];
    if (firstSegment) {
      return routes.find((r) => r.routeKey === '/' + firstSegment) ?? null;
    }
    return null;
  }, [routes, tenantPath]);

  const currentDv = searchParams.get('_dv');

  const activeVariant = useMemo(() => {
    if (!currentRoute) return null;
    if (currentDv) {
      const colonIdx = currentDv.indexOf(':');
      if (colonIdx > 0) {
        const overrideRoute = currentDv.slice(0, colonIdx);
        const overrideVariant = currentDv.slice(colonIdx + 1);
        const normalizedRouteKey = currentRoute.routeKey === '/' ? 'home' : currentRoute.routeKey.replace(/^\//, '');
        if (overrideRoute === normalizedRouteKey) {
          return overrideVariant;
        }
      }
    }
    return currentRoute.defaultVariant;
  }, [currentRoute, currentDv]);

  // - Brand preview: inject CSS custom properties on :root -

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--brand-primary',    brand.primary);
    root.style.setProperty('--brand-secondary',  brand.secondary);
    root.style.setProperty('--brand-accent',     brand.accent);
    root.style.setProperty('--brand-text',       brand.textColour);
    root.style.setProperty('--brand-background', brand.bgColour);
    document.body.setAttribute('data-btn-style', brand.buttonStyle);

    // Font preview + body-level colour overrides injected as a <style> element.
    // We use a <style> block (not just CSS vars) so that:
    //   a) font-family stacks are set without any network request
    //   b) html/body get a colour/background cascade base — ensuring ALL page
    //      content that inherits from body responds to the text/background
    //      colour controls, not just elements that explicitly reference the var().
    //   Dark sections (e.g. atlas-section-dark) retain their own backgrounds
    //   because their CSS rules are more specific than a body rule.
    const styleId = 'demo-explorer-font-preview';
    let el = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement('style');
      el.id = styleId;
      document.head.appendChild(el);
    }
    const hStack = getFontStack(brand.fontHeading, 'heading');
    const bStack = getFontStack(brand.fontBody, 'body');
    el.textContent = [
      `:root { --font-heading: ${hStack}; --font-body: ${bStack}; }`,
      // Cascade base: any element that inherits colour from body picks this up
      `html, body {`,
      `  background-color: var(--brand-background, #ffffff);`,
      `  color: var(--brand-text, #1b1b1b);`,
      `}`,
    ].join('\n');
  }, [brand]);

  const updateBrand = useCallback((patch: Partial<BrandPreview>) => {
    setBrand((prev) => ({ ...prev, ...patch }));
  }, []);

  const applyPalette = useCallback((palette: typeof PRESET_PALETTES[0]) => {
    updateBrand({ primary: palette.primary, secondary: palette.secondary, accent: palette.accent });
  }, [updateBrand]);

  const applyFontPair = useCallback((pair: typeof FONT_PAIRS[0]) => {
    updateBrand({ fontHeading: pair.heading, fontBody: pair.body });
  }, [updateBrand]);

  // - Actions -

  // Check localStorage once on mount to decide whether to show the hint
  useEffect(() => {
    try {
      if (!localStorage.getItem('demo-explorer-seen')) {
        setShowHint(true);
      }
    } catch {
      // localStorage blocked (private browsing etc.) — show hint anyway
      setShowHint(true);
    }
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
    // Dismiss hint permanently on first open
    setShowHint(false);
    try { localStorage.setItem('demo-explorer-seen', '1'); } catch { /* ignore */ }
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  const navigateToPage = useCallback(
    (routeKey: string) => {
      const path = routeKey === '/' ? '' : routeKey;
      router.push(`${basePath}${path}`);
    },
    [basePath, router],
  );

  const selectVariant = useCallback(
    (routeKey: string, variantSlug: string) => {
      const normalizedRoute = routeKey === '/' ? 'home' : routeKey.replace(/^\//, '');
      const dvValue = `${normalizedRoute}:${variantSlug}`;
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

  // - Keyboard & scroll lock -

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

  // - Render -

  return (
    <>
      {/* Hint arrow — points at the EXPLORE tab, auto-fades after 5s */}
      {showHint && (
        <div className="demo-explorer-hint" aria-hidden="true">
          <span className="demo-explorer-hint-label">Explore</span>
          <span className="demo-explorer-hint-arrow">&#8594;</span>
        </div>
      )}

      {/* Edge Tab */}
      <button
        className="demo-explorer-tab"
        data-open={isOpen}
        onClick={open}
        aria-label="Open demo explorer"
      >
        <span className="demo-explorer-tab-icon"></span>
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
            <span className="demo-explorer-title-icon"></span>
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

        {/* Tab Bar */}
        <div className="demo-explorer-tabs">
          <button
            className="demo-explorer-tab-btn"
            data-active={activeTab === 'pages'}
            onClick={() => setActiveTab('pages')}
          >
            Pages
          </button>
          <button
            className="demo-explorer-tab-btn"
            data-active={activeTab === 'brand'}
            onClick={() => setActiveTab('brand')}
          >
             Brand
          </button>
        </div>

        {/* Body */}
        <div className="demo-explorer-body">

          {/* - Pages Tab - */}
          {activeTab === 'pages' && (
            <>
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

              {currentRoute && currentRoute.variants.length > 1 && (
                <>
                  <p className="demo-explorer-section-label">
                    Variants - {currentRoute.label}
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

              {currentRoute && currentRoute.variants.length <= 1 && (
                <p style={{ fontSize: '0.75rem', color: '#6b7280', fontStyle: 'italic' }}>
                  This page has a single layout variant. Navigate to a page with multiple variants to explore different styles.
                </p>
              )}
            </>
          )}

          {/* - Brand Tab - */}
          {activeTab === 'brand' && (
            <>
              {/* Palette Presets */}
              <p className="demo-explorer-section-label">Colour Palette</p>
              <div className="demo-explorer-palette-grid">
                {PRESET_PALETTES.map((palette) => (
                  <button
                    key={palette.label}
                    className="demo-explorer-palette-btn"
                    onClick={() => applyPalette(palette)}
                    title={palette.label}
                    aria-label={`Apply ${palette.label} palette`}
                  >
                    <span className="demo-explorer-palette-swatch" style={{ background: palette.primary }} />
                    <span className="demo-explorer-palette-swatch" style={{ background: palette.secondary }} />
                    <span className="demo-explorer-palette-swatch" style={{ background: palette.accent }} />
                    <span className="demo-explorer-palette-name">{palette.label}</span>
                  </button>
                ))}
              </div>

              {/* Custom Hex Inputs */}
              <p className="demo-explorer-section-label" style={{ marginTop: '1rem' }}>Custom Colours</p>
              <div className="demo-explorer-colour-inputs">
                {[
                  { key: 'primary',    label: 'Primary'    },
                  { key: 'secondary',  label: 'Secondary'  },
                  { key: 'accent',     label: 'Accent'     },
                  { key: 'textColour', label: 'Text'       },
                  { key: 'bgColour',   label: 'Background' },
                ].map(({ key, label }) => (
                  <div key={key} className="demo-explorer-colour-row">
                    <input
                      type="color"
                      className="demo-explorer-colour-swatch-input"
                      value={brand[key as keyof BrandPreview] as string}
                      onChange={(e) => updateBrand({ [key]: e.target.value } as Partial<BrandPreview>)}
                      aria-label={`${label} colour`}
                    />
                    <input
                      type="text"
                      className="demo-explorer-hex-input"
                      value={brand[key as keyof BrandPreview] as string}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^#[0-9a-fA-F]{0,6}$/.test(val)) {
                          updateBrand({ [key]: val } as Partial<BrandPreview>);
                        }
                      }}
                      maxLength={7}
                      spellCheck={false}
                      aria-label={`${label} hex code`}
                    />
                    <span className="demo-explorer-colour-label">{label}</span>
                  </div>
                ))}
              </div>

              {/* Font Pair Presets */}
              <p className="demo-explorer-section-label" style={{ marginTop: '1rem' }}>Font Pairs</p>
              <div className="demo-explorer-font-grid">
                {FONT_PAIRS.map((pair) => (
                  <button
                    key={pair.label}
                    className="demo-explorer-font-btn"
                    data-active={brand.fontHeading === pair.heading && brand.fontBody === pair.body}
                    onClick={() => applyFontPair(pair)}
                  >
                    <span className="demo-explorer-font-label">{pair.label}</span>
                    <span className="demo-explorer-font-names">{pair.heading} / {pair.body}</span>
                  </button>
                ))}
              </div>

              {/* Button Style */}
              <p className="demo-explorer-section-label" style={{ marginTop: '1rem' }}>Button Style</p>
              <div className="demo-explorer-btn-style-grid">
                {BTN_STYLES.map(({ label, value }) => (
                  <button
                    key={value}
                    className="demo-explorer-btn-style-option"
                    data-active={brand.buttonStyle === value}
                    onClick={() => updateBrand({ buttonStyle: value })}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="demo-explorer-footer">
          {activeTab === 'pages' && currentDv && (
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
