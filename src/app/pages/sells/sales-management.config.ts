import { dateRange, search } from "@/components/modules/filter"
import {
  action,
  column,
  createColumns,
} from "@/components/modules/table/column-builder"
import { formatCurrency } from "@/lib/formatCurrency"
import type { SaleRecord } from "@/types/data-types/sales/sales.types"

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
]

export const createSalesTableColumns = ({
  onOpen,
}: {
  onOpen: (sale: SaleRecord) => void
}) =>
  createColumns<SaleRecord>({
    resource: "sell",
    columns: [
      column("invoiceNumber", { label: "Invoice" }),
      column("itemsCount", { label: "Items", align: "right" }),
      column("totalAmount", {
        label: "Total",
        align: "right",
        formatter: (value) => formatCurrency(Number(value ?? 0)),
      }),
      column("paymentMethod", {
        label: "Payment method",
        formatter: (value) =>
          typeof value === "string" ? value.replaceAll("_", " ") : "—",
      }),
      column.date("createdAt", { label: "Date" }),
      column.actions([action.view<SaleRecord>({ onClick: onOpen })]),
    ],
  })
