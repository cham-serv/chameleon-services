/**
 * Meridian BlogPage  (variant: magazine)
 *
 * Layout:
 *   1. Page hero — headline + subheadline
 *   2. Featured post — large hero card with image, excerpt, author
 *   3. Topic filter tabs — fetched from the engine via article topics
 *   4. Post grid — 3-column article cards
 *   5. Pagination hint — "Load more" link if hasNextPage
 *
 * Articles are fetched with section=blog. Topics are derived from the
 * article data (no separate topics endpoint needed here — we group
 * by the topic field on the returned articles).
 */

import type { PageProps } from '@/lib/types';
import type { MeridianPageConfig } from '@/lib/types';
import { getArticles } from '@/lib/api';
import type { Article, TeamMember, MediaItem } from '@/lib/api';

// ─── Demo fallback articles ─────────────────────────────────────────────────

const DEMO_ARTICLES: Article[] = [
  { id: 1, slug: 'directors-duty-care', title: "Director's Duty of Care in South African Law", excerpt: 'Understanding the fiduciary and statutory duties owed by company directors under the Companies Act.', section: 'blog', featured: true, readTime: 8, createdAt: '2024-09-01', updatedAt: '2024-09-01' },
  { id: 2, slug: 'property-transfer-process', title: 'The Property Transfer Process Explained', excerpt: 'A step-by-step guide to buying property in South Africa — from offer to registration.', section: 'blog', readTime: 6, createdAt: '2024-08-20', updatedAt: '2024-08-20' },
  { id: 3, slug: 'tax-structuring-startups', title: 'Tax Structuring for Start-ups', excerpt: 'How to set up your new venture in a way that minimises your tax burden and maximises investor-readiness.', section: 'blog', readTime: 10, createdAt: '2024-08-10', updatedAt: '2024-08-10' },
  { id: 4, slug: 'antenuptial-contracts', title: 'Antenuptial Contracts: What You Need to Know', excerpt: "Everything couples should understand before signing a marriage contract — and why it matters.", section: 'blog', readTime: 7, createdAt: '2024-07-22', updatedAt: '2024-07-22' },
  { id: 5, slug: 'employment-termination-guide', title: 'A Guide to Fair Dismissal and Retrenchment', excerpt: 'Employers: navigate the legal requirements for fair termination, CCMA compliance, and severance pay.', section: 'blog', readTime: 12, createdAt: '2024-07-05', updatedAt: '2024-07-05' },
  { id: 6, slug: 'cross-border-transactions', title: 'Cross-Border Commercial Transactions in Africa', excerpt: 'Key legal considerations when structuring deals across SADC jurisdictions.', section: 'blog', readTime: 9, createdAt: '2024-06-18', updatedAt: '2024-06-18' },
];

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function ArticleImagePlaceholder({ title }: { title: string }) {
  return (
    <div
      className="mer-article-card-image"
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'color-mix(in srgb, var(--brand-primary, #1a2b5e) 8%, var(--brand-surface, #f5f5f5) 92%)',
        color: 'color-mix(in srgb, var(--brand-primary, #1a2b5e) 40%, transparent)',
        fontFamily: 'var(--font-heading, inherit)',
        fontSize: '1rem', fontWeight: 600, padding: 'var(--mer-spacing-lg)',
        textAlign: 'center', lineHeight: 1.3,
      }}
      aria-hidden="true"
    >
      {title}
    </div>
  );
}

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
        <img src={photoUrl} alt={author.name} style={{ width: 20, height: 20, borderRadius: '50%', objectFit: 'cover' }} />
      ) : (
        <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'color-mix(in srgb, var(--brand-primary, #1a2b5e) 15%, transparent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.625rem', fontWeight: 700, color: 'var(--brand-primary, #1a2b5e)' }}>{author.name[0]}</span>
      )}
      {author.name}
    </span>
  );
}

