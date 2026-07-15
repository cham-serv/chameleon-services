import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Chameleon Solutions privacy policy. Learn how we collect, use, and protect your personal information.',
}

export default function PrivacyPage() {
  return (
    <>
      <section
        style={{
          position: 'relative',
          padding: 'calc(var(--navbar-height) + var(--space-20)) 0 var(--space-12)',
          background: 'var(--gradient-hero)',
          overflow: 'hidden',
        }}
      >
        <div className="container">
          <span className="badge badge-teal">Legal</span>
          <div className="divider-teal" style={{ margin: '1.5rem 0' }} />
          <h1
            style={{
              fontSize: 'clamp(var(--text-3xl), 4.5vw, var(--text-5xl))',
              color: '#ffffff',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
            }}
          >
            Privacy Policy
          </h1>
          <p
            style={{
              fontSize: 'var(--text-xl)',
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.7,
              maxWidth: 640,
              marginTop: 'var(--space-6)',
            }}
          >
            Your privacy matters to us. Here&apos;s how we handle your data.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="prose" style={{ margin: '0 auto' }}>
            <p>
              <strong>Last updated:</strong> 15 July 2025
            </p>

            <h2>1. Who We Are</h2>
            <p>
              Chameleon Solutions (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) provides
              AI and process automation consulting services for small and medium enterprises. Our
              website is <Link href="/">chameleon.services</Link>.
            </p>

            <h2>2. Information We Collect</h2>
            <p>We collect information that you voluntarily provide when you:</p>
            <ul>
              <li>Submit a message via our contact form (name, email, company, service interest, and message content)</li>
              <li>Subscribe to our newsletter (if applicable)</li>
              <li>Communicate with us via email</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Respond to your enquiries and provide requested services</li>
              <li>Schedule and conduct discovery calls</li>
              <li>Send relevant information about our services (only if you&apos;ve opted in)</li>
              <li>Improve our website and services</li>
            </ul>
            <p>We do not sell, trade, or rent your personal information to third parties.</p>

            <h2>4. Analytics</h2>
            <p>
              We use Plausible Analytics, a privacy-focused analytics tool that does not use cookies
              and does not collect personal data. It provides us with aggregate website usage
              statistics without tracking individual visitors.
            </p>

            <h2>5. Email Communications</h2>
            <p>
              When you submit our contact form, your information is processed through Resend, a
              transactional email service, to deliver your message to our team. Resend processes
              this data in accordance with their own privacy policy.
            </p>

            <h2>6. Data Retention</h2>
            <p>
              We retain your contact form submissions and email correspondence for as long as
              necessary to fulfil the purpose for which it was collected, typically no longer than
              24 months after our last interaction.
            </p>

            <h2>7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Request access to the personal data we hold about you</li>
              <li>Request correction of any inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us at{' '}
              <a href="mailto:hello@chameleon.services">hello@chameleon.services</a>.
            </p>

            <h2>8. Cookies</h2>
            <p>
              Our website does not use cookies for tracking purposes. Plausible Analytics is
              cookie-free by design. Essential cookies may be used for website functionality.
            </p>

            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. Any changes will be posted on
              this page with an updated revision date.
            </p>

            <h2>10. Contact</h2>
            <p>
              If you have any questions about this privacy policy, please contact us at{' '}
              <a href="mailto:hello@chameleon.services">hello@chameleon.services</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
