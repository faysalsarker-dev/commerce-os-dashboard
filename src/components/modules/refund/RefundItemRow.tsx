import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { remainingQty, type SaleItem } from "./types";
import { formatCurrency } from "@/lib/formatCurrency";

interface RefundItemRowProps {
  item: SaleItem;
  selectedQty: number;
  onChange: (saleItemId: string, qty: number) => void;
}

export function RefundItemRow({ item, selectedQty, onChange }: RefundItemRowProps) {
  const remaining = remainingQty(item);
  const disabled = remaining === 0;
  // DECISION POINT: refund amount uses unitPrice, not the post-discount line price.
  // Switch to (subtotal / quantity) here if the business wants discounts refunded proportionally.
  const amount = item.unitPrice * selectedQty;

  const set = (qty: number) => onChange(item.id, Math.min(remaining, Math.max(0, qty)));

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 rounded-lg border border-border p-3 transition-colors",
        disabled && "opacity-55",
        selectedQty > 0 && "border-primary/50 bg-primary/5",
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{item.productName}</p>
        <p className="numeric truncate text-xs text-muted-foreground">
          {item.sku} · {formatCurrency(item.unitPrice)} × {item.quantity}
        </p>
        <p className="numeric mt-0.5 text-xs text-muted-foreground">
          {item.alreadyRefundedQty > 0 ? `Already returned: ${item.alreadyRefundedQty} · ` : ""}
          {disabled ? "Nothing left to refund" : `Refundable: ${remaining}`}
        </p>
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="size-8"
          disabled={disabled || selectedQty === 0}
          onClick={() => set(selectedQty - 1)}
          aria-label={`Decrease refund quantity for ${item.productName}`}
        >
          <Minus className="size-3.5" />
        </Button>
        <Input
          value={selectedQty}
          disabled={disabled}
          inputMode="numeric"
          onChange={(e) => set(Number(e.target.value.replace(/\D/g, "")) || 0)}
          className="numeric h-8 w-14 text-center"
          aria-label={`Refund quantity for ${item.productName}`}
        />
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="size-8"
          disabled={disabled || selectedQty >= remaining}
          onClick={() => set(selectedQty + 1)}
          aria-label={`Increase refund quantity for ${item.productName}`}
        >
          <Plus className="size-3.5" />
        </Button>
      </div>

      <div className="w-24 shrink-0 text-right">
        <p className="numeric text-sm font-semibold text-foreground">{formatCurrency(amount)}</p>
      </div>
    </div>
  );
}