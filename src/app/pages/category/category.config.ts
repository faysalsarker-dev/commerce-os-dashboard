import { search, select } from "@/components/modules/filter"
import {
  action,
  column,
  createColumns,
} from "@/components/modules/table/column-builder"
import type { Category } from "@/types/data-types/category/category.types"

export const CATEGORY_PAGE_CONFIG = {
  title: "Category",
  description: "Manage your product categories.",
} as const

const CATEGORY_STATUS_OPTIONS = [
  { label: "Active", value: true },
  { label: "Inactive", value: false },
]

const CATEGORY_SORT_OPTIONS = [
  { label: "Newest", value: "-createdAt" },
  { label: "Oldest", value: "createdAt" },
  { label: "Display Order (Low to High)", value: "displayOrder" },
  { label: "Display Order (High to Low)", value: "-displayOrder" },
]

export const CATEGORY_FILTER_CONFIG = [
  search({
    name: "searchTerm",
    label: "Search",
    placeholder: "Search by name",
  }),
  select({
    name: "isActive",
    label: "Status",
    placeholder: "Status",
    options: CATEGORY_STATUS_OPTIONS,
  }),
  select({
    name: "sort",
    label: "Sort",
    placeholder: "Sort",
    options: CATEGORY_SORT_OPTIONS,
  }),
]

type CategoryTableHandlers = {
  onView: (category: Category) => void
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
}

// The config owns the table shape; the page injects its API/navigation handlers.
export const createCategoryTableColumns = ({
  onView,
  onEdit,
  onDelete,
}: CategoryTableHandlers) =>
  createColumns<Category>({
    resource: "category",
    columns: [
      column.image("image", {
        label: "Image",
        size: 44,
        rounded: "md",
      }),
      column("name"),
      column("description", {
        formatter: (value) => (value ? `${String(value).slice(0, 50).toUpperCase()}...` : "-"),
      }),
      column.status("isActive", { label: "Status",
        formatter: (value) => {
  const isActive = value as boolean;

  return isActive ? "Active" : "Inactive";
       }}),
      column.number("displayOrder", { label: "Order" }),
      column.date("createdAt", { label: "Created" }),
      column.actions([
        action.view<Category>({ onClick: onView }),
        action.edit<Category>({ onClick: onEdit }),
        action.delete<Category>({
          confirmTitle: "Delete Category",
          confirmDescription: "This category will be permanently deleted.",
          onClick: onDelete,
        }),
      ]),
    ],
  })
