'use client';

/**
 * BlogTopicFilterClient
 *
 * Client-side topic filter + article/topic grid for the Meridian Blog page.
 *
 * Two view modes:
 *   All Topics  → knowledge graph topic cards (entry points into each topic)
 *   Topic X     → 3-column article card grid filtered to that topic
 *
 * Reads ?topic=slug from URL on mount so direct links are deep-linkable.
 * All tab switching is instant, zero page reload (B1-B6 fixes).
 * Keyboard accessible: all tabs are <button role="tab">.
 */

import { useState, useEffect, useMemo } from 'react';
import type { Article, MediaItem, TeamMember } from '@/lib/api';

// --- Internal types ---

interface DerivedTopic {
  slug: string;
  name: string;
  count: number;
}

interface Props {
  articles: Article[];
}

// --- Helpers ---

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('en-ZA', {
      year: 'numeric', month: 'long', day: 'numeric',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

// --- Sub-components ---

function AuthorChip({ author }: { author: TeamMember | number | null | undefined }) {
  if (!author || typeof author === 'number') return null;
  const photoUrl =
    author.photo && typeof author.photo === 'object' && 'url' in author.photo
      ? (author.photo as { url: string }).url
      : null;
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4em' }}>
      {photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photoUrl}
          alt={author.name}
          style={{ width: 20, height: 20, borderRadius: '50%', objectFit: 'cover' }}
        />
      ) : (
        <span
          style={{
            width: 20, height: 20, borderRadius: '50%',
            background: 'color-mix(in srgb, var(--brand-primary, #1a2b5e) 15%, transparent)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.625rem', fontWeight: 700, color: 'var(--brand-primary, #1a2b5e)',
          }}
        >
          {author.name[0]}
        </span>
      )}
      {author.name}
    </span>
  );
}

function ArticleCard({ article }: { article: Article }) {
  const heroUrl =
    article.heroImage && typeof article.heroImage === 'object' && 'url' in article.heroImage
      ? (article.heroImage as MediaItem).url
      : null;
  const dateStr = article.publishedAt ?? article.createdAt;

  return (
    <a href={`/blog/${article.slug}`} className="mer-article-card">
      {heroUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="mer-article-card-image"
          src={heroUrl}
          alt={article.title}
          loading="lazy"
        />
      ) : (
        <div
          className="mer-article-card-image"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'color-mix(in srgb, var(--brand-primary, #1a2b5e) 8%, var(--brand-surface, #f5f5f5) 92%)',
            color: 'color-mix(in srgb, var(--brand-primary, #1a2b5e) 40%, transparent)',
            fontFamily: 'var(--font-heading, inherit)',
            fontSize: '0.875rem', fontWeight: 600,
            padding: 'var(--mer-spacing-lg)',
            textAlign: 'center', lineHeight: 1.3,
          }}
          aria-hidden="true"
        >
          {article.title}
        </div>
      )}
      <div className="mer-article-card-body">
        {article.topic && typeof article.topic === 'object' && (
          <span
            className="mer-tag"
            style={{ marginBottom: 'var(--mer-spacing-sm)', alignSelf: 'flex-start' }}
          >
            {article.topic.name}
          </span>
        )}
        <h3 className="mer-article-card-title">{article.title}</h3>
        {article.excerpt && <p className="mer-article-card-excerpt">{article.excerpt}</p>}
        <div className="mer-article-card-meta">
          <AuthorChip author={article.author} />
          {article.readTime && <span>{article.readTime} min read</span>}
          {dateStr && <time dateTime={dateStr}>{formatDate(dateStr)}</time>}
        </div>
      </div>
    </a>
  );
}

// --- Root export ---

export default function BlogTopicFilterClient({ articles }: Props) {
  const [activeTopic, setActiveTopic] = useState<string>('all');

  // Pre-select from ?topic=slug URL param on mount (B6 fix)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const topic = params.get('topic');
    if (topic) setActiveTopic(topic);
  }, []);

  // Derive unique topics from articles, sorted by count descending (B2 fix)
  const topics = useMemo<DerivedTopic[]>(() => {
    const topicMap = new Map<string, DerivedTopic>();
    for (const a of articles) {
      if (a.topic && typeof a.topic === 'object') {
        const t = a.topic;
        const existing = topicMap.get(t.slug);
        if (existing) {
          existing.count++;
        } else {
          topicMap.set(t.slug, { slug: t.slug, name: t.name, count: 1 });
        }
      }
    }
    return Array.from(topicMap.values()).sort((a, b) => b.count - a.count);
  }, [articles]);

  const filteredArticles = useMemo(() => {
    if (activeTopic === 'all') return articles;
    return articles.filter(
      (a) => a.topic && typeof a.topic === 'object' && a.topic.slug === activeTopic,
    );
  }, [articles, activeTopic]);

  const showTopicGrid = activeTopic === 'all';

  return (
    <section className="mer-section">
      <div className="mer-container">

        {/* Filter tabs - button role tab for accessibility (B4 fix) */}
        {topics.length > 0 && (
          <div
            className="mer-filter-tabs"
            role="tablist"
            aria-label="Filter by topic"
            style={{ marginBottom: 'var(--mer-spacing-2xl)' }}
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTopic === 'all'}
              data-active={activeTopic === 'all' ? 'true' : 'false'}
              className="mer-filter-tab"
              onClick={() => setActiveTopic('all')}
            >
              All Topics
            </button>
            {topics.map((t) => (
              <button
                key={t.slug}
                type="button"
                role="tab"
                aria-selected={activeTopic === t.slug}
                data-active={activeTopic === t.slug ? 'true' : 'false'}
                className="mer-filter-tab"
                onClick={() => setActiveTopic(t.slug)}
              >
                {t.name}
              </button>
            ))}
          </div>
        )}

        {/* All Topics: knowledge graph topic cards */}
        {showTopicGrid && topics.length > 0 && (
          <div className="mer-blog-topic-grid">
            {topics.map((t) => (
              <button
                key={t.slug}
                type="button"
                className="mer-blog-topic-card"
                onClick={() => setActiveTopic(t.slug)}
                aria-label={`Browse ${t.name} \u2014 ${t.count} insight${t.count !== 1 ? 's' : ''}`}
              >
                <div className="mer-blog-topic-card-header">
                  <span className="mer-blog-topic-card-count">{t.count}</span>
                  <span className="mer-blog-topic-card-count-label">
                    insight{t.count !== 1 ? 's' : ''}
                  </span>
                </div>
                <h3 className="mer-blog-topic-card-name">{t.name}</h3>
                <span className="mer-blog-topic-card-cta" aria-hidden="true">Browse</span>
              </button>
            ))}
          </div>
        )}

        {/* Fallback: flat grid when articles have no topic tags */}
        {showTopicGrid && topics.length === 0 && articles.length > 0 && (
          <div className="mer-grid-3" data-reveal-stagger>
            {articles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        )}

        {/* Topic selected: filtered article card grid (B1-B3 fix) */}
        {!showTopicGrid && (
          filteredArticles.length > 0 ? (
            <div className="mer-grid-3" data-reveal-stagger>
              {filteredArticles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 'var(--mer-spacing-4xl) 0' }}>
              <p className="mer-body" style={{ opacity: 0.5 }}>
                No articles in this topic yet — check back soon.
              </p>
            </div>
          )
        )}

      </div>
    </section>
  );
}
