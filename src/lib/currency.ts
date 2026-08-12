/**
 * Currency Formatting Utility
 *
 * All prices in the engine are stored as integers in cents (e.g. 1999 = R19.99).
 * This module converts them to formatted display strings.
 */

const CURRENCY_CONFIG: Record<string, { locale: string; currency: string; symbol: string }> = {
  ZAR: { locale: 'en-ZA', currency: 'ZAR', symbol: 'R' },
  USD: { locale: 'en-US', currency: 'USD', symbol: '$' },
  EUR: { locale: 'en-DE', currency: 'EUR', symbol: '€' },
  GBP: { locale: 'en-GB', currency: 'GBP', symbol: '£' },
};

/**
 * Formats a price in cents to a human-readable currency string.
 *
 * @param cents   — price in cents (e.g. 1999)
 * @param currency — ISO 4217 code (default: 'ZAR')
 * @returns Formatted string (e.g. 'R19.99', '$19.99')
 *
 * @example
 * formatCurrency(1999)         // 'R19.99'
 * formatCurrency(1999, 'USD')  // '$19.99'
 * formatCurrency(0)            // 'R0.00'
 */
export function formatCurrency(cents: number, currency: string = 'ZAR'): string {
  const config = CURRENCY_CONFIG[currency] ?? CURRENCY_CONFIG.ZAR;

  try {
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(cents / 100);
  } catch {
    // Fallback if Intl fails (shouldn't happen in modern runtimes)
    return `${config.symbol}${(cents / 100).toFixed(2)}`;
  }
}

/**
 * Returns the currency symbol for a given currency code.
 */
export function getCurrencySymbol(currency: string = 'ZAR'): string {
  return CURRENCY_CONFIG[currency]?.symbol ?? 'R';
}

/**
 * Formats a price as a plain number (no symbol), useful for structured data.
 *
 * @example
 * formatPriceValue(1999) // '19.99'
 */
export function formatPriceValue(cents: number): string {
  return (cents / 100).toFixed(2);
}
