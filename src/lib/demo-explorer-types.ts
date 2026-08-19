/**
 * DemoExplorer Types
 *
 * Serialisable route metadata passed from the server layout
 * to the client-side DemoExplorer drawer. Deliberately excludes
 * component loaders (not serialisable)  only labels and slugs.
 */

export type ExplorerRoute = {
  /** Route key from the template definition, e.g. '/', '/shop', '/contact' */
  routeKey: string;
  /** Human-readable page name, e.g. 'Home', 'Shop' */
  label: string;
  /** Feature key that must be enabled, or null for always-on pages */
  feature: string | null;
  /** The default variant slug for this route */
  defaultVariant: string;
  /** Available variants for this route */
  variants: ExplorerVariant[];
};

export type ExplorerVariant = {
  /** Variant slug, e.g. 'hero-static', 'editorial' */
  slug: string;
  /** Human-readable variant name, e.g. 'Hero Static', 'Editorial' */
  label: string;
  /** Short description for the explorer UI */
  description?: string;
};
