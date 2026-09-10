/**
 * JsonLd Component
 *
 * Renders a <script type="application/ld+json"> tag with the given
 * structured data object. Use with the builders from lib/jsonld.ts.
 *
 * @example
 * <JsonLd data={buildProductLd(product, config, url)} />
 */

type JsonLdProps = {
  data: Record<string, unknown>;
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        // Escape closing script tags to prevent XSS
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}

/**
 * PageSchemas
 *
 * Renders a set of pre-computed JSON-LD objects returned by the engine.
 * The frontend never knows how these were built — it just injects them.
 *
 * Usage in Meridian pages:
 *   <PageSchemas global={config.schemas?.global} page={config.schemas?.pages.home} />
 *
 * @param global - Engine-computed global schemas (business entity, etc.) — emitted on every page.
 *                 Typically passed ONLY from layout.tsx to avoid double-emit on each page render.
 * @param page   - Engine-computed page-level schemas for the current page slug.
 */
type PageSchemasProps = {
  global?: Record<string, unknown>[] | null;
  page?: Record<string, unknown>[] | null;
};

export function PageSchemas({ global, page }: PageSchemasProps) {
  const schemas = [
    ...(global ?? []),
    ...(page ?? []),
  ];
  if (schemas.length === 0) return null;
  return (
    <>
      {schemas.map((schema, i) => (
        <JsonLd key={i} data={schema} />
      ))}
    </>
  );
}
