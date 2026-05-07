import type { ReactNode } from 'react';
import { AppIcons } from '@/components/icons/AppIcons';

type SearchToolbarProps<FilterOption extends string> = {
  className: string;
  searchBoxClassName: string;
  filterTabsClassName: string;
  searchValue: string;
  searchPlaceholder: string;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
  filterOptions: readonly FilterOption[];
  activeFilter: FilterOption;
  onFilterChange: (filterOption: FilterOption) => void;
  filterAriaLabel: string;
  middle?: ReactNode;
};

export function SearchToolbar<FilterOption extends string>({
  className,
  searchBoxClassName,
  filterTabsClassName,
  searchValue,
  searchPlaceholder,
  onSearchChange,
  onSearchClear,
  filterOptions,
  activeFilter,
  onFilterChange,
  filterAriaLabel,
  middle,
}: SearchToolbarProps<FilterOption>) {
  return (
    <div className={className}>
      <div className={searchBoxClassName}>
        {AppIcons.search}
        <input value={searchValue} onChange={(event) => onSearchChange(event.target.value)} placeholder={searchPlaceholder} />
        {searchValue && <button type="button" onClick={onSearchClear} aria-label="검색어 지우기">{AppIcons.x}</button>}
      </div>
      {middle}
      <div className={filterTabsClassName} aria-label={filterAriaLabel}>
        {filterOptions.map((filterOption) => (
          <button key={filterOption} type="button" className={activeFilter === filterOption ? 'is-active' : ''} onClick={() => onFilterChange(filterOption)}>
            {filterOption}
          </button>
        ))}
      </div>
    </div>
  );
}
