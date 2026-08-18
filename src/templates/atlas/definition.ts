/**
 * Atlas Template — Route Map & Metadata
 *
 * E-commerce focused template with multiple page variants.
 * This file is lightweight (no component imports) — safe to load
 * in DemoExplorer without pulling in page component code.
 */

import type { TemplateDefinition } from '@/lib/types';

export const definition: TemplateDefinition = {
  slug: 'atlas',
  name: 'Atlas',

  layout: () => import('./AtlasLayout'),

  routes: {
    '/': {
      label: 'Home',
      feature: null, // always available
      defaultVariant: 'storefront',
      variants: {
        'storefront': {
          label: 'Storefront',
          description: 'Product-forward and conversion-focused — visitors immediately see what\'s for sale.',
          component: () => import('./HomePage'),
        },
        'editorial': {
          label: 'Editorial',
          description: 'Brand-first, typography-driven — feels like a premium magazine landing page.',
          component: () => import('./HomePage'),
        },
        'modern': {
          label: 'Modern',
          description: 'Atmospheric, premium — dark mode with glowing gradients and micro-interactions.',
          component: () => import('./HomePage'),
        },
        'bold': {
          label: 'Bold',
          description: 'Dark, dramatic, high-contrast — photographic impact with hard edges.',
          component: () => import('./HomePage'),
        },
        'minimalist': {
          label: 'Minimalist',
          description: 'Immersive and ultra-minimal — experiential, proving value through feel.',
          component: () => import('./HomePage'),
        },
      },
    },

    '/about': {
      label: 'About',
      feature: 'about',
      defaultVariant: 'team-grid',
      variants: {
        'team-grid': {
          label: 'Team Grid',
          description: 'Structured layout with team member cards in a responsive grid.',
          component: () => import('./AboutPage'),
        },
        'story-split': {
          label: 'Story Split',
          description: 'Narrative-driven split layout — brand story on one side, imagery on the other.',
          component: () => import('./AboutPage'),
        },
      },
    },

    '/shop': {
      label: 'Shop',
      feature: 'shop',
      defaultVariant: 'editorial',
      variants: {
        'editorial': {
          label: 'Editorial',
          description: 'Spacious product grid with large cards and breathing room.',
          component: () => import('./ShopPage'),
        },
        'dense': {
          label: 'Dense Grid',
          description: 'Compact product grid — more items visible per page.',
          component: () => import('./ShopPage'),
        },
      },
    },

    '/shop/*': {
      label: 'Product',
      feature: 'shop',
      defaultVariant: 'product-page',
      variants: {
        'product-page': {
          label: 'Product Page',
          description: 'Full product detail with gallery, description, and add-to-cart.',
          component: () => import('./ProductPage'),
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
          description: 'Clean, focused contact form with no distractions.',
          component: () => import('./ContactPage'),
        },
        'split-image': {
          label: 'Split Image',
          description: 'Contact form alongside a brand image — warm and inviting.',
          component: () => import('./ContactPage'),
        },
        'map-and-hours': {
          label: 'Map & Hours',
          description: 'Contact form with embedded map and business hours — great for local businesses.',
          component: () => import('./ContactPage'),
        },
      },
    },

    '/resources': {
      label: 'Resources',
      feature: 'resources',
      defaultVariant: 'grid',
      variants: {
        'grid': {
          label: 'Grid',
          description: 'Topic cards in a responsive grid — visual and scannable.',
          component: () => import('./ResourcesPage'),
        },
        'magazine': {
          label: 'Magazine',
          description: 'Text-heavy list layout — editorial feel with article previews.',
          component: () => import('./ResourcesPage'),
        },
      },
    },

    '/resources/*': {
      label: 'Resource',
      feature: 'resources',
      defaultVariant: 'resource-page',
      variants: {
        'resource-page': {
          label: 'Resource Page',
          description: 'Full article view with table of contents and related articles.',
          component: () => import('./ResourcePage'),
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
          description: 'Expandable FAQ sections — clean and easy to navigate.',
          component: () => import('./FAQsPage'),
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
          description: 'Tabbed legal document viewer for privacy, terms, and refund policies.',
          component: () => import('./LegalPage'),
        },
      },
    },
  },
};
