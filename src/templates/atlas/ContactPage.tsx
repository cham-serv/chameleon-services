/**
 * Atlas ContactPage — Server Component (wraps a client form)
 *
 * Variants:
 *   - minimal: centered form + business info sidebar
 *   - split-image: form left, brand image right
 *   - map-and-hours: form + map + business hours
 *
 * All variants submit to /api/public/inquiry with Turnstile protection.
 */

import type { PageProps } from '@/lib/types';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { AtlasContactForm } from './AtlasContactForm';

export default function ContactPage({ config, variant }: PageProps) {
  const tenant = config.tenant.slug;
  const siteName = config.settings?.siteName ?? config.tenant.name;
  const siteUrl = `https://${tenant}.chameleon.services`;
  const contactEmail = config.settings?.contactEmail;

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Contact' },
  ];

  // ContactPage JSON-LD
  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: `Contact ${siteName}`,
    url: `${siteUrl}/contact`,
    ...(contactEmail && {
      mainEntity: {
        '@type': 'Organization',
        name: siteName,
        contactPoint: {
          '@type': 'ContactPoint',
          email: contactEmail,
          contactType: 'customer service',
        },
      },
    }),
  };

  return (
    <>
      <JsonLd data={contactSchema} />

      <div className="atlas-container atlas-section-sm">
        <Breadcrumbs items={breadcrumbs} baseUrl={siteUrl} />

        <h1 className="atlas-h1" style={{ marginTop: 'var(--atlas-spacing-lg)' }}>
          Get in Touch
        </h1>
        <p className="atlas-body-lg" style={{ marginTop: 'var(--atlas-spacing-sm)', opacity: 0.7, maxWidth: 600 }}>
          Have a question, feedback, or want to work together? We&apos;d love to hear from you.
        </p>

        <div
          className="atlas-contact-layout"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 'var(--atlas-spacing-2xl)',
            marginTop: 'var(--atlas-spacing-2xl)',
          }}
        >
          {/* Form Column */}
          <div>
            <AtlasContactForm tenant={tenant} />
          </div>

          {/* Info / Image Column */}
          <div>
            {/* Business Info Card */}
            <div className="atlas-card-flat" style={{ padding: 'var(--atlas-spacing-lg)' }}>
              <h2 className="atlas-h5" style={{ marginBottom: 'var(--atlas-spacing-md)' }}>
                {siteName}
              </h2>

              <dl style={{ display: 'flex', flexDirection: 'column', gap: 'var(--atlas-spacing-sm)', fontSize: '0.875rem', margin: 0 }}>
                {contactEmail && (
                  <div style={{ display: 'flex', gap: 'var(--atlas-spacing-sm)' }}>
                    <dt style={{ fontWeight: 600, minWidth: 60 }}>Email</dt>
                    <dd style={{ margin: 0 }}>
                      <a href={`mailto:${contactEmail}`} style={{ color: 'var(--brand-primary, #2d6a4f)' }}>
                        {contactEmail}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>

              {/* Social Links */}
              {config.settings?.socialLinks && (
                <div style={{ marginTop: 'var(--atlas-spacing-lg)' }}>
                  <h3 className="atlas-caption" style={{ fontWeight: 600, marginBottom: 'var(--atlas-spacing-sm)' }}>Follow Us</h3>
                  <div style={{ display: 'flex', gap: 'var(--atlas-spacing-sm)', flexWrap: 'wrap' }}>
                    {Object.entries(config.settings.socialLinks)
                      .filter(([, url]) => url)
                      .map(([platform, url]) => (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="atlas-badge"
                          style={{ textDecoration: 'none', textTransform: 'capitalize' }}
                        >
                          {platform}
                        </a>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Variant: split-image shows a brand image */}
            {variant === 'split-image' && (
              <div
                style={{
                  marginTop: 'var(--atlas-spacing-xl)',
                  aspectRatio: '4/3',
                  borderRadius: 'var(--atlas-radius-lg)',
                  background: 'linear-gradient(135deg, color-mix(in srgb, var(--brand-primary, #2d6a4f) 15%, transparent), color-mix(in srgb, var(--brand-secondary, #00E5FF) 15%, transparent))',
                }}
              />
            )}

            {/* Variant: map-and-hours shows business hours */}
            {variant === 'map-and-hours' && (
              <div className="atlas-card-flat" style={{ padding: 'var(--atlas-spacing-lg)', marginTop: 'var(--atlas-spacing-xl)' }}>
                <h3 className="atlas-h6" style={{ marginBottom: 'var(--atlas-spacing-sm)' }}>Business Hours</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem', lineHeight: 2 }}>
                  <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Monday – Friday</span>
                    <span style={{ fontWeight: 600 }}>08:00 – 17:00</span>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Saturday</span>
                    <span style={{ fontWeight: 600 }}>09:00 – 13:00</span>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Sunday</span>
                    <span style={{ opacity: 0.5 }}>Closed</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
