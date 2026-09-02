/**
 * Meridian BlogPostPage
 *
 * Layout:
 *   - Breadcrumb
 *   - Article hero image (full-width, ~50vh)
 *   - Two-column on desktop: article body (left) + sidebar (right)
 *     Sidebar: author card, key takeaways, related posts, CTA
 *   - Key takeaways row (mobile — shown below article)
 *   - Author bio card (full-width, below article)
 *   - Related posts strip
 *
 * Article body is rendered via ContentBlocks (block-based Lexical content).
 * Author card links to /team/{slug} if the author has a slug.
 */

import type { PageProps } from '@/lib/types';
import { getArticleBySlug, getArticles } from '@/lib/api';
import type { Article, TeamMember, MediaItem } from '@/lib/api';
import { ContentBlocks } from '@/components/ContentBlocks';

// ─── Sub-components ────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function NotFound({ slug }: { slug: string }) {
  return (
    <section className="mer-section">
      <div className="mer-container-sm" style={{ textAlign: 'center' }}>
        <p className="mer-h2" style={{ marginBottom: 'var(--mer-spacing-md)' }}>Article not found</p>
        <p className="mer-body" style={{ opacity: 0.7, marginBottom: 'var(--mer-spacing-xl)' }}>
          No post at &ldquo;{slug}&rdquo; could be found.
        </p>
        <a href="/blog" className="mer-btn mer-btn-primary">Back to Insights</a>
      </div>
    </section>
  );
}

function AuthorCard({ author }: { author: TeamMember }) {
  const photoUrl =
    author.photo && typeof author.photo === 'object' && 'url' in author.photo
      ? (author.photo as { url: string }).url : null;

  const dept =
    author.department && typeof author.department === 'object' && 'name' in author.department
      ? (author.department as { name: string; slug: string }) : null;

  return (
    <div className="mer-card" style={{ display: 'flex', gap: 'var(--mer-spacing-xl)', alignItems: 'flex-start', padding: 'var(--mer-spacing-xl)' }}>
      {photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photoUrl} alt={author.name} style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', flexShrink: 0 }} />
      ) : (
        <div
          aria-hidden="true"
          style={{
            width: 72, height: 72, borderRadius: '50%', flexShrink: 0,
            background: 'color-mix(in srgb, var(--brand-primary, #1a2b5e) 10%, var(--brand-surface, #f5f5f5) 90%)',
            color: 'var(--brand-primary, #1a2b5e)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.75rem', fontWeight: 700, fontFamily: 'var(--font-heading, inherit)',
          }}
        >
          {author.name[0]}
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p className="mer-overline" style={{ marginBottom: 'var(--mer-spacing-xs)' }}>About the author</p>
        <h3 className="mer-h4" style={{ marginBottom: '0.2em' }}>{author.name}</h3>
        {author.role && <p style={{ fontSize: '0.9375rem', color: 'var(--brand-primary, #1a2b5e)', fontWeight: 600, marginBottom: 'var(--mer-spacing-sm)' }}>{author.role}</p>}
        {dept && <span className="mer-tag mer-tag-dept" style={{ marginBottom: 'var(--mer-spacing-md)', display: 'inline-flex' }}>{dept.name}</span>}
        <div style={{ display: 'flex', gap: 'var(--mer-spacing-sm)', flexWrap: 'wrap' }}>
          <a href={`/team/${author.slug}`} className="mer-btn mer-btn-outline mer-btn-sm">View Profile</a>
          <a href={`/contact?team=${encodeURIComponent(author.slug)}`} className="mer-btn mer-btn-ghost mer-btn-sm">Get in Touch</a>
        </div>
      </div>
    </div>
  );
}

