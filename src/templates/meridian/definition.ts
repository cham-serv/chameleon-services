/**
 * Meridian Template  Route Map & Metadata
 *
 * Professional services focused template  clean, authority-driven aesthetic.
 */

import type { TemplateDefinition } from '@/lib/types';

export const definition: TemplateDefinition = {
  slug: 'meridian',
  name: 'Meridian',

  layout: () => import('./MeridianLayout'),

  routes: {
    '/': {
      label: 'Home',
      feature: null,
      defaultVariant: 'split-hero',
      variants: {
        'split-hero': {
          label: 'Split Hero',
          component: () => import('./HomePage'),
        },
        'full-hero': {
          label: 'Full Hero',
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
      },
    },

    '/services': {
      label: 'Services',
      feature: 'services',
      defaultVariant: 'cards',
      variants: {
        'cards': {
          label: 'Service Cards',
          component: () => import('./ServicesPage'),
        },
      },
    },

    '/services/*': {
      label: 'Service Detail',
      feature: 'services',
      defaultVariant: 'service-page',
      variants: {
        'service-page': {
          label: 'Service Page',
          component: () => import('./ServicePage'),
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

    '/blog': {
      label: 'Blog',
      feature: 'blog',
      defaultVariant: 'magazine',
      variants: {
        'magazine': {
          label: 'Magazine',
          component: () => import('./BlogPage'),
        },
      },
    },

    '/blog/*': {
      label: 'Blog Post',
      feature: 'blog',
      defaultVariant: 'blog-post',
      variants: {
        'blog-post': {
          label: 'Blog Post',
          component: () => import('./BlogPostPage'),
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
