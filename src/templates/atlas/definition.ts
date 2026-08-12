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
      defaultVariant: 'hero-static',
      variants: {
        'hero-static': {
          label: 'Hero Static',
          component: () => import('./HomePage'),
        },
        'hero-video': {
          label: 'Hero Video',
          component: () => import('./HomePage'),
        },
        'hero-carousel': {
          label: 'Hero Carousel',
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
          component: () => import('./AboutPage'),
        },
        'story-split': {
          label: 'Story Split',
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
          component: () => import('./ShopPage'),
        },
        'dense': {
          label: 'Dense Grid',
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
          component: () => import('./ContactPage'),
        },
        'split-image': {
          label: 'Split Image',
          component: () => import('./ContactPage'),
        },
        'map-and-hours': {
          label: 'Map & Hours',
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
          component: () => import('./ResourcesPage'),
        },
        'magazine': {
          label: 'Magazine',
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
          component: () => import('./LegalPage'),
        },
      },
    },
  },
};
