import { useEffect, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SaleSearchProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
}

export function SaleSearch({ onSearch, isSearching }: SaleSearchProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const q = value.trim();
    const t = setTimeout(() => onSearch(q), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="space-y-1.5">
      <Label htmlFor="sale-search" className="text-xs">
        Invoice number or customer phone
      </Label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="sale-search"
          autoFocus
          autoComplete="off"
          placeholder="INV-10241 or 01711223344"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="numeric pl-9 pr-9"
        />
        {isSearching ? (
          <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        ) : null}
      </div>
    </div>
  );
}