/**
 * Chameleon Engine API Client
 *
 * All fetch() calls to the engine, with ISR cache tags for on-demand
 * revalidation. Each function accepts a tenant slug and returns typed data.
 *
 * Cache strategy:
 * - revalidate: 3600 (1 hour fallback)
 * - tags: ['tenant:{slug}', '{collection}:{slug}'] for targeted invalidation
 *
 * The engine API uses the `?tenant=` query param for tenant scoping.
 */

const ENGINE_API_URL =
  process.env.CHAMELEON_API_URL ??
  'https://chameleon-engine-production.up.railway.app';

// ── Helpers ─────────────────────────────────────────────────────────────────

function apiUrl(path: string, params?: Record<string, string>): string {
  const url = new URL(path, ENGINE_API_URL);
  if (params) {
    for (const [key, val] of Object.entries(params)) {
      if (val) url.searchParams.set(key, val);
    }
  }
  return url.toString();
}

type FetchOptions = {
  tags?: string[];
  revalidate?: number;
};

async function apiFetch<T>(url: string, opts: FetchOptions = {}): Promise<T | null> {
  try {
    const res = await fetch(url, {
      next: {
        revalidate: opts.revalidate ?? 3600,
        tags: opts.tags,
      },
    });

    if (!res.ok) {
      if (res.status !== 404) {
        console.warn(`[api] ${url} returned ${res.status}`);
      }
      return null;
    }

    return (await res.json()) as T;
  } catch (error) {
    console.error(`[api] Error fetching ${url}:`, error);
    return null;
  }
}

// ── Paginated Response Shape ────────────────────────────────────────────────

export type PaginatedResponse<T> = {
  docs: T[];
  totalDocs: number;
  totalPages: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  pagingCounter: number;
};

// ── Products ────────────────────────────────────────────────────────────────

export type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  shortDescription?: string;
  longDescription?: unknown; // Lexical JSON — only on single product
  published: boolean;
  featured?: boolean;
  images?: Array<{ image: MediaItem }>;
  category?: ProductCategory | number | null;
  tags?: Array<{ tag: string }>;
  currency?: string;
  sku?: string;
  stockLevel?: number | null;
  trackInventory?: boolean;
  weight?: number | null;
  // Intelligence tab fields (only on single product)
  aiSummary?: string;
  expertPros?: Array<{ point: string }>;
  expertCons?: Array<{ point: string }>;
  technicalSpecs?: Array<{ label: string; value: string }>;
  productFaqs?: Array<{ question: string; answer: string }>;
  solvesProblems?: string[];
  idealFor?: string[];
  keyAttributes?: Array<{ attribute: string; value: string }>;
  voiceSearchPhrase?: string;
  createdAt: string;
  updatedAt: string;
};

export type MediaItem = {
  id: number;
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  mimeType?: string;
  filename?: string;
  sizes?: Record<string, { url: string; width: number; height: number }>;
};

export type ProductCategory = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: MediaItem | number | null;
  icon?: string;
  parent?: ProductCategory | number | null;
  order?: number;
  featured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  aiSummary?: string;
  productCount?: number;
};

type GetProductsParams = {
  tenant: string;
  category?: string;
  featured?: boolean;
  tag?: string;
  sort?: 'price-asc' | 'price-desc' | 'newest' | 'name';
  search?: string;
  limit?: number;
  page?: number;
};

export async function getProducts(params: GetProductsParams): Promise<PaginatedResponse<Product> | null> {
  const queryParams: Record<string, string> = { tenant: params.tenant };
  if (params.category) queryParams.category = params.category;
  if (params.featured) queryParams.featured = 'true';
  if (params.tag) queryParams.tag = params.tag;
  if (params.sort) queryParams.sort = params.sort;
  if (params.search) queryParams.search = params.search;
  if (params.limit) queryParams.limit = String(params.limit);
  if (params.page) queryParams.page = String(params.page);

  return apiFetch<PaginatedResponse<Product>>(
    apiUrl('/api/public/products', queryParams),
    { tags: [`tenant:${params.tenant}`, `products:${params.tenant}`] },
  );
}

export async function getProductBySlug(tenant: string, slug: string): Promise<Product | null> {
  return apiFetch<Product>(
    apiUrl(`/api/public/products/${encodeURIComponent(slug)}`, { tenant }),
    { tags: [`tenant:${tenant}`, `products:${tenant}`, `product:${slug}`] },
  );
}

// ── Product Categories ──────────────────────────────────────────────────────

type GetCategoriesParams = {
  tenant: string;
  featured?: boolean;
  includeCount?: boolean;
};

export async function getCategories(params: GetCategoriesParams): Promise<PaginatedResponse<ProductCategory> | null> {
  const queryParams: Record<string, string> = { tenant: params.tenant };
  if (params.featured) queryParams.featured = 'true';
  if (params.includeCount) queryParams.includeCount = 'true';

  return apiFetch<PaginatedResponse<ProductCategory>>(
    apiUrl('/api/public/product-categories', queryParams),
    { tags: [`tenant:${params.tenant}`, `categories:${params.tenant}`] },
  );
}

