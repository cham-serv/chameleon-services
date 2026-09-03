'use client';
import './demo-explorer.css';

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
import { getFontStack, PLATFORM_FONTS } from '@/lib/fonts';

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
  textColour: string;    // maps to --brand-text
  headingColour: string; // maps to --brand-heading
  bgColour: string;      // maps to --brand-background
  buttonStyle: 'filled' | 'outline' | 'pill' | 'soft';
  fontDisplay: string;   // maps to --font-display (hero/H1 only; blank = inherit fontHeading)
  fontHeading: string;   // maps to --font-heading
  fontBody: string;      // maps to --font-body
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

/**
 * Curated palettes for home page variant previews.
 * Applied automatically in the Demo Explorer when switching variants
 * so each demo variant looks visually intentional instead of just
 * inheriting whatever the demo tenant's default colours happen to be.
 *
 * In production these are never applied — real tenants use their own colours.
 */
const VARIANT_PALETTES: Record<string, { primary: string; secondary: string; accent: string; bgColour: string; textColour: string }> = {
  storefront: { primary: '#2d6a4f', secondary: '#52b788', accent: '#f59e0b',  bgColour: '#ffffff', textColour: '#1b1b1b' },
  editorial:  { primary: '#0369a1', secondary: '#38bdf8', accent: '#f97316',  bgColour: '#fafaf9', textColour: '#1c1917' },
  modern:     { primary: '#4f46e5', secondary: '#7c3aed', accent: '#06b6d4',  bgColour: '#0a0f1e', textColour: '#e2e8f0' },
  bold:       { primary: '#1a1a2e', secondary: '#e94560', accent: '#f5a623',  bgColour: '#0d0d1a', textColour: '#f8fafc' },
  minimalist: { primary: '#1c1917', secondary: '#57534e', accent: '#16a34a',  bgColour: '#fafaf9', textColour: '#1c1917' },
};

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

// - Font options derived from the platform registry (same 20 fonts as the CMS) -

const FONT_OPTIONS: string[] = Object.keys(PLATFORM_FONTS);

// - Tab type -

type ExplorerTab = 'pages' | 'brand' | 'style';

// - Component -

