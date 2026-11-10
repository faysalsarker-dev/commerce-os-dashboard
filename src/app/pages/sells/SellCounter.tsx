import { useMemo, useReducer } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { toast } from "sonner"
import { PageHeader } from "@/components/modules/Products/PageHeader"
import {
  Card,
  Separator,
  Badge,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui"

import {
  ProductScanner,
  ProductList,
  CustomerLookup,
  BillSummary,
  DueDatePicker,
  CompleteSaleButton,
} from "@/components/modules/sell-counter"
import {
  getTenderPayments,
  sumTenderAmounts,
  type PaymentMethod,
  type TenderMethod,
} from "@/types/data-types/payment.types"
import { formatCurrency } from "@/lib/formatCurrency"
import { PageContainer } from "@/components/shared/common"
import {
  useScanProductMutation,
  useCheckoutMutation,
  useCreateCustomerMutation,
  useLazyGetCustomerByPhoneQuery,
} from "@/redux/hooks"
import { sellCounterReducer, initialState } from "@/logics/sellCounterReducer"
import { useNavigate } from "react-router"

export function SellCounter() {
  const [state, dispatch] = useReducer(sellCounterReducer, initialState)
  const {
    lines,
    customer,
    notFoundPhone,
    discount,
    paymentMethod,
    payments,
    dueDate,
  } = state
  const navigate = useNavigate()
  const [scanProduct, { isLoading: isScanning }] = useScanProductMutation()
  const [checkout, { isLoading: isCheckingOut }] = useCheckoutMutation()
  const [getCustomerByPhone, { isFetching: isCustomerSearching }] =
    useLazyGetCustomerByPhoneQuery()
  const [createCustomer] = useCreateCustomerMutation()

  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.sellingPrice * l.quantity, 0),
    [lines]
  )
  const total = Math.max(0, subtotal - discount)
  const amountReceived = sumTenderAmounts(payments)
  const due = Math.max(0, total - amountReceived)
  const isOverpaid =
    Math.round(amountReceived * 100) > Math.round(total * 100)

  const handleScanProduct = async (code: string) => {
    if (!code.trim()) return
    try {
      const res = await scanProduct({ code: code.trim() }).unwrap()
      const scanned = res.data
      const existing = lines.find((l) => l.id === scanned.variantId)

      if (existing) {
        if (existing.quantity + 1 > scanned.stockQty) {
          toast.warning("Not enough stock", {
            description: `Only ${scanned.stockQty} of ${scanned.productName} available.`,
          })
          return
        }
        dispatch({ type: "INCREMENT_LINE", id: scanned.variantId })
        return
      }

      if (scanned.stockQty < 1) {
        toast.warning("Out of stock", {
          description: `${scanned.productName} has no stock available.`,
        })
        return
      }

      dispatch({
        type: "ADD_LINE",
        line: { ...scanned, id: scanned.variantId, quantity: 1 },
      })
    } catch {
      toast.error("Product not found", {
        description: `No product matched "${code}". Check the barcode or SKU and try again.`,
      })
    }
  }

  const handleQuantityChange = (id: string, quantity: number) =>
    dispatch({ type: "SET_QUANTITY", id, quantity })

  const handleRemoveLine = (id: string) => dispatch({ type: "REMOVE_LINE", id })

  const handleSearchCustomer = async (phone: string) => {
    const normalized = phone.trim()
    if (!normalized) return

    dispatch({ type: "SET_CUSTOMER", customer: null, notFoundPhone: null })

    try {
      const response = await getCustomerByPhone(normalized).unwrap()
      const foundCustomer = response.data

      if (!foundCustomer) {
        dispatch({
          type: "SET_CUSTOMER",
          customer: null,
          notFoundPhone: normalized,
        })
        return
      }

      dispatch({
        type: "SET_CUSTOMER",
        customer: {
          id: foundCustomer.id,
          name: foundCustomer.name,
          phone: foundCustomer.phone ?? normalized,
          totalDue: foundCustomer.totalDue ?? 0,
          totalOrders: foundCustomer.totalOrders ?? 0,
          totalSpent: foundCustomer.totalSpent ?? 0,
        },
        notFoundPhone: null,
      })
    } catch {
      toast.error("Failed to search for customer. Please try again.")
    }
  }

  const handleCreateCustomer = async (name: string, phone: string) => {
    try {
      const res = await createCustomer({ name, phone }).unwrap()
      const createdCustomer = res.data

      dispatch({
        type: "SET_CUSTOMER",
        customer: {
          id: createdCustomer.id,
          name: createdCustomer.name,
          phone: createdCustomer.phone ?? phone,
          totalDue: createdCustomer.totalDue ?? 0,
          totalOrders: createdCustomer.totalOrders ?? 0,
          totalSpent: createdCustomer.totalSpent ?? 0,
        },
        notFoundPhone: null,
      })
      toast.success("Customer created successfully.")
    } catch {
      toast.error("Failed to create customer. Please try again.")
    }
  }

  const handleAmountChange = (method: TenderMethod, rawAmount: string) => {
    const num = Number(rawAmount)
    dispatch({
      type: "SET_PAYMENT_AMOUNT",
      method,
      amount:
        rawAmount === "" || (Number.isFinite(num) && num >= 0) ? rawAmount : "",
    })
  }

  const handleFillExact = () => {
    if (paymentMethod === "MIX") {
      const cashNum = Number(payments.CASH.amount) || 0
      if (cashNum > 0 && cashNum < total) {
        const remaining = Math.round((total - cashNum) * 100) / 100
        dispatch({
          type: "SET_PAYMENT_AMOUNT",
          method: "BKASH",
          amount: String(remaining),
        })
      } else {
        dispatch({
          type: "SET_PAYMENT_AMOUNT",
          method: "CASH",
          amount: String(total),
        })
        dispatch({
          type: "SET_PAYMENT_AMOUNT",
          method: "BKASH",
          amount: "",
        })
      }
    } else {
      dispatch({
        type: "SET_PAYMENT_AMOUNT",
        method: paymentMethod as TenderMethod,
        amount: String(total),
      })
    }
  }

  const handleCompleteSale = async () => {
    if (isOverpaid) {
      toast.warning("Payment amounts cannot exceed the sale total.")
      return
    }
    const isFullPayment =
      Math.round(amountReceived * 100) === Math.round(total * 100)

    if (!isFullPayment && !customer) {
      toast.warning(
        "Select a customer before completing a sale with a due balance."
      )
      return
    }

    if (!isFullPayment && due > 0 && !dueDate) {
      toast.warning("Set a due date for the remaining balance.")
      return
    }

    try {
      const paymentEntries = getTenderPayments(payments)
      const res = await checkout({
        items: lines.map((l) => ({ variantId: l.id, quantity: l.quantity })),
        paymentMethod,
        payments: paymentEntries.length ? paymentEntries : undefined,
        discount: discount > 0 ? discount : undefined,
        customerId: customer?.id,
        isFullPayment,
        paidAmount: isFullPayment ? undefined : amountReceived,
        dueDate: !isFullPayment && dueDate ? dueDate.toISOString() : undefined,
      }).unwrap()

      toast.success("Sale completed!", {
        description: `Invoice #${res.data.invoice.invoiceNo} — ${formatCurrency(res.data.invoice.total)}`,
      })

      dispatch({ type: "RESET_SALE" })
      navigate("/invoice", { state: { invoice: res.data.invoice } })
    } catch {
      toast.error("Checkout failed", {
        description:
          "Something went wrong processing the sale. Please try again.",
      })
    }
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Sell counter"
          description="Scan products, attach a customer and take payment in one pass."
          actions={
            <Badge variant="secondary" className="numeric">
              {lines.length} line(s)
            </Badge>
          }
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-4">
            <ProductScanner
              onScan={(code) => void handleScanProduct(code)}
              isLoading={isScanning}
            />
            <ProductList
              lines={lines}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemoveLine}
            />
          </div>

          <aside className="space-y-4">
            <CustomerLookup
              customer={customer}
              notFoundPhone={notFoundPhone}
              isSearching={isCustomerSearching}
              onSearch={handleSearchCustomer}
              onCreate={handleCreateCustomer}
              onClear={() => dispatch({ type: "CLEAR_CUSTOMER" })}
            />

            <BillSummary
              subtotal={subtotal}
              discount={discount}
              total={total}
              onDiscountChange={(value) =>
                dispatch({ type: "SET_DISCOUNT", discount: value })
              }
            />

            <Card className="space-y-4 p-4">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="payment-method-select"
                      className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                    >
                      Payment method
                    </Label>
                    {total > 0 && amountReceived !== total && (
                      <button
                        type="button"
                        onClick={handleFillExact}
                        className="text-xs font-medium text-primary hover:underline cursor-pointer"
                      >
                        Exact ({formatCurrency(total)})
                      </button>
                    )}
                  </div>
                  <Select
                    value={paymentMethod}
                    onValueChange={(val) =>
                      dispatch({
                        type: "SET_PAYMENT_METHOD",
                        method: val as PaymentMethod,
                      })
                    }
                  >
                    <SelectTrigger id="payment-method-select" className="w-full">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CASH">Cash</SelectItem>
                      <SelectItem value="BKASH">bKash</SelectItem>
                      <SelectItem value="BANK_TRANSFER">Bank transfer</SelectItem>
                      <SelectItem value="MIX">Mix (Cash + bKash)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* If user select mix then open 2 inputs (one for cash, one for bkash) */}
                {paymentMethod === "MIX" ? (
                  <div className="space-y-3 pt-1">
                    <div className="space-y-1.5">
                      <Label htmlFor="mix-cash-amount" className="text-xs">
                        Cash amount
                      </Label>
                      <Input
                        id="mix-cash-amount"
                        type="text"
                        inputMode="decimal"
                        value={payments.CASH.amount}
                        onChange={(e) =>
                          handleAmountChange("CASH", e.target.value)
                        }
                        className="numeric"
                        placeholder="0.00"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="mix-bkash-amount" className="text-xs">
                        bKash amount
                      </Label>
                      <Input
                        id="mix-bkash-amount"
                        type="text"
                        inputMode="decimal"
                        value={payments.BKASH.amount}
                        onChange={(e) =>
                          handleAmountChange("BKASH", e.target.value)
                        }
                        className="numeric"
                        placeholder="0.00"
                      />
                    </div>

                    {Number(payments.BKASH.amount) > 0 && (
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="mix-bkash-reference"
                          className="text-xs"
                        >
                          bKash TrxID{" "}
                          <span className="text-muted-foreground">(optional)</span>
                        </Label>
                        <Input
                          id="mix-bkash-reference"
                          value={payments.BKASH.reference}
                          onChange={(e) =>
                            dispatch({
                              type: "SET_PAYMENT_REFERENCE",
                              method: "BKASH",
                              reference: e.target.value,
                            })
                          }
                          placeholder="Transaction ID"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  /* Otherwise normally only 1 input */
                  <div className="space-y-3 pt-1">
                    <div className="space-y-1.5">
                      <Label htmlFor="single-tender-amount" className="text-xs">
                        {paymentMethod === "CASH"
                          ? "Cash amount"
                          : paymentMethod === "BKASH"
                            ? "bKash amount"
                            : "Bank transfer amount"}
                      </Label>
                      <Input
                        id="single-tender-amount"
                        type="text"
                        inputMode="decimal"
                        value={
                          paymentMethod === "CASH"
                            ? payments.CASH.amount
                            : paymentMethod === "BKASH"
                              ? payments.BKASH.amount
                              : payments.BANK_TRANSFER.amount
                        }
                        onChange={(e) =>
                          handleAmountChange(
                            paymentMethod as TenderMethod,
                            e.target.value,
                          )
                        }
                        className="numeric"
                        placeholder="0.00"
                      />
                    </div>

                    {paymentMethod !== "CASH" &&
                      Number(
                        paymentMethod === "BKASH"
                          ? payments.BKASH.amount
                          : payments.BANK_TRANSFER.amount,
                      ) > 0 && (
                        <div className="space-y-1.5">
                          <Label
                            htmlFor="single-tender-reference"
                            className="text-xs"
                          >
                            Transaction reference{" "}
                            <span className="text-muted-foreground">(optional)</span>
                          </Label>
                          <Input
                            id="single-tender-reference"
                            value={
                              paymentMethod === "BKASH"
                                ? payments.BKASH.reference
                                : payments.BANK_TRANSFER.reference
                            }
                            onChange={(e) =>
                              dispatch({
                                type: "SET_PAYMENT_REFERENCE",
                                method: paymentMethod as TenderMethod,
                                reference: e.target.value,
                              })
                            }
                            placeholder={
                              paymentMethod === "BKASH"
                                ? "Transaction ID"
                                : "Bank reference / Slip ID"
                            }
                          />
                        </div>
                      )}
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Received</span>
                <span className="numeric font-semibold">
                  {formatCurrency(amountReceived)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {isOverpaid ? "Overpayment" : "Due"}
                </span>
                <span className="numeric font-semibold">
                  {formatCurrency(isOverpaid ? amountReceived - total : due)}
                </span>
              </div>
              {isOverpaid ? (
                <p className="text-xs text-destructive">
                  Tender amounts cannot exceed the total.
                </p>
              ) : null}

              <AnimatePresence initial={false}>
                {!isOverpaid && due > 0 ? (
                  <motion.div
                    key="due-date"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <DueDatePicker
                      date={dueDate}
                      onChange={(date) =>
                        dispatch({ type: "SET_DUE_DATE", date })
                      }
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <CompleteSaleButton
                disabled={lines.length === 0 || isCheckingOut || isOverpaid}
                isLoading={isCheckingOut}
                onComplete={handleCompleteSale}
              />
            </Card>
          </aside>
        </div>
      </div>
    </PageContainer>
  )
}

export default SellCounter
