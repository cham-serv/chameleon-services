/**
 * Atlas ResourcesPage — Server Component
 *
 * Topic Directory page — the knowledge graph entry point.
 * Lists topics as navigable categories, each linking to a topic hub.
 *
 * Variants: grid (card-based), magazine (list-based, text-heavy)
 */

import Link from 'next/link';
import type { PageProps } from '@/lib/types';
import { getTopics, type Topic } from '@/lib/api';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';

export default async function ResourcesPage({ config, variant }: PageProps) {
  const tenant = config.tenant.slug;
  const siteName = config.settings?.siteName ?? config.tenant.name;
  const siteUrl = `https://${tenant}.chameleon.services`;
  const pc = config.pageConfig;

  // Content from pageConfig with fallbacks
  const headline = pc?.resourcesHeadline ?? 'Resource Directory';
  const subheadline = pc?.resourcesSubheadline ?? 'Explore our knowledge base — guides, insights, and expert analysis organised by topic.';

  const res = await getTopics(tenant);
  const topics: Topic[] = res?.docs ?? [];

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Resources' },
  ];

  // CollectionPage JSON-LD with topic sub-items
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Resource Directory — ${siteName}`,
    description: `Browse knowledge resources from ${siteName}, organised by topic.`,
    url: `${siteUrl}/resources`,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.geo-speakable'],
    },
    ...(topics.length > 0 && {
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: topics.map((topic, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${siteUrl}/resources/${topic.slug}`,
          name: topic.name,
        })),
      },
    }),
  };

  return (
    <>
      <JsonLd data={collectionSchema} />

      <div className="atlas-container atlas-section-sm">
        <Breadcrumbs items={breadcrumbs} baseUrl={siteUrl} />

        {/* Header */}
        <div className="geo-speakable" style={{ marginTop: 'var(--atlas-spacing-lg)' }}>
          <h1 className="atlas-h1">{headline}</h1>
          <p className="atlas-body-lg" style={{ marginTop: 'var(--atlas-spacing-sm)', opacity: 0.7, maxWidth: 600 }}>
            {subheadline}
          </p>
        </div>

        {topics.length === 0 ? (
          <div className="atlas-card-flat" style={{ padding: 'var(--atlas-spacing-2xl)', textAlign: 'center', marginTop: 'var(--atlas-spacing-2xl)' }}>
            <p className="atlas-body" style={{ opacity: 0.6 }}>
              No topics have been published yet. Check back soon.
            </p>
          </div>
        ) : variant === 'grid' ? (
          /* ── Grid variant ──────────────────────────────────── */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 'var(--atlas-spacing-xl)',
              marginTop: 'var(--atlas-spacing-2xl)',
            }}
          >
            {topics.map((topic) => (
              <Link
                key={topic.id}
                href={`/resources/${topic.slug}`}
                className="atlas-card atlas-fade-in"
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  color: 'inherit',
                  padding: 'var(--atlas-spacing-lg)',
                }}
              >
                {/* Icon */}
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: 'var(--atlas-spacing-sm)' }}>
                  {topic.icon || getTopicIcon(topic.type)}
                </span>
                <h2 className="atlas-h5">{topic.name}</h2>
                {topic.description && (
                  <p className="atlas-body" style={{ marginTop: 'var(--atlas-spacing-xs)', opacity: 0.7, fontSize: '0.875rem' }}>
                    {topic.description}
                  </p>
                )}
                {topic.articleCount != null && (
                  <span className="atlas-caption" style={{ display: 'block', marginTop: 'var(--atlas-spacing-sm)', opacity: 0.5 }}>
                    {topic.articleCount} article{topic.articleCount !== 1 ? 's' : ''}
                  </span>
                )}
                <span
                  className="atlas-caption"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    marginTop: 'var(--atlas-spacing-md)',
                    color: 'var(--brand-primary, #2d6a4f)',
                    fontWeight: 600,
                  }}
                >
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        ) : (
          /* ── Magazine variant ───────────────────────────────── */
          <div style={{ marginTop: 'var(--atlas-spacing-2xl)', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {topics.map((topic) => (
              <Link
                key={topic.id}
                href={`/resources/${topic.slug}`}
                className="atlas-card-flat atlas-fade-in"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--atlas-spacing-md)',
                  padding: 'var(--atlas-spacing-md) var(--atlas-spacing-lg)',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'background 0.2s',
                }}
              >
                <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>
                  {topic.icon || getTopicIcon(topic.type)}
                </span>
                <div style={{ flex: 1 }}>
                  <h2 className="atlas-h6" style={{ margin: 0 }}>{topic.name}</h2>
                  {topic.description && (
                    <p className="atlas-caption" style={{ margin: '2px 0 0', opacity: 0.6 }}>
                      {topic.description}
                    </p>
                  )}
                </div>
                {topic.articleCount != null && (
                  <span className="atlas-badge" style={{ flexShrink: 0 }}>
                    {topic.articleCount}
                  </span>
                )}
                <span style={{ color: 'var(--brand-primary, #2d6a4f)', fontSize: '1.25rem', flexShrink: 0 }}>→</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getTopicIcon(type?: string): string {
  switch (type) {
    case 'guide': return '📖';
    case 'news': return '📰';
    case 'research': return '🔬';
    case 'tutorial': return '🎓';
    case 'review': return '⭐';
    case 'opinion': return '💡';
    default: return '📚';
  }
}
