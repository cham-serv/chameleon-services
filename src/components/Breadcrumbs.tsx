/**
 * Breadcrumbs Component
 *
 * Renders breadcrumb navigation with schema.org BreadcrumbList JSON-LD.
 * Server Component. Templates override styling via the className prop.
 */

import { JsonLd } from '@/components/JsonLd';
import { buildBreadcrumbLd, type BreadcrumbItem as LdBreadcrumbItem } from '@/lib/jsonld';

export type BreadcrumbItem = {
  /** Display label for this breadcrumb segment */
  label: string;
  /** URL for this segment. Omit for the current page (last item). */
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  /** Base URL for JSON-LD (e.g. 'https://atlas-demo.chameleon.services') */
  baseUrl: string;
  className?: string;
};

export function Breadcrumbs({ items, baseUrl, className }: BreadcrumbsProps) {
  if (items.length === 0) return null;

  // Build JSON-LD data
  const ldItems: LdBreadcrumbItem[] = items.map((item) => ({
    name: item.label,
    url: item.href ? `${baseUrl}${item.href}` : baseUrl,
  }));

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <JsonLd data={buildBreadcrumbLd(ldItems)} />
      <ol
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '4px',
          listStyle: 'none',
          margin: 0,
          padding: 0,
          fontSize: '0.85rem',
        }}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li
              key={`${item.label}-${index}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {index > 0 && (
                <span
                  aria-hidden="true"
                  style={{ color: '#ccc', fontSize: '0.75rem' }}
                >
                  /
                </span>
              )}

              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  style={{
                    color: isLast ? '#333' : '#888',
                    fontWeight: isLast ? 500 : 400,
                  }}
                >
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href}
                  style={{
                    color: '#888',
                    textDecoration: 'none',
                  }}
                >
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
