import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Clock, Calendar, ArrowLeft, Tag } from 'lucide-react'
import { getAllArticles, getArticleBySlug, formatDate } from '@/lib/articles'
import styles from './article.module.css'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const articles = await getAllArticles()
  return articles.map((article) => ({ slug: article.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return {}

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.date,
      authors: [article.author],
      tags: article.tags,
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) notFound()

  const { default: Content } = await import(`@/content/articles/${slug}.mdx`).catch(() => ({
    default: () => (
      <div className={styles.prose} dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br/>') }} />
    ),
  }))

  const jsonLd: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.description,
      datePublished: article.date,
      dateModified: article.date,
      author: {
        '@type': 'Organization',
        name: article.author,
        url: 'https://chameleon.services',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Chameleon Solutions',
        url: 'https://chameleon.services',
        logo: {
          '@type': 'ImageObject',
          url: 'https://chameleon.services/logo.png',
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://chameleon.services/articles/${slug}`,
      },
      ...(article.mentions ? { mentions: article.mentions } : {}),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://chameleon.services' },
        { '@type': 'ListItem', position: 2, name: 'Articles', item: 'https://chameleon.services/articles' },
        { '@type': 'ListItem', position: 3, name: article.title, item: `https://chameleon.services/articles/${slug}` },
      ],
    },
    ...(article.faq && article.faq.length > 0
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: article.faq.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          },
        ]
      : []),
  ]

  return (
    <>
      {jsonLd.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
        />
      ))}

      <article>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroBg} />
          <div className="container">
            {/* Breadcrumb */}
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
              <Link href="/articles" className={styles.backLink}>
                <ArrowLeft size={14} />
                Back to Articles
              </Link>
            </nav>

            <div className={styles.heroContent}>
              <div className={styles.heroMeta}>
                <span className="badge badge-teal">{article.category}</span>
                {article.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="badge badge-navy">
                    <Tag size={9} />
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className={styles.heroTitle}>{article.title}</h1>
              <p className={styles.heroDesc}>{article.description}</p>

              <div className={styles.metaRow}>
                <div className={styles.metaItem}>
                  <Calendar size={13} />
                  {formatDate(article.date)}
                </div>
                <div className={styles.metaDivider} />
                <div className={styles.metaItem}>
                  <Clock size={13} />
                  {article.readTime} min read
                </div>
                <div className={styles.metaDivider} />
                <div className={styles.metaItem}>
                  By {article.author}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className={styles.contentSection}>
          <div className="container">
            <div className={styles.contentLayout}>
              <div className={`${styles.prose} prose`}>
                <Content />
              </div>

              {/* Sidebar */}
              <aside className={styles.sidebar}>
                {article.faq && article.faq.length > 0 && (
                  <div className={styles.sideCard}>
                    <h3 className={styles.sideTitle}>FAQ</h3>
                    {article.faq.map((item) => (
                      <details key={item.question} className={styles.faqItem}>
                        <summary className={styles.faqQuestion}>{item.question}</summary>
                        <p className={styles.faqAnswer}>{item.answer}</p>
                      </details>
                    ))}
                  </div>
                )}

                <div className={styles.sideCard}>
                  <h3 className={styles.sideTitle}>Get Expert Help</h3>
                  <p className={styles.sideDesc}>
                    Ready to implement AI in your business? Let&apos;s talk about your specific situation.
                  </p>
                  <Link href="/contact" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} id="article-sidebar-cta">
                    Book a Discovery Call
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </article>
    </>
  )
}
