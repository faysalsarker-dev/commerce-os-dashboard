import { useState } from "react";
import { AlertTriangle, TicketPercent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/formatCurrency";
import { cn } from "@/lib/utils";

interface BillSummaryProps {
  subtotal: number;
  lineDiscount?: number;
  discount: number;
  total: number;
  onDiscountChange: (value: number) => void;
  // onApplyCoupon: (code: string) => void;
}

export function BillSummary({
  subtotal,
  lineDiscount = 0,
  discount,
  total,
  onDiscountChange,
  // onApplyCoupon,
}: BillSummaryProps) {
  const [coupon, setCoupon] = useState("");

  return (
    <Card className="space-y-4 p-4">
      <h2 className="text-sm font-semibold text-foreground">Billing</h2>

      <form
        className="flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          // if (coupon.trim()) onApplyCoupon(coupon.trim());
        }}
      >
        <Input
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          placeholder="Coupon code"
          aria-label="Coupon code"
        />
        <Button type="submit" variant="secondary">
          <TicketPercent /> Apply
        </Button>
      </form>

      <div className="space-y-1.5">
        <Label htmlFor="discount-amount" className="text-xs">
          Order discount
        </Label>
        <Input
          id="discount-amount"
          type="number"
          min={0}
          value={discount === 0 ? "" : discount}
          placeholder="0"
          onChange={(e) => onDiscountChange(Math.max(0, Number(e.target.value) || 0))}
          className={cn(
            "numeric transition-colors",
            subtotal > 0 && discount >= subtotal
              ? "border-amber-500/60 text-amber-700 focus-visible:ring-amber-500/40 bg-amber-500/10 dark:text-amber-300"
              : discount > 0
                ? "border-emerald-500/60 text-emerald-700 focus-visible:ring-emerald-500/30 bg-emerald-500/5 dark:text-emerald-300"
                : ""
          )}
        />
        {subtotal > 0 && discount >= subtotal && (
          <div className="flex items-center gap-1.5 text-[11px] text-amber-800 dark:text-amber-300 font-medium pt-0.5">
            <AlertTriangle className="size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>Warning: 100% order discount (Sale total is ৳0.00).</span>
          </div>
        )}
      </div>

      <Separator />

      <dl className="space-y-2 text-sm">
        {lineDiscount > 0 ? (
          <>
            <Row label="Items total" value={formatCurrency(subtotal + lineDiscount)} />
            <Row label="Item discounts" value={`− ${formatCurrency(lineDiscount)}`} muted />
            {discount > 0 && (
              <Row label="Order discount" value={`− ${formatCurrency(discount)}`} muted />
            )}
          </>
        ) : (
          <>
            <Row label="Subtotal" value={formatCurrency(subtotal)} />
            <Row label="Discount" value={`− ${formatCurrency(discount)}`} muted />
          </>
        )}
        <Separator />
        <div className="flex items-center justify-between">
          <dt className="text-sm font-semibold">Total</dt>
          <dd className="numeric text-lg font-semibold">{formatCurrency(total)}</dd>
        </div>
      </dl>
    </Card>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={muted ? "numeric text-muted-foreground" : "numeric font-medium"}>{value}</dd>
    </div>
  );
}