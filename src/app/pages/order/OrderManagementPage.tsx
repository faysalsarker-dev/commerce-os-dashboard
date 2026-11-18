import { useMemo, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Link } from "react-router"
import { ClipboardList, PackageCheck, Plus, ShoppingBag } from "lucide-react"
import { DataTable } from "@/components/modules/table"
import { getDefaultValues, useFilter } from "@/components/modules/filter"
import {
  FilterBar,
  PageContainer,
  PageHeader,
} from "@/components/shared/common"
import { Can } from "@/components/shared/permissions/Can"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  useDeleteOrderMutation,
  useGetOrderQuery,
  useGetOrdersQuery,
  useUpdateOrderMutation,
} from "@/redux/features/order/order.api"
import type {
  OrderListItem,
  OrderStatus,
} from "@/types/data-types/order/order.types"
import { formatCurrency } from "@/lib/formatCurrency"
import { formatDate } from "@/lib/format"
import { getErrorMessage, handleAsyncMutation } from "@/utils/asyncHandler"
import {
  createOrderTableColumns,
  ORDER_FILTER_CONFIG,
  ORDER_PAGE_CONFIG,
  ORDER_PAGE_SIZE,
  ORDER_SORT_OPTIONS,
  ORDER_STATUSES,
} from "./order.config"

type OrderSelection = Pick<OrderListItem, "id"> & {
  sale: Pick<OrderListItem["sale"], "invoiceNo">
}

function SummaryCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string
  value: string
  detail: string
  icon: typeof ShoppingBag
}) {
  return (
    <Card className="rounded-2xl border border-border/60 shadow-sm">
      <CardContent className="flex items-start justify-between gap-3 p-4 sm:p-5">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 truncate text-2xl font-semibold tracking-tight">
            {value}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
        </div>
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
      </CardContent>
    </Card>
  )
}

