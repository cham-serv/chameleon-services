/**
 * Chameleon Analytics — Ecommerce Event Layer
 *
 * GA4-compatible ecommerce events. Emits to window.dataLayer (consumed by
 * Google Tag Manager / GA4) and stubs a Chameleon internal beacon for the
 * future in-CMS analytics dashboard.
 *
 * All prices are in RANDS (not cents). The engine stores cents; divide by 100
 * before calling these functions.
 *
 * Standard GA4 ecommerce event names are used so any analytics tool that
 * understands GA4 schema (GA4, Plausible, Fathom, PostHog, etc.) can consume
 * these events without configuration.
 *
 * @see https://developers.google.com/analytics/devguides/collection/ga4/reference/events
 */

export type EcommerceItem = {
  item_id: string;        // product ID (as string)
  item_name: string;      // product name
  item_category?: string; // category name
  item_variant?: string;  // variant label (e.g. "Black / Size 42")
  item_brand?: string;    // brand name
  price: number;          // unit price IN RANDS (not cents)
  quantity: number;
};

type EcommerceEventPayload = {
  currency: string;
  value?: number;             // total value IN RANDS
  items: EcommerceItem[];
  transaction_id?: string;    // order number (e.g. "ORD-00042")
  shipping?: number;          // IN RANDS
  tax?: number;               // IN RANDS
};

/**
 * Push an ecommerce event to window.dataLayer.
 * Safe to call on server (no-ops silently).
 */
function pushToDataLayer(event: string, payload: EcommerceEventPayload): void {
  if (typeof window === 'undefined') return;

  const dataLayer = ((window as any).dataLayer = (window as any).dataLayer || []);

  // GA4 requires clearing ecommerce before each push to prevent data bleed
  dataLayer.push({ ecommerce: null });
  dataLayer.push({ event, ecommerce: payload });
}

// - Public API -

/**
 * Fire when a product detail page is viewed.
 * Wire into ProductPage on mount.
 */
export function trackViewItem(
  item: EcommerceItem,
  currency: string = 'ZAR',
): void {
  pushToDataLayer('view_item', {
    currency,
    value: item.price,
    items: [item],
  });
}

/**
 * Fire when a product is added to the cart.
 * Wire into AddToCartButton onClick after successful addItem call.
 */
export function trackAddToCart(
  item: EcommerceItem,
  currency: string = 'ZAR',
): void {
  pushToDataLayer('add_to_cart', {
    currency,
    value: item.price * item.quantity,
    items: [item],
  });
}

/**
 * Fire when a product is removed from the cart.
 * Wire into cart remove button.
 */
export function trackRemoveFromCart(
  item: EcommerceItem,
  currency: string = 'ZAR',
): void {
  pushToDataLayer('remove_from_cart', {
    currency,
    value: item.price * item.quantity,
    items: [item],
  });
}

/**
 * Fire when the full cart page is viewed.
 * Wire into CartPage on mount.
 */
export function trackViewCart(
  items: EcommerceItem[],
  totalValue: number,
  currency: string = 'ZAR',
): void {
  pushToDataLayer('view_cart', {
    currency,
    value: totalValue,
    items,
  });
}

/**
 * Fire when the checkout page loads.
 * Wire into CheckoutPage on mount.
 */
export function trackBeginCheckout(
  items: EcommerceItem[],
  totalValue: number,
  currency: string = 'ZAR',
): void {
  pushToDataLayer('begin_checkout', {
    currency,
    value: totalValue,
    items,
  });
}

/**
 * Fire when the customer completes the shipping section.
 * Wire into CheckoutPage on shipping section completion.
 */
export function trackAddShippingInfo(
  items: EcommerceItem[],
  totalValue: number,
  shippingCost: number,
  currency: string = 'ZAR',
): void {
  pushToDataLayer('add_shipping_info', {
    currency,
    value: totalValue,
    shipping: shippingCost,
    items,
  });
}

/**
 * Fire when an order is successfully created.
 * Wire into CheckoutPage after successful submitCheckout() call.
 *
 * @param transactionId  Order number e.g. "ORD-00042"
 * @param total          Total in RANDS (not cents)
 * @param shipping       Shipping cost in RANDS
 */
export function trackPurchase(
  transactionId: string,
  items: EcommerceItem[],
  total: number,
  shipping: number,
  currency: string = 'ZAR',
): void {
  pushToDataLayer('purchase', {
    currency,
    transaction_id: transactionId,
    value: total,
    shipping,
    items,
  });
}

/**
 * Convert a cart item to a GA4 EcommerceItem.
 * Prices in the cart store are in CENTS — this converts to RANDS.
 */
export function cartItemToEcommerceItem(item: {
  productId: number;
  name: string;
  price: number;       // cents
  quantity: number;
  variantLabel?: string;
}): EcommerceItem {
  return {
    item_id: String(item.productId),
    item_name: item.name,
    item_variant: item.variantLabel,
    price: item.price / 100,      // convert cents to rands
    quantity: item.quantity,
  };
}
