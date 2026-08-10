import { motion, useReducedMotion } from "framer-motion";
import { Check, Printer, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatCurrency";
import { REFUND_METHODS, type RefundResult } from "./types";

interface RefundSuccessProps {
  result: RefundResult;
  onReset: () => void;
  onPrint: () => void;
}

export function RefundSuccess({ result, onReset, onPrint }: RefundSuccessProps) {
  const reduce = useReducedMotion();
  const methodLabel =
    REFUND_METHODS.find((m) => m.value === result.method)?.label ?? result.method;

  return (
    <Card className="mx-auto max-w-md p-8 text-center">
      <motion.div
        initial={reduce ? false : { scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto grid size-14 place-items-center rounded-full bg-success/15 text-success"
      >
        <Check className="size-7" />
      </motion.div>

      <h2 className="mt-4 text-lg font-semibold text-foreground">Refund processed</h2>
      <p className="numeric mt-1 text-3xl font-semibold text-foreground">
        {formatCurrency(result.amount)}
      </p>

      <dl className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
        <Row label="Refund ID" value={result.id} />
        <Row label="Method" value={methodLabel} />
        <Row label="Processed" value={new Date(result.createdAt).toLocaleString()} />
      </dl>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Button className="flex-1" onClick={onReset}>
          <RotateCcw className="mr-2 size-4" />
          Process another refund
        </Button>
        <Button variant="outline" className="flex-1" onClick={onPrint}>
          <Printer className="mr-2 size-4" />
          Print receipt
        </Button>
      </div>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="numeric font-medium text-foreground">{value}</dd>
    </div>
  );
}