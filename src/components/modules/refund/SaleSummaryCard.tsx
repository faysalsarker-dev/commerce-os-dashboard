import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/formatCurrency";
import { PAYMENT_METHOD_LABEL } from "@/types/data-types/payment.types";
import type { Sale } from "./types";

interface SaleSummaryCardProps {
  sale: Sale;
}

function statusVariant(status: Sale["paymentStatus"]) {
  if (status === "PAID") return "default" as const;
  if (status === "REFUNDED") return "outline" as const;
  return "secondary" as const;
}

export function SaleSummaryCard({ sale }: SaleSummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      <Card className="p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="numeric text-sm font-semibold text-foreground">{sale.invoiceNo}</p>
            <p className="truncate text-sm text-muted-foreground">
              {sale.customer.name} · <span className="numeric">{sale.customer.phone}</span>
            </p>
            <p className="numeric mt-1 text-xs text-muted-foreground">
              {new Date(sale.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{sale.status.replace("_", " ")}</Badge>
            <Badge variant={statusVariant(sale.paymentStatus)}>{sale.paymentStatus}</Badge>
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-3">
          <Figure label="Total" value={formatCurrency(sale.total)} />
          <Figure label="Paid" value={formatCurrency(sale.paidAmount)} />
          <Figure label="Due" value={formatCurrency(sale.dueAmount)} />
        </dl>
        {sale.payments?.length ? (
          <div className="mt-3 space-y-1 border-t border-border pt-3">
            <p className="text-xs text-muted-foreground">Original payment breakdown</p>
            {sale.payments.map((payment, index) => (
              <div
                key={`${payment.method}-${index}`}
                className="flex justify-between gap-3 text-xs"
              >
                <span>
                  {PAYMENT_METHOD_LABEL[payment.method] ?? payment.method}
                  {payment.reference ? ` · ${payment.reference}` : ""}
                </span>
                <span className="numeric font-medium">
                  {formatCurrency(Number(payment.amount))}
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </Card>
    </motion.div>
  );
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="numeric truncate text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}