import { useState } from "react";
import { LayoutTemplate } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { mockTemplates } from "../data/mockTemplates";
import { TemplateMessage } from "./TemplateMessage";
import type { MessageTemplate } from "../types";

interface TemplatePickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (template: MessageTemplate) => void;
}

export function TemplatePickerDialog({
  open,
  onOpenChange,
  onSelect,
}: TemplatePickerDialogProps) {
  const [selected, setSelected] = useState<MessageTemplate | null>(null);

  function handleSend() {
    if (!selected) return;
    onSelect(selected);
    setSelected(null);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LayoutTemplate className="size-4" />
            Send a template message
          </DialogTitle>
          <DialogDescription>
            Select a pre-approved WhatsApp template to re-open the conversation.
          </DialogDescription>
        </DialogHeader>

        <ul className="flex flex-col gap-2 py-1" role="listbox" aria-label="Message templates">
          {mockTemplates.map((tpl) => (
            <li key={tpl.id} role="option" aria-selected={selected?.id === tpl.id}>
              <button
                type="button"
                onClick={() => setSelected(tpl)}
                className={`w-full rounded-lg text-left ring-2 transition-shadow duration-100 outline-none focus-visible:ring-ring ${
                  selected?.id === tpl.id
                    ? "ring-primary"
                    : "ring-transparent hover:ring-border"
                }`}
                aria-pressed={selected?.id === tpl.id}
              >
                <TemplateMessage template={tpl} />
              </button>
            </li>
          ))}
        </ul>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="sm" disabled={!selected} onClick={handleSend}>
            Send Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

