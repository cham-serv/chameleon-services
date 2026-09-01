/**
 * MeridianLayout — Server Component Shell
 *
 * Imports the Meridian design system CSS, composes the header,
 * scroll reveal observer, main content area, and footer.
 *
 * The header and mobile nav are client components (scroll state,
 * drawer open/close). Everything else is server-rendered.
 */

import './meridian.css';
import './meridian-animations.css';
import type { LayoutProps } from '@/lib/types';
import MeridianHeader from './MeridianHeader';
import MeridianFooter from './MeridianFooter';
import { MeridianScrollReveal } from './MeridianScrollReveal';
import Link from 'next/link';

export default function MeridianLayout({ config, children }: LayoutProps) {
  const pc = config.pageConfig;

  // Announcement strip (session-dismissed client-side via CSS class toggle)
  const showAnnouncement =
    pc?.announcementEnabled === true && !!pc?.announcementText;

  return (
    <>
      <a href="#mer-main" className="mer-skip-link">Skip to content</a>

      {/* Announcement strip */}
      {showAnnouncement && (
        <div
          className={`mer-announcement mer-announcement--${pc?.announcementStyle ?? 'info'}`}
          role="banner"
          aria-label="Site announcement"
        >
          {pc?.announcementText}
          {pc?.announcementLink && pc?.announcementLinkText && (
            <Link href={pc.announcementLink} className="mer-announcement-link">
              {pc.announcementLinkText}
            </Link>
          )}
        </div>
      )}

      {/* Header — client component (scroll + mobile drawer state) */}
      <MeridianHeader config={config} />

      {/* Main content */}
      <main id="mer-main" style={{ minHeight: '60vh' }}>
        {children}
      </main>

      {/* Footer — server component */}
      <MeridianFooter config={config} />

      {/* Scroll reveal observer — activates data-reveal animations */}
      <MeridianScrollReveal />
    </>
  );
}
