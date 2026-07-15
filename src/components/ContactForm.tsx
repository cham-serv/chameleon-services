'use client'

import { useState } from 'react'
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import styles from './ContactForm.module.css'

const serviceOptions = [
  'AI Workflow Automation',
  'Custom AI Integrations',
  'Process Audits & Optimisation',
  'Custom Software Modules',
  'AI Chatbots & Agents',
  'General Enquiry',
]

type FormState = 'idle' | 'loading' | 'success' | 'error'

export function ContactForm() {
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormState('loading')
    setErrorMsg('')

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      company: (form.elements.namedItem('company') as HTMLInputElement).value,
      service: (form.elements.namedItem('service') as HTMLSelectElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        setFormState('success')
      } else {
        const body = await res.json()
        setErrorMsg(body.error || 'Something went wrong. Please try again.')
        setFormState('error')
      }
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.')
      setFormState('error')
    }
  }

  if (formState === 'success') {
    return (
      <div className={styles.successState} id="contact-success">
        <div className={styles.successIcon}>
          <CheckCircle size={40} />
        </div>
        <h3 className={styles.successTitle}>Message sent!</h3>
        <p className={styles.successDesc}>
          Thank you for reaching out. We&apos;ll be in touch within one business day.
        </p>
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} id="contact-form" noValidate>
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="contact-name">Your Name *</label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            placeholder="Jane Smith"
            className={styles.input}
            disabled={formState === 'loading'}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="contact-email">Email Address *</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            placeholder="jane@company.co.za"
            className={styles.input}
            disabled={formState === 'loading'}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="contact-company">Company Name</label>
          <input
            id="contact-company"
            name="company"
            type="text"
            placeholder="Your Company Ltd"
            className={styles.input}
            disabled={formState === 'loading'}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="contact-service">Service Interest</label>
          <select
            id="contact-service"
            name="service"
            className={styles.select}
            disabled={formState === 'loading'}
          >
            <option value="">Select a service...</option>
            {serviceOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="contact-message">Your Message *</label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          placeholder="Tell us about your business and what you're hoping to achieve..."
          className={styles.textarea}
          disabled={formState === 'loading'}
        />
      </div>

      {formState === 'error' && (
        <div className={styles.errorMsg} role="alert">
          <AlertCircle size={16} />
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        className={`btn btn-primary btn-lg ${styles.submitBtn}`}
        disabled={formState === 'loading'}
        id="contact-submit"
      >
        {formState === 'loading' ? (
          <>
            <Loader2 size={18} className={styles.spinner} />
            Sending...
          </>
        ) : (
          <>
            Send Message
            <Send size={16} />
          </>
        )}
      </button>
    </form>
  )
}
