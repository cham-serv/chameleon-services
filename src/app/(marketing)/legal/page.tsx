import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Legal & Disclaimers',
  description: 'Legal information and disclaimers for Chameleon Image Consultants CC — intellectual property, trademarks, and ownership.',
};

export default function LegalPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section
        className="m-section"
        style={{
          paddingTop: '140px',
          paddingBottom: '48px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="m-container" style={{ maxWidth: '800px' }}>
          <p className="m-label" style={{ marginBottom: '16px' }}>Legal</p>
          <h1
            style={{
              fontFamily: 'var(--m-font-display)',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 700,
              lineHeight: 1.15,
              color: 'var(--m-text)',
              marginBottom: '20px',
            }}
          >
            Legal &amp; Disclaimers
          </h1>
          <p
            style={{
              fontSize: '1.125rem',
              color: 'var(--m-text-muted)',
              lineHeight: 1.7,
              maxWidth: '620px',
            }}
          >
            Important legal information regarding ownership, trademarks,
            and the use of the Chameleon platform.
          </p>
        </div>
      </section>

      {/* ── Body ──────────────────────────────────────────────── */}
      <section className="m-section" style={{ paddingTop: '64px' }}>
        <div className="m-container" style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

          {/* Entity block */}
          <div className="m-card" style={{ padding: '32px' }}>
            <h2
              style={{
                fontFamily: 'var(--m-font-display)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--m-text)',
                marginBottom: '16px',
              }}
            >
              Intellectual Property &amp; Ownership
            </h2>
            <p style={{ color: 'var(--m-text-muted)', lineHeight: 1.8, marginBottom: '16px' }}>
              All content, concepts, code, architecture, trademarks, logos, and related works
              comprising the <strong style={{ color: 'var(--m-text)' }}>Chameleon</strong> platform
              are the exclusive intellectual property of{' '}
              <strong style={{ color: 'var(--m-text)' }}>Chameleon Image Consultants CC</strong>.
            </p>
            <div
              style={{
                background: 'rgba(59,130,246,0.06)',
                border: '1px solid rgba(59,130,246,0.2)',
                borderRadius: '8px',
                padding: '16px 20px',
                fontSize: '0.9rem',
                color: 'var(--m-text-muted)',
                lineHeight: 1.8,
              }}
            >
              <strong style={{ color: 'var(--m-accent-light)' }}>Registered Enterprise</strong><br />
              Enterprise Name: <strong style={{ color: 'var(--m-text)' }}>CHAMELEON IMAGE CONSULTANTS</strong><br />
              Enterprise Number: <strong style={{ color: 'var(--m-text)' }}>B1995017461</strong><br />
              Enterprise Type: <strong style={{ color: 'var(--m-text)' }}>Close Corporation</strong><br />
              Status: <strong style={{ color: '#22c55e' }}>In Business</strong>
            </div>
          </div>

          {/* Copyright */}
          <div className="m-card" style={{ padding: '32px' }}>
            <h2
              style={{
                fontFamily: 'var(--m-font-display)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--m-text)',
                marginBottom: '16px',
              }}
            >
              Copyright &amp; Trademarks
            </h2>
            <p style={{ color: 'var(--m-text-muted)', lineHeight: 1.8 }}>
              The concept of Chameleon, the underlying code, the name, and all associated branding
              and designs are entirely owned by Chameleon Image Consultants CC. Any unauthorized
              reproduction, distribution, modification, or use of these materials without express
              written consent from the owner is strictly prohibited.
            </p>
          </div>

          {/* No transfer */}
          <div className="m-card" style={{ padding: '32px' }}>
            <h2
              style={{
                fontFamily: 'var(--m-font-display)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--m-text)',
                marginBottom: '16px',
              }}
            >
              No Transfer of Rights
            </h2>
            <p style={{ color: 'var(--m-text-muted)', lineHeight: 1.8 }}>
              The use of the Chameleon platform or services does not grant, convey, or transfer any
              ownership rights, intellectual property rights, or licenses to the underlying code,
              concepts, or branding to any user, client, or third party. Chameleon Image Consultants
              CC retains full and absolute ownership of the entire system.
            </p>
          </div>

          {/* Liability */}
          <div className="m-card" style={{ padding: '32px' }}>
            <h2
              style={{
                fontFamily: 'var(--m-font-display)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--m-text)',
                marginBottom: '16px',
              }}
            >
              Disclaimer of Liability
            </h2>
            <p style={{ color: 'var(--m-text-muted)', lineHeight: 1.8 }}>
              The information provided on this website and through the Chameleon platform is for
              general informational purposes only. While we strive to provide a secure and
              high-performance platform, Chameleon Image Consultants CC shall not be held liable for
              any indirect, incidental, special, consequential, or punitive damages arising out of
              the use or inability to use the platform.
            </p>
          </div>

          {/* Back link */}
          <div style={{ paddingBottom: '32px' }}>
            <Link href="/" className="m-btn m-btn-ghost">
              ← Return to Home
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}
