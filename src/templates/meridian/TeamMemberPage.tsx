/**
 * Meridian TeamMemberPage
 *
 * Route: /team/[slug]
 *
 * Layout — two-column on desktop, stacked on mobile:
 *   Left col (320px sticky):  Photo, contact actions, credentials sidebar
 *   Right col (1fr):          Name, role, dept tag, bio (Lexical richText),
 *                              specialisations pill row, related services grid
 *
 * Uses the CSS classes built into the Meridian design system:
 *   .mer-profile-hero, .mer-profile-photo, .mer-profile-photo-placeholder,
 *   .mer-profile-credentials, .mer-profile-credential, .mer-profile-specialisations
 *
 * Contact CTA routes to /contact?team={slug} so the contact form pre-populates
 * the routing banner and sends the enquiry directly to this person.
 */

import type { PageProps } from '@/lib/types';
import { getTeamMemberBySlug } from '@/lib/api';
import type { TeamMember, Department, Service } from '@/lib/api';
import { RichTextRenderer } from '@/components/RichTextRenderer';

// ─── Inline icons ──────────────────────────────────────────────────────────

function MailIcon()     { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>; }
function PhoneIcon()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 1.14h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z"/></svg>; }
function LinkedInIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>; }
function ArrowIcon()    { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>; }
function CheckIcon()    { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>; }

// ─── Sidebar credential block ──────────────────────────────────────────────

function SidebarSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ paddingBlock: 'var(--mer-spacing-lg)', borderTop: '1px solid var(--mer-border-color)' }}>
      <p className="mer-overline" style={{ marginBottom: 'var(--mer-spacing-sm)' }}>{label}</p>
      {children}
    </div>
  );
}

// ─── Service mini-card ─────────────────────────────────────────────────────

function ServiceMiniCard({ svc }: { svc: Service }) {
  return (
    <a
      href={`/services/${svc.slug}`}
      className="mer-card mer-card-hover"
      style={{ textDecoration: 'none', display: 'block', padding: 'var(--mer-spacing-lg)' }}
    >
      <p style={{ fontFamily: 'var(--font-heading, inherit)', fontWeight: 600, fontSize: '1rem', color: 'var(--brand-heading, inherit)', marginBottom: '0.25em', lineHeight: 1.3 }}>
        {svc.title}
      </p>
      {svc.shortDesc && (
        <p className="mer-body-sm" style={{ opacity: 0.72, marginBottom: 'var(--mer-spacing-sm)' }}>
          {svc.shortDesc}
        </p>
      )}
      <span className="mer-arrow-link" style={{ display: 'inline-flex' }}>
        Learn more <ArrowIcon />
      </span>
    </a>
  );
}

// ─── Not found state ──────────────────────────────────────────────────────

function NotFound({ slug }: { slug: string }) {
  return (
    <section className="mer-section">
      <div className="mer-container-sm" style={{ textAlign: 'center' }}>
        <p className="mer-h2" style={{ marginBottom: 'var(--mer-spacing-md)' }}>Profile not found</p>
        <p className="mer-body" style={{ opacity: 0.7, marginBottom: 'var(--mer-spacing-xl)' }}>
          There is no team member at &ldquo;{slug}&rdquo;.
        </p>
        <a href="/team" className="mer-btn mer-btn-primary">Back to Our People</a>
      </div>
    </section>
  );
}

// ─── Root export ────────────────────────────────────────────────────────────

