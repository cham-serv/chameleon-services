import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, Clock, Calendar } from 'lucide-react'
import { getAllArticles, formatDate } from '@/lib/articles'
import styles from './articles.module.css'

export const metadata: Metadata = {
  title: 'Articles & Insights',
  description:
    'Practical guides, explainers, and insights on AI automation, process optimisation, and intelligent solutions for SMEs.',
}

const categories = ['All', 'AI Automation', 'Process Optimisation', 'SME Tech Guides', 'Case Studies']

export default async function ArticlesPage() {
  const articles = await getAllArticles()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Chameleon Solutions Articles & Insights',
    url: 'https://chameleon.services/articles',
    description:
      'Practical guides and insights on AI automation, process optimisation, and intelligent solutions for small and medium enterprises.',
    publisher: {
      '@type': 'Organization',
      name: 'Chameleon Solutions',
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
            <span className="badge badge-teal">Knowledge Hub</span>
            <div className="divider-teal" style={{ margin: '1.5rem 0' }} />
            <h1 className={styles.heroTitle}>
              Practical insights for the <span className="text-gradient">AI-ready business</span>
            </h1>
            <p className={styles.heroSubtitle}>
              No hype. No jargon. Just clear, actionable guides to help you understand, evaluate, 
              and implement AI and process improvements in your business.
            </p>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="section">
        <div className="container">
          {articles.length === 0 ? (
            <div className={styles.empty}>
              <p>Articles coming soon. Check back shortly.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {articles.map((article, idx) => (
                <Link
                  key={article.slug}
                  href={`/articles/${article.slug}`}
                  className={`${styles.articleCard} ${idx === 0 ? styles.featured : ''}`}
                  id={`article-card-${article.slug}`}
                >
                  <div className={styles.cardTop}>
                    <span className="badge badge-teal">{article.category}</span>
                    {idx === 0 && (
                      <span className="badge badge-navy">Featured</span>
                    )}
                  </div>

                  <h2 className={styles.cardTitle}>{article.title}</h2>
                  <p className={styles.cardDesc}>{article.description}</p>

                  <div className={styles.cardMeta}>
                    <div className={styles.metaItem}>
                      <Clock size={12} />
                      {article.readTime} min read
                    </div>
                    <div className={styles.metaItem}>
                      <Calendar size={12} />
                      {formatDate(article.date)}
                    </div>
                  </div>

                  <span className={styles.readMore}>
                    Read article <ChevronRight size={14} />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* GEO Banner */}
      <section className={styles.geoBanner}>
        <div className="container">
          <div className={styles.geoInner}>
            <h2 className={styles.geoTitle}>Can&apos;t find what you&apos;re looking for?</h2>
            <p className={styles.geoDesc}>
              Our team of AI and process consultants can answer your specific questions directly. 
              Get in touch and we&apos;ll point you in the right direction.
            </p>
            <Link href="/contact" className="btn btn-primary" id="articles-contact-cta">
              Ask Our Team <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
