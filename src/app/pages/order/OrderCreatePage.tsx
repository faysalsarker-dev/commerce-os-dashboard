import { useMemo, useReducer, useState, type FormEvent } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch, type Resolver } from "react-hook-form"
import { Link, useNavigate } from "react-router"
import { toast } from "sonner"
import { ArrowLeft, Loader2, UserRound } from "lucide-react"
import {
  BillSummary,
  CustomerLookup,
  ProductList,
  ProductScanner,
  SaleAttributionFields,
} from "@/components/modules/sell-counter"
import { EntityFormField } from "@/components/modules/form/EntityFormField"
import { PageContainer, PageHeader } from "@/components/shared/common"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCreateCustomerMutation, useLazyGetCustomerByPhoneQuery } from "@/redux/features/customer/customer.api"
import { useGetCourierAccountsQuery } from "@/redux/features/courier-integration/courier-integration.api"
import { useCreateOrderMutation } from "@/redux/features/order/order.api"
import { useCheckoutMutation, useScanProductMutation } from "@/redux/features/sales/sales.api"
import { formatCurrency } from "@/lib/formatCurrency"
import { sellCounterReducer, initialState } from "@/logics/sellCounterReducer"
import { getErrorMessage } from "@/utils/asyncHandler"
import type { SaleChannel } from "@/types/data-types/sales/sales.types"
import { ORDER_CREATE_FORM_CONFIG } from "./order.config"
import {
  orderCreateSchema,
  type OrderCreateFormValues,
} from "@/types/validations/order/order-create.validation"

