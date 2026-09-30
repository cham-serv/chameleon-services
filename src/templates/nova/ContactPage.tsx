/**
 * Nova Contact Page
 *
 * Form + sidebar layout:
 * - Left: Contact form (name, email, phone, message, Turnstile)
 * - Right: Contact details (phone, email, address, hours, optional map)
 *
 * GEO: ContactPage schema, LocalBusiness.contactPoint
 */

import type { PageProps } from '@/lib/types';
import { NovaContactForm } from './NovaContactForm';

export default function ContactPage({ config }: PageProps) {
  const siteName = config.settings?.siteName ?? config.tenant.name;
  const pc = config.pageConfig as any;
  const s = config.settings;

  const headline = pc?.contactHeadline ?? 'Get in Touch';
  const subheadline = pc?.contactSubheadline ?? null;
  const mapEmbedUrl = pc?.contactMapEmbedUrl ?? null;
  const businessHours: Array<{ days: string; hours: string }> = pc?.contactBusinessHours ?? [];

  // Contact details
  const email = s?.contactEmail ?? '';
  const phone = s?.contactPhone ?? '';
  const address = [
    s?.addressStreet,
    s?.addressCity,
    s?.addressProvince,
    s?.addressPostalCode,
  ].filter(Boolean).join(', ');

  // Turnstile
  const turnstileSiteKey = s?.turnstileSiteKey ?? null;

  return (
    <>
      {/* ── Page Header ───────────────────────────────── */}
      <div className="nova-page-header">
        <div className="nova-container">
          <span className="nova-label">Contact</span>
          <h1 className="nova-heading nova-heading--page nova-page-header__title" style={{ marginTop: '0.5rem' }}>
            {headline}
          </h1>
          {subheadline && (
            <p className="nova-subheading" style={{ margin: '0 auto' }}>
              {subheadline}
            </p>
          )}
        </div>
      </div>

      {/* ── Contact Layout ────────────────────────────── */}
      <section className="nova-section--sm">
        <div className="nova-container">
          <div className="nova-contact-layout">
            {/* ── Form ──────────────────────────────────── */}
            <div>
              <NovaContactForm
                tenantSlug={config.tenant.slug}
                turnstileSiteKey={turnstileSiteKey}
              />
            </div>

            {/* ── Sidebar ───────────────────────────────── */}
            <aside className="nova-contact-sidebar">
              {email && (
                <div className="nova-contact-sidebar__item">
                  <span className="nova-contact-sidebar__icon">📧</span>
                  <div>
                    <div className="nova-contact-sidebar__label">Email</div>
                    <div className="nova-contact-sidebar__value">
                      <a href={`mailto:${email}`}>{email}</a>
                    </div>
                  </div>
                </div>
              )}

              {phone && (
                <div className="nova-contact-sidebar__item">
                  <span className="nova-contact-sidebar__icon">📞</span>
                  <div>
                    <div className="nova-contact-sidebar__label">Phone</div>
                    <div className="nova-contact-sidebar__value">
                      <a href={`tel:${phone}`}>{phone}</a>
                    </div>
                  </div>
                </div>
              )}

              {address && (
                <div className="nova-contact-sidebar__item">
                  <span className="nova-contact-sidebar__icon">📍</span>
                  <div>
                    <div className="nova-contact-sidebar__label">Address</div>
                    <div className="nova-contact-sidebar__value">{address}</div>
                  </div>
                </div>
              )}

              {businessHours.length > 0 && (
                <div>
                  <div className="nova-contact-sidebar__label" style={{ marginBottom: '0.5rem' }}>
                    Business Hours
                  </div>
                  <table className="nova-hours">
                    <tbody>
                      {businessHours.map((entry, i) => (
                        <tr key={i}>
                          <td>{entry.days}</td>
                          <td>{entry.hours}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {mapEmbedUrl && (
                <iframe
                  src={mapEmbedUrl}
                  className="nova-map"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map for ${siteName}`}
                />
              )}
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
