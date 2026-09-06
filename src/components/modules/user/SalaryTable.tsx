import { motion } from "framer-motion";
import type { SalaryRecord } from "@/types/data-types/user/salary-record.type";
import { formatCurrency, formatDate, formatMonthYear } from "@/lib/format";
import { StatusBadge } from "./StatusBadge";

export function SalaryTable({ records }: { records: SalaryRecord[] }) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm md:block">
        <table className="w-full text-sm">
          <caption className="sr-only">Salary history</caption>
          <thead>
            <tr className="border-b border-border/60 bg-muted/40 text-[11px] uppercase tracking-wide text-muted-foreground">
              <th scope="col" className="px-4 py-3 text-left font-semibold">Period</th>
              <th scope="col" className="px-4 py-3 text-right font-semibold">Base</th>
              <th scope="col" className="px-4 py-3 text-right font-semibold">Bonus</th>
              <th scope="col" className="px-4 py-3 text-right font-semibold">Deduction</th>
              <th scope="col" className="px-4 py-3 text-right font-semibold">Net pay</th>
              <th scope="col" className="px-4 py-3 text-left font-semibold">Status</th>
              <th scope="col" className="px-4 py-3 text-left font-semibold">Paid at</th>
              <th scope="col" className="px-4 py-3 text-left font-semibold">Notes</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <motion.tr
                key={record.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.25 }}
                className="border-b border-border/40 last:border-0 transition-colors hover:bg-muted/40"
              >
                <td className="px-4 py-3 font-medium text-foreground">
                  {formatMonthYear(record.month, record.year)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">{formatCurrency(record.baseSalary)}</td>
                <td className="px-4 py-3 text-right tabular-nums text-emerald-600 dark:text-emerald-400">
                  {record.bonus ? `+${formatCurrency(record.bonus)}` : "—"}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-destructive">
                  {record.deduction ? `-${formatCurrency(record.deduction)}` : "—"}
                </td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums">
                  {formatCurrency(record.netPay)}
                </td>
                <td className="px-4 py-3"><StatusBadge value={record.status} /></td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(record.paidAt)}</td>
                <td className="px-4 py-3 text-muted-foreground">{record.notes ?? "—"}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {records.map((record, index) => (
          <motion.div
            key={record.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.25 }}
            className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-foreground">
                {formatMonthYear(record.month, record.year)}
              </p>
              <StatusBadge value={record.status} />
            </div>
            <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">
              {formatCurrency(record.netPay)}
            </p>
            <dl className="mt-3 grid grid-cols-3 gap-2 text-xs">
              <div>
                <dt className="text-muted-foreground">Base</dt>
                <dd className="font-medium tabular-nums">{formatCurrency(record.baseSalary)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Bonus</dt>
                <dd className="font-medium tabular-nums text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(record.bonus)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Deduction</dt>
                <dd className="font-medium tabular-nums text-destructive">
                  {formatCurrency(record.deduction)}
                </dd>
              </div>
            </dl>
            <p className="mt-3 border-t border-border/50 pt-2 text-xs text-muted-foreground">
              {record.status === "PAID" ? `Paid ${formatDate(record.paidAt)}` : "Not paid yet"}
              {record.notes ? ` · ${record.notes}` : ""}
            </p>
          </motion.div>
        ))}
      </div>
    </>
  );
}

export default SalaryTable;
