/**
 * Meridian FAQsPage
 *
 * Features:
 *   - Fetches FAQs from the engine grouped by category
 *   - Client-side category filter tabs + keyword search
 *   - Accordion per FAQ using the design system .mer-accordion-* classes
 *   - Falls back to demo data if no FAQs are configured
 *
 * The search + category state is managed client-side inside
 * FaqAccordionClient (declared below with "use client").
 *
 * Server component fetches the data; client component handles interaction.
 */

import type { PageProps } from '@/lib/types';
import type { MeridianPageConfig } from '@/lib/types';
import { getFaqs } from '@/lib/api';
import type { FAQ } from '@/lib/api';
import FaqAccordionClient from './FaqAccordionClient';

// ─── Demo fallback ─────────────────────────────────────────────────────────

const DEMO_FAQS: FAQ[] = [
  { id: 1, question: 'How do I appoint an attorney?',                              answer: 'Contact our offices to arrange an initial consultation. We will match you with the advisor best suited to your matter and confirm our fee structure upfront.', category: 'Getting Started', order: 1, published: true, createdAt: '', updatedAt: '' },
  { id: 2, question: 'What should I bring to my first meeting?',                   answer: 'Bring any relevant documents related to your matter (contracts, correspondence, court papers, IDs) and a brief written summary of the issue if possible.', category: 'Getting Started', order: 2, published: true, createdAt: '', updatedAt: '' },
  { id: 3, question: 'How are fees structured?',                                   answer: 'Fees depend on the nature of the matter. We offer time-based billing, fixed-fee packages for defined scope work, and contingency arrangements for certain litigation matters. We will explain the applicable structure at your first consultation.', category: 'Fees & Billing', order: 3, published: true, createdAt: '', updatedAt: '' },
  { id: 4, question: 'Do you charge for the initial consultation?',                answer: 'Initial consultations of up to 30 minutes are complimentary for new clients. Longer sessions or those requiring immediate document review are billed at our standard rate.', category: 'Fees & Billing', order: 4, published: true, createdAt: '', updatedAt: '' },
  { id: 5, question: 'How long does a property transfer take?',                    answer: 'A standard freehold transfer takes 6–10 weeks from the date all documents are signed. Delays can occur due to rates clearances, bank releases, or deeds office backlogs.', category: 'Property', order: 5, published: true, createdAt: '', updatedAt: '' },
  { id: 6, question: 'What is an antenuptial contract?',                           answer: 'An antenuptial contract (ANC) is a legal agreement signed before marriage that specifies the matrimonial property regime. Without one, you are automatically married in community of property.', category: 'Family Law', order: 6, published: true, createdAt: '', updatedAt: '' },
  { id: 7, question: 'How does retrenchment work legally?',                        answer: 'Retrenchment is a no-fault dismissal. The employer must follow a fair procedure (s189 consultation, genuine operational requirements), calculate severance correctly, and give proper notice. The CCMA can review unfair processes.', category: 'Employment', order: 7, published: true, createdAt: '', updatedAt: '' },
  { id: 8, question: 'What is the CCMA and when should I approach it?',           answer: 'The Commission for Conciliation, Mediation and Arbitration resolves employment disputes. You should approach it within 30 days of a dismissal, or 90 days for unfair labour practice disputes.', category: 'Employment', order: 8, published: true, createdAt: '', updatedAt: '' },
  { id: 9, question: 'Is my communication with my attorney confidential?',        answer: 'Yes. Attorney-client communications are protected by legal professional privilege. We cannot disclose the content of your consultations without your express consent, except in very limited legal circumstances.', category: 'Getting Started', order: 9, published: true, createdAt: '', updatedAt: '' },
];

// ─── Root export ────────────────────────────────────────────────────────────

export default async function FAQsPage({ config }: PageProps) {
  const tenantSlug = config.tenant.slug;
  const pc         = config.pageConfig as MeridianPageConfig | null;

  const headline    = pc?.faqsHeadline    ?? 'Frequently Asked Questions';
  const subheadline = pc?.faqsSubheadline ?? 'Answers to the questions we hear most often. Can\'t find what you\'re looking for? Get in touch.';

  const faqsRes = await getFaqs(tenantSlug);
  const faqs    = (faqsRes?.docs ?? DEMO_FAQS).filter((f) => f.published !== false);

  return (
    <>
      {/* Hero */}
      <section className="mer-section-sm" style={{ borderBottom: '1px solid var(--mer-border-color)' }}>
        <div className="mer-container">
          <div data-reveal="up">
            <span className="mer-overline">Help & Guidance</span>
            <h1 className="mer-h1" style={{ marginTop: 'var(--mer-spacing-md)', marginBottom: 'var(--mer-spacing-md)' }}>{headline}</h1>
            {subheadline && <p className="mer-body-lg" style={{ opacity: 0.8, maxWidth: '60ch' }}>{subheadline}</p>}
          </div>
        </div>
      </section>

      {/* Interactive accordion — client component */}
      <section className="mer-section">
        <div className="mer-container" style={{ maxWidth: 820 }}>
          <FaqAccordionClient faqs={faqs} />
        </div>
      </section>

      {/* CTA */}
      <div className="mer-cta-strip">
        <div className="mer-cta-strip-inner">
          <div>
            <p className="mer-h3" style={{ color: '#fff', marginBottom: 'var(--mer-spacing-xs)' }}>Still have questions?</p>
            <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '1.0625rem' }}>Our advisors are happy to answer your specific question in a consultation.</p>
          </div>
          <a href="/contact" className="mer-btn mer-btn-white" style={{ flexShrink: 0 }}>Contact Us</a>
        </div>
      </div>
    </>
  );
}