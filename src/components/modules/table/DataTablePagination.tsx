

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getPaginationRange } from "./getPaginationRange";

interface DataTablePaginationProps {
  page: number;
  pageCount: number;

  pageSize: number;
  totalRows?: number;

  resourceName?: string;

  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;

  pageSizeOptions?: number[];
  siblingCount?: number;
}

const navBtn =
  "inline-flex h-9 select-none items-center justify-center gap-1.5 rounded-lg border border-border/60 bg-background px-3 text-sm font-medium text-muted-foreground shadow-xs transition-all hover:bg-muted hover:text-foreground active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50";

const edgeBtn =
  "inline-flex size-9 shrink-0 select-none items-center justify-center rounded-lg border border-border/60 bg-background text-muted-foreground shadow-xs transition-all hover:bg-muted hover:text-foreground active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50";

export function DataTablePagination({
  page,
  pageCount,
  pageSize,
  totalRows = 0,
  resourceName = "results",

  onPageChange,
  onPageSizeChange,

  pageSizeOptions = [10, 20, 50],

  siblingCount = 1,
}: DataTablePaginationProps) {
  if (!pageCount || pageCount <= 1) {
    return null;
  }

  const pages = getPaginationRange(page, pageCount, siblingCount);
  const mobilePages = getPaginationRange(page, pageCount, 0);

  const from = totalRows === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = totalRows === 0 ? 0 : Math.min(page * pageSize, totalRows);

  const isFirst = page <= 1;
  const isLast = page >= pageCount;

  const restoreScroll = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePageChange = (nextPage: number) => {
    if (nextPage !== page) {
      restoreScroll();
    }
    onPageChange(nextPage);
  };

  const handlePageSizeChange = (nextSize: number) => {
    restoreScroll();
    onPageSizeChange?.(nextSize);
  };

  const goPrev = () => {
    if (!isFirst) handlePageChange(page - 1);
  };
  const goNext = () => {
    if (!isLast) handlePageChange(page + 1);
  };

  const renderNumbers = (items: ReturnType<typeof getPaginationRange>, compact = false) => (
    <div
      className={cn(
        "flex items-center gap-1 rounded-xl bg-muted/50 p-1",
        compact && "gap-0.5",
      )}
    >
      {items.map((item, index) =>
        item === "ellipsis" ? (
          <span
            key={`e-${index}`}
            aria-hidden
            className="flex size-9 items-center justify-center text-sm text-muted-foreground/70"
          >
            &#8230;
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-label={`Page ${item}`}
            aria-current={item === page ? "page" : undefined}
            onClick={() => handlePageChange(item)}
            className={cn(
              "inline-flex size-9 items-center justify-center rounded-lg text-sm font-medium tabular-nums transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              item === page
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-background hover:text-foreground hover:shadow-xs active:scale-[0.95]",
            )}
          >
            {item}
          </button>
        ),
      )}
    </div>
  );

  const rowsSelect = (labelSuffix = "") =>
    onPageSizeChange ? (
      <Select
        value={String(pageSize)}
        onValueChange={(value) => handlePageSizeChange(Number(value))}
      >
        <SelectTrigger
          aria-label="Rows per page"
          className="h-9 w-auto min-w-[4.5rem] gap-1.5 rounded-lg border-border/60 bg-muted/40 text-sm font-medium"
        >
          <SelectValue />
        </SelectTrigger>

        <SelectContent side="top" className="rounded-xl">
          {pageSizeOptions.map((size) => (
            <SelectItem key={size} value={String(size)} className="rounded-lg">
              {size}
              {labelSuffix}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ) : null;

  return (
    <nav
      aria-label="Pagination"
      className="rounded-2xl border border-border/60 bg-card px-3 py-3 shadow-sm sm:px-5 sm:py-4"
    >
      {/* ---------- Desktop / tablet ---------- */}
      <div className="hidden items-center justify-between gap-4 md:flex">
        <div className="flex min-w-0 items-center gap-4 lg:gap-6">
          {onPageSizeChange && (
            <div className="flex items-center gap-2">
              <span className="text-sm whitespace-nowrap text-muted-foreground">
                Rows
              </span>
              {rowsSelect()}
            </div>
          )}

          <p className="hidden text-sm whitespace-nowrap text-muted-foreground lg:block">
            Showing{" "}
            <span className="font-semibold tabular-nums text-foreground">
              {from}&#8211;{to}
            </span>{" "}
            of{" "}
            <span className="font-semibold tabular-nums text-foreground">
              {totalRows}
            </span>{" "}
            {resourceName}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="First page"
            disabled={isFirst}
            onClick={() => handlePageChange(1)}
            className={cn(edgeBtn, "hidden lg:inline-flex", isFirst && "pointer-events-none opacity-40")}
          >
            <ChevronsLeft className="size-4" />
          </button>

          <button
            type="button"
            aria-label="Previous page"
            disabled={isFirst}
            onClick={goPrev}
            className={cn(navBtn, isFirst && "pointer-events-none opacity-40")}
          >
            <ChevronLeft className="size-4" />
            Prev
          </button>

          <div className="mx-1">{renderNumbers(pages)}</div>

          <button
            type="button"
            aria-label="Next page"
            disabled={isLast}
            onClick={goNext}
            className={cn(navBtn, isLast && "pointer-events-none opacity-40")}
          >
            Next
            <ChevronRight className="size-4" />
          </button>

          <button
            type="button"
            aria-label="Last page"
            disabled={isLast}
            onClick={() => handlePageChange(pageCount)}
            className={cn(edgeBtn, "hidden lg:inline-flex", isLast && "pointer-events-none opacity-40")}
          >
            <ChevronsRight className="size-4" />
          </button>
        </div>
      </div>

      {/* ---------- Mobile ---------- */}
      <div className="flex flex-col gap-3 md:hidden">
        <div className="flex items-center justify-between gap-3">
          <span className="min-w-0 truncate text-xs text-muted-foreground">
            <span className="font-semibold tabular-nums text-foreground">
              {from}&#8211;{to}
            </span>{" "}
            of{" "}
            <span className="font-semibold tabular-nums text-foreground">
              {totalRows}
            </span>{" "}
            {resourceName}
          </span>

          {rowsSelect(" / page")}
        </div>

        <div className="flex items-center justify-center">
          {renderNumbers(mobilePages, true)}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            aria-label="Previous page"
            disabled={isFirst}
            onClick={goPrev}
            className={cn(navBtn, "h-10 w-full", isFirst && "pointer-events-none opacity-40")}
          >
            <ChevronLeft className="size-4" />
            Prev
          </button>

          <button
            type="button"
            aria-label="Next page"
            disabled={isLast}
            onClick={goNext}
            className={cn(navBtn, "h-10 w-full", isLast && "pointer-events-none opacity-40")}
          >
            Next
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}
