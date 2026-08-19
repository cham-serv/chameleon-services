/**
 * Atlas AboutPage Ã¢â‚¬â€ Server Component
 *
 * Variant dispatch pattern (same as HomePage):
 * 1. Resolve variant-specific content from pageConfig with fallbacks
 * 2. Dispatch to the appropriate render function
 *
 * Variants:
 *   team-grid   Ã¢â‚¬â€ Professional: hero + mission + values grid + team photo grid + CTA
 *   story-split Ã¢â‚¬â€ Narrative: full-width hero + zigzag text/image + founder note + scroll team + CTA
 *   manifesto   Ã¢â‚¬â€ Typography-driven: full-viewport statement + pull-quote values + minimal team list + CTA
 */

import type { PageProps } from '@/lib/types';
import { JsonLd } from '@/components/JsonLd';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import Image from 'next/image';

// Ã¢â€â‚¬Ã¢â€â‚¬ Types Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

interface TeamMember {
  name: string;
  role?: string;
  bio?: string;
  photo?: { url?: string };
}

// Ã¢â€â‚¬Ã¢â€â‚¬ Constants Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

const PLACEHOLDER_TEAM: TeamMember[] = [
  { name: 'Team Member', role: 'Founder & CEO' },
  { name: 'Team Member', role: 'Head of Product' },
  { name: 'Team Member', role: 'Lead Developer' },
  { name: 'Team Member', role: 'Content Strategist' },
];

const VALUES = [
  { icon: 'ðŸŽ¯', title: 'Authority-First', description: 'Every decision is guided by building genuine market authority through content and commerce.' },
  { icon: 'âš¡', title: 'Performance', description: 'Lightning-fast pages, SEO-ready architecture, and conversion-focused design from day one.' },
  { icon: 'ðŸ”¬', title: 'Data-Driven', description: 'Intelligent insights and analytics that help you understand and grow your audience.' },
];

const MANIFESTO_BELIEFS = [
  'Quality over quantity. Always.',
  'The best products tell a story.',
  'Trust is built through transparency.',
];

const STORY_CHAPTERS = [
  {
    label: 'Chapter 1',
    title: 'The Beginning',
    body: '{siteName} started with a simple question: why should great products be hard to find? We set out to change that.',
  },
  {
    label: 'Chapter 2',
    title: 'Finding Our Purpose',
    body: 'Through hundreds of conversations with customers, we learned what truly mattered: trust, quality, and genuine expertise in our category.',
  },
  {
    label: 'Chapter 3',
    title: 'Where We Are Today',
    body: 'Today, {siteName} is proud to serve thousands of customers who share our belief that what you buy should reflect what you value.',
  },
];

// Ã¢â€â‚¬Ã¢â€â‚¬ Main Component Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

