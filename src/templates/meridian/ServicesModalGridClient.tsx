'use client';

/**
 * ServicesModalGridClient
 * 
 * Client component for the modal-grid variant of ServicesPage.
 * Features:
 *  - Department filter tabs (All + each dept)
 *  - Service cards that open MeridianServiceModal on click
 *  - URL hash routing: ?dept=slug pre-selects a filter tab
 */

import { useState, useEffect, useCallback } from 'react';
import type { Service, Department } from '@/lib/api';
import MeridianServiceModal from './MeridianServiceModal';

interface Props {
  services: Service[];
  departments: Department[];
  headline: string;
  subheadline?: string | null;
  tenantSlug: string;
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function getServiceIcon(svc: Service) { return svc.icon ?? '⚖️'; }

export default function ModalGridClient({ services, departments, headline, subheadline, tenantSlug }: Props) {
  const [activeDept, setActiveDept] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Check URL for ?dept= param on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const dept = new URLSearchParams(window.location.search).get('dept');
    if (dept) setActiveDept(dept);
  }, []);

  const filtered = activeDept === 'all'
    ? services
    : services.filter((svc) => {
        const dept = svc.department;
        if (!dept) return false;
        if (typeof dept === 'object' && 'slug' in dept) return dept.slug === activeDept;
        return false;
      });

  const handleCardClick = useCallback((svc: Service) => setSelectedService(svc), []);
  const handleClose     = useCallback(() => setSelectedService(null), []);

  // Get unique departments that actually have services assigned
  const activeDepts = departments.filter((d) =>
    services.some((svc) => {
      const dept = svc.department;
      return dept && typeof dept === 'object' && 'slug' in dept && dept.slug === d.slug;
    })
  );

  return (
    <>
      {/* Page hero */}
      <section className="mer-section-sm" style={{ borderBottom: '1px solid var(--mer-border-color)' }}>
        <div className="mer-container">
          <div className="mer-section-header--left">
            <span className="mer-overline">Practice Areas</span>
            <h1 className="mer-h1 mer-mt-md">{headline}</h1>
            {subheadline && <p className="mer-body-lg mer-mt-lg" style={{ maxWidth: 600, opacity: 0.8 }}>{subheadline}</p>}
          </div>
        </div>
      </section>

      <section className="mer-section">
        <div className="mer-container">
          {/* Filter tabs */}
          {activeDepts.length > 0 && (
            <div className="mer-filter-tabs" role="tablist" aria-label="Filter by department">
              <button
                type="button"
                role="tab"
                aria-selected={activeDept === 'all'}
                className="mer-filter-tab"
                data-active={activeDept === 'all'}
                onClick={() => setActiveDept('all')}
              >
                All Services
              </button>
              {activeDepts.map((dept) => (
                <button
                  key={dept.slug}
                  type="button"
                  role="tab"
                  aria-selected={activeDept === dept.slug}
                  className="mer-filter-tab"
                  data-active={activeDept === dept.slug ? 'true' : 'false'}
                  onClick={() => setActiveDept(dept.slug)}
                >
                  {dept.name}
                </button>
              ))}
            </div>
          )}

          {/* Cards grid */}
          {filtered.length > 0 ? (
            <div className="mer-grid-3">
              {filtered.map((svc) => {
                const dept = svc.department && typeof svc.department === 'object' && 'name' in svc.department
                  ? (svc.department as Department) : null;
                return (
                  <div
                    key={svc.id}
                    className="mer-service-card"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleCardClick(svc)}
                    role="button"
                    tabIndex={0}
                    aria-label={`View details for ${svc.title}`}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCardClick(svc); } }}
                  >
                    <div className="mer-service-card-icon" aria-hidden="true">{getServiceIcon(svc)}</div>
                    {dept && <span className="mer-tag mer-tag-dept" style={{ marginBottom: 'var(--mer-spacing-sm)', display: 'inline-flex' }}>{dept.name}</span>}
                    {svc.badge && <span className="mer-badge mer-badge-accent" style={{ marginBottom: 'var(--mer-spacing-sm)', display: 'inline-flex', marginLeft: dept ? 'var(--mer-spacing-xs)' : 0 }}>{svc.badge}</span>}
                    <div className="mer-service-card-title">{svc.title}</div>
                    <p className="mer-service-card-desc">{svc.shortDesc ?? svc.shortDescription ?? ''}</p>
                    {svc.priceRange && svc.displayPricing && (
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--brand-primary, #1a2b5e)', marginBottom: 'var(--mer-spacing-md)' }}>{svc.priceRange}</div>
                    )}
                    <div className="mer-arrow-link" style={{ marginTop: 'auto' }} aria-hidden="true">
                      View details <ArrowIcon />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 'var(--mer-spacing-4xl)', color: 'var(--mer-text-muted)' }}>
              <p className="mer-body">No services found for this department.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA strip */}
      <div className="mer-cta-strip">
        <div className="mer-cta-strip-inner">
          <div>
            <h2 className="mer-h3" style={{ color: '#fff' }}>Not sure which service is right for you?</h2>
            <p className="mer-body-lg" style={{ color: 'rgba(255,255,255,0.72)', marginTop: 'var(--mer-spacing-sm)' }}>Speak to our team — we&apos;ll guide you to the right solution.</p>
          </div>
          <a href="/contact" className="mer-btn mer-btn-white" style={{ flexShrink: 0 }}>Get in Touch</a>
        </div>
      </div>

      {/* Modal */}
      <MeridianServiceModal service={selectedService} onClose={handleClose} />
    </>
  );
}
