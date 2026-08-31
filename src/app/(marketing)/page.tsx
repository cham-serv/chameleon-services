import type { Metadata } from 'next';
import Link from 'next/link';
import { HeroTextCycler } from '@/components/marketing/HeroTextCycler';
import { ArrowRight, Zap, Brain, RefreshCw, Palette, Search, TrendingUp, Clock, Globe, PlayCircle, CheckCircle2, XCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Chameleon - The AI Authority Engine for South African Businesses',
  description:
    'Search has changed. Chameleon builds AI-ready, GEO-optimised websites and ecommerce authority engines that adapt to the new era of AI-powered search.',
};

const features = [
  {
    id: 'geo-optimised',
    icon: Brain,
    title: 'GEO Optimised',
    desc: 'Every page is structured for Generative Engine Optimisation - so AI search engines like ChatGPT, Perplexity  Google SGE can find, understand  quote your business.',
  },
  {
    id: 'ai-content',
    icon: Zap,
    title: 'AI-Powered Content',
    desc: 'Product listings, articles  meta content built with structured intelligence from day one. Not retrofitted - native.',
  },
  {
    id: 'beautiful-templates',
    icon: Palette,
    title: 'Beautiful Templates',
    desc: 'Professionally designed storefronts and business sites that look premium on day one, branded to your business, ready to launch.',
  },
  {
    id: 'always-updating',
    icon: RefreshCw,
    title: 'Always Updating',
    desc: 'AI and GEO move fast. Legacy platforms struggle to keep up. Chameleon evolves continuously - your site stays ahead without the costly upgrades.',
  },
];

const howItWorksSteps = [
  {
    step: '01',
    title: 'Choose a Template',
    desc: 'Browse our library of professionally designed templates. Each one is AI-ready, GEO-optimised  built for your industry.',
  },
  {
    step: '02',
    title: 'Customise Your Brand',
    desc: 'Add your logo, brand colours, fonts, products  content through a clean, intuitive admin panel. No code required.',
  },
  {
    step: '03',
    title: 'Go Live Today',
    desc: 'Connect your domain and launch. Your site is live, fast  already speaking the language of modern AI search engines.',
  },
];

const templates = [
  {
    id: 'atlas',
    name: 'Atlas',
    tagline: 'For heavy retail, industrial supply  mid-market B2B.',
    features: ['Ecommerce', 'Articles', 'FAQ', 'Cart & Checkout'],
    demoHref: 'https://atlas-demo.chameleon.services',
    gradient: 'linear-gradient(135deg, #7f1d1d 0%, #450a0a 60%, #1a0505 100%)',
  },
  {
    id: 'meridian',
    name: 'Meridian',
    tagline: 'Services & consulting, built to convert.',
    features: ['Services', 'Articles', 'Contact', 'Legal'],
    demoHref: 'https://meridian-demo.chameleon.services',
    gradient: 'linear-gradient(135deg, #1a1f2e 0%, #0d1117 100%)',
  },
];

const whyNowPoints = [
  {
    icon: Search,
    stat: '40%',
    label: 'of searches now return AI-generated answers',
    desc: 'If AI can\'t read your site, nearly half your potential customers will find a competitor instead.',
  },
  {
    icon: TrendingUp,
    stat: '62%',
    label: 'of users trust AI answers over organic results',
    desc: 'The goal isn\'t just to rank on Google anymore. It\'s to be the answer AI gives.',
  },
  {
    icon: Clock,
    stat: '18 months',
    label: 'behind - the average legacy CMS platform',
    desc: 'While you\'re paying to maintain WordPress, your competitors are already showing up in AI answers.',
  },
  {
    icon: Globe,
    stat: 'R0',
    label: 'in additional ad spend required',
    desc: 'This isn\'t paid advertising. It\'s earned visibility - built into the way your site is structured.',
  },
];

