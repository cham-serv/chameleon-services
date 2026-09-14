/**
 * Nova About Page
 *
 * Single variant: headline → intro → story (richtext) → values grid → team (max 3) → CTA.
 * Team members are inline — no dedicated team page for Nova.
 */

import type { PageProps } from '@/lib/types';
import { RichTextRenderer } from '@/components/RichTextRenderer';
import { JsonLd } from '@/components/JsonLd';

export default function AboutPage({ config }: PageProps) {
  const siteName = config.settings?.siteName ?? config.tenant.name;
  const pc = config.pageConfig as any;

  const headline = pc?.aboutHeadline ?? `About ${siteName}`;
  const intro = pc?.aboutIntro ?? null;
  const story = pc?.aboutStory ?? null;
  const values: Array<{ title: string; description: string; icon?: string }> = pc?.aboutValues ?? [];
  const teamMembers: Array<{
    name: string;
    role?: string;
    photo?: { url: string } | null;
    bio?: string;
  }> = pc?.aboutTeamMembers ?? [];

  // Build site URL for JSON-LD
  const siteUrl = config.tenant.slug.includes('.')
    ? `https://${config.tenant.slug}`
    : `https://${config.tenant.slug}.chameleon.services`;

  // BreadcrumbList JSON-LD
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'About', item: `${siteUrl}/about` },
    ],
  };

  // Organization JSON-LD
  const orgLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: siteUrl,
    ...(config.settings?.logo?.url ? { logo: config.settings.logo.url } : {}),
    ...(intro ? { description: intro } : {}),
    ...(config.settings?.foundedYear ? { foundingDate: String(config.settings.foundedYear) } : {}),
  };
  if (teamMembers.length > 0) {
    orgLd.member = teamMembers.map((m) => ({
      '@type': 'Person',
      name: m.name,
      ...(m.role ? { jobTitle: m.role } : {}),
      ...(m.photo?.url ? { image: m.photo.url } : {}),
    }));
  }

  return (
    <>
      {/* ── Schema ────────────────────────────────────── */}
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={orgLd} />

      {/* ── Page Header ───────────────────────────────── */}
      <div className="nova-page-header">
        <div className="nova-container">
          <span className="nova-label">About Us</span>
          <h1 className="nova-heading nova-heading--page nova-page-header__title" style={{ marginTop: '0.5rem' }}>
            {headline}
          </h1>
          {intro && (
            <p className="nova-subheading" style={{ margin: '0 auto' }} data-speakable>
              {intro}
            </p>
          )}
        </div>
      </div>

      {/* ── Story ─────────────────────────────────────── */}
      {story && (
        <section className="nova-section--sm">
          <div className="nova-container" style={{ maxWidth: 720 }}>
            <div className="nova-richtext" data-speakable>
              <RichTextRenderer content={story} />
            </div>
          </div>
        </section>
      )}

      {/* ── Values / Pillars ──────────────────────────── */}
      {values.length > 0 && (
        <section className="nova-section">
          <div className="nova-container">
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span className="nova-label">Our Values</span>
              <h2 className="nova-heading nova-heading--section" style={{ marginTop: '0.5rem' }}>
                What We Stand For
              </h2>
            </div>
            <div className="nova-grid nova-grid--3">
              {values.map((value, i) => (
                <div key={i} className="nova-value">
                  {value.icon && <div className="nova-value__icon">{value.icon}</div>}
                  <h3 className="nova-value__title">{value.title}</h3>
                  <p className="nova-value__description">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Team ──────────────────────────────────────── */}
      {teamMembers.length > 0 && (
        <section className="nova-section">
          <div className="nova-container">
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span className="nova-label">Meet the Team</span>
              <h2 className="nova-heading nova-heading--section" style={{ marginTop: '0.5rem' }}>
                The People Behind {siteName}
              </h2>
            </div>
            <div className="nova-team">
              {teamMembers.slice(0, 3).map((member, i) => (
                <div key={i} className="nova-team-member">
                  {member.photo?.url && (
                    <img
                      src={member.photo.url}
                      alt={member.name}
                      className="nova-team-member__photo"
                    />
                  )}
                  <div className="nova-team-member__name">{member.name}</div>
                  {member.role && (
                    <div className="nova-team-member__role">{member.role}</div>
                  )}
                  {member.bio && (
                    <p className="nova-team-member__bio">{member.bio}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ───────────────────────────────────────── */}
      <section className="nova-section">
        <div className="nova-container">
          <div className="nova-cta-section">
            <h2 className="nova-heading nova-heading--section">
              Let&apos;s Work Together
            </h2>
            <p className="nova-subheading" style={{ margin: '0.75rem auto 0' }}>
              Have a project in mind? We&apos;d love to hear from you.
            </p>
            <div style={{ marginTop: '1.75rem' }}>
              <a href="/contact" className="nova-btn nova-btn--primary">
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
