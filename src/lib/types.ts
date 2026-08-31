/**
 * Shared types for the Chameleon multi-tenant rendering pipeline.
 *
 * Used by: tenant resolver, catch-all page, template definitions,
 * template components, and DemoExplorer.
 */

import type { ComponentType } from 'react';

// - Tenant Config (from engine API) -

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
  logo?: { url: string } | null;
  logoMark?: { url: string } | null;
  // Contact
  contactEmail?: string;
  contactPhone?: string;
  // Structured address (for LocalBusiness schema)
  addressStreet?: string;
  addressCity?: string;
  addressProvince?: string;
  addressPostalCode?: string;
  addressCountry?: string;
  geoLat?: number;
  geoLng?: number;
  // Opening hours (OpeningHoursSpecification)
  openingHours?: Array<{
    dayOfWeek: string[];
    isClosed?: boolean;
    opens?: string;
    closes?: string;
  }>;
  // Social links - flat fields as exposed by engine (NOT nested socialLinks)
  socialFacebook?: string;
  socialInstagram?: string;
  socialLinkedIn?: string;
  socialTwitter?: string;
  socialYoutube?: string;
  socialGoogle?: string;
  // Brand tokens
  colourPrimary?: string;
  colourSecondary?: string;
  colourAccent?: string;
  colourBackground?: string;
  colourText?: string;
  /** Controls button shape. CSS applied via data-btn-style on <body>. */
  buttonStyle?: 'filled' | 'outline' | 'pill' | 'soft';
  fontHeading?: string;
  fontBody?: string;
  // Ecommerce
  /**
   * Controls the overall store behaviour and maps to the Chameleon pricing tier.
   * 'retail'    = Full ecommerce with payment (Atlas)
   * 'quote'     = Quote-only, prices hidden, no payment gateway (Atlas Light)
   * 'trade'     = B2B authenticated pricing (future)
   * 'catalogue' = Browse-only, no ordering (future)
   */
  storeMode?: 'retail' | 'quote' | 'trade' | 'catalogue';
  currency?: string;
  currencySymbol?: string;
  paymentGateway?: string;
  flatShippingRate?: number;
  freeShippingThreshold?: number;
  // Feature flags
  enableReviews?: boolean;
  enableSubscriptions?: boolean;
  enableWishlist?: boolean;
  enableStockUrgency?: boolean;
  enableQuickView?: boolean;
  enableProductComparison?: boolean;
  enableReorderLinks?: boolean;
  // Global schema defaults (fallbacks when product fields are blank)
  defaultReturnDays?: number;
  defaultReturnMethod?: string;
  defaultReturnFees?: string;
  defaultDeliveryLeadTime?: string;
  defaultHandlingTimeDays?: number;
  defaultDeliveryRegions?: Array<{ region: string }>;
  // Turnstile (safe public-side key)
  turnstileSiteKey?: string;
};

