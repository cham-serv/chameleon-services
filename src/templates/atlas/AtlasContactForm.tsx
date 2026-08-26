'use client';

/**
 * AtlasContactForm  Client Component
 *
 * Handles form state, validation, and submission to /api/public/inquiry.
 * Turnstile integration ready (placeholder for now  needs the sitekey from settings).
 */

import { useState, type FormEvent } from 'react';

type AtlasContactFormProps = {
  tenant: string;
};

export function AtlasContactForm({ tenant }: AtlasContactFormProps) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    const form = e.currentTarget;
    const data = new FormData(form);

    const body = {
      tenant,
      name: data.get('name') as string,
      email: data.get('email') as string,
      phone: (data.get('phone') as string) || undefined,
      subject: (data.get('subject') as string) || undefined,
      message: data.get('message') as string,
      // turnstileToken: data.get('cf-turnstile-response') as string,
    };

    try {
      const apiBase = process.env.NEXT_PUBLIC_CHAMELEON_ENGINE_URL ?? '';
      const res = await fetch(`${apiBase}/api/public/inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Something went wrong' }));
        throw new Error(err.message || `Error ${res.status}`);
      }

      setStatus('success');
      form.reset();
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  }

  if (status === 'success') {
    return (
      <div
        className="atlas-card-flat"
        style={{
          padding: 'var(--atlas-spacing-2xl)',
          textAlign: 'center',
          background: 'color-mix(in srgb, var(--brand-primary, #2d6a4f) 5%, transparent)',
          borderLeft: '4px solid var(--brand-primary, #2d6a4f)',
        }}
      >
        <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: 'var(--atlas-spacing-md)' }}></span>
        <h2 className="atlas-h4">Message Sent</h2>
        <p className="atlas-body" style={{ marginTop: 'var(--atlas-spacing-sm)', opacity: 0.8 }}>
          Thank you for reaching out. We&apos;ll get back to you shortly.
        </p>
        <button
          type="button"
          className="atlas-btn atlas-btn-secondary"
          style={{ marginTop: 'var(--atlas-spacing-lg)' }}
          onClick={() => setStatus('idle')}
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--atlas-spacing-md)' }}>
      {/* Name */}
      <div>
        <label htmlFor="contact-name" className="atlas-caption" style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>
          Name <span style={{ color: '#c0392b' }}>*</span>
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          placeholder="Your full name"
          className="atlas-input"
          style={inputStyle}
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="contact-email" className="atlas-caption" style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>
          Email <span style={{ color: '#c0392b' }}>*</span>
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="atlas-input"
          style={inputStyle}
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="contact-phone" className="atlas-caption" style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>
          Phone
        </label>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          placeholder="+27 ..."
          className="atlas-input"
          style={inputStyle}
        />
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="contact-subject" className="atlas-caption" style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>
          Subject
        </label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          placeholder="What is this about?"
          className="atlas-input"
          style={inputStyle}
        />
      </div>

      {/* Message */}
      <div>
        <label htmlFor="contact-message" className="atlas-caption" style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>
          Message <span style={{ color: '#c0392b' }}>*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          placeholder="Tell us more..."
          className="atlas-input"
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>

      {/* Error */}
      {status === 'error' && (
        <div style={{ padding: 'var(--atlas-spacing-sm) var(--atlas-spacing-md)', background: '#fed7d7', color: '#c53030', borderRadius: 'var(--atlas-radius-sm)', fontSize: '0.875rem' }}>
          {errorMessage}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="atlas-btn atlas-btn-primary atlas-btn-lg"
        style={{ marginTop: 'var(--atlas-spacing-sm)' }}
      >
        {status === 'submitting' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 1rem',
  border: '1px solid color-mix(in srgb, var(--brand-text, #1b1b1b) 15%, transparent)',
  borderRadius: 'var(--atlas-radius-sm)',
  fontSize: '0.9375rem',
  fontFamily: 'inherit',
  background: 'transparent',
  transition: 'border-color 0.2s',
};
