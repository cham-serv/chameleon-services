/**
 * Atlas AboutPage — Server Component
 *
 * Composable section page that renders whichever sections have data.
 * Variant selects the layout style but internally the page gracefully
 * hides sections without content.
 *
 * Variants: team-grid (default), story-split
 */

import type { PageProps } from '@/lib/types';
import { JsonLd } from '@/components/JsonLd';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export default function AboutPage({ config, variant }: PageProps) {
  const tenant = config.tenant.slug;
  const siteName = config.settings?.siteName ?? config.tenant.name;
  const tagline = config.settings?.tagline ?? '';
  const siteUrl = `https://${tenant}.chameleon.services`;
  const contactEmail = config.settings?.contactEmail;
  const pc = config.pageConfig;

  // Content from pageConfig with fallbacks
  const headline = pc?.aboutHeadline ?? `About ${siteName}`;
  const intro = pc?.aboutIntro ?? tagline;
  const teamMembers = pc?.aboutTeamMembers && pc.aboutTeamMembers.length > 0 ? pc.aboutTeamMembers : null;
  const splitImageUrl = pc?.aboutSplitImage?.url ?? null;

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'About' },
  ];

  // Organization JSON-LD
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: siteUrl,
    ...(config.settings?.logo && { logo: config.settings.logo.url }),
    ...(contactEmail && { email: contactEmail }),
    ...(config.settings?.socialLinks && {
      sameAs: Object.values(config.settings.socialLinks).filter(Boolean),
    }),
  };

  return (
    <>
      <JsonLd data={orgSchema} />

      {/* ── Hero Section ──────────────────────────────────────── */}
      <section
        style={{
          background: 'color-mix(in srgb, var(--brand-primary, #2d6a4f) 6%, transparent)',
          padding: 'var(--atlas-spacing-3xl) 0',
          textAlign: 'center',
        }}
      >
        <div className="atlas-container">
          <Breadcrumbs items={breadcrumbs} baseUrl={siteUrl} />
          <h1 className="atlas-h1" style={{ marginTop: 'var(--atlas-spacing-lg)' }}>
            {headline}
          </h1>
          {intro && (
            <p className="atlas-body-lg" style={{ marginTop: 'var(--atlas-spacing-md)', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto', opacity: 0.8 }}>
              {intro}
            </p>
          )}
          {tagline && (
            <p className="atlas-body-lg" style={{ marginTop: 'var(--atlas-spacing-md)', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto', opacity: 0.8 }}>
              {tagline}
            </p>
          )}
        </div>
      </section>

      {/* ── Brand Story Section ───────────────────────────────── */}
      <section className="atlas-container atlas-section">
        {variant === 'story-split' ? (
          /* Zigzag layout: alternating text + image blocks */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--atlas-spacing-2xl)' }}>
            <div className="atlas-zigzag-row" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--atlas-spacing-xl)', alignItems: 'center' }}>
              <div>
                <h2 className="atlas-h3">Our Story</h2>
                <p className="atlas-body" style={{ marginTop: 'var(--atlas-spacing-md)', lineHeight: 1.8 }}>
                  {pc?.aboutIntro ?? `${siteName} was built on the belief that every business deserves a powerful digital presence. We combine cutting-edge technology with deep industry expertise to help brands establish true authority in their market.`}
                </p>
              </div>
              {splitImageUrl ? (
                <img
                  src={splitImageUrl}
                  alt={`About ${siteName}`}
                  style={{
                    width: '100%',
                    aspectRatio: '16/9',
                    objectFit: 'cover',
                    borderRadius: 'var(--atlas-radius-lg)',
                  }}
                />
              ) : (
                <div
                  style={{
                    aspectRatio: '16/9',
                    borderRadius: 'var(--atlas-radius-lg)',
                    background: 'linear-gradient(135deg, color-mix(in srgb, var(--brand-primary, #2d6a4f) 20%, transparent), color-mix(in srgb, var(--brand-secondary, #00E5FF) 20%, transparent))',
                  }}
                />
              )}
            </div>
          </div>
        ) : (
          /* Default: single rich text block */
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <h2 className="atlas-h2" style={{ textAlign: 'center' }}>Our Story</h2>
            <p className="atlas-body-lg" style={{ marginTop: 'var(--atlas-spacing-lg)', lineHeight: 1.8, textAlign: 'center' }}>
              {siteName} was founded with a clear mission: to help businesses establish genuine authority
              in their market through intelligent content, optimised commerce, and data-driven strategy.
            </p>
            <p className="atlas-body" style={{ marginTop: 'var(--atlas-spacing-md)', lineHeight: 1.8, textAlign: 'center' }}>
              We believe that every brand has a unique story to tell, and the right platform can amplify
              that story to reach the people who matter most. Our approach combines modern technology
              with deep expertise in search, content, and conversion optimisation.
            </p>
          </div>
        )}
      </section>

      {/* ── Value Proposition ─────────────────────────────────── */}
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

      {/* ── Team Section ──────────────────────────────────────── */}
      <section className="atlas-container atlas-section">
        <h2 className="atlas-h3" style={{ textAlign: 'center', marginBottom: 'var(--atlas-spacing-2xl)' }}>
          Our Team
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--atlas-spacing-xl)' }}>
          {teamMembers ? (
            teamMembers.map((member, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                {member.photo?.url ? (
                  <img
                    src={member.photo.url}
                    alt={member.name}
                    style={{
                      width: 120, height: 120,
                      borderRadius: '50%',
                      margin: '0 auto',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 120, height: 120,
                      borderRadius: '50%',
                      margin: '0 auto',
                      background: `linear-gradient(135deg, color-mix(in srgb, var(--brand-primary, #2d6a4f) ${20 + i * 10}%, transparent), color-mix(in srgb, var(--brand-secondary, #00E5FF) ${20 + i * 5}%, transparent))`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '2rem',
                    }}
                  >
                    {member.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                )}
                <h3 className="atlas-h6" style={{ marginTop: 'var(--atlas-spacing-md)' }}>{member.name}</h3>
                <p className="atlas-caption" style={{ opacity: 0.7 }}>{member.role ?? ''}</p>
                {member.bio && (
                  <p className="atlas-body" style={{ fontSize: '0.8rem', marginTop: 'var(--atlas-spacing-xs)', opacity: 0.6 }}>{member.bio}</p>
                )}
              </div>
            ))
          ) : (
            PLACEHOLDER_TEAM.map((member, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: 120, height: 120,
                    borderRadius: '50%',
                    margin: '0 auto',
                    background: `linear-gradient(135deg, color-mix(in srgb, var(--brand-primary, #2d6a4f) ${20 + i * 10}%, transparent), color-mix(in srgb, var(--brand-secondary, #00E5FF) ${20 + i * 5}%, transparent))`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2rem',
                  }}
                >
                  {member.initials}
                </div>
                <h3 className="atlas-h6" style={{ marginTop: 'var(--atlas-spacing-md)' }}>{member.name}</h3>
                <p className="atlas-caption" style={{ opacity: 0.7 }}>{member.role}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ── CTA Section ───────────────────────────────────────── */}
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
          <a
            href="/contact"
            className="atlas-btn atlas-btn-secondary"
            style={{ marginTop: 'var(--atlas-spacing-xl)', display: 'inline-block' }}
          >
            Contact Us
          </a>
        </div>
      </section>
    </>
  );
}

// ── Static Data (future: driven by engine fields) ───────────────────────────

const VALUES = [
  { icon: '🎯', title: 'Authority-First Approach', description: 'Every decision is guided by building genuine market authority through content and commerce.' },
  { icon: '⚡', title: 'Performance Optimised', description: 'Lightning-fast pages, SEO-ready architecture, and conversion-focused design from day one.' },
  { icon: '🔬', title: 'Data-Driven Strategy', description: 'Intelligent insights and analytics that help you understand and grow your audience.' },
];

const PLACEHOLDER_TEAM = [
  { name: 'Team Member', role: 'Founder & CEO', initials: 'TM' },
  { name: 'Team Member', role: 'Head of Product', initials: 'TM' },
  { name: 'Team Member', role: 'Lead Developer', initials: 'TM' },
  { name: 'Team Member', role: 'Content Strategist', initials: 'TM' },
];
