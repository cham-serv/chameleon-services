'use client';

/**
 * MeridianServiceModal
 * Slide-in modal for the modal-grid services variant.
 * Rendered via createPortal into document.body.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { Service } from '@/lib/api';

interface Props {
  service: Service | null;
  onClose: () => void;
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function CheckMini() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ServiceFaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mer-accordion-item">
      <button type="button" className="mer-accordion-trigger" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span className="mer-accordion-question">{question}</span>
        <svg className="mer-accordion-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && <div className="mer-accordion-body">{answer}</div>}
    </div>
  );
}

export default function MeridianServiceModal({ service, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!service) return;
    prevFocusRef.current = document.activeElement as HTMLElement;
    document.body.style.overflow = 'hidden';
    setTimeout(() => dialogRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = '';
      prevFocusRef.current?.focus();
    };
  }, [service]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  if (!service) return null;

  const heroImageUrl = service.heroImage && typeof service.heroImage === 'object' && 'url' in service.heroImage
    ? (service.heroImage as { url: string }).url : null;

  const dept = service.department && typeof service.department === 'object' && 'name' in service.department
    ? (service.department as { name: string; slug: string }) : null;

  const ctaHref = `/contact?service=${encodeURIComponent(service.slug)}`;

  const modal = (
    <div className="mer-modal-backdrop" role="presentation" onClick={handleBackdropClick} onKeyDown={handleKeyDown} aria-modal="true">
      <div ref={dialogRef} role="dialog" aria-label={service.title} className="mer-modal" tabIndex={-1} style={{ outline: 'none' }}>
        {/* Header */}
        <div className="mer-modal-header">
          <div style={{ flex: 1 }}>
            {dept && <span className="mer-tag mer-tag-dept" style={{ marginBottom: 'var(--mer-spacing-sm)', display: 'inline-flex' }}>{dept.name}</span>}
            {service.badge && <span className="mer-badge mer-badge-accent" style={{ marginBottom: 'var(--mer-spacing-sm)', marginLeft: dept ? 'var(--mer-spacing-xs)' : 0, display: 'inline-flex' }}>{service.badge}</span>}
            <h2 className="mer-h3">{service.title}</h2>
            {service.priceRange && service.displayPricing && (
              <div style={{ fontSize: '0.875rem', color: 'var(--brand-primary, #1a2b5e)', fontWeight: 600, marginTop: '0.25em' }}>{service.priceRange}</div>
            )}
            {service.duration && (
              <div style={{ fontSize: '0.875rem', color: 'color-mix(in srgb, var(--brand-text, #444) 60%, transparent)', marginTop: '0.1em' }}>Duration: {service.duration}</div>
            )}
          </div>
          <button type="button" className="mer-modal-close" aria-label="Close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Body */}
        <div className="mer-modal-body">
          {heroImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={heroImageUrl} alt={service.title} style={{ width: '100%', aspectRatio: '16/7', objectFit: 'cover', borderRadius: 'var(--mer-radius-md)', marginBottom: 'var(--mer-spacing-xl)' }} />
          )}

          {service.shortDesc && (
            <p className="mer-body-lg" style={{ marginBottom: 'var(--mer-spacing-xl)', opacity: 0.85 }}>{service.shortDesc}</p>
          )}

          {service.targetClient && (
            <div style={{ marginBottom: 'var(--mer-spacing-xl)', padding: 'var(--mer-spacing-lg)', background: 'var(--brand-surface, #f8f8f8)', borderRadius: 'var(--mer-radius-md)', borderLeft: '3px solid var(--brand-primary, #1a2b5e)' }}>
              <div className="mer-overline" style={{ marginBottom: 'var(--mer-spacing-xs)' }}>Ideal For</div>
              <p className="mer-body" style={{ opacity: 0.85 }}>{service.targetClient}</p>
            </div>
          )}

          {(service.processSteps ?? []).length > 0 && (
            <div style={{ marginBottom: 'var(--mer-spacing-xl)' }}>
              <h3 className="mer-h4" style={{ marginBottom: 'var(--mer-spacing-lg)' }}>How It Works</h3>
              <div className="mer-steps">
                {service.processSteps!.map((step, i) => (
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
          )}

          {(service.outcomes ?? []).length > 0 && (
            <div style={{ marginBottom: 'var(--mer-spacing-xl)' }}>
              <h3 className="mer-h4" style={{ marginBottom: 'var(--mer-spacing-md)' }}>Client Outcomes</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {service.outcomes!.map((o, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625em', fontSize: '0.9375rem', color: 'var(--brand-text, #444)', lineHeight: 1.5 }}>
                    <span style={{ color: 'var(--brand-primary, #1a2b5e)', flexShrink: 0, marginTop: '0.15em' }}><CheckMini /></span>
                    {o.text}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(service.serviceFaqs ?? []).length > 0 && (
            <div style={{ marginBottom: 'var(--mer-spacing-xl)' }}>
              <h3 className="mer-h4" style={{ marginBottom: 'var(--mer-spacing-md)' }}>Common Questions</h3>
              <div className="mer-accordion-group">
                {service.serviceFaqs!.map((faq, i) => (
                  <ServiceFaqItem key={i} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 'var(--mer-spacing-md)', flexWrap: 'wrap', paddingTop: 'var(--mer-spacing-lg)', borderTop: '1px solid var(--mer-border-color)' }}>
            <a href={ctaHref} className="mer-btn mer-btn-primary">
              {service.ctaLabel ?? 'Get in Touch'}&nbsp;<ArrowIcon />
            </a>
            <a href={`/services/${service.slug}`} className="mer-btn mer-btn-ghost">Full Details</a>
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(modal, document.body);
}
