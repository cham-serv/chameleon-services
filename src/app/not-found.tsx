import Link from 'next/link'
import { ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--gradient-hero)',
        overflow: 'hidden',
        padding: 'calc(var(--navbar-height) + var(--space-16)) 0 var(--space-24)',
        textAlign: 'center',
      }}
    >
      <div className="container" style={{ maxWidth: 560 }}>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(6rem, 15vw, 10rem)',
            fontWeight: 800,
            color: 'rgba(0,229,255,0.12)',
            lineHeight: 1,
            letterSpacing: '-0.04em',
            marginBottom: 'var(--space-4)',
          }}
        >
          404
        </div>
        <h1
          style={{
            fontSize: 'var(--text-3xl)',
            color: '#ffffff',
            marginBottom: 'var(--space-4)',
            fontFamily: 'var(--font-display)',
          }}
        >
          Page not found
        </h1>
        <p
          style={{
            fontSize: 'var(--text-lg)',
            color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.7,
            marginBottom: 'var(--space-8)',
          }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-4)',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Link href="/" className="btn btn-primary btn-lg" id="404-home">
            <Home size={18} />
            Back to Home
          </Link>
          <Link href="/contact" className="btn btn-outline btn-lg" id="404-contact">
            <ArrowLeft size={18} />
            Get in Touch
          </Link>
        </div>
      </div>
    </section>
  )
}