// - Page Config (from atlas-site-config via tenant-config API) -

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
  buttonStyle?: 'filled' | 'outline' | 'pill' | 'soft' | null;
  fontHeading?: string | null;
  fontBody?: string | null;

  // Page enablement & variants
  pages?: PageConfigPages | null;

  // Home page - variant-specific content
  homeStorefrontHeadline?: string | null;
  homeStorefrontSubheadline?: string | null;
  homeStorefrontHeroImage?: PageConfigMedia;
  homeEditorialHeadline?: string | null;
  homeEditorialSubheadline?: string | null;
  homeEditorialHeroImage?: PageConfigMedia;
  homeEditorialExcerpt?: string | null;
  homeModernHeadline?: string | null;
  homeModernSubheadline?: string | null;
  homeModernHeroImage?: PageConfigMedia;
  homeBoldHeadline?: string | null;
  homeBoldSubheadline?: string | null;
  homeBoldHeroImage?: PageConfigMedia;
  homeMinimalistHeadline?: string | null;
  homeMinimalistSubheadline?: string | null;
  homeMinimalistHeroImage?: PageConfigMedia;

  // Home page - shared content
  homeCta1Text?: string | null;
  homeCta1Link?: string | null;
  homeCta2Text?: string | null;
  homeCta2Link?: string | null;
  homeSeoTitle?: string | null;
  homeSeoDescription?: string | null;
  homeSeoOgImage?: PageConfigMedia;

  // Home page - storefront trust bar (storefront variant only).
  // Each item has an optional icon (emoji/character) and a required text label.
  // • null / undefined  → falls back to the built-in defaults (Free Shipping, Easy Returns, etc.)
  // • empty array []    → hides the trust bar entirely
  // • populated array   → renders exactly what the tenant supplies, in order
  homeTrustSignals?: Array<{ icon?: string | null; text: string }> | null;

  // Home page - shared sections (all variants)
  homeTestimonialsHeading?: string | null;
  homeTestimonials?: Array<{
    quote: string;
    author: string;
    role?: string | null;
    rating?: number | null;
  }> | null;
  homeLogosHeading?: string | null;
  homeLogos?: Array<{
    name: string;
    logo: PageConfigMedia;
    url?: string | null;
  }> | null;
  homeLogosBeforeTestimonials?: boolean | null;

  // Home page - variant-specific sections (storefront, modern, bold, minimalist)
  homeStoryHeadline?: string | null;
  homeStoryBlurb?: string | null;
  homeStoryImage?: PageConfigMedia;
  homeStoryCtaText?: string | null;
  homeStoryCtaLink?: string | null;
  homeSecondRowHeading?: string | null;
  homeSecondRowSort?: 'newest' | 'price-asc' | 'price-desc' | 'name' | null;
  homeSecondRowLimit?: number | null;

  // Global announcement strip (all pages, lives in layout)
  announcementEnabled?: boolean | null;
  announcementText?: string | null;
  announcementLink?: string | null;
  announcementLinkText?: string | null;
  announcementStyle?: 'info' | 'promo' | 'urgent' | null;

  // About page content
  aboutHeadline?: string | null;
  aboutIntro?: string | null;
  aboutStory?: unknown; // richText JSON
  aboutSplitImage?: PageConfigMedia;
  aboutTeamMembers?: PageConfigTeamMember[] | null;
  // About page - variant-specific content
  aboutTeamGridHeadline?: string | null;
  aboutTeamGridIntro?: string | null;
  aboutTeamGridImage?: PageConfigMedia;
  aboutStorySplitHeadline?: string | null;
  aboutStorySplitIntro?: string | null;
  aboutStorySplitImage?: PageConfigMedia;
  aboutManifestoHeadline?: string | null;
  aboutManifestoSubheadline?: string | null;
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

// - Page Component Props -

/** Props passed to every template page component. */
export type PageProps = {
  config: TenantConfig;
  path: string[];
  variant: string;
  searchParams: Record<string, string | string[] | undefined>;
  /** True on *.chameleon.services staging subdomains - disables ISR cache for instant feedback */
  noCache: boolean;
};

/** Props passed to every template layout component. */
export type LayoutProps = {
  config: TenantConfig;
  children: React.ReactNode;
};

// - Template Definition (route map contract) -

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
  /**
   * If false, the page is hidden from the Demo Explorer pages list.
   * Useful for transactional pages (cart, checkout, order confirmation)
   * that don't make sense as standalone demo destinations.
   * Defaults to true.
   */
  navigableInDemo?: boolean;
};

export type TemplateDefinition = {
  slug: string;
  name: string;
  /** Maps URL path patterns to page definitions */
  routes: Record<string, PageDefinition>;
  /** Template-level wrapper (header, footer, nav) */
  layout: () => Promise<{ default: ComponentType<LayoutProps> }>;
};

// - Resolved Page (output of resolvePage) -

export type ResolvedPage = {
  page: PageDefinition;
  routeKey: string;
  variant: string;
  Component: ComponentType<PageProps>;
};
