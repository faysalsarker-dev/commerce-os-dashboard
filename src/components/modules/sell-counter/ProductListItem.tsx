import { Minus, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatCurrency";
import type { CartLine } from "./types";

interface ProductListItemProps {
  line: CartLine;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export function ProductListItem({ line, onQuantityChange, onRemove }: ProductListItemProps) {
  const subtotal = line.sellingPrice * line.quantity;
  const lowStock = line.stockQty <= 5;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.18 }}
      className="border-b border-border last:border-b-0"
    >
      <div className="flex flex-wrap items-center gap-3 px-4 py-3">
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
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium text-foreground">{line.productName}</p>
            {line.isOverridden && (
              <Badge variant="outline" className="h-5 shrink-0 text-[10px]">
                Custom price
              </Badge>
            )}
          </div>
          <p className="numeric truncate text-xs text-muted-foreground">
            {line.colorName} · {line.size} · {line.sku}
          </p>
        </div>

        <div className="flex items-center rounded-md border border-border">
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-r-none"
            aria-label="Decrease quantity"
            onClick={() => onQuantityChange(line.id, line.quantity - 1)}
          >
            <Minus className="size-3.5" />
          </Button>
          <span className="numeric w-9 text-center text-sm font-medium">{line.quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-l-none"
            aria-label="Increase quantity"
            onClick={() => onQuantityChange(line.id, line.quantity + 1)}
          >
            <Plus className="size-3.5" />
          </Button>
        </div>

        <div className="w-20 text-right">
          <p className="numeric text-sm font-medium">{formatCurrency(line.sellingPrice)}</p>
        </div>
        <div className="w-24 text-right">
          <p className="numeric text-sm font-semibold">{formatCurrency(subtotal)}</p>
        </div>

        <Badge variant={lowStock ? "destructive" : "secondary"} className="numeric shrink-0">
          {line.stockQty} left
        </Badge>

        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground hover:text-destructive"
          aria-label={`Remove ${line.productName}`}
          onClick={() => onRemove(line.id)}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </motion.li>
  );
}