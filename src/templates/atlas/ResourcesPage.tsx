/**
 * Atlas ResourcesPage - Server Component
 *
 * Topic Directory page - the knowledge graph entry point.
 * Fetches all topics and renders them in one of three variants:
 *
 *   directory - Split layout: sidebar tools + vertical topic list (F&T-inspired)
 *   grid      - Responsive card grid with icons and article counts
 *   magazine  - Featured topic hero + cross-topic article feed
 *
 * Injects CollectionPage JSON-LD with ItemList of topics.
 * speakable cssSelector targets .geo-speakable for voice assistants.
 */

import Link from "next/link";
import Image from "next/image";
import React from "react";
import type { PageProps } from "@/lib/types";
import { getTopics, getArticles, type Topic, type Article, type MediaItem } from "@/lib/api";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";

// - Helpers -

function resolveMedia(m: MediaItem | number | null | undefined): MediaItem | null {
  if (!m || typeof m === "number") return null;
  return m;
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-ZA", { year: "numeric", month: "short", day: "numeric" }).format(new Date(iso));
}

function getTopicEmoji(type?: string): string {
  switch (type) {
    case "guide": return "";
    case "news": return "";
    case "research": return "";
    case "tutorial": return "";
    case "review": return "";
    case "opinion": return "";
    default: return "";
  }
}

// - Main Component -

