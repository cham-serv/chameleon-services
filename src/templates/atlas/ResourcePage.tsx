/**
 * Atlas ResourcePage — Server Component
 *
 * Dual-mode page that handles:
 *   1. Topic Hub  (/resources/{topic-slug})  — lists articles under a topic
 *   2. Single Article (/resources/{topic-slug}/{article-slug}) — renders article
 *
 * The catch-all resolver sends path = ['resources', topic-slug] or
 * path = ['resources', topic-slug, article-slug].
 */

import Link from 'next/link';
import Image from 'next/image';
import type { PageProps } from '@/lib/types';
import type { Article, Topic, MediaItem } from '@/lib/api';
import { getArticles, getArticleBySlug, getTopics } from '@/lib/api';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ArticleCard } from '@/components/ArticleCard';
import { RichTextRenderer } from '@/components/RichTextRenderer';
import { JsonLd } from '@/components/JsonLd';
import { notFound } from 'next/navigation';

export default async function ResourcePage({ config, path }: PageProps) {
  const tenant = config.tenant.slug;
  const siteUrl = `https://${tenant}.chameleon.services`;
  const siteName = config.settings?.siteName ?? config.tenant.name;

  // path[0] = 'resources', path[1] = topic-slug, path[2] = article-slug
  const topicSlug = path[1];
  const articleSlug = path[2];

  if (!topicSlug) notFound();

  // Resolve topic name from the topics list
  const topicsRes = await getTopics(tenant);
  const topics = topicsRes?.docs ?? [];
  const topic = topics.find((t) => t.slug === topicSlug) ?? null;
  const topicName = topic?.name ?? topicSlug;

  if (articleSlug) {
    return renderArticle({ tenant, siteUrl, siteName, topicSlug, topicName, articleSlug, topics, config });
  }

  return renderTopicHub({ tenant, siteUrl, siteName, topicSlug, topicName, topic });
}

// ── Topic Hub View ──────────────────────────────────────────────────────────

type TopicHubProps = {
  tenant: string;
  siteUrl: string;
  siteName: string;
  topicSlug: string;
  topicName: string;
  topic: Topic | null;
};

