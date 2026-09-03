/**
 * Meridian ServicePage (single service detail)
 *
 * Route: /services/[slug]
 * path[1] = service slug
 *
 * Sections:
 *  1. Hero — icon, title, badge, dept tag, short desc, CTA
 *  2. Detail — long description (Lexical prose)
 *  3. Process steps (if present)
 *  4. Outcomes (if present)
 *  5. Service FAQs accordion (if present)
 *  6. Team members who deliver this service (M2M reverse lookup)
 *  7. CTA strip
 */

import type { PageProps } from '@/lib/types';
import { getServiceBySlug, getTeamMembers, type Service, type TeamMember } from '@/lib/api';

// ─── Arrow icon ───────────────────────────────────────────────────────────

function ArrowIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

// ─── Process steps ────────────────────────────────────────────────────────

function ProcessSteps({ steps }: { steps: Array<{ title: string; description: string }> }) {
  if (!steps.length) return null;
  return (
    <div style={{ marginBottom: 'var(--mer-spacing-3xl)' }}>
      <h2 className="mer-h2" style={{ marginBottom: 'var(--mer-spacing-2xl)' }}>How It Works</h2>
      <div className="mer-steps">
        {steps.map((step, i) => (
          <div key={i} className="mer-step">
            <div className="mer-step-number">{i + 1}</div>
            <div>
              <div className="mer-step-title">{step.title}</div>
              <p className="mer-step-desc">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Outcomes ─────────────────────────────────────────────────────────────

function Outcomes({ outcomes }: { outcomes: Array<{ text: string }> }) {
  if (!outcomes.length) return null;
  return (
    <div style={{ marginBottom: 'var(--mer-spacing-3xl)' }}>
      <h2 className="mer-h2" style={{ marginBottom: 'var(--mer-spacing-xl)' }}>Client Outcomes</h2>
      <div className="mer-grid-2" style={{ alignItems: 'start' }}>
        {outcomes.map((o, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75em' }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'color-mix(in srgb, var(--brand-primary, #1a2b5e) 10%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.1em' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary, #1a2b5e)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <p className="mer-body" style={{ margin: 0 }}>{o.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Service FAQs ─────────────────────────────────────────────────────────

function ServiceFaqs({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  if (!faqs.length) return null;
  return (
    <div style={{ marginBottom: 'var(--mer-spacing-3xl)' }}>
      <h2 className="mer-h2" style={{ marginBottom: 'var(--mer-spacing-xl)' }}>Frequently Asked Questions</h2>
      {/* Static render — fully accessible without JS */}
      <div className="mer-accordion-group">
        {faqs.map((faq, i) => (
          <details key={i} className="mer-accordion-item" style={{ padding: 0 }}>
            <summary className="mer-accordion-trigger" style={{ listStyle: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--mer-spacing-lg)', padding: 'var(--mer-spacing-lg) var(--mer-spacing-xl)', cursor: 'pointer' }}>
              <span className="mer-accordion-question">{faq.question}</span>
              <svg className="mer-accordion-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
            </summary>
            <div className="mer-accordion-body">{faq.answer}</div>
          </details>
        ))}
      </div>
    </div>
  );
}

// ─── Team member mini-card ────────────────────────────────────────────────

function TeamMiniCard({ member }: { member: TeamMember }) {
  const photo = member.photo && typeof member.photo === 'object' && 'url' in member.photo
    ? (member.photo as { url: string }).url : null;
  return (
    <a
      href={`/team/${member.slug}`}
      className="mer-card mer-card-hover"
      style={{ textDecoration: 'none' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--mer-spacing-md)', padding: 'var(--mer-spacing-lg)' }}>
        {photo
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={photo} alt={member.name} style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
          : <div style={{ width: 56, height: 56, borderRadius: '50%', flexShrink: 0, background: 'color-mix(in srgb, var(--brand-primary, #1a2b5e) 12%, var(--brand-surface, #f5f5f5) 88%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary, #1a2b5e)', fontSize: '1.25rem', fontWeight: 700 }}>{member.name[0]}</div>
        }
        <div>
          <div className="mer-team-card-name">{member.name}</div>
          {member.role && <div className="mer-team-card-role">{member.role}</div>}
          <div style={{ marginTop: 'var(--mer-spacing-xs)', fontSize: '0.8125rem', color: 'var(--brand-primary, #1a2b5e)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3em' }}>View profile <ArrowIcon size={12} /></div>
        </div>
      </div>
    </a>
  );
}

// ─── Not found fallback ───────────────────────────────────────────────────

function ServiceNotFound({ slug }: { slug: string }) {
  return (
    <section className="mer-section">
      <div className="mer-container-sm" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: 'var(--mer-spacing-xl)' }}>🔍</div>
        <h1 className="mer-h2" style={{ marginBottom: 'var(--mer-spacing-md)' }}>Service Not Found</h1>
        <p className="mer-body" style={{ opacity: 0.7, marginBottom: 'var(--mer-spacing-xl)' }}>
          We couldn&apos;t find the service &ldquo;{slug}&rdquo;. It may have been moved or renamed.
        </p>
        <a href="/services" className="mer-btn mer-btn-primary">View All Services</a>
      </div>
    </section>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────

export default async function ServicePage({ config, path }: PageProps) {
  const tenantSlug  = config.tenant.slug;
  const serviceSlug = path?.[1] ?? '';

  if (!serviceSlug) return <ServiceNotFound slug="(none)" />;

  const [service, teamRes] = await Promise.all([
    getServiceBySlug(tenantSlug, serviceSlug),
    getTeamMembers({ tenant: tenantSlug }),
  ]);

  if (!service) return <ServiceNotFound slug={serviceSlug} />;

  // Find team members who deliver this service (M2M reverse lookup)
  const deliveredBy = (teamRes?.docs ?? []).filter((m) =>
    (m.services ?? []).some((sRef) => {
      if (typeof sRef === 'number') return false;
      return sRef.id === service.id;
    })
  );

  const heroUrl = service.heroImage && typeof service.heroImage === 'object' && 'url' in service.heroImage
    ? (service.heroImage as { url: string }).url : null;

  const dept = service.department && typeof service.department === 'object' && 'name' in service.department
    ? (service.department as { name: string; slug: string }) : null;

  const siteName = config.settings?.siteName ?? config.tenant.name;

  return (
    <>
      {/* Hero */}
      <section className="mer-section-sm" style={{ borderBottom: '1px solid var(--mer-border-color)' }}>
        <div className="mer-container">
          <div style={{ display: 'grid', gridTemplateColumns: heroUrl ? '1fr 1fr' : '1fr', gap: 'var(--mer-spacing-3xl)', alignItems: 'center' }}>
            <div data-reveal="up">
              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb" style={{ marginBottom: 'var(--mer-spacing-lg)', display: 'flex', alignItems: 'center', gap: '0.4em', fontSize: '0.875rem' }}>
                <a href="/services" style={{ color: 'color-mix(in srgb, var(--brand-text, #444) 60%, transparent)', textDecoration: 'none' }}>Services</a>
                <span aria-hidden="true" style={{ opacity: 0.4 }}>/</span>
                <span style={{ color: 'var(--brand-text, #444)', fontWeight: 500 }}>{service.title}</span>
              </nav>

              {/* Tags */}
              <div style={{ display: 'flex', gap: 'var(--mer-spacing-xs)', flexWrap: 'wrap', marginBottom: 'var(--mer-spacing-lg)' }}>
                {dept && <span className="mer-tag mer-tag-dept">{dept.name}</span>}
                {service.badge && <span className="mer-badge mer-badge-accent">{service.badge}</span>}
              </div>

              <h1 className="mer-h1" style={{ marginBottom: 'var(--mer-spacing-lg)' }}>{service.title}</h1>
              {service.shortDesc && <p className="mer-body-lg" style={{ marginBottom: 'var(--mer-spacing-xl)', opacity: 0.85, maxWidth: 560 }}>{service.shortDesc}</p>}

              {/* Pricing + duration meta */}
              {(service.priceRange || service.duration) && (
                <div style={{ display: 'flex', gap: 'var(--mer-spacing-lg)', flexWrap: 'wrap', marginBottom: 'var(--mer-spacing-xl)' }}>
                  {service.priceRange && service.displayPricing && (
                    <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--brand-primary, #1a2b5e)' }}>{service.priceRange}</div>
                  )}
                  {service.duration && (
                    <div style={{ fontSize: '0.9375rem', color: 'color-mix(in srgb, var(--brand-text, #444) 65%, transparent)' }}>⏱ {service.duration}</div>
                  )}
                </div>
              )}

              {/* CTAs */}
              <div style={{ display: 'flex', gap: 'var(--mer-spacing-md)', flexWrap: 'wrap' }}>
                <a href={`/contact?service=${encodeURIComponent(service.slug)}`} className="mer-btn mer-btn-primary mer-btn-lg">
                  {service.ctaLabel ?? 'Get in Touch'} <ArrowIcon />
                </a>
                <a href="/services" className="mer-btn mer-btn-ghost mer-btn-lg">All Services</a>
              </div>
            </div>

            {heroUrl && (
              <div className="mer-img-zoom" style={{ borderRadius: 'var(--mer-radius-xl)', overflow: 'hidden', height: '420px' }} data-reveal="fade">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={heroUrl} alt={service.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} fetchPriority="high" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Detail body */}
      <section className="mer-section">
        <div className="mer-container" style={{ display: 'grid', gridTemplateColumns: deliveredBy.length > 0 ? '1fr 300px' : '1fr', gap: 'var(--mer-spacing-4xl)', alignItems: 'start' }}>
          <div>
            {/* Target client */}
            {service.targetClient && (
              <div style={{ marginBottom: 'var(--mer-spacing-3xl)', padding: 'var(--mer-spacing-xl)', background: 'var(--brand-surface, #f8f8f8)', borderRadius: 'var(--mer-radius-lg)', borderLeft: '4px solid var(--brand-primary, #1a2b5e)' }}>
                <div className="mer-overline" style={{ marginBottom: 'var(--mer-spacing-sm)' }}>Ideal For</div>
                <p className="mer-body-lg" style={{ margin: 0, opacity: 0.85 }}>{service.targetClient}</p>
              </div>
            )}

            <ProcessSteps steps={service.processSteps ?? []} />
            <Outcomes outcomes={service.outcomes ?? []} />
            <ServiceFaqs faqs={service.serviceFaqs ?? []} />
          </div>

          {/* Sidebar: team members */}
          {deliveredBy.length > 0 && (
            <aside style={{ position: 'sticky', top: 'calc(var(--mer-header-h) + var(--mer-spacing-xl))' }}>
              <h2 className="mer-h4" style={{ marginBottom: 'var(--mer-spacing-lg)' }}>Meet the Team</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mer-spacing-sm)' }}>
                {deliveredBy.map((m) => <TeamMiniCard key={m.id} member={m} />)}
              </div>
              <div style={{ marginTop: 'var(--mer-spacing-xl)' }}>
                <a href={`/contact?service=${encodeURIComponent(service.slug)}`} className="mer-btn mer-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Enquire About This Service
                </a>
              </div>
            </aside>
          )}
        </div>
      </section>

      {/* CTA strip */}
      <div className="mer-cta-strip">
        <div className="mer-cta-strip-inner">
          <div>
            <h2 className="mer-h3" style={{ color: '#fff' }}>Ready to get started with {service.title}?</h2>
            <p className="mer-body-lg" style={{ color: 'rgba(255,255,255,0.72)', marginTop: 'var(--mer-spacing-sm)' }}>
              {siteName} is here to guide you through every step of the process.
            </p>
          </div>
          <a href={`/contact?service=${encodeURIComponent(service.slug)}`} className="mer-btn mer-btn-white" style={{ flexShrink: 0 }}>
            {service.ctaLabel ?? 'Get in Touch'}
          </a>
        </div>
      </div>
    </>
  );
}
