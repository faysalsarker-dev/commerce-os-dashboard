import { useEffect, useMemo, useReducer, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ProductScanner } from "@/components/modules/sell-counter/ProductScanner";
import { ProductList } from "@/components/modules/sell-counter/ProductList";
import { CustomerLookup } from "@/components/modules/sell-counter/CustomerLookup";
import { BillSummary } from "@/components/modules/sell-counter/BillSummary";
import { PaymentMethodSelector } from "@/components/modules/sell-counter/PaymentMethodSelector";
import { DueDatePicker } from "@/components/modules/sell-counter/DueDatePicker";
import { CompleteSaleButton } from "@/components/modules/sell-counter/CompleteSaleButton";
import {
  PAYMENT_METHODS,
  type PaymentMethod,
} from "@/components/modules/sell-counter/types";
import { formatCurrency } from "@/lib/formatCurrency";
import { PageContainer } from "@/components/shared/common";
import {
  useScanProductMutation,
  useCheckoutMutation,
} from "@/redux/features/sales/sales.api";
import {
  useCreateCustomerMutation,
  useGetCustomerByPhoneQuery,
} from "@/redux/features/customer/customer.api";
import { sellCounterReducer, initialState } from "@/logics/sellCounterReducer";
import { useNavigate } from "react-router";

