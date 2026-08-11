import { Banknote, CreditCard, Landmark, Smartphone, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  PAYMENT_METHOD_LABEL,
  PAYMENT_STATUS_LABEL,
  SHOP,
  formatDueDate,
  formatInvoiceDate,
  type Invoice,
  type PaymentMethod,
} from "./types";
import { formatCurrency } from "@/lib/formatCurrency";

const METHOD_ICON: Record<PaymentMethod, typeof Wallet> = {
  CASH: Banknote,
  BKASH: Smartphone,
  NAGAD: Smartphone,
  ROCKET: Smartphone,
  CARD: CreditCard,
  BANK_TRANSFER: Landmark,
};

function statusTone(invoice: Invoice) {
  switch (invoice.paymentStatus) {
    case "PAID":
      return "border-transparent bg-success text-success-foreground";
    case "PARTIAL":
    case "UNPAID":
      return "border-transparent bg-warning text-warning-foreground";
    default:
      return "border-transparent bg-secondary text-secondary-foreground";
  }
}

export function InvoiceCard({ invoice }: { invoice: Invoice }) {
  const MethodIcon = invoice.paymentMethod ? METHOD_ICON[invoice.paymentMethod] : Wallet;

  return (
    <article
      id="invoice-print-area"
      className="overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-lg"
    >
      {/* Header */}
      <header className="bg-primary px-6 py-5 text-primary-foreground">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-lg font-semibold tracking-[0.18em]">{SHOP.wordmark}</p>
            <p className="mt-0.5 text-xs opacity-80">{SHOP.tagline}</p>
          </div>
          <Badge className={statusTone(invoice)}>{PAYMENT_STATUS_LABEL[invoice.paymentStatus]}</Badge>
        </div>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-wide opacity-70">Invoice</p>
            <p className="numeric text-base font-semibold">{invoice.invoiceNo}</p>
          </div>
          <p className="numeric text-xs opacity-80">{formatInvoiceDate(invoice.date)}</p>
        </div>
      </header>

      {/* Meta row */}
      <div className="grid grid-cols-2 gap-4 px-6 py-4 text-sm">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Served by</p>
          <p className="truncate font-medium">{invoice.soldBy.name}</p>
        </div>
        <div className="min-w-0 text-right">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Customer</p>
          <p className="truncate font-medium">{invoice.customer?.name ?? "Walk-in Customer"}</p>
          {invoice.customer?.phone ? (
            <p className="numeric truncate text-xs text-muted-foreground">
              {invoice.customer.phone}
            </p>
          ) : null}
        </div>
      </div>

      <Separator />

      {/* Items */}
      <ul className="divide-y divide-border px-6">
        {invoice.items.map((item) => (
          <li key={item.sku} className="flex items-start justify-between gap-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{item.productName}</p>
              <p className="numeric truncate text-xs text-muted-foreground">{item.sku}</p>
              <p className="numeric mt-1 text-xs text-muted-foreground">
                {item.quantity} × {formatCurrency(item.unitPrice)}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="numeric text-sm font-semibold">{formatCurrency(item.subtotal)}</p>
              {item.discount > 0 ? (
                <p className="numeric text-xs text-muted-foreground">
                  −{formatCurrency(item.discount)} off
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      <Separator />

      {/* Totals */}
      <div className="space-y-1.5 px-6 py-4 text-sm">
        <Row label="Subtotal" value={formatCurrency(invoice.subtotal)} />
        {invoice.discount > 0 ? (
          <Row label="Discount" value={`−${formatCurrency(invoice.discount)}`} />
        ) : null}
        {invoice.shippingFee > 0 ? (
          <Row label="Shipping" value={formatCurrency(invoice.shippingFee)} />
        ) : null}

        <div className="mt-3 flex items-baseline justify-between border-t border-border pt-3">
          <span className="text-sm font-medium">Grand total</span>
          <span className="numeric text-2xl font-bold tracking-tight">
            {formatCurrency(invoice.total)}
          </span>
        </div>

        <Row label="Paid" value={formatCurrency(invoice.paidAmount)} className="pt-2" />

        {invoice.dueAmount > 0 ? (
          <div className="mt-2 rounded-md border border-warning/40 bg-warning/15 px-3 py-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Due</span>
              <span className="numeric text-sm font-semibold">
                {formatCurrency(invoice.dueAmount)}
              </span>
            </div>
            {invoice.dueDate ? (
              <p className="numeric mt-0.5 text-xs text-muted-foreground">
                Payable by {formatDueDate(invoice.dueDate)}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <Separator />

      {/* Payment method */}
      <div className="flex items-center justify-between px-6 py-3 text-sm">
        <span className="text-muted-foreground">Payment method</span>
        <span className="inline-flex items-center gap-1.5 font-medium">
          <MethodIcon className="size-4" aria-hidden />
          {invoice.paymentMethod ? PAYMENT_METHOD_LABEL[invoice.paymentMethod] : "Payment Pending"}
        </span>
      </div>

      <Separator />

      {/* Footer */}
      <footer className="px-6 py-4 text-center">
        <p className="text-sm font-medium">{SHOP.thankYou}</p>
        {invoice.notes ? (
          <p className="mt-1 text-xs text-muted-foreground">{invoice.notes}</p>
        ) : null}
        <p className="numeric mt-2 text-[11px] text-muted-foreground">
          {invoice.channel === "OFFLINE" ? "In-store sale" : "Online sale"} · {invoice.saleId}
        </p>
      </footer>
    </article>
  );
}

function Row({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between ${className ?? ""}`}>
      <span className="text-muted-foreground">{label}</span>
      <span className="numeric font-medium">{value}</span>
    </div>
  );
}