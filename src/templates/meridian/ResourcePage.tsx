/**
 * Meridian ResourcePage  (single resource / guide)
 *
 * Layout — two-column on desktop, stacked on mobile:
 *   Left (main, 1fr):
 *     - Breadcrumb → /resources
 *     - Topic tag + read time
 *     - H1 title + excerpt lead
 *     - Key takeaways pull-out box (if present)
 *     - Article body via ContentBlocks
 *     - Author bio card (if article has an author)
 *   Right sidebar (280px, sticky):
 *     - Download / CTA card
 *     - Related guides from same topic
 *
 * Falls back gracefully if slug is invalid.
 */

import type { PageProps } from '@/lib/types';
import { getArticleBySlug, getArticles } from '@/lib/api';
import type { Article, TeamMember, MediaItem } from '@/lib/api';
import { ContentBlocks } from '@/components/ContentBlocks';

// ─── Helpers ───────────────────────────────────────────────────────────────

function NotFound({ slug }: { slug: string }) {
  return (
    <section className="mer-section">
      <div className="mer-container-sm" style={{ textAlign: 'center' }}>
        <p className="mer-h2" style={{ marginBottom: 'var(--mer-spacing-md)' }}>Resource not found</p>
        <p className="mer-body" style={{ opacity: 0.7, marginBottom: 'var(--mer-spacing-xl)' }}>
          No guide at &ldquo;{slug}&rdquo; could be found.
        </p>
        <a href="/resources" className="mer-btn mer-btn-primary">Back to Resources</a>
      </div>
    </section>
  );
}

function AuthorCard({ author }: { author: TeamMember }) {
  const photoUrl =
    author.photo && typeof author.photo === 'object' && 'url' in author.photo
      ? (author.photo as { url: string }).url : null;

  return (
    <div className="mer-card" style={{ display: 'flex', gap: 'var(--mer-spacing-lg)', alignItems: 'flex-start', padding: 'var(--mer-spacing-xl)', marginTop: 'var(--mer-spacing-3xl)' }}>
      {photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photoUrl} alt={author.name} style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', flexShrink: 0 }} />
      ) : (
        <div
          aria-hidden="true"
          style={{
            width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
            background: 'color-mix(in srgb, var(--brand-primary, #1a2b5e) 10%, var(--brand-surface, #f5f5f5) 90%)',
            color: 'var(--brand-primary, #1a2b5e)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-heading, inherit)',
          }}
        >
          {author.name[0]}
        </div>
      )}
      <div>
        <p className="mer-overline" style={{ marginBottom: 'var(--mer-spacing-xs)' }}>Written by</p>
        <h3 className="mer-h5" style={{ marginBottom: '0.15em' }}>{author.name}</h3>
        {author.role && <p className="mer-body-sm" style={{ opacity: 0.7, marginBottom: 'var(--mer-spacing-md)' }}>{author.role}</p>}
        <a href={`/team/${author.slug}`} className="mer-btn mer-btn-outline mer-btn-sm">View Profile</a>
      </div>
    </div>
  );
}

