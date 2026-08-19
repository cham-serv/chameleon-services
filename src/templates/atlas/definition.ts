/**
 * Atlas Template  Route Map & Metadata
 *
 * E-commerce focused template with multiple page variants.
 * This file is lightweight (no component imports)  safe to load
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
          description: 'Product-forward and conversion-focused  visitors immediately see what\'s for sale.',
          component: () => import('./HomePage'),
        },
        'editorial': {
          label: 'Editorial',
          description: 'Brand-first, typography-driven  feels like a premium magazine landing page.',
          component: () => import('./HomePage'),
        },
        'modern': {
          label: 'Modern',
          description: 'Atmospheric, premium  dark mode with glowing gradients and micro-interactions.',
          component: () => import('./HomePage'),
        },
        'bold': {
          label: 'Bold',
          description: 'Dark, dramatic, high-contrast  photographic impact with hard edges.',
          component: () => import('./HomePage'),
        },
        'minimalist': {
          label: 'Minimalist',
          description: 'Immersive and ultra-minimal  experiential, proving value through feel.',
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
          description: 'Professional layout with mission, values, and team member cards in a responsive grid.',
          component: () => import('./AboutPage'),
        },
        'story-split': {
          label: 'Story Split',
          description: 'Narrative-driven  full-width hero image, zigzag journey sections, founder quote, and a scrolling team strip.',
          component: () => import('./AboutPage'),
        },
        'manifesto': {
          label: 'Manifesto',
          description: 'Bold, typography-driven  the page IS the brand statement. Full-viewport opening, pull-quote values, minimal team list.',
          component: () => import('./AboutPage'),
        },
      },
    },

    '/shop': {
      label: 'Shop',
      feature: 'shop',
      defaultVariant: 'catalog',
      variants: {
        'catalog': {
          label: 'Catalog',
          description: 'Traditional sidebar layout with category navigation and dense product grid  built for large inventories.',
          component: () => import('./ShopPage'),
        },
        'modern': {
          label: 'Modern',
          description: 'Full-width grid with sticky filter bar and image-swap on hover  the standard modern DTC storefront.',
          component: () => import('./ShopPage'),
        },
        'lookbook': {
          label: 'Lookbook',
          description: 'Visual discovery with asymmetric grid, large portrait imagery, and minimal text  boutique and high-end.',
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
          description: 'Contact form alongside a brand image  warm and inviting.',
          component: () => import('./ContactPage'),
        },
        'map-and-hours': {
          label: 'Map & Hours',
          description: 'Contact form with embedded map and business hours  great for local businesses.',
          component: () => import('./ContactPage'),
        },
      },
    },

    '/resources': {
      label: 'Resources',
      feature: 'resources',
      defaultVariant: 'directory',
      variants: {
        'directory': {
          label: 'Directory',
          description: 'Structured documentation index  topic list with descriptions, article counts, and sidebar tools.',
          component: () => import('./ResourcesPage'),
        },
        'grid': {
          label: 'Grid',
          description: 'Topic cards in a responsive grid with icons and article counts  visual and scannable.',
          component: () => import('./ResourcesPage'),
        },
        'magazine': {
          label: 'Magazine',
          description: 'Editorial layout with a featured topic hero and a cross-topic article feed below.',
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
          description: 'Expandable FAQ sections grouped by category  clean, utilitarian, easy to navigate.',
          component: () => import('./FAQsPage'),
        },
        'search': {
          label: 'Search',
          description: 'Help-center style  prominent search bar as hero with instant filtering and category cards.',
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
