import type { Metadata } from 'next'
import Link from 'next/link'
import { Zap, GitMerge, BarChart3, Bot, Puzzle, ArrowRight, CheckCircle, Clock, Users } from 'lucide-react'
import styles from './services.module.css'

export const metadata: Metadata = {
  title: 'Our Services',
  description:
    'AI workflow automation, custom integrations, process audits, custom software modules, and AI chatbots & agents — built specifically for SMEs.',
}

const services = [
  {
    id: 'ai-workflow-automation',
    icon: Zap,
    title: 'AI Workflow Automation',
    tagline: 'Eliminate the manual. Accelerate the essential.',
    desc: `Manual, repetitive tasks are the silent killers of SME productivity. Every hour your team spends on data entry, report generation, or routing information between systems is an hour they're not spending on work that drives growth.

We design and build intelligent automation pipelines that handle these processes seamlessly — triggered by real-world events, powered by AI decision-making, and integrated directly into your existing tools.`,
    useCases: [
      'Automated invoice processing and approval workflows',
      'AI-powered lead scoring and CRM updates',
      'Automated report generation from multiple data sources',
      'Document classification and routing',
      'Scheduled data synchronisation between systems',
    ],
    outcomes: [
      { icon: Clock, text: 'Average 60% reduction in time spent on manual tasks' },
      { icon: CheckCircle, text: 'Near-zero error rates on automated processes' },
      { icon: Users, text: 'Teams refocused on strategic, high-value work' },
    ],
  },
  {
    id: 'custom-ai-integrations',
    icon: GitMerge,
    title: 'Custom AI Integrations',
    tagline: 'Your existing tools, made intelligent.',
    desc: `You don't need to replace your CRM, ERP, or business tools to benefit from AI. In most cases, you just need intelligent connections between them — and the right AI capabilities plugged in at the right points.

We specialise in building custom integrations that add AI capabilities to your existing technology stack. No rip-and-replace. No retraining your entire team. Just seamless enhancement of the systems you already rely on.`,
    useCases: [
      'AI-powered customer insights within your CRM',
      'Natural language querying of your ERP data',
      'Automated anomaly detection in financial systems',
      'Intelligent document extraction from emails and PDFs',
      'AI-assisted customer service within existing helpdesk tools',
    ],
    outcomes: [
      { icon: Clock, text: 'Faster time-to-insight without changing existing workflows' },
      { icon: CheckCircle, text: 'Minimal disruption to existing processes' },
      { icon: Users, text: 'Enhanced capabilities for your existing tech investment' },
    ],
  },
  {
    id: 'process-audits',
    icon: BarChart3,
    title: 'Process Audits & Optimisation',
    tagline: 'See your business through fresh eyes.',
    desc: `Before you automate anything, you need to understand where the real friction is. Many businesses automate the wrong processes — digitising inefficiency rather than eliminating it.

Our Process Audit service takes a systematic, holistic look at how your business actually operates. We map your workflows, identify the bottlenecks and waste, and deliver a prioritised roadmap of exactly where technology and AI can deliver the most value.`,
    useCases: [
      'End-to-end workflow mapping and documentation',
      'Identification of automation and AI opportunities',
      'Prioritised optimisation roadmap with ROI projections',
      'Technology stack assessment and recommendations',
      'Change management planning for process improvements',
    ],
    outcomes: [
      { icon: Clock, text: 'Clear visibility of where time and money are being lost' },
      { icon: CheckCircle, text: 'Evidence-based roadmap for transformation' },
      { icon: Users, text: 'Stakeholder alignment on priorities and approach' },
    ],
  },
  {
    id: 'custom-software',
    icon: Puzzle,
    title: 'Custom Software Modules & Components',
    tagline: 'Built for your business. Not the average business.',
    desc: `Off-the-shelf software is designed for the average business. But your business isn't average — it has unique processes, unique data, and unique needs that generic tools simply can't accommodate without compromise.

We build bespoke software modules and components that integrate directly into your existing systems or stand alone as purpose-built tools. From custom dashboards to specialised data processing engines to proprietary business logic — if you need it, we build it.`,
    useCases: [
      'Custom reporting and analytics dashboards',
      'Bespoke data processing and transformation pipelines',
      'Proprietary business logic engines',
      'Custom API integrations and middleware',
      'Internal tools and portals for team efficiency',
    ],
    outcomes: [
      { icon: Clock, text: 'Exact fit for your processes — no workarounds required' },
      { icon: CheckCircle, text: 'Full ownership of your technology' },
      { icon: Users, text: 'Competitive advantage through proprietary capability' },
    ],
  },
  {
    id: 'ai-chatbots',
    icon: Bot,
    title: 'AI Chatbots & Agents',
    tagline: 'Intelligent conversations that work for you 24/7.',
    desc: `Modern AI chatbots and agents are a world apart from the frustrating rule-based bots of the past. Today's large language model-powered agents can understand context, handle complex queries, retrieve relevant information, and take actions — all in natural, human-like conversation.

We design and deploy AI conversational agents for customer-facing support, internal knowledge management, lead qualification, and more. Every agent is trained on your specific data and calibrated to reflect your brand voice.`,
    useCases: [
      'Customer support agents with full product/service knowledge',
      'Internal HR and policy Q&A bots for your team',
      'Lead qualification and appointment booking agents',
      'Intelligent FAQ systems for your website',
      'Multi-step workflow agents that take actions on behalf of users',
    ],
    outcomes: [
      { icon: Clock, text: '24/7 availability without scaling your support team' },
      { icon: CheckCircle, text: 'Consistent, accurate responses grounded in your data' },
      { icon: Users, text: 'Scalable customer and team support from day one' },
    ],
  },
]

