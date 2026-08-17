/**
 * DemoExplorer Utilities — Server-side
 *
 * Extracts serialisable route metadata from a template definition,
 * filtered by the tenant's enabled features. The output is safe to
 * pass as a React prop to the client-side DemoExplorer component.
 */

import type { FeatureConfig, TemplateDefinition } from '@/lib/types';
import type { ExplorerRoute } from '@/lib/demo-explorer-types';

/**
 * Builds the list of explorable routes from a template definition.
 *
 * - Filters out routes whose feature is disabled in featureConfig
 * - Strips component loaders (not serialisable to the client)
 * - Skips wildcard detail routes (e.g. /shop/*) since the visitor
 *   can't meaningfully switch variants on a detail page without content
 */
export function buildExplorerRoutes(
  templateDef: TemplateDefinition,
  featureConfig: FeatureConfig,
): ExplorerRoute[] {
  const routes: ExplorerRoute[] = [];

  for (const [routeKey, page] of Object.entries(templateDef.routes)) {
    // Skip wildcard detail routes — they have one variant and switching
    // doesn't make sense without specific content loaded
    if (routeKey.endsWith('/*')) continue;

    // Check feature enablement (null feature = always available)
    if (page.feature !== null) {
      const entry = featureConfig[page.feature];
      if (!entry?.enabled) continue;
    }

    // Build serialisable variant list
    const variants = Object.entries(page.variants).map(([slug, variant]) => ({
      slug,
      label: variant.label,
      description: variant.description,
    }));

    routes.push({
      routeKey,
      label: page.label,
      feature: page.feature,
      defaultVariant: page.defaultVariant,
      variants,
    });
  }

  return routes;
}
