import { useRef, useState } from "react";
import { Send, Paperclip, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface MessageComposerProps {
  onSend: (text: string) => void;
  isSending: boolean;
  disabled?: boolean;
}

export function MessageComposer({ onSend, isSending, disabled = false }: MessageComposerProps) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed || isSending || disabled) return;
    onSend(trimmed);
    setText("");
    textareaRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="border-t border-border/60 bg-card px-3 py-3">
      <div
        className={`flex items-end gap-2 rounded-xl border border-input bg-background p-2 ring-0 transition-all focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/40 ${disabled ? "opacity-50" : ""}`}
      >
        {/* Left actions */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              disabled={disabled}
              aria-label="Attach file"
              onClick={() => {/* File picker — UI only */}}
            >
              <Paperclip className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Attach file</TooltipContent>
        </Tooltip>

        {/* Text area */}
        <Textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "Reply window expired" : "Type a message… (Enter to send)"}
          disabled={disabled || isSending}
          rows={1}
          aria-label="Message input"
          className="min-h-0 flex-1 resize-none border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0 disabled:cursor-not-allowed"
        />

        {/* Right actions */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              disabled={disabled}
              aria-label="Insert emoji"
              onClick={() => {/* Emoji picker — UI only */}}
            >
              <Smile className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Emoji</TooltipContent>
        </Tooltip>

        <Button
          type="button"
          size="icon-sm"
          disabled={!text.trim() || isSending || disabled}
          onClick={handleSend}
          aria-label="Send message"
        >
          <Send className="size-3.5" />
        </Button>
      </div>

      <p className="mt-1.5 px-1 text-[10px] text-muted-foreground">
        Shift + Enter for new line
      </p>
    </div>
  );
}

