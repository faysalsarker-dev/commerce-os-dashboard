import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
  noAction?: boolean;
  onClick?: () => void;
}

export function PageHeader({
  title,
  description,
  actions,
  className,
  onClick,
  noAction = false,
}: PageHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-border bg-card p-4 py-6 shadow-soft md:flex-row md:items-center md:justify-between",
        className,
      )}
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>

      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}

      {!actions && !noAction && (
        <div className="flex flex-wrap items-center gap-2">
          <Button className="py-5" onClick={onClick} disabled={!onClick} type="button">
            <Plus className="size-4" />
            Add {title}
          </Button>
        </div>
      )}
    </motion.header>
  );
}
