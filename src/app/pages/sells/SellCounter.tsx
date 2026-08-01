import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  lookupCustomerByPhone,
  lookupProductByCode,
  type CartLine,
  type PosCustomer,
} from "@/components/modules/sell-counter/types";
import { formatCurrency } from "@/lib/formatCurrency";
import { PageContainer } from "@/components/shared/common";

export function SellCounter() {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [customer, setCustomer] = useState<PosCustomer | null>(null);
  const [notFoundPhone, setNotFoundPhone] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null);
  const [amountReceived, setAmountReceived] = useState(0);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);

  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.sellingPrice * l.quantity, 0),
    [lines],
  );
  const total = Math.max(0, subtotal - discount);
  const due = Math.max(0, total - amountReceived);

  /** Stub — will call the product API later. */
  const handleScanProduct = async (code: string) => {
    console.log("handleScanProduct", code);
    const product = await lookupProductByCode(code);
    if (!product) return;
    setLines((prev) => {
      const existing = prev.find((l) => l.id === product.id);
      if (existing) {
        return prev.map((l) => (l.id === product.id ? { ...l, quantity: l.quantity + 1 } : l));
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, quantity } : l)));
  };

  const handleRemoveLine = (id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  };

  const handleSearchCustomer = async (phone: string) => {
    console.log("handleSearchCustomer", phone);
    const found = await lookupCustomerByPhone(phone);
    if (found) {
      setCustomer(found);
      setNotFoundPhone(null);
    } else {
      setCustomer(null);
      setNotFoundPhone(phone.trim());
    }
  };

  const handleCreateCustomer = (name: string, phone: string) => {
    console.log("handleCreateCustomer", { name, phone });
    setCustomer({ id: `new_${phone}`, name, phone });
    setNotFoundPhone(null);
  };

  const handleApplyCoupon = (code: string) => {
    console.log("handleApplyCoupon", code);
  };

  const handleSelectPaymentMethod = (id: string) => {
    console.log("handleSelectPaymentMethod", id);
    setPaymentMethodId(id);
  };

  const handlePrintBill = () => {
    console.log("handlePrintBill");
  };

  const handleCompleteSale = () => {
    console.log("handleCompleteSale", {
      lines,
      customer,
      discount,
      total,
      paymentMethodId,
      amountReceived,
      due,
      dueDate,
    });
    handlePrintBill();
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
            <ProductScanner onScan={(code) => void handleScanProduct(code)} />
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
              onClear={() => {
                setCustomer(null);
                setNotFoundPhone(null);
              }}
            />

            <BillSummary
              subtotal={subtotal}
              discount={discount}
              total={total}
              onDiscountChange={setDiscount}
              onApplyCoupon={handleApplyCoupon}
            />

            <Card className="space-y-4 p-4">
              <PaymentMethodSelector
                methods={PAYMENT_METHODS}
                selectedId={paymentMethodId}
                onSelect={handleSelectPaymentMethod}
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
                  onChange={(e) => setAmountReceived(Math.max(0, Number(e.target.value) || 0))}
                  className="numeric"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Due</span>
                <span className="numeric font-semibold">{formatCurrency (due)}</span>
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
                    <DueDatePicker date={dueDate} onChange={setDueDate} />
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <CompleteSaleButton disabled={lines.length === 0} onComplete={handleCompleteSale} />
            </Card>
          </aside>
        </div>
      </div>
    </PageContainer>
  );
}

export default SellCounter;