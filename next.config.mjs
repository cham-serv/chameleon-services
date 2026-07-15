import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
}

const withMDX = createMDX({
  options: {
    // Use string names for Turbopack compatibility
    remarkPlugins: ['remark-gfm', 'remark-frontmatter'],
    rehypePlugins: ['rehype-slug', 'rehype-autolink-headings'],
  },
})

export default withMDX(nextConfig)
