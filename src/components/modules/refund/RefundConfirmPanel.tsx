import { AlertTriangle, Loader2, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/formatCurrency";
import {
  sumTenderAmounts,
  type PaymentMethod,
  type TenderAmounts,
  type TenderMethod,
} from "@/types/data-types/payment.types";
import { AnimatedAmount } from "./AnimatedAmount";

interface RefundConfirmPanelProps {
  amount: number;
  itemCount: number;
  paymentMethod: PaymentMethod;
  payments: TenderAmounts;
  reason: string;
  exceedsPaid: boolean;
  isSubmitting: boolean;
  error: string | null;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onPaymentAmountChange: (method: TenderMethod, amount: string) => void;
  onPaymentReferenceChange: (method: TenderMethod, reference: string) => void;
  onReasonChange: (reason: string) => void;
  onSubmit: () => void;
}

export function RefundConfirmPanel({
  amount,
  itemCount,
  paymentMethod,
  payments,
  reason,
  exceedsPaid,
  isSubmitting,
  error,
  onPaymentMethodChange,
  onPaymentAmountChange,
  onPaymentReferenceChange,
  onReasonChange,
  onSubmit,
}: RefundConfirmPanelProps) {
  const paidAmount = sumTenderAmounts(payments);
  const amountRemaining = Math.round((amount - paidAmount) * 100) / 100;
  const paymentMatchesRefund = amountRemaining === 0;

  const handleFillExact = () => {
    if (paymentMethod === "MIX") {
      const cashNum = Number(payments.CASH.amount) || 0;
      if (cashNum > 0 && cashNum < amount) {
        const remaining = Math.round((amount - cashNum) * 100) / 100;
        onPaymentAmountChange("BKASH", String(remaining));
      } else {
        onPaymentAmountChange("CASH", String(amount));
        onPaymentAmountChange("BKASH", "");
      }
    } else {
      onPaymentAmountChange(paymentMethod as TenderMethod, String(amount));
    }
  };

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

      {/* Payment Method Selector & Dynamic Inputs */}
      <div className="space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="refund-payment-method-select"
              className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              Refund payout method
            </Label>
            {amount > 0 && paidAmount !== amount && (
              <button
                type="button"
                onClick={handleFillExact}
                className="text-xs font-medium text-primary hover:underline cursor-pointer"
              >
                Exact ({formatCurrency(amount)})
              </button>
            )}
          </div>
          <Select
            value={paymentMethod}
            onValueChange={(val) => onPaymentMethodChange(val as PaymentMethod)}
          >
            <SelectTrigger id="refund-payment-method-select" className="w-full">
              <SelectValue placeholder="Select refund method" />
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
              <Label htmlFor="refund-mix-cash-amount" className="text-xs">
                Cash payout amount
              </Label>
              <Input
                id="refund-mix-cash-amount"
                type="text"
                inputMode="decimal"
                value={payments.CASH.amount}
                onChange={(e) => {
                  const raw = e.target.value;
                  const num = Number(raw);
                  onPaymentAmountChange(
                    "CASH",
                    raw === "" || (Number.isFinite(num) && num >= 0) ? raw : ""
                  );
                }}
                className="numeric"
                placeholder="0.00"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="refund-mix-bkash-amount" className="text-xs">
                bKash payout amount
              </Label>
              <Input
                id="refund-mix-bkash-amount"
                type="text"
                inputMode="decimal"
                value={payments.BKASH.amount}
                onChange={(e) => {
                  const raw = e.target.value;
                  const num = Number(raw);
                  onPaymentAmountChange(
                    "BKASH",
                    raw === "" || (Number.isFinite(num) && num >= 0) ? raw : ""
                  );
                }}
                className="numeric"
                placeholder="0.00"
              />
            </div>

            {Number(payments.BKASH.amount) > 0 && (
              <div className="space-y-1.5">
                <Label htmlFor="refund-mix-bkash-reference" className="text-xs">
                  bKash TrxID{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="refund-mix-bkash-reference"
                  value={payments.BKASH.reference}
                  onChange={(e) => onPaymentReferenceChange("BKASH", e.target.value)}
                  placeholder="Transaction ID"
                />
              </div>
            )}
          </div>
        ) : (
          /* Otherwise normally only 1 input */
          <div className="space-y-3 pt-1">
            <div className="space-y-1.5">
              <Label htmlFor="refund-single-tender-amount" className="text-xs">
                {paymentMethod === "CASH"
                  ? "Cash payout amount"
                  : paymentMethod === "BKASH"
                    ? "bKash payout amount"
                    : "Bank transfer payout amount"}
              </Label>
              <Input
                id="refund-single-tender-amount"
                type="text"
                inputMode="decimal"
                value={
                  paymentMethod === "CASH"
                    ? payments.CASH.amount
                    : paymentMethod === "BKASH"
                      ? payments.BKASH.amount
                      : payments.BANK_TRANSFER.amount
                }
                onChange={(e) => {
                  const raw = e.target.value;
                  const num = Number(raw);
                  onPaymentAmountChange(
                    paymentMethod as TenderMethod,
                    raw === "" || (Number.isFinite(num) && num >= 0) ? raw : ""
                  );
                }}
                className="numeric"
                placeholder="0.00"
              />
            </div>

            {paymentMethod !== "CASH" &&
              Number(
                paymentMethod === "BKASH"
                  ? payments.BKASH.amount
                  : payments.BANK_TRANSFER.amount
              ) > 0 && (
                <div className="space-y-1.5">
                  <Label htmlFor="refund-single-tender-reference" className="text-xs">
                    Transaction reference{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="refund-single-tender-reference"
                    value={
                      paymentMethod === "BKASH"
                        ? payments.BKASH.reference
                        : payments.BANK_TRANSFER.reference
                    }
                    onChange={(e) =>
                      onPaymentReferenceChange(
                        paymentMethod as TenderMethod,
                        e.target.value
                      )
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

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Refund payout total</span>
        <span className="numeric font-semibold">{formatCurrency(paidAmount)}</span>
      </div>
      {!paymentMatchesRefund ? (
        <p className="text-xs text-destructive">
          {amountRemaining > 0
            ? `${formatCurrency(amountRemaining)} still needs to be allocated.`
            : `${formatCurrency(Math.abs(amountRemaining))} exceeds the refund total.`}
        </p>
      ) : null}

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
        className="w-full cursor-pointer"
        disabled={!paymentMatchesRefund || paidAmount <= 0 || isSubmitting}
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