export default function AboutPage({ config, variant }: PageProps) {
  const tenant = config.tenant.slug;
  const siteName = config.settings?.siteName ?? config.tenant.name;
  const tagline = config.settings?.tagline ?? '';
  const siteUrl = `https://${tenant}.chameleon.services`;
  const contactEmail = config.settings?.contactEmail;
  const pc = config.pageConfig;

  const teamMembers: TeamMember[] = (pc?.aboutTeamMembers && pc.aboutTeamMembers.length > 0)
    ? pc.aboutTeamMembers as TeamMember[]
    : PLACEHOLDER_TEAM;

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'About' },
  ];

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: siteUrl,
    ...(config.settings?.logo && { logo: config.settings.logo.url }),
    ...(contactEmail && { email: contactEmail }),
    ...(() => {
      const s = config.settings;
      const sameAs = [
        s?.socialFacebook, s?.socialInstagram, s?.socialLinkedIn,
        s?.socialTwitter,  s?.socialYoutube,   s?.socialGoogle,
      ].filter((v): v is string => Boolean(v));
      return sameAs.length > 0 ? { sameAs } : {};
    })(),
  };

  // Ã¢â€â‚¬Ã¢â€â‚¬ Variant-specific content resolution Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
  const defaultHeadline = `About ${siteName}`;
  const defaultIntro = tagline || `${siteName} Ã¢â‚¬â€ built on the belief that every business deserves a powerful digital presence.`;

  let headline: string;
  let intro: string;
  let heroImageUrl: string | null;
  let manifestoSubheadline: string;

  switch (variant) {
    case 'story-split':
      headline = pc?.aboutStorySplitHeadline ?? pc?.aboutHeadline ?? defaultHeadline;
      intro = pc?.aboutStorySplitIntro ?? pc?.aboutIntro ?? defaultIntro;
      heroImageUrl = pc?.aboutStorySplitImage?.url ?? pc?.aboutSplitImage?.url ?? null;
      manifestoSubheadline = '';
      break;
    case 'manifesto':
      headline = pc?.aboutManifestoHeadline ?? pc?.aboutHeadline ?? `We believe quality should outlast trends.`;
      manifestoSubheadline = pc?.aboutManifestoSubheadline ?? defaultIntro;
      intro = '';
      heroImageUrl = null;
      break;
    case 'team-grid':
    default:
      headline = pc?.aboutTeamGridHeadline ?? pc?.aboutHeadline ?? defaultHeadline;
      intro = pc?.aboutTeamGridIntro ?? pc?.aboutIntro ?? defaultIntro;
      heroImageUrl = pc?.aboutTeamGridImage?.url ?? null;
      manifestoSubheadline = '';
      break;
  }

  return (
    <>
      <JsonLd data={orgSchema} />
      {variant === 'story-split'
        ? renderStorySplit({ siteName, headline, intro, heroImageUrl, teamMembers, breadcrumbs, siteUrl })
        : variant === 'manifesto'
        ? renderManifesto({ siteName, headline, subheadline: manifestoSubheadline, teamMembers })
        : renderTeamGrid({ siteName, headline, intro, heroImageUrl, teamMembers, breadcrumbs, siteUrl })}
    </>
  );
}

// Ã¢â€â‚¬Ã¢â€â‚¬ Variant: team-grid Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

interface TeamGridProps {
  siteName: string;
  headline: string;
  intro: string;
  heroImageUrl: string | null;
  teamMembers: TeamMember[];
  breadcrumbs: { label: string; href?: string }[];
  siteUrl: string;
}