function RelatedCard({ article }: { article: Article }) {
  const heroUrl =
    article.heroImage && typeof article.heroImage === 'object' && 'url' in article.heroImage
      ? (article.heroImage as MediaItem).url : null;
  return (
    <a href={`/blog/${article.slug}`} className="mer-article-card">
      {heroUrl
        ? <img className="mer-article-card-image" src={heroUrl} alt={article.title} loading="lazy" />
        : <div className="mer-article-card-image" style={{ background: 'color-mix(in srgb, var(--brand-primary, #1a2b5e) 8%, var(--brand-surface, #f5f5f5) 92%)' }} aria-hidden="true" />}
      <div className="mer-article-card-body">
        <h3 className="mer-article-card-title">{article.title}</h3>
        {article.readTime && <p className="mer-article-card-meta">{article.readTime} min read</p>}
      </div>
    </a>
  );
}

// ─── Root export ────────────────────────────────────────────────────────────

export default async function BlogPostPage({ config, path }: PageProps) {
  const tenantSlug  = config.tenant.slug;
  const articleSlug = path[1] ?? '';

  if (!articleSlug) return <NotFound slug="(none)" />;

  const [article, relatedRes] = await Promise.all([
    getArticleBySlug(tenantSlug, articleSlug),
    getArticles({ tenant: tenantSlug, section: 'blog', limit: 3 }),
  ]);

  if (!article) return <NotFound slug={articleSlug} />;

  const heroUrl =
    article.heroImage && typeof article.heroImage === 'object' && 'url' in article.heroImage
      ? (article.heroImage as MediaItem).url : null;

  const author =
    article.author && typeof article.author === 'object' ? (article.author as TeamMember) : null;

  const related = (relatedRes?.docs ?? []).filter((a) => a.slug !== articleSlug).slice(0, 3);
  const dateStr = article.publishedAt ?? article.createdAt;
  const blocks  = Array.isArray(article.content) ? article.content : [];

  return (
    <>
      {/* Hero image */}
      {heroUrl && (
        <div style={{ width: '100%', maxHeight: '50vh', overflow: 'hidden', position: 'relative' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroUrl}
            alt={article.title}
            fetchPriority="high"
            style={{ width: '100%', height: '50vh', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
          />
        </div>
      )}

      <section className="mer-section">
        <div className="mer-container">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" style={{ marginBottom: 'var(--mer-spacing-xl)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.35em' }}>
            <a href="/blog" style={{ color: 'color-mix(in srgb, var(--brand-text, #444) 55%, transparent)', textDecoration: 'none' }}>Insights</a>
            <span aria-hidden="true" style={{ opacity: 0.35 }}>/</span>
            <span style={{ color: 'var(--brand-text, #444)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '40ch' }}>{article.title}</span>
          </nav>

          {/* Two-column layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 'var(--mer-spacing-4xl)', alignItems: 'start' }}>
            {/* ── Article body ─────────────────────────────────── */}
            <article>
              {/* Meta */}
              {article.topic && typeof article.topic === 'object' && (
                <span className="mer-tag" style={{ marginBottom: 'var(--mer-spacing-lg)', display: 'inline-flex' }}>{article.topic.name}</span>
              )}
              <h1 className="mer-h1" style={{ marginBottom: 'var(--mer-spacing-lg)' }}>{article.title}</h1>
              <div className="mer-article-card-meta" style={{ marginBottom: 'var(--mer-spacing-2xl)', gap: 'var(--mer-spacing-lg)' }}>
                {author && (
                  <a href={`/team/${author.slug}`} style={{ display: 'flex', alignItems: 'center', gap: '0.4em', color: 'inherit', textDecoration: 'none' }}>
                    {(() => {
                      const photoUrl = author.photo && typeof author.photo === 'object' && 'url' in author.photo ? (author.photo as { url: string }).url : null;
                      return photoUrl
                        ? <img src={photoUrl} alt={author.name} style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }} />
                        : <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'color-mix(in srgb, var(--brand-primary, #1a2b5e) 15%, transparent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: 'var(--brand-primary, #1a2b5e)', flexShrink: 0 }}>{author.name[0]}</span>;
                    })()}
                    <span>{author.name}</span>
                  </a>
                )}
                {dateStr && <time dateTime={dateStr}>{formatDate(dateStr)}</time>}
                {article.readTime && <span>{article.readTime} min read</span>}
              </div>

              {/* Key takeaways */}
              {(article.keyTakeaways ?? []).length > 0 && (
                <div className="mer-card mer-card-flat" style={{ padding: 'var(--mer-spacing-xl)', marginBottom: 'var(--mer-spacing-2xl)' }}>
                  <p className="mer-overline" style={{ marginBottom: 'var(--mer-spacing-md)' }}>Key Takeaways</p>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--mer-spacing-sm)' }}>
                    {article.keyTakeaways!.map((kt, i) => (
                      <li key={i} style={{ display: 'flex', gap: '0.6em', alignItems: 'flex-start', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                        <span style={{ color: 'var(--brand-primary, #1a2b5e)', fontWeight: 700, flexShrink: 0, marginTop: '0.15em' }}>✓</span>
                        {kt.point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Article content blocks */}
              {blocks.length > 0 ? (
                <ContentBlocks blocks={blocks} className="mer-prose" />
              ) : (
                <p className="mer-body" style={{ opacity: 0.6 }}>Article content coming soon.</p>
              )}
            </article>

            {/* ── Sidebar ─────────────────────────────────────── */}
            <aside style={{ position: 'sticky', top: 'calc(var(--mer-header-h) + var(--mer-spacing-xl))', display: 'flex', flexDirection: 'column', gap: 'var(--mer-spacing-xl)' }}>
              {/* Author mini-card */}
              {author && (
                <div className="mer-card" style={{ padding: 'var(--mer-spacing-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--mer-spacing-sm)', alignItems: 'center', textAlign: 'center' }}>
                  {(() => {
                    const photoUrl = author.photo && typeof author.photo === 'object' && 'url' in author.photo ? (author.photo as { url: string }).url : null;
                    return photoUrl
                      ? <img src={photoUrl} alt={author.name} style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }} />
                      : <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'color-mix(in srgb, var(--brand-primary, #1a2b5e) 10%, var(--brand-surface, #f5f5f5) 90%)', color: 'var(--brand-primary, #1a2b5e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-heading, inherit)' }}>{author.name[0]}</div>;
                  })()}
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--brand-heading, inherit)', marginBottom: '0.1em' }}>{author.name}</p>
                    {author.role && <p className="mer-caption">{author.role}</p>}
                  </div>
                  <a href={`/contact?team=${encodeURIComponent(author.slug)}`} className="mer-btn mer-btn-primary mer-btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                    Contact {author.name.split(' ')[0]}
                  </a>
                </div>
              )}

              {/* CTA */}
              <div className="mer-card mer-card-primary" style={{ padding: 'var(--mer-spacing-xl)', textAlign: 'center' }}>
                <p style={{ color: '#fff', fontFamily: 'var(--font-heading, inherit)', fontWeight: 600, fontSize: '1.0625rem', marginBottom: 'var(--mer-spacing-md)' }}>Need legal advice?</p>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem', marginBottom: 'var(--mer-spacing-lg)' }}>Our advisors are here to help with your specific situation.</p>
                <a href="/contact" className="mer-btn mer-btn-white mer-btn-sm" style={{ width: '100%', justifyContent: 'center' }}>Get in Touch</a>
              </div>
            </aside>
          </div>

          {/* Author bio (below article, full width) */}
          {author && (
            <div style={{ marginTop: 'var(--mer-spacing-3xl)', paddingTop: 'var(--mer-spacing-3xl)', borderTop: '1px solid var(--mer-border-color)' }}>
              <AuthorCard author={author} />
            </div>
          )}
        </div>
      </section>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="mer-section mer-surface">
          <div className="mer-container">
            <div className="mer-section-header--left" style={{ marginBottom: 'var(--mer-spacing-2xl)' }}>
              <span className="mer-overline">More Insights</span>
              <h2 className="mer-h3" style={{ marginTop: 'var(--mer-spacing-sm)' }}>Related Articles</h2>
            </div>
            <div className="mer-grid-3">
              {related.map((a) => <RelatedCard key={a.id} article={a} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}