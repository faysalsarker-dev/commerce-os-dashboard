import { MessageSquare } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import noResultsImg from "@/assets/system/no-results.png";
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
    if (hasSearch) {
      return (
        <div className="flex min-h-[320px] flex-1 flex-col items-center justify-center p-4 text-center select-none">
          <div className="flex w-[85%] flex-col items-center justify-center">
            <img
              src={noResultsImg}
              alt="No results found"
              className="w-full max-w-[260px] object-contain"
            />
            <div className=" space-y-1">
              <p className="text-sm font-semibold text-foreground">No results found</p>
              <p className="mx-auto max-w-[240px] text-xs text-muted-foreground">
                Try a different name or message keyword.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <EmptyState
          icon={MessageSquare}
          title="No conversations yet"
          description="Messages from customers will appear here."
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
