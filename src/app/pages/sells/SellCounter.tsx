import { useMemo, useReducer } from "react";
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
} from "@/components/modules/sell-counter/types";
import { formatCurrency } from "@/lib/formatCurrency";
import { PageContainer } from "@/components/shared/common";
import {
  useScanProductMutation,
  useCheckoutMutation,
} from "@/redux/features/sales/sales.api";
import { sellCounterReducer, initialState } from "@/logics/sellCounterReducer";

export function SellCounter() {
  const [state, dispatch] = useReducer(sellCounterReducer, initialState);
  const { lines, customer, notFoundPhone, discount, paymentMethodId, amountReceived, dueDate } = state;

  const [scanProduct, { isLoading: isScanning }] = useScanProductMutation();
  const [checkout, { isLoading: isCheckingOut }] = useCheckoutMutation();

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

  const handleSearchCustomer = async (phone: string) => {
    dispatch({ type: "SET_CUSTOMER", customer: null, notFoundPhone: phone.trim() });
  };

  const handleCreateCustomer = (name: string, phone: string) => {
    dispatch({ type: "SET_CUSTOMER", customer: { id: `new_${phone}`, name, phone }, notFoundPhone: null });
  };

  const handleCompleteSale = async () => {
    if (!paymentMethodId) {
      toast.warning("Select a payment method before completing the sale.");
      return;
    }
    try {
      const res = await checkout({
        items: lines.map((l) => ({ variantId: l.id, quantity: l.quantity, unitPrice: l.sellingPrice })),
        paymentMethod: paymentMethodId.toUpperCase(),
        discount: discount > 0 ? discount : undefined,
        totalAmount: total,
        customerId: customer?.id,
      }).unwrap();

      toast.success("Sale completed!", {
        description: `Invoice #${res.data.invoiceNumber} — ${formatCurrency(res.data.totalAmount)}`,
      });

      dispatch({ type: "RESET_SALE" });
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