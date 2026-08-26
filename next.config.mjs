import createMDX from '@next/mdx'

// Build cache bust: 2026-08-25T11:36
/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [
      // Cloudflare R2 public bucket (production media storage)
      { protocol: 'https', hostname: '*.r2.dev' },
      // Railway engine (serves media directly in some configurations)
      { protocol: 'https', hostname: '*.up.railway.app' },
      // Local development (Payload serves media from localhost)
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
}

const withMDX = createMDX({
  options: {
    // Use string names for Turbopack compatibility
    remarkPlugins: ['remark-gfm', 'remark-frontmatter'],
    rehypePlugins: ['rehype-slug', 'rehype-autolink-headings'],
  },
})

export default withMDX(nextConfig)
