/**
 * JSON-LD Structured Data Builders
 *
 * Generates schema.org JSON-LD objects for search engine rich results.
 * Each builder returns a plain object - use the <JsonLd> component to
 * inject it into the page as a <script> tag.
 *
 * Product schema design:
 *   - Every field is conditional - missing data is never surfaced as empty
 *   - Follows schema.org 24.0 and Google's structured data guidelines
 *   - gtin, hasMerchantReturnPolicy, shippingDetails unlock Google Shopping
 *     enhanced snippets (free returns badge, shipping info, price comparison)
 *   - SpeakableSpecification targets voice search / AI assistant answers
 *   - llmCitationPreference is injected as <meta> in ProductPage.tsx
 */

import type { Product, ProductCategory, Article, FAQ, Service, MediaItem } from './api';
import type { TenantConfig } from './types';

//  Constants 

const AVAILABILITY: Record<string, string> = {
  inStock:      'https://schema.org/InStock',
  outOfStock:   'https://schema.org/OutOfStock',
  preOrder:     'https://schema.org/PreOrder',
  backOrder:    'https://schema.org/BackOrder',
  discontinued: 'https://schema.org/Discontinued',
};

const ITEM_CONDITION: Record<string, string> = {
  new:         'https://schema.org/NewCondition',
  refurbished: 'https://schema.org/RefurbishedCondition',
  used:        'https://schema.org/UsedCondition',
  damaged:     'https://schema.org/DamagedCondition',
};

const RETURN_FEES: Record<string, string> = {
  'free':       'https://schema.org/FreeReturn',
  'buyer-pays': 'https://schema.org/ReturnFeesCustomerResponsibility',
};

const RETURN_METHOD: Record<string, string> = {
  'mail':     'https://schema.org/ReturnByMail',
  'in-store': 'https://schema.org/ReturnInStore',
  // schema.org only supports one value; default to mail for 'both'
  'both':     'https://schema.org/ReturnByMail',
};

const WEIGHT_UNIT_CODE: Record<string, string> = {
  g: 'GRM', kg: 'KGM', ml: 'MLT', l: 'LTR',
};

const SUBSCRIPTION_UNIT_CODE: Record<string, string> = {
  weekly: 'WEE', monthly: 'MON', quarterly: 'QTR', annually: 'ANN',
};

// - Organization -

/** Collect populated flat social link values from SiteSettings into an array */
function buildSameAs(settings: TenantConfig['settings']): string[] {
  if (!settings) return [];
  return [
    settings.socialFacebook,
    settings.socialInstagram,
    settings.socialLinkedIn,
    settings.socialTwitter,
    settings.socialYoutube,
    settings.socialGoogle,
  ].filter((v): v is string => Boolean(v));
}

export function buildOrganizationLd(config: TenantConfig, siteUrl: string) {
  const settings = config.settings;
  const sameAs = buildSameAs(settings);
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings?.siteName ?? config.tenant.name,
    url: siteUrl,
    ...(settings?.logo && { logo: settings.logo.url }),
    ...(settings?.contactEmail && {
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: settings.contactEmail,
        ...(settings.contactPhone && { telephone: settings.contactPhone }),
      },
    }),
    ...(sameAs.length > 0 && { sameAs }),
  };
}

// ------------------------------------------------------------------------------

