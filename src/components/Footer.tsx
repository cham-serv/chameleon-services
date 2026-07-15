import Link from 'next/link'
import Image from 'next/image'
import { Mail, ArrowRight } from 'lucide-react'
import styles from './Footer.module.css'

const footerLinks = {
  company: [
    { href: '/about', label: 'About Us' },
    { href: '/services', label: 'Services' },
    { href: '/articles', label: 'Articles' },
    { href: '/contact', label: 'Contact' },
  ],
  services: [
    { href: '/services#ai-workflow-automation', label: 'AI Workflow Automation' },
    { href: '/services#custom-ai-integrations', label: 'Custom AI Integrations' },
    { href: '/services#process-audits', label: 'Process Audits' },
    { href: '/services#custom-software', label: 'Custom Software Modules' },
    { href: '/services#ai-chatbots', label: 'AI Chatbots & Agents' },
  ],
}

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.glow} />
      <div className="container">
        {/* CTA Banner */}
        <div className={styles.ctaBanner}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>
              Ready to transform your business?
            </h2>
            <p className={styles.ctaText}>
              Book a free discovery call and let&apos;s explore how AI can work for your team.
            </p>
          </div>
          <Link href="/contact" className="btn btn-primary btn-lg" id="footer-cta">
            Start the Conversation
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className={styles.divider} />

        {/* Main Footer Grid */}
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <Image src="/logo.png" alt="Chameleon Solutions" width={44} height={44} />
              <div>
                <div className={styles.logoName}>Chameleon</div>
                <div className={styles.logoTag}>AI &amp; Process Solutions</div>
              </div>
            </Link>
            <p className={styles.brandDesc}>
              Helping small and medium enterprises adapt, automate, and grow through intelligent AI solutions and process design.
            </p>
            <div className={styles.social}>
              <a href="mailto:hello@chameleon.services" aria-label="Email Chameleon Solutions" id="footer-email" className={styles.socialIcon}>
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div className={styles.linkGroup}>
            <h3 className={styles.linkGroupTitle}>Company</h3>
            <ul className={styles.linkList}>
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.footerLink}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div className={styles.linkGroup}>
            <h3 className={styles.linkGroupTitle}>Services</h3>
            <ul className={styles.linkList}>
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.footerLink}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className={styles.linkGroup}>
            <h3 className={styles.linkGroupTitle}>Get In Touch</h3>
            <p className={styles.contactText}>hello@chameleon.services</p>
            <Link href="/contact" className={`btn btn-outline ${styles.contactBtn}`} id="footer-contact-btn">
              Send a Message
            </Link>
          </div>
        </div>

        <div className={styles.divider} />

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            © {year} Chameleon Solutions. All rights reserved.
          </p>
          <div className={styles.bottomLinks}>
            <Link href="/privacy" className={styles.bottomLink}>Privacy Policy</Link>
            <Link href="/terms" className={styles.bottomLink}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
