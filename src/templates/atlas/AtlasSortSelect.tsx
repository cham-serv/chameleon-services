'use client';

import { useRouter } from 'next/navigation';

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A-Z' },
];

type AtlasSortSelectProps = {
  currentSort: SortOption;
  currentCategory?: string;
};

export function AtlasSortSelect({ currentSort, currentCategory }: AtlasSortSelectProps) {
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const sort = e.target.value as SortOption;
    const params = new URLSearchParams();
    if (currentCategory) params.set('category', currentCategory);
    if (sort !== 'newest') params.set('sort', sort);
    const qs = params.toString();
    router.replace(`/shop${qs ? `?${qs}` : ''}`);
  }

  return (
    <div className="atlas-sort-wrapper">
      <label htmlFor="atlas-sort-select" className="atlas-sort-label">
        Sort by:
      </label>
      <select
        id="atlas-sort-select"
        value={currentSort}
        onChange={handleChange}
        className="atlas-input atlas-sort-select"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
