/**
 * Meridian AboutPage
 *
 * Sections (in order):
 *   1. Hero — overline + headline + intro paragraph + optional CTA
 *   2. Story — rich text narrative with optional side image
 *   3. Values — icon + title + description card grid
 *   4. Milestones — timeline of { year, event } pairs
 *   5. Featured team strip — featured members from the engine (links to /team)
 *   6. CTA strip — full-width "Work with us" banner
 *
 * All content driven by MeridianPageConfig (aboutHeadline, aboutIntro,
 * aboutStory, aboutImage, aboutValues, aboutMilestones).
 * Falls back to built-in demo data so the page is never blank.
 */

import type { PageProps } from '@/lib/types';
import { MeridianIcon } from './MeridianIcon';
import type { MeridianPageConfig } from '@/lib/types';
import { getTeamMembers } from '@/lib/api';
import type { TeamMember } from '@/lib/api';
import { RichTextRenderer } from '@/components/RichTextRenderer';

// ─── Demo fallback data ────────────────────────────────────────────────────

const DEMO_VALUES = [
  { icon: 'ShieldCheck',   title: 'Integrity',       description: 'We act with unwavering honesty and hold ourselves to the highest ethical standards in every matter.' },
  { icon: 'Search',        title: 'Precision',        description: 'Detail matters. We research thoroughly, advise carefully, and draft with exactness.' },
  { icon: 'Handshake',     title: 'Partnership',      description: 'We build lasting relationships — not transactional ones. Your success is our measure.' },
  { icon: 'GraduationCap', title: 'Expertise',        description: 'Decades of combined experience across practice areas and jurisdictions.' },
  { icon: 'DoorOpen',      title: 'Accessibility',    description: 'World-class counsel should not be a privilege. We are direct, responsive, and clear.' },
  { icon: 'Lock',          title: 'Confidentiality',  description: 'Your matter is handled with the utmost discretion. Always.' },
];

const DEMO_MILESTONES = [
  { year: '1994', event: 'Founded in Cape Town as a two-partner boutique practice.' },
  { year: '2001', event: 'Opened Johannesburg office; expanded into corporate and tax advisory.' },
  { year: '2008', event: 'Navigated the financial crisis — advised on 40+ debt restructurings.' },
  { year: '2015', event: 'Launched specialist family law and estate planning division.' },
  { year: '2019', event: 'Recognised as a top-tier firm by independent legal directories.' },
  { year: '2024', event: '30-year anniversary. 2,400+ matters. Still independent.' },
];

