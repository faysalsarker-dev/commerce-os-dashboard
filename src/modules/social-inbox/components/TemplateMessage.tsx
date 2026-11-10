import { LayoutTemplate } from "lucide-react";
import type { MessageTemplate } from "../types";

interface TemplateMessageProps {
  template: MessageTemplate;
}

const CATEGORY_LABEL: Record<MessageTemplate["category"], string> = {
  UTILITY: "Utility",
  MARKETING: "Marketing",
  AUTHENTICATION: "Authentication",
};

export function TemplateMessage({ template }: TemplateMessageProps) {
  return (
    <div className="flex flex-col gap-1 overflow-hidden rounded-lg border border-border/70 bg-muted/30 text-sm">
      {/* Header */}
      {template.headerText && (
        <div className="border-b border-border/60 bg-muted/50 px-3 py-1.5 text-xs font-semibold text-foreground">
          {template.headerText}
        </div>
      )}

      {/* Body */}
      <p className="px-3 py-2 text-sm leading-relaxed text-foreground">{template.bodyText}</p>

      {/* Footer */}
      {template.footerText && (
        <p className="border-t border-border/60 px-3 py-1 text-[11px] text-muted-foreground">
          {template.footerText}
        </p>
      )}

      {/* Meta */}
      <div className="flex items-center gap-1.5 border-t border-border/60 bg-muted/50 px-3 py-1 text-[10px] text-muted-foreground">
        <LayoutTemplate className="size-2.5 shrink-0" />
        <span>
          {CATEGORY_LABEL[template.category]} template · {template.language}
        </span>
      </div>
    </div>
  );
}

