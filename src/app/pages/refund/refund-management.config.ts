import { search } from "@/components/modules/filter"
import {
  action,
  column,
  createColumns,
} from "@/components/modules/table/column-builder"
import { formatCurrency } from "@/lib/formatCurrency"
import type { Refund } from "@/types/data-types/refund/refund.types"

export const REFUND_PAGE_CONFIG = {
  title: "Refund management",
  description: "Review processed refunds and their payment details.",
} as const

export const REFUND_FILTER_CONFIG = [
  search({
    name: "searchTerm",
    label: "Search",
    placeholder: "Search refund, invoice, or customer...",
  }),
]

export const createRefundTableColumns = ({
  onOpen,
}: {
  onOpen: (refund: Refund) => void
}) =>
  createColumns<Refund>({
    resource: "refund",
    columns: [
      column("id", { label: "Refund", formatter: (value) => String(value ?? "").slice(-8) }),
      column("sale.invoiceNo", { label: "Invoice" }),
      column("sale.customer.name", {
        label: "Customer",
        formatter: (value) => value ?? "Walk-in customer",
      }),
      column("amount", {
        label: "Amount",
        align: "right",
        formatter: (value) => formatCurrency(Number(value ?? 0)),
      }),
      column("method", {
        label: "Method",
        formatter: (value) =>
          typeof value === "string" ? value.replaceAll("_", " ") : "—",
      }),
      column("items", {
        label: "Items",
        align: "right",
        formatter: (_, refund) =>
          refund.items?.reduce((total, item) => total + item.quantity, 0) ?? "—",
      }),
      column("processedBy.name", {
        label: "Processed by",
        formatter: (value) => value ?? "—",
      }),
      column.date("createdAt", { label: "Date" }),
      column.actions([action.view<Refund>({ onClick: onOpen })]),
    ],
  })