export function SellCounter() {
  const [state, dispatch] = useReducer(sellCounterReducer, initialState);
  const { lines, customer, notFoundPhone, discount, paymentMethodId, amountReceived, dueDate } = state;
  const [searchedPhone, setSearchedPhone] = useState<string | null>(null);
const navigate = useNavigate()
  const [scanProduct, { isLoading: isScanning }] = useScanProductMutation();
  const [checkout, { isLoading: isCheckingOut }] = useCheckoutMutation();
  const { data: searchedCustomerResponse, isSuccess: isCustomerSearchSuccess, isError: customerSearchError } = useGetCustomerByPhoneQuery(searchedPhone ?? "", {
    skip: !searchedPhone,
  });
  const [createCustomer] = useCreateCustomerMutation();

  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.sellingPrice * l.quantity, 0),
    [lines],
  );
  const total = Math.max(0, subtotal - discount);
  const due = Math.max(0, total - amountReceived);

  const handleScanProduct = async (code: string) => {
    if (!code.trim()) return;
    try {
      const res = await scanProduct({ code: code.trim() }).unwrap();
      const scanned = res.data;
      const existing = lines.find((l) => l.id === scanned.variantId);

      if (existing) {
        if (existing.quantity + 1 > scanned.stockQty) {
          toast.warning("Not enough stock", {
            description: `Only ${scanned.stockQty} of ${scanned.productName} available.`,
          });
          return;
        }
        dispatch({ type: "INCREMENT_LINE", id: scanned.variantId });
        return;
      }

      if (scanned.stockQty < 1) {
        toast.warning("Out of stock", {
          description: `${scanned.productName} has no stock available.`,
        });
        return;
      }

      dispatch({ type: "ADD_LINE", line: { ...scanned, id: scanned.variantId, quantity: 1 } });
    } catch {
      toast.error("Product not found", {
        description: `No product matched "${code}". Check the barcode or SKU and try again.`,
      });
    }
  };

  const handleQuantityChange = (id: string, quantity: number) =>
    dispatch({ type: "SET_QUANTITY", id, quantity });

  const handleRemoveLine = (id: string) => dispatch({ type: "REMOVE_LINE", id });

  const handleSearchCustomer = (phone: string) => {
    const normalized = phone.trim();
    if (!normalized) return;

    setSearchedPhone(normalized);
    dispatch({ type: "SET_CUSTOMER", customer: null, notFoundPhone: null });
  };

  const handleCreateCustomer = async (name: string, phone: string) => {
    try {
      const res = await createCustomer({ name, phone }).unwrap();
      const createdCustomer = res.data;

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
      });
      setSearchedPhone(null);
      toast.success("Customer created successfully.");
    } catch {
      toast.error("Failed to create customer. Please try again.");
    }
  };

  useEffect(() => {
    if (!searchedPhone) return;

    if (customerSearchError) {
      toast.error("Failed to search for customer. Please try again.");
      return;
    }

    if (!searchedCustomerResponse) return;

    const responseCustomer =  searchedCustomerResponse?.data;
    if (responseCustomer) {
      dispatch({
        type: "SET_CUSTOMER",
        customer: {
          id: responseCustomer.id,
          name: responseCustomer.name,
          phone: responseCustomer.phone ?? searchedPhone,
          totalDue: responseCustomer.totalDue ?? 0,
          totalOrders: responseCustomer.totalOrders ?? 0,
          totalSpent: responseCustomer.totalSpent ?? 0,
        },
        notFoundPhone: null,
      });
      return;
    }

    if (isCustomerSearchSuccess) {
      dispatch({ type: "SET_CUSTOMER", customer: null, notFoundPhone: searchedPhone });
    }
  }, [searchedPhone, searchedCustomerResponse, customerSearchError, isCustomerSearchSuccess, dispatch]);

 const handleCompleteSale = async () => {
  if (!paymentMethodId) {
    toast.warning("Select a payment method before completing the sale.");
    return;
  }
  const isFullPayment = due <= 0;

  if (!isFullPayment && !customer) {
    toast.warning("Select a customer before completing a sale with a due balance.");
    return;
  }

  if (!isFullPayment && due > 0 && !dueDate) {
    toast.warning("Set a due date for the remaining balance.");
    return;
  }

  try {
    const res = await checkout({
      items: lines.map((l) => ({ variantId: l.id, quantity: l.quantity })), // unitPrice dropped — backend derives it from DB
      paymentMethod: paymentMethodId.toUpperCase(),
      discount: discount > 0 ? discount : undefined,
      customerId: customer?.id,
      isFullPayment,
      paidAmount: isFullPayment ? undefined : amountReceived,
      dueDate: !isFullPayment && dueDate ? dueDate.toISOString() : undefined,
    }).unwrap();

    toast.success("Sale completed!", {
      description: `Invoice #${res.data.invoice.invoiceNo} — ${formatCurrency(res.data.invoice.total)}`,
    });

    dispatch({ type: "RESET_SALE" });
    navigate("/app/sell/invoice", { state: { invoice: res.data.invoice } });
  } catch {
    toast.error("Checkout failed", {
      description: "Something went wrong processing the sale. Please try again.",
    });
  }
};

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
              onSearch={handleSearchCustomer}
              onCreate={handleCreateCustomer}
              onClear={() => dispatch({ type: "CLEAR_CUSTOMER" })}
            />

            <BillSummary
              subtotal={subtotal}
              discount={discount}
              total={total}
              onDiscountChange={(value) => dispatch({ type: "SET_DISCOUNT", discount: value })}
            />

            <Card className="space-y-4 p-4">
              <PaymentMethodSelector
                methods={PAYMENT_METHODS}
                selectedId={paymentMethodId}
                onSelect={(id) => dispatch({ type: "SET_PAYMENT_METHOD", id })}
              />

              <Separator />

              <div className="space-y-1.5">
                <Label htmlFor="amount-received" className="text-xs">
                  Amount received
                </Label>
                <Input
                  id="amount-received"
                  type="number"
                  min={0}
                  placeholder="0"
                  value={amountReceived === 0 ? "" : amountReceived}
                  onChange={(e) =>
                    dispatch({ type: "SET_AMOUNT_RECEIVED", amount: Math.max(0, Number(e.target.value) || 0) })
                  }
                  className="numeric"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Due</span>
                <span className="numeric font-semibold">{formatCurrency(due)}</span>
              </div>

              <AnimatePresence initial={false}>
                {due > 0 ? (
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
                      onChange={(date) => dispatch({ type: "SET_DUE_DATE", date })}
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <CompleteSaleButton
                disabled={lines.length === 0 || isCheckingOut}
                isLoading={isCheckingOut}
                onComplete={handleCompleteSale}
              />
            </Card>
          </aside>
        </div>
      </div>
    </PageContainer>
  );
}

export default SellCounter;