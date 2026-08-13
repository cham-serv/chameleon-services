/**
 * CurrencyFormatter Component
 *
 * A thin Server Component wrapper around formatCurrency() from lib/currency.ts.
 * Convenience component so templates can use JSX instead of importing the utility.
 *
 * @example
 * <CurrencyFormatter cents={1999} />              // R19.99
 * <CurrencyFormatter cents={1999} currency="USD" /> // $19.99
 */

import { formatCurrency } from '@/lib/currency';

type CurrencyFormatterProps = {
  /** Price in cents */
  cents: number;
  /** ISO 4217 currency code. Default: 'ZAR' */
  currency?: string;
  className?: string;
};

export function CurrencyFormatter({
  cents,
  currency = 'ZAR',
  className,
}: CurrencyFormatterProps) {
  return <span className={className}>{formatCurrency(cents, currency)}</span>;
}
