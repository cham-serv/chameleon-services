/**
 * Meridian ResourcesPage  (variant: grid)
 *
 * Layout:
 *   1. Page hero
 *   2. Topic grid — fetched from engine; each topic card shows name,
 *      description, article count, and links to /resources?topic=slug
 *   3. If no topics exist yet: flat article grid as fallback
 *
 * This page is deliberately topic-first. Professional services firms
 * organise resources by area of law / practice, not chronologically.
 * The topic cards act as entry points that deep-link into filtered lists.
 */

import type { PageProps } from '@/lib/types';
import type { MeridianPageConfig } from '@/lib/types';
import { getTopics, getArticles } from '@/lib/api';
import type { Article, Topic, MediaItem } from '@/lib/api';

// ─── Demo fallback ─────────────────────────────────────────────────────────

const DEMO_TOPICS: Topic[] = [
  { id: 1, slug: 'corporate-commercial', name: 'Corporate & Commercial', type: 'resources', description: 'Mergers, acquisitions, shareholder agreements, and commercial contracts.', articleCount: 12 },
  { id: 2, slug: 'property-conveyancing', name: 'Property & Conveyancing', type: 'resources', description: 'Transfer process, sectional title, property development, and tenant rights.', articleCount: 8 },
  { id: 3, slug: 'tax-advisory',          name: 'Tax Advisory',           type: 'resources', description: 'Income tax, VAT, SARS disputes, and tax-efficient structuring strategies.', articleCount: 15 },
  { id: 4, slug: 'family-estates',        name: 'Family & Estates',       type: 'resources', description: 'Divorce, custody, wills, intestate succession, and estate planning.', articleCount: 10 },
  { id: 5, slug: 'employment-labour',     name: 'Employment & Labour',    type: 'resources', description: 'Dismissal, retrenchment, CCMA procedures, and employment contracts.', articleCount: 9 },
  { id: 6, slug: 'dispute-resolution',    name: 'Dispute Resolution',     type: 'resources', description: 'Litigation, arbitration, mediation, and enforcement of judgments.', articleCount: 7 },
];

const DEMO_ARTICLES: Article[] = [
  { id: 1, slug: 'directors-duty-care', title: "Director's Duty of Care", excerpt: 'Fiduciary and statutory duties under the Companies Act.', section: 'resources', readTime: 8, createdAt: '2024-09-01', updatedAt: '2024-09-01' },
  { id: 2, slug: 'property-transfer',   title: 'The Property Transfer Process', excerpt: 'Step-by-step from offer to registration.', section: 'resources', readTime: 6, createdAt: '2024-08-20', updatedAt: '2024-08-20' },
  { id: 3, slug: 'tax-for-startups',    title: 'Tax Structuring for Start-ups', excerpt: 'Minimise your burden from day one.', section: 'resources', readTime: 10, createdAt: '2024-08-10', updatedAt: '2024-08-10' },
];

// ─── Helpers ───────────────────────────────────────────────────────────────

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function ArticleFlatCard({ article }: { article: Article }) {
  const heroUrl =
    article.heroImage && typeof article.heroImage === 'object' && 'url' in article.heroImage
      ? (article.heroImage as MediaItem).url : null;

  return (
    <a href={`/resources/${article.slug}`} className="mer-article-card">
      {heroUrl
        ? <img className="mer-article-card-image" src={heroUrl} alt={article.title} loading="lazy" />
        : <div className="mer-article-card-image" style={{ background: 'color-mix(in srgb, var(--brand-primary, #1a2b5e) 8%, var(--brand-surface, #f5f5f5) 92%)' }} aria-hidden="true" />}
      <div className="mer-article-card-body">
        <h3 className="mer-article-card-title">{article.title}</h3>
        {article.excerpt && <p className="mer-article-card-excerpt">{article.excerpt}</p>}
        <div className="mer-article-card-meta">
          {article.readTime && <span>{article.readTime} min read</span>}
        </div>
      </div>
    </a>
  );
}

