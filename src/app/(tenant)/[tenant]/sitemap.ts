/**
 * Dynamic Sitemap
 *
 * Generates a per-tenant sitemap.xml by querying the engine API
 * for published products, articles, and services.
 *
 * This is for tenant sites only. The marketing site has its own
 * sitemap in the (marketing) route group.
 */

import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { getProducts, getArticles, getServices } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = await headers();
  const host = headersList.get('host') ?? 'localhost:3000';
  const baseUrl = `https://${host}`;

  // Extract tenant slug from host
  const tenantSlug = host.split('.')[0];

  // Static pages that every tenant has
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/faqs`, changeFrequency: 'monthly', priority: 0.5 },
  ];

  const dynamicPages: MetadataRoute.Sitemap = [];

  // Fetch products
  const products = await getProducts({ tenant: tenantSlug, limit: 100 });
  if (products?.docs) {
    // Shop listing
    dynamicPages.push({
      url: `${baseUrl}/shop`,
      changeFrequency: 'daily',
      priority: 0.8,
    });

    // Individual products
    for (const product of products.docs) {
      dynamicPages.push({
        url: `${baseUrl}/shop/${product.slug}`,
        lastModified: new Date(product.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  }

  // Fetch articles
  const articles = await getArticles({ tenant: tenantSlug, limit: 100 });
  if (articles?.docs?.length) {
    // Resources/blog listing
    dynamicPages.push({
      url: `${baseUrl}/resources`,
      changeFrequency: 'weekly',
      priority: 0.7,
    });

    for (const article of articles.docs) {
      dynamicPages.push({
        url: `${baseUrl}/resources/${article.slug}`,
        lastModified: new Date(article.updatedAt),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  // Fetch services
  const services = await getServices(tenantSlug);
  if (services?.docs?.length) {
    dynamicPages.push({
      url: `${baseUrl}/services`,
      changeFrequency: 'monthly',
      priority: 0.7,
    });

    for (const service of services.docs) {
      dynamicPages.push({
        url: `${baseUrl}/services/${service.slug}`,
        lastModified: new Date(service.updatedAt),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  return [...staticPages, ...dynamicPages];
}
