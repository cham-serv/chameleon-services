import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: {
    default: 'Chameleon Solutions | AI & Process Automation for SMEs',
    template: '%s | Chameleon Solutions',
  },
  description:
    'Chameleon Solutions helps small and medium enterprises streamline operations through custom AI solutions, workflow automation, and intelligent process design.',
  keywords: [
    'AI automation',
    'process consulting',
    'SME AI solutions',
    'workflow automation',
    'custom AI integrations',
    'business process optimisation',
  ],
  authors: [{ name: 'Chameleon Solutions' }],
  creator: 'Chameleon Solutions',
  metadataBase: new URL('https://chameleon.services'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://chameleon.services',
    siteName: 'Chameleon Solutions',
    title: 'Chameleon Solutions | AI & Process Automation for SMEs',
    description:
      'Custom AI solutions and process automation for small and medium enterprises. Adapt, transform, and grow with Chameleon.',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 800,
        alt: 'Chameleon Solutions — AI & Process Automation for SMEs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chameleon Solutions | AI & Process Automation for SMEs',
    description:
      'Custom AI solutions and process automation for small and medium enterprises.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-GB" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <script
          defer
          data-domain="chameleon.services"
          src="https://plausible.io/js/script.js"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Chameleon Solutions',
              url: 'https://chameleon.services',
              logo: {
                '@type': 'ImageObject',
                url: 'https://chameleon.services/logo.png',
                width: 800,
                height: 800,
              },
              description:
                'AI and process consulting company specialising in automation and intelligent solutions for small and medium enterprises.',
              sameAs: [],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                email: 'hello@chameleon.services',
              },
              areaServed: 'Worldwide',
              serviceType: [
                'AI Workflow Automation',
                'Custom AI Integrations',
                'Process Audits & Optimisation',
                'Custom Software Modules',
                'AI Chatbots & Agents',
              ],
            }).replace(/</g, '\\u003c'),
          }}
        />
      </head>
      <body>
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
