/**
 * Meridian AboutPage — 4 variants
 *
 *  standard   (default)
 *    Hero → Story + Image → Values Grid → Milestones Timeline → Featured Team → CTA
 *
 *  leadership
 *    Hero → Leadership Feature (large photo + bio) → Full Team Strip → Values List → CTA
 *
 *  heritage
 *    Hero → Cinematic Timeline → Story Block → Client Logos Scroll → CTA
 *
 *  impact
 *    Hero → Metrics Strip → Values Grid → Client Logos Scroll → Story → CTA
 *
 * Variant is driven by pc.aboutVariant (MeridianSiteConfig select field).
 * All content driven by MeridianPageConfig. Falls back to demo data.
 */

import type { PageProps } from '@/lib/types';
import { MeridianIcon } from './MeridianIcon';
import type { MeridianPageConfig } from '@/lib/types';
import { getTeamMembers } from '@/lib/api';
import type { TeamMember } from '@/lib/api';
import { RichTextRenderer } from '@/components/RichTextRenderer';
import MeridianCounters from './MeridianCounters';

// ─── Types ─────────────────────────────────────────────────────────────────

type ValueItem     = { icon?: string; title: string; description: string };
type MilestoneItem = { year: string; event: string };
type MetricItem    = { value: string; label: string };
type LogoItem      = { name: string; logo: { url: string } | null };

// ─── Demo fallback data ────────────────────────────────────────────────────

const DEMO_VALUES: ValueItem[] = [
  { icon: 'ShieldCheck',   title: 'Integrity',       description: 'We act with unwavering honesty and hold ourselves to the highest ethical standards in every matter.' },
  { icon: 'Search',        title: 'Precision',        description: 'Detail matters. We research thoroughly, advise carefully, and draft with exactness.' },
  { icon: 'Handshake',     title: 'Partnership',      description: 'We build lasting relationships — not transactional ones. Your success is our measure.' },
  { icon: 'GraduationCap', title: 'Expertise',        description: 'Decades of combined experience across practice areas and jurisdictions.' },
  { icon: 'DoorOpen',      title: 'Accessibility',    description: 'World-class counsel should not be a privilege. We are direct, responsive, and clear.' },
  { icon: 'Lock',          title: 'Confidentiality',  description: 'Your matter is handled with the utmost discretion. Always.' },
];

const DEMO_MILESTONES: MilestoneItem[] = [
  { year: '1994', event: 'Founded in Cape Town as a two-partner boutique practice.' },
  { year: '2001', event: 'Opened Johannesburg office; expanded into corporate and tax advisory.' },
  { year: '2008', event: 'Navigated the financial crisis — advised on 40+ debt restructurings.' },
  { year: '2015', event: 'Launched specialist family law and estate planning division.' },
  { year: '2019', event: 'Recognised as a top-tier firm by independent legal directories.' },
  { year: '2024', event: '30-year anniversary. 2,400+ matters. Still independent.' },
];

const DEMO_METRICS: MetricItem[] = [
  { value: '30+',    label: 'Years in Practice' },
  { value: '2,400+', label: 'Matters Handled' },
  { value: '98%',    label: 'Client Satisfaction' },
  { value: '12',     label: 'Practice Areas' },
];

