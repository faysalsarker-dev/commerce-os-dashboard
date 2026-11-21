import {
  CAMPAIGN_PLATFORMS,
  type CampaignPlatform,
} from "@/types/data-types/campaign.types"

const PLATFORM_LABELS: Record<CampaignPlatform, string> = {
  FACEBOOK: "Facebook",
  INSTAGRAM: "Instagram",
  TIKTOK: "TikTok",
  WHATSAPP: "WhatsApp",
  GOOGLE: "Google",
  YOUTUBE: "YouTube",
  OTHER: "Other",
}

export const CAMPAIGN_PLATFORM_OPTIONS = CAMPAIGN_PLATFORMS.map((value) => ({
  label: PLATFORM_LABELS[value],
  value,
}))