function ArticleCard({ article, section }: { article: Article; section: string }) {
  const heroUrl =
    article.heroImage && typeof article.heroImage === 'object' && 'url' in article.heroImage
      ? (article.heroImage as MediaItem).url
      : null;
  const dateStr = article.publishedAt ?? article.createdAt;

  return (
    <a href={`/${section}/${article.slug}`} className="mer-article-card">
      {heroUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="mer-article-card-image" src={heroUrl} alt={article.title} loading="lazy" />
      ) : (
        <ArticleImagePlaceholder title={article.title} />
      )}
      <div className="mer-article-card-body">
        {article.topic && typeof article.topic === 'object' && (
          <span className="mer-tag" style={{ marginBottom: 'var(--mer-spacing-sm)', alignSelf: 'flex-start' }}>
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

// ─── Root export ────────────────────────────────────────────────────────────

export default async function BlogPage({ config }: PageProps) {
  const tenantSlug = config.tenant.slug;
  const pc         = config.pageConfig as MeridianPageConfig | null;

  const headline    = pc?.blogHeadline    ?? 'Insights & Commentary';
  const subheadline = pc?.blogSubheadline ?? 'Practical legal and business guidance from our advisors.';

  const articlesRes = await getArticles({ tenant: tenantSlug, section: 'blog', limit: 10 });
  const articles    = articlesRes?.docs ?? DEMO_ARTICLES;

  const featured  = articles.find((a) => a.featured) ?? articles[0];
  const remaining = articles.filter((a) => a.id !== featured?.id);

  // Derive unique topics from the returned articles for filter tabs
  const topicMap = new Map<string, string>();
  for (const a of articles) {
    if (a.topic && typeof a.topic === 'object') {
      topicMap.set(a.topic.slug, a.topic.name);
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="mer-section-sm" style={{ borderBottom: '1px solid var(--mer-border-color)' }}>
        <div className="mer-container">
          <div data-reveal="up">
            <span className="mer-overline">Insights</span>
            <h1 className="mer-h1" style={{ marginTop: 'var(--mer-spacing-md)', marginBottom: 'var(--mer-spacing-md)' }}>{headline}</h1>
            {subheadline && <p className="mer-body-lg" style={{ opacity: 0.8, maxWidth: '60ch' }}>{subheadline}</p>}
          </div>
        </div>
      </section>

      {/* Featured post */}
      {featured && (
        <section className="mer-section-sm" style={{ borderBottom: '1px solid var(--mer-border-color)' }}>
          <div className="mer-container">
            <a
              href={`/blog/${featured.slug}`}
              className="mer-blog-featured"
              style={{ textDecoration: 'none' }}
              data-reveal="up"
            >
              <div>
                <span className="mer-tag mer-tag-accent" style={{ marginBottom: 'var(--mer-spacing-md)', display: 'inline-flex' }}>Featured</span>
                <h2 className="mer-h2" style={{ marginBottom: 'var(--mer-spacing-md)' }}>{featured.title}</h2>
                {featured.excerpt && (
                  <p className="mer-body" style={{ opacity: 0.8, marginBottom: 'var(--mer-spacing-lg)' }}>{featured.excerpt}</p>
                )}
                <div className="mer-article-card-meta">
                  <AuthorChip author={featured.author} />
                  {featured.readTime && <span>{featured.readTime} min read</span>}
                  {(featured.publishedAt ?? featured.createdAt) && (
                    <time dateTime={featured.publishedAt ?? featured.createdAt}>{formatDate(featured.publishedAt ?? featured.createdAt)}</time>
                  )}
                </div>
              </div>
              {(() => {
                const url = featured.heroImage && typeof featured.heroImage === 'object' && 'url' in featured.heroImage
                  ? (featured.heroImage as MediaItem).url : null;
                return url
                  ? <div className="mer-img-zoom" style={{ borderRadius: 'var(--mer-radius-xl)' }}><img src={url} alt={featured.title} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 'var(--mer-radius-xl)', display: 'block' }} /></div>
                  : <div style={{ aspectRatio: '4/3', borderRadius: 'var(--mer-radius-xl)', background: 'color-mix(in srgb, var(--brand-primary, #1a2b5e) 8%, var(--brand-surface, #f5f5f5) 92%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--mer-spacing-2xl)', textAlign: 'center' }}><span className="mer-h3" style={{ opacity: 0.4 }}>{featured.title}</span></div>;
              })()}
            </a>
          </div>
        </section>
      )}

      {/* Post grid */}
      {remaining.length > 0 && (
        <section className="mer-section">
          <div className="mer-container">
            {topicMap.size > 0 && (
              <div className="mer-filter-tabs" style={{ marginBottom: 'var(--mer-spacing-2xl)' }}>
                <span className="mer-filter-tab" data-active="true">All Topics</span>
                {Array.from(topicMap.entries()).map(([slug, name]) => (
                  <a key={slug} href={`/blog?topic=${slug}`} className="mer-filter-tab">{name}</a>
                ))}
              </div>
            )}
            <div className="mer-grid-3" data-reveal-stagger>
              {remaining.map((a) => (
                <ArticleCard key={a.id} article={a} section="blog" />
              ))}
            </div>
            {(articlesRes?.hasNextPage) && (
              <div style={{ textAlign: 'center', marginTop: 'var(--mer-spacing-3xl)' }}>
                <a href="/blog?page=2" className="mer-btn mer-btn-outline">Load More Articles</a>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}