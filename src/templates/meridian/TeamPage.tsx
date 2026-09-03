/**
 * Meridian TeamPage
 *
 * 4 variants driven by the CMS variant selection:
 *
 *  grid               — photo grid with interactive department filter tabs (default)
 *  portfolio          — horizontal split cards; photo left, bio excerpt right
 *  department-sections— members grouped under department headings with dept email
 *  list               — compact directory; photo + name/role + quick contact links
 *
 * All variants:
 *  - Fetch team members + departments in parallel from the engine
 *  - Fall back to demo data so the page is never blank
 *  - End with the shared CTA strip pointing to /contact
 */

import type { PageProps } from '@/lib/types';
import type { MeridianPageConfig } from '@/lib/types';
import { getTeamMembers, getDepartments } from '@/lib/api';
import type { TeamMember, Department } from '@/lib/api';
import TeamDeptFilterClient from './TeamDeptFilterClient';

// ─── Demo fallback ─────────────────────────────────────────────────────────

const DEMO_MEMBERS: TeamMember[] = [
  {
    id: 1, slug: 'jane-smith',    name: 'Jane Smith',    role: 'Managing Partner',
    admissionYear: '1998', yearsExperience: 26,
    qualifications: [{ qualification: 'LLB (UCT)' }, { qualification: 'LLM (Cambridge)' }],
    published: true, createdAt: '', updatedAt: '',
  },
  {
    id: 2, slug: 'michael-adebayo', name: 'Michael Adebayo', role: 'Senior Partner',
    admissionYear: '2002', yearsExperience: 22,
    qualifications: [{ qualification: 'BComm LLB (Wits)' }],
    published: true, createdAt: '', updatedAt: '',
  },
  {
    id: 3, slug: 'sarah-du-toit',  name: 'Sarah du Toit',  role: 'Partner — Tax Advisory',
    admissionYear: '2006', yearsExperience: 18,
    qualifications: [{ qualification: 'BCom (UNISA)' }, { qualification: 'HDip Tax' }],
    published: true, createdAt: '', updatedAt: '',
  },
  {
    id: 4, slug: 'priya-naidoo',   name: 'Priya Naidoo',   role: 'Associate',
    admissionYear: '2018', yearsExperience: 6,
    qualifications: [{ qualification: 'LLB (UKZN)' }],
    published: true, createdAt: '', updatedAt: '',
  },
];

// ─── Shared sub-components ─────────────────────────────────────────────────

/** Arrow used on "View profile" links */
function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

