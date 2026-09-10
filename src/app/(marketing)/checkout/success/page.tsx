'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Clock, Mail, Loader2 } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--m-bg)',
        color: 'var(--m-text)',
        fontFamily: 'var(--m-font-body)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div style={{ maxWidth: '520px', width: '100%', textAlign: 'center' }}>

        {/* Icon */}
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'rgba(34,197,94,0.12)',
            border: '1px solid rgba(34,197,94,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}
        >
          <CheckCircle2 size={36} style={{ color: '#22c55e' }} />
        </div>

        <h1
          style={{
            fontFamily: 'var(--m-font-display)',
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--m-text)',
            margin: '0 0 12px',
          }}
        >
          Payment received
        </h1>

        <p
          style={{
            color: 'var(--m-text-muted)',
            lineHeight: 1.7,
            marginBottom: '32px',
            fontSize: '0.95rem',
          }}
        >
          Your Chameleon site is being set up now. You'll receive a welcome email
          within a few minutes with your admin login details.
        </p>

        {/* Steps */}
        <div
          style={{
            background: 'var(--m-bg-elevated)',
            border: '1px solid var(--m-border)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '32px',
            textAlign: 'left',
          }}
        >
          <h2 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--m-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
            What happens next
          </h2>

          <Step
            icon={<CheckCircle2 size={18} style={{ color: '#22c55e' }} />}
            title="Payment confirmed"
            description="Your payment has been processed by Paystack."
            done
          />
          <Step
            icon={<Clock size={18} style={{ color: '#60a5fa' }} />}
            title="Site provisioning"
            description="We're creating your CMS, user account, and site — takes about 30 seconds."
          />
          <Step
            icon={<Mail size={18} style={{ color: '#60a5fa' }} />}
            title="Welcome email"
            description="You'll receive your admin login link and temporary password by email."
          />
        </div>

        {/* Reference */}
        {reference && (
          <p style={{ fontSize: '0.75rem', color: 'var(--m-text-faint)', marginBottom: '24px' }}>
            Payment reference: <code style={{ color: 'var(--m-text-muted)' }}>{reference}</code>
          </p>
        )}

        {/* Back to home */}
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '8px',
            border: '1px solid var(--m-border)',
            color: 'var(--m-text-muted)',
            textDecoration: 'none',
            fontSize: '0.9rem',
            transition: 'border-color 0.15s, color 0.15s',
          }}
        >
          Back to Chameleon home
        </Link>

        <p style={{ marginTop: '24px', fontSize: '0.8rem', color: 'var(--m-text-faint)', lineHeight: 1.6 }}>
          Having trouble? Email us at{' '}
          <a href="mailto:support@chameleon.services" style={{ color: 'var(--m-text-muted)' }}>
            support@chameleon.services
          </a>
        </p>
      </div>
    </div>
  );
}

function Step({
  icon,
  title,
  description,
  done = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  done?: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '14px',
        paddingBottom: '16px',
        marginBottom: '16px',
        borderBottom: '1px solid var(--m-border)',
      }}
    >
      <div style={{ flexShrink: 0, marginTop: '2px' }}>{icon}</div>
      <div>
        <div
          style={{
            fontSize: '0.9rem',
            fontWeight: 600,
            color: done ? '#22c55e' : 'var(--m-text)',
            marginBottom: '4px',
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: '0.82rem', color: 'var(--m-text-muted)', lineHeight: 1.5 }}>
          {description}
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--m-bg)',
          }}
        >
          <Loader2 size={32} style={{ color: 'var(--m-text-muted)' }} />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
