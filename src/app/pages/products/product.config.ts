import { search, select } from "@/components/modules/filter"
import {
  action,
  column,
  createColumns,
} from "@/components/modules/table/column-builder"
import type { Product } from "@/types/data-types/product/product.types"

export const PRODUCT_PAGE_CONFIG = {
  title: "Products",
  description: "Manage your products and inventory.",
  createDialog: {
    title: "Add Product",
    description:
      "Create the product container. You can add colors, sizes, and stock afterwards.",
    submitLabel: "Create Product",
  },
} as const



export const PRODUCT_SORT_OPTIONS = [
  { label: "Newest first", value: "-createdAt", default: true },
  { label: "Oldest first", value: "createdAt" },
  { label: "Price: low to high", value: "price" },
  { label: "Price: high to low", value: "-price" },
  { label: "Stock: low to high", value: "stock" },
]

export const PRODUCT_FILTER_CONFIG = [
  search({
    name: "search",
    label: "Search",
    placeholder: "Search by name or SKU...",
  }),
  select({
    name: "sort",
    label: "Sort",
    placeholder: "Sort",
    options: PRODUCT_SORT_OPTIONS,
  }),
]

type ProductTableHandlers = {
  onOpen: (product: Product) => void
  onDelete: (product: Product) => void
}

export const createProductTableColumns = ({
  onOpen,
  onDelete,
}: ProductTableHandlers) =>
  createColumns<Product>({
    resource: "product",
    columns: [
      column("name"),
      column("category", {
        label: "Category",
        formatter: (_, row) => row?.category?.name ?? "-",
      }),
      column.currency("costPrice", {
        label: "Cost Price",
        sortable: true,
        currency: "BDT",
      }),
      column.currency("sellingPrice", {
        label: "Selling Price",
        currency: "BDT",
      }),
      column("colors", {
        label: "Colors",
        align: "center",
        formatter: (_, row) => row?.colors?.length ?? 0,
      }),
      column.date("createdAt"),
      column.actions([
        action.view<Product>({ onClick: onOpen }),
        action.edit<Product>({ onClick: onOpen }),
        action.delete<Product>({
          can: "delete",
          confirmTitle: "Delete Product",
          confirmDescription: "This product will be permanently deleted.",
          onClick: onDelete,
        }),
      ]),
    ],
  })
