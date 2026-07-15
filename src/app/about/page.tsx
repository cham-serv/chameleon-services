import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Eye, Shuffle, TrendingUp, Target } from 'lucide-react'
import styles from './about.module.css'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Chameleon Solutions: our story, our values, and why we believe AI should adapt to your business, not the other way around.',
}

const values = [
  {
    icon: Shuffle,
    title: 'Adaptability',
    desc: 'We integrate AI seamlessly into your existing workflows without forcing you to change how your team operates. Technology should adapt to people, not the other way around.',
  },
  {
    icon: TrendingUp,
    title: 'Transformation',
    desc: 'We take complex, legacy processes and turn them into streamlined, modern systems. Real transformation is measurable and built to last.',
  },
  {
    icon: Eye,
    title: 'Vision',
    desc: 'Just as a chameleon\'s eyes can see in multiple directions simultaneously, our AI solutions analyse your operations from every angle, finding efficiencies you didn\'t know existed.',
  },
]


export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Chameleon Solutions',
    url: 'https://chameleon.services/about',
    description:
      'Chameleon Solutions helps SMEs streamline operations through custom AI solutions and intelligent process design.',
    mainEntity: {
      '@type': 'Organization',
      name: 'Chameleon Solutions',
      foundingDate: '2018',
      description:
        'AI and process consulting company specialising in workflow automation and intelligent solutions for small and medium enterprises.',
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
            <span className="badge badge-teal">About Us</span>
            <div className="divider-teal" style={{ margin: '1.5rem 0' }} />
            <h1 className={styles.heroTitle}>
              We believe AI should work <span className="text-gradient">for your business</span>,<br />
              not the other way around.
            </h1>
            <p className={styles.heroSubtitle}>
              Chameleon Solutions was built on a simple conviction: small and medium enterprises 
              deserve access to the same intelligent tools that are transforming the enterprise world,
              without the complexity, cost, or disruption.
            </p>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="section">
        <div className="container">
          <div className={styles.storyGrid}>
            <div className={styles.storyText}>
              <span className="badge badge-navy">Our Story</span>
              <div className="divider-teal" />
              <h2 className={styles.storyTitle}>The Brand Shift</h2>
              <p>
                We started life as Chameleon Image Consultants, helping businesses communicate and present 
                themselves more effectively. But as we worked closely with our clients, we saw something 
                that kept coming up: enormous amounts of time and money being lost to manual, repetitive 
                processes that technology could handle in seconds.
              </p>
              <p>
                We began building solutions. First small automations, then deeper integrations, then full 
                AI-powered systems. The results were transformative. By 2023, it was clear where our 
                expertise and passion truly lay.
              </p>
              <p>
                The chameleon remained the perfect metaphor. Not because we change who we are, but because 
                we adapt, meeting each client in their environment, their processes and their tools, 
                making AI work there.
              </p>
            </div>
            <div className={styles.storyVisual}>
              <div className={styles.storyCard}>
                <Image src="/logo.png" alt="Chameleon Solutions" width={180} height={180} />
                <div className={styles.storyCardText}>
                  <span>From Image Consultants</span>
                  <span className={styles.storyArrow}>→</span>
                  <span>AI &amp; Process Solutions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto var(--space-16)' }}>
            <span className="badge badge-navy">Our Values</span>
            <div className="divider-teal" style={{ margin: '1.5rem auto' }} />
            <h2 style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-primary)' }}>What drives us</h2>
          </div>

          <div className="grid-3">
            {values.map((value) => (
              <div key={value.title} className={styles.valueCard}>
                <div className={styles.valueIcon}>
                  <value.icon size={24} />
                </div>
                <h3 className={styles.valueTitle}>{value.title}</h3>
                <p className={styles.valueDesc}>{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Statement */}
      <section className={styles.philosophySection}>
        <div className="container">
          <div className={styles.philosophyBox}>
            <Target size={32} className={styles.philosophyIcon} />
            <h2 className={styles.philosophyTitle}>Our Mission</h2>
            <p className={styles.philosophyText}>
              To make enterprise-grade AI practical, accessible, and genuinely valuable for every growing 
              business, regardless of size, sector or technical maturity.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`section ${styles.ctaSection}`}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#ffffff', fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-4)' }}>
            Ready to start your transformation?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 'var(--space-8)', fontSize: 'var(--text-lg)' }}>
            Let&apos;s have a conversation about what&apos;s possible for your business.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-primary btn-lg" id="about-cta-contact">
              Get in Touch <ArrowRight size={18} />
            </Link>
            <Link href="/services" className="btn btn-outline btn-lg" id="about-cta-services">
              Explore Services
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
