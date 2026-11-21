import { useMemo, useState } from "react"
import { useNavigate } from "react-router"
import {
  ArrowLeftRight,

  Plus,

} from "lucide-react"
import { DataTable } from "@/components/modules/table"
import { getDefaultValues } from "@/components/modules/filter"
import {
  FilterBar,
  PageContainer,
  PageHeader,
} from "@/components/shared/common"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useFilter } from "@/hooks/useFilter"
import { formatCurrency } from "@/lib/formatCurrency"
import { formatDate } from "@/lib/format"
import {
  useGetRefundQuery,
  useGetRefundsQuery,
} from "@/redux/features/refund/refund.api"
import type {
  Refund,
  RefundFilters,
} from "@/types/data-types/refund/refund.types"
import { getErrorMessage } from "@/utils/asyncHandler"
import {
  createRefundTableColumns,
  REFUND_FILTER_CONFIG,
  REFUND_PAGE_CONFIG,
} from "./refund-management.config"


export default function RefundManagementPage() {
  const [selectedRefund, setSelectedRefund] = useState<Refund | null>(null)
  const navigate = useNavigate()
  const filter = useFilter({
    defaultValues: getDefaultValues(REFUND_FILTER_CONFIG),
    debounceMs: { searchTerm: 300 },
    syncToUrl: true,
  })
  const queryParams = filter.queryParams as RefundFilters
  const {
    data: response,
    isLoading,
    isFetching,
    error,
  } = useGetRefundsQuery(queryParams)
  const refunds = response?.data ?? []

  const columns = useMemo(
    () =>
      createRefundTableColumns({
        onOpen: setSelectedRefund,
      }),
    []
  )

  return (
    <PageContainer>
      <PageHeader
        title={REFUND_PAGE_CONFIG.title}
        description={REFUND_PAGE_CONFIG.description}
        noAction
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 gap-2 rounded-xl"
              onClick={() => navigate("/app/refund/exchange")}
            >
              <ArrowLeftRight className="size-4" />
              Exchange product
            </Button>
            <Button
              type="button"
              className="h-10 gap-2 rounded-xl"
              onClick={() => navigate("/app/refund/process")}
            >
              <Plus className="size-4" />
              Process refund
            </Button>
          </div>
        }
      />

     

      <FilterBar filter={filter} filters={REFUND_FILTER_CONFIG} />

      {error ? (
        <div
          role="alert"
          className="rounded-2xl border border-destructive/30 bg-destructive/5 px-5 py-4 text-sm text-destructive"
        >
          Refunds could not be loaded:{" "}
          {getErrorMessage(error, "Please refresh the page and try again.")}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={refunds}
          isLoading={isLoading || isFetching}
          getRowId={(refund) => refund.id}
          onRowClick={setSelectedRefund}
          pagination={filter.tableState}
          onPaginationChange={filter.onTableStateChange}
          meta={response?.meta}
        />
      )}

      <RefundDetailsSheet
        refund={selectedRefund}
        onOpenChange={(open) => {
          if (!open) setSelectedRefund(null)
        }}
      />
    </PageContainer>
  )
}

function RefundDetailsSheet({
  refund,
  onOpenChange,
}: {
  refund: Refund | null
  onOpenChange: (open: boolean) => void
}) {
  const {
    data: response,
    isLoading,
    error,
  } = useGetRefundQuery(refund?.id ?? "", { skip: !refund })
  const detail = response?.data ?? refund

  return (
    <Sheet open={!!refund} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-xl">
        <SheetHeader className="border-b border-border/60 px-5 pb-4">
          <SheetTitle>{detail ? `Refund ${detail.id.slice(-8)}` : "Refund details"}</SheetTitle>
          <SheetDescription>
            Refund record and settlement information.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-5 pb-6">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">
              Loading refund details...
            </p>
          ) : null}
          {error ? (
            <div
              role="alert"
              className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
            >
              Detailed refund information could not be loaded:{" "}
              {getErrorMessage(error, "Please try again.")}
            </div>
          ) : null}

          {detail ? (
            <>
              <dl className="grid grid-cols-2 gap-4">
                <DetailValue
                  label="Invoice"
                  value={detail.sale?.invoiceNo ?? "—"}
                />
                <DetailValue
                  label="Customer"
                  value={detail.sale?.customer?.name ?? "Walk-in customer"}
                />
                <DetailValue
                  label="Refund amount"
                  value={formatCurrency(Number(detail.amount))}
                />
                <DetailValue
                  label="Payment method"
                  value={detail.method.replaceAll("_", " ")}
                />
                <DetailValue
                  label="Processed by"
                  value={detail.processedBy?.name ?? "—"}
                />
                <DetailValue label="Date" value={formatDate(detail.refundedAt)} />
              </dl>

              {detail.reason ? (
                <section className="space-y-2">
                  <h3 className="text-sm font-semibold">Reason</h3>
                  <p className="rounded-xl bg-muted/50 p-3 text-sm text-muted-foreground">
                    {detail.reason}
                  </p>
                </section>
              ) : null}

              <section className="space-y-3">
                <h3 className="text-sm font-semibold">Refunded items</h3>
                {detail.items?.length ? (
                  <div className="divide-y divide-border/60 rounded-xl border border-border/60">
                    {detail.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-4 p-3 text-sm"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-medium">
                            {item.saleItem?.productName ?? item.saleItem?.sku ?? "Product"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <span className="shrink-0 font-medium tabular-nums">
                          {formatCurrency(Number(item.amount))}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No item details are available for this refund.
                  </p>
                )}
              </section>

              {detail.payments?.length ? (
                <section className="space-y-3">
                  <h3 className="text-sm font-semibold">Payment breakdown</h3>
                  <div className="divide-y divide-border/60 rounded-xl border border-border/60">
                    {detail.payments.map((payment, index) => (
                      <div
                        key={`${payment.method}-${index}`}
                        className="flex items-center justify-between gap-4 p-3 text-sm"
                      >
                        <div className="min-w-0">
                          <p className="font-medium">
                            {payment.method.replaceAll("_", " ")}
                          </p>
                          {payment.reference ? (
                            <p className="truncate text-xs text-muted-foreground">
                              Ref: {payment.reference}
                            </p>
                          ) : null}
                        </div>
                        <span className="shrink-0 tabular-nums">
                          {formatCurrency(Number(payment.amount))}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}
            </>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  )
}

function DetailValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 space-y-1">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="truncate text-sm font-medium">{value}</dd>
    </div>
  )
}