// ─── Sub-components ────────────────────────────────────────────────────────

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function TeamMemberAvatar({ member }: { member: TeamMember }) {
  const photoUrl =
    member.photo && typeof member.photo === 'object' && 'url' in member.photo
      ? (member.photo as { url: string }).url
      : null;

  return (
    <a href={`/team/${member.slug}`} className="mer-card mer-card-hover" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 'var(--mer-spacing-md)', padding: 'var(--mer-spacing-md)' }}>
      {photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photoUrl}
          alt={member.name}
          style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', flexShrink: 0 }}
        />
      ) : (
        <div
          aria-hidden="true"
          style={{
            width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
            background: 'color-mix(in srgb, var(--brand-primary, #1a2b5e) 10%, var(--brand-surface, #f5f5f5) 90%)',
            color: 'var(--brand-primary, #1a2b5e)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-heading, inherit)', fontSize: '1.25rem', fontWeight: 700,
          }}
        >
          {member.name[0]}
        </div>
      )}
      <div style={{ minWidth: 0 }}>
        <p className="mer-team-card-name" style={{ marginBottom: '0.1em', fontSize: '0.9375rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.name}</p>
        {member.role && <p className="mer-team-card-role" style={{ marginBottom: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.role}</p>}
      </div>
    </a>
  );
}

// ─── Root export ────────────────────────────────────────────────────────────

export default async function AboutPage({ config }: PageProps) {
  const tenantSlug = config.tenant.slug;
  const pc         = config.pageConfig as MeridianPageConfig | null;
  const settings   = config.settings;

  const headline   = pc?.aboutHeadline ?? 'Our Firm';
  const intro      = pc?.aboutIntro    ?? `${settings?.siteName ?? 'We'} have been delivering trusted professional advice for over three decades. Built on integrity, driven by expertise.`;
  const values     = (pc?.aboutValues ?? DEMO_VALUES) as { icon?: string; title: string; description: string }[];
  const milestones = (pc?.aboutMilestones ?? DEMO_MILESTONES) as { year: string; event: string }[];
  const aboutImage = pc?.aboutImage ?? null;

  // Featured team members for the "Meet some of our people" strip
  const teamRes      = await getTeamMembers({ tenant: tenantSlug, featured: true, limit: 6 });
  const featuredTeam = (teamRes?.docs ?? []).filter((m) => m.published !== false);

  return (
    <>
      {/* ── 1. Hero ───────────────────────────────────────────────── */}
      <section className="mer-section-sm" style={{ borderBottom: '1px solid var(--mer-border-color)' }}>
        <div className="mer-container">
          <div style={{ maxWidth: '72ch' }} data-reveal="up">
            <span className="mer-overline">About the Firm</span>
            <h1 className="mer-h1" style={{ marginTop: 'var(--mer-spacing-md)', marginBottom: 'var(--mer-spacing-lg)' }}>
              {headline}
            </h1>
            <p className="mer-body-lg" style={{ opacity: 0.8 }}>{intro}</p>
          </div>
        </div>
      </section>

      {/* ── 2. Story ──────────────────────────────────────────────── */}
      {(!!pc?.aboutStory || aboutImage) && (
        <section className="mer-section">
          <div className="mer-container">
            <div className={aboutImage ? 'mer-about-story' : 'mer-about-story mer-about-story--no-image'}>
              {!!pc?.aboutStory && (
                <div className="mer-prose" data-reveal="up">
                  <RichTextRenderer content={pc.aboutStory as Record<string, unknown>} />
                </div>
              )}
              {aboutImage && (
                <div className="mer-img-zoom" style={{ borderRadius: 'var(--mer-radius-xl)', overflow: 'hidden' }} data-reveal="right">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={aboutImage.url}
                    alt={aboutImage.alt ?? headline}
                    style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block', borderRadius: 'var(--mer-radius-xl)' }}
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── 3. Values grid ────────────────────────────────────────── */}
      {values.length > 0 && (
        <section className="mer-section mer-surface">
          <div className="mer-container">
            <div className="mer-section-header" data-reveal="up">
              <span className="mer-overline">What We Stand For</span>
              <h2 className="mer-h2">Our Core Values</h2>
            </div>
            <div className="mer-grid-3" data-reveal-stagger>
              {values.map((v, i) => (
                <div key={i} className="mer-card" style={{ padding: 'var(--mer-spacing-xl)' }}>
                  {v.icon && (
                    <div
                      aria-hidden="true"
                      style={{
                        width: 48, height: 48, borderRadius: 'var(--mer-radius-md)',
                        background: 'color-mix(in srgb, var(--brand-primary, #1a2b5e) 8%, transparent)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--brand-primary, #1a2b5e)',
                        marginBottom: 'var(--mer-spacing-lg)',
                      }}
                    >
                      <MeridianIcon name={v.icon} size={22} strokeWidth={1.5} />
                    </div>
                  )}
                  <h3 className="mer-h5" style={{ marginBottom: 'var(--mer-spacing-sm)' }}>{v.title}</h3>
                  <p className="mer-body-sm" style={{ opacity: 0.8 }}>{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 4. Milestones timeline ────────────────────────────────── */}
      {milestones.length > 0 && (() => {
        // Derive the year range from milestone data so the heading is always accurate
        const years    = milestones.map((m) => parseInt(m.year, 10)).filter(Boolean);
        const minYear  = years.length ? Math.min(...years) : null;
        const maxYear  = years.length ? Math.max(...years) : null;
        const span     = minYear && maxYear && maxYear > minYear ? `${maxYear - minYear}+` : null;
        const milestonesHeading = span ? `${span} Years of Practice` : 'Our Journey';

        return (
        <section className="mer-section">
          <div className="mer-container">
            <div className="mer-section-header--left" data-reveal="up">
              <span className="mer-overline">Our Journey</span>
              <h2 className="mer-h2">{milestonesHeading}</h2>
            </div>
            <div
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--mer-spacing-lg)' }}
              data-reveal-stagger
            >
              {milestones.map((m, i) => (
                <div
                  key={i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr',
                    gap: 'var(--mer-spacing-lg)',
                    paddingLeft: 'var(--mer-spacing-lg)',
                    borderLeft: '2px solid var(--brand-primary, #1a2b5e)',
                  }}
                >
                  <div style={{ display: 'contents' }}>
                    <div>
                      <p style={{ fontFamily: 'var(--font-heading, inherit)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--brand-primary, #1a2b5e)', lineHeight: 1 }}>{m.year}</p>
                    </div>
                    <div>
                      <p className="mer-body-sm">{m.event}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        );
      })()}

      {/* ── 5. Featured team strip ────────────────────────────────── */}
      {featuredTeam.length > 0 && (
        <section className="mer-section mer-surface">
          <div className="mer-container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--mer-spacing-2xl)', gap: 'var(--mer-spacing-lg)', flexWrap: 'wrap' }}>
              <div>
                <span className="mer-overline" style={{ display: 'block', marginBottom: 'var(--mer-spacing-sm)' }}>Our People</span>
                <h2 className="mer-h2">Meet the Team</h2>
              </div>
              <a href="/team" className="mer-btn mer-btn-outline" style={{ flexShrink: 0 }}>
                View All <ArrowIcon />
              </a>
            </div>
            <div className="mer-grid-3">
              {featuredTeam.map((m) => (
                <TeamMemberAvatar key={m.id} member={m} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 6. CTA strip ──────────────────────────────────────────── */}
      <div className="mer-cta-strip">
        <div className="mer-cta-strip-inner">
          <div>
            <p className="mer-h3" style={{ color: '#fff', marginBottom: 'var(--mer-spacing-xs)' }}>Ready to work together?</p>
            <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '1.0625rem' }}>Contact us and we will match you with the right advisor for your matter.</p>
          </div>
          <a href="/contact" className="mer-btn mer-btn-white" style={{ flexShrink: 0 }}>Get in Touch</a>
        </div>
      </div>
    </>
  );
}