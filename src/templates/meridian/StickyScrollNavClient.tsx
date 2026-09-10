'use client';

/**
 * StickyScrollNavClient
 *
 * Renders the desktop sticky sidebar navigation for the sticky-scroll
 * services variant. Uses IntersectionObserver to track which service section
 * is currently in view and updates [data-nav-slug] elements across the whole
 * document — this drives both the desktop sidebar items AND the mobile
 * horizontal tab strip (server-rendered in ServicesPage.tsx) simultaneously.
 */

import { useEffect } from 'react';
import type { Service } from '@/lib/api';

interface Props {
  services: Service[];
}

export default function StickyScrollNavClient({ services }: Props) {
  useEffect(() => {
    const sectionIds = services.map((svc) => `service-${svc.slug}`);

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the topmost section currently intersecting the trigger zone
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length === 0) return;

        const slug = visible[0].target.id.replace('service-', '');

        // Update data-active on every [data-nav-slug] element:
        // covers both desktop sidebar items and mobile tab strip links.
        document.querySelectorAll<HTMLElement>('[data-nav-slug]').forEach((el) => {
          el.dataset.active = el.dataset.navSlug === slug ? 'true' : 'false';
        });
      },
      {
        // Trigger when a section crosses the middle third of the viewport
        rootMargin: '-15% 0px -55% 0px',
        threshold: 0,
      },
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [services]);

  return (
    <nav className="mer-sticky-nav" aria-label="Services navigation">
      <ul className="mer-sticky-nav-list">
        {services.map((svc, i) => (
          <li key={svc.id}>
            <a
              href={`#service-${svc.slug}`}
              className="mer-sticky-nav-item"
              data-nav-slug={svc.slug}
              data-active={i === 0 ? 'true' : 'false'}
            >
              {svc.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
