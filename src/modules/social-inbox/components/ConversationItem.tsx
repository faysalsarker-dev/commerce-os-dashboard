import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatRelativeTime } from "../utils/formatTime";
import type { Conversation, Customer } from "../types";

interface ConversationItemProps {
  conversation: Conversation;
  customer: Customer;
  isSelected: boolean;
  onClick: () => void;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function ConversationItem({
  conversation,
  customer,
  isSelected,
  onClick,
}: ConversationItemProps) {
  const hasUnread = conversation.unreadCount > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      aria-label={`Conversation with ${customer.name}`}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-150 outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        isSelected
          ? "bg-primary/10 dark:bg-primary/15"
          : "hover:bg-muted/60 dark:hover:bg-muted/30"
      )}
    >
      {/* Avatar */}
      <Avatar size="default" className="mt-0.5 shrink-0">
        <AvatarImage src={customer.avatarUrl} alt={customer.name} />
        <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
      </Avatar>

      {/* Body */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "truncate text-sm",
              hasUnread ? "font-semibold text-foreground" : "font-medium text-foreground/80"
            )}
          >
            {customer.name}
          </span>
          <span className="shrink-0 text-[11px] text-muted-foreground">
            {formatRelativeTime(conversation.lastMessageAt)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p
            className={cn(
              "truncate text-xs",
              hasUnread ? "text-foreground/80" : "text-muted-foreground"
            )}
          >
            {conversation.lastMessagePreview}
          </p>
          {hasUnread && (
            <span
              aria-label={`${conversation.unreadCount} unread messages`}
              className="flex h-4.5 min-w-4.5 shrink-0 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground"
            >
              {conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

