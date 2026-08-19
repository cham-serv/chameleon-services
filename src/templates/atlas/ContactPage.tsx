/**
 * Atlas ContactPage — Server Component (wraps a client form)
 *
 * Variants:
 *   - minimal:       Narrow centered form + business info card
 *   - split-image:   True 50/50 viewport split — sticky image left, form right
 *   - map-and-hours: Full-width map top, 3-column content below
 *
 * Schema injected (multi-schema pattern, matches Resources/Shop GEO standard):
 *   1. BreadcrumbList
 *   2. LocalBusiness  (email, phone, address, geo, openingHours, sameAs)
 *   3. ContactPage    (mainEntity Organization with ContactPoint)
 *
 * All variants submit to /api/public/inquiry with Turnstile protection.
 * Map variant: gracefully collapses to 2-col (form + hours) if no map URL.
 */

import type { PageProps } from '@/lib/types';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { AtlasContactForm } from './AtlasContactForm';
import { buildBreadcrumbLd, buildLocalBusinessLd } from '@/lib/jsonld';

export default function ContactPage({ config, variant }: PageProps) {
  const tenant = config.tenant.slug;
  const siteName = config.settings?.siteName ?? config.tenant.name;
  const siteUrl = `https://${tenant}.chameleon.services`;
  const contactEmail = config.settings?.contactEmail;
  const contactPhone = config.settings?.contactPhone;
  const s = config.settings;
  const pc = config.pageConfig;

  const headline    = pc?.contactHeadline    ?? 'Get in Touch';
  const subheadline = pc?.contactSubheadline ?? "Have a question, feedback, or want to work together? We'd love to hear from you.";
  const contactImageUrl = pc?.contactImage?.url ?? null;
  const mapEmbedUrl     = pc?.contactMapEmbedUrl ?? null;
  const businessHours   = pc?.contactBusinessHours ?? null;

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Contact' },
  ];

  // JSON-LD schemas
  const breadcrumbSchema = buildBreadcrumbLd([
    { name: 'Home', url: `${siteUrl}/` },
    { name: 'Contact', url: `${siteUrl}/contact` },
  ]);

  const localBusinessSchema = buildLocalBusinessLd(config, siteUrl);

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
          ...(contactPhone && { telephone: contactPhone }),
          contactType: 'customer service',
        },
      },
    }),
  };

  // Shared sub-elements
  const infoCard = (
    <div className="atlas-card-flat atlas-contact-info-card">
      <h2 className="atlas-h5">{siteName}</h2>
      <dl className="atlas-contact-info-dl">
        {contactEmail && (
          <div className="atlas-contact-info-row">
            <dt>Email</dt>
            <dd><a href={`mailto:${contactEmail}`}>{contactEmail}</a></dd>
          </div>
        )}
        {contactPhone && (
          <div className="atlas-contact-info-row">
            <dt>Phone</dt>
            <dd><a href={`tel:${contactPhone}`}>{contactPhone}</a></dd>
          </div>
        )}
        {s?.addressStreet && (
          <div className="atlas-contact-info-row">
            <dt>Address</dt>
            <dd>
              {s.addressStreet}
              {s.addressCity && <>, {s.addressCity}</>}
              {s.addressProvince && <>, {s.addressProvince}</>}
              {s.addressPostalCode && <> {s.addressPostalCode}</>}
            </dd>
          </div>
        )}
      </dl>
      {(s?.socialFacebook || s?.socialInstagram || s?.socialLinkedIn ||
        s?.socialTwitter  || s?.socialYoutube   || s?.socialGoogle) && (
        <div className="atlas-contact-social">
          <h3 className="atlas-caption atlas-contact-social-label">Follow Us</h3>
          <div className="atlas-contact-social-pills">
            {s.socialFacebook  && <a href={s.socialFacebook}  target="_blank" rel="noopener noreferrer" className="atlas-badge">Facebook</a>}
            {s.socialInstagram && <a href={s.socialInstagram} target="_blank" rel="noopener noreferrer" className="atlas-badge">Instagram</a>}
            {s.socialLinkedIn  && <a href={s.socialLinkedIn}  target="_blank" rel="noopener noreferrer" className="atlas-badge">LinkedIn</a>}
            {s.socialTwitter   && <a href={s.socialTwitter}   target="_blank" rel="noopener noreferrer" className="atlas-badge">X / Twitter</a>}
            {s.socialYoutube   && <a href={s.socialYoutube}   target="_blank" rel="noopener noreferrer" className="atlas-badge">YouTube</a>}
            {s.socialGoogle    && <a href={s.socialGoogle}    target="_blank" rel="noopener noreferrer" className="atlas-badge">Google</a>}
          </div>
        </div>
      )}
    </div>
  );

  const structuredHours = s?.openingHours;
  const hoursCard = (
    <div className="atlas-card-flat atlas-contact-hours-card">
      <h3 className="atlas-h6">Business Hours</h3>
      {structuredHours?.length ? (
        <ul className="atlas-contact-hours-list">
          {structuredHours.map((block, i) => (
            <li key={i}>
              <span>{block.dayOfWeek.join(', ')}</span>
              <span className={block.isClosed ? 'atlas-contact-hours-closed' : ''}>
                {block.isClosed ? 'Closed' : `${block.opens} – ${block.closes}`}
              </span>
            </li>
          ))}
        </ul>
      ) : businessHours?.length ? (
        <ul className="atlas-contact-hours-list">
          {businessHours.map((block, i) => (
            <li key={i}>
              <span>{block.days}</span>
              <span className={block.hours.toLowerCase() === 'closed' ? 'atlas-contact-hours-closed' : ''}>
                {block.hours}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="atlas-contact-hours-list">
          <li><span>Monday – Friday</span><span>08:00 – 17:00</span></li>
          <li><span>Saturday</span><span>09:00 – 13:00</span></li>
          <li><span>Sunday</span><span className="atlas-contact-hours-closed">Closed</span></li>
        </ul>
      )}
    </div>
  );

  const schemas = (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={localBusinessSchema} />
      <JsonLd data={contactSchema} />
    </>
  );

  // Variant: minimal
  if (variant !== 'split-image' && variant !== 'map-and-hours') {
    return (
      <>
        {schemas}
        <div className="atlas-container atlas-section-sm atlas-contact-minimal">
          <Breadcrumbs items={breadcrumbs} baseUrl={siteUrl} />
          <h1 className="atlas-h1 atlas-contact-headline">{headline}</h1>
          <p className="atlas-body-lg atlas-contact-subheadline">{subheadline}</p>
          <div className="atlas-contact-minimal-grid">
            <div><AtlasContactForm tenant={tenant} /></div>
            <div>{infoCard}</div>
          </div>
        </div>
      </>
    );
  }

  // Variant: split-image
  if (variant === 'split-image') {
    return (
      <>
        {schemas}
        <div className="atlas-contact-split" data-variant="split-image">
          <div className="atlas-contact-split-image">
            {contactImageUrl ? (
              <img src={contactImageUrl} alt={`Contact ${siteName}`} className="atlas-contact-split-img" />
            ) : (
              <div className="atlas-contact-split-placeholder">
                <span className="atlas-contact-split-brand-name">{siteName}</span>
              </div>
            )}
          </div>
          <div className="atlas-contact-split-form">
            <Breadcrumbs items={breadcrumbs} baseUrl={siteUrl} />
            <h1 className="atlas-h1 atlas-contact-headline">{headline}</h1>
            <p className="atlas-body-lg atlas-contact-subheadline">{subheadline}</p>
            <AtlasContactForm tenant={tenant} />
            <div style={{ marginTop: 'var(--atlas-spacing-2xl)' }}>{infoCard}</div>
          </div>
        </div>
      </>
    );
  }

  // Variant: map-and-hours
  return (
    <>
      {schemas}
      {mapEmbedUrl && (
        <div className="atlas-contact-map-header">
          <iframe
            src={mapEmbedUrl}
            width="100%"
            height="360"
            style={{ border: 0, display: 'block' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`${siteName} location map`}
          />
        </div>
      )}
      <div className="atlas-container atlas-section-sm">
        <Breadcrumbs items={breadcrumbs} baseUrl={siteUrl} />
        <h1 className="atlas-h1 atlas-contact-headline">{headline}</h1>
        <p className="atlas-body-lg atlas-contact-subheadline">{subheadline}</p>
        <div className={mapEmbedUrl ? 'atlas-contact-three-col' : 'atlas-contact-two-col'}>
          <div><AtlasContactForm tenant={tenant} /></div>
          <div>{infoCard}</div>
          <div>{hoursCard}</div>
        </div>
      </div>
    </>
  );
}