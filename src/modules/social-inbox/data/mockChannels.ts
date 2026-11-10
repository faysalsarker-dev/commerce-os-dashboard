import type { Channel } from "../types";

// One channel per platform; TikTok is token_expired, WhatsApp has no connected channel.
export const mockChannels: Channel[] = [
  {
    id: "ch_messenger_1",
    storeId: "store_1",
    platform: "messenger",
    externalAccountId: "123456789012345",
    status: "connected",
    displayName: "Commerce OS Store",
  },
  {
    id: "ch_instagram_1",
    storeId: "store_1",
    platform: "instagram",
    externalAccountId: "17841400000000000",
    status: "connected",
    displayName: "@commerceos.store",
  },
  {
    id: "ch_tiktok_1",
    storeId: "store_1",
    platform: "tiktok",
    externalAccountId: "tt_open_id_abc123",
    status: "token_expired",
    displayName: "@commerceos",
  },
  {
    id: "ch_whatsapp_1",
    storeId: "store_1",
    platform: "whatsapp",
    externalAccountId: "",
    status: "not_connected",
    displayName: "WhatsApp Business",
  },
];

