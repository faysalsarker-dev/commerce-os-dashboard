import { createColumnHelper } from "@tanstack/react-table"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { search, select } from "@/components/modules/filter"
import type {
  OrderListItem,
  OrderStatus,
} from "@/types/data-types/order/order.types"
import { formatCurrency } from "@/lib/formatCurrency"
import { formatDate } from "@/lib/format"
import type { EntityFormConfig } from "@/types/form/form.types"
import type { OrderCreateFormValues } from "@/types/validations/order/order-create.validation"

export const ORDER_PAGE_CONFIG = {
  title: "Orders",
  description:
    "Track customer orders, payment status, and fulfillment progress.",
} as const

export const ORDER_PAGE_SIZE = 10

export const ORDER_CREATE_FORM_CONFIG: EntityFormConfig<OrderCreateFormValues> =
  [
    {
      name: "advanceAmount",
      label: "Customer advance",
      kind: "number",
      min: 0,
      step: 0.01,
      prefix: "৳",
      description: "Optional amount received when this order is placed.",
      placeholder: "0.00",
    },
    {
      name: "courierCharge",
      label: "Courier charge",
      kind: "number",
      min: 0,
      step: 0.01,
      prefix: "৳",
      description: "Added to the order total.",
      placeholder: "0.00",
    },
    {
      name: "estimatedDeliveryDate",
      label: "Estimated delivery date",
      kind: "date",
      description: "Optional expected delivery date.",
    },
  ]

export const ORDER_STATUSES: OrderStatus[] = [
  "DRAFT",
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "COMPLETED",
  "CANCELLED",
  "RETURNED",
]

export const ORDER_SORT_OPTIONS = [
  { label: "Newest first", value: "-createdAt", default: true },
  { label: "Oldest first", value: "createdAt" },
  { label: "Recently updated", value: "-updatedAt" },
  { label: "Least recently updated", value: "updatedAt" },
]

export const ORDER_FILTER_CONFIG = [
  search({
    name: "searchTerm",
    label: "Search",
    placeholder: "Search invoice, customer, or phone...",
  }),
  select({
    name: "status",
    label: "Status",
    placeholder: "All statuses",
    options: ORDER_STATUSES.map((status) => ({ label: status, value: status })),
  }),
  select({
    name: "channel",
    label: "Channel",
    placeholder: "All channels",
    options: [
      { label: "Online", value: "ONLINE" },
      { label: "In store", value: "OFFLINE" },
    ],
  }),
  select({
    name: "sort",
    label: "Sort",
    placeholder: "Sort by",
    options: ORDER_SORT_OPTIONS,
  }),
]

const column = createColumnHelper<OrderListItem>()

export function createOrderTableColumns({
  onOpen,
}: {
  onOpen: (order: OrderListItem) => void
}) {
  return [
    column.display({
      id: "order",
      header: "Order",
      cell: ({ row }) => (
        <div className="min-w-36">
          <p className="font-medium">{row.original.sale.invoiceNo}</p>
          <p className="text-xs text-muted-foreground">
            {formatDate(row.original.createdAt)}
          </p>
        </div>
      ),
    }),
    column.display({
      id: "customer",
      header: "Customer",
      cell: ({ row }) => (
        <div className="min-w-36">
          <p className="font-medium">{row.original.customer.name}</p>
          <p className="text-xs text-muted-foreground">
            {row.original.customer.phone || "No phone"}
          </p>
        </div>
      ),
    }),
    column.accessor((order) => order.sale.channel, {
      id: "channel",
      header: "Channel",
      cell: ({ getValue }) => (getValue() === "ONLINE" ? "Online" : "In store"),
    }),
    column.accessor((order) => Number(order.sale.total), {
      id: "total",
      header: "Total",
      cell: ({ getValue }) => (
        <span className="font-medium tabular-nums">
          {formatCurrency(getValue())}
        </span>
      ),
    }),
    column.accessor((order) => order.sale.paymentStatus, {
      id: "payment",
      header: "Payment",
      cell: ({ getValue }) => (
        <span className="text-sm">{getValue().replaceAll("_", " ")}</span>
      ),
    }),
    column.accessor("status", {
      header: "Order status",
      cell: ({ getValue }) => (
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
          {getValue().replaceAll("_", " ")}
        </span>
      ),
    }),
    column.display({
      id: "shipments",
      header: "Shipments",
      cell: ({ row }) => row.original._count.shipments,
    }),
    column.display({
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-primary"
          onClick={() => onOpen(row.original)}
        >
          Details <ArrowUpRight className="size-3.5" />
        </Button>
      ),
    }),
  ]
}