export function buildProductLd(
  product: Product,
  config: TenantConfig,
  productUrl: string,
): Record<string, unknown> {
  const currency = product.currency ?? config.settings?.currency ?? 'ZAR';
  const siteName = config.settings?.siteName ?? config.tenant.name;
  const images = resolveAllImages(product.images);
  const primaryImage = images[0] ?? null;

  // ------------------------------------------------------------------------------
  let availability = AVAILABILITY.inStock;
  if (product.availabilityStatus) {
    availability = AVAILABILITY[product.availabilityStatus] ?? AVAILABILITY.inStock;
  } else if (product.trackInventory && product.stockLevel != null && product.stockLevel <= 0) {
    availability = AVAILABILITY.outOfStock;
  }

  // ------------------------------------------------------------------------------
  const offer: Record<string, unknown> = {
    '@type': 'Offer',
    price: (product.price / 100).toFixed(2),
    priceCurrency: currency,
    availability,
    url: productUrl,
    seller: { '@type': 'Organization', name: siteName },
  };

  if (product.gtin)          offer.gtin = product.gtin;
  if (product.condition)     offer.itemCondition = ITEM_CONDITION[product.condition] ?? ITEM_CONDITION.new;
  if (product.sku)           offer.sku = product.sku;
  if (product.availableFrom) offer.availabilityStarts = product.availableFrom;
  if (product.availableUntil) offer.availabilityEnds = product.availableUntil;

  // Merchant return policy - unlocks Google's Free Returns badge
  if (product.returnDays != null) {
    offer.hasMerchantReturnPolicy = {
      '@type': 'MerchantReturnPolicy',
      applicableCountry: product.countryOfOrigin ?? 'ZA',
      returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
      merchantReturnDays: product.returnDays,
      returnMethod: RETURN_METHOD[product.returnMethod ?? 'mail'],
      returnFees: RETURN_FEES[product.returnFees ?? 'buyer-pays'],
    };
  }

  // Shipping details - unlocks shipping annotations in search results
  if (product.shippingCost != null || product.deliveryLeadTime || product.handlingTimeDays != null) {
    const shippingDetails: Record<string, unknown> = { '@type': 'OfferShippingDetails' };
    if (product.shippingCost != null) {
      shippingDetails.shippingRate = {
        '@type': 'MonetaryAmount',
        value: (product.shippingCost / 100).toFixed(2),
        currency,
      };
    }
    if (product.handlingTimeDays != null) {
      shippingDetails.handlingTime = {
        '@type': 'QuantitativeValue',
        minValue: 0,
        maxValue: product.handlingTimeDays,
        unitCode: 'DAY',
      };
    }
    if (product.deliveryRegions?.length) {
      shippingDetails.shippingDestination = product.deliveryRegions.map((r) => ({
        '@type': 'DefinedRegion',
        name: r.region,
      }));
    }
    offer.shippingDetails = shippingDetails;
  }

  // Volume pricing tiers  priceSpecification
  const priceSpecs: Record<string, unknown>[] = [];
  if (product.quantityDiscounts?.length) {
    for (const tier of product.quantityDiscounts) {
      const discountedPrice = tier.discountType === 'fixed'
        ? (product.price - tier.discountValue) / 100
        : (product.price * (1 - tier.discountValue / 100)) / 100;
      priceSpecs.push({
        '@type': 'UnitPriceSpecification',
        price: discountedPrice.toFixed(2),
        priceCurrency: currency,
        eligibleQuantity: { '@type': 'QuantitativeValue', minValue: tier.minQty },
      });
    }
  }

  // Subscription offer
  if (product.isSubscription && product.subscriptionInterval) {
    const subPrice = (product.subscriptionPrice ?? product.price) / 100;
    priceSpecs.push({
      '@type': 'UnitPriceSpecification',
      priceType: 'https://schema.org/SubscriptionPrice',
      price: subPrice.toFixed(2),
      priceCurrency: currency,
      billingDuration: {
        '@type': 'QuantitativeValue',
        value: 1,
        unitCode: SUBSCRIPTION_UNIT_CODE[product.subscriptionInterval] ?? 'MON',
      },
    });
  }

  if (priceSpecs.length > 0) offer.priceSpecification = priceSpecs;

  // ------------------------------------------------------------------------------
  const schemaType = product.productType === 'service' ? 'Service' : 'Product';

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: product.metaTitle || product.name,
    description: product.metaDescription || product.shortDescription || product.aiSummary,
    url: productUrl,
    offers: offer,
    brand: {
      '@type': 'Brand',
      name: product.brand || siteName,
      ...(product.brandUrl && { sameAs: product.brandUrl }),
    },
  };

  // Images - include all, not just first
  if (images.length === 1)      schema.image = images[0].url;
  else if (images.length > 1)   schema.image = images.map((img) => img.url);

  // Identifiers & physical attributes
  if (product.sku)               schema.sku = product.sku;
  if (product.gtin)              schema.gtin = product.gtin;
  if (product.manufacturer)      schema.manufacturer = { '@type': 'Organization', name: product.manufacturer };
  if (product.countryOfOrigin)   schema.countryOfOrigin = product.countryOfOrigin;
  if (product.material)          schema.material = product.material;
  if (product.color)             schema.color = product.color;

  if (product.weight != null) {
    schema.weight = {
      '@type': 'QuantitativeValue',
      value: product.weight,
      unitCode: WEIGHT_UNIT_CODE[product.weightUnit ?? 'g'] ?? 'GRM',
    };
  }

  // Service geo fields
  if (product.productType === 'service') {
    if (product.serviceArea) schema.areaServed = product.serviceArea;
    if (product.geoLatitude != null && product.geoLongitude != null) {
      schema.geo = {
        '@type': 'GeoCoordinates',
        latitude: product.geoLatitude,
        longitude: product.geoLongitude,
      };
    }
  }

  // Competitor comparison  additionalProperty for AI "vs" queries
  if (product.comparedTo?.length) {
    schema.additionalProperty = product.comparedTo.map((c) => ({
      '@type': 'PropertyValue',
      name: `vs ${c.competitorProduct}`,
      value: `Advantage: ${c.advantage}${c.disadvantage ? `. Limitation: ${c.disadvantage}` : ''}`,
    }));
  }

  // Certifications  hasCertification
  if (product.certifications?.length) {
    schema.hasCertification = product.certifications.map((cert) => ({
      '@type': 'Certification',
      name: cert.certName,
      ...(cert.issuedBy && { issuedBy: { '@type': 'Organization', name: cert.issuedBy } }),
      ...(cert.certId && { certificationIdentification: cert.certId }),
      ...(cert.certUrl && { url: cert.certUrl }),
    }));
  }

  // Awards
  if (product.awards?.length) schema.award = product.awards.map((a) => a.award);

  // Compatibility
  if (product.worksWith?.length) {
    schema.isCompatibleWith = product.worksWith.map((w) => ({ '@type': 'Product', name: w.item }));
  }
  if (product.isAccessoryFor) {
    schema.isAccessoryOrSparePartFor = { '@type': 'Product', name: product.isAccessoryFor };
  }

  // Sustainability
  if (product.carbonFootprint) {
    schema.hasMeasurement = {
      '@type': 'QuantitativeValue',
      name: 'Carbon Footprint',
      value: product.carbonFootprint,
    };
  }

  // Demo video  VideoObject
  if (product.demoVideo) {
    schema.video = {
      '@type': 'VideoObject',
      name: product.demoVideoTitle || `${product.name} - Demo`,
      description: product.shortDescription || product.aiSummary || `Product demo for ${product.name}`,
      contentUrl: product.demoVideo,
      ...(primaryImage && { thumbnailUrl: primaryImage.url }),
      uploadDate: product.createdAt,
    };
  }

  // 3D Model (AR in mobile search results - early adopter advantage)
  if (product.model3dUrl) {
    schema.subjectOf = {
      '@type': '3DModel',
      contentUrl: product.model3dUrl,
      name: product.model3dAlt || `${product.name} - 3D View`,
      encodingFormat: 'model/gltf-binary',
    };
  }

  // SpeakableSpecification - voice search & AI assistant answers
  if (product.voiceSearchPhrase || product.aiSummary) {
    schema.speakable = {
      '@type': 'SpeakableSpecification',
      cssSelector: ['[data-speakable]'],
    };
  }

  // Expert pros  Review
  if (product.expertPros?.length) {
    schema.review = {
      '@type': 'Review',
      author: { '@type': 'Organization', name: siteName },
      reviewBody: product.expertPros.map((p) => p.pro).join('. '),
    };
  }

  // Curated related products
  if (Array.isArray(product.relatedProducts) && product.relatedProducts.length > 0) {
    const rels = (product.relatedProducts as Product[]).filter((r) => typeof r === 'object' && r.slug);
    if (rels.length > 0) {
      const baseUrl = productUrl.split('/shop/')[0];
      schema.isRelatedTo = rels.map((r) => ({
        '@type': 'Product',
        name: r.name,
        url: `${baseUrl}/shop/${r.slug}`,
      }));
    }
  }

  return schema;
}

