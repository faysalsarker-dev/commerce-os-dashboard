/* eslint-disable @typescript-eslint/no-explicit-any */
// types.ts
// Pure types — no Redux, no RTK Query, no page-specific knowledge.

export type FilterType = "search" | "select" | "multiSelect" | "dateRange" | "numberRange"

export interface Option {
  label: string
  value: string
  /** Mark this option as the default/pre-selected one for its filter. */
  default?: boolean
}

interface BaseFilterConfig {
  name: string
  type: FilterType
  label?: string
  placeholder?: string
  className?: string
}

export interface SearchFilterConfig extends BaseFilterConfig {
  type: "search"
}

export interface SelectFilterConfig extends BaseFilterConfig {
  type: "select"
  options: Option[]
}

export interface MultiSelectFilterConfig extends BaseFilterConfig {
  type: "multiSelect"
  options: Option[]
}

export interface DateRangeFilterConfig extends BaseFilterConfig {
  type: "dateRange"
}

export interface NumberRangeFilterConfig extends BaseFilterConfig {
  type: "numberRange"
  min?: number
  max?: number
  step?: number
  /** Shown before each input, e.g. "$" for a price filter. */
  prefix?: string
}

export type FilterConfig =
  | SearchFilterConfig
  | SelectFilterConfig
  | MultiSelectFilterConfig
  | DateRangeFilterConfig
  | NumberRangeFilterConfig

export type FilterValues = Record<string, any>

export interface UseFilterOptions<T extends FilterValues> {
  /** Initial / "empty" state for every field. Source of truth for hasFilters and reset(). */
  defaultValues: T
  /**
   * Per-field debounce in ms. Fields not listed are applied instantly.
   * Example: { search: 300 } — only `search` is debounced, status/category/date stay immediate.
   */
  debounceMs?: Partial<Record<keyof T, number>>
  /** Sync values to the URL query string (?search=...&status=...). Off by default. */
  syncToUrl?: boolean
  /** Page size for the built-in pagination state. Default 10. */
  pageSize?: number
  /** Default sort value, e.g. "-createdAt". Omit if the page has no sort control. */
  defaultSort?: string
}

export interface UseFilterReturn<T extends FilterValues> {
  /** Live values — update on every keystroke / selection. Use these to control inputs. */
  values: T
  /** Debounced per-field. Use these as the RTK Query hook argument. */
  debouncedValues: T
  setValue: <K extends keyof T>(name: K, value: T[K]) => void
  setValues: (partial: Partial<T>) => void
  reset: () => void
  remove: (name: keyof T) => void
  hasFilters: boolean
  activeFilterKeys: (keyof T)[]

  // Pagination — owned by the hook so every page resets to page 1 the same way
  // whenever a filter or the sort changes, instead of each page reimplementing it.
  page: number
  pageSize: number
  setPage: (page: number) => void
  nextPage: () => void
  prevPage: () => void

  // Sort — kept separate from `values` so it never shows up as an "active filter" chip.
  sort: string | undefined
  setSort: (value: string) => void

  /** debouncedValues + sort + page + pageSize in one object — pass straight to your RTK Query hook. */
  queryParams: T & { sort?: string; page: number; pageSize: number }
}