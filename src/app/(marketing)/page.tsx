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
              The same result. A completely different model.
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--m-text-muted)', lineHeight: 1.7, margin: 0 }}>
              Your customers still get a beautiful, fast website. But instead of paying a developer every time something needs updating  juggling a hosting bill, a plugin subscription  a WordPress maintenance contract - you pay one flat monthly fee  we handle everything that sits behind it.
            </p>
          </div>

          {/* Video Placeholder */}
          <div style={{ maxWidth: '800px', margin: '0 auto 64px', position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', background: '#0a0a0a', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
             <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(10,10,10,1) 100%)', opacity: 0.5 }}></div>
             <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
               <PlayCircle size={64} style={{ color: '#60a5fa', margin: '0 auto 16px', opacity: 0.9 }} />
               <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white' }}>See the difference (1:30)</div>
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

      {/* - Section 3.5: Setup Costs - */}
      <section className="m-section" id="setup-costs" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="m-container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 64px' }}>
            <h2 style={{ fontFamily: 'var(--m-font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--m-text)', margin: '0 0 16px' }}>
              Thinking of building a new website?
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--m-text-muted)', lineHeight: 1.7, margin: 0 }}>
              Traditional web builds are expensive, slow and hard to update. We replaced the 3-month agency build with a fast, predictable setup.
            </p>
          </div>

          <div className="m-card" style={{ maxWidth: '900px', margin: '0 auto 32px', overflow: 'hidden' }}>
             <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
               <thead>
                 <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                   <th style={{ padding: '24px', fontSize: '0.95rem', color: 'var(--m-text-muted)', fontWeight: 600, width: '50%', borderRight: '1px solid rgba(255,255,255,0.04)' }}>The Traditional Agency Build</th>
                   <th style={{ padding: '24px', fontSize: '0.95rem', color: 'var(--m-text)', fontWeight: 600, width: '50%' }}>The Chameleon Setup</th>
                 </tr>
               </thead>
               <tbody style={{ fontSize: '0.95rem' }}>
                 <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                   <td style={{ padding: '24px', borderRight: '1px solid rgba(255,255,255,0.04)' }}>
                     <div style={{ color: 'var(--m-text)', fontWeight: 600, marginBottom: '4px' }}>High-Performance Custom Build</div>
                     <div style={{ color: '#ef4444', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>R40,000 - R80,000</div>
                     <div style={{ color: 'var(--m-text-faint)', fontSize: '0.85rem' }}>Bespoke UI, fast loading, SEO architecture</div>
                   </td>
                   <td style={{ padding: '24px' }}>
                     <div style={{ color: '#60a5fa', fontWeight: 600, marginBottom: '4px' }}>Launch Tier</div>
                     <div style={{ color: 'var(--m-text)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>R8,000 setup <span style={{ fontSize: '0.9rem', color: 'var(--m-text-muted)', fontWeight: 400 }}>(then R999/mo)</span></div>
                     <div style={{ color: 'var(--m-text-faint)', fontSize: '0.85rem' }}>AI-ready template, domain setup, onboarding</div>
                   </td>
                 </tr>
                 <tr>
                   <td style={{ padding: '24px', borderRight: '1px solid rgba(255,255,255,0.04)' }}>
                     <div style={{ color: 'var(--m-text)', fontWeight: 600, marginBottom: '4px' }}>Advanced Next-Gen E-commerce</div>
                     <div style={{ color: '#ef4444', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>R85,000 - R250,000+</div>
                     <div style={{ color: 'var(--m-text-faint)', fontSize: '0.85rem' }}>Multi-channel sync, payment gateways, automation</div>
                   </td>
                   <td style={{ padding: '24px' }}>
                     <div style={{ color: '#60a5fa', fontWeight: 600, marginBottom: '4px' }}>Commerce Tier</div>
                     <div style={{ color: 'var(--m-text)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>R15,000 setup <span style={{ fontSize: '0.9rem', color: 'var(--m-text-muted)', fontWeight: 400 }}>(then R4,500/mo)</span></div>
                     <div style={{ color: 'var(--m-text-faint)', fontSize: '0.85rem' }}>Full ecommerce config, product intelligence</div>
                   </td>
                 </tr>
               </tbody>
             </table>
          </div>

          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px', borderRadius: '12px', background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '1.5rem', marginTop: '-2px' }}>🔒</div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--m-text)', margin: '0 0 8px' }}>You own your core business data.</h3>
              <p style={{ margin: 0, color: 'var(--m-text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Your original products, customer lists and content belong entirely to you and can be exported at any time. The proprietary AI schemas, GEO architecture and engine-generated optimisations are platform features that work tirelessly to power your site for as long as you&apos;re with us.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* - Why Now? AI & SEO Explained - */}
      <section className="m-section" id="why-now">
        <div className="m-container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 64px' }}>
            <span className="m-label">Why this matters</span>
            <div className="m-divider" style={{ margin: '16px auto' }} />
            <h2
              style={{
                fontFamily: 'var(--m-font-display)',
                fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'var(--m-text)',
                margin: '0 0 16px',
              }}
            >
              Legacy platforms{' '}
              <span className="m-gradient-text">can&apos;t keep up.</span>
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--m-text-muted)', lineHeight: 1.7, margin: 0 }}>
              AI-powered search has fundamentally changed how customers find businesses.
              Shopify, Wix  WordPress weren&apos;t designed for this. Updating them for GEO
              is expensive, slow  often impossible without breaking everything else.
              Chameleon was built for this moment.
            </p>
          </div>

          <div className="m-grid-2" style={{ gap: '16px' }}>
            {whyNowPoints.map((point) => (
              <div
                key={point.stat}
                style={{
                  display: 'flex',
                  gap: '20px',
                  padding: '24px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.06)',
                  background: 'rgba(255,255,255,0.02)',
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    width: '48px',
                    height: '48px',
                    borderRadius: '10px',
                    background: 'rgba(59,130,246,0.08)',
                    border: '1px solid rgba(59,130,246,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#60a5fa',
                  }}
                >
                  <point.icon size={22} />
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--m-font-display)',
                      fontSize: '1.6rem',
                      fontWeight: 700,
                      color: '#60a5fa',
                      lineHeight: 1.1,
                      marginBottom: '4px',
                    }}
                  >
                    {point.stat}
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--m-text)', marginBottom: '4px' }}>
                    {point.label}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--m-text-muted)', lineHeight: 1.5 }}>
                    {point.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
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

      {/* - Section 4: Revenue Connection - */}
      <section className="m-section" id="revenue" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="m-container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 64px' }}>
            <h2 style={{ fontFamily: 'var(--m-font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--m-text)', margin: '0 0 16px' }}>
              More reach. Lower cost. More sales.
            </h2>
          </div>
          
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
               {[
                 { title: '1. AI search is where your next customer is looking.', desc: '40% of searches now return AI-generated answers instead of a list of blue links. If your business isn\'t structured for AI to understand and cite, you\'re invisible to that 40%.' },
                 { title: '2. Fast sites sell more.', desc: 'Chameleon pages load in under a second - built on the same technology that powers Fortune 500 online stores. Every second of delay costs 7% in conversions.' },
                 { title: '3. Your product data works 24/7.', desc: 'Every product listing is structured so that when someone asks ChatGPT "where can I buy this in South Africa?" - Chameleon-powered sites are built to be part of the answer.' },
                 { title: '4. No maintenance window, no downtime.', desc: 'You\'re not losing sales because your plugin broke at 2am and someone has to call a developer in the morning.' },
                 { title: '5. Your store keeps improving.', desc: 'Platform updates - including new AI features - are deployed to your site automatically. You don\'t pay for upgrades. You don\'t need to re-platform every 3 years.' }
               ].map((point, i) => (
                 <div key={i} style={{ display: 'flex', gap: '20px' }}>
                   <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(59,130,246,0.1)', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700 }}>
                     {i+1}
                   </div>
                   <div>
                     <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--m-text)', margin: '0 0 8px', lineHeight: 1.4 }}>{point.title.replace(/^\d+\.\s/, '')}</h3>
                     <p style={{ margin: 0, color: 'var(--m-text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>{point.desc}</p>
                   </div>
                 </div>
               ))}
             </div>
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

      {/* - Template Gallery - */}
      <section
        className="m-section"
        id="templates"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="m-container">
          <div style={{ textAlign: 'center', maxWidth: '560px', margin: '0 auto 56px' }}>
            <span className="m-label">Templates</span>
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
              Every store, perfectly crafted.
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--m-text-muted)', lineHeight: 1.7, margin: 0 }}>
              Each template is AI-ready from day one - not retrofitted. Pick one,
              brand it to your business  launch.
            </p>
          </div>

          <div className="m-grid-2" style={{ gap: '24px' }}>
            {templates.map((template) => (
              <div
                key={template.id}
                className="m-card"
                id={`template-card-${template.id}`}
                style={{ overflow: 'hidden' }}
              >
                {/* Preview area */}
                <div
                  style={{
                    height: '220px',
                    background: template.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    fontSize: '2rem',
                    fontFamily: 'var(--m-font-display)',
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.15)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {template.name}
                </div>

                {/* Info */}
                <div style={{ padding: '24px' }}>
                  <h3
                    style={{
                      fontFamily: 'var(--m-font-display)',
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      color: 'var(--m-text)',
                      margin: '0 0 6px',
                    }}
                  >
                    {template.name}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--m-text-muted)', margin: '0 0 16px' }}>
                    {template.tagline}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                    {template.features.map((f) => (
                      <span
                        key={f}
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          padding: '3px 10px',
                          borderRadius: '999px',
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: 'var(--m-text-muted)',
                        }}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                  <a
                    href={template.demoHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="m-btn m-btn-ghost"
                    style={{ width: '100%', justifyContent: 'center' }}
                    id={`template-demo-${template.id}`}
                  >
                    View Live Demo
                    <ArrowRight size={15} />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link href="/templates" className="m-btn m-btn-ghost" id="home-view-all-templates">
              Browse all templates
              <ArrowRight size={15} />
            </Link>
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
                  { name: 'Launch', price: 'from R999' },
                  { name: 'Professional', price: 'from R1,999', popular: true },
                  { name: 'Storefront', price: 'from R2,999' },
                  { name: 'Commerce', price: 'from R4,500' },
                ].map((tier) => (
                  <div
                    key={tier.name}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      border: tier.popular ? '1px solid rgba(59,130,246,0.35)' : '1px solid rgba(255,255,255,0.07)',
                      background: tier.popular ? 'rgba(59,130,246,0.06)' : 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <span style={{ fontSize: '0.9rem', fontWeight: tier.popular ? 600 : 400, color: tier.popular ? 'var(--m-text)' : 'var(--m-text-muted)' }}>
                      {tier.name}
                    </span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: tier.popular ? '#60a5fa' : 'var(--m-text-muted)' }}>
                      {tier.price}<span style={{ fontWeight: 400, fontSize: '0.75rem' }}>/mo</span>
                    </span>
                  </div>
                ))}
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
                  { name: 'Bronze', clients: '1-2 clients', price: 'R2,500' },
                  { name: 'Silver', clients: '3-9 clients', price: 'R4,500', popular: true },
                  { name: 'Gold', clients: '10+ clients', price: 'Free' },
                ].map((tier) => (
                  <div
                    key={tier.name}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      border: tier.popular ? '1px solid rgba(59,130,246,0.35)' : '1px solid rgba(255,255,255,0.07)',
                      background: tier.popular ? 'rgba(59,130,246,0.06)' : 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <div style={{ textAlign: 'left' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: tier.popular ? 600 : 400, color: tier.popular ? 'var(--m-text)' : 'var(--m-text-muted)', display: 'block' }}>
                        {tier.name}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--m-text-faint)' }}>{tier.clients}</span>
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: tier.popular ? '#60a5fa' : 'var(--m-text-muted)' }}>
                      {tier.price}<span style={{ fontWeight: 400, fontSize: '0.75rem' }}>/mo</span>
                    </span>
                  </div>
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
