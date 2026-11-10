import { useState } from "react";
import { ArrowLeft, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { InboxSidebar } from "./InboxSidebar";
import { ChatArea } from "./ChatArea";
import { PlatformBadge } from "./PlatformBadge";
import { useConversations } from "../hooks/useConversations";
import { mockCustomers } from "../data/mockCustomers";
import type { Platform } from "../types";

type MobileView = "list" | "chat";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function SocialInboxLayout() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<MobileView>("list");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const messengerData = useConversations({ platform: "messenger", search: "" });
  const instagramData = useConversations({ platform: "instagram", search: "" });
  const tiktokData    = useConversations({ platform: "tiktok",    search: "" });
  const whatsappData  = useConversations({ platform: "whatsapp",  search: "" });

  const allConversations = [
    ...messengerData.conversations,
    ...instagramData.conversations,
    ...tiktokData.conversations,
    ...whatsappData.conversations,
  ];

  const selectedConversation = selectedId
    ? allConversations.find((c) => c.id === selectedId) ?? null
    : null;

  const selectedCustomer = selectedConversation
    ? mockCustomers.find((cu) => cu.id === selectedConversation.customerId) ?? null
    : null;

  function handleSelectConversation(id: string) {
    setSelectedId(id);
    setMobileView("chat");
    if (sidebarCollapsed) setSidebarCollapsed(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex h-[calc(100vh-var(--header-height))] overflow-hidden bg-background"
      aria-label="Social Inbox"
    >
      {/* ── LEFT PANE — collapsible sidebar ─────────────────────────────── */}
      <motion.div
        animate={{ width: sidebarCollapsed ? 56 : 320 }}
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        className={[
          "flex shrink-0 flex-col overflow-hidden",
          mobileView === "chat" ? "hidden md:flex" : "flex w-full md:w-auto",
        ].join(" ")}
        style={{ minWidth: sidebarCollapsed ? 56 : undefined }}
      >
        <InboxSidebar
          selectedConversationId={selectedId}
          onSelectConversation={handleSelectConversation}
          collapsed={sidebarCollapsed}
        />
      </motion.div>

      {/* ── RIGHT PANE ───────────────────────────────────────────────────── */}
      <div
        className={[
          "flex flex-1 flex-col overflow-hidden",
          mobileView === "list" ? "hidden md:flex" : "flex",
        ].join(" ")}
      >
        {/* ── Unified topbar: toggle (left) + customer identity (right) ── */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border/60 bg-card px-3 py-2">

          {/* Left side — mobile back OR desktop collapse toggle */}
          <div className="flex items-center gap-2">
            {/* Mobile back button */}
            {mobileView === "chat" && (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 md:hidden"
                onClick={() => setMobileView("list")}
                aria-label="Back to conversation list"
              >
                <ArrowLeft className="size-4" />
                Back
              </Button>
            )}

            {/* Desktop collapse toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setSidebarCollapsed((v) => !v)}
                  aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                  aria-expanded={!sidebarCollapsed}
                  className="hidden md:inline-flex"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {sidebarCollapsed ? (
                      <motion.span
                        key="open"
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.15 }}
                      >
                        <PanelLeftOpen className="size-4" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="close"
                        initial={{ opacity: 0, rotate: 90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: -90 }}
                        transition={{ duration: 0.15 }}
                      >
                        <PanelLeftClose className="size-4" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Right side — customer identity (fades in when conversation is selected) */}
          <AnimatePresence mode="wait">
            {selectedConversation && selectedCustomer ? (
              <motion.div
                key={selectedConversation.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="flex items-center gap-2.5"
              >
                {/* Platform badge */}
                <PlatformBadge
                  platform={selectedConversation.platform}
                  showLabel={false}
                  className="shrink-0"
                />

                {/* Name */}
                <span className="max-w-[140px] truncate text-sm font-semibold text-foreground sm:max-w-xs">
                  {selectedCustomer.name}
                </span>

                {/* Avatar */}
                <Avatar size="sm" className="shrink-0">
                  <AvatarImage
                    src={selectedCustomer.avatarUrl}
                    alt={selectedCustomer.name}
                  />
                  <AvatarFallback>{getInitials(selectedCustomer.name)}</AvatarFallback>
                </Avatar>
              </motion.div>
            ) : (
              /* Placeholder keeps bar height stable when nothing is selected */
              <motion.span
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-muted-foreground"
              >
                Select a conversation
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Chat thread + composer — no extra header */}
        <ChatArea conversation={selectedConversation} customer={selectedCustomer} />
      </div>
    </motion.div>
  );
}
