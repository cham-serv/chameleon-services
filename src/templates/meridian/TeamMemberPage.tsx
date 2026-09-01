/**
 * Meridian TeamMemberPage
 *
 * Route: /team/[slug]
 * path[1] = team member slug
 */

import type { PageProps } from '@/lib/types';
import { getTeamMemberBySlug } from '@/lib/api';
import { RichTextRenderer } from '@/components/RichTextRenderer';

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function PhoneIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 1.14h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z" /></svg>;
}

function MailIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>;
}

function LinkedInIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>;
}

function MemberNotFound({ slug }: { slug: string }) {
  return (
    <section className="mer-section">
      <div className="mer-container-sm" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: 'var(--mer-spacing-xl)' }}>👤</div>
        <h1 className="mer-h2" style={{ marginBottom: 'var(--mer-spacing-md)' }}>Team Member Not Found</h1>
        <p className="mer-body" style={{ opacity: 0.7, marginBottom: 'var(--mer-spacing-xl)' }}>
          We couldn&apos;t find the profile for &ldquo;{slug}&rdquo;.
        </p>
        <a href="/team" className="mer-btn mer-btn-primary">View All Team Members</a>
      </div>
    </section>
  );
}

export default async function TeamMemberPage({ config, path }: PageProps) {
  const tenantSlug = config.tenant.slug;
  const memberSlug = path?.[1] ?? '';

  if (!memberSlug) return <MemberNotFound slug="(none)" />;

  const member = await getTeamMemberBySlug(tenantSlug, memberSlug);
  if (!member) return <MemberNotFound slug={memberSlug} />;

  const photo = member.photo && typeof member.photo === 'object' && 'url' in member.photo
    ? (member.photo as { url: string }).url : null;
  const dept = member.department && typeof member.department === 'object' && 'name' in member.department
    ? (member.department as { name: string; slug: string }) : null;

  // Resolve services
  const services = (member.services ?? []).filter((s) => typeof s !== 'number') as any[];

  return (
    <>
      <section className="mer-section-sm" style={{ borderBottom: '1px solid var(--mer-border-color)' }}>
        <div className="mer-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: 'var(--mer-spacing-4xl)', alignItems: 'start' }}>
            
            {/* Left Col: Hero + Bio */}
            <div>
              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb" style={{ marginBottom: 'var(--mer-spacing-xl)', display: 'flex', alignItems: 'center', gap: '0.4em', fontSize: '0.875rem' }}>
                <a href="/team" style={{ color: 'color-mix(in srgb, var(--brand-text, #444) 60%, transparent)', textDecoration: 'none' }}>Team</a>
                <span aria-hidden="true" style={{ opacity: 0.4 }}>/</span>
                <span style={{ color: 'var(--brand-text, #444)', fontWeight: 500 }}>{member.name}</span>
              </nav>

              <div style={{ display: 'flex', gap: 'var(--mer-spacing-xs)', flexWrap: 'wrap', marginBottom: 'var(--mer-spacing-md)' }}>
                {dept && <span className="mer-tag mer-tag-dept">{dept.name}</span>}
              </div>

              <h1 className="mer-h1" style={{ marginBottom: 'var(--mer-spacing-xs)' }}>{member.name}</h1>
              {member.role && <div className="mer-body-lg" style={{ color: 'var(--brand-primary, #1a2b5e)', fontWeight: 600, marginBottom: 'var(--mer-spacing-2xl)' }}>{member.role}</div>}

              {/* Bio content */}
              {member.bio ? (
                <div style={{ fontSize: '1.0625rem', lineHeight: 1.7, color: 'var(--brand-text, #444)' }}>
                  <RichTextRenderer content={member.bio as Record<string, unknown>} />
                </div>
              ) : (
                <p className="mer-body" style={{ opacity: 0.7 }}>No biography available for this team member.</p>
              )}

              {/* Related Services */}
              {services.length > 0 && (
                <div style={{ marginTop: 'var(--mer-spacing-4xl)', paddingTop: 'var(--mer-spacing-xl)', borderTop: '1px solid var(--mer-border-color)' }}>
                  <h2 className="mer-h3" style={{ marginBottom: 'var(--mer-spacing-lg)' }}>Practice Areas</h2>
                  <div className="mer-grid-2">
                    {services.map((svc) => (
                      <a key={svc.id} href={`/services/${svc.slug}`} className="mer-card mer-card-hover" style={{ textDecoration: 'none', padding: 'var(--mer-spacing-lg)' }}>
                        <div style={{ fontWeight: 600, color: 'var(--brand-heading, inherit)', marginBottom: '0.25em' }}>{svc.title}</div>
                        {svc.shortDesc && <div style={{ fontSize: '0.875rem', color: 'color-mix(in srgb, var(--brand-text, #444) 70%, transparent)' }}>{svc.shortDesc}</div>}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Col: Sidebar Photo & Details */}
            <aside style={{ position: 'sticky', top: 'calc(var(--mer-header-h) + var(--mer-spacing-xl))' }}>
              <div className="mer-card">
                {photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photo} alt={member.name} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: 'var(--mer-radius-md) var(--mer-radius-md) 0 0' }} />
                ) : (
                  <div style={{ width: '100%', aspectRatio: '1/1', background: 'var(--brand-surface, #f5f5f5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: 'var(--brand-primary, #1a2b5e)', fontWeight: 700, borderRadius: 'var(--mer-radius-md) var(--mer-radius-md) 0 0' }}>
                    {member.name[0]}
                  </div>
                )}
                
                <div className="mer-card-body" style={{ padding: 'var(--mer-spacing-xl)' }}>
                  
                  {/* Contact Links */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mer-spacing-md)', marginBottom: 'var(--mer-spacing-xl)' }}>
                    {member.email && member.showEmail && (
                      <a href={`mailto:${member.email}`} style={{ display: 'flex', alignItems: 'center', gap: '0.6em', color: 'var(--brand-text, #444)', textDecoration: 'none', fontSize: '0.9375rem' }}>
                        <span style={{ color: 'var(--brand-primary, #1a2b5e)' }}><MailIcon /></span> {member.email}
                      </a>
                    )}
                    {member.phone && member.showPhone && (
                      <a href={`tel:${member.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '0.6em', color: 'var(--brand-text, #444)', textDecoration: 'none', fontSize: '0.9375rem' }}>
                        <span style={{ color: 'var(--brand-primary, #1a2b5e)' }}><PhoneIcon /></span> {member.phone}
                      </a>
                    )}
                    {member.directLine && member.showDirectContact && (
                      <a href={`tel:${member.directLine}`} style={{ display: 'flex', alignItems: 'center', gap: '0.6em', color: 'var(--brand-text, #444)', textDecoration: 'none', fontSize: '0.9375rem' }}>
                        <span style={{ color: 'var(--brand-primary, #1a2b5e)' }}><PhoneIcon /></span> {member.directLine} (Direct)
                      </a>
                    )}
                    {member.linkedIn && member.showLinkedIn && (
                      <a href={member.linkedIn} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.6em', color: 'var(--brand-text, #444)', textDecoration: 'none', fontSize: '0.9375rem' }}>
                        <span style={{ color: 'var(--brand-primary, #1a2b5e)' }}><LinkedInIcon /></span> LinkedIn Profile
                      </a>
                    )}
                  </div>

                  <a href={`/contact?team=${encodeURIComponent(member.slug)}`} className="mer-btn mer-btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: 'var(--mer-spacing-xl)' }}>
                    Contact {member.name.split(' ')[0]}
                  </a>

                  {/* Credentials / Details */}
                  {((member.qualifications?.length ?? 0) > 0 && member.showQualifications !== false) && (
                    <div style={{ marginBottom: 'var(--mer-spacing-md)' }}>
                      <div className="mer-overline" style={{ marginBottom: 'var(--mer-spacing-xs)' }}>Qualifications</div>
                      <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '0.875rem', color: 'var(--brand-text, #444)', display: 'flex', flexDirection: 'column', gap: '0.25em' }}>
                        {member.qualifications!.map((q, i) => <li key={i}>{q.qualification}</li>)}
                      </ul>
                    </div>
                  )}

                  {((member.specialisations?.length ?? 0) > 0 && member.showSpecialisations !== false) && (
                    <div style={{ marginBottom: 'var(--mer-spacing-md)' }}>
                      <div className="mer-overline" style={{ marginBottom: 'var(--mer-spacing-xs)' }}>Specialisations</div>
                      <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '0.875rem', color: 'var(--brand-text, #444)', display: 'flex', flexDirection: 'column', gap: '0.25em' }}>
                        {member.specialisations!.map((s, i) => <li key={i}>{s.specialisation}</li>)}
                      </ul>
                    </div>
                  )}

                  {member.admissionYear && (
                    <div style={{ marginBottom: 'var(--mer-spacing-md)' }}>
                      <div className="mer-overline" style={{ marginBottom: 'var(--mer-spacing-xs)' }}>Admitted</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--brand-text, #444)' }}>{member.admissionYear}</div>
                    </div>
                  )}

                  {member.yearsExperience && (
                    <div style={{ marginBottom: 'var(--mer-spacing-md)' }}>
                      <div className="mer-overline" style={{ marginBottom: 'var(--mer-spacing-xs)' }}>Experience</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--brand-text, #444)' }}>{member.yearsExperience} Years</div>
                    </div>
                  )}

                  {((member.languages?.length ?? 0) > 0) && (
                    <div>
                      <div className="mer-overline" style={{ marginBottom: 'var(--mer-spacing-xs)' }}>Languages</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--brand-text, #444)' }}>
                        {member.languages!.map(l => l.language).join(', ')}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </aside>
            
          </div>
        </div>
      </section>
    </>
  );
}
