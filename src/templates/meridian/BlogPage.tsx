/**
 * Meridian BlogPage  (variant: magazine / knowledge graph)
 *
 * Layout:
 *   1. Page hero — headline + subheadline
 *   2. Pulse strip — featured/latest article, server-rendered for GEO/SEO
 *   3. BlogTopicFilterClient — client-side knowledge graph:
 *        • All Topics → topic cards as entry points into the topic graph
 *        • Topic selected → 3-column article grid filtered to that topic
 *
 * Articles are fetched with section=blog (limit 50 to cover all topics).
 * Topics are derived from the returned article data — same taxonomy collection
 * as ResourcesPage so blog and resources share topic nodes.
 */

import type { PageProps } from '@/lib/types';
import type { MeridianPageConfig } from '@/lib/types';
import { getArticles } from '@/lib/api';
import type { Article, TeamMember, MediaItem } from '@/lib/api';
import BlogTopicFilterClient from './BlogTopicFilterClient';

// --- Demo fallback articles (with topic tags for the knowledge graph) --------

const DEMO_ARTICLES: Article[] = [
  {
    id: 1, slug: 'directors-duty-care',
    title: "Director's Duty of Care in South African Law",
    excerpt: 'Understanding the fiduciary and statutory duties owed by company directors under the Companies Act.',
    section: 'blog', featured: true, readTime: 8,
    createdAt: '2024-09-01', updatedAt: '2024-09-01',
    topic: { id: 1, slug: 'corporate-commercial', name: 'Corporate & Commercial' },
  },
  {
    id: 2, slug: 'property-transfer-process',
    title: 'The Property Transfer Process Explained',
    excerpt: 'A step-by-step guide to buying property in South Africa — from offer to registration.',
    section: 'blog', readTime: 6,
    createdAt: '2024-08-20', updatedAt: '2024-08-20',
    topic: { id: 2, slug: 'property-conveyancing', name: 'Property & Conveyancing' },
  },
  {
    id: 3, slug: 'tax-structuring-startups',
    title: 'Tax Structuring for Start-ups',
    excerpt: 'How to set up your new venture in a way that minimises your tax burden and maximises investor-readiness.',
    section: 'blog', readTime: 10,
    createdAt: '2024-08-10', updatedAt: '2024-08-10',
    topic: { id: 3, slug: 'tax-advisory', name: 'Tax Advisory' },
  },
  {
    id: 4, slug: 'antenuptial-contracts',
    title: 'Antenuptial Contracts: What You Need to Know',
    excerpt: "Everything couples should understand before signing a marriage contract — and why it matters.",
    section: 'blog', readTime: 7,
    createdAt: '2024-07-22', updatedAt: '2024-07-22',
    topic: { id: 4, slug: 'family-estates', name: 'Family & Estates' },
  },
  {
    id: 5, slug: 'employment-termination-guide',
    title: 'A Guide to Fair Dismissal and Retrenchment',
    excerpt: 'Employers: navigate the legal requirements for fair termination, CCMA compliance, and severance pay.',
    section: 'blog', readTime: 12,
    createdAt: '2024-07-05', updatedAt: '2024-07-05',
    topic: { id: 5, slug: 'employment-labour', name: 'Employment & Labour' },
  },
  {
    id: 6, slug: 'cross-border-transactions',
    title: 'Cross-Border Commercial Transactions in Africa',
    excerpt: 'Key legal considerations when structuring deals across SADC jurisdictions.',
    section: 'blog', readTime: 9,
    createdAt: '2024-06-18', updatedAt: '2024-06-18',
    topic: { id: 1, slug: 'corporate-commercial', name: 'Corporate & Commercial' },
  },
];

