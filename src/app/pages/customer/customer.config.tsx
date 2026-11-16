import { createColumnHelper } from "@tanstack/react-table"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { search, select } from "@/components/modules/filter"
import type { Customer } from "@/types/data-types/customer/customer.types"
import { formatCurrency } from "@/lib/formatCurrency"
import { formatDate, initialsFrom } from "@/lib/format"

export const CUSTOMER_PAGE_CONFIG = {
  title: "Customers",
  description:
    "A complete view of your customer relationships, orders, and account balances.",
} as const

export const CUSTOMER_PAGE_SIZE = 10

export const CUSTOMER_SORT_OPTIONS = [
  { label: "Newest first", value: "-createdAt", default: true },
  { label: "Oldest first", value: "createdAt" },
  { label: "Highest spend", value: "-totalSpent" },
  { label: "Highest outstanding balance", value: "-totalDue" },
]

export const CUSTOMER_FILTER_CONFIG = [
  search({
    name: "searchTerm",
    label: "Search",
    placeholder: "Search customers by name or phone...",
  }),
  select({
    name: "sort",
    label: "Sort",
    placeholder: "Sort customers",
    options: CUSTOMER_SORT_OPTIONS,
  }),
]

const column = createColumnHelper<Customer>()

export function createCustomerTableColumns({
  onOpen,
}: {
  onOpen: (customer: Customer) => void
}) {
  return [
    column.display({
      id: "customer",
      header: "Customer",
      cell: ({ row }) => (
        <div className="flex min-w-52 items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-xs font-semibold text-primary">
          {initialsFrom(row.original.name) || "C"}
        </span>
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">
              {row.original.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              Added {formatDate(row.original.createdAt)}
            </p>
          </div>
        </div>
      ),
    }),
    column.accessor("phone", {
      header: "Phone",
      cell: ({ getValue }) =>
        getValue() || (
          <span className="text-muted-foreground">Not provided</span>
        ),
    }),
    column.accessor("totalOrders", {
      header: "Orders",
      cell: ({ getValue }) => (
        <span className="font-medium tabular-nums">{getValue()}</span>
      ),
    }),
    column.accessor("totalSpent", {
      header: "Lifetime spend",
      cell: ({ getValue }) => (
        <span className="font-medium tabular-nums">
          {formatCurrency(getValue())}
        </span>
      ),
    }),
    column.accessor("totalDue", {
      header: "Outstanding",
      cell: ({ getValue }) => (
        <span
          className={
            getValue() > 0
              ? "font-medium text-amber-700 dark:text-amber-400"
              : "text-muted-foreground"
          }
        >
          {formatCurrency(getValue())}
        </span>
      ),
    }),
    column.accessor("lastPurchaseAt", {
      header: "Last purchase",
      cell: ({ getValue }) => formatDate(getValue()),
    }),
    column.display({
      id: "view",
      header: "",
      cell: ({ row }) => (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-1.5 text-primary"
          onClick={() => onOpen(row.original)}
        >
          View profile <ArrowUpRight className="size-3.5" />
        </Button>
      ),
    }),
  ]
}
