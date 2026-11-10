import { search, select } from "@/components/modules/filter";
import {
  action,
  column,
  createColumns,
} from "@/components/modules/table/column-builder";
import type { SalaryRecord } from "@/types/data-types/user/salary-record.type";
import { SalaryStatus } from "@/types/data-types/enums";
import { formatMonthYear } from "@/lib/format";

export const SALARY_PAGE_CONFIG = {
  title: "Payroll",
  description: "Manage monthly salary records for all employees.",
} as const;

const STATUS_OPTIONS = [
  { label: "Pending", value: SalaryStatus.PENDING },
  { label: "Paid", value: SalaryStatus.PAID },
];

const SORT_OPTIONS = [
  { label: "Newest", value: "-createdAt" },
  { label: "Oldest", value: "createdAt" },
  { label: "Net Pay (High)", value: "-netPay" },
  { label: "Net Pay (Low)", value: "netPay" },
  { label: "Name (A–Z)", value: "name" },
  { label: "Name (Z–A)", value: "-name" },
  { label: "Month (Latest)", value: "-month" },
  { label: "Month (Oldest)", value: "month" },
];

export const SALARY_FILTER_CONFIG = [
  search({
    name: "searchTerm",
    label: "Search",
    placeholder: "Search by employee name…",
  }),
  select({
    name: "status",
    label: "Status",
    placeholder: "All statuses",
    options: STATUS_OPTIONS,
  }),
  select({
    name: "sort",
    label: "Sort",
    placeholder: "Sort by",
    options: SORT_OPTIONS,
  }),
];

function formatTaka(value: number) {
  return `৳ ${Number(value).toLocaleString("en-BD", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

type SalaryTableHandlers = {
  onEdit: (record: SalaryRecord) => void;
  onDelete: (record: SalaryRecord) => void;
};

export const createSalaryTableColumns = ({
  onEdit,
  onDelete,
}: SalaryTableHandlers) =>
  createColumns<SalaryRecord>({
    resource: "salary",
    columns: [
      column("user", {
        label: "Employee",
        formatter: (value) => {
          if (value && typeof value === "object" && "name" in value) {
            return (value as { name: string }).name;
          }
          return "—";
        },
      }),
      column("month", {
        label: "Period",
        formatter: (value, row) => formatMonthYear(Number(value), row.year),
      }),
      column("baseSalary", {
        label: "Base (৳)",
        align: "right",
        formatter: (value) => formatTaka(Number(value)),
      }),
      column("bonus", {
        label: "Bonus (৳)",
        align: "right",
        formatter: (value) => {
          const n = Number(value);
          return n > 0 ? `+${formatTaka(n)}` : "—";
        },
      }),
      column("deduction", {
        label: "Deduction (৳)",
        align: "right",
        formatter: (value) => {
          const n = Number(value);
          return n > 0 ? `-${formatTaka(n)}` : "—";
        },
      }),
      column("netPay", {
        label: "Net Pay (৳)",
        align: "right",
        formatter: (value) => formatTaka(Number(value)),
      }),
      column.status("status"),
      column.actions([
        action.edit<SalaryRecord>({ onClick: onEdit }),
        action.delete<SalaryRecord>({
          confirmTitle: "Delete Salary Record",
          confirmDescription:
            "This salary record will be permanently deleted. This action cannot be undone.",
          onClick: onDelete,
        }),
      ]),
    ],
  });
