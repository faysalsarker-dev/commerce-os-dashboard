import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/formatCurrency";
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