'use client';

/**
 * AtlasSortSelect — Client Component
 *
 * Thin wrapper around a native <select> that navigates on change.
 * Used by ShopPage for sort control.
 */

type Props = {
  options: { value: string; label: string }[];
  activeSort: string;
  baseUrl: string;
};

export default function AtlasSortSelect({ options, activeSort, baseUrl }: Props) {
  return (
    <select
      id="atlas-sort"
      className="atlas-select"
      defaultValue={activeSort}
      style={{
        width: 'auto',
        padding: '0.5rem 2rem 0.5rem 0.75rem',
        fontSize: '0.8125rem',
      }}
      onChange={(e) => {
        const url = new URL(baseUrl, window.location.origin);
        if (e.target.value !== 'newest') {
          url.searchParams.set('sort', e.target.value);
        } else {
          url.searchParams.delete('sort');
        }
        // Reset to page 1 on sort change
        url.searchParams.delete('page');
        window.location.href = url.pathname + url.search;
      }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
