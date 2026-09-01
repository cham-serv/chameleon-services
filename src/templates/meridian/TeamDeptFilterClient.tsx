'use client';

/**
 * TeamDeptFilterClient
 *
 * Interactive department filter tabs for the team grid variant.
 * Reads ?dept=slug from URL on mount to pre-select a tab.
 * Keyboard accessible: tab/enter/space to navigate.
 */

import { useState, useEffect, useMemo } from 'react';
import type { TeamMember, Department } from '@/lib/api';

interface Props {
  members: TeamMember[];
  departments: Department[];
}

function MemberCard({ member }: { member: TeamMember }) {
  const photoUrl =
    member.photo && typeof member.photo === 'object' && 'url' in member.photo
      ? (member.photo as { url: string }).url
      : null;
  const dept =
    member.department && typeof member.department === 'object' && 'name' in member.department
      ? (member.department as Department)
      : null;

  return (
    <a href={`/team/${member.slug}`} className="mer-team-card" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
      {photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="mer-team-card-photo"
          src={photoUrl}
          alt={member.name}
          loading="lazy"
        />
      ) : (
        <div className="mer-team-card-photo-placeholder" aria-hidden="true">
          {member.name[0]}
        </div>
      )}
      <div className="mer-team-card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {dept && (
          <span className="mer-tag mer-tag-dept" style={{ marginBottom: 'var(--mer-spacing-sm)', alignSelf: 'flex-start' }}>
            {dept.name}
          </span>
        )}
        <h3 className="mer-team-card-name">{member.name}</h3>
        {member.role && <p className="mer-team-card-role">{member.role}</p>}
        <div style={{ marginTop: 'auto', paddingTop: 'var(--mer-spacing-sm)' }}>
          <span className="mer-arrow-link">
            View profile
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </a>
  );
}

export default function TeamDeptFilterClient({ members, departments }: Props) {
  const [activeDept, setActiveDept] = useState<string>('all');

  // Pre-select from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dept = params.get('dept');
    if (dept) setActiveDept(dept);
  }, []);

  // Only show dept tabs for departments that actually have members
  const tabDepts = useMemo(
    () =>
      departments.filter((d) =>
        members.some((m) => {
          if (!m.department || typeof m.department === 'number') return false;
          return (m.department as Department).slug === d.slug;
        }),
      ),
    [members, departments],
  );

  const filtered = useMemo(
    () =>
      activeDept === 'all'
        ? members
        : members.filter((m) => {
            if (!m.department || typeof m.department === 'number') return false;
            return (m.department as Department).slug === activeDept;
          }),
    [members, activeDept],
  );

  return (
    <>
      {tabDepts.length > 0 && (
        <div className="mer-filter-tabs" role="tablist" aria-label="Filter by department">
          <button
            type="button"
            role="tab"
            aria-selected={activeDept === 'all'}
            data-active={activeDept === 'all' ? 'true' : 'false'}
            className="mer-filter-tab"
            onClick={() => setActiveDept('all')}
          >
            All
          </button>
          {tabDepts.map((d) => (
            <button
              key={d.slug}
              type="button"
              role="tab"
              aria-selected={activeDept === d.slug}
              data-active={activeDept === d.slug ? 'true' : 'false'}
              className="mer-filter-tab"
              onClick={() => setActiveDept(d.slug)}
            >
              {d.name}
            </button>
          ))}
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="mer-grid-4">
          {filtered.map((m) => (
            <MemberCard key={m.id} member={m} />
          ))}
        </div>
      ) : (
        <p className="mer-body" style={{ opacity: 0.6 }}>No team members in this department yet.</p>
      )}
    </>
  );
}