export default function ServicesPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Chameleon Solutions Services',
    url: 'https://chameleon.services/services',
    itemListElement: services.map((service, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Service',
        name: service.title,
        description: service.tagline,
        url: `https://chameleon.services/services#${service.id}`,
        provider: {
          '@type': 'Organization',
          name: 'Chameleon Solutions',
        },
      },
    })),
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
            <span className="badge badge-teal">What We Offer</span>
            <div className="divider-teal" style={{ margin: '1.5rem 0' }} />
            <h1 className={styles.heroTitle}>
              Five ways we <span className="text-gradient">transform</span> your operations
            </h1>
            <p className={styles.heroSubtitle}>
              Every service we offer is designed for one purpose: making your business more efficient, 
              more intelligent, and more competitive — without complexity or disruption.
            </p>
            <div className={styles.heroNav}>
              {services.map((service) => (
                <a key={service.id} href={`#${service.id}`} className={styles.heroNavItem}>
                  <service.icon size={16} />
                  {service.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Service Detail Sections */}
      {services.map((service, idx) => (
        <section
          key={service.id}
          id={service.id}
          className={`${styles.serviceSection} ${idx % 2 !== 0 ? styles.alt : ''}`}
        >
          <div className="container">
            <div className={styles.serviceGrid}>
              <div className={styles.serviceMain}>
                <div className={styles.serviceHeader}>
                  <div className={styles.serviceIcon}>
                    <service.icon size={24} />
                  </div>
                  <div>
                    <h2 className={styles.serviceTitle}>{service.title}</h2>
                    <p className={styles.serviceTagline}>{service.tagline}</p>
                  </div>
                </div>
                <div className={styles.serviceDesc}>
                  {service.desc.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>

              <div className={styles.serviceSide}>
                <div className={styles.useCasesCard}>
                  <h3 className={styles.sideTitle}>Common Use Cases</h3>
                  <ul className={styles.useCasesList}>
                    {service.useCases.map((uc) => (
                      <li key={uc} className={styles.useCaseItem}>
                        <CheckCircle size={14} className={styles.checkIcon} />
                        {uc}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.outcomesCard}>
                  <h3 className={styles.sideTitle}>Typical Outcomes</h3>
                  {service.outcomes.map((outcome) => (
                    <div key={outcome.text} className={styles.outcomeItem}>
                      <outcome.icon size={16} className={styles.outcomeIcon} />
                      <span>{outcome.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.serviceCta}>
              <Link href="/contact" className="btn btn-primary" id={`service-cta-${service.id}`}>
                Discuss this service <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      ))}

      {/* SME Focus Banner */}
      <section className={styles.smeBanner}>
        <div className="container">
          <div className={styles.smeBannerInner}>
            <div>
              <h2 className={styles.smeTitle}>Built for SMEs, not enterprises</h2>
              <p className={styles.smeDesc}>
                Enterprise AI implementations take months, cost hundreds of thousands, and require dedicated 
                internal teams to maintain. We do things differently. Our solutions are scoped for SME 
                budgets, SME teams, and SME timelines — without compromising on quality or capability.
              </p>
            </div>
            <div className={styles.smeCtas}>
              <Link href="/contact" className="btn btn-primary btn-lg" id="sme-cta">
                Get Started <ArrowRight size={18} />
              </Link>
              <Link href="/articles" className="btn btn-outline btn-lg" id="sme-articles">
                Read Our Guides
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
