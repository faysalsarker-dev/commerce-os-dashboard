import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Info } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SaleSearch } from "@/components/modules/refund/SaleSearch";
import { SaleSummaryCard } from "@/components/modules/refund/SaleSummaryCard";
import { RefundItemList } from "@/components/modules/refund/RefundItemList";
import { RefundConfirmPanel } from "@/components/modules/refund/RefundConfirmPanel";
import { RefundSuccess } from "@/components/modules/refund/RefundSuccess";
import {
  createRefund,
  ineligibleReason,
  lookupSale,
  type RefundMethod,
  type RefundResult,
  type Sale,
} from "@/components/modules/refund/types";
import { PageContainer } from "@/components/shared/common";

/** Current staff member — comes from the session in the real app. */
const PROCESSED_BY_ID = "staff_current";

export function RefundCounter() {
  const [sale, setSale] = useState<Sale | null>(null);
  const [searched, setSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [method, setMethod] = useState<RefundMethod | null>(null);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RefundResult | null>(null);

  const blockedReason = sale ? ineligibleReason(sale) : null;

  const selectedItems = useMemo(() => {
    if (!sale) return [];
    return sale.items
      .filter((i) => (quantities[i.id] ?? 0) > 0)
      .map((i) => ({
        saleItemId: i.id,
        variantId: i.variantId,
        quantity: quantities[i.id] ?? 0,
        // Uses unitPrice (see decision-point note in RefundItemRow).
        amount: i.unitPrice * (quantities[i.id] ?? 0),
      }));
  }, [sale, quantities]);

  const amount = selectedItems.reduce((sum, i) => sum + i.amount, 0);
  const exceedsPaid = Boolean(sale && amount > sale.paidAmount);

  const handleSearch = async (query: string) => {
    if (!query) {
      setSale(null);
      setSearched(false);
      return;
    }
    setIsSearching(true);
    const found = await lookupSale(query);
    setSale(found);
    setQuantities({});
    setMethod(null);
    setError(null);
    setSearched(true);
    setIsSearching(false);
  };

  const handleQuantityChange = (saleItemId: string, qty: number) => {
    setQuantities((prev) => ({ ...prev, [saleItemId]: qty }));
  };

  const handleSubmit = async () => {
    if (!sale || !method) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const refund = await createRefund({
        saleId: sale.id,
        items: selectedItems,
        amount,
        method,
        reason: reason.trim() || undefined,
        processedById: PROCESSED_BY_ID,
      });
      setResult(refund);
    } catch {
      // Selections are intentionally preserved so the operator can retry.
      setError("Couldn't process the refund. Check the connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setSale(null);
    setSearched(false);
    setQuantities({});
    setMethod(null);
    setReason("");
    setError(null);
  };

  const handlePrint = () => {
    console.log("handlePrintRefundReceipt", result);
  };

  if (result) {
    return (
      <PageContainer>
        <RefundSuccess result={result} onReset={handleReset} onPrint={handlePrint} />
      </PageContainer>
    );
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
              <SaleSearch onSearch={(q) => void handleSearch(q)} isSearching={isSearching} />

              {searched && !sale && !isSearching ? (
                <p className="text-sm text-muted-foreground">
                  No sale found for that invoice or phone number.
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
                  <StepLabel index={3} title="Confirm refund" className="mb-3" />
                  <RefundConfirmPanel
                    amount={amount}
                    itemCount={selectedItems.length}
                    method={method}
                    reason={reason}
                    exceedsPaid={exceedsPaid}
                    isSubmitting={isSubmitting}
                    error={error}
                    onMethodChange={setMethod}
                    onReasonChange={setReason}
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
  );
}

function StepLabel({
  index,
  title,
  className,
}: {
  index: number;
  title: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <Badge variant="secondary" className="numeric size-5 justify-center rounded-full p-0 text-xs">
        {index}
      </Badge>
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
    </div>
  );
}

export default RefundCounter;