// ─── Shared helpers ────────────────────────────────────────────────────────

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function TeamMemberCard({ member, large = false }: { member: TeamMember; large?: boolean }) {
  const photoUrl =
    member.photo && typeof member.photo === 'object' && 'url' in member.photo
      ? (member.photo as { url: string }).url
      : null;

  if (large) {
    return (
      <a href={`/team/${member.slug}`} className="mer-about-leader-card" style={{ textDecoration: 'none' }}>
        <div className="mer-about-leader-photo">
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              background: 'color-mix(in srgb, var(--brand-primary, #1a2b5e) 10%, var(--brand-surface, #f5f5f5) 90%)',
              color: 'var(--brand-primary, #1a2b5e)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-heading, inherit)', fontSize: '4rem', fontWeight: 700,
            }}>
              {member.name[0]}
            </div>
          )}
        </div>
        <div className="mer-about-leader-bio">
          <span className="mer-overline" style={{ display: 'block', marginBottom: 'var(--mer-spacing-sm)' }}>Leadership</span>
          <h3 className="mer-h2" style={{ marginBottom: 'var(--mer-spacing-sm)' }}>{member.name}</h3>
          {member.role && <p className="mer-body-lg" style={{ color: 'var(--brand-primary, #1a2b5e)', fontWeight: 500, marginBottom: 'var(--mer-spacing-lg)' }}>{member.role}</p>}
          {typeof member.bio === 'string' && member.bio && <p className="mer-body" style={{ opacity: 0.8, lineHeight: 1.75 }}>{member.bio}</p>}
          <span className="mer-arrow-link" style={{ marginTop: 'var(--mer-spacing-lg)', display: 'inline-flex' }}>
            View profile <ArrowIcon />
          </span>
        </div>
      </a>
    );
  }

  return (
    <a href={`/team/${member.slug}`} className="mer-card mer-card-hover" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 'var(--mer-spacing-md)', padding: 'var(--mer-spacing-md)' }}>
      {photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photoUrl} alt={member.name} style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', flexShrink: 0 }} />
      ) : (
        <div aria-hidden="true" style={{
          width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
          background: 'color-mix(in srgb, var(--brand-primary, #1a2b5e) 10%, var(--brand-surface, #f5f5f5) 90%)',
          color: 'var(--brand-primary, #1a2b5e)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-heading, inherit)', fontSize: '1.25rem', fontWeight: 700,
        }}>
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

// ─── Shared sections ───────────────────────────────────────────────────────

function HeroSection({ headline, intro }: { headline: string; intro: string }) {
  return (
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
  );
}

function CtaStrip() {
  return (
    <div className="mer-cta-strip">
      <div className="mer-cta-strip-inner">
        <div>
          <p className="mer-h3" style={{ color: '#fff', marginBottom: 'var(--mer-spacing-xs)' }}>Ready to work together?</p>
          <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '1.0625rem' }}>Contact us and we will match you with the right advisor for your matter.</p>
        </div>
        <a href="/contact" className="mer-btn mer-btn-white" style={{ flexShrink: 0 }}>Get in Touch</a>
      </div>
    </div>
  );
}

function ValuesGrid({ values }: { values: ValueItem[] }) {
  if (!values.length) return null;
  return (
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
                <div aria-hidden="true" style={{
                  width: 48, height: 48, borderRadius: 'var(--mer-radius-md)',
                  background: 'color-mix(in srgb, var(--brand-primary, #1a2b5e) 8%, transparent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--brand-primary, #1a2b5e)',
                  marginBottom: 'var(--mer-spacing-lg)',
                }}>
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
  );
}

