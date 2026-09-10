/**
 * @deprecated jsonld.ts — DEPRECATED
 *
 * This file previously contained all schema.org JSON-LD builder functions.
 * The GEO/SEO intelligence has been moved to chameleon-engine (private IP)
 * and is pre-computed at the tenant-config API level.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * MIGRATION SUMMARY
 * ────────────────────────────────────────────────────────────────────────────
 *
 * REMOVED from frontend (now live in chameleon-engine/src/lib/schema-builders.ts):
 *   - buildOrganizationLd      → engine: buildOrganizationLd
 *   - buildLocalBusinessLd     → engine: buildLocalBusinessLd
 *   - buildProductLd           → engine: buildProductLd  (via products/_schema API field)
 *   - buildCategoryHubLd       → engine: buildCategoryHubLd (via tenant-config schemas)
 *   - buildArticleLd           → engine: buildArticleLd  (via articles/_schema API field)
 *   - buildFAQPageLd           → engine: buildFAQPageLd  (via faqs/_schema API field)
 *   - buildServiceLd           → engine: buildServiceLd  (via services/_schema API field)
 *
 * RETAINED in frontend (structural utilities — legitimate runtime computation):
 *   - buildBreadcrumbLd        → src/lib/schema-utils.ts
 *   - buildCategoryHubLd       → src/lib/schema-utils.ts  (dynamic per-category)
 *   - BreadcrumbItem type      → src/lib/schema-utils.ts
 *
 * ────────────────────────────────────────────────────────────────────────────
 * HOW SCHEMAS ARE INJECTED NOW
 * ────────────────────────────────────────────────────────────────────────────
 *
 * Global (every page):
 *   <PageSchemas global={config.schemas?.global} />
 *   → injected in AtlasLayout.tsx and (tenant)/layout.tsx
 *
 * Page-specific:
 *   <PageSchemas page={config.schemas?.pages.home} />
 *   → injected in each page component
 *
 * Entity schemas (detail pages):
 *   <JsonLd data={product._schema} />
 *   <JsonLd data={article._schema} />
 *   <JsonLd data={member._schema} />
 *   → _schema is a computed field returned by the engine API (Phase 2)
 *
 * ────────────────────────────────────────────────────────────────────────────
 * This file exports re-exports from schema-utils.ts for backwards compatibility
 * only. Do NOT add new functions here. Add to schema-utils.ts or chameleon-engine.
 * ────────────────────────────────────────────────────────────────────────────
 */

// Re-exports for backwards compatibility — real implementations in schema-utils.ts
export { buildBreadcrumbLd, buildCategoryHubLd } from './schema-utils';
export type { BreadcrumbItem } from './schema-utils';
