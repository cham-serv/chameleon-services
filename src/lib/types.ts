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
  pageConfig: PageConfig | null;
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
};

// ── Page Config (from atlas-site-config via tenant-config API) ───────────────

export type PageConfigMedia = { url: string; alt?: string; width?: number; height?: number } | null;

export type PageConfigPages = {
  home?: { variant?: string };
  about?: { enabled?: boolean; variant?: string };
  shop?: { enabled?: boolean; variant?: string };
  contact?: { enabled?: boolean; variant?: string };
  resources?: { enabled?: boolean; variant?: string };
  faqs?: { enabled?: boolean; variant?: string };
  legal?: { enabled?: boolean };
};

export type PageConfigTeamMember = {
  name: string;
  role?: string;
  photo?: PageConfigMedia;
  bio?: string;
};

export type PageConfigBusinessHours = {
  days: string;
  hours: string;
};

export type PageConfig = {
  // Brand identity (Settings tab)
  siteName?: string | null;
  tagline?: string | null;
  logo?: PageConfigMedia;
  logoMark?: PageConfigMedia;
  contactEmail?: string | null;
  contactPhone?: string | null;
  colourPrimary?: string | null;
  colourSecondary?: string | null;
  colourAccent?: string | null;
  colourBackground?: string | null;
  fontHeading?: string | null;
  fontBody?: string | null;

  // Page enablement & variants
  pages?: PageConfigPages | null;

  // Home page content
  homeHeroHeadline?: string | null;
  homeHeroSubheadline?: string | null;
  homeHeroImage?: PageConfigMedia;
  homeHeroVideoUrl?: string | null;
  homeHeroVideoFallback?: PageConfigMedia;
  homeCta1Text?: string | null;
  homeCta1Link?: string | null;
  homeCta2Text?: string | null;
  homeCta2Link?: string | null;
  homeSeoTitle?: string | null;
  homeSeoDescription?: string | null;
  homeSeoOgImage?: PageConfigMedia;

  // About page content
  aboutHeadline?: string | null;
  aboutIntro?: string | null;
  aboutStory?: unknown; // richText JSON
  aboutSplitImage?: PageConfigMedia;
  aboutTeamMembers?: PageConfigTeamMember[] | null;
  aboutSeoTitle?: string | null;
  aboutSeoDescription?: string | null;

  // Shop page content
  shopHeadline?: string | null;
  shopSubheadline?: string | null;
  shopSeoTitle?: string | null;
  shopSeoDescription?: string | null;

  // Contact page content
  contactHeadline?: string | null;
  contactSubheadline?: string | null;
  contactImage?: PageConfigMedia;
  contactMapEmbedUrl?: string | null;
  contactBusinessHours?: PageConfigBusinessHours[] | null;
  contactSeoTitle?: string | null;
  contactSeoDescription?: string | null;

  // Resources page content
  resourcesHeadline?: string | null;
  resourcesSubheadline?: string | null;
  resourcesSeoTitle?: string | null;
  resourcesSeoDescription?: string | null;

  // FAQs page content
  faqsHeadline?: string | null;
  faqsSubheadline?: string | null;
  faqsSeoTitle?: string | null;
  faqsSeoDescription?: string | null;

  // Legal page content
  legalHeadline?: string | null;
  legalSeoTitle?: string | null;
  legalSeoDescription?: string | null;
};

// ── Page Component Props ────────────────────────────────────────────────────

/** Props passed to every template page component. */
export type PageProps = {
  config: TenantConfig;
  path: string[];
  variant: string;
  searchParams: Record<string, string | string[] | undefined>;
  /** True on *.chameleon.services staging subdomains — disables ISR cache for instant feedback */
  noCache: boolean;
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
  /** Short description shown in DemoExplorer (e.g. "Product-first layout with featured items") */
  description?: string;
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
