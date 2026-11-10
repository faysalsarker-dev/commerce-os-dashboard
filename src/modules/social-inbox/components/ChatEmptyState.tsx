import { UserCircle } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";

export function ChatEmptyState() {
  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <EmptyState
        icon={UserCircle}
        title="No conversation selected"
        description="Pick a conversation from the left panel to start reading and replying to customer messages."
      />
    </div>
  );
}

