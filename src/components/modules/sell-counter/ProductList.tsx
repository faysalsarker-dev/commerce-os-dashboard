import { AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/common/EmptyState";
import { ProductListItem } from "./ProductListItem";
import type { CartLine } from "./types";

interface ProductListProps {
  lines: CartLine[];
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export function ProductList({ lines, onQuantityChange, onRemove }: ProductListProps) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">Cart</h2>
        <span className="numeric text-xs text-muted-foreground">
          {lines.reduce((n, l) => n + l.quantity, 0)} item(s)
        </span>
      </div>

      {lines.length === 0 ? (
        <div className="p-4">
          <EmptyState
            icon={ShoppingCart}
            title="No products yet"
            description="Scan a barcode or type a SKU above to start building this sale."
          />
        </div>
      ) : (
        <ul className="list-none">
          <AnimatePresence initial={false}>
            {lines.map((line) => (
              <ProductListItem
                key={line.id}
                line={line}
                onQuantityChange={onQuantityChange}
                onRemove={onRemove}
              />
            ))}
          </AnimatePresence>
        </ul>
      )}
    </Card>
  );
}