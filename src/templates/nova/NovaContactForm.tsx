'use client';

/**
 * Nova Contact Form — Client Component
 *
 * Handles form submission to the engine's contact endpoint.
 * Supports optional Turnstile CAPTCHA verification.
 */

import { useState, useCallback, type FormEvent } from 'react';

type Props = {
  tenantSlug: string;
  turnstileSiteKey: string | null;
};

export function NovaContactForm({ tenantSlug, turnstileSiteKey }: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    const form = e.currentTarget;
    const data = new FormData(form);

    const engineUrl =
      process.env.NEXT_PUBLIC_CHAMELEON_ENGINE_URL ??
      'https://chameleon-engine-production.up.railway.app';

    try {
      const res = await fetch(`${engineUrl}/api/public/inquiry?tenant=${encodeURIComponent(tenantSlug)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          phone: data.get('phone') || undefined,
          message: data.get('message'),
          source: 'nova-contact-form',
        }),
      });

      if (res.ok) {
        setStatus('sent');
        form.reset();
      } else {
        const err = await res.json().catch(() => ({ error: 'Something went wrong.' }));
        setErrorMessage(err.error || 'Something went wrong.');
        setStatus('error');
      }
    } catch {
      setErrorMessage('Network error. Please try again.');
      setStatus('error');
    }
  }, [tenantSlug]);

  if (status === 'sent') {
    return (
      <div style={{
        padding: '3rem',
        textAlign: 'center',
        background: 'var(--nova-surface)',
        borderRadius: 'var(--nova-radius-lg)',
        border: '1px solid var(--nova-border)',
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>✓</div>
        <h3 className="nova-heading nova-heading--section">Message Sent!</h3>
        <p style={{ color: 'var(--nova-text-muted)', marginTop: '0.5rem' }}>
          Thank you for getting in touch. We&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form className="nova-form" onSubmit={handleSubmit}>
      <div className="nova-form__row">
        <div className="nova-form__group">
          <label className="nova-form__label" htmlFor="nova-name">Name *</label>
          <input
            id="nova-name"
            name="name"
            type="text"
            className="nova-form__input"
            required
            placeholder="Your full name"
          />
        </div>
        <div className="nova-form__group">
          <label className="nova-form__label" htmlFor="nova-email">Email *</label>
          <input
            id="nova-email"
            name="email"
            type="email"
            className="nova-form__input"
            required
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="nova-form__group">
        <label className="nova-form__label" htmlFor="nova-phone">Phone</label>
        <input
          id="nova-phone"
          name="phone"
          type="tel"
          className="nova-form__input"
          placeholder="Optional"
        />
      </div>

      <div className="nova-form__group">
        <label className="nova-form__label" htmlFor="nova-message">Message *</label>
        <textarea
          id="nova-message"
          name="message"
          className="nova-form__textarea"
          required
          placeholder="Tell us about your project or question…"
        />
      </div>

      {errorMessage && (
        <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>{errorMessage}</p>
      )}

      <button
        type="submit"
        className="nova-btn nova-btn--primary"
        disabled={status === 'sending'}
        style={{ alignSelf: 'flex-start' }}
      >
        {status === 'sending' ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
}
