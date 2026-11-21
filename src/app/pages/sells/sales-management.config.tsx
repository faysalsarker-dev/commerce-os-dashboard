import { dateRange, search, select } from "@/components/modules/filter"
import { column, createColumns } from "@/components/modules/table/column-builder"
import { formatCurrency } from "@/lib/formatCurrency"
import { SALE_CHANNEL_LABELS } from "@/types/data-types/sales/sales.types"
import type { SalesHistoryItem } from "@/types/data-types/sales/sales.types"

export const SALES_PAGE_CONFIG = {
  title: "Sales management",
  description: "Review completed sales, invoices, and payment details.",
} as const

export const SALES_FILTER_CONFIG = [
  search({
    name: "search",
    label: "Search",
    placeholder: "Search by invoice number...",
  }),
  dateRange({
    name: "date",
    label: "Sale date",
    placeholder: "Filter by sale date",
  }),
  select({
    name: "sort",
    label: "Sort",
    placeholder: "Sort",
    options: [
      { label: "Newest", value: "-date", default: true },
      { label: "Oldest", value: "date" },
    ],
  }),
]

export const createSalesTableColumns = () =>
  createColumns<SalesHistoryItem>({
    resource: "sell",
    columns: [
      column("invoiceNo", {
        label: "Sale",
        render: (sale) => (
          <div className="min-w-0 space-y-0.5">
            <p className="truncate font-medium">{sale.invoiceNo}</p>
            <p className="truncate text-sm">
              {sale.customerName || "Walk-in Customer"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {sale.customerPhone ?? "—"}
            </p>
          </div>
        ),
      }),
      column.number("totalProducts", {
        label: "Quantity",
        align: "right",
      }),
      column("date", {
        label: "Date",
        formatter: (value) => {
          if (!value) return "—"
          const date = new Date(String(value))
          return Number.isNaN(date.getTime())
            ? "—"
            : new Intl.DateTimeFormat(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              }).format(date)
        },
      }),
      column("channel", {
        label: "Channel",
        formatter: (value) =>
          typeof value === "string"
            ? (SALE_CHANNEL_LABELS[
                value as keyof typeof SALE_CHANNEL_LABELS
              ] ?? value)
            : "—",
      }),
      column("total", {
        label: "Price",
        align: "right",
        render: (sale) => (
          <div className="flex flex-col items-end tabular-nums">
            {sale.discount > 0 ? (
              <span className="text-xs text-muted-foreground line-through">
                {formatCurrency(sale.subtotal + sale.shippingFee)}
              </span>
            ) : null}
            <span className="font-medium">{formatCurrency(sale.total)}</span>
          </div>
        ),
      }),
      column("paymentStatus", {
        label: "Payment status",
        formatter: (value) =>
          typeof value === "string"
            ? value
                .replaceAll("_", " ")
                .toLowerCase()
                .replace(/^\w/, (letter) => letter.toUpperCase())
            : "—",
      }),
    ],
  })
