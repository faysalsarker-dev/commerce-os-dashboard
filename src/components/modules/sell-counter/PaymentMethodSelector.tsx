import { motion } from "framer-motion";
import {
  Banknote,
  Building2,
  Check,
  CreditCard,
  Smartphone,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PaymentMethod } from "./types";

const FALLBACK_ICONS: Record<string, LucideIcon> = {
  cash: Banknote,
  bkash: Smartphone,
  nagad: Wallet,
  card: CreditCard,
  bank: Building2,
};

interface PaymentMethodSelectorProps {
  methods: PaymentMethod[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function PaymentMethodSelector({
  methods,
  selectedId,
  onSelect,
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Payment method
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {methods.map((method) => {
          const selected = method.id === selectedId;
          const Icon = FALLBACK_ICONS[method.id] ?? Wallet;
          return (
            <motion.button
              key={method.id}
              type="button"
              onClick={() => onSelect(method.id)}
              whileTap={{ scale: 0.96 }}
              animate={{ scale: selected ? 1.02 : 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              aria-pressed={selected}
              className={cn(
                "relative flex items-center gap-2 rounded-md border px-3 py-2.5 text-left transition-colors",
                selected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-muted/60",
              )}
            >
              {method.image ? (
                <img src={method.image} alt="" className="size-5 shrink-0 rounded-sm object-contain" />
              ) : (
                <span
                  aria-hidden
                  className={cn(
                    "grid size-7 shrink-0 place-items-center rounded-md",
                    selected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                  )}
                >
                  <Icon className="size-4" />
                </span>
              )}
              <span className="min-w-0 truncate text-sm font-medium">{method.name}</span>
              {selected ? (
                <Check className="ml-auto size-4 shrink-0 text-primary" />
              ) : null}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}