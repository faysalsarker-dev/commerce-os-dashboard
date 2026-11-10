// ─────────────────────────────────────────────────────────────────────────────
// Social Inbox — Types
// Shapes mirror the real Meta (Messenger / Instagram / WhatsApp Cloud API) and
// TikTok Business Messaging API payloads so that swapping mock data for real
// API responses requires no changes to the UI layer.
// ─────────────────────────────────────────────────────────────────────────────

export type Platform = "messenger" | "instagram" | "whatsapp" | "tiktok";

// ─── Channel ─────────────────────────────────────────────────────────────────
// Represents a connected social-media account owned by this store.
// In the real API this maps to a Meta Page / WhatsApp Business Account / TikTok
// Business account with an access token stored server-side.
export interface Channel {
  id: string;
  storeId: string;
  platform: Platform;
  /** e.g. the Facebook Page ID, WhatsApp phone number, TikTok open_id */
  externalAccountId: string;
  status: "connected" | "token_expired" | "error" | "not_connected";
  /** Human-readable label shown in the UI (page name, phone number, …) */
  displayName: string;
}

// ─── Customer ────────────────────────────────────────────────────────────────
// A single customer can contact the store across multiple platforms.
// identities[n].externalUserId maps to the platform's sender id field
// (e.g. sender.id in Messenger webhooks, wa_id in WhatsApp Cloud API, etc.).
export interface Customer {
  id: string;
  name: string;
  avatarUrl?: string;
  identities: {
    platform: Platform;
    externalUserId: string;
  }[];
}

// ─── Conversation ─────────────────────────────────────────────────────────────
// One thread between the store and a customer on a specific platform channel.
// replyWindowExpiresAt mirrors the 24-hour reply-window concept used by
// WhatsApp Cloud API and Messenger (outside the window only templates allowed).
export interface Conversation {
  id: string;
  channelId: string;
  customerId: string;
  platform: Platform;
  status: "open" | "resolved";
  unreadCount: number;
  lastMessageAt: string; // ISO-8601
  lastMessagePreview: string;
  /** ISO-8601; if in the past the free-text composer is disabled */
  replyWindowExpiresAt?: string;
  /** Staff member's user id assigned to this conversation */
  assignedTo?: string;
}

// ─── Message ──────────────────────────────────────────────────────────────────
// A single message within a conversation.
// type mirrors the real API media types; 'unsupported' is returned by Meta when
// the message type is not renderable via the API (stickers, polls, …).
export interface Message {
  id: string;
  conversationId: string;
  /** The platform-native message id (used for deduplication & templates) */
  externalMessageId: string;
  direction: "inbound" | "outbound";
  type: "text" | "image" | "video" | "audio" | "file" | "template" | "unsupported";
  text?: string;
  mediaUrl?: string;
  /** For template messages — the template object as returned by the API */
  template?: MessageTemplate;
  status: "sending" | "sent" | "delivered" | "read" | "failed";
  createdAt: string; // ISO-8601
}

// ─── MessageTemplate ──────────────────────────────────────────────────────────
// Simplified template shape; mirrors WhatsApp Cloud API template object.
export interface MessageTemplate {
  id: string;
  name: string;
  language: string;
  /** The rendered body text after variable substitution */
  bodyText: string;
  /** Header image / text if present */
  headerText?: string;
  footerText?: string;
  category: "UTILITY" | "MARKETING" | "AUTHENTICATION";
}

// ─── Filters ─────────────────────────────────────────────────────────────────
export interface ConversationFilters {
  platform: Platform;
  search: string;
  status?: "open" | "resolved" | "all";
}

