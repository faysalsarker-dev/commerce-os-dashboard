import { useState } from "react";
import { TicketPercent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/formatCurrency";

interface BillSummaryProps {
  subtotal: number;
  discount: number;
  total: number;
  onDiscountChange: (value: number) => void;
  // onApplyCoupon: (code: string) => void;
}

export function BillSummary({
  subtotal,
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
          Manual discount
        </Label>
        <Input
          id="discount-amount"
          type="number"
          min={0}
          value={discount === 0 ? "" : discount}
          placeholder="0"
          onChange={(e) => onDiscountChange(Math.max(0, Number(e.target.value) || 0))}
          className="numeric"
        />
      </div>

      <Separator />

      <dl className="space-y-2 text-sm">
        <Row label="Subtotal" value={formatCurrency(subtotal)} />
        <Row label="Discount" value={`− ${formatCurrency(discount)}`} muted />
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