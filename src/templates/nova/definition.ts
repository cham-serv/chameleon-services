/**
 * Nova Template — Route Map & Metadata
 *
 * Launch-tier template for sole traders, freelancers, and artisans.
 * Key differentiator: configurable offerings route slug.
 *
 * NOTE: The offerings routes use static '/services' and '/services/*' keys here.
 * The tenant.ts matchRoute() function handles the dynamic slug resolution at
 * runtime by checking NovaSiteConfig.offeringsSlug. The definition uses 'services'
 * as the canonical key — the actual URL can be /products, /programmes, etc.
 */

import type { TemplateDefinition } from '@/lib/types';

export const definition: TemplateDefinition = {
  slug: 'nova',
  name: 'Nova',

  layout: () => import('./NovaLayout'),

  routes: {
    '/': {
      label: 'Home',
      feature: null,
      defaultVariant: 'clean',
      variants: {
        'clean': {
          label: 'Clean',
          description: 'Typography-led hero, no hero image',
          component: () => import('./HomePage'),
        },
        'hero-image': {
          label: 'Hero Image',
          description: 'Full-width hero image with overlay text',
          component: () => import('./HomePage'),
        },
      },
    },

    '/about': {
      label: 'About',
      feature: 'about',
      defaultVariant: 'standard',
      variants: {
        'standard': {
          label: 'Standard',
          description: 'Story, values, and team section',
          component: () => import('./AboutPage'),
        },
      },
    },

    '/services': {
      label: 'Services',
      feature: 'offerings',
      defaultVariant: 'cards',
      variants: {
        'cards': {
          label: 'Cards',
          description: 'Grid of cards with image, title, description',
          component: () => import('./OfferingsPage'),
        },
        'list': {
          label: 'List',
          description: 'Clean vertical list with expand-on-click details',
          component: () => import('./OfferingsPage'),
        },
      },
    },

    '/services/*': {
      label: 'Service Detail',
      feature: 'offerings',
      defaultVariant: 'detail',
      variants: {
        'detail': {
          label: 'Detail',
          description: 'Individual offering with Service + FAQPage schema',
          component: () => import('./OfferingDetailPage'),
        },
      },
    },

    '/faqs': {
      label: 'FAQs',
      feature: 'faqs',
      defaultVariant: 'accordion',
      variants: {
        'accordion': {
          label: 'Accordion',
          description: 'Server-rendered FAQ with Speakable schema',
          component: () => import('./FAQsPage'),
        },
      },
    },

    '/contact': {
      label: 'Contact',
      feature: 'contact',
      defaultVariant: 'minimal',
      variants: {
        'minimal': {
          label: 'Minimal',
          description: 'Form with sidebar contact details',
          component: () => import('./ContactPage'),
        },
      },
    },

    '/legal': {
      label: 'Legal',
      feature: 'legal',
      defaultVariant: 'standard',
      variants: {
        'standard': {
          label: 'Standard',
          description: 'Tabbed legal document viewer',
          component: () => import('./LegalPage'),
        },
      },
    },
  },
};
