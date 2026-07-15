import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Zap, GitMerge, BarChart3, Bot, Puzzle, CheckCircle, ChevronRight } from 'lucide-react'
import styles from './page.module.css'
import { getAllArticles } from '@/lib/articles'

export const metadata: Metadata = {
  title: 'Chameleon Solutions | AI & Process Automation for SMEs',
  description:
    'Custom AI solutions and process automation for small and medium enterprises. Workflow automation, AI integrations, chatbots and more.',
}

const services = [
  {
    id: 'ai-workflow-automation',
    icon: Zap,
    title: 'AI Workflow Automation',
    desc: 'Eliminate repetitive manual tasks. We design intelligent automation pipelines that free your team to focus on work that truly matters.',
  },
  {
    id: 'custom-ai-integrations',
    icon: GitMerge,
    title: 'Custom AI Integrations',
    desc: 'Connect AI capabilities directly into your CRM, ERP, or existing tools — no rip-and-replace required, just seamless enhancement.',
  },
  {
    id: 'process-audits',
    icon: BarChart3,
    title: 'Process Audits & Optimisation',
    desc: 'We map your current workflows, identify the friction points, and design leaner, smarter systems built for scale.',
  },
  {
    id: 'custom-software',
    icon: Puzzle,
    title: 'Custom Software Modules',
    desc: 'Bespoke components and modules built around your exact needs — not off-the-shelf compromises that never quite fit.',
  },
  {
    id: 'ai-chatbots',
    icon: Bot,
    title: 'AI Chatbots & Agents',
    desc: 'Deploy intelligent conversational agents for customer support, internal knowledge management, or lead qualification — 24/7.',
  },
]

const stats = [
  { value: '50+', label: 'Processes Automated' },
  { value: '30+', label: 'SME Clients Served' },
  { value: '60%', label: 'Average Time Saved' },
  { value: '4.9★', label: 'Client Satisfaction' },
]

const steps = [
  {
    step: '01',
    title: 'Assess',
    desc: 'We start by deeply understanding your business — your goals, your team, and where the friction lives.',
  },
  {
    step: '02',
    title: 'Design',
    desc: 'We craft a tailored solution architecture: the right AI tools, integrations, and workflows for your context.',
  },
  {
    step: '03',
    title: 'Deploy',
    desc: 'We implement, test, and train your team. Then we stay on hand to refine and scale as you grow.',
  },
]