function ValuesList({ values }: { values: ValueItem[] }) {
  if (!values.length) return null;
  return (
    <section className="mer-section">
      <div className="mer-container">
        <div className="mer-section-header--left" data-reveal="up">
          <span className="mer-overline">What We Stand For</span>
          <h2 className="mer-h2">Our Core Values</h2>
        </div>
        <div className="mer-about-values-list" data-reveal-stagger>
          {values.map((v, i) => (
            <div key={i} className="mer-about-value-row">
              {v.icon && (
                <div aria-hidden="true" className="mer-about-value-icon">
                  <MeridianIcon name={v.icon} size={20} strokeWidth={1.5} />
                </div>
              )}
              <div>
                <h3 className="mer-h6" style={{ marginBottom: '0.25em' }}>{v.title}</h3>
                <p className="mer-body-sm" style={{ opacity: 0.75, margin: 0 }}>{v.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClientLogosScroll({ logos }: { logos: LogoItem[] }) {
  if (!logos.length) return null;
  // Duplicate the list so the infinite scroll loop is seamless
  const doubled = [...logos, ...logos];
  return (
    <section className="mer-section-sm" style={{ borderTop: '1px solid var(--mer-border-color)', borderBottom: '1px solid var(--mer-border-color)' }}>
      <div className="mer-container" style={{ marginBottom: 'var(--mer-spacing-md)', textAlign: 'center' }}>
        <span className="mer-overline">Trusted By</span>
      </div>
      <div className="mer-logo-strip" aria-label="Client and partner logos">
        <div className="mer-logo-track" aria-hidden="true">
          {doubled.map((l, i) => {
            const logoUrl = l.logo && typeof l.logo === 'object' && 'url' in l.logo ? l.logo.url : null;
            if (!logoUrl) return null;
            return (
              <div key={i} className="mer-logo-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoUrl} alt={l.name} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MetricsStrip({ metrics }: { metrics: MetricItem[] }) {
  if (!metrics.length) return null;
  return (
    <div className="mer-metrics-strip">
      <div className="mer-metrics-grid">
        {metrics.map((m, i) => (
          <div key={i} className="mer-metric-item" data-reveal="up">
            <div className="mer-metric-value">
              <MeridianCounters targetValue={m.value} />
            </div>
            <div className="mer-metric-label">{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StorySection({ story, image, headline }: { story?: Record<string, unknown> | null; image?: { url: string; alt?: string } | null; headline: string }) {
  if (!story && !image) return null;
  return (
    <section className="mer-section">
      <div className="mer-container">
        <div className={image ? 'mer-about-story' : 'mer-about-story mer-about-story--no-image'}>
          {!!story && (
            <div className="mer-prose" data-reveal="up">
              <RichTextRenderer content={story} />
            </div>
          )}
          {image && (
            <div className="mer-img-zoom" style={{ borderRadius: 'var(--mer-radius-xl)', overflow: 'hidden' }} data-reveal="right">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt={image.alt ?? headline}
                style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block', borderRadius: 'var(--mer-radius-xl)' }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function StandardMilestones({ milestones }: { milestones: MilestoneItem[] }) {
  if (!milestones.length) return null;
  const years   = milestones.map((m) => parseInt(m.year, 10)).filter(Boolean);
  const minYear = years.length ? Math.min(...years) : null;
  const maxYear = years.length ? Math.max(...years) : null;
  const span    = minYear && maxYear && maxYear > minYear ? `${maxYear - minYear}+` : null;
  const heading = span ? `${span} Years of Practice` : 'Our Journey';

  return (
    <section className="mer-section">
      <div className="mer-container">
        <div className="mer-section-header--left" data-reveal="up">
          <span className="mer-overline">Our Journey</span>
          <h2 className="mer-h2">{heading}</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--mer-spacing-lg)' }} data-reveal-stagger>
          {milestones.map((m, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 'var(--mer-spacing-lg)',
              paddingLeft: 'var(--mer-spacing-lg)', borderLeft: '2px solid var(--brand-primary, #1a2b5e)',
            }}>
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
}

function HeritageMilestones({ milestones }: { milestones: MilestoneItem[] }) {
  if (!milestones.length) return null;
  return (
    <section className="mer-section">
      <div className="mer-container">
        <div className="mer-section-header" data-reveal="up">
          <span className="mer-overline">Our Journey</span>
          <h2 className="mer-h2">A History of Excellence</h2>
        </div>
        <div className="mer-heritage-timeline">
          {milestones.map((m, i) => (
            <div key={i} className="mer-heritage-milestone" data-reveal="up">
              <div className="mer-heritage-year">{m.year}</div>
              <div className="mer-heritage-dot" aria-hidden="true" />
              <div className="mer-heritage-event">
                <p className="mer-body" style={{ margin: 0 }}>{m.event}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Variant: standard ────────────────────────────────────────────────────

function StandardVariant({ headline, intro, story, image, values, milestones, featuredTeam }: {
  headline: string; intro: string;
  story?: Record<string, unknown> | null; image?: { url: string; alt?: string } | null;
  values: ValueItem[]; milestones: MilestoneItem[]; featuredTeam: TeamMember[];
}) {
  return (
    <>
      <HeroSection headline={headline} intro={intro} />
      <StorySection story={story} image={image} headline={headline} />
      <ValuesGrid values={values} />
      <StandardMilestones milestones={milestones} />

      {featuredTeam.length > 0 && (
        <section className="mer-section mer-surface">
          <div className="mer-container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--mer-spacing-2xl)', gap: 'var(--mer-spacing-lg)', flexWrap: 'wrap' }}>
              <div>
                <span className="mer-overline" style={{ display: 'block', marginBottom: 'var(--mer-spacing-sm)' }}>Our People</span>
                <h2 className="mer-h2">Meet the Team</h2>
              </div>
              <a href="/team" className="mer-btn mer-btn-outline" style={{ flexShrink: 0 }}>View All <ArrowIcon /></a>
            </div>
            <div className="mer-grid-3">
              {featuredTeam.map((m) => <TeamMemberCard key={m.id} member={m} />)}
            </div>
          </div>
        </section>
      )}

      <CtaStrip />
    </>
  );
}

// ─── Variant: leadership ──────────────────────────────────────────────────

function LeadershipVariant({ headline, intro, values, featuredTeam }: {
  headline: string; intro: string;
  values: ValueItem[]; featuredTeam: TeamMember[];
}) {
  const [leader, ...rest] = featuredTeam;

  return (
    <>
      <HeroSection headline={headline} intro={intro} />

      {/* Leadership feature — first featured member, large */}
      {leader && (
        <section className="mer-section">
          <div className="mer-container">
            <TeamMemberCard member={leader} large />
          </div>
        </section>
      )}

      {/* Rest of the team */}
      {rest.length > 0 && (
        <section className="mer-section mer-surface">
          <div className="mer-container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--mer-spacing-2xl)', gap: 'var(--mer-spacing-lg)', flexWrap: 'wrap' }}>
              <div>
                <span className="mer-overline" style={{ display: 'block', marginBottom: 'var(--mer-spacing-sm)' }}>The Team</span>
                <h2 className="mer-h2">Our People</h2>
              </div>
              <a href="/team" className="mer-btn mer-btn-outline" style={{ flexShrink: 0 }}>View All <ArrowIcon /></a>
            </div>
            <div className="mer-grid-3" data-reveal-stagger>
              {rest.slice(0, 6).map((m) => <TeamMemberCard key={m.id} member={m} />)}
            </div>
          </div>
        </section>
      )}

      <ValuesList values={values} />
      <CtaStrip />
    </>
  );
}

// ─── Variant: heritage ────────────────────────────────────────────────────

function HeritageVariant({ headline, intro, story, milestones, logos }: {
  headline: string; intro: string;
  story?: Record<string, unknown> | null;
  milestones: MilestoneItem[]; logos: LogoItem[];
}) {
  return (
    <>
      <HeroSection headline={headline} intro={intro} />
      <HeritageMilestones milestones={milestones} />

      {story && (
        <section className="mer-section mer-surface">
          <div className="mer-container">
            <div style={{ maxWidth: '68ch', marginInline: 'auto' }} data-reveal="up">
              <div className="mer-prose">
                <RichTextRenderer content={story} />
              </div>
            </div>
          </div>
        </section>
      )}

      <ClientLogosScroll logos={logos} />
      <CtaStrip />
    </>
  );
}

// ─── Variant: impact ──────────────────────────────────────────────────────

function ImpactVariant({ headline, intro, metrics, values, logos, story }: {
  headline: string; intro: string;
  metrics: MetricItem[]; values: ValueItem[]; logos: LogoItem[];
  story?: Record<string, unknown> | null;
}) {
  return (
    <>
      <HeroSection headline={headline} intro={intro} />
      <MetricsStrip metrics={metrics} />
      <ValuesGrid values={values} />
      <ClientLogosScroll logos={logos} />

      {story && (
        <section className="mer-section">
          <div className="mer-container">
            <div style={{ maxWidth: '68ch', marginInline: 'auto' }} data-reveal="up">
              <div className="mer-prose">
                <RichTextRenderer content={story} />
              </div>
            </div>
          </div>
        </section>
      )}

      <CtaStrip />
    </>
  );
}

// ─── Root export ────────────────────────────────────────────────────────────

export default async function AboutPage({ config, variant: variantProp }: PageProps) {
  const tenantSlug = config.tenant.slug;
  const pc         = config.pageConfig as MeridianPageConfig | null;
  const settings   = config.settings;

  // Variant — prefer the URL/demo-explorer prop, then the CMS setting, then default
  const variant = variantProp ?? (pc as any)?.aboutVariant ?? 'standard';

  const headline   = pc?.aboutHeadline ?? 'Our Firm';
  const intro      = pc?.aboutIntro    ?? `${settings?.siteName ?? 'We'} have been delivering trusted professional advice for over three decades. Built on integrity, driven by expertise.`;
  const values     = ((pc as any)?.aboutValues     ?? DEMO_VALUES)     as ValueItem[];
  const milestones = ((pc as any)?.aboutMilestones ?? DEMO_MILESTONES) as MilestoneItem[];
  const metrics    = ((pc as any)?.aboutMetrics    ?? DEMO_METRICS)    as MetricItem[];
  const logos      = ((pc as any)?.aboutClientLogos ?? [])             as LogoItem[];
  const aboutImage = pc?.aboutImage ?? null;
  const story      = pc?.aboutStory  ?? null;

  // Featured team members
  const teamRes      = await getTeamMembers({ tenant: tenantSlug, featured: true, limit: 7 });
  const featuredTeam = (teamRes?.docs ?? []).filter((m) => m.published !== false);

  switch (variant) {
    case 'leadership':
      return <LeadershipVariant headline={headline} intro={intro} values={values} featuredTeam={featuredTeam} />;

    case 'heritage':
      return <HeritageVariant headline={headline} intro={intro} story={story as Record<string, unknown> | null} milestones={milestones} logos={logos} />;

    case 'impact':
      return <ImpactVariant headline={headline} intro={intro} metrics={metrics} values={values} logos={logos} story={story as Record<string, unknown> | null} />;

    case 'standard':
    default:
      return (
        <StandardVariant
          headline={headline}
          intro={intro}
          story={story as Record<string, unknown> | null}
          image={aboutImage}
          values={values}
          milestones={milestones}
          featuredTeam={featuredTeam}
        />
      );
  }
}