// ------------------------------------------------------------------------------

export function buildCategoryHubLd(
  category: ProductCategory,
  products: Product[],
  siteUrl: string,
  siteName: string,
): Record<string, unknown>[] {
  const schemas: Record<string, unknown>[] = [];
  const categoryUrl = `${siteUrl}/shop?category=${category.slug}`;

  // 1. CollectionPage with entity linking via wikidataUrl
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.metaTitle || category.name,
    description: category.aiSummary || category.metaDescription || category.description,
    url: categoryUrl,
    ...(category.wikidataUrl && {
      about: {
        '@type': 'Thing',
        name: category.name,
        sameAs: category.wikidataUrl,
      },
    }),
    ...(products.length > 0 && {
      hasPart: {
        '@type': 'ItemList',
        numberOfItems: products.length,
        itemListElement: products.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Product',
            name: p.name,
            url: `${siteUrl}/shop/${p.slug}`,
          },
        })),
      },
    }),
    isPartOf: { '@type': 'WebSite', name: siteName, url: siteUrl },
  });

  // 2. FAQPage if categoryFaqs populated
  if (category.categoryFaqs?.length) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: category.categoryFaqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    });
  }

  return schemas;
}

// ------------------------------------------------------------------------------

export function buildArticleLd(
  article: Article,
  config: TenantConfig,
  articleUrl: string,
) {
  const image = resolveMedia(article.heroImage);
  const siteName = config.settings?.siteName ?? config.tenant.name;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    ...(article.excerpt && { description: article.excerpt }),
    ...(image && { image: image.url }),
    url: articleUrl,
    ...(article.publishedAt && { datePublished: article.publishedAt }),
    dateModified: article.updatedAt,
    author: {
      '@type': article.author ? 'Person' : 'Organization',
      name: article.author ?? siteName,
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      ...(config.settings?.logo && { logo: { '@type': 'ImageObject', url: config.settings.logo.url } }),
    },
  };
}

