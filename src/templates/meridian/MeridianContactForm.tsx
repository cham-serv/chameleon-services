'use client';

/**
 * MeridianContactForm
 *
 * World-class lead routing contact form.
 *
 * URL param routing (all optional):
 *   ?team=slug      -> pre-selects team member, routes email to them
 *   ?dept=slug      -> pre-selects department, routes to dept inbox
 *   ?service=slug   -> pre-selects the "Regarding" dropdown
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import type { Service, TeamMember, Department } from '@/lib/api';

interface FormProps {
  tenantSlug: string;
  services?: Service[];
  teamMembers?: TeamMember[];
  departments?: Department[];
  turnstileSiteKey?: string | null;
  labels?: {
    heading?: string;
    subheading?: string;
    submitLabel?: string;
    successHeading?: string;
    successBody?: string;
  };
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  teamMemberId: string;
  department: string;
  message: string;
}

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

function useUrlRouting(teamMembers?: TeamMember[], departments?: Department[]) {
  const [routing, setRouting] = useState<{
    teamMember: TeamMember | null;
    department: Department | null;
    serviceSlug: string;
    source: 'team-page' | 'contact-page';
  }>({ teamMember: null, department: null, serviceSlug: '', source: 'contact-page' });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const teamSlug = params.get('team') ?? '';
    const deptSlug = params.get('dept') ?? '';
    const svcSlug  = params.get('service') ?? '';
    const member = teamSlug && teamMembers ? (teamMembers.find((m) => m.slug === teamSlug) ?? null) : null;
    const dept   = deptSlug && departments ? (departments.find((d) => d.slug === deptSlug) ?? null) : null;
    setRouting({ teamMember: member, department: dept, serviceSlug: svcSlug, source: (teamSlug || deptSlug) ? 'team-page' : 'contact-page' });
  }, [teamMembers, departments]);

  return routing;
}

function CheckIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="24" fill="var(--brand-primary, #1a2b5e)" opacity="0.1" />
      <circle cx="24" cy="24" r="18" fill="var(--brand-primary, #1a2b5e)" />
      <polyline points="16,24 22,30 32,18" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RoutingBanner({ teamMember, department }: { teamMember: TeamMember | null; department: Department | null }) {
  if (!teamMember && !department) return null;
  const photo = teamMember?.photo && typeof teamMember.photo === 'object' && 'url' in teamMember.photo
    ? (teamMember.photo as { url: string }).url : null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--mer-spacing-md)', padding: 'var(--mer-spacing-md) var(--mer-spacing-lg)', background: 'color-mix(in srgb, var(--brand-primary, #1a2b5e) 6%, transparent)', border: '1px solid color-mix(in srgb, var(--brand-primary, #1a2b5e) 15%, transparent)', borderRadius: 'var(--mer-radius-md)', marginBottom: 'var(--mer-spacing-xl)' }}>
      {photo && teamMember
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={photo} alt={teamMember.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
        : <div style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, background: 'var(--brand-primary, #1a2b5e)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.125rem' }}>{teamMember ? teamMember.name[0] : department?.name[0]}</div>}
      <div>
        <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--brand-primary, #1a2b5e)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Directed to</div>
        <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--brand-heading, inherit)', lineHeight: 1.3 }}>
          {teamMember ? `${teamMember.name}${teamMember.role ? ` — ${teamMember.role}` : ''}` : `${department!.name} Team`}
        </div>
        <div style={{ fontSize: '0.8125rem', color: 'color-mix(in srgb, var(--brand-text, #444) 60%, transparent)', marginTop: '0.1em' }}>
          Your message will be sent directly to {teamMember ? 'them' : 'this team'}
        </div>
      </div>
    </div>
  );
}

export default function MeridianContactForm({ tenantSlug, services = [], teamMembers = [], departments = [], turnstileSiteKey, labels = {} }: FormProps) {
  const { heading = 'Send Us a Message', subheading = 'We respond to all inquiries within one business day.', submitLabel = 'Send Message', successHeading = 'Message Received', successBody = "Thank you — we'll be in touch shortly." } = labels;

  const routing = useUrlRouting(teamMembers, departments);
  const [form, setForm] = useState<FormState>({ name: '', email: '', phone: '', company: '', service: '', teamMemberId: '', department: '', message: '' });
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      teamMemberId: routing.teamMember ? String(routing.teamMember.id) : '',
      department:   routing.department?.slug ?? prev.department,
      service:      routing.serviceSlug || prev.service,
    }));
  }, [routing]);

  const set = useCallback((field: keyof FormState, value: string) => setForm((prev) => ({ ...prev, [field]: value })), []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');
    setErrorMsg('');
    let turnstileToken: string | undefined;
    if (turnstileSiteKey && typeof window !== 'undefined' && (window as any).turnstile) {
      try { turnstileToken = await (window as any).turnstile.getResponse(); } catch { /* non-blocking */ }
    }
    try {
      const engineUrl = process.env.NEXT_PUBLIC_CHAMELEON_ENGINE_URL ?? 'https://chameleon-engine-production.up.railway.app';
      const payload: Record<string, unknown> = {
        tenant: tenantSlug, name: form.name, email: form.email,
        phone: form.phone || undefined, company: form.company || undefined,
        message: form.message, service: form.service || undefined,
        department: form.department || undefined,
        routeToTeamMember: form.teamMemberId ? Number(form.teamMemberId) : undefined,
        source: routing.source, turnstileToken,
      };
      const res = await fetch(`${engineUrl}/api/public/inquiry`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), cache: 'no-store' });
      if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error((err as any)?.error ?? `Server error ${res.status}`); }
      setStatus('success');
    } catch (err: unknown) {
      console.error('[MeridianContactForm]', err);
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setStatus('error');
    }
  }, [form, routing, tenantSlug, turnstileSiteKey, status]);

  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--mer-spacing-4xl) var(--mer-spacing-xl)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--mer-spacing-lg)' }}>
        <CheckIcon />
        <div>
          <h3 className="mer-h3" style={{ marginBottom: 'var(--mer-spacing-sm)' }}>{successHeading}</h3>
          <p className="mer-body" style={{ opacity: 0.75, maxWidth: 400 }}>{successBody}</p>
        </div>
        <button type="button" className="mer-btn mer-btn-outline" onClick={() => { setStatus('idle'); setForm({ name: '', email: '', phone: '', company: '', service: '', teamMemberId: '', department: '', message: '' }); }}>
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div>
      {(heading || subheading) && (
        <div style={{ marginBottom: 'var(--mer-spacing-xl)' }}>
          {heading    && <h2 className="mer-h3" style={{ marginBottom: 'var(--mer-spacing-sm)' }}>{heading}</h2>}
          {subheading && <p className="mer-body" style={{ opacity: 0.72 }}>{subheading}</p>}
        </div>
      )}
      <RoutingBanner teamMember={routing.teamMember} department={routing.department} />
      <form ref={formRef} onSubmit={handleSubmit} noValidate>
        <div className="mer-form-grid" style={{ marginBottom: 'var(--mer-spacing-md)' }}>
          <div className="mer-field">
            <label htmlFor="mcf-name" className="mer-label-text">Full Name <span className="mer-label-required" aria-hidden="true">*</span></label>
            <input id="mcf-name" type="text" className="mer-input" required autoComplete="name" placeholder="Jane Smith" value={form.name} onChange={(e) => set('name', e.target.value)} disabled={status === 'loading'} />
          </div>
          <div className="mer-field">
            <label htmlFor="mcf-email" className="mer-label-text">Email Address <span className="mer-label-required" aria-hidden="true">*</span></label>
            <input id="mcf-email" type="email" className="mer-input" required autoComplete="email" placeholder="jane@company.com" value={form.email} onChange={(e) => set('email', e.target.value)} disabled={status === 'loading'} />
          </div>
        </div>
        <div className="mer-form-grid" style={{ marginBottom: 'var(--mer-spacing-md)' }}>
          <div className="mer-field">
            <label htmlFor="mcf-phone" className="mer-label-text">Phone Number</label>
            <input id="mcf-phone" type="tel" className="mer-input" autoComplete="tel" placeholder="+27 11 123 4567" value={form.phone} onChange={(e) => set('phone', e.target.value)} disabled={status === 'loading'} />
          </div>
          <div className="mer-field">
            <label htmlFor="mcf-company" className="mer-label-text">Company / Organisation</label>
            <input id="mcf-company" type="text" className="mer-input" autoComplete="organization" placeholder="Acme Ltd." value={form.company} onChange={(e) => set('company', e.target.value)} disabled={status === 'loading'} />
          </div>
        </div>
        {services.length > 0 && (
          <div className="mer-field" style={{ marginBottom: 'var(--mer-spacing-md)' }}>
            <label htmlFor="mcf-service" className="mer-label-text">Regarding</label>
            <select id="mcf-service" className="mer-input mer-select" value={form.service} onChange={(e) => set('service', e.target.value)} disabled={status === 'loading'}>
              <option value="">Select a service (optional)</option>
              {services.map((svc) => <option key={svc.slug} value={svc.slug}>{svc.title}</option>)}
            </select>
          </div>
        )}
        {!routing.teamMember && departments.length > 0 && (
          <div className="mer-field" style={{ marginBottom: 'var(--mer-spacing-md)' }}>
            <label htmlFor="mcf-dept" className="mer-label-text">Department</label>
            <select id="mcf-dept" className="mer-input mer-select" value={form.department} onChange={(e) => set('department', e.target.value)} disabled={status === 'loading'}>
              <option value="">Any department</option>
              {departments.map((d) => <option key={d.slug} value={d.slug}>{d.name}</option>)}
            </select>
          </div>
        )}
        <div className="mer-field" style={{ marginBottom: 'var(--mer-spacing-lg)' }}>
          <label htmlFor="mcf-message" className="mer-label-text">Your Message <span className="mer-label-required" aria-hidden="true">*</span></label>
          <textarea id="mcf-message" className="mer-input mer-textarea" required rows={5} placeholder="Please describe how we can assist you…" value={form.message} onChange={(e) => set('message', e.target.value)} disabled={status === 'loading'} style={{ minHeight: '140px' }} />
        </div>
        {status === 'error' && errorMsg && (
          <div className="mer-form-error" style={{ marginBottom: 'var(--mer-spacing-md)' }} role="alert">{errorMsg}</div>
        )}
        <div className="mer-form-actions">
          <button id="mcf-submit" type="submit" className="mer-btn mer-btn-primary mer-btn-lg" disabled={status === 'loading'} aria-busy={status === 'loading'} style={{ minWidth: 180 }}>
            {status === 'loading'
              ? (<span style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ animation: 'mer-spin 0.8s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>Sending…</span>)
              : submitLabel}
          </button>
          <p className="mer-caption" style={{ opacity: 0.6 }}>We respond within one business day.</p>
        </div>
      </form>
    </div>
  );
}
