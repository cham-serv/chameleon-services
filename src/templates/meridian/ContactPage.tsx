/**
 * Meridian ContactPage
 *
 * 2 variants:
 *  minimal      - clean centered form with contact info sidebar
 *  split-image  - form left, hero image right (full-bleed)
 *
 * Features:
 *  - Fetches live Services + Departments for form dropdowns
 *  - Passes ?team=, ?dept=, ?service= URL routing to MeridianContactForm
 *  - Opening hours table
 *  - Map embed (if contactMapEmbedUrl set in CMS)
 *  - Full contact details sidebar: email, phone, address
 */

import type { PageProps } from '@/lib/types';
import { getServices, getDepartments, getTeamMembers } from '@/lib/api';
import type { MeridianPageConfig } from '@/lib/types';
import MeridianContactForm from './MeridianContactForm';

// ─── Helpers ──────────────────────────────────────────────────────────────

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 1.14h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

// ─── Contact Info Sidebar ─────────────────────────────────────────────────

function ContactInfoSidebar({ settings, pc }: { settings: any; pc: any }) {
  const phone      = settings?.contactPhone ?? pc?.contactPhone;
  const email      = settings?.contactEmail ?? pc?.contactEmail;
  const street     = settings?.addressStreet;
  const city       = settings?.addressCity;
  const province   = settings?.addressProvince;
  const postal     = settings?.addressPostalCode;
  const country    = settings?.addressCountry;
  const hasAddress = street || city;

  const hours: Array<{ days: string; hours: string }> = pc?.contactBusinessHours ?? settings?.openingHours?.map((h: any) => ({
    days:  Array.isArray(h.dayOfWeek) ? h.dayOfWeek.join(', ') : h.dayOfWeek,
    hours: h.isClosed ? 'Closed' : `${h.opens} – ${h.closes}`,
  })) ?? [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mer-spacing-xl)' }}>
      {/* Quick contact */}
      <div>
        <div className="mer-overline" style={{ marginBottom: 'var(--mer-spacing-md)' }}>Contact Details</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mer-spacing-md)' }}>
          {phone && (
            <a href={`tel:${phone}`} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75em', color: 'var(--brand-text, #444)', textDecoration: 'none', fontSize: '0.9375rem', lineHeight: 1.4 }}>
              <span style={{ color: 'var(--brand-primary, #1a2b5e)', flexShrink: 0, marginTop: '0.15em' }}><PhoneIcon /></span>
              {phone}
            </a>
          )}
          {email && (
            <a href={`mailto:${email}`} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75em', color: 'var(--brand-text, #444)', textDecoration: 'none', fontSize: '0.9375rem', lineHeight: 1.4 }}>
              <span style={{ color: 'var(--brand-primary, #1a2b5e)', flexShrink: 0, marginTop: '0.15em' }}><MailIcon /></span>
              {email}
            </a>
          )}
          {hasAddress && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75em', fontSize: '0.9375rem', lineHeight: 1.6 }}>
              <span style={{ color: 'var(--brand-primary, #1a2b5e)', flexShrink: 0, marginTop: '0.15em' }}><MapPinIcon /></span>
              <address style={{ fontStyle: 'normal', color: 'var(--brand-text, #444)' }}>
                {street && <>{street}<br /></>}
                {city}{province ? `, ${province}` : ''} {postal}
                {country && <><br />{country}</>}
              </address>
            </div>
          )}
        </div>
      </div>

      {/* Opening hours */}
      {hours.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em', marginBottom: 'var(--mer-spacing-md)' }}>
            <span style={{ color: 'var(--brand-primary, #1a2b5e)' }}><ClockIcon /></span>
            <div className="mer-overline">Office Hours</div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <tbody>
              {hours.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--mer-border-color)' }}>
                  <td style={{ padding: '0.5rem 0', color: 'var(--brand-text, #444)', fontWeight: 500, paddingRight: '1rem' }}>{row.days}</td>
                  <td style={{ padding: '0.5rem 0', color: 'color-mix(in srgb, var(--brand-text, #444) 70%, transparent)', textAlign: 'right' }}>{row.hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── VARIANT: minimal ─────────────────────────────────────────────────────

async function MinimalVariant({ config }: { config: any }) {
  const pc       = config.pageConfig as MeridianPageConfig | null;
  const settings = config.settings;
  const tenant   = config.tenant.slug;

  const headline    = pc?.contactHeadline    ?? 'Contact Us';
  const subheadline = pc?.contactSubheadline ?? 'We would love to hear from you. Fill in the form and we will be in touch.';
  const mapUrl      = pc?.contactMapEmbedUrl;

  const [svcRes, deptRes, teamRes] = await Promise.all([
    getServices(tenant),
    getDepartments(tenant),
    getTeamMembers({ tenant }),
  ]);

  return (
    <>
      {/* Page header */}
      <section className="mer-section-sm" style={{ borderBottom: '1px solid var(--mer-border-color)' }}>
        <div className="mer-container">
          <div className="mer-section-header--left" data-reveal="up">
            <span className="mer-overline">Get in Touch</span>
            <h1 className="mer-h1 mer-mt-md">{headline}</h1>
            {subheadline && <p className="mer-body-lg mer-mt-lg" style={{ maxWidth: 600, opacity: 0.8 }}>{subheadline}</p>}
          </div>
        </div>
      </section>

      {/* Form + sidebar */}
      <section className="mer-section">
        <div className="mer-container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--mer-spacing-4xl)', alignItems: 'start' }}>
            {/* Form */}
            <div className="mer-card">
              <div className="mer-card-body">
                <MeridianContactForm
                  tenantSlug={tenant}
                  services={svcRes?.docs ?? []}
                  departments={deptRes?.docs ?? []}
                  teamMembers={teamRes?.docs ?? []}
                  turnstileSiteKey={settings?.turnstileSiteKey}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div style={{ position: 'sticky', top: 'calc(var(--mer-header-h) + var(--mer-spacing-xl))', display: 'flex', flexDirection: 'column', gap: 'var(--mer-spacing-xl)' }}>
              <div className="mer-card">
                <div className="mer-card-body">
                  <ContactInfoSidebar settings={settings} pc={pc} />
                </div>
              </div>

              {/* Map embed */}
              {mapUrl && (
                <div style={{ borderRadius: 'var(--mer-radius-lg)', overflow: 'hidden', border: '1px solid var(--mer-border-color)' }}>
                  <iframe
                    src={mapUrl}
                    width="100%"
                    height="240"
                    style={{ display: 'block', border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Office location map"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ─── VARIANT: split-image ─────────────────────────────────────────────────

async function SplitImageVariant({ config }: { config: any }) {
  const pc       = config.pageConfig as MeridianPageConfig | null;
  const settings = config.settings;
  const tenant   = config.tenant.slug;

  const headline    = pc?.contactHeadline    ?? 'Let\'s Talk';
  const subheadline = pc?.contactSubheadline ?? 'Ready to take the next step? Our team is standing by.';
  const imageUrl    = (pc?.contactImage as any)?.url ?? null;

  const [svcRes, deptRes, teamRes] = await Promise.all([
    getServices(tenant),
    getDepartments(tenant),
    getTeamMembers({ tenant }),
  ]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - var(--mer-header-h))', overflow: 'hidden' }}>
      {/* Left: Form panel */}
      <div style={{ padding: 'var(--mer-spacing-4xl) var(--mer-spacing-3xl)', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflowY: 'auto' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', width: '100%' }}>
          <span className="mer-overline" style={{ display: 'block', marginBottom: 'var(--mer-spacing-md)' }}>Get in Touch</span>
          <h1 className="mer-h1" style={{ marginBottom: 'var(--mer-spacing-lg)' }}>{headline}</h1>
          {subheadline && <p className="mer-body-lg" style={{ marginBottom: 'var(--mer-spacing-2xl)', opacity: 0.8 }}>{subheadline}</p>}

          <MeridianContactForm
            tenantSlug={tenant}
            services={svcRes?.docs ?? []}
            departments={deptRes?.docs ?? []}
            teamMembers={teamRes?.docs ?? []}
            turnstileSiteKey={settings?.turnstileSiteKey}
            labels={{ heading: '', subheading: '' }}
          />

          <div style={{ marginTop: 'var(--mer-spacing-3xl)', paddingTop: 'var(--mer-spacing-xl)', borderTop: '1px solid var(--mer-border-color)' }}>
            <ContactInfoSidebar settings={settings} pc={pc} />
          </div>
        </div>
      </div>

      {/* Right: Image panel */}
      <div style={{ position: 'relative', overflow: 'hidden', backgroundColor: 'var(--brand-primary, #1a2b5e)' }}>
        {imageUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="" aria-hidden="true" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 100%)' }} />
          </>
        ) : (
          <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, var(--brand-primary, #1a2b5e), color-mix(in srgb, var(--brand-primary, #1a2b5e) 55%, var(--brand-secondary, #3b6cb7) 45%))`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '6rem', opacity: 0.2 }}>✉</span>
          </div>
        )}

        {/* Floating quote overlay */}
        <div style={{ position: 'absolute', bottom: 'var(--mer-spacing-3xl)', left: 'var(--mer-spacing-3xl)', right: 'var(--mer-spacing-3xl)', color: '#fff' }}>
          <p style={{ fontFamily: 'var(--font-heading, inherit)', fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)', fontWeight: 600, lineHeight: 1.3, fontStyle: 'italic', marginBottom: 'var(--mer-spacing-md)' }}>
            &ldquo;The quality of our advice is matched only by our commitment to your outcome.&rdquo;
          </p>
          <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>— {config.settings?.siteName ?? config.tenant.name}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────

export default async function ContactPage({ config, variant }: PageProps) {
  if (variant === 'split-image') {
    return <SplitImageVariant config={config} />;
  }
  return <MinimalVariant config={config} />;
}