export default function OrderManagementPage() {
  const [selectedOrder, setSelectedOrder] = useState<OrderSelection | null>(
    null
  )
  const filter = useFilter({
    defaultValues: getDefaultValues(ORDER_FILTER_CONFIG),
    debounceMs: { searchTerm: 300 },
    syncToUrl: true,
    pageSize: ORDER_PAGE_SIZE,
  })
  const queryParams = useMemo(() => {
    const selectedSort = filter.values.sort || ORDER_SORT_OPTIONS[0].value
    const isDescending = selectedSort.startsWith("-")

    return {
      ...filter.queryParams,
      sortBy: isDescending ? selectedSort.slice(1) : selectedSort,
      sortOrder: isDescending ? ("desc" as const) : ("asc" as const),
    }
  }, [filter.queryParams, filter.values.sort])
  const {
    data: response,
    isLoading,
    isFetching,
    error,
  } = useGetOrdersQuery(queryParams)
  const orders = response?.data ?? []
  const totalOrders = response?.meta?.total ?? orders.length
  const activeOrders = orders.filter(
    (order) => !["COMPLETED", "CANCELLED", "RETURNED"].includes(order.status)
  ).length
  const orderValue = orders.reduce(
    (sum, order) => sum + Number(order.sale.total),
    0
  )
  const columns = useMemo(
    () =>
      createOrderTableColumns({ onOpen: setSelectedOrder }) as unknown as ColumnDef<
        OrderListItem,
        unknown
      >[],
    []
  )

  return (
    <PageContainer>
      <PageHeader
        title={ORDER_PAGE_CONFIG.title}
        description={ORDER_PAGE_CONFIG.description}
        noAction
        actions={
          <Can I="create" a="orders">
            <Button
              asChild
              className="h-10 gap-2 rounded-xl"
            >
              <Link to="/app/orders/create">
                <Plus className="size-4" />
                Create order
              </Link>
            </Button>
          </Can>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryCard
          label="Total orders"
          value={totalOrders.toLocaleString()}
          detail="Matching your current filters"
          icon={ShoppingBag}
        />
        <SummaryCard
          label="Active on this page"
          value={activeOrders.toLocaleString()}
          detail="Awaiting completion"
          icon={PackageCheck}
        />
        <SummaryCard
          label="Order value on this page"
          value={formatCurrency(orderValue)}
          detail="Based on listed sales"
          icon={ClipboardList}
        />
      </section>

      <FilterBar filter={filter} filters={ORDER_FILTER_CONFIG} />

      {error ? (
        <div
          role="alert"
          className="rounded-2xl border border-destructive/30 bg-destructive/5 px-5 py-4 text-sm text-destructive"
        >
          Orders could not be loaded:{" "}
          {getErrorMessage(error, "Please refresh the page and try again.")}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={orders}
          isLoading={isLoading || isFetching}
          getRowId={(order) => order.id}
          pagination={filter.tableState}
          onPaginationChange={filter.onTableStateChange}
          meta={response?.meta}
        />
      )}

      <OrderDetailSheet
        key={selectedOrder?.id ?? "closed"}
        order={selectedOrder}
        onOpenChange={(open) => {
          if (!open) setSelectedOrder(null)
        }}
      />
    </PageContainer>
  )
}

function OrderDetailSheet({
  order,
  onOpenChange,
}: {
  order: OrderSelection | null
  onOpenChange: (open: boolean) => void
}) {
  const [status, setStatus] = useState<OrderStatus | "">("")
  const {
    data: response,
    isLoading,
    error,
  } = useGetOrderQuery(order?.id ?? "", { skip: !order })
  const [updateOrder, updateState] = useUpdateOrderMutation()
  const [deleteOrder, deleteState] = useDeleteOrderMutation()
  const detail = response?.data

  const saveStatus = async () => {
    if (!order || !status) return
    await handleAsyncMutation(
      () => updateOrder({ id: order.id, data: { status } }).unwrap(),
      {
        successMessage: "Order status updated",
        errorMessage: "Unable to update order",
        onSuccess: () => setStatus(""),
      }
    )
  }

  const removeOrder = async () => {
    if (
      !order ||
      !window.confirm(
        `Delete order ${order.sale.invoiceNo}? This cannot be undone.`
      )
    )
      return
    const result = await handleAsyncMutation(
      () => deleteOrder(order.id).unwrap(),
      {
        successMessage: "Order deleted",
        errorMessage: "Unable to delete order",
      }
    )
    if (result.success) onOpenChange(false)
  }

  return (
    <Sheet open={!!order} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 overflow-y-auto p-0 sm:max-w-xl">
        <SheetHeader className="border-b p-5 pr-14">
          <SheetTitle>Order {order?.sale.invoiceNo}</SheetTitle>
          <SheetDescription>
            Order details, fulfillment, and payment activity.
          </SheetDescription>
        </SheetHeader>
        {!order ? null : isLoading ? (
          <div className="p-5 text-sm text-muted-foreground">
            Loading order details…
          </div>
        ) : error ? (
          <div
            role="alert"
            className="m-5 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
          >
            {getErrorMessage(error, "Order details could not be loaded.")}
          </div>
        ) : detail ? (
          <div className="space-y-6 p-5">
            <section className="grid grid-cols-2 gap-3">
              <DetailStat
                label="Customer"
                value={detail.customer.name}
                hint={detail.customer.phone || "No phone"}
              />
              <DetailStat
                label="Created"
                value={formatDate(detail.createdAt)}
                hint={detail.status.replaceAll("_", " ")}
              />
              <DetailStat
                label="Sale total"
                value={formatCurrency(Number(detail.sale.total))}
                hint={`${detail.sale.paymentStatus.replaceAll("_", " ")} payment`}
              />
              <DetailStat
                label="Channel"
                value={detail.sale.channel === "ONLINE" ? "Online" : "In store"}
                hint={`${detail.shipments.length} shipment(s)`}
              />
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-semibold">Sale summary</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <DetailStat
                  label="Subtotal"
                  value={formatCurrency(Number(detail.sale.subtotal))}
                  hint="Before discounts and shipping"
                />
                <DetailStat
                  label="Discount"
                  value={formatCurrency(Number(detail.sale.discount))}
                  hint="Applied to sale"
                />
                <DetailStat
                  label="Shipping fee"
                  value={formatCurrency(Number(detail.sale.shippingFee))}
                  hint="Delivery charge"
                />
                <DetailStat
                  label="Paid"
                  value={formatCurrency(Number(detail.sale.paidAmount))}
                  hint="Amount received"
                />
                <DetailStat
                  label="Due"
                  value={formatCurrency(Number(detail.sale.dueAmount))}
                  hint="Outstanding balance"
                />
                <DetailStat
                  label="Refunded"
                  value={formatCurrency(Number(detail.sale.refundedAmount))}
                  hint="Amount returned"
                />
              </div>
              {(detail.sale.shippingAddress || detail.sale.notes) && (
                <div className="space-y-3 rounded-xl border p-4 text-sm">
                  {detail.sale.shippingAddress && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Shipping address
                      </p>
                      <p className="mt-1 whitespace-pre-wrap">
                        {detail.sale.shippingAddress}
                      </p>
                    </div>
                  )}
                  {detail.sale.notes && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Sale notes
                      </p>
                      <p className="mt-1 whitespace-pre-wrap">
                        {detail.sale.notes}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </section>

            <Can I="edit" a="orders">
              <section className="space-y-3">
                <h3 className="text-sm font-semibold">Update order status</h3>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <select
                    aria-label="New order status"
                    value={status || detail.status}
                    onChange={(event) =>
                      setStatus(event.target.value as OrderStatus)
                    }
                    className="h-11 flex-1 rounded-lg border border-input bg-background px-3 text-sm"
                  >
                    {ORDER_STATUSES.map((item) => (
                      <option key={item} value={item}>
                        {item.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>
                  <Button
                    onClick={saveStatus}
                    disabled={
                      !status ||
                      status === detail.status ||
                      updateState.isLoading
                    }
                  >
                    {updateState.isLoading ? "Saving…" : "Save status"}
                  </Button>
                </div>
              </section>
            </Can>

            <section className="space-y-3">
              <h3 className="text-sm font-semibold">
                Items ({detail.sale.items.length})
              </h3>
              <div className="divide-y rounded-xl border">
                {detail.sale.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 p-3 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.variant.productColor.colorName} ·{" "}
                        {item.variant.size.size} · Qty {item.quantity}
                      </p>
                    </div>
                    <span className="shrink-0 font-medium">
                      {formatCurrency(Number(item.subtotal))}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-semibold">Shipments</h3>
              {detail.shipments.length ? (
                detail.shipments.map((shipment) => (
                  <div
                    key={shipment.id}
                    className="rounded-xl border p-4 text-sm"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium">
                        {shipment.courierAccount.label}
                      </p>
                      <span className="rounded-full bg-muted px-2.5 py-1 text-xs">
                        {shipment.status.replaceAll("_", " ")}
                      </span>
                    </div>
                    <p className="mt-2 text-muted-foreground">
                      Tracking:{" "}
                      {shipment.trackingCode ||
                        shipment.consignmentId ||
                        "Not assigned"}
                    </p>
                    {shipment.lastError && (
                      <p className="mt-1 text-destructive">
                        {shipment.lastError}
                      </p>
                    )}
                    {shipment.events.length > 0 && (
                      <ol className="mt-4 space-y-2 border-l pl-4">
                        {[...shipment.events]
                          .sort(
                            (a, b) =>
                              Date.parse(b.occurredAt) -
                              Date.parse(a.occurredAt)
                          )
                          .map((event) => (
                            <li key={event.id} className="relative text-xs">
                              <span className="absolute top-1 -left-[1.32rem] size-2 rounded-full bg-primary" />
                              <p className="font-medium">
                                {event.status.replaceAll("_", " ")}
                              </p>
                              <p className="text-muted-foreground">
                                {formatDate(event.occurredAt)}
                                {event.rawStatus ? ` · ${event.rawStatus}` : ""}
                              </p>
                            </li>
                          ))}
                      </ol>
                    )}
                  </div>
                ))
              ) : (
                <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                  No shipments have been created for this order.
                </p>
              )}
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-semibold">
                Payments ({detail.sale.payments.length})
              </h3>
              {detail.sale.payments.length ? (
                detail.sale.payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-start justify-between gap-4 rounded-xl border p-3 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="font-medium">
                        {payment.method.replaceAll("_", " ")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(payment.paidAt)}
                        {payment.reference ? ` · ${payment.reference}` : ""}
                      </p>
                      {payment.notes && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {payment.notes}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 font-medium">
                      {formatCurrency(Number(payment.amount))}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No payment records.
                </p>
              )}
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-semibold">
                Refunds ({detail.sale.refunds.length})
              </h3>
              {detail.sale.refunds.length ? (
                detail.sale.refunds.map((refund) => (
                  <div
                    key={refund.id}
                    className="rounded-xl border p-4 text-sm"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium">
                        {refund.method.replaceAll("_", " ")} ·{" "}
                        {formatDate(refund.refundedAt)}
                      </p>
                      <span className="font-semibold">
                        {formatCurrency(Number(refund.amount))}
                      </span>
                    </div>
                    {refund.reason && (
                      <p className="mt-2 text-muted-foreground">
                        {refund.reason}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-muted-foreground">
                      {refund.items.length} refunded item(s)
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No refunds recorded.
                </p>
              )}
            </section>

            <Can I="delete" a="orders">
              <Button
                variant="destructive"
                className="w-full"
                onClick={removeOrder}
                disabled={deleteState.isLoading}
              >
                {deleteState.isLoading ? "Deleting…" : "Delete order"}
              </Button>
            </Can>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

function DetailStat({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint: string
}) {
  return (
    <div className="min-w-0 rounded-xl border bg-muted/20 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold">{value}</p>
      <p className="mt-1 truncate text-xs text-muted-foreground">{hint}</p>
    </div>
  )
}
