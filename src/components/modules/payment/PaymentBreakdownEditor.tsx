import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  TENDER_METHODS,
  type TenderAmounts,
  type TenderMethod,
} from "@/types/data-types/payment.types";

interface PaymentBreakdownEditorProps {
  title: string;
  tenders: TenderAmounts;
  onAmountChange: (method: TenderMethod, amount: string) => void;
  onReferenceChange: (method: TenderMethod, reference: string) => void;
}

export function PaymentBreakdownEditor({
  title,
  tenders,
  onAmountChange,
  onReferenceChange,
}: PaymentBreakdownEditorProps) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {title}
      </legend>
      {TENDER_METHODS.map(({ value, label, needsReference }) => {
        const tender = tenders[value];
        const amountId = `${title.toLowerCase().replace(/\s+/g, "-")}-${value.toLowerCase()}-amount`;
        const referenceId = `${amountId}-reference`;
        const amount = Number(tender.amount);

        return (
          <div key={value} className="grid gap-2 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor={amountId} className="text-xs">
                {label} amount
              </Label>
              <Input
                id={amountId}
                type="text"
                inputMode="decimal"
                value={tender.amount}
                onChange={(event) => {
                  const rawAmount = event.target.value;
                  const amount = Number(rawAmount);
                  onAmountChange(
                    value,
                    rawAmount === "" || (Number.isFinite(amount) && amount >= 0)
                      ? rawAmount
                      : "",
                  );
                }}
                className="numeric"
                placeholder="0.00"
              />
            </div>
            {needsReference && Number.isFinite(amount) && amount > 0 ? (
              <div className="space-y-1">
                <Label htmlFor={referenceId} className="text-xs">
                  Transaction reference <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id={referenceId}
                  value={tender.reference}
                  onChange={(event) => onReferenceChange(value, event.target.value)}
                  placeholder="Transaction ID"
                />
              </div>
            ) : null}
          </div>
        );
      })}
    </fieldset>
  );
}
