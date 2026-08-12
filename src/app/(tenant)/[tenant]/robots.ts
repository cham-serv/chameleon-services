/**
 * Dynamic robots.txt
 *
 * Per-tenant robots file. Demo tenants are noindexed to prevent
 * search engines from indexing demo content.
 *
 * For marketing site (chameleon.services), this is handled by
 * the existing static robots.ts in the (marketing) route group.
 * This file is for tenant sites only.
 */

import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const headersList = await headers();
  const host = headersList.get('host') ?? 'localhost:3000';

  // Check if this is a demo subdomain
  const isDemo = host.includes('-demo.');

  if (isDemo) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/'],
    },
    sitemap: `https://${host}/sitemap.xml`,
  };
}