// ------------------------------------------------------------------------------

/**
 * Builds a full FAQPage schema with knowledge graph attribution.
 *
 * Beyond the basic Q&A pairs this adds:
 *  - publisher  Organization (brand attribution - answers are by THIS brand)
 *  - about      Organization (what the page is about)
 *  - speakable  SpeakableSpecification (voice/AI assistant targeting)
 *  - category grouping via DefinedTermSet (topic clustering for AI)
 *
 * Without publisher/about, FAQ answers are anonymous knowledge floating in the
 * void. With them, Google and AI engines can attribute authority to the brand
 * entity and weight the answers accordingly.
 */
export function buildFAQPageLd(
  faqs: FAQ[],
  config?: TenantConfig,
  siteUrl?: string,
) {
  const siteName = config?.settings?.siteName ?? config?.tenant.name;
  const logoUrl  = config?.settings?.logo?.url;
  const pageUrl  = siteUrl ? `${siteUrl}/faqs` : undefined;

  // Publisher entity - ties answers to the brand for knowledge graph attribution
  const publisher = siteName
    ? {
        '@type': 'Organization',
        name: siteName,
        ...(siteUrl && { url: siteUrl }),
        ...(logoUrl && { logo: logoUrl }),
      }
    : undefined;

  // Group FAQs by category for DefinedTermSet topic clusters
  const categoryMap = new Map<string, FAQ[]>();
  for (const faq of faqs) {
    const cat = faq.category || 'General';
    if (!categoryMap.has(cat)) categoryMap.set(cat, []);
    categoryMap.get(cat)!.push(faq);
  }
  const hasMeaningfulCategories = categoryMap.size > 1 ||
    (categoryMap.size === 1 && !categoryMap.has('General'));

  // DefinedTermSet - helps AI engines understand topic taxonomy
  const definedTermSets = hasMeaningfulCategories
    ? Array.from(categoryMap.entries()).map(([cat, catFaqs]) => ({
        '@type': 'DefinedTermSet',
        name: cat,
        ...(pageUrl && { url: `${pageUrl}#${encodeURIComponent(cat.toLowerCase().replace(/\s+/g, '-'))}` }),
        hasDefinedTerm: catFaqs.map((faq) => ({
          '@type': 'DefinedTerm',
          name: faq.question,
          description: typeof faq.answer === 'string' ? faq.answer.slice(0, 300) : '',
          inDefinedTermSet: cat,
        })),
      }))
    : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    ...(pageUrl && { url: pageUrl }),
    ...(publisher && { publisher }),
    ...(publisher && { about: publisher }),
    // SpeakableSpecification - targets [data-speakable] elements for voice/AI
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['[data-speakable]'],
    },
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      // Link each question back to the publisher for attribution
      ...(publisher && { author: publisher }),
      acceptedAnswer: {
        '@type': 'Answer',
        text: typeof faq.answer === 'string' ? faq.answer : '',
        ...(publisher && { author: publisher }),
      },
    })),
    // Topic clusters - additional schema for AI knowledge graph traversal
    ...(definedTermSets && { subjectOf: definedTermSets }),
  };
}


