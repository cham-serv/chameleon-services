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
