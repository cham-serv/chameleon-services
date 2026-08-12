import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Chameleon Solutions terms of service. Read about the terms governing use of our website and services.',
}

export default function TermsPage() {
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
            Terms of Service
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
            The terms governing your use of our website and services.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="prose" style={{ margin: '0 auto' }}>
            <p>
              <strong>Last updated:</strong> 15 July 2025
            </p>

            <h2>1. Introduction</h2>
            <p>
              These terms of service (&ldquo;Terms&rdquo;) govern your use of the Chameleon
              Solutions website at <Link href="/">chameleon.services</Link> and any services
              provided by Chameleon Solutions (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;).
              By using our website, you agree to these Terms.
            </p>

            <h2>2. Services</h2>
            <p>
              Chameleon Solutions provides AI consulting, workflow automation, process auditing,
              custom software development, and AI chatbot/agent services for small and medium
              enterprises. Specific deliverables, timelines, and costs are agreed upon separately
              for each engagement.
            </p>

            <h2>3. Website Use</h2>
            <p>You agree to use our website only for lawful purposes and in a way that does not:</p>
            <ul>
              <li>Infringe the rights of, or restrict the use and enjoyment of, this site by any third party</li>
              <li>Attempt to gain unauthorised access to our systems or servers</li>
              <li>Introduce malicious code or spam via our contact form</li>
              <li>Misrepresent your identity or affiliation</li>
            </ul>

            <h2>4. Intellectual Property</h2>
            <p>
              All content on this website — including text, graphics, logos, images, and software —
              is the property of Chameleon Solutions and is protected by applicable intellectual
              property laws. You may not reproduce, distribute, or create derivative works from
              our content without express written permission.
            </p>

            <h2>5. Client Engagements</h2>
            <p>
              Any consulting or development work undertaken by Chameleon Solutions will be governed
              by a separate statement of work or service agreement specific to that engagement.
              These Terms govern only your use of our website and initial communications.
            </p>

            <h2>6. Limitation of Liability</h2>
            <p>
              The information provided on this website is for general informational purposes only.
              While we strive to keep the information up to date and correct, we make no
              representations or warranties of any kind about the completeness, accuracy,
              reliability, or suitability of the information.
            </p>
            <p>
              To the fullest extent permitted by law, Chameleon Solutions shall not be liable for
              any indirect, incidental, special, consequential, or punitive damages arising from
              your use of the website.
            </p>

            <h2>7. External Links</h2>
            <p>
              Our website may contain links to external websites. We have no control over the
              content and nature of those sites and inclusion of any links does not imply a
              recommendation or endorsement.
            </p>

            <h2>8. Changes to These Terms</h2>
            <p>
              We reserve the right to update these Terms at any time. Changes will be posted on
              this page with an updated revision date. Continued use of the website after changes
              constitutes acceptance of the revised Terms.
            </p>

            <h2>9. Governing Law</h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of the
              jurisdiction in which Chameleon Solutions operates.
            </p>

            <h2>10. Contact</h2>
            <p>
              If you have any questions about these Terms, please contact us at{' '}
              <a href="mailto:hello@chameleon.services">hello@chameleon.services</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
