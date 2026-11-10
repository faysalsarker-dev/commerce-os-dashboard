import { search, select } from "@/components/modules/filter";
import {
  action,
  column,
  createColumns,
} from "@/components/modules/table/column-builder";
import type { Expense } from "@/types/data-types/expense/expense.types";

export const EXPENSE_PAGE_CONFIG = {
  title: "Expenses",
  description: "Track and manage all your business expenses.",
} as const;

const SORT_OPTIONS = [
  { label: "Newest", value: "-createdAt" },
  { label: "Oldest", value: "createdAt" },
  { label: "Amount (High to Low)", value: "-amount" },
  { label: "Amount (Low to High)", value: "amount" },
  { label: "Date (Newest)", value: "-expenseDate" },
  { label: "Date (Oldest)", value: "expenseDate" },
];

export const EXPENSE_FILTER_CONFIG = [
  search({
    name: "searchTerm",
    label: "Search",
    placeholder: "Search by description…",
  }),
  select({
    name: "sort",
    label: "Sort",
    placeholder: "Sort",
    options: SORT_OPTIONS,
  }),
];

type ExpenseTableHandlers = {
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
};

export const createExpenseTableColumns = ({
  onEdit,
  onDelete,
}: ExpenseTableHandlers) =>
  createColumns<Expense>({
    resource: "expense",
    columns: [
      column("category", {
        label: "Category",
        formatter: (value) => {
          if (value && typeof value === "object" && "name" in value) {
            return (value as { name: string }).name;
          }
          return "-";
        },
      }),
      column.number("amount", {
        label: "Amount",
        sortable: true,
        formatter: (value) =>
          Number(value).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
      }),
      column.date("expenseDate", { label: "Date", sortable: true }),
      column("scheduleId", {
        label: "Scheduled",
        formatter: (value) => (value ? "Yes" : "No"),
      }),
      column("description", {
        label: "Description",
        formatter: (value) =>
          value
            ? String(value).slice(0, 50) + (String(value).length > 50 ? "…" : "")
            : "-",
      }),
      column.actions([
        action.edit<Expense>({ onClick: onEdit }),
        action.delete<Expense>({
          confirmTitle: "Delete Expense",
          confirmDescription:
            "This expense will be permanently deleted. This action cannot be undone.",
          onClick: onDelete,
        }),
      ]),
    ],
  });