export default async function ResourcesPage({ config, variant, noCache }: PageProps) {
  const tenant = config.tenant.slug;
  const siteName = config.settings?.siteName ?? config.tenant.name;
  const siteUrl = `https://${tenant}.chameleon.services`;
  const pc = config.pageConfig;

  const headline = pc?.resourcesHeadline ?? "Resource Directory";
  const subheadline = pc?.resourcesSubheadline ?? "Explore our knowledge base - guides, insights, and expert analysis organised by topic.";

  const topicsRes = await getTopics(tenant, noCache);
  const topics: Topic[] = topicsRes?.docs ?? [];

  // Magazine variant: fetch recent articles across all topics
  let recentArticles: Article[] = [];
  if (variant === "magazine") {
    const articlesRes = await getArticles({ tenant, section: "resources", limit: 9 }, noCache);
    recentArticles = articlesRes?.docs ?? [];
  }

  const breadcrumbs = [{ label: "Home", href: "/" }, { label: "Resources" }];

  // CollectionPage JSON-LD - all three variants share this schema
  const collectionSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Resource Directory - ${siteName}`,
    description: subheadline,
    url: `${siteUrl}/resources`,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".geo-speakable"],
    },
    ...(topics.length > 0 && {
      hasPart: {
        "@type": "ItemList",
        numberOfItems: topics.length,
        itemListElement: topics.map((topic, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "CollectionPage",
            name: topic.name,
            url: `${siteUrl}/resources/${topic.slug}`,
            ...(topic.description || topic.shortDescription
              ? { description: topic.description || topic.shortDescription }
              : {}),
          },
        })),
      },
    }),
  };

  const renderProps = { topics, recentArticles, headline, subheadline, breadcrumbs, siteUrl, collectionSchema };

  switch (variant) {
    case "grid":     return renderGrid(renderProps);
    case "magazine": return renderMagazine(renderProps);
    case "directory":
    default:         return renderDirectory(renderProps);
  }
}

// - Shared render props -

type RenderProps = {
  topics: Topic[];
  recentArticles: Article[];
  headline: string;
  subheadline: string;
  breadcrumbs: { label: string; href?: string }[];
  siteUrl: string;
  collectionSchema: Record<string, unknown>;
};

// - Render: Directory (F&T-inspired split layout) -

function renderDirectory({ topics, headline, subheadline, breadcrumbs, siteUrl, collectionSchema }: RenderProps) {
  return (
    <div data-variant="directory">
      <JsonLd data={collectionSchema} />
      <div className="atlas-container" style={{ paddingTop: "1.5rem", paddingBottom: "4rem" }}>
        <Breadcrumbs items={breadcrumbs} baseUrl={siteUrl} />

        {/* Header */}
        <div className="geo-speakable" style={{ marginTop: "var(--atlas-spacing-lg)", marginBottom: "var(--atlas-spacing-2xl)" }}>
          <h1 className="atlas-h1">{headline}</h1>
          <p className="atlas-body-lg" style={{ marginTop: "var(--atlas-spacing-sm)", opacity: 0.7, maxWidth: 600 }}>
            {subheadline}
          </p>
        </div>

        {/* Main split layout */}
        <div className="atlas-directory-layout">

          {/* Left sidebar */}
          <aside className="atlas-directory-sidebar">
            <div className="atlas-directory-widget">
              <p className="atlas-overline" style={{ marginBottom: "var(--atlas-spacing-sm)" }}>Knowledge Base</p>
              <p style={{ fontSize: "0.875rem", opacity: 0.7, lineHeight: 1.6, margin: 0 }}>
                {topics.length} topic{topics.length !== 1 ? "s" : ""} indexed
              </p>
              <p style={{ fontSize: "0.875rem", opacity: 0.7, lineHeight: 1.6, marginTop: "0.25rem", marginBottom: 0 }}>
                Structured guides, research, and expert analysis.
              </p>
            </div>
          </aside>

          {/* Right: topic list */}
          <div className="atlas-directory-content">
            <div style={{ marginBottom: "var(--atlas-spacing-lg)", paddingBottom: "var(--atlas-spacing-md)", borderBottom: "1px solid color-mix(in srgb, var(--brand-text, #1b1b1b) 10%, transparent)" }}>
              <h2 className="atlas-h5" style={{ margin: 0 }}>Documentation Index</h2>
              <p className="atlas-caption" style={{ margin: "4px 0 0", opacity: 0.6 }}>Explore structured guides, datasets, and research.</p>
            </div>

            {topics.length === 0 ? (
              <div className="atlas-empty-state">
                <p className="atlas-empty-title">No topics published yet</p>
                <p className="atlas-empty-sub">Topics will appear here once they are added in the CMS.</p>
              </div>
            ) : (
              <div className="atlas-directory-topic-list">
                {topics.map((topic) => {
                  const icon = resolveMedia(topic.headerImage as MediaItem | number | null | undefined);
                  return (
                    <Link
                      key={topic.id}
                      href={`/resources/${topic.slug}`}
                      className="atlas-directory-topic-row"
                    >
                      {/* Icon */}
                      <div className="atlas-directory-topic-icon">
                        {icon ? (
                          <Image src={icon.url} alt={`${topic.name} icon`} width={32} height={32} style={{ objectFit: "contain" }} />
                        ) : (
                          <span style={{ fontSize: "1.25rem" }}>{getTopicEmoji(topic.type)}</span>
                        )}
                      </div>

                      {/* Text */}
                      <div style={{ flex: 1 }}>
                        <h3 className="atlas-directory-topic-name">{topic.name}</h3>
                        <p className="atlas-directory-topic-desc">
                          {topic.shortDescription || topic.description || `Archive of resources filed under ${topic.name}.`}
                        </p>
                      </div>

                      {/* Meta */}
                      <div className="atlas-directory-topic-meta">
                        {topic.articleCount != null && (
                          <span className="atlas-badge">{topic.articleCount}</span>
                        )}
                        <span className="atlas-directory-topic-arrow">Browse </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// - Render: Grid (Card grid) -

function renderGrid({ topics, headline, subheadline, breadcrumbs, siteUrl, collectionSchema }: RenderProps) {
  return (
    <div data-variant="grid">
      <JsonLd data={collectionSchema} />
      <div className="atlas-container atlas-section-sm">
        <Breadcrumbs items={breadcrumbs} baseUrl={siteUrl} />

        <div className="geo-speakable" style={{ marginTop: "var(--atlas-spacing-lg)" }}>
          <h1 className="atlas-h1">{headline}</h1>
          <p className="atlas-body-lg" style={{ marginTop: "var(--atlas-spacing-sm)", opacity: 0.7, maxWidth: 600 }}>
            {subheadline}
          </p>
        </div>

        {topics.length === 0 ? (
          <div className="atlas-card-flat" style={{ padding: "var(--atlas-spacing-2xl)", textAlign: "center", marginTop: "var(--atlas-spacing-2xl)" }}>
            <p className="atlas-body" style={{ opacity: 0.6 }}>No topics have been published yet. Check back soon.</p>
          </div>
        ) : (
          <div className="atlas-resources-grid" style={{ marginTop: "var(--atlas-spacing-2xl)" }}>
            {topics.map((topic) => (
              <Link
                key={topic.id}
                href={`/resources/${topic.slug}`}
                className="atlas-card atlas-resources-topic-card atlas-fade-in"
                style={{ display: "block", textDecoration: "none", color: "inherit", padding: "var(--atlas-spacing-lg)" }}
              >
                <span style={{ fontSize: "2rem", display: "block", marginBottom: "var(--atlas-spacing-sm)" }}>
                  {getTopicEmoji(topic.type)}
                </span>
                <h2 className="atlas-h5">{topic.name}</h2>
                {(topic.shortDescription || topic.description) && (
                  <p className="atlas-body" style={{ marginTop: "var(--atlas-spacing-xs)", opacity: 0.7, fontSize: "0.875rem" }}>
                    {topic.shortDescription || topic.description}
                  </p>
                )}
                {topic.articleCount != null && (
                  <span className="atlas-caption" style={{ display: "block", marginTop: "var(--atlas-spacing-sm)", opacity: 0.5 }}>
                    {topic.articleCount} article{topic.articleCount !== 1 ? "s" : ""}
                  </span>
                )}
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: "var(--atlas-spacing-md)", color: "var(--brand-primary, #2d6a4f)", fontWeight: 600, fontSize: "0.8125rem" }}>
                  Explore 
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// - Render: Magazine (Featured hero + article feed) -

function renderMagazine({ topics, recentArticles, headline, subheadline, breadcrumbs, siteUrl, collectionSchema }: RenderProps) {
  const featuredTopic = topics[0] ?? null;
  const remainingTopics = topics.slice(1);
  const heroImage = featuredTopic ? resolveMedia(featuredTopic.headerImage as MediaItem | number | null | undefined) : null;

  return (
    <div data-variant="magazine">
      <JsonLd data={collectionSchema} />

      {/* Editorial hero */}
      <div className="atlas-magazine-hero">
        <div className="atlas-container">
          <Breadcrumbs items={breadcrumbs} baseUrl={siteUrl} />
          <div className="geo-speakable" style={{ marginTop: "var(--atlas-spacing-lg)" }}>
            <h1 className="atlas-magazine-headline">{headline}</h1>
            <p className="atlas-magazine-sub">{subheadline}</p>
          </div>
        </div>
      </div>

      <div className="atlas-container" style={{ paddingBottom: "4rem" }}>

        {/* Featured topic */}
        {featuredTopic && (
          <div style={{ marginBottom: "var(--atlas-spacing-2xl)", paddingTop: "var(--atlas-spacing-xl)" }}>
            <p className="atlas-overline" style={{ marginBottom: "var(--atlas-spacing-md)" }}>Featured Topic</p>
            <Link href={`/resources/${featuredTopic.slug}`} className="atlas-magazine-featured-topic atlas-card" style={{ display: "block", textDecoration: "none", color: "inherit", overflow: "hidden" }}>
              {heroImage && (
                <div style={{ position: "relative", aspectRatio: "21/9", overflow: "hidden" }}>
                  <Image src={heroImage.url} alt={heroImage.alt ?? featuredTopic.name} fill sizes="100vw" style={{ objectFit: "cover" }} priority />
                </div>
              )}
              <div style={{ padding: "var(--atlas-spacing-xl)" }}>
                <span style={{ fontSize: "2rem", display: "block", marginBottom: "var(--atlas-spacing-sm)" }}>{getTopicEmoji(featuredTopic.type)}</span>
                <h2 className="atlas-h3">{featuredTopic.name}</h2>
                {(featuredTopic.description || featuredTopic.shortDescription) && (
                  <p className="atlas-body" style={{ marginTop: "var(--atlas-spacing-sm)", opacity: 0.7, maxWidth: 680 }}>
                    {featuredTopic.description || featuredTopic.shortDescription}
                  </p>
                )}
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: "var(--atlas-spacing-lg)", color: "var(--brand-primary, #2d6a4f)", fontWeight: 600 }}>
                  Browse Collection 
                </span>
              </div>
            </Link>
          </div>
        )}

        {/* Two-column layout: remaining topics + recent articles */}
        <div className="atlas-magazine-layout">
          {/* Topics sidebar */}
          {remainingTopics.length > 0 && (
            <aside className="atlas-magazine-topics">
              <h2 className="atlas-h6" style={{ marginBottom: "var(--atlas-spacing-md)" }}>More Topics</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {remainingTopics.map((topic) => (
                  <Link
                    key={topic.id}
                    href={`/resources/${topic.slug}`}
                    className="atlas-card-flat"
                    style={{ display: "flex", alignItems: "center", gap: "var(--atlas-spacing-sm)", padding: "var(--atlas-spacing-sm) var(--atlas-spacing-md)", textDecoration: "none", color: "inherit" }}
                  >
                    <span style={{ fontSize: "1.25rem", flexShrink: 0 }}>{getTopicEmoji(topic.type)}</span>
                    <span style={{ flex: 1, fontWeight: 500, fontSize: "0.875rem" }}>{topic.name}</span>
                    {topic.articleCount != null && (
                      <span className="atlas-badge" style={{ flexShrink: 0 }}>{topic.articleCount}</span>
                    )}
                    <span style={{ color: "var(--brand-primary, #2d6a4f)", fontSize: "1rem", flexShrink: 0 }}></span>
                  </Link>
                ))}
              </div>
            </aside>
          )}

          {/* Recent articles */}
          {recentArticles.length > 0 && (
            <div className="atlas-magazine-articles">
              <h2 className="atlas-h6" style={{ marginBottom: "var(--atlas-spacing-md)" }}>Recent Resources</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--atlas-spacing-md)" }}>
                {recentArticles.map((article) => {
                  const articleTopic = article.topic && typeof article.topic === "object" ? article.topic : null;
                  return (
                    <Link
                      key={article.id}
                      href={`/resources/${articleTopic?.slug ?? ""}/${article.slug}`}
                      className="atlas-card-flat"
                      style={{ display: "block", padding: "var(--atlas-spacing-md)", textDecoration: "none", color: "inherit" }}
                    >
                      {articleTopic && (
                        <span className="atlas-badge" style={{ marginBottom: "var(--atlas-spacing-xs)" }}>{articleTopic.name}</span>
                      )}
                      <h3 style={{ margin: "var(--atlas-spacing-xs) 0 0", fontSize: "0.9375rem", fontWeight: 600, lineHeight: 1.4 }}>
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="atlas-caption" style={{ margin: "0.25rem 0 0", opacity: 0.6, lineHeight: 1.5 }}>
                          {article.excerpt}
                        </p>
                      )}
                      <div className="atlas-caption" style={{ marginTop: "var(--atlas-spacing-sm)", opacity: 0.5 }}>
                        {article.readTime && `${article.readTime} min read`}
                        {article.readTime && article.publishedAt && "  "}
                        {article.publishedAt && formatDate(article.publishedAt)}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
