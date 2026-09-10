'use client';

/**
 * TeamGridClient
 * 
 * Client component for the 'grid' variant of TeamPage.
 * Features:
 *  - Department filter tabs (All + each dept)
 *  - Responsive grid of team member cards
 *  - URL hash routing: ?dept=slug pre-selects a filter tab
 */

import { useState, useEffect } from 'react';
import type { TeamMember, Department } from '@/lib/api';

interface Props {
  members: TeamMember[];
  departments: Department[];
  headline: string;
  subheadline?: string | null;
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export default function TeamGridClient({ members, departments, headline, subheadline }: Props) {
  const [activeDept, setActiveDept] = useState<string>('all');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const dept = new URLSearchParams(window.location.search).get('dept');
    if (dept) setActiveDept(dept);
  }, []);

  const filtered = activeDept === 'all'
    ? members
    : members.filter((m) => {
        const dept = m.department;
        if (!dept) return false;
        if (typeof dept === 'object' && 'slug' in dept) return dept.slug === activeDept;
        return false;
      });

  // Get unique departments that actually have members
  const activeDepts = departments.filter((d) =>
    members.some((m) => {
      const dept = m.department;
      return dept && typeof dept === 'object' && 'slug' in dept && dept.slug === d.slug;
    })
  );

  return (
    <>
      {/* Page hero */}
      <section className="mer-section-sm" style={{ borderBottom: '1px solid var(--mer-border-color)' }}>
        <div className="mer-container">
          <div className="mer-section-header--left">
            <span className="mer-overline">Our People</span>
            <h1 className="mer-h1 mer-mt-md">{headline}</h1>
            {subheadline && <p className="mer-body-lg mer-mt-lg" style={{ maxWidth: 600, opacity: 0.8 }}>{subheadline}</p>}
          </div>
        </div>
      </section>

      <section className="mer-section">
        <div className="mer-container">
          {/* Filter tabs */}
          {activeDepts.length > 0 && (
            <div className="mer-filter-tabs" role="tablist" aria-label="Filter by department">
              <button
                type="button"
                role="tab"
                aria-selected={activeDept === 'all'}
                className="mer-filter-tab"
                data-active={activeDept === 'all'}
                onClick={() => setActiveDept('all')}
              >
                All Teams
              </button>
              {activeDepts.map((dept) => (
                <button
                  key={dept.slug}
                  type="button"
                  role="tab"
                  aria-selected={activeDept === dept.slug}
                  className="mer-filter-tab"
                  data-active={activeDept === dept.slug ? 'true' : 'false'}
                  onClick={() => setActiveDept(dept.slug)}
                >
                  {dept.name}
                </button>
              ))}
            </div>
          )}

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="mer-grid-4">
              {filtered.map((m) => {
                const photo = m.photo && typeof m.photo === 'object' && 'url' in m.photo
                  ? (m.photo as { url: string }).url : null;
                const dept = m.department && typeof m.department === 'object' && 'name' in m.department
                  ? (m.department as Department) : null;
                
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
                      {dept && <div className="mer-tag mer-tag-dept" style={{ marginBottom: 'var(--mer-spacing-sm)', display: 'inline-flex', alignSelf: 'flex-start' }}>{dept.name}</div>}
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
          ) : (
            <div style={{ textAlign: 'center', padding: 'var(--mer-spacing-4xl)', color: 'var(--mer-text-muted)' }}>
              <p className="mer-body">No team members found.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