function renderTeamGrid({ siteName, headline, intro, heroImageUrl, teamMembers, breadcrumbs }: TeamGridProps) {
  return (
    <div className="atlas-about--team-grid" data-variant="team-grid">

      {/* Ã¢â€â‚¬Ã¢â€â‚¬ Hero Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <section
        style={{
          background: 'color-mix(in srgb, var(--brand-primary, #2d6a4f) 8%, transparent)',
          padding: 'var(--atlas-spacing-3xl) 0',
          textAlign: 'center',
        }}
      >
        <div className="atlas-container">
          <Breadcrumbs items={breadcrumbs} baseUrl="/" />
          <h1 className="atlas-h1" style={{ marginTop: 'var(--atlas-spacing-lg)' }}>
            {headline}
          </h1>
          {intro && (
            <p
              className="atlas-body-lg"
              style={{ marginTop: 'var(--atlas-spacing-md)', maxWidth: 640, marginLeft: 'auto', marginRight: 'auto', opacity: 0.8 }}
            >
              {intro}
            </p>
          )}
        </div>
      </section>

      {/* Ã¢â€â‚¬Ã¢â€â‚¬ Mission Section Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <section className="atlas-container atlas-section">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: heroImageUrl ? '1fr 1fr' : '1fr',
            gap: 'var(--atlas-spacing-2xl)',
            alignItems: 'center',
          }}
        >
          <div>
            <p className="atlas-overline" style={{ color: 'var(--brand-primary, #2d6a4f)', marginBottom: 'var(--atlas-spacing-sm)' }}>
              Our Mission
            </p>
            <h2 className="atlas-h2">Building brands that matter.</h2>
            <p className="atlas-body-lg" style={{ marginTop: 'var(--atlas-spacing-lg)', lineHeight: 1.8, opacity: 0.8 }}>
              {siteName} was founded with a clear mission: to help businesses establish genuine authority
              in their market through intelligent content, optimised commerce, and data-driven strategy.
            </p>
            <p className="atlas-body" style={{ marginTop: 'var(--atlas-spacing-md)', lineHeight: 1.8, opacity: 0.7 }}>
              We believe that every brand has a unique story to tell, and the right platform can amplify
              that story to reach the people who matter most.
            </p>
          </div>
          {heroImageUrl && (
            <div style={{ borderRadius: 'var(--atlas-radius-lg)', overflow: 'hidden', aspectRatio: '16/9', position: 'relative' }}>
              <Image
                src={heroImageUrl}
                alt={`About ${siteName}`}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}
        </div>
      </section>

      {/* Ã¢â€â‚¬Ã¢â€â‚¬ Values Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <section style={{ background: 'color-mix(in srgb, var(--brand-text, #1b1b1b) 3%, transparent)' }}>
        <div className="atlas-container atlas-section">
          <h2 className="atlas-h3" style={{ textAlign: 'center', marginBottom: 'var(--atlas-spacing-2xl)' }}>
            Why Choose Us
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--atlas-spacing-xl)' }}>
            {VALUES.map((v, i) => (
              <div key={i} className="atlas-card-flat" style={{ padding: 'var(--atlas-spacing-lg)', textAlign: 'center' }}>
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: 'var(--atlas-spacing-sm)' }}>{v.icon}</span>
                <h3 className="atlas-h5">{v.title}</h3>
                <p className="atlas-body" style={{ marginTop: 'var(--atlas-spacing-sm)', opacity: 0.8 }}>{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ã¢â€â‚¬Ã¢â€â‚¬ Team Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <section className="atlas-container atlas-section">
        <h2 className="atlas-h3" style={{ textAlign: 'center', marginBottom: 'var(--atlas-spacing-2xl)' }}>
          Our Team
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--atlas-spacing-xl)' }}>
          {teamMembers.map((member, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              {member.photo?.url ? (
                <div style={{ width: 120, height: 120, borderRadius: '50%', margin: '0 auto', overflow: 'hidden', position: 'relative' }}>
                  <Image
                    src={member.photo.url}
                    alt={member.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="120px"
                  />
                </div>
              ) : (
                <div
                  style={{
                    width: 120, height: 120, borderRadius: '50%', margin: '0 auto',
                    background: `linear-gradient(135deg, color-mix(in srgb, var(--brand-primary, #2d6a4f) ${20 + i * 10}%, transparent), color-mix(in srgb, var(--brand-secondary, #00E5FF) ${20 + i * 5}%, transparent))`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem', fontWeight: 700,
                    color: 'var(--brand-primary, #2d6a4f)',
                  }}
                >
                  {member.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                </div>
              )}
              <h3 className="atlas-h6" style={{ marginTop: 'var(--atlas-spacing-md)' }}>{member.name}</h3>
              <p className="atlas-caption" style={{ opacity: 0.7 }}>{member.role ?? ''}</p>
              {member.bio && (
                <p className="atlas-body" style={{ fontSize: '0.8rem', marginTop: 'var(--atlas-spacing-xs)', opacity: 0.6 }}>{member.bio}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Ã¢â€â‚¬Ã¢â€â‚¬ CTA Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <section
        style={{
          background: 'var(--brand-primary, #2d6a4f)',
          color: '#fff',
          padding: 'var(--atlas-spacing-3xl) 0',
          textAlign: 'center',
        }}
      >
        <div className="atlas-container">
          <h2 className="atlas-h2" style={{ color: '#fff' }}>Ready to Get Started?</h2>
          <p className="atlas-body-lg" style={{ marginTop: 'var(--atlas-spacing-md)', opacity: 0.9, maxWidth: 500, margin: 'var(--atlas-spacing-md) auto 0' }}>
            Let&apos;s discuss how we can help your business establish authority and drive growth.
          </p>
          <a href="/contact" className="atlas-btn atlas-btn-secondary" style={{ marginTop: 'var(--atlas-spacing-xl)', display: 'inline-block' }}>
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
}

// Ã¢â€â‚¬Ã¢â€â‚¬ Variant: story-split Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

interface StorySplitProps {
  siteName: string;
  headline: string;
  intro: string;
  heroImageUrl: string | null;
  teamMembers: TeamMember[];
  breadcrumbs: { label: string; href?: string }[];
  siteUrl: string;
}

function renderStorySplit({ siteName, headline, intro, heroImageUrl, teamMembers, breadcrumbs }: StorySplitProps) {
  const founderMember = teamMembers[0];

  return (
    <div className="atlas-about--story-split" data-variant="story-split">

      {/* Ã¢â€â‚¬Ã¢â€â‚¬ Hero Ã¢â‚¬â€ full-width with gradient overlay Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <section style={{ position: 'relative', minHeight: '60vh', display: 'flex', alignItems: 'flex-end' }}>
        {heroImageUrl ? (
          <Image
            src={heroImageUrl}
            alt={headline}
            fill
            priority
            style={{ objectFit: 'cover', zIndex: 0 }}
            sizes="100vw"
          />
        ) : (
          <div
            style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(135deg, color-mix(in srgb, var(--brand-primary, #2d6a4f) 80%, transparent), color-mix(in srgb, var(--brand-secondary, #00E5FF) 40%, transparent))',
              zIndex: 0,
            }}
          />
        )}
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
            zIndex: 1,
          }}
        />
        <div className="atlas-container" style={{ position: 'relative', zIndex: 2, paddingBottom: 'var(--atlas-spacing-3xl)' }}>
          <Breadcrumbs items={breadcrumbs} baseUrl="/" />
          <h1
            className="atlas-h1"
            style={{ color: '#fff', marginTop: 'var(--atlas-spacing-lg)', maxWidth: 700, textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
          >
            {headline}
          </h1>
          {intro && (
            <p className="atlas-body-lg" style={{ color: 'rgba(255,255,255,0.85)', marginTop: 'var(--atlas-spacing-md)', maxWidth: 560 }}>
              {intro}
            </p>
          )}
        </div>
      </section>

      {/* Ã¢â€â‚¬Ã¢â€â‚¬ Journey Ã¢â‚¬â€ zigzag rows Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <section className="atlas-container atlas-section">
        <h2 className="atlas-h2" style={{ textAlign: 'center', marginBottom: 'var(--atlas-spacing-3xl)' }}>Our Journey</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--atlas-spacing-3xl)' }}>
          {STORY_CHAPTERS.map((chapter, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--atlas-spacing-2xl)',
                alignItems: 'center',
                direction: i % 2 === 1 ? 'rtl' : 'ltr',
              }}
            >
              <div style={{ direction: 'ltr' }}>
                <p className="atlas-overline" style={{ color: 'var(--brand-primary, #2d6a4f)', marginBottom: 'var(--atlas-spacing-xs)' }}>
                  {chapter.label}
                </p>
                <h3 className="atlas-h3">{chapter.title}</h3>
                <p className="atlas-body-lg" style={{ marginTop: 'var(--atlas-spacing-md)', lineHeight: 1.8, opacity: 0.8 }}>
                  {chapter.body.replace('{siteName}', siteName)}
                </p>
              </div>
              <div
                style={{
                  borderRadius: 'var(--atlas-radius-lg)',
                  overflow: 'hidden',
                  aspectRatio: '4/3',
                  background: `linear-gradient(${135 + i * 30}deg, color-mix(in srgb, var(--brand-primary, #2d6a4f) ${15 + i * 8}%, transparent), color-mix(in srgb, var(--brand-secondary, #00E5FF) ${10 + i * 5}%, transparent))`,
                  direction: 'ltr',
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Ã¢â€â‚¬Ã¢â€â‚¬ Founder's Note Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */}
      {founderMember && (
        <section
          style={{
            background: 'color-mix(in srgb, var(--brand-primary, #2d6a4f) 5%, transparent)',
            padding: 'var(--atlas-spacing-3xl) 0',
          }}
        >
          <div className="atlas-container">
            <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: 'var(--atlas-spacing-lg)', opacity: 0.3, lineHeight: 1 }}>&ldquo;</span>
              <p
                className="atlas-body-lg"
                style={{ fontSize: '1.375rem', lineHeight: 1.7, fontStyle: 'italic', opacity: 0.9 }}
              >
                {intro || `We started ${siteName} because we believed there was a better way Ã¢â‚¬â€ one that puts people first, quality above all, and builds lasting value rather than chasing short-term wins.`}
              </p>
              <div style={{ marginTop: 'var(--atlas-spacing-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--atlas-spacing-md)' }}>
                {founderMember.photo?.url ? (
                  <div style={{ width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                    <Image src={founderMember.photo.url} alt={founderMember.name} fill style={{ objectFit: 'cover' }} sizes="56px" />
                  </div>
                ) : (
                  <div
                    style={{
                      width: 56, height: 56, borderRadius: '50%',
                      background: 'color-mix(in srgb, var(--brand-primary, #2d6a4f) 20%, transparent)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.1rem', fontWeight: 700, color: 'var(--brand-primary, #2d6a4f)',
                    }}
                  >
                    {founderMember.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                  </div>
                )}
                <div style={{ textAlign: 'left' }}>
                  <p className="atlas-label" style={{ fontWeight: 600 }}>{founderMember.name}</p>
                  <p className="atlas-caption" style={{ opacity: 0.6 }}>{founderMember.role ?? 'Founder'}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Ã¢â€â‚¬Ã¢â€â‚¬ Team Ã¢â‚¬â€ horizontal scroll strip Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */}
      {teamMembers.length > 1 && (
        <section className="atlas-section">
          <div className="atlas-container">
            <h2 className="atlas-h3" style={{ textAlign: 'center', marginBottom: 'var(--atlas-spacing-2xl)' }}>The Team</h2>
          </div>
          <div
            style={{
              display: 'flex',
              gap: 'var(--atlas-spacing-xl)',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              padding: '0 var(--atlas-spacing-xl) var(--atlas-spacing-md)',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {teamMembers.map((member, i) => (
              <div
                key={i}
                style={{ flexShrink: 0, scrollSnapAlign: 'start', textAlign: 'center', width: 180 }}
              >
                {member.photo?.url ? (
                  <div style={{ width: 100, height: 100, borderRadius: 'var(--atlas-radius-lg)', margin: '0 auto', overflow: 'hidden', position: 'relative' }}>
                    <Image src={member.photo.url} alt={member.name} fill style={{ objectFit: 'cover' }} sizes="100px" />
                  </div>
                ) : (
                  <div
                    style={{
                      width: 100, height: 100, borderRadius: 'var(--atlas-radius-lg)', margin: '0 auto',
                      background: `linear-gradient(135deg, color-mix(in srgb, var(--brand-primary, #2d6a4f) ${15 + i * 8}%, transparent), color-mix(in srgb, var(--brand-secondary, #00E5FF) ${10 + i * 5}%, transparent))`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.25rem', fontWeight: 700, color: 'var(--brand-primary, #2d6a4f)',
                    }}
                  >
                    {member.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                  </div>
                )}
                <h3 className="atlas-h6" style={{ marginTop: 'var(--atlas-spacing-sm)', fontSize: '0.875rem' }}>{member.name}</h3>
                <p className="atlas-caption" style={{ opacity: 0.6, fontSize: '0.75rem' }}>{member.role ?? ''}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Ã¢â€â‚¬Ã¢â€â‚¬ CTA Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <section
        style={{
          background: 'var(--brand-primary, #2d6a4f)',
          color: '#fff',
          padding: 'var(--atlas-spacing-3xl) 0',
          textAlign: 'center',
        }}
      >
        <div className="atlas-container">
          <h2 className="atlas-h2" style={{ color: '#fff' }}>Read the Blog</h2>
          <p className="atlas-body-lg" style={{ marginTop: 'var(--atlas-spacing-md)', opacity: 0.9, maxWidth: 500, margin: 'var(--atlas-spacing-md) auto 0' }}>
            Explore our latest thinking on industry trends, product guides, and brand stories.
          </p>
          <a href="/resources" className="atlas-btn atlas-btn-secondary" style={{ marginTop: 'var(--atlas-spacing-xl)', display: 'inline-block' }}>
            Explore Resources
          </a>
        </div>
      </section>
    </div>
  );
}

// Ã¢â€â‚¬Ã¢â€â‚¬ Variant: manifesto Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

interface ManifestoProps {
  siteName: string;
  headline: string;
  subheadline: string;
  teamMembers: TeamMember[];
}

function renderManifesto({ siteName, headline, subheadline, teamMembers }: ManifestoProps) {
  return (
    <div className="atlas-about--manifesto" data-variant="manifesto">

      {/* Ã¢â€â‚¬Ã¢â€â‚¬ Full-viewport opening statement Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <section
        style={{
          minHeight: '100svh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: 'var(--atlas-spacing-4xl) var(--atlas-spacing-xl)',
          background: 'color-mix(in srgb, var(--brand-primary, #2d6a4f) 4%, transparent)',
        }}
      >
        <p className="atlas-overline" style={{ color: 'var(--brand-primary, #2d6a4f)', letterSpacing: '0.2em', marginBottom: 'var(--atlas-spacing-lg)' }}>
          {siteName}
        </p>
        <h1
          className="atlas-h1"
          style={{ maxWidth: 800, fontSize: 'clamp(2rem, 6vw, 4rem)', lineHeight: 1.15, letterSpacing: '-0.02em' }}
        >
          {headline}
        </h1>
        {subheadline && (
          <p className="atlas-body-lg" style={{ marginTop: 'var(--atlas-spacing-xl)', maxWidth: 560, opacity: 0.7, lineHeight: 1.8 }}>
            {subheadline}
          </p>
        )}
        <div style={{ marginTop: 'var(--atlas-spacing-3xl)', width: 1, height: 60, background: 'var(--brand-primary, #2d6a4f)', opacity: 0.3 }} />
      </section>

      {/* Ã¢â€â‚¬Ã¢â€â‚¬ Beliefs as pull-quotes Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <section>
        {MANIFESTO_BELIEFS.map((belief, i) => (
          <div
            key={i}
            style={{
              borderTop: '1px solid color-mix(in srgb, var(--brand-text, #1b1b1b) 12%, transparent)',
              padding: 'var(--atlas-spacing-3xl) 0',
              background: i % 2 === 1 ? 'color-mix(in srgb, var(--brand-primary, #2d6a4f) 4%, transparent)' : 'transparent',
            }}
          >
            <div className="atlas-container" style={{ textAlign: 'center' }}>
              <p
                className="atlas-h2"
                style={{ maxWidth: 720, margin: '0 auto', fontStyle: 'italic', opacity: 0.85, fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}
              >
                &ldquo;{belief}&rdquo;
              </p>
            </div>
          </div>
        ))}
        <div style={{ borderTop: '1px solid color-mix(in srgb, var(--brand-text, #1b1b1b) 12%, transparent)' }} />
      </section>

      {/* Ã¢â€â‚¬Ã¢â€â‚¬ Minimal team list Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */}
      {teamMembers.length > 0 && (
        <section className="atlas-container atlas-section" style={{ textAlign: 'center' }}>
          <p className="atlas-overline" style={{ color: 'var(--brand-primary, #2d6a4f)', letterSpacing: '0.2em', marginBottom: 'var(--atlas-spacing-2xl)' }}>
            The People Behind {siteName}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--atlas-spacing-xl)', justifyContent: 'center' }}>
            {teamMembers.map((member, i) => (
              <div
                key={i}
                style={{
                  borderTop: '2px solid color-mix(in srgb, var(--brand-primary, #2d6a4f) 60%, transparent)',
                  paddingTop: 'var(--atlas-spacing-sm)',
                  minWidth: 160,
                }}
              >
                <p className="atlas-label" style={{ fontWeight: 700 }}>{member.name}</p>
                <p className="atlas-caption" style={{ opacity: 0.6, marginTop: 'var(--atlas-spacing-xs)' }}>{member.role ?? ''}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Ã¢â€â‚¬Ã¢â€â‚¬ Bold closing CTA Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <section
        style={{
          padding: 'var(--atlas-spacing-4xl) 0',
          textAlign: 'center',
          borderTop: '1px solid color-mix(in srgb, var(--brand-text, #1b1b1b) 12%, transparent)',
        }}
      >
        <div className="atlas-container">
          <h2
            className="atlas-h1"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.02em' }}
          >
            Let&apos;s work together.
          </h2>
          <a
            href="/contact"
            className="atlas-btn atlas-btn-primary"
            style={{ marginTop: 'var(--atlas-spacing-2xl)', display: 'inline-block', fontSize: '1.125rem', padding: 'var(--atlas-spacing-md) var(--atlas-spacing-2xl)' }}
          >
            Get in Touch â†’
          </a>
        </div>
      </section>
    </div>
  );
}