export function DemoExplorer({ routes, basePath }: DemoExplorerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ExplorerTab>('pages');
  // Hint arrow: shown on first visit, never again after drawer is opened
  const [showHint, setShowHint] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Dark mode toggle — controls data-scheme on <html>
  const [isDark, setIsDark] = useState(false);

  // Sync data-scheme to <html> whenever isDark changes
  useEffect(() => {
    document.documentElement.setAttribute('data-scheme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Brand preview state — initialised to safe defaults; overwritten on mount
  // from the actual CSS vars on :root so pickers always show the real tenant colours.
  const [brand, setBrand] = useState<BrandPreview>({
    primary:       '#2d6a4f',
    secondary:     '#52b788',
    accent:        '#f59e0b',
    textColour:    '#1b1b1b',
    headingColour: '#1b1b1b',
    bgColour:      '#ffffff',
    buttonStyle:   'filled',
    fontDisplay:   '',
    fontHeading:   'Plus Jakarta Sans',
    fontBody:      'Inter',
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
    root.style.setProperty('--brand-heading',    brand.headingColour);
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
    // Display font falls back to heading font if not explicitly set
    const dStack = brand.fontDisplay
      ? getFontStack(brand.fontDisplay, 'display')
      : hStack;
    el.textContent = [
      `:root { --font-display: ${dStack}; --font-heading: ${hStack}; --font-body: ${bStack}; }`,
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

  // On mount:
  //   1. Read actual brand CSS vars from :root so colour pickers reflect the real tenant colours.
  //   2. Auto-open if _de=1 is in the URL (persisted via navigateToPage).
  //   3. Show the hint arrow for first-time visitors; auto-clear it after 5s (matching CSS).
  useEffect(() => {
    // 0. Sync dark mode toggle to current data-scheme on <html>
    const currentScheme = document.documentElement.getAttribute('data-scheme');
    if (currentScheme === 'dark') setIsDark(true);

    // 1. Sync brand state to real CSS vars
    const style = getComputedStyle(document.documentElement);
    const get = (v: string, fallback: string) => style.getPropertyValue(v).trim() || fallback;
    setBrand((prev) => ({
      ...prev,
      primary:       get('--brand-primary',    prev.primary),
      secondary:     get('--brand-secondary',  prev.secondary),
      accent:        get('--brand-accent',     prev.accent),
      textColour:    get('--brand-text',       prev.textColour),
      headingColour: get('--brand-heading',    prev.headingColour),
      bgColour:      get('--brand-background', prev.bgColour),
    }));

    // 2 & 3. URL param + hint logic
    const hasDeParam = searchParams.get('_de') === '1';
    try {
      const seen = !!localStorage.getItem('demo-explorer-seen');
      if (!seen && !hasDeParam) {
        setShowHint(true);
        // Auto-clear hint after 5 000 ms — matches the CSS demo-hint-lifecycle animation
        // so React state and the visual state stay in sync. Without this, any re-render
        // after 5s would recreate the element and restart the animation.
        const timer = window.setTimeout(() => setShowHint(false), 5000);
        return () => window.clearTimeout(timer);
      }
      if (hasDeParam) {
        setIsOpen(true);
        localStorage.setItem('demo-explorer-seen', '1');
      }
    } catch {
      if (!hasDeParam) {
        setShowHint(true);
        const timer = window.setTimeout(() => setShowHint(false), 5000);
        return () => window.clearTimeout(timer);
      }
      if (hasDeParam) setIsOpen(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally only runs on mount

  const open = useCallback(() => {
    setIsOpen(true);
    setShowHint(false);
    try { localStorage.setItem('demo-explorer-seen', '1'); } catch { /* ignore */ }
    // Intentionally NOT writing _de=1 here — URL stays clean when opened manually.
    // _de=1 is only written by navigateToPage() so that hard-refresh after a
    // drawer-initiated navigation restores the open state on the new page.
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Only touch the URL if _de is actually present — avoids spurious history entries
    if (searchParams.has('_de')) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('_de');
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }
  }, [pathname, searchParams, router]);

  const navigateToPage = useCallback(
    (routeKey: string) => {
      // No-op if already on this page
      if (currentRoute?.routeKey === routeKey) return;

      const path = routeKey === '/' ? '' : routeKey;
      // Fallback to '/' if basePath and path are both empty (home on a domain tenant)
      const target = `${basePath}${path}` || '/';

      // Carry _de=1 so the drawer auto-opens on the destination page
      const params = new URLSearchParams();
      params.set('_de', '1');
      router.push(`${target}?${params.toString()}`);
    },
    [basePath, router, currentRoute],
  );

  const selectVariant = useCallback(
    (routeKey: string, variantSlug: string) => {
      const normalizedRoute = routeKey === '/' ? 'home' : routeKey.replace(/^\//, '');
      const dvValue = `${normalizedRoute}:${variantSlug}`;
      const params = new URLSearchParams(searchParams.toString());
      params.set('_dv', dvValue);
      params.set('_de', '1'); // Keep drawer open after variant switch
      router.push(`${pathname}?${params.toString()}`);

      // Auto-apply a curated palette when switching home variants in the demo.
      // This ensures each variant looks visually intentional rather than inheriting
      // whatever the demo tenant's default colours happen to be.
      if (routeKey === '/') {
        const curated = VARIANT_PALETTES[variantSlug];
        if (curated) {
          setBrand((prev) => ({
            ...prev,
            primary:    curated.primary,
            secondary:  curated.secondary,
            accent:     curated.accent,
            bgColour:   curated.bgColour,
            textColour: curated.textColour,
          }));
        }
      }
    },
    [pathname, searchParams, router],
  );

  const resetVariant = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('_dv');
    params.set('_de', '1'); // Keep drawer open after reset
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
        <span className="demo-explorer-tab-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <span className="demo-explorer-tab-label">Explore</span>
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
          <button
            className="demo-explorer-tab-btn"
            data-active={activeTab === 'style'}
            onClick={() => setActiveTab('style')}
          >
            Style
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
              {/* Dark Mode Toggle */}
              <div className="demo-explorer-scheme-row">
                <span className="demo-explorer-scheme-label">Dark Mode</span>
                <button
                  className="demo-explorer-scheme-toggle"
                  data-on={isDark}
                  onClick={() => setIsDark((v) => !v)}
                  role="switch"
                  aria-checked={isDark}
                  aria-label="Toggle dark mode"
                >
                  <span className="demo-explorer-scheme-thumb" />
                </button>
              </div>
              <div className="demo-explorer-scheme-divider" />

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

              {/* Custom Brand Colours */}
              <p className="demo-explorer-section-label" style={{ marginTop: '1rem' }}>Custom Colours</p>
              <div className="demo-explorer-colour-inputs">
                {[
                  { key: 'primary',   label: 'Primary'   },
                  { key: 'secondary', label: 'Secondary' },
                  { key: 'accent',    label: 'Accent'    },
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

          {/* - Style Tab - */}
          {activeTab === 'style' && (
            <>
              {/* Font Pairs — quick presets */}
              <p className="demo-explorer-section-label">Font Pairs</p>
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

              {/* Individual Font Selectors */}
              <p className="demo-explorer-section-label" style={{ marginTop: '1rem' }}>Individual Fonts</p>
              <div className="demo-explorer-font-selects">
                {([
                  { key: 'fontDisplay', label: 'Display / Hero', hint: 'Blank = use Heading font' },
                  { key: 'fontHeading', label: 'Heading (H2–H4)', hint: '' },
                  { key: 'fontBody',    label: 'Body',            hint: '' },
                ] as { key: keyof BrandPreview; label: string; hint: string }[]).map(({ key, label, hint }) => (
                  <div key={key} className="demo-explorer-font-select-row">
                    <label className="demo-explorer-font-select-label">{label}</label>
                    <select
                      className="demo-explorer-font-select"
                      value={brand[key] as string}
                      onChange={(e) => updateBrand({ [key]: e.target.value } as Partial<BrandPreview>)}
                    >
                      {key === 'fontDisplay' && (
                        <option value="">— Same as Heading —</option>
                      )}
                      {FONT_OPTIONS.map((font) => (
                        <option key={font} value={font}>{font}</option>
                      ))}
                    </select>
                    {hint && <span className="demo-explorer-font-select-hint">{hint}</span>}
                  </div>
                ))}
              </div>

              {/* Text, Heading & Background colours */}
              <p className="demo-explorer-section-label" style={{ marginTop: '1rem' }}>Text & Background</p>
              <div className="demo-explorer-colour-inputs">
                {[
                  { key: 'headingColour', label: 'Headings'   },
                  { key: 'textColour',    label: 'Body Text'  },
                  { key: 'bgColour',      label: 'Background' },
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
