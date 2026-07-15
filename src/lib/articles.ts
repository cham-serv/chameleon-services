import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const articlesDirectory = path.join(process.cwd(), 'src', 'content', 'articles')

export type Article = {
  slug: string
  title: string
  description: string
  date: string
  category: string
  tags: string[]
  readTime: number
  author: string
  faq?: { question: string; answer: string }[]
  mentions?: { '@type': string; name: string }[]
}

export type ArticleWithContent = Article & {
  content: string
}

export async function getAllArticles(): Promise<Article[]> {
  if (!fs.existsSync(articlesDirectory)) return []

  const fileNames = fs.readdirSync(articlesDirectory).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))

  const articles = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.(mdx|md)$/, '')
    const fullPath = path.join(articlesDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data } = matter(fileContents)

    return {
      slug,
      title: data.title ?? '',
      description: data.description ?? '',
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      category: data.category ?? 'General',
      tags: data.tags ?? [],
      readTime: data.readTime ?? 5,
      author: data.author ?? 'Chameleon Solutions',
      faq: data.faq,
      mentions: data.mentions,
    } as Article
  })

  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getArticleBySlug(slug: string): Promise<ArticleWithContent | null> {
  const mdxPath = path.join(articlesDirectory, `${slug}.mdx`)
  const mdPath = path.join(articlesDirectory, `${slug}.md`)
  const fullPath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null

  if (!fullPath) return null

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug,
    title: data.title ?? '',
    description: data.description ?? '',
    date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    category: data.category ?? 'General',
    tags: data.tags ?? [],
    readTime: data.readTime ?? 5,
    author: data.author ?? 'Chameleon Solutions',
    faq: data.faq,
    mentions: data.mentions,
    content,
  }
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