export default async function TeamMemberPage({ config, path }: PageProps) {
  const tenantSlug = config.tenant.slug;
  const memberSlug = path[1] ?? '';

  if (!memberSlug) return <NotFound slug="(none)" />;

  const member = await getTeamMemberBySlug(tenantSlug, memberSlug);
  if (!member) return <NotFound slug={memberSlug} />;

  // Resolve photo + department + services (depth >= 1 returns full objects)
  const photoUrl =
    member.photo && typeof member.photo === 'object' && 'url' in member.photo
      ? (member.photo as { url: string }).url
      : null;

  const dept =
    member.department && typeof member.department === 'object' && 'name' in member.department
      ? (member.department as Department)
      : null;

  const resolvedServices = (member.services ?? []).filter(
    (s): s is Service => typeof s === 'object' && 'slug' in s,
  );

  return (
    <>
      {/* ── Breadcrumb + hero ───────────────────────────────────────────── */}
      <section className="mer-section-sm" style={{ borderBottom: '1px solid var(--mer-border-color)' }}>
        <div className="mer-container">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" style={{ marginBottom: 'var(--mer-spacing-xl)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.35em' }}>
            <a href="/team" style={{ color: 'color-mix(in srgb, var(--brand-text, #444) 55%, transparent)', textDecoration: 'none' }}>Our People</a>
            <span aria-hidden="true" style={{ opacity: 0.35 }}>/</span>
            <span style={{ color: 'var(--brand-text, #444)', fontWeight: 500 }}>{member.name}</span>
          </nav>

          {/* Two-column profile layout using the design system class */}
          <div className="mer-profile-hero">

            {/* ── Left column: photo + contact + credentials ─────────── */}
            <div>
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="mer-profile-photo"
                  src={photoUrl}
                  alt={member.name}
                  fetchPriority="high"
                />
              ) : (
                <div className="mer-profile-photo-placeholder" aria-hidden="true">
                  {member.name[0]}
                </div>
              )}

              {/* Contact CTA */}
              <div style={{ marginTop: 'var(--mer-spacing-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--mer-spacing-sm)' }}>
                <a
                  href={`/contact?team=${encodeURIComponent(member.slug)}`}
                  className="mer-btn mer-btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Contact {member.name.split(' ')[0]}
                </a>
                {member.linkedIn && member.showLinkedIn && (
                  <a
                    href={member.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mer-btn mer-btn-ghost"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <LinkedInIcon /> LinkedIn
                  </a>
                )}
              </div>

              {/* Credential sidebar sections */}
              {member.email && member.showEmail && (
                <SidebarSection label="Email">
                  <a href={`mailto:${member.email}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5em', color: 'var(--brand-text, #444)', textDecoration: 'none', fontSize: '0.9rem', wordBreak: 'break-all' }}>
                    <MailIcon /> {member.email}
                  </a>
                </SidebarSection>
              )}

              {member.phone && member.showPhone && (
                <SidebarSection label="Phone">
                  <a href={`tel:${member.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5em', color: 'var(--brand-text, #444)', textDecoration: 'none', fontSize: '0.9rem' }}>
                    <PhoneIcon /> {member.phone}
                  </a>
                </SidebarSection>
              )}

              {member.directLine && member.showDirectContact && (
                <SidebarSection label="Direct Line">
                  <a href={`tel:${member.directLine}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5em', color: 'var(--brand-text, #444)', textDecoration: 'none', fontSize: '0.9rem' }}>
                    <PhoneIcon /> {member.directLine}
                  </a>
                </SidebarSection>
              )}

              {member.admissionYear && (
                <SidebarSection label="Admitted">
                  <p style={{ fontSize: '0.9rem', color: 'var(--brand-text, #444)' }}>{member.admissionYear}</p>
                </SidebarSection>
              )}

              {member.yearsExperience && (
                <SidebarSection label="Experience">
                  <p style={{ fontSize: '0.9rem', color: 'var(--brand-text, #444)' }}>{member.yearsExperience} years</p>
                </SidebarSection>
              )}

              {(member.languages ?? []).length > 0 && (
                <SidebarSection label="Languages">
                  <p style={{ fontSize: '0.9rem', color: 'var(--brand-text, #444)' }}>
                    {member.languages!.map((l) => l.language).join(', ')}
                  </p>
                </SidebarSection>
              )}

              {(member.qualifications ?? []).length > 0 && member.showQualifications !== false && (
                <SidebarSection label="Qualifications">
                  <div className="mer-profile-credentials">
                    {member.qualifications!.map((q, i) => (
                      <span key={i} className="mer-profile-credential">{q.qualification}</span>
                    ))}
                  </div>
                </SidebarSection>
              )}
            </div>

            {/* ── Right column: name, bio, services ──────────────────── */}
            <div>
              {/* Tags row */}
              {dept && (
                <span className="mer-tag mer-tag-dept" style={{ marginBottom: 'var(--mer-spacing-md)', display: 'inline-flex' }}>
                  {dept.name}
                </span>
              )}

              {/* Name + role */}
              <h1 className="mer-h1" style={{ marginBottom: '0.25em' }}>{member.name}</h1>
              {member.role && (
                <p style={{
                  fontFamily: 'var(--font-body, inherit)',
                  fontSize: '1.125rem',
                  fontWeight: 500,
                  color: 'var(--brand-primary, #1a2b5e)',
                  marginBottom: 'var(--mer-spacing-2xl)',
                }}>
                  {member.role}
                </p>
              )}

              {/* Bio — Lexical rich text */}
              {member.bio ? (
                <div className="mer-prose" style={{ marginBottom: 'var(--mer-spacing-2xl)' }}>
                  <RichTextRenderer content={member.bio as Record<string, unknown>} />
                </div>
              ) : (
                <p className="mer-body" style={{ opacity: 0.6, marginBottom: 'var(--mer-spacing-2xl)' }}>
                  Biography not yet available.
                </p>
              )}

              {/* Specialisations pill row */}
              {(member.specialisations ?? []).length > 0 && member.showSpecialisations !== false && (
                <div style={{ marginBottom: 'var(--mer-spacing-2xl)' }}>
                  <p className="mer-overline" style={{ marginBottom: 'var(--mer-spacing-md)' }}>Specialisations</p>
                  <div className="mer-profile-specialisations">
                    {member.specialisations!.map((s, i) => (
                      <span key={i} className="mer-tag">
                        <CheckIcon /> {s.specialisation}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Related services */}
              {resolvedServices.length > 0 && (
                <div style={{ marginBottom: 'var(--mer-spacing-2xl)' }}>
                  <p className="mer-h4" style={{ marginBottom: 'var(--mer-spacing-lg)' }}>Practice Areas</p>
                  <div className="mer-grid-2">
                    {resolvedServices.map((svc) => (
                      <ServiceMiniCard key={svc.id} svc={svc} />
                    ))}
                  </div>
                </div>
              )}

              {/* Contact CTA (inline for desktop — mirrors sidebar button) */}
              <div style={{ display: 'flex', gap: 'var(--mer-spacing-md)', flexWrap: 'wrap', paddingTop: 'var(--mer-spacing-xl)', borderTop: '1px solid var(--mer-border-color)' }}>
                <a
                  href={`/contact?team=${encodeURIComponent(member.slug)}`}
                  className="mer-btn mer-btn-primary mer-btn-lg"
                >
                  Get in Touch
                  <ArrowIcon />
                </a>
                <a href="/team" className="mer-btn mer-btn-ghost mer-btn-lg">
                  ← Our People
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}