export default function OrderCreatePage() {
  const [state, dispatch] = useReducer(sellCounterReducer, initialState)
  const [selectedCourierId, setSelectedCourierId] = useState("")
  const [channel, setChannel] = useState<SaleChannel>("ONLINE")
  const [campaignId, setCampaignId] = useState("")
  const navigate = useNavigate()
  const [scanProduct, { isLoading: isScanning }] = useScanProductMutation()
  const [checkout, { isLoading: isCheckingOut }] = useCheckoutMutation()
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation()
  const {
    data: courierAccountsResponse,
    isLoading: isLoadingCouriers,
    isError: isCourierError,
    error: courierError,
    refetch: refetchCouriers,
  } = useGetCourierAccountsQuery({ page: 1, limit: 100, isActive: true })
  const [getCustomerByPhone, { isFetching: isSearchingCustomer }] =
    useLazyGetCustomerByPhoneQuery()
  const [createCustomer] = useCreateCustomerMutation()
  const form = useForm<OrderCreateFormValues>({
    resolver: zodResolver(orderCreateSchema) as Resolver<OrderCreateFormValues>,
    defaultValues: { advanceAmount: 0, estimatedDeliveryDate: "" },
  })
  const watchedValues = useWatch({ control: form.control }) as Partial<
    OrderCreateFormValues
  >
  const availableCouriers = useMemo(
    () => courierAccountsResponse?.data.filter((account) => account.isActive) ?? [],
    [courierAccountsResponse?.data]
  )

  const defaultCourierId =
    availableCouriers.find((account) => account.isDefault)?.id ??
    availableCouriers[0]?.id ??
    ""
  const activeCourierId = availableCouriers.some(
    (account) => account.id === selectedCourierId
  )
    ? selectedCourierId
    : defaultCourierId

  const rawSubtotal = useMemo(
    () =>
      state.lines.reduce(
        (sum, line) => sum + line.sellingPrice * line.quantity,
        0
      ),
    [state.lines]
  )
  const lineDiscountTotal = useMemo(
    () => state.lines.reduce((sum, line) => sum + (line.discount ?? 0), 0),
    [state.lines]
  )
  const subtotal = Math.max(0, rawSubtotal - lineDiscountTotal)
  const courierCharge = watchedValues.courierCharge ?? 0
  const total = Math.max(0, subtotal + courierCharge - state.discount)
  const advanceAmount = watchedValues.advanceAmount ?? 0
  const payableAmount = Math.max(0, total - advanceAmount)
  const isSubmitting = isCheckingOut || isCreatingOrder

  const handleScanProduct = async (code: string) => {
    if (!code.trim()) return
    try {
      const response = await scanProduct({ code: code.trim() }).unwrap()
      const scanned = response.data
      const existing = state.lines.find((line) => line.id === scanned.variantId)
      if (existing && existing.quantity >= scanned.stockQty) {
        toast.warning("Not enough stock", {
          description: `Only ${scanned.stockQty} of ${scanned.productName} available.`,
        })
        return
      }
      if (!existing && scanned.stockQty < 1) {
        toast.warning("Out of stock", {
          description: `${scanned.productName} has no stock available.`,
        })
        return
      }
      dispatch(
        existing
          ? { type: "INCREMENT_LINE", id: scanned.variantId }
          : {
              type: "ADD_LINE",
              line: { ...scanned, id: scanned.variantId, quantity: 1 },
            }
      )
    } catch (error) {
      toast.error("Product not found", {
        description:
          getErrorMessage(error, `No product matched "${code}".`) +
          " Check the product ID, barcode, or SKU and try again.",
      })
    }
  }

  const handleSearchCustomer = async (phone: string) => {
    const normalizedPhone = phone.trim()
    if (!normalizedPhone) return
    dispatch({ type: "SET_CUSTOMER", customer: null, notFoundPhone: null })
    try {
      const response = await getCustomerByPhone(normalizedPhone).unwrap()
      if (!response.data) {
        dispatch({
          type: "SET_CUSTOMER",
          customer: null,
          notFoundPhone: normalizedPhone,
        })
        return
      }
      dispatch({
        type: "SET_CUSTOMER",
        customer: response.data,
        notFoundPhone: null,
      })
    } catch (error) {
      toast.error("Customer search failed", {
        description: getErrorMessage(error, "Please try searching again."),
      })
    }
  }

  const handleCreateCustomer = async (name: string, phone: string) => {
    try {
      const response = await createCustomer({ name, phone }).unwrap()
      dispatch({
        type: "SET_CUSTOMER",
        customer: response.data,
        notFoundPhone: null,
      })
      toast.success("Customer created successfully.")
    } catch (error) {
      toast.error("Customer could not be created", {
        description: getErrorMessage(error, "Please try again."),
      })
    }
  }

  const handleQuantityChange = (id: string, quantity: number) => {
    const line = state.lines.find((item) => item.id === id)
    if (line && quantity > line.stockQty) {
      toast.warning("Stock limit reached", {
        description: `Only ${line.stockQty} pc available in stock for ${line.productName}.`,
      })
      dispatch({ type: "SET_QUANTITY", id, quantity: line.stockQty })
      return
    }
    dispatch({ type: "SET_QUANTITY", id, quantity })
  }

  const handleCreateOrder = async (values: OrderCreateFormValues) => {
    if (!state.customer) {
      toast.warning("Find or create a customer before placing this order.")
      return
    }
    if (!state.lines.length) {
      toast.warning("Add at least one product to this order.")
      return
    }

    const enteredAdvance = values.advanceAmount ?? 0
    const enteredCourierCharge = values.courierCharge ?? 0
    const orderTotal = Math.max(
      0,
      subtotal + enteredCourierCharge - state.discount
    )
    if (enteredAdvance > orderTotal) {
      toast.warning("The advance cannot be greater than the order total.")
      return
    }
    const isFullPayment =
      Math.round(enteredAdvance * 100) === Math.round(orderTotal * 100)
    let createdInvoiceNo: string | null = null

    try {
      const checkoutResponse = await checkout({
        customerId: state.customer.id,
        items: state.lines.map((line) => ({
          variantId: line.id,
          quantity: line.quantity,
          discount: line.discount && line.discount > 0 ? line.discount : undefined,
        })),
        discount: state.discount > 0 ? state.discount : undefined,
        shippingFee: enteredCourierCharge > 0 ? enteredCourierCharge : undefined,
        channel,
        campaignId: campaignId || undefined,
        paymentMethod: "CASH",
        payments:
          enteredAdvance > 0
            ? [{ method: "CASH", amount: enteredAdvance }]
            : undefined,
        isFullPayment,
        paidAmount: isFullPayment ? undefined : enteredAdvance,
      }).unwrap()
      createdInvoiceNo = checkoutResponse.data.invoice.invoiceNo

      await createOrder({
        customerId: state.customer.id,
        saleId: checkoutResponse.data.invoice.saleId,
        estimatedDeliveryDate: values.estimatedDeliveryDate || undefined,
        courierAccountId: activeCourierId || undefined,
      }).unwrap()

      toast.success("Order created", {
        description: `Invoice #${createdInvoiceNo} has been added to orders.`,
      })
      navigate("/app/orders")
    } catch (error) {
      toast.error(
        createdInvoiceNo
          ? `Sale ${createdInvoiceNo} was created, but the order could not be linked.`
          : "Order could not be created.",
        {
          description: getErrorMessage(
            error,
            "Please check the details and try again."
          ),
        }
      )
    }
  }

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    void form.handleSubmit(handleCreateOrder)(event)
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Order counter"
          description="Find a customer, add products, and record an advance payment."
          actions={
            <Button
              asChild
              variant="outline"
              className="h-10 gap-2 rounded-xl"
            >
              <Link to="/app/orders">
                <ArrowLeft className="size-4" />
                Back to orders
              </Link>
            </Button>
          }
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-4">
            <ProductScanner
              onScan={(code) => void handleScanProduct(code)}
              isLoading={isScanning}
            />
            <ProductList
              lines={state.lines}
              onQuantityChange={handleQuantityChange}
              onDiscountChange={(id, discount, discountPercent) =>
                dispatch({
                  type: "SET_LINE_DISCOUNT",
                  id,
                  discount,
                  discountPercent,
                })
              }
              onRemove={(id) => dispatch({ type: "REMOVE_LINE", id })}
            />
          </div>

          <aside className="space-y-4">
            <CustomerLookup
              customer={state.customer}
              notFoundPhone={state.notFoundPhone}
              isSearching={isSearchingCustomer}
              onSearch={handleSearchCustomer}
              onCreate={(name, phone) =>
                void handleCreateCustomer(name, phone)
              }
              onClear={() => dispatch({ type: "CLEAR_CUSTOMER" })}
            />
            {state.customer && (
              <Button asChild variant="link" className="-mt-3 h-auto p-0">
                <Link to={`/app/customers/${state.customer.id}`}>
                  <UserRound className="size-4" />
                  View customer profile
                </Link>
              </Button>
            )}

            <Card className="space-y-3 p-4">
              <div className="space-y-1">
                <h2 className="text-sm font-semibold">Courier</h2>
                <p className="text-xs text-muted-foreground">
                  Choose the courier account for this online order.
                </p>
              </div>
              {isLoadingCouriers ? (
                <p className="text-sm text-muted-foreground">
                  Loading courier accounts...
                </p>
              ) : isCourierError ? (
                <div className="space-y-2">
                  <p role="alert" className="text-sm text-destructive">
                    {getErrorMessage(
                      courierError,
                      "Courier accounts could not be loaded."
                    )}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => void refetchCouriers()}
                  >
                    Retry
                  </Button>
                </div>
              ) : availableCouriers.length ? (
                <div className="space-y-2">
                  <Label htmlFor="order-courier">Courier account</Label>
                  <Select
                    value={activeCourierId}
                    onValueChange={setSelectedCourierId}
                  >
                    <SelectTrigger id="order-courier" className="w-full">
                      <SelectValue placeholder="Select a courier" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCouriers.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.label} ·{" "}
                          {account.provider === "PATHAO" ? "Pathao" : "Steadfast"}
                          {account.isDefault ? " · Default" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="space-y-2 rounded-lg border border-dashed p-3">
                  <p className="text-sm text-muted-foreground">
                    No active courier is set up yet.
                  </p>
                  <Button asChild variant="link" className="h-auto p-0">
                    <Link to="/app/courier-integrations">
                      Configure a courier
                    </Link>
                  </Button>
                </div>
              )}
            </Card>

            <BillSummary
              subtotal={subtotal}
              lineDiscount={lineDiscountTotal}
              discount={state.discount}
              total={total}
              courierCharge={courierCharge}
              onDiscountChange={(discount) =>
                dispatch({ type: "SET_DISCOUNT", discount })
              }
            />

            <SaleAttributionFields
              channel={channel}
              campaignId={campaignId}
              onChannelChange={setChannel}
              onCampaignChange={setCampaignId}
            />

            <Card className="p-4">
              <Form {...form}>
                <form onSubmit={submitForm} className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-sm font-semibold">Order options</h2>
                    <p className="text-xs text-muted-foreground">
                      Advance received: {formatCurrency(advanceAmount)}
                    </p>
                    <p className="text-sm font-semibold">
                      Payable amount: {formatCurrency(payableAmount)}
                    </p>
                  </div>
                  <div className="space-y-4">
                    {ORDER_CREATE_FORM_CONFIG.map((fieldConfig) => (
                      <EntityFormField
                        key={String(fieldConfig.name)}
                        control={form.control}
                        config={fieldConfig}
                        watchedValues={watchedValues}
                      />
                    ))}
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={
                      isSubmitting ||
                      isScanning ||
                      !state.customer ||
                      state.lines.length === 0
                    }
                  >
                    {isSubmitting && (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    )}
                    {isSubmitting ? "Creating order..." : "Create order"}
                  </Button>
                </form>
              </Form>
            </Card>
          </aside>
        </div>
      </div>
    </PageContainer>
  )
}
