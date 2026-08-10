import { RefundItemRow } from "./RefundItemRow";
import type { SaleItem } from "./types";

interface RefundItemListProps {
  items: SaleItem[];
  quantities: Record<string, number>;
  onChange: (saleItemId: string, qty: number) => void;
}

export function RefundItemList({ items, quantities, onChange }: RefundItemListProps) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <RefundItemRow
          key={item.id}
          item={item}
          selectedQty={quantities[item.id] ?? 0}
          onChange={onChange}
        />
      ))}
    </div>
  );
}