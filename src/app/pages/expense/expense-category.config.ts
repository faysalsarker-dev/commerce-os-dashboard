import { search, select } from "@/components/modules/filter";
import {
  action,
  column,
  createColumns,
} from "@/components/modules/table/column-builder";
import type { ExpenseCategory } from "@/types/data-types/expense/expense.types";

export const EXPENSE_CATEGORY_PAGE_CONFIG = {
  title: "Expense Categories",
  description: "Manage categories to organise your business expenses.",
} as const;

const STATUS_OPTIONS = [
  { label: "Active", value: true },
  { label: "Inactive", value: false },
];

const SORT_OPTIONS = [
  { label: "Newest", value: "-createdAt" },
  { label: "Oldest", value: "createdAt" },
  { label: "Name (A-Z)", value: "name" },
  { label: "Name (Z-A)", value: "-name" },
];

export const EXPENSE_CATEGORY_FILTER_CONFIG = [
  search({
    name: "searchTerm",
    label: "Search",
    placeholder: "Search by name…",
  }),
  select({
    name: "isActive",
    label: "Status",
    placeholder: "Status",
    options: STATUS_OPTIONS,
  }),
  select({
    name: "sort",
    label: "Sort",
    placeholder: "Sort",
    options: SORT_OPTIONS,
  }),
];

type ExpenseCategoryTableHandlers = {
  onEdit: (category: ExpenseCategory) => void;
  onDelete: (category: ExpenseCategory) => void;
};

export const createExpenseCategoryTableColumns = ({
  onEdit,
  onDelete,
}: ExpenseCategoryTableHandlers) =>
  createColumns<ExpenseCategory>({
    resource: "expense_category",
    columns: [
      column("name", { label: "Name", sortable: true }),
      column("description", {
        label: "Description",
        formatter: (value) =>
          value
            ? String(value).slice(0, 60) + (String(value).length > 60 ? "…" : "")
            : "-",
      }),
      column("schedule", {
        label: "Schedule",
        formatter: (value) => {
          if (value && typeof value === "object" && "frequency" in value) {
            const s = value as { frequency: string; isActive: boolean };
            return `${s.frequency}${s.isActive ? "" : " (inactive)"}`;
          }
          return "-";
        },
      }),
      column.status("isActive", {
        label: "Status",
        formatter: (value) => (value as boolean ? "Active" : "Inactive"),
      }),
      column.date("createdAt", { label: "Created", sortable: true }),
      column.actions([
        action.edit<ExpenseCategory>({ onClick: onEdit }),
        action.delete<ExpenseCategory>({
          confirmTitle: "Delete Expense Category",
          confirmDescription:
            "This category will be permanently deleted. This action cannot be undone.",
          onClick: onDelete,
        }),
      ]),
    ],
  });