function RelatedCard({ article }: { article: Article }) {
  return (
    <a href={`/resources/${article.slug}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '0.25em', padding: 'var(--mer-spacing-md) 0', borderBottom: '1px solid var(--mer-border-color)' }}>
      <span style={{ fontFamily: 'var(--font-heading, inherit)', fontWeight: 600, fontSize: '0.9375rem', color: 'var(--brand-heading, inherit)', lineHeight: 1.35, transition: 'color var(--mer-transition)' }}>
        {article.title}
      </span>
      {article.readTime && <span className="mer-caption">{article.readTime} min read</span>}
    </a>
  );
}

// ─── Root export ────────────────────────────────────────────────────────────

export default async function ResourcePage({ config, path }: PageProps) {
  const tenantSlug    = config.tenant.slug;
  const resourceSlug  = path[1] ?? '';

  if (!resourceSlug) return <NotFound slug="(none)" />;

  const article = await getArticleBySlug(tenantSlug, resourceSlug);
  if (!article) return <NotFound slug={resourceSlug} />;

  const topicSlug = article.topic && typeof article.topic === 'object' ? article.topic.slug : undefined;

  // Fetch related articles from the same topic
  const relatedRes = await getArticles({
    tenant: tenantSlug,
    section: 'resources',
    topic: topicSlug,
    limit: 5,
  });
  const related = (relatedRes?.docs ?? []).filter((a) => a.slug !== resourceSlug).slice(0, 4);

  const heroUrl =
    article.heroImage && typeof article.heroImage === 'object' && 'url' in article.heroImage
      ? (article.heroImage as MediaItem).url : null;
  const author   = article.author && typeof article.author === 'object' ? (article.author as TeamMember) : null;
  const blocks   = Array.isArray(article.content) ? article.content : [];

  return (
    <>
      {/* Hero image — full-width, constrained height */}
      {heroUrl && (
        <div style={{ width: '100%', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroUrl}
            alt={article.title}
            fetchPriority="high"
            style={{ width: '100%', height: '40vh', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
          />
        </div>
      )}

      <section className="mer-section">
        <div className="mer-container">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" style={{ marginBottom: 'var(--mer-spacing-xl)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.35em' }}>
            <a href="/resources" style={{ color: 'color-mix(in srgb, var(--brand-text, #444) 55%, transparent)', textDecoration: 'none' }}>Resources</a>
            {article.topic && typeof article.topic === 'object' && (
              <>
                <span aria-hidden="true" style={{ opacity: 0.35 }}>/</span>
                <a href={`/resources?topic=${article.topic.slug}`} style={{ color: 'color-mix(in srgb, var(--brand-text, #444) 55%, transparent)', textDecoration: 'none' }}>{article.topic.name}</a>
              </>
            )}
            <span aria-hidden="true" style={{ opacity: 0.35 }}>/</span>
            <span style={{ color: 'var(--brand-text, #444)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '36ch' }}>{article.title}</span>
          </nav>

          {/* Two-column */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 'var(--mer-spacing-4xl)', alignItems: 'start' }}>

            {/* ── Article body ─────────────────────────────── */}
            <article>
              {/* Tags + meta */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--mer-spacing-sm)', flexWrap: 'wrap', marginBottom: 'var(--mer-spacing-lg)' }}>
                {article.topic && typeof article.topic === 'object' && (
                  <a href={`/resources?topic=${article.topic.slug}`} className="mer-tag" style={{ textDecoration: 'none' }}>{article.topic.name}</a>
                )}
                {article.readTime && <span className="mer-caption">{article.readTime} min read</span>}
                {article.contentStyle && <span className="mer-caption" style={{ textTransform: 'capitalize' }}>{article.contentStyle}</span>}
              </div>

              <h1 className="mer-h1" style={{ marginBottom: 'var(--mer-spacing-xl)' }}>{article.title}</h1>

              {article.excerpt && (
                <p className="mer-body-lg" style={{ opacity: 0.82, marginBottom: 'var(--mer-spacing-2xl)', borderBottom: '1px solid var(--mer-border-color)', paddingBottom: 'var(--mer-spacing-2xl)' }}>
                  {article.excerpt}
                </p>
              )}

              {/* Key takeaways */}
              {(article.keyTakeaways ?? []).length > 0 && (
                <div className="mer-card mer-card-flat" style={{ padding: 'var(--mer-spacing-xl)', marginBottom: 'var(--mer-spacing-2xl)', borderLeft: '3px solid var(--brand-primary, #1a2b5e)', borderRadius: `0 var(--mer-radius-lg) var(--mer-radius-lg) 0` }}>
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

              {/* Content */}
              {blocks.length > 0 ? (
                <ContentBlocks blocks={blocks} className="mer-prose" />
              ) : (
                <p className="mer-body" style={{ opacity: 0.55 }}>Full guide content coming soon.</p>
              )}

              {/* Author card */}
              {author && <AuthorCard author={author} />}
            </article>

            {/* ── Sidebar ──────────────────────────────────── */}
            <aside style={{ position: 'sticky', top: 'calc(var(--mer-header-h) + var(--mer-spacing-xl))', display: 'flex', flexDirection: 'column', gap: 'var(--mer-spacing-xl)' }}>
              {/* CTA */}
              <div className="mer-card mer-card-primary" style={{ padding: 'var(--mer-spacing-xl)' }}>
                <p style={{ color: '#fff', fontFamily: 'var(--font-heading, inherit)', fontWeight: 600, fontSize: '1.0625rem', marginBottom: 'var(--mer-spacing-md)', lineHeight: 1.3 }}>
                  Need professional advice?
                </p>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem', marginBottom: 'var(--mer-spacing-lg)' }}>
                  Speak to one of our advisors about your specific situation.
                </p>
                <a href="/contact" className="mer-btn mer-btn-white mer-btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                  Get in Touch
                </a>
              </div>

              {/* Related articles */}
              {related.length > 0 && (
                <div>
                  <p className="mer-overline" style={{ marginBottom: 'var(--mer-spacing-md)' }}>Related Guides</p>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {related.map((a) => <RelatedCard key={a.id} article={a} />)}
                  </div>
                  <a href="/resources" style={{ display: 'inline-block', marginTop: 'var(--mer-spacing-lg)', fontSize: '0.875rem', color: 'var(--brand-primary, #1a2b5e)', textDecoration: 'none', fontWeight: 600 }}>
                    View all resources →
                  </a>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}