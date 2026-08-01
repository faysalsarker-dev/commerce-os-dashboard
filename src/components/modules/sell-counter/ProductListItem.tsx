import { useState } from "react";
import { ChevronDown, Minus, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/formatCurrency";
import type { CartLine } from "./types";

interface ProductListItemProps {
  line: CartLine;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export function ProductListItem({ line, onQuantityChange, onRemove }: ProductListItemProps) {
  const [open, setOpen] = useState(false);
  const subtotal = line.sellingPrice * line.quantity;
  const margin = (line.sellingPrice - line.costPrice) * line.quantity;

  return (
    <Collapsible open={open} onOpenChange={setOpen} >
      <motion.li
        layout
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.18 }}
        className="border-b border-border last:border-b-0"
      >
        <div className="flex flex-wrap items-center gap-3 px-4 py-3">
          <CollapsibleTrigger render={<Button
              variant="ghost"
              size="icon"
              className="size-7 shrink-0"
              aria-label={open ? "Hide cost details" : "Show cost details"}
            />}>
          
              <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
          </CollapsibleTrigger>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{line.name}</p>
            <p className="numeric truncate text-xs text-muted-foreground">
              {line.variant} · {line.sku}
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

          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-destructive"
            aria-label={`Remove ${line.name}`}
            onClick={() => onRemove(line.id)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>

        <CollapsibleContent>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-dashed border-border bg-muted/40 px-4 py-2.5 pl-14">
            <Detail label="Base / cost price" value={formatCurrency(line.costPrice)} />
            <Detail label="Cost × qty" value={formatCurrency(line.costPrice * line.quantity)} />
            <Detail label="Margin" value={formatCurrency(margin)} />
            <Badge variant="secondary" className="numeric">
              Stock {line.stock}
            </Badge>
            <span className="text-[11px] text-muted-foreground">Internal — not on the bill</span>
          </div>
        </CollapsibleContent>
      </motion.li>
    </Collapsible>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="numeric text-sm text-muted-foreground">{value}</p>
    </div>
  );
}