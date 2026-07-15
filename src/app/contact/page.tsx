import type { Metadata } from 'next'
import { Mail, MessageSquare } from 'lucide-react'
import { ContactForm } from '@/components/ContactForm'
import styles from './contact.module.css'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with the Chameleon Solutions team. Book a free discovery call or send us a message about your AI and process automation needs.',
}

export default function ContactPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Chameleon Solutions',
    url: 'https://chameleon.services/contact',
    description:
      'Get in touch with Chameleon Solutions to discuss AI and process automation for your business.',
    mainEntity: {
      '@type': 'Organization',
      name: 'Chameleon Solutions',
      email: 'hello@chameleon.services',
      url: 'https://chameleon.services',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className="container">
          <div className={styles.heroContent}>
            <span className="badge badge-teal">
              <MessageSquare size={10} />
              Let&apos;s Talk
            </span>
            <div className="divider-teal" style={{ margin: '1.5rem 0' }} />
            <h1 className={styles.heroTitle}>
              Start your <span className="text-gradient">transformation</span> today
            </h1>
            <p className={styles.heroSubtitle}>
              Whether you&apos;re ready to build or just exploring what&apos;s possible, 
              we'd love to hear about your business. No obligation, no pressure. Just an honest conversation.
            </p>
          </div>
        </div>
      </section>

      {/* Form & Info */}
      <section className="section">
        <div className="container">
          <div className={styles.grid}>
            {/* Form */}
            <div>
              <h2 className={styles.formTitle}>Send us a message</h2>
              <p className={styles.formSubtitle}>
                We typically respond within one business day.
              </p>
              <ContactForm />
            </div>

            {/* Info */}
            <div className={styles.info}>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                  <Mail size={20} />
                </div>
                <h3 className={styles.infoTitle}>Email us directly</h3>
                <a href="mailto:hello@chameleon.services" className={styles.infoLink} id="contact-email-link">
                  hello@chameleon.services
                </a>
              </div>

              <div className={styles.expectCard}>
                <h3 className={styles.expectTitle}>What to expect</h3>
                <div className={styles.expectSteps}>
                  <div className={styles.expectStep}>
                    <span className={styles.expectNum}>01</span>
                    <div>
                      <strong>We read your message carefully</strong>
                      <p>We take time to understand your specific context before responding.</p>
                    </div>
                  </div>
                  <div className={styles.expectStep}>
                    <span className={styles.expectNum}>02</span>
                    <div>
                      <strong>We schedule a discovery call</strong>
                      <p>A 30-minute conversation to explore your goals and challenges in depth.</p>
                    </div>
                  </div>
                  <div className={styles.expectStep}>
                    <span className={styles.expectNum}>03</span>
                    <div>
                      <strong>We propose a tailored approach</strong>
                      <p>No templates. A solution designed specifically for your business.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.commitmentCard}>
                <p className={styles.commitmentText}>
                  &ldquo;No long-term contracts. No jargon. No pressure. Just honest advice and practical solutions that work for your business.&rdquo;
                </p>
                <span className={styles.commitmentAuthor}>The Chameleon Team</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
