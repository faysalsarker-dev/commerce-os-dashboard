import emptyInboxImg from "@/assets/system/empty-inbox.png";

export function ChatEmptyState() {
  return (
    <div className="flex h-full w-full flex-1 flex-col bg-card items-center justify-center p-6 text-center select-none">
      <div className="flex w-[85%] max-w-2xl flex-col items-center justify-center">
        <img
          src={emptyInboxImg}
          alt="No conversation selected"
          className="max-h-[55vh] w-full object-contain"
        />

        <div className="mt-2 space-y-1.5">
          <h3 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            No conversation selected
          </h3>
          <p className="mx-auto max-w-md text-xs leading-relaxed text-muted-foreground sm:text-sm">
            Pick a conversation from the left panel to start reading and replying to customer messages.
          </p>
        </div>
      </div>
    </div>
  );
}
