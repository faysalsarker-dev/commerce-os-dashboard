import { useMemo, useReducer } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Info } from "lucide-react"
import { PageHeader } from "@/components/modules/Products/PageHeader"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SaleSearch } from "@/components/modules/refund/SaleSearch"
import { SaleSummaryCard } from "@/components/modules/refund/SaleSummaryCard"
import { RefundItemList } from "@/components/modules/refund/RefundItemList"
import { RefundConfirmPanel } from "@/components/modules/refund/RefundConfirmPanel"
import { ineligibleReason, type Sale } from "@/components/modules/refund/types"
import { PageContainer } from "@/components/shared/common"
import {
  initialRefundCounterState,
  refundCounterReducer,
} from "@/logics/refundCounterReducer"
import {
  useCreateRefundMutation,
  useLazyGetSaleByInvoiceQuery,
} from "@/redux/hooks"
import type { SaleByInvoice } from "@/types/data-types/sales/sales.types"
import { useNavigate } from "react-router"

export function RefundCounter() {
  const [state, dispatch] = useReducer(
    refundCounterReducer,
    initialRefundCounterState
  )
  const { sale, searched, quantities, method, reason, error } = state
  const navigate = useNavigate()
  const [getSaleByInvoice, { isFetching: isSearching }] =
    useLazyGetSaleByInvoiceQuery()
  const [createRefund, { isLoading: isSubmitting }] = useCreateRefundMutation()

  const blockedReason = sale ? ineligibleReason(sale) : null

  const selectedItems = useMemo(() => {
    if (!sale) return []
    return sale.items
      .filter((i) => (quantities[i.id] ?? 0) > 0)
      .map((i) => ({
        saleItemId: i.id,
        quantity: quantities[i.id] ?? 0,
        // Uses unitPrice (see decision-point note in RefundItemRow).
        amount: i.unitPrice * (quantities[i.id] ?? 0),
      }))
  }, [sale, quantities])

  const amount = selectedItems.reduce((sum, i) => sum + i.amount, 0)
  const exceedsPaid = Boolean(sale && amount > sale.paidAmount)

  const handleSearch = async (query: string) => {
    dispatch({ type: "SEARCH_STARTED" })

    try {
      const response = await getSaleByInvoice(query).unwrap()
      dispatch({ type: "SALE_FOUND", sale: toRefundSale(response.data) })
    } catch {
      // No matching sale is shown as an empty result.
    }
  }

  const handleQuantityChange = (saleItemId: string, qty: number) => {
    dispatch({ type: "SET_QUANTITY", saleItemId, quantity: qty })
  }

  const handleSubmit = async () => {
    if (!sale || !method) return
    dispatch({ type: "SET_ERROR", error: null })
    try {
      const response = await createRefund({
        saleId: sale.id,
        items: selectedItems.map(
          ({ saleItemId, quantity, amount: itemAmount }) => ({
            saleItemId,
            quantity,
            amount: itemAmount,
          })
        ),
        method,
        reason: reason.trim() || undefined,
      }).unwrap()
      navigate("/refund-receipt", {
        state: {
          refund: {
            id: response.data.refundNumber ?? response.data.id,
            amount: Number(response.data.totalAmount),
            method,
            createdAt: response.data.createdAt,
          },
        },
      })
    } catch {
      // Selections are intentionally preserved so the operator can retry.
      dispatch({
        type: "SET_ERROR",
        error:
          "Couldn't process the refund. Check the connection and try again.",
      })
    }
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Take a refund"
          description="Find the sale, pick the items coming back, and settle the amount."
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-4">
            <Card className="space-y-4 p-4">
              <StepLabel index={1} title="Find the sale" />
              <SaleSearch
                onSearch={(q) => void handleSearch(q)}
                isSearching={isSearching}
              />

              {searched && !sale && !isSearching ? (
                <p className="text-sm text-muted-foreground">
                  No sale found for that invoice number.
                </p>
              ) : null}

              <AnimatePresence mode="wait">
                {sale ? <SaleSummaryCard key={sale.id} sale={sale} /> : null}
              </AnimatePresence>
            </Card>

            <AnimatePresence initial={false}>
              {sale ? (
                <motion.div
                  key={`items-${sale.id}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                >
                  <Card className="space-y-4 p-4">
                    <StepLabel index={2} title="Select items to refund" />
                    {blockedReason ? (
                      <div className="flex gap-2 rounded-md border border-border bg-muted/50 p-3 text-sm text-muted-foreground">
                        <Info className="mt-0.5 size-4 shrink-0" />
                        <span>{blockedReason}</span>
                      </div>
                    ) : (
                      <RefundItemList
                        items={sale.items}
                        quantities={quantities}
                        onChange={handleQuantityChange}
                      />
                    )}
                  </Card>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <AnimatePresence initial={false} mode="wait">
              {sale && !blockedReason && selectedItems.length > 0 ? (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                >
                  <StepLabel
                    index={3}
                    title="Confirm refund"
                    className="mb-3"
                  />
                  <RefundConfirmPanel
                    amount={amount}
                    itemCount={selectedItems.length}
                    method={method}
                    reason={reason}
                    exceedsPaid={exceedsPaid}
                    isSubmitting={isSubmitting}
                    error={error}
                    onMethodChange={(method) =>
                      dispatch({ type: "SET_METHOD", method })
                    }
                    onReasonChange={(reason) =>
                      dispatch({ type: "SET_REASON", reason })
                    }
                    onSubmit={() => void handleSubmit()}
                  />
                </motion.div>
              ) : (
                <motion.p
                  key="hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground"
                >
                  {sale
                    ? blockedReason
                      ? "Nothing to refund on this sale."
                      : "Set a quantity on at least one item to continue."
                    : "Search for a sale to start a refund."}
                </motion.p>
              )}
            </AnimatePresence>
          </aside>
        </div>
      </div>
    </PageContainer>
  )
}

function toRefundSale(sale: SaleByInvoice): Sale {
  return {
    id: sale.id,
    invoiceNo: sale.invoiceNo,
    customerId: sale.customerId,
    customer: {
      name: sale.customer?.name ?? "Walk-in customer",
      phone: sale.customer?.phone ?? "—",
    },
    status: sale.status,
    total: Number(sale.total),
    paidAmount: Number(sale.paidAmount),
    dueAmount: Number(sale.dueAmount),
    paymentStatus: sale.paymentStatus,
    createdAt: sale.createdAt,
    items: sale.items.map((item) => ({
      ...item,
      unitPrice: Number(item.unitPrice),
      discount: Number(item.discount),
      subtotal: Number(item.subtotal),
      alreadyRefundedQty: item.alreadyRefundedQty ?? 0,
    })),
  }
}

function StepLabel({
  index,
  title,
  className,
}: {
  index: number
  title: string
  className?: string
}) {
  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <Badge
        variant="secondary"
        className="numeric size-5 justify-center rounded-full p-0 text-xs"
      >
        {index}
      </Badge>
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
    </div>
  )
}

export default RefundCounter