// ── Articles ────────────────────────────────────────────────────────────────

export type Article = {
  id: number;
  title: string;
  slug: string;
  section?: 'resources' | 'blog' | 'news';
  excerpt?: string;
  content?: unknown; // Lexical blocks array — only on single article
  heroImage?: MediaItem | number | null;
  topic?: { id: number; name: string; slug: string } | number | null;
  author?: string;
  featured?: boolean;
  readTime?: number;
  contentStyle?: 'guide' | 'explainer' | 'concept';
  aiSummary?: string;
  primaryEntity?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
};

type GetArticlesParams = {
  tenant: string;
  topic?: string;
  section?: string;
  featured?: boolean;
  limit?: number;
  page?: number;
};

export async function getArticles(params: GetArticlesParams): Promise<PaginatedResponse<Article> | null> {
  const queryParams: Record<string, string> = { tenant: params.tenant };
  if (params.topic) queryParams.topic = params.topic;
  if (params.section) queryParams.section = params.section;
  if (params.featured) queryParams.featured = 'true';
  if (params.limit) queryParams.limit = String(params.limit);
  if (params.page) queryParams.page = String(params.page);

  return apiFetch<PaginatedResponse<Article>>(
    apiUrl('/api/public/articles', queryParams),
    { tags: [`tenant:${params.tenant}`, `articles:${params.tenant}`] },
  );
}

export async function getArticleBySlug(tenant: string, slug: string): Promise<Article | null> {
  return apiFetch<Article>(
    apiUrl(`/api/public/articles/${encodeURIComponent(slug)}`, { tenant }),
    { tags: [`tenant:${tenant}`, `articles:${tenant}`, `article:${slug}`] },
  );
}

// ── Services ────────────────────────────────────────────────────────────────

export type Service = {
  id: number;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: unknown; // Lexical JSON
  icon?: string;
  image?: MediaItem | number | null;
  order?: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function getServices(tenant: string): Promise<PaginatedResponse<Service> | null> {
  return apiFetch<PaginatedResponse<Service>>(
    apiUrl('/api/public/services', { tenant }),
    { tags: [`tenant:${tenant}`, `services:${tenant}`] },
  );
}

export async function getServiceBySlug(tenant: string, slug: string): Promise<Service | null> {
  return apiFetch<Service>(
    apiUrl(`/api/public/services/${encodeURIComponent(slug)}`, { tenant }),
    { tags: [`tenant:${tenant}`, `services:${tenant}`, `service:${slug}`] },
  );
}

// ── FAQs ────────────────────────────────────────────────────────────────────

export type FAQ = {
  id: number;
  question: string;
  answer: unknown; // Lexical JSON rich text
  linkedTopic?: { id: number; name: string; slug: string } | number | null;
  order?: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function getFaqs(tenant: string, category?: string): Promise<PaginatedResponse<FAQ> | null> {
  const params: Record<string, string> = { tenant };
  if (category) params.category = category;

  return apiFetch<PaginatedResponse<FAQ>>(
    apiUrl('/api/public/faqs', params),
    { tags: [`tenant:${tenant}`, `faqs:${tenant}`] },
  );
}

// ── Legal Documents ─────────────────────────────────────────────────────────

export type LegalDocs = {
  id: number;
  termsOfService?: unknown; // Lexical JSON
  privacyPolicy?: unknown; // Lexical JSON
  refundPolicy?: unknown; // Lexical JSON
  cookiePolicy?: unknown; // Lexical JSON
  lastReviewedAt?: string;
  termsEffectiveDate?: string;
  privacyEffectiveDate?: string;
  createdAt: string;
  updatedAt: string;
};

export async function getLegalDocs(tenant: string): Promise<LegalDocs | null> {
  return apiFetch<LegalDocs>(
    apiUrl('/api/public/legal', { tenant }),
    { tags: [`tenant:${tenant}`, `legal:${tenant}`] },
  );
}

// ── Page SEO ────────────────────────────────────────────────────────────────

export type PageSEO = {
  id: number;
  slug: string;
  label: string;
  metaTitle?: string;
  metaDescription?: string;
  aiSummary?: string;
  ogImage?: MediaItem | number | null;
};

export async function getPageSEO(tenant: string, pageSlug: string): Promise<PageSEO | null> {
  return apiFetch<PageSEO>(
    apiUrl('/api/public/page-seo', { tenant, slug: pageSlug }),
    { tags: [`tenant:${tenant}`, `seo:${tenant}`] },
  );
}

// ── Topics ──────────────────────────────────────────────────────────────────

export type Topic = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  type: string;
<<<<<<< Updated upstream
  order?: number;
=======
  description?: string;
  icon?: string;
  articleCount?: number;
>>>>>>> Stashed changes
};

export async function getTopics(tenant: string): Promise<PaginatedResponse<Topic> | null> {
  return apiFetch<PaginatedResponse<Topic>>(
    apiUrl('/api/public/topics', { tenant }),
    { tags: [`tenant:${tenant}`, `topics:${tenant}`] },
  );
}
