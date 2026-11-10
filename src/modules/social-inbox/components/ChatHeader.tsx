import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PlatformBadge } from "./PlatformBadge";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Conversation, Customer } from "../types";

interface ChatHeaderProps {
  conversation: Conversation;
  customer: Customer;
  onStatusChange: (status: "open" | "resolved") => void;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function ChatHeader({ conversation, customer, onStatusChange }: ChatHeaderProps) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border/60 bg-card px-4 py-3">
      {/* Left: customer info */}
      <div className="flex min-w-0 items-center gap-3">
        <Avatar size="default" className="shrink-0">
          <AvatarImage src={customer.avatarUrl} alt={customer.name} />
          <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold text-foreground">
              {customer.name}
            </span>
            <PlatformBadge platform={conversation.platform} showLabel={false} />
          </div>
          <span className="text-xs text-muted-foreground">
            {conversation.platform === "whatsapp"
              ? customer.identities.find((i) => i.platform === "whatsapp")?.externalUserId
              : `via ${conversation.platform}`}
          </span>
        </div>
      </div>

      {/* Right: status toggle only */}
      <div className="flex shrink-0 items-center gap-2">
        <StatusBadge
          value={conversation.status}
          className="hidden sm:inline-flex"
        />
        <Button
          size="sm"
          variant={conversation.status === "open" ? "outline" : "secondary"}
          onClick={() =>
            onStatusChange(conversation.status === "open" ? "resolved" : "open")
          }
          aria-label={
            conversation.status === "open" ? "Mark as resolved" : "Reopen conversation"
          }
        >
          {conversation.status === "open" ? "Resolve" : "Reopen"}
        </Button>
      </div>
    </header>
  );
}