export default async function HomePage() {
  const articles = await getAllArticles()
  const latestArticles = articles.slice(0, 3)

  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <div className={styles.heroMesh1} />
          <div className={styles.heroMesh2} />
          <div className={styles.heroMesh3} />
          <div className={styles.heroGrid} />
        </div>

        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroBadge}>
            <span className="badge badge-teal">
              <Zap size={10} />
              AI &amp; Process Solutions for SMEs
            </span>
          </div>

          <h1 className={styles.heroTitle}>
            Your business,{' '}
            <span className="text-gradient">supercharged</span>{' '}
            by AI.
          </h1>

          <p className={styles.heroSubtitle}>
            We help small and medium enterprises eliminate manual bottlenecks, integrate intelligent automation, 
            and build custom AI solutions — all without disrupting the way your team works.
          </p>

          <div className={styles.heroCtas}>
            <Link href="/services" className="btn btn-primary btn-lg" id="hero-cta-services">
              Explore Our Services
              <ArrowRight size={18} />
            </Link>
            <Link href="/contact" className="btn btn-outline btn-lg" id="hero-cta-contact">
              Book a Discovery Call
            </Link>
          </div>

          <div className={styles.heroTrust}>
            <CheckCircle size={14} className={styles.trustIcon} />
            <span>No long-term contracts. No jargon. Just results.</span>
          </div>
        </div>

        <div className={styles.heroLogoFloat}>
          <Image
            src="/logo.png"
            alt="Chameleon Solutions"
            width={220}
            height={220}
            className={styles.floatingLogo}
            priority
          />
        </div>
      </section>

      {/* Stats Bar */}
      <section className={styles.statsBar}>
        <div className="container">
          <div className={styles.statsGrid}>
            {stats.map((stat) => (
              <div key={stat.label} className={styles.statItem}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section" id="services">
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="badge badge-navy">What We Do</span>
            <div className="divider-teal" />
            <h2 className={styles.sectionTitle}>
              Intelligence built around your business
            </h2>
            <p className={styles.sectionSubtitle}>
              We don&apos;t believe in one-size-fits-all. Every solution we build is designed around your specific 
              processes, team, and growth goals.
            </p>
          </div>

          <div className={styles.servicesGrid}>
            {services.map((service) => (
              <Link
                key={service.id}
                href={`/services#${service.id}`}
                className={styles.serviceCard}
                id={`service-card-${service.id}`}
              >
                <div className={styles.serviceIcon}>
                  <service.icon size={22} />
                </div>
                <h3 className={styles.serviceTitle}>{service.title}</h3>
                <p className={styles.serviceDesc}>{service.desc}</p>
                <span className={styles.serviceArrow}>
                  Learn more <ChevronRight size={14} />
                </span>
              </Link>
            ))}
          </div>

          <div className={styles.servicesCta}>
            <Link href="/services" className="btn btn-primary" id="services-view-all">
              View All Services
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className={`section section-dark ${styles.howSection}`}>
        <div className={styles.howBg} />
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="badge badge-teal">Our Process</span>
            <div className="divider-teal" />
            <h2 className={`${styles.sectionTitle} text-white`}>
              Simple process. Lasting impact.
            </h2>
            <p className={`${styles.sectionSubtitle} text-muted`}>
              From first conversation to live system, we keep things transparent, 
              collaborative, and focused on your outcomes.
            </p>
          </div>

          <div className={styles.stepsGrid}>
            {steps.map((step, idx) => (
              <div key={step.step} className={styles.stepCard}>
                <div className={styles.stepNumber}>{step.step}</div>
                {idx < steps.length - 1 && <div className={styles.stepConnector} />}
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Section */}
      {latestArticles.length > 0 && (
        <section className="section" id="articles">
          <div className="container">
            <div className={styles.sectionHeader}>
              <span className="badge badge-navy">Knowledge Hub</span>
              <div className="divider-teal" />
              <h2 className={styles.sectionTitle}>
                Insights to help your business grow
              </h2>
              <p className={styles.sectionSubtitle}>
                Practical guides, case studies, and explainers on AI and process transformation for SMEs.
              </p>
            </div>

            <div className="grid-3">
              {latestArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/articles/${article.slug}`}
                  className={styles.articleCard}
                  id={`home-article-${article.slug}`}
                >
                  <div className={styles.articleMeta}>
                    <span className="badge badge-teal">{article.category}</span>
                    <span className={styles.articleReadTime}>{article.readTime} min read</span>
                  </div>
                  <h3 className={styles.articleTitle}>{article.title}</h3>
                  <p className={styles.articleDesc}>{article.description}</p>
                  <span className={styles.articleLink}>
                    Read article <ChevronRight size={14} />
                  </span>
                </Link>
              ))}
            </div>

            <div className={styles.servicesCta}>
              <Link href="/articles" className="btn btn-outline" id="articles-view-all">
                Browse All Articles
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Chameleon Philosophy */}
      <section className={`section ${styles.philosophySection}`}>
        <div className="container">
          <div className={styles.philosophyInner}>
            <div className={styles.philosophyText}>
              <span className="badge badge-teal">Why Chameleon?</span>
              <div className="divider-teal" />
              <h2 className={styles.sectionTitle} style={{ color: '#ffffff' }}>
                Adapt. Transform. Thrive.
              </h2>
              <p className={styles.philosophyDesc}>
                A chameleon doesn&apos;t change what it is — it adapts to its environment while remaining perfectly 
                itself. That&apos;s our philosophy for AI adoption: we integrate intelligence seamlessly into 
                your existing world, without disruption, without friction.
              </p>
              <p className={styles.philosophyDesc}>
                Just like a chameleon&apos;s eyes can see in multiple directions simultaneously, our AI solutions 
                analyse your processes from every angle — finding efficiencies you never knew existed.
              </p>
              <Link href="/about" className="btn btn-primary" id="philosophy-about-link">
                Our Story
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className={styles.philosophyLogo}>
              <div className={styles.philosophyGlow} />
              <Image
                src="/logo.png"
                alt="Chameleon Solutions"
                width={300}
                height={300}
                className={styles.philosophyImg}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
