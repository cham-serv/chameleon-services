'use client';

import { useState } from 'react';
import { Turnstile } from '@/components/Turnstile';
import { Send, CheckCircle, Mail } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    message: '',
    source: '',
  });
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'submitting') return;

    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, turnstileToken }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMessage(data.error ?? 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }

      setStatus('success');
    } catch {
      setErrorMessage('Network error. Please check your connection and try again.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '480px' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(34,197,94,0.12)',
              border: '1px solid rgba(34,197,94,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              color: '#22c55e',
            }}
          >
            <CheckCircle size={32} />
          </div>
          <h2
            style={{
              fontFamily: 'var(--m-font-display)',
              fontSize: '1.8rem',
              fontWeight: 700,
              color: 'var(--m-text)',
              margin: '0 0 12px',
            }}
          >
            Message sent!
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--m-text-muted)', lineHeight: 1.7 }}>
            Thanks for reaching out. We&apos;ll be in touch within one business day.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <section
        className="m-hero-pt"
        style={{
          paddingBottom: '48px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="m-container">
          <span className="m-label">Contact</span>
          <div className="m-divider" style={{ marginBlock: '16px' }} />
          <h1
            style={{
              fontFamily: 'var(--m-font-display)',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--m-text)',
              margin: '0 0 12px',
            }}
          >
            Let&apos;s talk.
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--m-text-muted)', lineHeight: 1.6, maxWidth: '480px' }}>
            Whether you&apos;re ready to get started or just have questions  we&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Form + Info */}
      <section className="m-section">
        <div className="m-container">
          <div className="m-grid-2 m-contact-layout">
            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Name + Company */}
              <div className="m-grid-2" style={{ gap: '16px' }}>
                <div className="m-form-group">
                  <label htmlFor="contact-name" className="m-label-text">Name *</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="m-input"
                    placeholder="Your full name"
                    autoComplete="name"
                  />
                </div>
                <div className="m-form-group">
                  <label htmlFor="contact-company" className="m-label-text">Company</label>
                  <input
                    id="contact-company"
                    name="company"
                    type="text"
                    value={form.company}
                    onChange={handleChange}
                    className="m-input"
                    placeholder="Your company name"
                    autoComplete="organization"
                  />
                </div>
              </div>

              {/* Email + Phone */}
              <div className="m-grid-2" style={{ gap: '16px' }}>
                <div className="m-form-group">
                  <label htmlFor="contact-email" className="m-label-text">Email *</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="m-input"
                    placeholder="you@company.com"
                    autoComplete="email"
                  />
                </div>
                <div className="m-form-group">
                  <label htmlFor="contact-phone" className="m-label-text">Phone</label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    className="m-input"
                    placeholder="+00 000 000 0000"
                    autoComplete="tel"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="m-form-group">
                <label htmlFor="contact-message" className="m-label-text">Message *</label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  value={form.message}
                  onChange={handleChange}
                  className="m-textarea"
                  placeholder="Tell us about your business and what you're looking for..."
                />
              </div>

              {/* Source */}
              <div className="m-form-group">
                <label htmlFor="contact-source" className="m-label-text">How did you hear about us?</label>
                <select
                  id="contact-source"
                  name="source"
                  value={form.source}
                  onChange={handleChange}
                  className="m-input m-select"
                  style={{ appearance: 'none' }}
                >
                  <option value="">Select an option</option>
                  <option value="google">Google search</option>
                  <option value="social">Social media</option>
                  <option value="referral">Referral from someone</option>
                  <option value="agency">Through an agency</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Turnstile */}
              <Turnstile onVerify={setTurnstileToken} />

              {/* Error */}
              {status === 'error' && (
                <p style={{ color: '#ef4444', fontSize: '0.875rem', margin: 0 }}>
                  {errorMessage}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="m-btn m-btn-primary m-btn-lg"
                id="contact-submit"
                style={{ alignSelf: 'flex-start', opacity: status === 'submitting' ? 0.7 : 1 }}
              >
                {status === 'submitting' ? 'Sending...' : 'Send Message'}
                <Send size={16} />
              </button>
            </form>

            {/* Info Panel */}
            <div>
              <h2
                style={{
                  fontFamily: 'var(--m-font-display)',
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  color: 'var(--m-text)',
                  margin: '0 0 8px',
                }}
              >
                Why Chameleon?
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 48px' }}>
                {[
                  'AI-ready and GEO-optimised from day one',
                  'No developers or agencies needed',
                  'No lock-in — cancel anytime',
                  'Built for businesses that refuse to fall behind',
                ].map((point) => (
                  <li
                    key={point}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'flex-start',
                      fontSize: '0.9rem',
                      color: 'var(--m-text-muted)',
                      marginBottom: '12px',
                    }}
                  >
                    <span style={{ color: '#22c55e', marginTop: '2px', flexShrink: 0 }}></span>
                    {point}
                  </li>
                ))}
              </ul>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <a
                  href="mailto:chris@chameleon.services"
                  style={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center',
                    fontSize: '0.875rem',
                    color: 'var(--m-text-muted)',
                    textDecoration: 'none',
                  }}
                  id="contact-email-link"
                >
                  <Mail size={16} style={{ color: '#60a5fa' }} />
                  chris@chameleon.services
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