export default function HomePage() {
  return (
    <>
      {/* - Hero - */}
      <section
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          paddingTop: '96px',
          overflow: 'hidden',
        }}
      >
        {/* Background glows */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '15%',
            right: '10%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(129,140,248,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Hex grid pattern */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='52' viewBox='0 0 60 52'%3E%3Cpath d='M30 1 L59 17.5 L59 34.5 L30 51 L1 34.5 L1 17.5 Z' fill='none' stroke='rgba(255,255,255,0.025)' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 52px',
            opacity: 0.8,
            pointerEvents: 'none',
          }}
        />

        <div className="m-container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', paddingBlock: '80px' }}>
          {/* Badge */}
          <div className="m-animate-fade-up" style={{ marginBottom: '24px' }}>
            <span className="m-badge">
              <Zap size={11} />
              AI-ready websites for South Africa
            </span>
          </div>

          {/* Headline */}
          <h1
            className="m-animate-fade-up m-animate-delay-1"
            style={{
              fontFamily: 'var(--m-font-display)',
              fontSize: 'clamp(2.8rem, 7vw, 5rem)',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: 'var(--m-text)',
              margin: '0 0 20px',
            }}
          >
            Search has changed.
            <br />
            <span className="m-gradient-text">Your website needs to be</span>
          </h1>

          {/* Cycling text */}
          <div
            className="m-animate-fade-up m-animate-delay-2"
            style={{
              fontFamily: 'var(--m-font-display)',
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: '#60a5fa',
              minHeight: '1.2em',
              marginBottom: '32px',
            }}
          >
            <HeroTextCycler />
          </div>

          {/* Subtext */}
          <p
            className="m-animate-fade-up m-animate-delay-2"
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.15rem)',
              color: 'var(--m-text-muted)',
              maxWidth: '560px',
              margin: '0 auto 40px',
              lineHeight: 1.7,
            }}
          >
            Most South African businesses are still paying for a website that works the way the internet did in 2010. Chameleon replaces that with something built for how customers find you today - and tomorrow.
          </p>

          {/* CTAs */}
          <div
            className="m-animate-fade-up m-animate-delay-3"
            style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link
              href="/contact"
              className="m-btn m-btn-primary m-btn-lg"
              id="hero-cta-get-started"
            >
              Get Started
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/templates"
              className="m-btn m-btn-ghost m-btn-lg"
              id="hero-cta-templates"
            >
              View Templates
            </Link>
          </div>

          {/* Trust line */}
          <p
            className="m-animate-fade-up m-animate-delay-4"
            style={{ marginTop: '24px', fontSize: '0.8rem', color: 'var(--m-text-faint)' }}
          >
            South Africa-first platform. No hidden fees. Flexible or all-inclusive.
          </p>
        </div>
      </section>

      {/* - Section 1: What is this, exactly? - */}
      <section className="m-section" id="what-is-chameleon" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="m-container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 64px' }}>
            <span className="m-label">What is this, exactly?</span>
            <div className="m-divider" style={{ margin: '16px auto' }} />
            <h2
              style={{
                fontFamily: 'var(--m-font-display)',
                fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'var(--m-text)',
                margin: '0 0 16px',
              }}
            >
              Better result. Completely different model.
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--m-text-muted)', lineHeight: 1.7, margin: 0 }}>
              Your customers still get a beautiful, fast website. But instead of paying a developer every time something needs updating  juggling a hosting bill, a plugin subscription  a WordPress maintenance contract - you pay one flat monthly fee  we handle everything that sits behind it.
            </p>
          </div>

          {/* Explainer video — coming soon */}
          <div style={{ maxWidth: '800px', margin: '0 auto 64px', position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', background: 'linear-gradient(135deg, rgba(59,130,246,0.06) 0%, rgba(13,17,23,1) 100%)', aspectRatio: '16/9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
             <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='52' viewBox='0 0 60 52'%3E%3Cpath d='M30 1 L59 17.5 L59 34.5 L30 51 L1 34.5 L1 17.5 Z' fill='none' stroke='rgba(255,255,255,0.025)' stroke-width='1'/%3E%3C/svg%3E")`, backgroundSize: '60px 52px', pointerEvents: 'none' }} />
             <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '32px' }}>
               <div style={{ width: '56px', height: '56px', borderRadius: '50%', border: '1px solid rgba(59,130,246,0.3)', background: 'rgba(59,130,246,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                 <PlayCircle size={28} style={{ color: '#60a5fa', opacity: 0.7 }} />
               </div>
               <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--m-text)', marginBottom: '8px' }}>Explainer video coming soon</div>
               <div style={{ fontSize: '0.85rem', color: 'var(--m-text-faint)' }}>A short walkthrough of how Chameleon works — in plain language.</div>
             </div>
          </div>

          {/* Side-by-side comparison */}
          <div className="m-grid-2" style={{ gap: '24px' }}>
            <div className="m-card" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--m-font-display)', fontWeight: 700, color: 'var(--m-text)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                 <XCircle size={20} style={{ color: '#ef4444' }} />
                 The Old Way
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <li style={{ color: 'var(--m-text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>You hire a web developer (once, then again when things break)</li>
                <li style={{ color: 'var(--m-text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>You pay for hosting separately</li>
                <li style={{ color: 'var(--m-text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>You install WordPress plugins and hope they don&apos;t conflict</li>
                <li style={{ color: 'var(--m-text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>Google indexes your pages (if you&apos;re lucky)</li>
                <li style={{ color: 'var(--m-text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>You &quot;post content&quot; and hope someone sees it</li>
              </ul>
            </div>
            
            <div className="m-card" style={{ padding: '32px', border: '1px solid rgba(59,130,246,0.3)', background: 'linear-gradient(180deg, rgba(59,130,246,0.05) 0%, rgba(255,255,255,0.02) 100%)' }}>
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--m-font-display)', fontWeight: 700, color: 'var(--m-text)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                 <CheckCircle2 size={20} style={{ color: '#3b82f6' }} />
                 The Chameleon Way
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <li style={{ color: 'var(--m-text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>We set it up. It runs itself.</li>
                <li style={{ color: 'var(--m-text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>Hosting is included. Always.</li>
                <li style={{ color: 'var(--m-text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>No plugins. No updates. No security patches. Ever.</li>
                <li style={{ color: 'var(--m-text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>AI assistants (ChatGPT, Google, Perplexity) find your business and cite it in answers - automatically.</li>
                <li style={{ color: 'var(--m-text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>Your product data, pricing  FAQs are structured so AI engines can read and recommend them directly.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* - Section 2: The Bill Killer - */}
      <section className="m-section" id="bill-killer" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="m-container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 48px' }}>
             <h2 style={{ fontFamily: 'var(--m-font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--m-text)', margin: '0 0 16px' }}>
               Stop paying for problems Chameleon doesn&apos;t have.
             </h2>
          </div>
          
          <div className="m-card" style={{ maxWidth: '800px', margin: '0 auto', overflow: 'hidden' }}>
             <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
               <thead>
                 <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                   <th style={{ padding: '16px 24px', fontSize: '0.9rem', color: 'var(--m-text-muted)', fontWeight: 600 }}>What you&apos;re probably paying now</th>
                   <th style={{ padding: '16px 24px', fontSize: '0.9rem', color: 'var(--m-text)', fontWeight: 600 }}>With Chameleon</th>
                 </tr>
               </thead>
               <tbody style={{ fontSize: '0.95rem' }}>
                 {[
                   ['Web hosting (shared/VPS): R600–R1,500/mo', '✅ Included'],
                   ['WordPress maintenance & updates: R800–R2,500/mo', '✅ Included'],
                   ['Plugin subscriptions (Yoast, WooCommerce, etc.): R400–R1,200/mo', '✅ Included'],
                   ['SSL Certificate renewal: R200–R600/yr', '✅ Included'],
                   ['Developer call-out fees (when things break): R1,500–R5,000/incident', '✅ Included'],
                   ['SEO agency retainer to "fix" your site: R5,000–R15,000/mo', '✅ Built in from day one']
                 ].map((row, i) => (
                   <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                     <td style={{ padding: '16px 24px', color: 'var(--m-text-muted)' }}>{row[0]}</td>
                     <td style={{ padding: '16px 24px', color: '#60a5fa', fontWeight: 500 }}>{row[1]}</td>
                   </tr>
                 ))}
                 <tr style={{ background: 'rgba(59,130,246,0.05)' }}>
                   <td style={{ padding: '20px 24px', color: 'var(--m-text)', fontWeight: 700, fontSize: '1rem' }}>Typical monthly total: R8,000–R25,000+</td>
                   <td style={{ padding: '20px 24px', color: '#60a5fa', fontWeight: 700, fontSize: '1.1rem' }}>Chameleon: from R999/mo</td>
                 </tr>
               </tbody>
             </table>
          </div>
          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--m-text-faint)', marginTop: '16px' }}>
            Typical costs for a mid-market WordPress site. Your actual savings will vary.
          </p>
        </div>
      </section>

      {/* - Section 3: Staff & Workflow Savings - */}
      <section className="m-section" id="team-savings" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="m-container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 64px' }}>
            <h2 style={{ fontFamily: 'var(--m-font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--m-text)', margin: '0 0 16px' }}>
              Your team works on the business. Not the website.
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--m-text-muted)', lineHeight: 1.7, margin: 0 }}>
              The average South African SME spends between R8,000 and R20,000 per month across IT support, web maintenance  SEO retainers - for a website that still doesn&apos;t get found by AI search. Chameleon consolidates all of that into one predictable monthly fee.
            </p>
          </div>

          <div className="m-grid-2" style={{ gap: '24px' }}>
            <div className="m-card" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--m-text)', marginBottom: '20px' }}>Things you no longer need to pay for or manage:</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'start' }}><XCircle size={18} style={{ color: '#ef4444', flexShrink: 0, marginTop: '2px' }} /><span style={{ color: 'var(--m-text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>IT service provider for website issues</span></li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'start' }}><XCircle size={18} style={{ color: '#ef4444', flexShrink: 0, marginTop: '2px' }} /><span style={{ color: 'var(--m-text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>A developer on retainer for &quot;small fixes&quot;</span></li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'start' }}><XCircle size={18} style={{ color: '#ef4444', flexShrink: 0, marginTop: '2px' }} /><span style={{ color: 'var(--m-text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>Expensive SEO audits to fix what the platform got wrong</span></li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'start' }}><XCircle size={18} style={{ color: '#ef4444', flexShrink: 0, marginTop: '2px' }} /><span style={{ color: 'var(--m-text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>Hours of manual data entry to keep product info consistent across channels</span></li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'start' }}><XCircle size={18} style={{ color: '#ef4444', flexShrink: 0, marginTop: '2px' }} /><span style={{ color: 'var(--m-text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>Someone to update prices, descriptions  images every time something changes</span></li>
              </ul>
            </div>
            
            <div className="m-card" style={{ padding: '32px', border: '1px solid rgba(59,130,246,0.3)', background: 'linear-gradient(180deg, rgba(59,130,246,0.05) 0%, rgba(255,255,255,0.02) 100%)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--m-text)', marginBottom: '20px' }}>What this gives your team instead:</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'start' }}><CheckCircle2 size={18} style={{ color: '#3b82f6', flexShrink: 0, marginTop: '2px' }} /><span style={{ color: 'var(--m-text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>One clean admin panel - any staff member can update content, add products, change prices. No technical knowledge needed.</span></li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'start' }}><CheckCircle2 size={18} style={{ color: '#3b82f6', flexShrink: 0, marginTop: '2px' }} /><span style={{ color: 'var(--m-text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>AI-powered product descriptions drafted automatically (coming soon)</span></li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'start' }}><CheckCircle2 size={18} style={{ color: '#3b82f6', flexShrink: 0, marginTop: '2px' }} /><span style={{ color: 'var(--m-text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>Your marketing team focuses on strategy, not website maintenance</span></li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'start' }}><CheckCircle2 size={18} style={{ color: '#3b82f6', flexShrink: 0, marginTop: '2px' }} /><span style={{ color: 'var(--m-text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>Agencies: manage all your clients from a single dashboard - no more logging in and out of multiple accounts</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>



      {/* - Why Chameleon Teaser - */}
      <section className="m-section" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="m-container" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1rem', color: 'var(--m-text-muted)', maxWidth: '560px', margin: '0 auto 24px', lineHeight: 1.7 }}>
            Wondering how the numbers stack up against what you&apos;re paying now?
          </p>
          <Link href="/why-chameleon" className="m-btn m-btn-ghost" id="home-why-chameleon-link">
            See the full cost comparison
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* - How It Works - */}
      <section
        className="m-section"
        id="how-it-works"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="m-container">
          <div style={{ textAlign: 'center', maxWidth: '580px', margin: '0 auto 64px' }}>
            <span className="m-label">How it works</span>
            <div className="m-divider" style={{ margin: '16px auto' }} />
            <h2
              style={{
                fontFamily: 'var(--m-font-display)',
                fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'var(--m-text)',
                margin: '0 0 16px',
              }}
            >
              From zero to live in a day.
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--m-text-muted)', lineHeight: 1.7, margin: 0 }}>
              No developers. No agencies. No 6-month projects.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0',
              position: 'relative',
            }}
          >
            {/* Connector lines */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: '32px',
                left: 'calc(33.333% - 1px)',
                right: 'calc(33.333% - 1px)',
                height: '1px',
                background: 'linear-gradient(90deg, rgba(59,130,246,0.4), rgba(59,130,246,0.4))',
                pointerEvents: 'none',
              }}
            />

            {howItWorksSteps.map((step, idx) => (
              <div
                key={step.step}
                id={`step-${idx + 1}`}
                style={{ padding: '0 32px 0', textAlign: 'center', position: 'relative' }}
              >
                {/* Step number circle */}
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    border: '1px solid rgba(59,130,246,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    fontFamily: 'var(--m-font-display)',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: '#60a5fa',
                    position: 'relative',
                    zIndex: 1,
                    background: 'var(--m-bg)',
                  }}
                >
                  {step.step}
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--m-font-display)',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: 'var(--m-text)',
                    margin: '0 0 10px',
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--m-text-muted)', lineHeight: 1.6, margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* - Feature Pillars - */}
      <section className="m-section-sm" id="features" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="m-container">
          <div className="m-grid-4">
            {features.map((f) => (
              <div
                key={f.id}
                className="m-card"
                id={`feature-${f.id}`}
                style={{ padding: '28px 24px' }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: 'rgba(59,130,246,0.1)',
                    border: '1px solid rgba(59,130,246,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                    color: '#60a5fa',
                  }}
                >
                  <f.icon size={20} />
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--m-font-display)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'var(--m-text)',
                    margin: '0 0 8px',
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--m-text-muted)',
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* - Pricing Teaser - */}

      <section
        className="m-section"
        id="pricing-teaser"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="m-container" style={{ textAlign: 'center' }}>
          <span className="m-label">Pricing</span>
          <div className="m-divider" style={{ margin: '16px auto' }} />
          <h2
            style={{
              fontFamily: 'var(--m-font-display)',
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--m-text)',
              margin: '0 0 16px',
            }}
          >
            Two tracks. One platform.
          </h2>
          <p
            style={{
              fontSize: '0.95rem',
              color: 'var(--m-text-muted)',
              maxWidth: '500px',
              margin: '0 auto 48px',
              lineHeight: 1.7,
            }}
          >
            Direct plans for businesses, flat monthly scaling for agencies. No hidden fees.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '32px', maxWidth: '900px', margin: '0 auto 40px', alignItems: 'start' }}>
            {/* Track 1 */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--m-text-muted)', marginBottom: '16px' }}>
                For Businesses
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { name: 'Launch',       price: 'from R999',   href: '/pricing' },
                  { name: 'Professional', price: 'from R1,999', href: '/pricing' },
                  { name: 'Storefront',   price: 'from R2,999', href: '/pricing' },
                  { name: 'Commerce',     price: 'from R4,500', href: '/pricing' },
                ].map((tier) => (
                  <Link
                    key={tier.name}
                    href={tier.href}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.07)',
                      background: 'rgba(255,255,255,0.02)',
                      textDecoration: 'none',
                      transition: 'border-color 0.15s, background 0.15s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(59,130,246,0.3)'; (e.currentTarget as HTMLElement).style.background = 'rgba(59,130,246,0.04)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'; }}
                  >
                    <span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--m-text-muted)' }}>
                      {tier.name}
                    </span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--m-text-muted)' }}>
                      {tier.price}<span style={{ fontWeight: 400, fontSize: '0.75rem' }}>/mo</span>
                    </span>
                  </Link>
                ))}
              </div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '28px', gap: '8px' }}>
              <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.08)' }} />
              <span style={{ fontSize: '0.7rem', color: 'var(--m-text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>or</span>
              <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.08)' }} />
            </div>

            {/* Track 2 */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--m-text-muted)', marginBottom: '16px' }}>
                For Agencies
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { name: 'Bronze', clients: '1-2 clients',  price: 'R2,500', href: '/agencies' },
                  { name: 'Silver', clients: '3-9 clients',  price: 'R4,500', href: '/agencies' },
                  { name: 'Gold',   clients: '10+ clients',  price: 'Free',   href: '/agencies' },
                ].map((tier) => (
                  <Link
                    key={tier.name}
                    href={tier.href}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.07)',
                      background: 'rgba(255,255,255,0.02)',
                      textDecoration: 'none',
                      transition: 'border-color 0.15s, background 0.15s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(59,130,246,0.3)'; (e.currentTarget as HTMLElement).style.background = 'rgba(59,130,246,0.04)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'; }}
                  >
                    <div style={{ textAlign: 'left' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--m-text-muted)', display: 'block' }}>
                        {tier.name}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--m-text-faint)' }}>{tier.clients}</span>
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--m-text-muted)' }}>
                      {tier.price}<span style={{ fontWeight: 400, fontSize: '0.75rem' }}>/mo</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link href="/pricing" className="m-btn m-btn-primary m-btn-lg" id="home-see-pricing">
            See full pricing
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>


      {/* - Final CTA - */}
      <section className="m-section" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div
          className="m-container-sm"
          style={{
            textAlign: 'center',
            padding: '64px 24px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(129,140,248,0.06) 100%)',
            border: '1px solid rgba(59,130,246,0.2)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Glow */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '500px',
              height: '300px',
              borderRadius: '50%',
              background: 'radial-gradient(ellipse, rgba(59,130,246,0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          <div style={{ position: 'relative' }}>
            <h2
              style={{
                fontFamily: 'var(--m-font-display)',
                fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'var(--m-text)',
                margin: '0 0 16px',
              }}
            >
              Ready to adapt?
            </h2>
            <p
              style={{
                fontSize: '1rem',
                color: 'var(--m-text-muted)',
                maxWidth: '400px',
                margin: '0 auto 32px',
                lineHeight: 1.7,
              }}
            >
              Join South African businesses already using Chameleon to stay visible
              in the AI era.
            </p>
            <Link href="/contact" className="m-btn m-btn-primary m-btn-lg" id="final-cta-get-started">
              Get Started
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
