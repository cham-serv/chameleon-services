/**
 * ArticleCard Component
 *
 * Renders an article card for blog/resource listing grids. Server Component.
 * Templates override styling via the className prop.
 */

import Image from 'next/image';
import Link from 'next/link';
import type { Article, MediaItem } from '@/lib/api';

type ArticleCardProps = {
  article: Article;
  /** Base path for the article detail link. Default: '/resources' */
  basePath?: string;
  className?: string;
  /** Set to true for above-the-fold images to disable lazy loading */
  priority?: boolean;
};

export function ArticleCard({
  article,
  basePath = '/resources',
  className,
  priority = false,
}: ArticleCardProps) {
  const image = resolveMedia(article.heroImage);
  const topic =
    article.topic && typeof article.topic === 'object' ? article.topic : null;
  const formattedDate = article.publishedAt
    ? new Intl.DateTimeFormat('en-ZA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(new Date(article.publishedAt))
    : null;

  return (
    <Link
      href={`${basePath}/${article.slug}`}
      className={className}
      style={{
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      {/* Hero image */}
      <div
        style={{
          position: 'relative',
          aspectRatio: '16 / 9',
          overflow: 'hidden',
          borderRadius: '8px',
          backgroundColor: '#f0f0f0',
        }}
      >
        {image ? (
          <Image
            src={image.url}
            alt={image.alt ?? article.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            priority={priority}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
            aria-label="No article image"
          />
        )}
      </div>

      {/* Content */}
      <div style={{ marginTop: '12px' }}>
        {/* Meta row: topic + read time */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.75rem',
            color: '#888',
            marginBottom: '6px',
          }}
        >
          {topic && (
            <span
              style={{
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {topic.name}
            </span>
          )}
          {topic && article.readTime && (
            <span aria-hidden="true"></span>
          )}
          {article.readTime && (
            <span>{article.readTime} min read</span>
          )}
        </div>

        {/* Title */}
        <h3
          style={{
            margin: 0,
            fontSize: '1.1rem',
            fontWeight: 600,
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {article.title}
        </h3>

        {/* Excerpt */}
        {article.excerpt && (
          <p
            style={{
              margin: '6px 0 0',
              fontSize: '0.875rem',
              color: '#666',
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {article.excerpt}
          </p>
        )}

        {/* Date */}
        {formattedDate && (
          <time
            dateTime={article.publishedAt}
            style={{
              display: 'block',
              marginTop: '8px',
              fontSize: '0.75rem',
              color: '#aaa',
            }}
          >
            {formattedDate}
          </time>
        )}
      </div>
    </Link>
  );
}

// - Helpers -

function resolveMedia(
  media: MediaItem | number | null | undefined,
): MediaItem | null {
  if (!media || typeof media === 'number') return null;
  return media;
}
