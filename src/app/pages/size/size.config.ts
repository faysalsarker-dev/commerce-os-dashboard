import { search, select } from "@/components/modules/filter";
import {
  action,
  column,
  createColumns,
} from "@/components/modules/table/column-builder";
import type { Size } from "@/types/data-types/size/size.types";

export const SIZE_PAGE_CONFIG = {
  title: "Size",
  description: "Manage product sizes for your inventory catalog.",
} as const;

const SIZE_SORT_OPTIONS = [
  { label: "Newest", value: "-createdAt" },
  { label: "Oldest", value: "createdAt" },
  { label: "Size (A-Z)", value: "size" },
  { label: "Size (Z-A)", value: "-size" },
];

export const SIZE_FILTER_CONFIG = [
  search({
    name: "searchTerm",
    label: "Search",
    placeholder: "Search by size...",
  }),
  select({
    name: "sort",
    label: "Sort",
    placeholder: "Sort",
    options: SIZE_SORT_OPTIONS,
  }),
];

type SizeTableHandlers = {
  onDelete: (size: Size) => void;
};

// The config owns the table shape; the page injects its API/navigation handlers.
export const createSizeTableColumns = ({ onDelete }: SizeTableHandlers) =>
  createColumns<Size>({
    resource: "size",
    columns: [
      column("size", {
        label: "Size",
        sortable: true,
      }),
      column.date("createdAt", {
        label: "Created At",
        sortable: true,
      }),
      column.actions([
        action.delete<Size>({
          confirmTitle: "Delete Size",
          confirmDescription:
            "This size will be permanently deleted. This action cannot be undone.",
          onClick: onDelete,
        }),
      ]),
    ],
  });