async function renderTopicHub({ tenant, siteUrl, siteName, topicSlug, topicName, topic }: TopicHubProps) {
  const res = await getArticles({ tenant, topic: topicSlug, limit: 50 });
  const articles: Article[] = res?.docs ?? [];

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Resources', href: '/resources' },
    { label: topicName },
  ];

  // Featured = first article
  const featured = articles[0] ?? null;
  const remaining = articles.slice(1);

  // CollectionPage JSON-LD
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${topicName} — ${siteName}`,
    description: topic?.description || `Articles about ${topicName} from ${siteName}.`,
    url: `${siteUrl}/resources/${topicSlug}`,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.geo-speakable'],
    },
    ...(articles.length > 0 && {
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: articles.map((article, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${siteUrl}/resources/${topicSlug}/${article.slug}`,
          name: article.title,
        })),
      },
    }),
  };

  return (
    <>
      <JsonLd data={schema} />

      {/* Dark Hero */}
      <section
        style={{
          background: 'var(--brand-primary, #2d6a4f)',
          color: '#fff',
          padding: 'var(--atlas-spacing-2xl) 0',
        }}
      >
        <div className="atlas-container">
          <Breadcrumbs items={breadcrumbs} baseUrl={siteUrl} />
          <div className="geo-speakable" style={{ marginTop: 'var(--atlas-spacing-lg)' }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: 'var(--atlas-spacing-sm)' }}>
              {topic?.icon || '📚'}
            </span>
            <h1 className="atlas-h1" style={{ color: '#fff' }}>{topicName}</h1>
            {topic?.description && (
              <p className="atlas-body-lg" style={{ marginTop: 'var(--atlas-spacing-sm)', opacity: 0.85, maxWidth: 600 }}>
                {topic.description}
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="atlas-container atlas-section-sm">
        {articles.length === 0 ? (
          <div className="atlas-card-flat" style={{ padding: 'var(--atlas-spacing-2xl)', textAlign: 'center' }}>
            <p className="atlas-body" style={{ opacity: 0.6 }}>
              No articles have been published in this topic yet.
            </p>
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {featured && (
              <Link
                href={`/resources/${topicSlug}/${featured.slug}`}
                className="atlas-card atlas-fade-in"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  textDecoration: 'none',
                  color: 'inherit',
                  overflow: 'hidden',
                }}
              >
                {/* Hero image */}
                <div style={{ position: 'relative', aspectRatio: '21/9', overflow: 'hidden' }}>
                  {resolveMedia(featured.heroImage) ? (
                    <Image
                      src={resolveMedia(featured.heroImage)!.url}
                      alt={resolveMedia(featured.heroImage)?.alt ?? featured.title}
                      fill
                      sizes="100vw"
                      style={{ objectFit: 'cover' }}
                      priority
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, color-mix(in srgb, var(--brand-primary) 20%, transparent), color-mix(in srgb, var(--brand-secondary, #00E5FF) 20%, transparent))' }} />
                  )}
                </div>
                <div style={{ padding: 'var(--atlas-spacing-lg)' }}>
                  <span className="atlas-badge" style={{ marginBottom: 'var(--atlas-spacing-sm)' }}>Featured</span>
                  <h2 className="atlas-h3" style={{ marginTop: 'var(--atlas-spacing-xs)' }}>{featured.title}</h2>
                  {featured.excerpt && (
                    <p className="atlas-body" style={{ marginTop: 'var(--atlas-spacing-sm)', opacity: 0.7 }}>
                      {featured.excerpt}
                    </p>
                  )}
                  <div className="atlas-caption" style={{ marginTop: 'var(--atlas-spacing-sm)', opacity: 0.5 }}>
                    {featured.readTime && `${featured.readTime} min read`}
                    {featured.readTime && featured.publishedAt && ' · '}
                    {featured.publishedAt && formatDate(featured.publishedAt)}
                  </div>
                </div>
              </Link>
            )}

            {/* Article Grid */}
            {remaining.length > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: 'var(--atlas-spacing-xl)',
                  marginTop: 'var(--atlas-spacing-2xl)',
                }}
              >
                {remaining.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    basePath={`/resources/${topicSlug}`}
                    className="atlas-card atlas-fade-in"
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

// ── Single Article View ─────────────────────────────────────────────────────

type ArticleViewProps = {
  tenant: string;
  siteUrl: string;
  siteName: string;
  topicSlug: string;
  topicName: string;
  articleSlug: string;
  topics: Topic[];
  config: PageProps['config'];
};

async function renderArticle({ tenant, siteUrl, siteName, topicSlug, topicName, articleSlug, topics, config }: ArticleViewProps) {
  const article = await getArticleBySlug(tenant, articleSlug);
  if (!article) notFound();

  const heroImage = resolveMedia(article.heroImage);
  const articleTopic = article.topic && typeof article.topic === 'object' ? article.topic : null;

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Resources', href: '/resources' },
    { label: topicName, href: `/resources/${topicSlug}` },
    { label: article.title },
  ];

  // Related articles — same topic, exclude current
  const relatedRes = await getArticles({ tenant, topic: topicSlug, limit: 6 });
  const relatedArticles = (relatedRes?.docs ?? []).filter((a) => a.id !== article.id).slice(0, 5);

  // Extract headings for Table of Contents (best effort from Lexical JSON)
  const headings = extractHeadings(article.content);

  // Article JSON-LD
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    url: `${siteUrl}/resources/${topicSlug}/${article.slug}`,
    datePublished: article.publishedAt ?? article.createdAt,
    dateModified: article.updatedAt,
    ...(heroImage && { image: heroImage.url }),
    ...(article.author && {
      author: { '@type': 'Person', name: article.author },
    }),
    publisher: {
      '@type': 'Organization',
      name: siteName,
      ...(config.settings?.logo && { logo: { '@type': 'ImageObject', url: config.settings.logo.url } }),
    },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.geo-speakable'],
    },
  };

  return (
    <>
      <JsonLd data={articleSchema} />

      <div className="atlas-container atlas-section-sm">
        <Breadcrumbs items={breadcrumbs} baseUrl={siteUrl} />

        {/* Article Layout: content + sidebar */}
        <div
          className="atlas-article-layout"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 'var(--atlas-spacing-2xl)',
            marginTop: 'var(--atlas-spacing-lg)',
          }}
        >
          {/* Main Content */}
          <article>
            {/* Header */}
            <header className="geo-speakable">
              {articleTopic && (
                <Link href={`/resources/${topicSlug}`} className="atlas-badge" style={{ textDecoration: 'none' }}>
                  {articleTopic.name}
                </Link>
              )}
              <h1 className="atlas-h1" style={{ marginTop: 'var(--atlas-spacing-sm)' }}>
                {article.title}
              </h1>

              {/* Meta row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--atlas-spacing-md)', marginTop: 'var(--atlas-spacing-md)' }}>
                {article.author && (
                  <span className="atlas-body" style={{ fontWeight: 600 }}>{article.author}</span>
                )}
                {article.publishedAt && (
                  <time dateTime={article.publishedAt} className="atlas-caption" style={{ opacity: 0.6 }}>
                    {formatDate(article.publishedAt)}
                  </time>
                )}
                {article.readTime && (
                  <span className="atlas-caption" style={{ opacity: 0.6 }}>
                    {article.readTime} min read
                  </span>
                )}
              </div>
            </header>

            {/* Hero Image */}
            {heroImage && (
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '16/9',
                  borderRadius: 'var(--atlas-radius-lg)',
                  overflow: 'hidden',
                  marginTop: 'var(--atlas-spacing-xl)',
                }}
              >
                <Image
                  src={heroImage.url}
                  alt={heroImage.alt ?? article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 65vw"
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </div>
            )}

            {/* Article Body */}
            {article.content != null && (
              <div className="atlas-article-body" style={{ marginTop: 'var(--atlas-spacing-2xl)' }}>
                <RichTextRenderer content={article.content as Record<string, unknown>} className="atlas-body" />
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside>
            {/* Table of Contents */}
            {headings.length > 0 && (
              <div className="atlas-card-flat atlas-toc" style={{ padding: 'var(--atlas-spacing-lg)', position: 'sticky', top: 'calc(var(--atlas-header-height, 64px) + var(--atlas-spacing-lg))' }}>
                <h3 className="atlas-h6" style={{ marginBottom: 'var(--atlas-spacing-sm)' }}>
                  Table of Contents
                </h3>
                <nav>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.8125rem', lineHeight: 2 }}>
                    {headings.map((h, i) => (
                      <li key={i} style={{ paddingLeft: h.level === 3 ? '1rem' : 0 }}>
                        <span className="atlas-caption" style={{ opacity: 0.7 }}>
                          {h.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            )}

            {/* Related Resources */}
            {relatedArticles.length > 0 && (
              <div style={{ marginTop: 'var(--atlas-spacing-xl)' }}>
                <h3 className="atlas-h6" style={{ marginBottom: 'var(--atlas-spacing-md)' }}>
                  Related Resources
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--atlas-spacing-sm)' }}>
                  {relatedArticles.map((related) => (
                    <Link
                      key={related.id}
                      href={`/resources/${topicSlug}/${related.slug}`}
                      className="atlas-card-flat"
                      style={{
                        display: 'block',
                        padding: 'var(--atlas-spacing-sm) var(--atlas-spacing-md)',
                        textDecoration: 'none',
                        color: 'inherit',
                        transition: 'background 0.2s',
                      }}
                    >
                      <h4 style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 600, lineHeight: 1.4 }}>
                        {related.title}
                      </h4>
                      {related.readTime && (
                        <span className="atlas-caption" style={{ opacity: 0.5, marginTop: 2, display: 'block' }}>
                          {related.readTime} min read
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function resolveMedia(media: MediaItem | number | null | undefined): MediaItem | null {
  if (!media || typeof media === 'number') return null;
  return media;
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-ZA', {
    year: 'numeric', month: 'short', day: 'numeric',
  }).format(new Date(iso));
}

type Heading = { level: number; text: string };

/**
 * Best-effort heading extraction from Lexical JSON.
 * Walks the node tree looking for heading nodes.
 */
function extractHeadings(content: unknown): Heading[] {
  if (!content || typeof content !== 'object') return [];
  const headings: Heading[] = [];

  function walk(node: Record<string, unknown>) {
    if (node.type === 'heading' && typeof node.tag === 'string') {
      const level = parseInt(node.tag.replace('h', ''), 10);
      if (level >= 2 && level <= 3) {
        const text = extractText(node);
        if (text) headings.push({ level, text });
      }
    }
    const root = node.root as Record<string, unknown> | undefined;
    const children = node.children ?? root?.children;
    if (Array.isArray(children)) {
      for (const child of children) {
        if (child && typeof child === 'object') walk(child as Record<string, unknown>);
      }
    }
  }

  walk(content as Record<string, unknown>);
  return headings;
}

function extractText(node: Record<string, unknown>): string {
  if (typeof node.text === 'string') return node.text;
  if (Array.isArray(node.children)) {
    return node.children
      .map((c: unknown) => (c && typeof c === 'object' ? extractText(c as Record<string, unknown>) : ''))
      .join('');
  }
  return '';
}