// ─── Root export ────────────────────────────────────────────────────────────

export default async function ResourcesPage({ config }: PageProps) {
  const tenantSlug = config.tenant.slug;
  const pc         = config.pageConfig as MeridianPageConfig | null;

  const headline    = pc?.resourcesHeadline    ?? 'Resources & Guides';
  const subheadline = pc?.resourcesSubheadline ?? 'Plain-language guides and expert commentary across our practice areas.';

  const [topicsRes, articlesRes] = await Promise.all([
    getTopics(tenantSlug),
    getArticles({ tenant: tenantSlug, section: 'resources', limit: 9 }),
  ]);

  const topics   = topicsRes?.docs   ?? DEMO_TOPICS;
  const articles = articlesRes?.docs ?? DEMO_ARTICLES;

  // Use topic grid if available, flat article grid as fallback
  const useTopicGrid = topics.length > 0;

  return (
    <>
      {/* Hero */}
      <section className="mer-section-sm" style={{ borderBottom: '1px solid var(--mer-border-color)' }}>
        <div className="mer-container">
          <div data-reveal="up">
            <span className="mer-overline">Knowledge Base</span>
            <h1 className="mer-h1" style={{ marginTop: 'var(--mer-spacing-md)', marginBottom: 'var(--mer-spacing-md)' }}>{headline}</h1>
            {subheadline && <p className="mer-body-lg" style={{ opacity: 0.8, maxWidth: '60ch' }}>{subheadline}</p>}
          </div>
        </div>
      </section>

      {useTopicGrid ? (
        /* ── Topic grid ────────────────────────────────────────── */
        <section className="mer-section">
          <div className="mer-container">
            <div className="mer-grid-3" data-reveal-stagger>
              {topics.map((topic) => {
                const imgUrl =
                  topic.headerImage && typeof topic.headerImage === 'object' && 'url' in topic.headerImage
                    ? (topic.headerImage as MediaItem).url : null;

                return (
                  <a
                    key={topic.slug}
                    href={`/resources?topic=${topic.slug}`}
                    className="mer-card mer-card-hover"
                    style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}
                  >
                    {imgUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imgUrl}
                        alt={topic.name}
                        loading="lazy"
                        style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }}
                      />
                    ) : (
                      <div
                        aria-hidden="true"
                        style={{
                          width: '100%', aspectRatio: '16/9',
                          background: 'color-mix(in srgb, var(--brand-primary, #1a2b5e) 8%, var(--brand-surface, #f5f5f5) 92%)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '2rem', color: 'color-mix(in srgb, var(--brand-primary, #1a2b5e) 35%, transparent)',
                        }}
                      >
                        {topic.icon ?? '📄'}
                      </div>
                    )}

                    <div className="mer-card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h2
                        style={{
                          fontFamily: 'var(--font-heading, inherit)', fontWeight: 600,
                          fontSize: '1.0625rem', color: 'var(--brand-heading, inherit)',
                          lineHeight: 1.3, marginBottom: 'var(--mer-spacing-sm)',
                          transition: 'color var(--mer-transition)',
                        }}
                      >
                        {topic.name}
                      </h2>
                      {topic.description && (
                        <p className="mer-body-sm" style={{ opacity: 0.75, flex: 1, marginBottom: 'var(--mer-spacing-md)' }}>
                          {topic.description}
                        </p>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {topic.articleCount != null && (
                          <span className="mer-caption">{topic.articleCount} {topic.articleCount === 1 ? 'guide' : 'guides'}</span>
                        )}
                        <span className="mer-arrow-link" style={{ marginTop: 0 }}>
                          Browse <ArrowIcon />
                        </span>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      ) : (
        /* ── Flat article grid fallback ────────────────────────── */
        <section className="mer-section">
          <div className="mer-container">
            <div className="mer-grid-3" data-reveal-stagger>
              {articles.map((a) => <ArticleFlatCard key={a.id} article={a} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}