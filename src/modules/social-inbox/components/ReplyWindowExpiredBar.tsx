import { useState } from "react";
import { LayoutTemplate, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TemplatePickerDialog } from "./TemplatePickerDialog";
import type { MessageTemplate } from "../types";

interface ReplyWindowExpiredBarProps {
  onSendTemplate: (template: MessageTemplate) => void;
}

export function ReplyWindowExpiredBar({ onSendTemplate }: ReplyWindowExpiredBarProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div
        role="alert"
        className="flex flex-col gap-2 border-t border-border/60 bg-muted/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="size-3.5 shrink-0" />
          <span>
            24-hour reply window expired. Free-text replies are unavailable.
          </span>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="shrink-0 gap-1.5"
          onClick={() => setDialogOpen(true)}
          aria-label="Send a WhatsApp template message"
        >
          <LayoutTemplate className="size-3.5" />
          Send template message
        </Button>
      </div>

      <TemplatePickerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSelect={onSendTemplate}
      />
    </>
  );
}