//  Service 

export function buildServiceLd(
  service: Service,
  config: TenantConfig,
  serviceUrl: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title ?? (service as any).name,
    ...(service.shortDesc ?? service.shortDescription
      ? { description: service.shortDesc ?? service.shortDescription }
      : {}),
    url: serviceUrl,
    provider: {
      '@type': 'Organization',
      name: config.settings?.siteName ?? config.tenant.name,
    },
  };
}

//  Breadcrumb List 

export type BreadcrumbItem = {
  name: string;
  url: string;
};

export function buildBreadcrumbLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

//  Local Business 

/**
 * Builds a full LocalBusiness schema from SiteSettings.
 * Reads address, geo, phone, opening hours, and social links directly
 * from the engine's structured data - no manual address param needed.
 */
export function buildLocalBusinessLd(config: TenantConfig, siteUrl: string) {
  const s = config.settings;
  const siteName = s?.siteName ?? config.tenant.name;
  const sameAs = buildSameAs(s);

  // Structured address from SiteSettings
  const hasAddress = s?.addressStreet || s?.addressCity || s?.addressPostalCode;
  const address = hasAddress
    ? {
        '@type': 'PostalAddress',
        ...(s?.addressStreet     && { streetAddress:   s.addressStreet }),
        ...(s?.addressCity       && { addressLocality: s.addressCity }),
        ...(s?.addressProvince   && { addressRegion:   s.addressProvince }),
        ...(s?.addressPostalCode && { postalCode:      s.addressPostalCode }),
        ...(s?.addressCountry    && { addressCountry:  s.addressCountry }),
      }
    : null;

  // OpeningHoursSpecification - structured and ready to use directly
  const openingHoursSpec = s?.openingHours
    ?.filter((h) => !h.isClosed)
    .map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.dayOfWeek,
      opens:  h.opens  ?? '00:00',
      closes: h.closes ?? '00:00',
    }));

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: siteName,
    url: siteUrl,
    ...(s?.contactEmail && { email: s.contactEmail }),
    ...(s?.contactPhone && { telephone: s.contactPhone }),
    ...(s?.logo && { image: s.logo.url, logo: s.logo.url }),
    ...(address && { address }),
    ...(s?.geoLat != null && s?.geoLng != null && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude:  s.geoLat,
        longitude: s.geoLng,
      },
    }),
    ...(openingHoursSpec?.length && { openingHoursSpecification: openingHoursSpec }),
    ...(sameAs.length > 0 && { sameAs }),
  };
}


//  Helpers 

function resolveAllImages(
  images?: Array<{ image: MediaItem }>,
): MediaItem[] {
  if (!images?.length) return [];
  return images.map((i) => i.image).filter(Boolean) as MediaItem[];
}

function resolveMedia(
  media: MediaItem | number | null | undefined,
): MediaItem | null {
  if (!media || typeof media === 'number') return null;
  return media;
}