// --- Helpers (server-only, used in the Pulse strip) --------------------------

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('en-ZA', {
      year: 'numeric', month: 'long', day: 'numeric',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
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

// --- Root export -------------------------------------------------------------

export default async function BlogPage({ config }: PageProps) {
  const tenantSlug = config.tenant.slug;
  const pc         = config.pageConfig as MeridianPageConfig | null;

  const headline    = pc?.blogHeadline    ?? 'Insights & Commentary';
  const subheadline = pc?.blogSubheadline ?? 'Practical legal and business guidance from our advisors.';

  // Fetch enough articles to cover all topics for the knowledge graph (B3 fix)
  const articlesRes = await getArticles({ tenant: tenantSlug, section: 'blog', limit: 50 });
  const articles    = articlesRes?.docs ?? DEMO_ARTICLES;

  // Featured "Pulse" article — server-rendered for GEO/SEO benefit
  const featured = articles.find((a) => a.featured) ?? articles[0];

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="mer-section-sm"
        style={{ borderBottom: '1px solid var(--mer-border-color)' }}
      >
        <div className="mer-container">
          <div data-reveal="up">
            <span className="mer-overline">Insights</span>
            <h1
              className="mer-h1"
              style={{ marginTop: 'var(--mer-spacing-md)', marginBottom: 'var(--mer-spacing-md)' }}
            >
              {headline}
            </h1>
            {subheadline && (
              <p className="mer-body-lg" style={{ opacity: 0.8, maxWidth: '60ch' }}>
                {subheadline}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Pulse strip — latest/featured article (server-rendered for SEO) ── */}
      {featured && (
        <section
          className="mer-section-sm"
          style={{ borderBottom: '1px solid var(--mer-border-color)' }}
        >
          <div className="mer-container">
            <div style={{ marginBottom: 'var(--mer-spacing-lg)' }}>
              <span className="mer-overline">Latest</span>
            </div>
            <a
              href={`/blog/${featured.slug}`}
              className="mer-blog-featured"
              style={{ textDecoration: 'none' }}
              data-reveal="up"
            >
              <div>
                <span
                  className="mer-tag mer-tag-accent"
                  style={{ marginBottom: 'var(--mer-spacing-md)', display: 'inline-flex' }}
                >
                  {featured.topic && typeof featured.topic === 'object'
                    ? featured.topic.name
                    : 'Featured'}
                </span>
                <h2
                  className="mer-h2"
                  style={{ marginBottom: 'var(--mer-spacing-md)' }}
                >
                  {featured.title}
                </h2>
                {featured.excerpt && (
                  <p
                    className="mer-body"
                    style={{ opacity: 0.8, marginBottom: 'var(--mer-spacing-lg)' }}
                  >
                    {featured.excerpt}
                  </p>
                )}
                <div className="mer-article-card-meta">
                  <AuthorChip author={featured.author} />
                  {featured.readTime && <span>{featured.readTime} min read</span>}
                  {(featured.publishedAt ?? featured.createdAt) && (
                    <time dateTime={featured.publishedAt ?? featured.createdAt}>
                      {formatDate(featured.publishedAt ?? featured.createdAt)}
                    </time>
                  )}
                </div>
              </div>
              {(() => {
                const url =
                  featured.heroImage &&
                  typeof featured.heroImage === 'object' &&
                  'url' in featured.heroImage
                    ? (featured.heroImage as MediaItem).url
                    : null;
                return url ? (
                  <div
                    className="mer-img-zoom"
                    style={{ borderRadius: 'var(--mer-radius-xl)' }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={featured.title}
                      style={{
                        width: '100%', aspectRatio: '4/3', objectFit: 'cover',
                        borderRadius: 'var(--mer-radius-xl)', display: 'block',
                      }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      aspectRatio: '4/3',
                      borderRadius: 'var(--mer-radius-xl)',
                      background: 'color-mix(in srgb, var(--brand-primary, #1a2b5e) 8%, var(--brand-surface, #f5f5f5) 92%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      padding: 'var(--mer-spacing-2xl)', textAlign: 'center',
                    }}
                  >
                    <span className="mer-h3" style={{ opacity: 0.4 }}>{featured.title}</span>
                  </div>
                );
              })()}
            </a>
          </div>
        </section>
      )}

      {/* ── Knowledge graph: topic cards + filtered article grid (client) ── */}
      <BlogTopicFilterClient articles={articles} />
    </>
  );
}