// filterConfigs.ts
// Factory functions so pages describe filters declaratively, e.g.:
//
// const productFilters = [
//   search({ name: "search", placeholder: "Search products..." }),
//   select({ name: "status", placeholder: "Status", options: statusOptions }),
//   select({ name: "category", placeholder: "Category", options: categoryOptions }),
// ]

import type {
  DateRangeFilterConfig,
  FilterConfig,
  MultiSelectFilterConfig,
  NumberRangeFilterConfig,
  Option,
  SearchFilterConfig,
  SelectFilterConfig,
} from "@/types/filter/filter.types"

export function search(config: Omit<SearchFilterConfig, "type">): SearchFilterConfig {
  return { type: "search", ...config }
}

export function select(
  config: Omit<SelectFilterConfig, "type">
): SelectFilterConfig {
  return { type: "select", ...config }
}

export function multiSelect(
  config: Omit<MultiSelectFilterConfig, "type">
): MultiSelectFilterConfig {
  return { type: "multiSelect", ...config }
}

export function dateRange(
  config: Omit<DateRangeFilterConfig, "type">
): DateRangeFilterConfig {
  return { type: "dateRange", ...config }
}

export function numberRange(
  config: Omit<NumberRangeFilterConfig, "type">
): NumberRangeFilterConfig {
  return { type: "numberRange", ...config }
}

/**
 * Derives useFilter's `defaultValues` straight from your filters config, honoring
 * `{ default: true }` on select/multiSelect options — so a status filter can default
 * to "active" without repeating that value in two places.
 *
 *   const productFilters = [
 *     select({ name: "status", options: [
 *       { label: "Active", value: "active", default: true },
 *       { label: "Draft", value: "draft" },
 *     ]}),
 *   ]
 *
 *   const filter = useFilter({ defaultValues: getDefaultValues(productFilters) })
 */
export function getDefaultValues(filters: FilterConfig[]): Record<string, any> {
  const defaults: Record<string, any> = {}

  for (const config of filters) {
    switch (config.type) {
      case "search":
        defaults[config.name] = ""
        break
      case "select": {
        const defaultOption = config.options.find((o) => o.default)
        defaults[config.name] = defaultOption?.value ?? ""
        break
      }
      case "multiSelect": {
        const defaultOptions = config.options.filter((o) => o.default).map((o) => o.value)
        defaults[config.name] = defaultOptions
        break
      }
      case "dateRange":
        defaults[config.name] = { from: undefined, to: undefined }
        break
      case "numberRange":
        defaults[config.name] = { min: undefined, max: undefined }
        break
    }
  }

  return defaults
}

export type { Option }
