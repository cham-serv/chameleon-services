/**
 * Meridian TeamPage
 *
 * 4 variants:
 *  - grid: Interactive photo grid with department filter tabs (default)
 *  - portfolio: Large photo-dominant cards, great for smaller teams
 *  - department-sections: Members divided by department headings
 *  - list: Compact directory list with quick-contact links
 */

import type { PageProps } from '@/lib/types';
import { getTeamMembers, getDepartments, type TeamMember, type Department } from '@/lib/api';
import TeamGridClient from './TeamGridClient';

// ─── Shared Demo Data ─────────────────────────────────────────────────────

const DEMO_MEMBERS: TeamMember[] = [
  { id: 1, slug: 'jane-smith', name: 'Jane Smith', role: 'Managing Partner', published: true, createdAt: '', updatedAt: '' },
  { id: 2, slug: 'john-doe', name: 'John Doe', role: 'Senior Associate', published: true, createdAt: '', updatedAt: '' },
  { id: 3, slug: 'sarah-lee', name: 'Sarah Lee', role: 'Partner', published: true, createdAt: '', updatedAt: '' },
];

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function PhoneIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 1.14h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z" /></svg>;
}

function MailIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>;
}

// ─── VARIANT: portfolio ───────────────────────────────────────────────────

function PortfolioVariant({ members, headline, subheadline }: { members: TeamMember[]; headline: string; subheadline?: string | null }) {
  return (
    <>
      <section className="mer-section-sm" style={{ borderBottom: '1px solid var(--mer-border-color)' }}>
        <div className="mer-container">
          <div className="mer-section-header--left" data-reveal="up">
            <span className="mer-overline">Our People</span>
            <h1 className="mer-h1 mer-mt-md">{headline}</h1>
            {subheadline && <p className="mer-body-lg mer-mt-lg" style={{ maxWidth: 600, opacity: 0.8 }}>{subheadline}</p>}
          </div>
        </div>
      </section>

      <section className="mer-section">
        <div className="mer-container">
          <div className="mer-grid-2" data-reveal-stagger>
            {members.map((m) => {
              const photo = m.photo && typeof m.photo === 'object' && 'url' in m.photo
                ? (m.photo as { url: string }).url : null;
              const dept = m.department && typeof m.department === 'object' && 'name' in m.department
                ? (m.department as Department) : null;
              
              return (
                <a key={m.id} href={`/team/${m.slug}`} className="mer-card mer-card-hover" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
                  {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photo} alt={m.name} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 'var(--mer-radius-md) var(--mer-radius-md) 0 0' }} />
                  ) : (
                    <div style={{ width: '100%', aspectRatio: '4/3', background: 'var(--brand-surface, #f5f5f5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', color: 'var(--brand-primary, #1a2b5e)', fontWeight: 700, borderRadius: 'var(--mer-radius-md) var(--mer-radius-md) 0 0' }}>
                      {m.name[0]}
                    </div>
                  )}
                  <div className="mer-card-body" style={{ flex: 1, padding: 'var(--mer-spacing-xl)' }}>
                    {dept && <div className="mer-tag mer-tag-dept" style={{ marginBottom: 'var(--mer-spacing-sm)', display: 'inline-flex' }}>{dept.name}</div>}
                    <h3 className="mer-h3" style={{ marginBottom: '0.2em' }}>{m.name}</h3>
                    {m.role && <div style={{ fontSize: '1rem', color: 'color-mix(in srgb, var(--brand-text, #444) 70%, transparent)', marginBottom: 'var(--mer-spacing-lg)' }}>{m.role}</div>}
                    <div className="mer-arrow-link" aria-hidden="true">
                      View profile <ArrowIcon />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

// ─── VARIANT: department-sections ─────────────────────────────────────────

function DepartmentSectionsVariant({ members, departments, headline, subheadline }: { members: TeamMember[]; departments: Department[]; headline: string; subheadline?: string | null }) {
  const activeDepts = departments.filter((d) =>
    members.some((m) => {
      const dept = m.department;
      return dept && typeof dept === 'object' && 'slug' in dept && dept.slug === d.slug;
    })
  );

  return (
    <>
      <section className="mer-section-sm" style={{ borderBottom: '1px solid var(--mer-border-color)' }}>
        <div className="mer-container">
          <div className="mer-section-header--left" data-reveal="up">
            <span className="mer-overline">Our People</span>
            <h1 className="mer-h1 mer-mt-md">{headline}</h1>
            {subheadline && <p className="mer-body-lg mer-mt-lg" style={{ maxWidth: 600, opacity: 0.8 }}>{subheadline}</p>}
          </div>
        </div>
      </section>

      <section className="mer-section">
        <div className="mer-container">
          {activeDepts.map((d) => {
            const deptMembers = members.filter((m) => {
              const dept = m.department;
              return dept && typeof dept === 'object' && 'slug' in dept && dept.slug === d.slug;
            });
            if (deptMembers.length === 0) return null;

            return (
              <div key={d.slug} style={{ marginBottom: 'var(--mer-spacing-4xl)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid var(--brand-primary, #1a2b5e)', paddingBottom: 'var(--mer-spacing-md)', marginBottom: 'var(--mer-spacing-xl)' }}>
                  <h2 className="mer-h2">{d.name}</h2>
                  <span className="mer-body" style={{ opacity: 0.6 }}>{deptMembers.length} {deptMembers.length === 1 ? 'member' : 'members'}</span>
                </div>
                <div className="mer-grid-4">
                  {deptMembers.map((m) => {
                    const photo = m.photo && typeof m.photo === 'object' && 'url' in m.photo
                      ? (m.photo as { url: string }).url : null;
                    return (
                      <a key={m.id} href={`/team/${m.slug}`} className="mer-card mer-card-hover" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
                        {photo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={photo} alt={m.name} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: 'var(--mer-radius-md) var(--mer-radius-md) 0 0' }} />
                        ) : (
                          <div style={{ width: '100%', aspectRatio: '1/1', background: 'var(--brand-surface, #f5f5f5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: 'var(--brand-primary, #1a2b5e)', fontWeight: 700, borderRadius: 'var(--mer-radius-md) var(--mer-radius-md) 0 0' }}>
                            {m.name[0]}
                          </div>
                        )}
                        <div className="mer-card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <h3 className="mer-team-card-name" style={{ marginBottom: '0.2em' }}>{m.name}</h3>
                          {m.role && <div className="mer-team-card-role" style={{ marginBottom: 'var(--mer-spacing-md)' }}>{m.role}</div>}
                          <div className="mer-arrow-link" style={{ marginTop: 'auto' }} aria-hidden="true">
                            View profile <ArrowIcon />
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

// ─── VARIANT: list ────────────────────────────────────────────────────────

function ListVariant({ members, headline, subheadline }: { members: TeamMember[]; headline: string; subheadline?: string | null }) {
  return (
    <>
      <section className="mer-section-sm" style={{ borderBottom: '1px solid var(--mer-border-color)' }}>
        <div className="mer-container">
          <div className="mer-section-header--left" data-reveal="up">
            <span className="mer-overline">Directory</span>
            <h1 className="mer-h1 mer-mt-md">{headline}</h1>
            {subheadline && <p className="mer-body-lg mer-mt-lg" style={{ maxWidth: 600, opacity: 0.8 }}>{subheadline}</p>}
          </div>
        </div>
      </section>

      <section className="mer-section">
        <div className="mer-container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mer-spacing-md)' }}>
            {members.map((m) => {
              const photo = m.photo && typeof m.photo === 'object' && 'url' in m.photo
                ? (m.photo as { url: string }).url : null;
              const dept = m.department && typeof m.department === 'object' && 'name' in m.department
                ? (m.department as Department) : null;
              
              return (
                <div key={m.id} className="mer-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--mer-spacing-md) var(--mer-spacing-xl)', gap: 'var(--mer-spacing-lg)', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--mer-spacing-lg)', flex: '1 1 300px' }}>
                    {photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={photo} alt={m.name} style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'color-mix(in srgb, var(--brand-primary, #1a2b5e) 12%, var(--brand-surface, #f5f5f5) 88%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: 'var(--brand-primary, #1a2b5e)', fontWeight: 700, flexShrink: 0 }}>
                        {m.name[0]}
                      </div>
                    )}
                    <div>
                      {dept && <div className="mer-tag mer-tag-dept" style={{ marginBottom: '4px', display: 'inline-block' }}>{dept.name}</div>}
                      <h3 className="mer-team-card-name" style={{ marginBottom: '2px', fontSize: '1.125rem' }}>{m.name}</h3>
                      {m.role && <div className="mer-team-card-role">{m.role}</div>}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--mer-spacing-lg)', flexWrap: 'wrap' }}>
                    {m.email && m.showEmail && (
                      <a href={`mailto:${m.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4em', color: 'var(--brand-text, #444)', textDecoration: 'none', fontSize: '0.875rem' }}>
                        <MailIcon /> {m.email}
                      </a>
                    )}
                    {m.phone && m.showPhone && (
                      <a href={`tel:${m.phone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4em', color: 'var(--brand-text, #444)', textDecoration: 'none', fontSize: '0.875rem' }}>
                        <PhoneIcon /> {m.phone}
                      </a>
                    )}
                    <a href={`/team/${m.slug}`} className="mer-btn mer-btn-outline" style={{ padding: '0.4em 1em' }}>
                      Profile
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────

export default async function TeamPage({ config, variant }: PageProps) {
  const tenantSlug = config.tenant.slug;
  const pc         = config.pageConfig as any;

  const headline    = pc?.teamHeadline    ?? 'Our People';
  const subheadline = pc?.teamSubheadline ?? null;

  const [teamRes, deptRes] = await Promise.all([
    getTeamMembers({ tenant: tenantSlug }),
    getDepartments(tenantSlug),
  ]);

  const members     = (teamRes?.docs ?? DEMO_MEMBERS).filter((m) => m.published !== false);
  const departments = deptRes?.docs ?? [];

  if (variant === 'portfolio') {
    return <PortfolioVariant members={members} headline={headline} subheadline={subheadline} />;
  }
  if (variant === 'department-sections') {
    return <DepartmentSectionsVariant members={members} departments={departments} headline={headline} subheadline={subheadline} />;
  }
  if (variant === 'list') {
    return <ListVariant members={members} headline={headline} subheadline={subheadline} />;
  }

  // Default: grid (client interactive)
  return <TeamGridClient members={members} departments={departments} headline={headline} subheadline={subheadline} />;
}
