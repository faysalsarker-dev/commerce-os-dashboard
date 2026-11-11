import { useState, useEffect } from "react";
import { AlertTriangle, ChevronDown, Minus, Plus, Tag, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/formatCurrency";
import { cn } from "@/lib/utils";
import type { CartLine } from "./types";

interface ProductListItemProps {
  line: CartLine;
  onQuantityChange: (id: string, quantity: number) => void;
  onDiscountChange: (id: string, discount: number, discountPercent?: number) => void;
  onRemove: (id: string) => void;
}

export function ProductListItem({
  line,
  onQuantityChange,
  onDiscountChange,
  onRemove,
}: ProductListItemProps) {
  const subtotal = line.sellingPrice * line.quantity;
  const discountAmount = line.discount ?? 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);
  const isFullDiscount =
    subtotal > 0 &&
    (discountAmount >= subtotal || (line.discountPercent ?? 0) >= 100);
  const isAtMaxStock = line.quantity >= line.stockQty;
  const lowStock = line.stockQty <= 5;

  const [isOpen, setIsOpen] = useState(false);
  const [amountStr, setAmountStr] = useState(
    discountAmount > 0 ? String(discountAmount) : ""
  );
  const [percentStr, setPercentStr] = useState(
    line.discountPercent !== undefined && line.discountPercent > 0
      ? String(line.discountPercent)
      : discountAmount > 0 && subtotal > 0
        ? String(Math.round(((discountAmount / subtotal) * 100) * 100) / 100)
        : ""
  );

  // Sync inputs when subtotal, discount, or discountPercent changes
  useEffect(() => {
    if (line.discountPercent !== undefined && line.discountPercent > 0) {
      const calcAmt =
        Math.round(((subtotal * line.discountPercent) / 100) * 100) / 100;
      setAmountStr(calcAmt > 0 ? String(calcAmt) : "");
      setPercentStr(String(line.discountPercent));
    } else if (line.discount && line.discount > 0) {
      setAmountStr(String(line.discount));
      if (subtotal > 0) {
        const calcPct =
          Math.round(((line.discount / subtotal) * 100) * 100) / 100;
        setPercentStr(String(calcPct));
      }
    } else {
      setAmountStr("");
      setPercentStr("");
    }
  }, [subtotal, line.discount, line.discountPercent]);

  const handleAmountChange = (raw: string) => {
    setAmountStr(raw);
    if (!raw.trim()) {
      setPercentStr("");
      onDiscountChange(line.id, 0, 0);
      return;
    }
    const val = Number(raw);
    if (isNaN(val) || val < 0) return;
    const clamped = Math.min(val, subtotal);
    if (subtotal > 0) {
      const pct = Math.round(((clamped / subtotal) * 100) * 100) / 100;
      setPercentStr(String(pct));
      onDiscountChange(line.id, clamped, pct);
    } else {
      setPercentStr("0");
      onDiscountChange(line.id, 0, 0);
    }
  };

  const handlePercentChange = (raw: string) => {
    setPercentStr(raw);
    if (!raw.trim()) {
      setAmountStr("");
      onDiscountChange(line.id, 0, 0);
      return;
    }
    const val = Number(raw);
    if (isNaN(val) || val < 0) return;
    const clampedPct = Math.min(val, 100);
    const amt = Math.round(((subtotal * clampedPct) / 100) * 100) / 100;
    setAmountStr(String(amt));
    onDiscountChange(line.id, amt, clampedPct);
  };

  const handleClear = () => {
    setAmountStr("");
    setPercentStr("");
    onDiscountChange(line.id, 0, 0);
  };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.18 }}
      className="border-b border-border last:border-b-0 overflow-hidden"
    >
      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 min-w-0">
        {line.thumbnailUrl ? (
          <img
            src={line.thumbnailUrl}
            alt={line.productName}
            className="size-10 shrink-0 rounded-md border border-border object-cover"
          />
        ) : (
          <div className="size-10 shrink-0 rounded-md border border-border bg-muted" />
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-medium text-foreground">{line.productName}</p>
            {line.isOverridden && (
              <Badge variant="outline" className="h-4 shrink-0 px-1 text-[9px]">
                Custom
              </Badge>
            )}
          </div>
          <p className="numeric truncate text-xs text-muted-foreground">
            {line.colorName} · {line.size} · {line.sku}
            {isFullDiscount ? (
              <span className="font-semibold text-amber-600 dark:text-amber-400">
                {" "}· 100% Free (৳0.00)
              </span>
            ) : discountAmount > 0 ? (
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                {" "}· -৳{discountAmount}
                {line.discountPercent ? ` (${line.discountPercent}%)` : ""}
              </span>
            ) : null}
          </p>
        </div>

        <div className="flex items-center rounded-md border border-border shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "size-7 sm:size-8 rounded-r-none",
              line.quantity <= 1 && "opacity-40 cursor-not-allowed hover:bg-transparent"
            )}
            aria-label="Decrease quantity"
            disabled={line.quantity <= 1}
            onClick={() => {
              if (line.quantity > 1) {
                onQuantityChange(line.id, line.quantity - 1);
              }
            }}
          >
            <Minus className="size-3 sm:size-3.5" />
          </Button>
          <span className="numeric w-7 sm:w-8 text-center text-xs sm:text-sm font-medium">
            {line.quantity}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "size-7 sm:size-8 rounded-l-none",
              isAtMaxStock && "opacity-40 cursor-not-allowed hover:bg-transparent"
            )}
            aria-label="Increase quantity"
            disabled={isAtMaxStock}
            title={
              isAtMaxStock
                ? `Stock limit reached (${line.stockQty} in stock)`
                : "Increase quantity"
            }
            onClick={() => {
              if (!isAtMaxStock) {
                onQuantityChange(line.id, line.quantity + 1);
              }
            }}
          >
            <Plus className="size-3 sm:size-3.5" />
          </Button>
        </div>

        <div className="hidden sm:block w-16 text-right shrink-0">
          <p className="numeric text-xs sm:text-sm text-muted-foreground">
            {formatCurrency(line.sellingPrice)}
          </p>
        </div>

        <div className="w-20 sm:w-24 text-right shrink-0">
          {discountAmount > 0 ? (
            <div>
              <p
                className={cn(
                  "numeric text-xs sm:text-sm font-semibold",
                  isFullDiscount
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-emerald-600 dark:text-emerald-400"
                )}
              >
                {formatCurrency(finalTotal)}
              </p>
              <p className="numeric text-[10px] text-muted-foreground line-through">
                {formatCurrency(subtotal)}
              </p>
            </div>
          ) : (
            <p className="numeric text-xs sm:text-sm font-semibold">{formatCurrency(subtotal)}</p>
          )}
        </div>

        <Badge
          variant={lowStock ? "destructive" : "secondary"}
          className={cn(
            "numeric hidden md:inline-flex shrink-0 text-[10px] sm:text-xs h-6 px-1.5 transition-colors",
            isAtMaxStock &&
              "border-amber-500/50 bg-amber-500/15 text-amber-700 dark:text-amber-400 dark:border-amber-500/30"
          )}
        >
          {isAtMaxStock ? `Max (${line.stockQty})` : `${line.stockQty} left`}
        </Badge>

        <div className="flex items-center gap-0.5 shrink-0">
          {/* Dropdown toggle icon for discount */}
          <Button
            variant={isOpen || discountAmount > 0 ? "secondary" : "ghost"}
            size="icon"
            className={cn(
              "size-7 sm:size-8 cursor-pointer transition-colors",
              isFullDiscount
                ? "bg-amber-500/15 text-amber-600 hover:text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                : discountAmount > 0
                  ? "bg-emerald-500/10 text-emerald-600 hover:text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                  : "text-muted-foreground hover:text-foreground"
            )}
            aria-label="Toggle discount"
            title={
              isFullDiscount
                ? "100% discount applied (Item is Free)"
                : discountAmount > 0
                  ? `Discount: ৳${discountAmount}`
                  : "Line discount"
            }
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <ChevronDown
              className={cn(
                "size-3.5 sm:size-4 transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="size-7 sm:size-8 text-muted-foreground hover:text-destructive cursor-pointer"
            aria-label={`Remove ${line.productName}`}
            onClick={() => onRemove(line.id)}
          >
            <Trash2 className="size-3.5 sm:size-4" />
          </Button>
        </div>
      </div>

      {/* Dropdown collapsible for discount inputs */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={cn(
              "overflow-hidden border-t border-border/40 transition-colors",
              isFullDiscount ? "bg-amber-500/[0.04] dark:bg-amber-950/20" : "bg-muted/20"
            )}
          >
            <div className="flex flex-col gap-2 px-3 sm:px-4 py-2.5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <Tag
                    className={cn(
                      "size-3.5 shrink-0 transition-colors",
                      isFullDiscount
                        ? "text-amber-600 dark:text-amber-400"
                        : discountAmount > 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-muted-foreground"
                    )}
                  />
                  <span className="text-xs font-medium text-foreground">Discount</span>
                  {discountAmount > 0 && (
                    <span className="text-[11px] text-muted-foreground">
                      ({formatCurrency(subtotal)} →{" "}
                      <span
                        className={cn(
                          "font-semibold",
                          isFullDiscount
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-emerald-600 dark:text-emerald-400"
                        )}
                      >
                        {isFullDiscount ? "Free (৳0.00)" : formatCurrency(finalTotal)}
                      </span>
                      )
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* 1 input for Amount */}
                  <div className="flex items-center gap-1.5">
                    <Label
                      htmlFor={`disc-amt-${line.id}`}
                      className="text-xs text-muted-foreground"
                    >
                      ৳:
                    </Label>
                    <Input
                      id={`disc-amt-${line.id}`}
                      type="number"
                      min={0}
                      max={subtotal}
                      step="any"
                      value={amountStr}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      placeholder="0.00"
                      className={cn(
                        "h-7 w-24 text-xs numeric font-medium transition-colors",
                        isFullDiscount
                          ? "border-amber-500/60 text-amber-800 dark:text-amber-300 focus-visible:ring-amber-500/40 bg-amber-500/10"
                          : discountAmount > 0
                            ? "border-emerald-500/60 text-emerald-800 dark:text-emerald-300 focus-visible:ring-emerald-500/30 bg-emerald-500/5"
                            : ""
                      )}
                    />
                  </div>

                  <span className="text-xs text-muted-foreground">or</span>

                  {/* 1 input for Percentage */}
                  <div className="flex items-center gap-1.5">
                    <Label
                      htmlFor={`disc-pct-${line.id}`}
                      className="text-xs text-muted-foreground"
                    >
                      %:
                    </Label>
                    <Input
                      id={`disc-pct-${line.id}`}
                      type="number"
                      min={0}
                      max={100}
                      step="any"
                      value={percentStr}
                      onChange={(e) => handlePercentChange(e.target.value)}
                      placeholder="0"
                      className={cn(
                        "h-7 w-20 text-xs numeric font-medium transition-colors",
                        isFullDiscount
                          ? "border-amber-500/60 text-amber-800 dark:text-amber-300 focus-visible:ring-amber-500/40 bg-amber-500/10"
                          : discountAmount > 0
                            ? "border-emerald-500/60 text-emerald-800 dark:text-emerald-300 focus-visible:ring-emerald-500/30 bg-emerald-500/5"
                            : ""
                      )}
                    />
                  </div>

                  {/* Reset button if discount applied */}
                  {discountAmount > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleClear}
                      className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive cursor-pointer"
                    >
                      <X className="mr-0.5 size-3" />
                      Reset
                    </Button>
                  )}
                </div>
              </div>

              {/* Warning message under the discount level */}
              {isFullDiscount && (
                <div className="flex items-center gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-2.5 py-1.5 text-[11px] text-amber-800 dark:text-amber-300">
                  <AlertTriangle className="size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>
                    <strong>Warning:</strong> 100% discount applied — this product is completely free (৳0.00). Ensure manager authorization.
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}