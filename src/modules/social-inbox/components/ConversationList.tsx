import { SearchX, MessageSquare } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { ConversationItem } from "./ConversationItem";
import { ConversationListSkeleton } from "./ConversationListSkeleton";
import type { Conversation, Customer } from "../types";

interface ConversationWithCustomer extends Conversation {
  customer: Customer;
}

interface ConversationListProps {
  conversations: ConversationWithCustomer[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isLoading: boolean;
  hasSearch: boolean;
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  isLoading,
  hasSearch,
}: ConversationListProps) {
  if (isLoading) return <ConversationListSkeleton />;

  if (conversations.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <EmptyState
          icon={hasSearch ? SearchX : MessageSquare}
          title={hasSearch ? "No results found" : "No conversations yet"}
          description={
            hasSearch
              ? "Try a different name or message keyword."
              : "Messages from customers will appear here."
          }
          compact
        />
      </div>
    );
  }

  return (
    <ul role="listbox" aria-label="Conversations" className="flex flex-col gap-0.5 p-2">
      {conversations.map((conv) => (
        <li key={conv.id} role="option" aria-selected={conv.id === selectedId}>
          <ConversationItem
            conversation={conv}
            customer={conv.customer}
            isSelected={conv.id === selectedId}
            onClick={() => onSelect(conv.id)}
          />
        </li>
      ))}
    </ul>
  );
}

