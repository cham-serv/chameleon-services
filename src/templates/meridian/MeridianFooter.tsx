/**
 * MeridianFooter
 *
 * 4-column footer: About | Services | Resources | Contact
 * Dark primary background, social icons, copyright.
 * Server component — no client state needed.
 */

import Link from 'next/link';
import type { TenantConfig } from '@/lib/types';

type Props = {
  config: TenantConfig;
};

export default function MeridianFooter({ config }: Props) {
  const siteName    = config.settings?.siteName ?? config.tenant.name;
  const tagline     = config.settings?.tagline  ?? config.pageConfig?.tagline ?? null;
  const contactEmail = config.settings?.contactEmail ?? config.pageConfig?.contactEmail ?? null;
  const contactPhone = config.settings?.contactPhone ?? config.pageConfig?.contactPhone ?? null;
  const fc          = config.tenant.featureConfig;

  // Social links
  const social = {
    linkedIn:  config.settings?.socialLinkedIn  ?? null,
    twitter:   config.settings?.socialTwitter   ?? null,
    facebook:  config.settings?.socialFacebook  ?? null,
    instagram: config.settings?.socialInstagram ?? null,
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="mer-footer">
      <div className="mer-footer-inner">
        <div className="mer-footer-grid">

          {/* Column 1: Brand */}
          <div>
            <div className="mer-footer-brand-name">{siteName}</div>
            {tagline && (
              <p className="mer-footer-tagline">{tagline}</p>
            )}
            {/* Social icons */}
            {Object.values(social).some(Boolean) && (
              <div className="mer-footer-social" style={{ marginTop: 'var(--mer-spacing-lg)' }}>
                {social.linkedIn && (
                  <a href={social.linkedIn} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
                      <circle cx="4" cy="4" r="2"/>
                    </svg>
                  </a>
                )}
                {social.twitter && (
                  <a href={social.twitter} target="_blank" rel="noopener noreferrer" aria-label="X / Twitter">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                )}
                {social.facebook && (
                  <a href={social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                  </a>
                )}
                {social.instagram && (
                  <a href={social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <circle cx="12" cy="12" r="4"/>
                      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <div className="mer-footer-col-heading">Quick Links</div>
            <ul className="mer-footer-links">
              <li><Link href="/">Home</Link></li>
              {fc.about?.enabled     && <li><Link href="/about">About Us</Link></li>}
              {fc.services?.enabled  && <li><Link href="/services">Our Services</Link></li>}
              {fc.about?.enabled     && <li><Link href="/team">Our People</Link></li>}
              {fc.blog?.enabled      && <li><Link href="/blog">Insights</Link></li>}
              {fc.resources?.enabled && <li><Link href="/resources">Resources</Link></li>}
              {fc.faqs?.enabled      && <li><Link href="/faqs">FAQs</Link></li>}
              {fc.contact?.enabled   && <li><Link href="/contact">Contact Us</Link></li>}
            </ul>
          </div>

          {/* Column 3: Services (shown if services enabled) */}
          {fc.services?.enabled && (
            <div>
              <div className="mer-footer-col-heading">Services</div>
              {/* Static fallback — Phase 3 will populate from live service names */}
              <ul className="mer-footer-links">
                <li><Link href="/services">All Services</Link></li>
              </ul>
            </div>
          )}

          {/* Column 4: Contact */}
          {fc.contact?.enabled && (
            <div>
              <div className="mer-footer-col-heading">Contact</div>
              {contactEmail && (
                <p className="mer-footer-contact-item">
                  <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
                </p>
              )}
              {contactPhone && (
                <p className="mer-footer-contact-item">
                  <a href={`tel:${contactPhone.replace(/\s/g, '')}`}>{contactPhone}</a>
                </p>
              )}
              {/* Address */}
              {config.settings?.addressCity && (
                <p className="mer-footer-contact-item">
                  {[
                    config.settings.addressStreet,
                    config.settings.addressCity,
                    config.settings.addressProvince,
                    config.settings.addressCountry,
                  ].filter(Boolean).join(', ')}
                </p>
              )}
              <Link
                href="/contact"
                className="mer-btn mer-btn-white-outline mer-btn-sm"
                style={{ marginTop: 'var(--mer-spacing-md)', display: 'inline-flex' }}
              >
                Get in Touch →
              </Link>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="mer-footer-bottom">
          <p className="mer-footer-copyright">
            © {currentYear} {siteName}. All rights reserved.
          </p>
          {fc.legal?.enabled && (
            <div style={{ display: 'flex', gap: 'var(--mer-spacing-lg)' }}>
              <Link href="/legal" style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>
                Privacy Policy
              </Link>
              <Link href="/legal" style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>
                Terms of Use
              </Link>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
