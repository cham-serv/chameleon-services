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
  noCache?: boolean;
};

async function apiFetch<T>(url: string, opts: FetchOptions = {}): Promise<T | null> {
  try {
    const fetchInit: RequestInit = opts.noCache
      ? { cache: 'no-store' }
      : { next: { revalidate: opts.revalidate ?? 3600, tags: opts.tags } };

    const res = await fetch(url, fetchInit);

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
  weightUnit?: 'g' | 'kg' | 'ml' | 'l';
  // Product identity
  productType?: 'physical' | 'digital' | 'service';
  gtin?: string;               // EAN/UPC/ISBN — connects to Google Shopping graph
  condition?: 'new' | 'refurbished' | 'used' | 'damaged';
  availabilityStatus?: 'inStock' | 'outOfStock' | 'preOrder' | 'backOrder' | 'discontinued';
  availableFrom?: string;       // ISO date for pre-orders
  availableUntil?: string;
  // Brand & identity (Tab 4)
  brand?: string;
  brandUrl?: string;
  manufacturer?: string;
  countryOfOrigin?: string;
  material?: string;
  color?: string;
  // Highlights (shown on product page as feature bullets)
  highlights?: Array<{ highlight: string }>;
  // Variants
  variants?: Array<{
    label: string;
    variantSku?: string;
    color?: string;
    size?: string;
    priceModifier?: number;
    variantStock?: number;
  }>;
  // Delivery (Tab 4)
  deliveryRegions?: Array<{ region: string }>;
  deliveryMethod?: 'ship' | 'pickup' | 'both';
  deliveryLeadTime?: string;
  handlingTimeDays?: number;
  shippingCost?: number;
  // Service-specific geo
  serviceArea?: string;
  geoLatitude?: number;
  geoLongitude?: number;
  // Returns
  returnDays?: number;
  returnMethod?: 'mail' | 'in-store' | 'both';
  returnFees?: 'free' | 'buyer-pays';
  // Pricing extras
  quantityDiscounts?: Array<{ minQty: number; discountType: 'percentage' | 'fixed'; discountValue: number }>;
  isSubscription?: boolean;
  subscriptionInterval?: 'weekly' | 'monthly' | 'quarterly' | 'annually';
  subscriptionPrice?: number;
  // Intelligence tab fields (only on single product fetch)
  aiSummary?: string;
  /** Engine stores as { pro: string } — mapped to this shape by the API */
  expertPros?: Array<{ pro: string }>;
  /** Engine stores as { con: string } — mapped to this shape by the API */
  expertCons?: Array<{ con: string }>;
  technicalSpecs?: Array<{ specName: string; specValue: string; specUnit?: string }>;
  productFaqs?: Array<{ question: string; answer: string }>;
  solvesProblems?: Array<{ problem: string }>;
  idealFor?: Array<{ audience: string }>;
  /** Engine stores as { attribute: string } — single text, not key-value */
  keyAttributes?: Array<{ attribute: string }>;
  voiceSearchPhrase?: string;
  comparedTo?: Array<{ competitorProduct: string; advantage: string; disadvantage?: string }>;
  // Compatibility & related
  worksWith?: Array<{ item: string }>;
  isAccessoryFor?: string;
  requiredAccessories?: Array<{ accessory: string }>;
  relatedProducts?: Product[] | number[];
  bundleProducts?: Product[] | number[];
  // Trust & authority
  certifications?: Array<{ certName: string; issuedBy?: string; certId?: string; certUrl?: string }>;
  awards?: Array<{ award: string }>;
  featuredIn?: Array<{ publicationName: string; articleUrl?: string; featureDate?: string }>;
  // Sustainability
  carbonFootprint?: string;
  recyclable?: boolean;
  sustainablySourced?: boolean;
  madeLocally?: boolean;
  // Rich media
  demoVideo?: string;
  demoVideoTitle?: string;
  model3dUrl?: string;
  model3dAlt?: string;
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  llmCitationPreference?: string;
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
  longDescription?: unknown;   // Lexical richText — above product grid
  image?: MediaItem | number | null;
  icon?: string;
  parent?: ProductCategory | number | null;
  order?: number;
  featured?: boolean;
  // Intelligence tab (only on getCategoryBySlug)
  aiSummary?: string;
  wikidataUrl?: string;
  buyersGuide?: unknown;       // Lexical richText — editorial buying guide
  categoryFaqs?: Array<{ question: string; answer: string }>;
  metaTitle?: string;
  metaDescription?: string;
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

export async function getProducts(params: GetProductsParams, noCache = false): Promise<PaginatedResponse<Product> | null> {
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
    noCache
      ? { noCache: true }
      : { tags: [`tenant:${params.tenant}`, `products:${params.tenant}`] },
  );
}

export async function getProductBySlug(tenant: string, slug: string, noCache = false): Promise<Product | null> {
  return apiFetch<Product>(
    apiUrl(`/api/public/products/${encodeURIComponent(slug)}`, { tenant }),
    noCache
      ? { noCache: true }
      : { tags: [`tenant:${tenant}`, `products:${tenant}`, `product:${slug}`] },
  );
}

// ── Product Categories ──────────────────────────────────────────────────────

type GetCategoriesParams = {
  tenant: string;
  featured?: boolean;
  includeCount?: boolean;
};

export async function getCategories(params: GetCategoriesParams, noCache = false): Promise<PaginatedResponse<ProductCategory> | null> {
  const queryParams: Record<string, string> = { tenant: params.tenant };
  if (params.featured) queryParams.featured = 'true';
  if (params.includeCount) queryParams.includeCount = 'true';

  return apiFetch<PaginatedResponse<ProductCategory>>(
    apiUrl('/api/public/product-categories', queryParams),
    noCache
      ? { noCache: true }
      : { tags: [`tenant:${params.tenant}`, `categories:${params.tenant}`] },
  );
}

export async function getCategoryBySlug(
  tenant: string,
  slug: string,
  noCache = false,
): Promise<ProductCategory | null> {
  return apiFetch<ProductCategory>(
    apiUrl(`/api/public/product-categories/${encodeURIComponent(slug)}`, { tenant }),
    noCache
      ? { noCache: true }
      : { tags: [`tenant:${tenant}`, `categories:${tenant}`, `category:${slug}`] },
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
  socialImage?: MediaItem | number | null;
  topic?: { id: number; name: string; slug: string } | number | null;
  tags?: Array<{ id: number; name: string; slug: string }> | number[];
  author?: string;
  featured?: boolean;
  readTime?: number;
  contentStyle?: 'guide' | 'explainer' | 'concept';
  // GEO/SEO fields
  aiSummary?: string;
  metaTitle?: string;
  metaDescription?: string;
  primaryEntity?: string;
  primaryEntityUrl?: string;
  speakableText?: string;
  keyTakeaways?: Array<{ point: string }>;
  additionalSources?: Array<{ label: string; url: string }>;
  /** Virtual field injected by the engine's generateLdSchema afterRead hook */
  __jsonLd?: Record<string, unknown> | Record<string, unknown>[];
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

export async function getArticles(params: GetArticlesParams, noCache = false): Promise<PaginatedResponse<Article> | null> {
  const queryParams: Record<string, string> = { tenant: params.tenant };
  if (params.topic) queryParams.topic = params.topic;
  if (params.section) queryParams.section = params.section;
  if (params.featured) queryParams.featured = 'true';
  if (params.limit) queryParams.limit = String(params.limit);
  if (params.page) queryParams.page = String(params.page);

  return apiFetch<PaginatedResponse<Article>>(
    apiUrl('/api/public/articles', queryParams),
    noCache
      ? { noCache: true }
      : { tags: [`tenant:${params.tenant}`, `articles:${params.tenant}`] },
  );
}

export async function getArticleBySlug(tenant: string, slug: string, noCache = false): Promise<Article | null> {
  return apiFetch<Article>(
    apiUrl(`/api/public/articles/${encodeURIComponent(slug)}`, { tenant }),
    noCache
      ? { noCache: true }
      : { tags: [`tenant:${tenant}`, `articles:${tenant}`, `article:${slug}`] },
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

export async function getServices(tenant: string, noCache = false): Promise<PaginatedResponse<Service> | null> {
  return apiFetch<PaginatedResponse<Service>>(
    apiUrl('/api/public/services', { tenant }),
    noCache
      ? { noCache: true }
      : { tags: [`tenant:${tenant}`, `services:${tenant}`] },
  );
}

export async function getServiceBySlug(tenant: string, slug: string, noCache = false): Promise<Service | null> {
  return apiFetch<Service>(
    apiUrl(`/api/public/services/${encodeURIComponent(slug)}`, { tenant }),
    noCache
      ? { noCache: true }
      : { tags: [`tenant:${tenant}`, `services:${tenant}`, `service:${slug}`] },
  );
}

// ── FAQs ────────────────────────────────────────────────────────────────────

export type FAQ = {
  id: number;
  question: string;
  answer: string; // plain text or Lexical JSON
  category?: string;
  linkedTopic?: { id: number; name: string; slug: string } | number | null;
  order?: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function getFaqs(tenant: string, category?: string, noCache = false): Promise<PaginatedResponse<FAQ> | null> {
  const params: Record<string, string> = { tenant };
  if (category) params.category = category;

  return apiFetch<PaginatedResponse<FAQ>>(
    apiUrl('/api/public/faqs', params),
    noCache
      ? { noCache: true }
      : { tags: [`tenant:${tenant}`, `faqs:${tenant}`] },
  );
}

// ── Legal Documents ─────────────────────────────────────────────────────────

export type LegalDocs = {
  id: number;
  privacyPolicy?: unknown; // Lexical JSON
  termsAndConditions?: unknown; // Lexical JSON
  termsOfService?: unknown; // Lexical JSON (legacy alias)
  refundPolicy?: unknown; // Lexical JSON
  shippingPolicy?: unknown; // Lexical JSON
  cookiePolicy?: unknown; // Lexical JSON
  lastReviewedAt?: string;
  termsEffectiveDate?: string;
  privacyEffectiveDate?: string;
  createdAt: string;
  updatedAt: string;
};

export async function getLegalDocs(tenant: string, noCache = false): Promise<LegalDocs | null> {
  return apiFetch<LegalDocs>(
    apiUrl('/api/public/legal', { tenant }),
    noCache
      ? { noCache: true }
      : { tags: [`tenant:${tenant}`, `legal:${tenant}`] },
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

export async function getPageSEO(tenant: string, pageSlug: string, noCache = false): Promise<PageSEO | null> {
  return apiFetch<PageSEO>(
    apiUrl('/api/public/page-seo', { tenant, slug: pageSlug }),
    noCache
      ? { noCache: true }
      : { tags: [`tenant:${tenant}`, `seo:${tenant}`] },
  );
}

// ── Topics ──────────────────────────────────────────────────────────────────

export type Topic = {
  id: number;
  name: string;
  slug: string;
  type: string;
  description?: string;
  shortDescription?: string;
  speakableText?: string;
  icon?: string;
  headerImage?: MediaItem | number | null;
  curatedArticles?: Article[] | number[];
  articleCount?: number;
  order?: number;
};

export async function getTopics(tenant: string, noCache = false): Promise<PaginatedResponse<Topic> | null> {
  return apiFetch<PaginatedResponse<Topic>>(
    apiUrl('/api/public/topics', { tenant }),
    noCache
      ? { noCache: true }
      : { tags: [`tenant:${tenant}`, `topics:${tenant}`] },
  );
}

/**
 * Fetches a single topic + its articles in one round-trip.
 * Uses the engine's GET /api/public/topics/[slug] endpoint which returns:
 *   { topic: Topic, articles: PaginatedResponse<Article> }
 */
export async function getTopicWithArticles(
  tenant: string,
  topicSlug: string,
  noCache = false,
): Promise<{ topic: Topic; articles: PaginatedResponse<Article> } | null> {
  return apiFetch<{ topic: Topic; articles: PaginatedResponse<Article> }>(
    apiUrl(`/api/public/topics/${encodeURIComponent(topicSlug)}`, { tenant }),
    noCache
      ? { noCache: true }
      : { tags: [`tenant:${tenant}`, `topics:${tenant}`, `topic:${topicSlug}`] },
  );
}
