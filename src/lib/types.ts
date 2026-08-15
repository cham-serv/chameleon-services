/**
 * Shared types for the Chameleon multi-tenant rendering pipeline.
 *
 * Used by: tenant resolver, catch-all page, template definitions,
 * template components, and DemoExplorer.
 */

import type { ComponentType } from 'react';

// ── Tenant Config (from engine API) ─────────────────────────────────────────

export type TenantConfig = {
  tenant: {
    id: number;
    slug: string;
    name: string;
    template: TemplateInfo | null;
    featureConfig: FeatureConfig;
    isDemoTenant: boolean;
  };
  settings: SiteSettings | null;
};

export type TemplateInfo = {
  slug: string;
  name: string;
  category: string;
  supportedFeatures: string[];
  featureVariants: Record<string, {
    variants: string[];
    default: string;
  }>;
};

export type FeatureConfig = Record<string, {
  enabled: boolean;
  variant?: string;
}>;

export type SiteSettings = {
  siteName?: string;
  tagline?: string;
  contactEmail?: string;
  colourPrimary?: string;
  colourSecondary?: string;
  colourBackground?: string;
  colourText?: string;
  fontHeading?: string;
  fontBody?: string;
  logo?: { url: string } | null;
  currency?: string;
  paymentGateway?: string;
  flatShippingRate?: number;
  freeShippingThreshold?: number;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
  };
  // Commerce fields
  currency?: string;
  paymentGateway?: string;
  flatShippingRate?: number;
  freeShippingThreshold?: number;
};

// ── Page Component Props ────────────────────────────────────────────────────

/** Props passed to every template page component. */
export type PageProps = {
  config: TenantConfig;
  path: string[];
  variant: string;
  searchParams: Record<string, string | string[] | undefined>;
};

/** Props passed to every template layout component. */
export type LayoutProps = {
  config: TenantConfig;
  children: React.ReactNode;
};

// ── Template Definition (route map contract) ────────────────────────────────

export type PageVariant = {
  /** Human-readable name shown in DemoExplorer (e.g. "Split Image") */
  label: string;
  /** Lazy loader for the page component */
  component: () => Promise<{ default: ComponentType<PageProps> }>;
};

export type PageDefinition = {
  /** Human-readable page name (e.g. "Contact Page", "Shop") */
  label: string;
  /** The featureConfig key that must be enabled. null = always available (home). */
  feature: string | null;
  /** Available layout variants keyed by slug */
  variants: Record<string, PageVariant>;
  /** Which variant slug to use if none specified */
  defaultVariant: string;
};

export type TemplateDefinition = {
  slug: string;
  name: string;
  /** Maps URL path patterns to page definitions */
  routes: Record<string, PageDefinition>;
  /** Template-level wrapper (header, footer, nav) */
  layout: () => Promise<{ default: ComponentType<LayoutProps> }>;
};

// ── Resolved Page (output of resolvePage) ───────────────────────────────────

export type ResolvedPage = {
  page: PageDefinition;
  routeKey: string;
  variant: string;
  Component: ComponentType<PageProps>;
};
