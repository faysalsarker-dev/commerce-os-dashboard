import { AlertTriangle, Loader2, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnimatedAmount } from "./AnimatedAmount";
import { REFUND_METHODS, type RefundMethod } from "./types";

interface RefundConfirmPanelProps {
  amount: number;
  itemCount: number;
  method: RefundMethod | null;
  reason: string;
  exceedsPaid: boolean;
  isSubmitting: boolean;
  error: string | null;
  onMethodChange: (method: RefundMethod) => void;
  onReasonChange: (reason: string) => void;
  onSubmit: () => void;
}

export function RefundConfirmPanel({
  amount,
  itemCount,
  method,
  reason,
  exceedsPaid,
  isSubmitting,
  error,
  onMethodChange,
  onReasonChange,
  onSubmit,
}: RefundConfirmPanelProps) {
  return (
    <Card className="space-y-4 p-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Refund total</p>
          <AnimatedAmount value={amount} className="text-2xl font-semibold text-foreground" />
        </div>
        <p className="numeric text-xs text-muted-foreground">
          {itemCount} item{itemCount === 1 ? "" : "s"}
        </p>
      </div>

      {exceedsPaid ? (
        <div className="flex gap-2 rounded-md border border-warning/40 bg-warning/10 p-3 text-xs text-foreground">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
          <span>
            This refund is larger than the amount the customer actually paid on this sale. Confirm
            with a manager before processing.
          </span>
        </div>
      ) : null}

      <div className="space-y-1.5">
        <Label className="text-xs">Refund method</Label>
        <Select value={method ?? undefined} onValueChange={(v) => onMethodChange(v as RefundMethod)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a method" />
          </SelectTrigger>
          <SelectContent>
            {REFUND_METHODS.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="refund-reason" className="text-xs">
          Reason <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="refund-reason"
          rows={3}
          placeholder="e.g. wrong size, changed mind, damaged item"
          value={reason}
          onChange={(e) => onReasonChange(e.target.value)}
        />
      </div>

      {error ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 p-2.5 text-xs text-destructive">
          {error}
        </p>
      ) : null}

      <Button
        type="button"
        className="w-full"
        disabled={!method || amount <= 0 || isSubmitting}
        onClick={onSubmit}
      >
        {isSubmitting ? (
          <Loader2 className="mr-2 size-4 animate-spin" />
        ) : (
          <RotateCcw className="mr-2 size-4" />
        )}
        {error && !isSubmitting ? "Retry refund" : "Process refund"}
      </Button>
    </Card>
  );
}