/** Page hero shared across all variants */
function PageHero({ overline, headline, subheadline }: { overline: string; headline: string; subheadline?: string | null }) {
  return (
    <section className="mer-section-sm" style={{ borderBottom: '1px solid var(--mer-border-color)' }}>
      <div className="mer-container">
        <div className="mer-section-header--left" data-reveal="up">
          <span className="mer-overline">{overline}</span>
          <h1 className="mer-h1" style={{ marginTop: 'var(--mer-spacing-md)' }}>{headline}</h1>
          {subheadline && (
            <p className="mer-body-lg" style={{ maxWidth: '60ch', opacity: 0.8, marginTop: 'var(--mer-spacing-lg)' }}>
              {subheadline}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

/** CTA strip shared across all variants */
function TeamCta() {
  return (
    <div className="mer-cta-strip">
      <div className="mer-cta-strip-inner">
        <div>
          <p className="mer-h3" style={{ color: '#fff', marginBottom: 'var(--mer-spacing-xs)' }}>
            Want to work with our team?
          </p>
          <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '1.0625rem' }}>
            Get in touch and we will match you with the right advisor.
          </p>
        </div>
        <a href="/contact" className="mer-btn mer-btn-white" style={{ flexShrink: 0 }}>
          Contact Us
        </a>
      </div>
    </div>
  );
}

// ─── VARIANT: grid ─────────────────────────────────────────────────────────
// Interactive photo grid with department filter tabs.
// Client component handles the filtering; this server component fetches the data.

function GridVariant({ members, departments, headline, subheadline }: {
  members: TeamMember[];
  departments: Department[];
  headline: string;
  subheadline?: string | null;
}) {
  return (
    <>
      <PageHero overline="Our People" headline={headline} subheadline={subheadline} />
      <section className="mer-section">
        <div className="mer-container">
          <TeamDeptFilterClient members={members} departments={departments} />
        </div>
      </section>
      <TeamCta />
    </>
  );
}

// ─── VARIANT: portfolio ────────────────────────────────────────────────────
// Horizontal split cards — large photo on the left, bio on the right.
// Uses the dedicated `.mer-team-portfolio-card` classes from the design system.

function PortfolioVariant({ members, headline, subheadline }: {
  members: TeamMember[];
  headline: string;
  subheadline?: string | null;
}) {
  return (
    <>
      <PageHero overline="Meet Our People" headline={headline} subheadline={subheadline} />
      <section className="mer-section">
        <div className="mer-container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mer-spacing-xl)' }} data-reveal-stagger>
            {members.map((m) => {
              const photoUrl =
                m.photo && typeof m.photo === 'object' && 'url' in m.photo
                  ? (m.photo as { url: string }).url
                  : null;
              const dept =
                m.department && typeof m.department === 'object' && 'name' in m.department
                  ? (m.department as Department)
                  : null;

              return (
                <a key={m.id} href={`/team/${m.slug}`} className="mer-team-portfolio-card" style={{ textDecoration: 'none' }}>
                  {photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="mer-team-portfolio-card-photo" src={photoUrl} alt={m.name} loading="lazy" />
                  ) : (
                    <div
                      className="mer-team-portfolio-card-photo"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'color-mix(in srgb, var(--brand-primary, #1a2b5e) 8%, var(--brand-surface, #f5f5f5) 92%)',
                        color: 'color-mix(in srgb, var(--brand-primary, #1a2b5e) 40%, transparent)',
                        fontSize: '4rem',
                      }}
                      aria-hidden="true"
                    >
                      {m.name[0]}
                    </div>
                  )}
                  <div className="mer-team-portfolio-card-body">
                    {dept && (
                      <span className="mer-tag mer-tag-dept" style={{ marginBottom: 'var(--mer-spacing-md)', display: 'inline-flex' }}>
                        {dept.name}
                      </span>
                    )}
                    <h2 className="mer-h3" style={{ marginBottom: '0.2em' }}>{m.name}</h2>
                    {m.role && (
                      <p style={{ fontSize: '1rem', color: 'var(--brand-primary, #1a2b5e)', fontWeight: 600, marginBottom: 'var(--mer-spacing-lg)' }}>
                        {m.role}
                      </p>
                    )}
                    {/* Qualifications as credential pills */}
                    {(m.qualifications ?? []).length > 0 && (
                      <div className="mer-profile-credentials" style={{ marginBottom: 'var(--mer-spacing-lg)' }}>
                        {m.qualifications!.map((q, i) => (
                          <span key={i} className="mer-profile-credential">{q.qualification}</span>
                        ))}
                      </div>
                    )}
                    {m.yearsExperience && (
                      <p className="mer-caption" style={{ marginBottom: 'var(--mer-spacing-lg)' }}>
                        {m.yearsExperience} years of experience
                      </p>
                    )}
                    <span className="mer-arrow-link" style={{ marginTop: 'auto' }}>
                      View profile <Arrow />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>
      <TeamCta />
    </>
  );
}

// ─── VARIANT: department-sections ─────────────────────────────────────────
// Members grouped under department headings.
// Uses .mer-dept-section, .mer-dept-header, .mer-dept-name from the design system.

function DepartmentSectionsVariant({ members, departments, headline, subheadline }: {
  members: TeamMember[];
  departments: Department[];
  headline: string;
  subheadline?: string | null;
}) {
  // Group members by department slug; ungrouped members go into a catch-all section
  const grouped = new Map<string, { dept: Department; members: TeamMember[] }>();

  for (const dept of departments) {
    const deptMembers = members.filter((m) => {
      if (!m.department || typeof m.department === 'number') return false;
      return (m.department as Department).slug === dept.slug;
    });
    if (deptMembers.length > 0) {
      grouped.set(dept.slug, { dept, members: deptMembers });
    }
  }

  const ungrouped = members.filter(
    (m) => !m.department || typeof m.department === 'number',
  );

  return (
    <>
      <PageHero overline="Our Departments" headline={headline} subheadline={subheadline} />
      <section className="mer-section">
        <div className="mer-container">
          {Array.from(grouped.values()).map(({ dept, members: deptMembers }) => (
            <div key={dept.slug} className="mer-dept-section" data-reveal="up">
              <div className="mer-dept-header">
                <div>
                  <h2 className="mer-dept-name">{dept.name}</h2>
                  {dept.description && (
                    <p className="mer-body-sm" style={{ marginTop: '0.25em', opacity: 0.75 }}>{dept.description}</p>
                  )}
                </div>
                {dept.email && (
                  <a href={`mailto:${dept.email}`} className="mer-dept-email" aria-label={`Email ${dept.name} department`}>
                    {dept.email}
                  </a>
                )}
              </div>
              <div className="mer-grid-4">
                {deptMembers.map((m) => {
                  const photoUrl =
                    m.photo && typeof m.photo === 'object' && 'url' in m.photo
                      ? (m.photo as { url: string }).url
                      : null;
                  return (
                    <a key={m.id} href={`/team/${m.slug}`} className="mer-team-card" style={{ textDecoration: 'none' }}>
                      {photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img className="mer-team-card-photo" src={photoUrl} alt={m.name} loading="lazy" />
                      ) : (
                        <div className="mer-team-card-photo-placeholder" aria-hidden="true">{m.name[0]}</div>
                      )}
                      <div className="mer-team-card-body">
                        <h3 className="mer-team-card-name">{m.name}</h3>
                        {m.role && <p className="mer-team-card-role">{m.role}</p>}
                        <span className="mer-arrow-link" style={{ display: 'inline-flex', marginTop: 'var(--mer-spacing-sm)' }}>
                          Profile <Arrow />
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Ungrouped members — render without a dept header */}
          {ungrouped.length > 0 && (
            <div className="mer-dept-section" data-reveal="up">
              <div className="mer-dept-header">
                <h2 className="mer-dept-name">General</h2>
              </div>
              <div className="mer-grid-4">
                {ungrouped.map((m) => {
                  const photoUrl =
                    m.photo && typeof m.photo === 'object' && 'url' in m.photo
                      ? (m.photo as { url: string }).url
                      : null;
                  return (
                    <a key={m.id} href={`/team/${m.slug}`} className="mer-team-card" style={{ textDecoration: 'none' }}>
                      {photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img className="mer-team-card-photo" src={photoUrl} alt={m.name} loading="lazy" />
                      ) : (
                        <div className="mer-team-card-photo-placeholder" aria-hidden="true">{m.name[0]}</div>
                      )}
                      <div className="mer-team-card-body">
                        <h3 className="mer-team-card-name">{m.name}</h3>
                        {m.role && <p className="mer-team-card-role">{m.role}</p>}
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
      <TeamCta />
    </>
  );
}

// ─── VARIANT: list ─────────────────────────────────────────────────────────
// Compact directory — one row per person with photo, name, role, and quick contact.

function ListVariant({ members, headline, subheadline }: {
  members: TeamMember[];
  headline: string;
  subheadline?: string | null;
}) {
  return (
    <>
      <PageHero overline="Directory" headline={headline} subheadline={subheadline} />
      <section className="mer-section">
        <div className="mer-container">
          <div role="list" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {members.map((m, i) => {
              const photoUrl =
                m.photo && typeof m.photo === 'object' && 'url' in m.photo
                  ? (m.photo as { url: string }).url
                  : null;
              const dept =
                m.department && typeof m.department === 'object' && 'name' in m.department
                  ? (m.department as Department)
                  : null;
              const isLast = i === members.length - 1;

              return (
                <div
                  key={m.id}
                  role="listitem"
                  data-reveal="up"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '56px 1fr auto',
                    alignItems: 'center',
                    gap: 'var(--mer-spacing-lg)',
                    padding: 'var(--mer-spacing-lg) 0',
                    borderBottom: isLast ? 'none' : '1px solid var(--mer-border-color)',
                  }}
                >
                  {/* Photo avatar */}
                  {photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photoUrl}
                      alt={m.name}
                      loading="lazy"
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
                        fontFamily: 'var(--font-heading, inherit)',
                        fontSize: '1.25rem', fontWeight: 700,
                      }}
                    >
                      {m.name[0]}
                    </div>
                  )}

                  {/* Name / role / dept */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--mer-spacing-sm)', flexWrap: 'wrap' }}>
                      <span className="mer-team-card-name" style={{ marginBottom: 0 }}>{m.name}</span>
                      {dept && <span className="mer-tag mer-tag-dept">{dept.name}</span>}
                    </div>
                    {m.role && <p className="mer-team-card-role" style={{ marginBottom: 0 }}>{m.role}</p>}
                    {m.admissionYear && (
                      <p className="mer-caption" style={{ marginTop: '0.15em' }}>Admitted {m.admissionYear}</p>
                    )}
                  </div>

                  {/* Quick actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--mer-spacing-md)', flexShrink: 0 }}>
                    {m.email && m.showEmail && (
                      <a
                        href={`mailto:${m.email}`}
                        className="mer-btn mer-btn-ghost mer-btn-sm"
                        aria-label={`Email ${m.name}`}
                        title={m.email}
                      >
                        {/* Mail icon */}
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                        <span className="mer-sr-only">Email</span>
                      </a>
                    )}
                    {m.phone && m.showPhone && (
                      <a
                        href={`tel:${m.phone}`}
                        className="mer-btn mer-btn-ghost mer-btn-sm"
                        aria-label={`Call ${m.name}`}
                        title={m.phone}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 1.14h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z" />
                        </svg>
                        <span className="mer-sr-only">Call</span>
                      </a>
                    )}
                    <a href={`/team/${m.slug}`} className="mer-btn mer-btn-outline mer-btn-sm">
                      Profile
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <TeamCta />
    </>
  );
}

// ─── Root export ────────────────────────────────────────────────────────────

export default async function TeamPage({ config, variant }: PageProps) {
  const tenantSlug = config.tenant.slug;
  const pc         = config.pageConfig as MeridianPageConfig | null;

  const headline    = pc?.teamHeadline    ?? 'Our People';
  const subheadline = pc?.teamSubheadline ?? null;

  const [teamRes, deptRes] = await Promise.all([
    getTeamMembers({ tenant: tenantSlug }),
    getDepartments(tenantSlug),
  ]);

  // Filter unpublished; fall back to demo if nothing is configured yet
  const members     = (teamRes?.docs  ?? DEMO_MEMBERS).filter((m) => m.published !== false);
  const departments = deptRes?.docs ?? [];

  switch (variant) {
    case 'portfolio':
      return <PortfolioVariant members={members} headline={headline} subheadline={subheadline} />;
    case 'department-sections':
      return <DepartmentSectionsVariant members={members} departments={departments} headline={headline} subheadline={subheadline} />;
    case 'list':
      return <ListVariant members={members} headline={headline} subheadline={subheadline} />;
    default: // 'grid'
      return <GridVariant members={members} departments={departments} headline={headline} subheadline={subheadline} />;
  }
}