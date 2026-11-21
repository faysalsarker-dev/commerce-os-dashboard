import { useEffect, useMemo, useState, type ReactNode } from "react"
import {
  ArrowLeft,
  ArrowLeftRight,
  Loader2,
  PackageCheck,
  Search,
} from "lucide-react"
import { useNavigate } from "react-router"
import { PageContainer } from "@/components/shared/common"
import { PageHeader } from "@/components/modules/Products/PageHeader"
import { SaleSearch } from "@/components/modules/refund/SaleSearch"
import { SaleSummaryCard } from "@/components/modules/refund/SaleSummaryCard"
import type { Sale } from "@/components/modules/refund/types"
import {
  Badge,
  Button,
  Card,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/components/ui"
import {
  useCreateExchangeMutation,
  useGetExchangesBySaleQuery,
  useGetProductsQuery,
  useGetRefundsBySaleQuery,
  useLazyGetSaleByInvoiceQuery,
} from "@/redux/hooks"
import type { Product } from "@/types/data-types/product/product.types"
import type { Exchange } from "@/types/data-types/refund/refund.types"
import type { Refund } from "@/types/data-types/refund/refund.types"
import type { SaleByInvoice } from "@/types/data-types/sales/sales.types"
import { formatCurrency } from "@/lib/formatCurrency"
import { getErrorMessage } from "@/utils/asyncHandler"
import { toast } from "sonner"

interface ReplacementOption {
  id: string
  productName: string
  colorName: string
  sizeName: string
  sku: string
  price: number
  stockQty: number
}

export default function ExchangeCounter() {
  const navigate = useNavigate()
  const [sale, setSale] = useState<SaleByInvoice | null>(null)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [replacements, setReplacements] = useState<
    Record<string, ReplacementOption>
  >({})
  const [reason, setReason] = useState("")
  const [productSearch, setProductSearch] = useState("")
  const [debouncedProductSearch, setDebouncedProductSearch] = useState("")

  const [getSaleByInvoice, { isFetching: isSearching }] =
    useLazyGetSaleByInvoiceQuery()
  const [createExchange, { isLoading: isSubmitting }] =
    useCreateExchangeMutation()
  const {
    data: refundsResponse,
    isFetching: isLoadingRefunds,
    error: refundsError,
  } = useGetRefundsBySaleQuery(sale?.id ?? "", { skip: !sale })
  const {
    data: exchangesResponse,
    isFetching: isLoadingExchanges,
    error: exchangesError,
  } = useGetExchangesBySaleQuery(sale?.id ?? "", { skip: !sale })
  const {
    data: productsResponse,
    isFetching: isLoadingProducts,
    error: productsError,
  } = useGetProductsQuery(
    {
      limit: 100,
      searchTerm: debouncedProductSearch || undefined,
    },
    { skip: !sale }
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedProductSearch(productSearch.trim())
    }, 300)
    return () => clearTimeout(timer)
  }, [productSearch])

  const isLoadingHistory = isLoadingRefunds || isLoadingExchanges

  const processedQuantities = useMemo(
    () =>
      getProcessedQuantities(
        refundsResponse?.data ?? [],
        exchangesResponse?.data ?? []
      ),
    [refundsResponse?.data, exchangesResponse?.data]
  )

  const replacementOptions = useMemo(
    () => flattenProducts(productsResponse?.data ?? []),
    [productsResponse?.data]
  )

  const eligibleItems =
    sale?.items.filter(
      (item) =>
        getRemainingQuantity(item.id, item.quantity, processedQuantities) > 0
    ) ?? []
  const selectedItems =
    sale?.items.filter((item) => (quantities[item.id] ?? 0) > 0) ?? []
  const canExchangeSale =
    sale !== null &&
    ["COMPLETED", "CONFIRMED", "PARTIALLY_RETURNED"].includes(sale.status)
  const historyError =
    refundsError || exchangesError
      ? getErrorMessage(
          refundsError ?? exchangesError,
          "Unable to load previous refunds or exchanges for this sale."
        )
      : null

  const handleSearch = async (invoiceNo: string) => {
    setSale(null)
    setQuantities({})
    setReplacements({})
    setReason("")
    setSubmitError(null)
    setSearchError(null)

    try {
      const response = await getSaleByInvoice(invoiceNo).unwrap()
      setSale(response.data)
    } catch (error) {
      setSearchError(getErrorMessage(error, "Unable to find that sale."))
    }
  }

  const handleQuantityChange = (saleItemId: string, value: string) => {
    const quantity = Math.max(0, Math.floor(Number(value) || 0))
    const item = sale?.items.find((saleItem) => saleItem.id === saleItemId)
    if (!item) return

    const remaining = getRemainingQuantity(
      saleItemId,
      item.quantity,
      processedQuantities
    )
    const replacement = replacements[saleItemId]
    const availableReplacementStock = replacement
      ? getAvailableStock(replacement.id, saleItemId, replacements, quantities)
      : remaining
    const nextQuantity = Math.min(
      remaining,
      availableReplacementStock,
      quantity
    )

    setQuantities((current) => ({ ...current, [saleItemId]: nextQuantity }))
    if (nextQuantity === 0) {
      setReplacements((current) => {
        const next = { ...current }
        delete next[saleItemId]
        return next
      })
    }
  }

  const handleReplacementChange = (saleItemId: string, variantId: string) => {
    const option = getOptionsForSaleItem(
      saleItemId,
      sale?.items ?? [],
      replacementOptions,
      replacements,
      quantities
    ).find((candidate) => candidate.id === variantId)

    if (!option) return
    setReplacements((current) => ({ ...current, [saleItemId]: option }))
  }

  const handleSubmit = async () => {
    if (
      !sale ||
      !canExchangeSale ||
      isLoadingHistory ||
      selectedItems.length === 0 ||
      selectedItems.some((item) => !replacements[item.id])
    ) {
      return
    }

    setSubmitError(null)
    try {
      await createExchange({
        saleId: sale.id,
        reason: reason.trim() || undefined,
        items: selectedItems.map((item) => ({
          saleItemId: item.id,
          replacementVariantId: replacements[item.id].id,
          quantity: quantities[item.id],
        })),
      }).unwrap()
      toast.success("Exchange completed")
      setSale(null)
      setQuantities({})
      setReplacements({})
      setReason("")
      setProductSearch("")
      setDebouncedProductSearch("")
    } catch (error) {
      const message = getErrorMessage(error, "Unable to process this exchange.")
      setSubmitError(message)
      toast.error(message)
    }
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <PageHeader
            title="Exchange products"
            description="Find a completed sale, select the returned items, and choose equal-value replacements."
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/app/refund")}
          >
            <ArrowLeft className="size-4" />
            Back to refunds
          </Button>
        </div>

        <Card className="space-y-4 p-4">
          <StepLabel index={1} title="Find the sale" />
          <SaleSearch
            onSearch={(invoice) => void handleSearch(invoice)}
            isSearching={isSearching}
          />
          {searchError ? (
            <p role="alert" className="text-sm font-medium text-destructive">
              {searchError}
            </p>
          ) : null}
          {productsError ? (
            <Notice destructive>
              {getErrorMessage(
                productsError,
                "Replacement products could not be loaded."
              )}
            </Notice>
          ) : null}
          {sale ? <SaleSummaryCard sale={toRefundSale(sale)} /> : null}
        </Card>

        {sale ? (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
            <section className="space-y-4">
              <Card className="space-y-4 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <StepLabel index={2} title="Choose items and replacements" />
                  <Badge variant="outline">
                    {eligibleItems.length} eligible item(s)
                  </Badge>
                </div>

                {!canExchangeSale ? (
                  <Notice>
                    Exchanges are available for completed, confirmed, or
                    partially returned sales only.
                  </Notice>
                ) : null}

                {isLoadingHistory ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" />
                    Checking previous refunds and exchanges...
                  </div>
                ) : null}

                {!isLoadingHistory && historyError ? (
                  <Notice destructive>{historyError}</Notice>
                ) : null}

                {!isLoadingHistory && !historyError && eligibleItems.length ? (
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={productSearch}
                        onChange={(event) =>
                          setProductSearch(event.target.value)
                        }
                        placeholder="Search replacement products by name or description..."
                        className="pl-9"
                      />
                    </div>
                    {isLoadingProducts ? (
                      <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="size-4 animate-spin" />
                        Loading replacement products...
                      </p>
                    ) : null}

                    {eligibleItems.map((item) => {
                      const remaining = getRemainingQuantity(
                        item.id,
                        item.quantity,
                        processedQuantities
                      )
                      const requestedQuantity = quantities[item.id] ?? 0
                      const originalUnitPrice =
                        Number(item.subtotal) / item.quantity
                      const options = getOptionsForSaleItem(
                        item.id,
                        sale.items,
                        replacementOptions,
                        replacements,
                        quantities,
                        originalUnitPrice
                      )
                      const selectedReplacement = replacements[item.id]
                      const displayOptions =
                        selectedReplacement &&
                        !options.some(
                          (option) => option.id === selectedReplacement.id
                        )
                          ? [selectedReplacement, ...options]
                          : options

                      return (
                        <article
                          key={item.id}
                          className="space-y-3 rounded-xl border border-border/70 p-4"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-semibold">
                                {item.productName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                SKU {item.sku} · Original unit value{" "}
                                {formatCurrency(originalUnitPrice)}
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {remaining} of {item.quantity} unit(s) remain
                                eligible
                              </p>
                            </div>
                            <label className="space-y-1 text-xs text-muted-foreground">
                              Quantity
                              <Input
                                type="number"
                                min={0}
                                max={remaining}
                                step={1}
                                value={requestedQuantity}
                                onChange={(event) =>
                                  handleQuantityChange(
                                    item.id,
                                    event.target.value
                                  )
                                }
                                disabled={!canExchangeSale || isLoadingHistory}
                                className="w-24"
                              />
                            </label>
                          </div>

                          {requestedQuantity > 0 ? (
                            <div className="space-y-2">
                              <label
                                htmlFor={`replacement-${item.id}`}
                                className="text-sm font-medium"
                              >
                                Replacement variant
                              </label>
                              <Select
                                value={selectedReplacement?.id ?? ""}
                                onValueChange={(variantId) =>
                                  handleReplacementChange(item.id, variantId)
                                }
                                disabled={
                                  !canExchangeSale ||
                                  isLoadingHistory ||
                                  isLoadingProducts
                                }
                              >
                                <SelectTrigger
                                  id={`replacement-${item.id}`}
                                  className="w-full"
                                >
                                  <SelectValue placeholder="Choose an equal-value replacement" />
                                </SelectTrigger>
                                <SelectContent>
                                  {displayOptions.length ? (
                                    displayOptions.map((option) => (
                                      <SelectItem
                                        key={option.id}
                                        value={option.id}
                                      >
                                        {formatReplacementLabel(option)}
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <SelectItem value="no-match" disabled>
                                      No in-stock equal-value variants found
                                    </SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                              {!options.length ? (
                                <p className="text-xs text-muted-foreground">
                                  No in-stock replacement at this item&apos;s
                                  original value was found. Try another search.
                                </p>
                              ) : null}
                            </div>
                          ) : null}
                        </article>
                      )
                    })}
                  </div>
                ) : null}

                {!isLoadingHistory && !historyError && !eligibleItems.length ? (
                  <Notice>
                    Every item on this sale has already been refunded or
                    exchanged.
                  </Notice>
                ) : null}
              </Card>
            </section>

            <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
              <Card className="space-y-4 p-4">
                <StepLabel index={3} title="Confirm exchange" />
                <Notice>
                  Replacement variants must be in stock and have the same unit
                  price. Price differences require a separate settlement and
                  cannot be processed by this exchange endpoint.
                </Notice>
                <label className="space-y-2 text-sm font-medium">
                  Reason (optional)
                  <Textarea
                    rows={3}
                    maxLength={500}
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    placeholder="Add a note about this exchange"
                  />
                </label>
                {selectedItems.length ? (
                  <div className="space-y-2 border-t border-border pt-3">
                    {selectedItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between gap-3 text-sm"
                      >
                        <span className="min-w-0 truncate">
                          {item.productName} × {quantities[item.id]}
                        </span>
                        <span className="shrink-0 text-muted-foreground">
                          {replacements[item.id]?.productName ??
                            "Choose replacement"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : null}
                {submitError ? (
                  <p role="alert" className="text-sm text-destructive">
                    {submitError}
                  </p>
                ) : null}
                <Button
                  type="button"
                  className="w-full"
                  disabled={
                    !canExchangeSale ||
                    isLoadingHistory ||
                    isSubmitting ||
                    selectedItems.length === 0 ||
                    selectedItems.some((item) => !replacements[item.id])
                  }
                  onClick={() => void handleSubmit()}
                >
                  {isSubmitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <ArrowLeftRight className="size-4" />
                  )}
                  Process exchange
                </Button>
              </Card>
            </aside>
          </div>
        ) : (
          <Card className="flex min-h-56 flex-col items-center justify-center gap-3 border-dashed p-6 text-center">
            <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
              <PackageCheck className="size-6" />
            </span>
            <div className="space-y-1">
              <p className="font-semibold">No sale selected</p>
              <p className="max-w-md text-sm text-muted-foreground">
                Search for a sale by invoice number to review eligible items and
                select equal-value replacements.
              </p>
            </div>
          </Card>
        )}
      </div>
    </PageContainer>
  )
}

function getProcessedQuantities(
  refunds: Refund[],
  exchanges: Exchange[]
): Record<string, number> {
  const processed: Record<string, number> = {}

  for (const refund of refunds) {
    for (const item of refund.items ?? []) {
      processed[item.saleItemId] =
        (processed[item.saleItemId] ?? 0) + item.quantity
    }
  }

  for (const exchange of exchanges) {
    for (const item of exchange.items ?? []) {
      processed[item.originalSaleItemId] =
        (processed[item.originalSaleItemId] ?? 0) + item.quantity
    }
  }

  return processed
}

function getRemainingQuantity(
  saleItemId: string,
  soldQuantity: number,
  processed: Record<string, number>
) {
  return Math.max(0, soldQuantity - (processed[saleItemId] ?? 0))
}

function flattenProducts(products: Product[]): ReplacementOption[] {
  return products.flatMap((product) =>
    product.colors.flatMap((color) =>
      color.variants.map((variant) => ({
        id: variant.id,
        productName: product.name,
        colorName: color.colorName,
        sizeName: variant.size.size,
        sku: variant.sku,
        price: Number(variant.sellingPriceOverride ?? product.sellingPrice),
        stockQty: variant.stockQty,
      }))
    )
  )
}

function getOptionsForSaleItem(
  saleItemId: string,
  saleItems: SaleByInvoice["items"],
  options: ReplacementOption[],
  selected: Record<string, ReplacementOption>,
  quantities: Record<string, number>,
  originalPrice?: number
) {
  const item = saleItems.find((saleItem) => saleItem.id === saleItemId)
  if (!item) return []

  const price = originalPrice ?? Number(item.subtotal) / item.quantity
  return options.filter((option) => {
    if (option.id === item.variantId || option.stockQty < 1) return false
    if (Math.round((option.price - price) * 100) !== 0) return false

    const reservedByOthers = Object.entries(selected).reduce(
      (total, [otherSaleItemId, replacement]) =>
        otherSaleItemId !== saleItemId && replacement.id === option.id
          ? total + (quantities[otherSaleItemId] ?? 0)
          : total,
      0
    )
    const requested = Math.max(1, quantities[saleItemId] ?? 0)
    return option.stockQty - reservedByOthers >= requested
  })
}

function getAvailableStock(
  variantId: string,
  saleItemId: string,
  replacements: Record<string, ReplacementOption>,
  quantities: Record<string, number>
) {
  const replacement = replacements[saleItemId]
  if (!replacement || replacement.id !== variantId) return 0

  const reservedByOthers = Object.entries(replacements).reduce(
    (total, [otherSaleItemId, option]) =>
      otherSaleItemId !== saleItemId && option.id === variantId
        ? total + (quantities[otherSaleItemId] ?? 0)
        : total,
    0
  )
  return Math.max(0, replacement.stockQty - reservedByOthers)
}

function formatReplacementLabel(option: ReplacementOption) {
  return `${option.productName} · ${option.colorName} / ${option.sizeName} · ${option.sku} · ${formatCurrency(option.price)} · ${option.stockQty} in stock`
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
    payments: sale.payments,
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

function StepLabel({ index, title }: { index: number; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <Badge
        variant="secondary"
        className="size-5 justify-center rounded-full p-0 text-xs"
      >
        {index}
      </Badge>
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
    </div>
  )
}

function Notice({
  children,
  destructive = false,
}: {
  children: ReactNode
  destructive?: boolean
}) {
  return (
    <div
      className={`rounded-lg border p-3 text-sm ${
        destructive
          ? "border-destructive/30 bg-destructive/5 text-destructive"
          : "border-border bg-muted/50 text-muted-foreground"
      }`}
    >
      {children}
    </div>
  )
}
