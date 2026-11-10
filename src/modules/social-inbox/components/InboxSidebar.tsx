import { useState } from "react";
import { Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { PlatformIcon } from "./PlatformIcon";
import { ConversationList } from "./ConversationList";
import { TokenExpiredBanner } from "./TokenExpiredBanner";
import { NotConnectedState } from "./NotConnectedState";
import { useConversations } from "../hooks/useConversations";
import { useChannels } from "../hooks/useChannels";
import type { Platform, Conversation, Customer } from "../types";

const PLATFORMS: Platform[] = ["messenger", "instagram", "tiktok", "whatsapp"];

const PLATFORM_LABELS: Record<Platform, string> = {
  messenger: "Messenger",
  instagram: "Instagram",
  tiktok: "TikTok",
  whatsapp: "WhatsApp",
};

interface InboxSidebarProps {
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
  defaultPlatform?: Platform;
  collapsed?: boolean;
}

interface ConversationWithCustomer extends Conversation {
  customer: Customer;
}

// ─── Platform tab content (conversations + optional expired banner) ───────────
function PlatformTabContent({
  platform,
  selectedId,
  onSelect,
  search,
}: {
  platform: Platform;
  selectedId: string | null;
  onSelect: (id: string) => void;
  search: string;
}) {
  const { getChannel } = useChannels();
  const channel = getChannel(platform);
  const { conversations, isLoading } = useConversations({ platform, search });

  if (!channel || channel.status === "not_connected") {
    return <NotConnectedState platform={platform} />;
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {channel.status === "token_expired" && <TokenExpiredBanner />}
      <ScrollArea className="flex-1">
        <ConversationList
          conversations={conversations}
          selectedId={selectedId}
          onSelect={onSelect}
          isLoading={isLoading}
          hasSearch={search.length > 0}
        />
      </ScrollArea>
    </div>
  );
}

// ─── Shared unread badge ──────────────────────────────────────────────────────
function UnreadDot({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span
      aria-hidden="true"
      className="absolute -top-0.5 -right-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-primary px-0.5 text-[8px] font-bold leading-none text-primary-foreground"
    >
      {count > 9 ? "9+" : count}
    </span>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function InboxSidebar({
  selectedConversationId,
  onSelectConversation,
  defaultPlatform = "messenger",
  collapsed = false,
}: InboxSidebarProps) {
  const [activePlatform, setActivePlatform] = useState<Platform>(defaultPlatform);
  const [search, setSearch] = useState("");

  const { getChannel } = useChannels();

  // Unread counts for each platform (always computed, used in both modes)
  const messengerConvs = useConversations({ platform: "messenger", search: "" });
  const instagramConvs = useConversations({ platform: "instagram", search: "" });
  const tiktokConvs    = useConversations({ platform: "tiktok",    search: "" });
  const whatsappConvs  = useConversations({ platform: "whatsapp",  search: "" });

  const unread: Record<Platform, number> = {
    messenger: messengerConvs.conversations.reduce((s, c) => s + c.unreadCount, 0),
    instagram: instagramConvs.conversations.reduce((s, c) => s + c.unreadCount, 0),
    tiktok:    tiktokConvs.conversations.reduce((s, c)    => s + c.unreadCount, 0),
    whatsapp:  whatsappConvs.conversations.reduce((s, c)  => s + c.unreadCount, 0),
  };

  // ── COLLAPSED — icon rail ──────────────────────────────────────────────────
  if (collapsed) {
    return (
      <aside
        aria-label="Social inbox sidebar (collapsed)"
        className="flex h-full w-14 shrink-0 flex-col items-center gap-1 border-r border-border/60 bg-card py-3"
      >
        {PLATFORMS.map((platform) => {
          const isActive = platform === activePlatform;
          return (
            <Tooltip key={platform}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setActivePlatform(platform)}
                  aria-label={`${PLATFORM_LABELS[platform]}${unread[platform] > 0 ? `, ${unread[platform]} unread` : ""}`}
                  aria-pressed={isActive}
                  className={cn(
                    "relative flex size-9 items-center justify-center rounded-xl outline-none transition-colors duration-150",
                    "focus-visible:ring-2 focus-visible:ring-ring",
                    isActive
                      ? "bg-primary/10 dark:bg-primary/15"
                      : "hover:bg-muted/60 dark:hover:bg-muted/30"
                  )}
                >
                  <PlatformIcon platform={platform} size={20} />
                  <UnreadDot count={unread[platform]} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                {PLATFORM_LABELS[platform]}
                {unread[platform] > 0 && ` · ${unread[platform]} unread`}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </aside>
    );
  }

  // ── EXPANDED ───────────────────────────────────────────────────────────────
  return (
    <aside
      aria-label="Social inbox sidebar"
      className="flex h-full w-full flex-col border-r border-border/60 bg-card"
    >
      <Tabs
        value={activePlatform}
        onValueChange={(v) => setActivePlatform(v as Platform)}
        className="flex flex-1 flex-col overflow-hidden"
      >
        {/* ── Tab strip — 4 equal columns, icon + label, NO wrapping ── */}
        <TabsList
          variant="line"
          className="grid h-auto w-full shrink-0 grid-cols-4 rounded-none border-b border-border/60 bg-transparent p-0"
          aria-label="Filter by platform"
        >
          {PLATFORMS.map((platform) => {
            const channel = getChannel(platform);
            const hasIssue =
              !channel ||
              channel.status === "not_connected" ||
              channel.status === "token_expired";

            return (
              <TabsTrigger
                key={platform}
                value={platform}
                className={cn(
                  // Layout: icon on top, label below, never wrap
                  "flex flex-col items-center justify-center gap-0.5 rounded-none border-0 py-2.5",
                  "text-[10px] font-medium leading-none whitespace-nowrap",
                  // Active indicator
                  "after:bottom-0 after:h-0.5 data-active:text-primary",
                  // Dim if disconnected
                  hasIssue && "opacity-60"
                )}
                aria-label={`${PLATFORM_LABELS[platform]}${unread[platform] > 0 ? `, ${unread[platform]} unread` : ""}${!channel || channel.status === "not_connected" ? ", not connected" : channel.status === "token_expired" ? ", reconnect required" : ""}`}
              >
                {/* Icon with unread badge */}
                <span className="relative">
                  <PlatformIcon platform={platform} size={18} />
                  <UnreadDot count={unread[platform]} />
                </span>
                {/* Label — always visible */}
                <span className="mt-0.5 truncate">{PLATFORM_LABELS[platform]}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* ── Search — lives BELOW the tab strip, inside the pane ── */}
        <div className="shrink-0 border-b border-border/60 px-3 py-4 my-3">
          <div className="relative">
            <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8 text-sm"
              aria-label="Search conversations"
            />
          </div>
        </div>

        {/* ── Conversation panels ── */}
        {PLATFORMS.map((platform) => (
          <TabsContent
            key={platform}
            value={platform}
            className="mt-0 flex flex-1 flex-col overflow-hidden"
          >
            <PlatformTabContent
              platform={platform}
              selectedId={selectedConversationId}
              onSelect={onSelectConversation}
              search={search}
            />
          </TabsContent>
        ))}
      </Tabs>
    </aside>
  );
}
