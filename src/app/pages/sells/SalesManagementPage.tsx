import { useMemo, useState } from "react"
import { Link } from "react-router"
import { Plus } from "lucide-react"
import { DataTable } from "@/components/modules/table"
import { getDefaultValues } from "@/components/modules/filter"
import {
  FilterBar,
  PageContainer,
  PageHeader,
} from "@/components/shared/common"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useFilter } from "@/hooks/useFilter"
import { formatCurrency } from "@/lib/formatCurrency"
import {
  useGetSaleByInvoiceQuery,
  useGetSalesHistoryQuery,
} from "@/redux/features/sales/sales.api"
import type {
  SaleByInvoice,
  SalesHistoryItem,
  SalesHistoryParams,
} from "@/types/data-types/sales/sales.types"
import { getErrorMessage } from "@/utils/asyncHandler"
import {
  createSalesTableColumns,
  SALES_FILTER_CONFIG,
  SALES_PAGE_CONFIG,
} from "./sales-management.config"

export default function SalesManagementPage() {
  const [selectedSale, setSelectedSale] = useState<SalesHistoryItem | null>(null)
  const filter = useFilter({
    defaultValues: getDefaultValues(SALES_FILTER_CONFIG),
    debounceMs: { search: 300 },
    pageSize: 10,
  })
  const { dateFrom, dateTo, ...baseParams } = filter.queryParams
  const queryParams: SalesHistoryParams = {
    ...baseParams,
    ...(dateFrom ? { startDate: dateFrom } : {}),
    ...(dateTo ? { endDate: dateTo } : {}),
  }
  const {
    data: response,
    isLoading,
    isFetching,
    error,
  } = useGetSalesHistoryQuery(queryParams)
  const sales = response?.data ?? []
  const columns = useMemo(() => createSalesTableColumns(), [])

  return (
    <PageContainer>
      <PageHeader
        title={SALES_PAGE_CONFIG.title}
        description={SALES_PAGE_CONFIG.description}
        noAction
        actions={
          <Button asChild className="h-10 gap-2 rounded-xl">
            <Link to="/app/sell/counter">
              <Plus className="size-4" />
              New sale
            </Link>
          </Button>
        }
      />

      <FilterBar filter={filter} filters={SALES_FILTER_CONFIG} />

      {error ? (
        <div
          role="alert"
          className="rounded-2xl border border-destructive/30 bg-destructive/5 px-5 py-4 text-sm text-destructive"
        >
          Sales could not be loaded:{" "}
          {getErrorMessage(error, "Please refresh the page and try again.")}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={sales}
          isLoading={isLoading || isFetching}
          getRowId={(sale) => sale.saleId}
          onRowClick={setSelectedSale}
          pagination={filter.tableState}
          onPaginationChange={filter.onTableStateChange}
          meta={response?.meta}
        />
      )}

      <SaleDetailsSheet
        sale={selectedSale}
        onOpenChange={(open) => {
          if (!open) setSelectedSale(null)
        }}
      />
    </PageContainer>
  )
}

function SaleDetailsSheet({
  sale,
  onOpenChange,
}: {
  sale: SalesHistoryItem | null
  onOpenChange: (open: boolean) => void
}) {
  const {
    data: response,
    isLoading,
    error,
  } = useGetSaleByInvoiceQuery(sale?.invoiceNo ?? "", { skip: !sale })
  const detail = response?.data

  return (
    <Sheet open={!!sale} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-xl">
        <SheetHeader className="border-b border-border/60 px-5 pb-4">
          <SheetTitle>
            {detail?.invoiceNo ?? sale?.invoiceNo ?? "Sale details"}
          </SheetTitle>
          <SheetDescription>
            Invoice, items, and payment information.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-5 pb-6">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">
              Loading sale details...
            </p>
          ) : null}
          {error ? (
            <div
              role="alert"
              className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
            >
              Sale details could not be loaded:{" "}
              {getErrorMessage(error, "Please try again.")}
            </div>
          ) : null}

          {detail ? <SaleDetails detail={detail} /> : null}
        </div>
      </SheetContent>
    </Sheet>
  )
}

function SaleDetails({ detail }: { detail: SaleByInvoice }) {
  return (
    <>
      <dl className="grid grid-cols-2 gap-4">
        <DetailValue
          label="Customer"
          value={detail.customer?.name ?? "Walk-in customer"}
        />
        <DetailValue
          label="Phone"
          value={detail.customer?.phone ?? "—"}
        />
        <DetailValue
          label="Sale date"
          value={
            new Intl.DateTimeFormat(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            }).format(new Date(detail.createdAt))
          }
        />
        <DetailValue label="Status" value={humanize(detail.status)} />
      </dl>

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">{humanize(detail.paymentStatus)}</Badge>
        {detail.paymentMethod ? (
          <Badge variant="outline">{humanize(detail.paymentMethod)}</Badge>
        ) : null}
      </div>

      <section className="space-y-2 rounded-xl border border-border/60 p-4 text-sm">
        <AmountRow
          label="Subtotal"
          value={formatCurrency(Number(detail.subtotal))}
        />
        <AmountRow
          label="Discount"
          value={formatCurrency(Number(detail.discount))}
        />
        <AmountRow
          label="Shipping"
          value={formatCurrency(Number(detail.shippingFee))}
        />
        <AmountRow
          label="Total"
          value={formatCurrency(Number(detail.total))}
          emphasized
        />
        <AmountRow
          label="Paid"
          value={formatCurrency(Number(detail.paidAmount))}
        />
        <AmountRow
          label="Due"
          value={formatCurrency(Number(detail.dueAmount))}
          emphasized
        />
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold">Items</h3>
        {detail.items.length ? (
          <div className="divide-y divide-border/60 rounded-xl border border-border/60">
            {detail.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 p-3 text-sm"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{item.productName}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {item.sku}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Qty: {item.quantity}
                    {item.alreadyRefundedQty
                      ? ` · ${item.alreadyRefundedQty} refunded`
                      : ""}
                  </p>
                </div>
                <span className="shrink-0 font-medium tabular-nums">
                  {formatCurrency(Number(item.subtotal))}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No item details are available for this sale.
          </p>
        )}
      </section>

      {detail.payments?.length ? (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold">Payments</h3>
          <div className="divide-y divide-border/60 rounded-xl border border-border/60">
            {detail.payments.map((payment, index) => (
              <div
                key={`${payment.method}-${index}`}
                className="flex items-center justify-between gap-4 p-3 text-sm"
              >
                <div className="min-w-0">
                  <p className="font-medium">{humanize(payment.method)}</p>
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

function AmountRow({
  label,
  value,
  emphasized = false,
}: {
  label: string
  value: string
  emphasized?: boolean
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 ${
        emphasized ? "border-t border-border/60 pt-2 font-semibold" : ""
      }`}
    >
      <span className={emphasized ? "" : "text-muted-foreground"}>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  )
}

function humanize(value: string) {
  return value.replaceAll("_", " ")
}
