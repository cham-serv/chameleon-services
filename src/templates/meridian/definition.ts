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
          description: 'Image right, headline + CTA left. Classic professional services layout.',
          component: () => import('./HomePage'),
        },
        'full-hero': {
          label: 'Full Hero',
          description: 'Cinematic full-bleed image with centered headline and dark gradient overlay.',
          component: () => import('./HomePage'),
        },
        'authority': {
          label: 'Authority',
          description: 'Pure typographic statement — no hero image. Big-law gravitas.',
          component: () => import('./HomePage'),
        },
        'metrics': {
          label: 'Metrics',
          description: 'Hero headline + animated counter strip. Numbers speak loudest.',
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
          description: 'Responsive grid of service cards with department filter tabs.',
          component: () => import('./ServicesPage'),
        },
        'sticky-scroll': {
          label: 'Sticky Scroll',
          description: 'Sidebar navigation with scrolling service detail blocks.',
          component: () => import('./ServicesPage'),
        },
        'modal-grid': {
          label: 'Modal Grid',
          description: 'Filter tabs with click-to-open inline modals. Like the /impact page.',
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
          description: 'Clean form + sidebar contact details.',
          component: () => import('./ContactPage'),
        },
        'split-image': {
          label: 'Split Image',
          description: 'Form left, office image right.',
          component: () => import('./ContactPage'),
        },
      },
    },

    '/team': {
      label: 'Our People',
      feature: 'team',
      defaultVariant: 'grid',
      variants: {
        'grid': {
          label: 'Photo Grid',
          description: 'Photo grid with department filter tabs.',
          component: () => import('./TeamPage'),
        },
        'portfolio': {
          label: 'Portfolio',
          description: 'Large photo-dominant cards.',
          component: () => import('./TeamPage'),
        },
        'department-sections': {
          label: 'Department Sections',
          description: 'Team members divided by department headings.',
          component: () => import('./TeamPage'),
        },
        'list': {
          label: 'Directory List',
          description: 'Compact directory with quick-contact links.',
          component: () => import('./TeamPage'),
        },
      },
    },

    '/team/*': {
      label: 'Team Member Profile',
      feature: 'team',
      defaultVariant: 'profile',
      navigableInDemo: false,
      variants: {
        'profile': {
          label: 'Profile',
          component: () => import('./TeamMemberPage'),
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
