import { Camera, Megaphone, MessageCircle, Music2, Play } from "lucide-react"
import type { CampaignPlatform } from "@/types/data-types/campaign.types"

const PLATFORM_LABELS: Record<CampaignPlatform, string> = {
  FACEBOOK: "Facebook",
  INSTAGRAM: "Instagram",
  TIKTOK: "TikTok",
  WHATSAPP: "WhatsApp",
  GOOGLE: "Google",
  YOUTUBE: "YouTube",
  OTHER: "Other",
}

export function PlatformIcon({ platform }: { platform: CampaignPlatform }) {
  const commonClass = "size-4"

  const mark = {
    FACEBOOK: (
      <span className="mt-1 font-sans text-xl leading-none font-bold">f</span>
    ),
    INSTAGRAM: <Camera className={commonClass} />,
    TIKTOK: <Music2 className={commonClass} />,
    WHATSAPP: <MessageCircle className={commonClass} />,
    GOOGLE: (
      <span className="bg-gradient-to-r from-blue-600 via-red-500 to-yellow-500 bg-clip-text font-sans text-lg leading-none font-bold text-transparent">
        G
      </span>
    ),
    YOUTUBE: <Play className="size-3.5 fill-current" />,
    OTHER: <Megaphone className={commonClass} />,
  }[platform]

  const className = {
    FACEBOOK: "bg-[#1877F2] text-white",
    INSTAGRAM:
      "bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#FCAF45] text-white",
    TIKTOK: "bg-black text-white dark:bg-white dark:text-black",
    WHATSAPP: "bg-[#25D366] text-white",
    GOOGLE: "bg-background",
    YOUTUBE: "bg-[#FF0000] text-white",
    OTHER: "bg-muted text-muted-foreground",
  }[platform]

  return (
    <span
      aria-hidden="true"
      className={`grid size-8 shrink-0 place-items-center rounded-lg ${className}`}
      title={PLATFORM_LABELS[platform]}
    >
      {mark}
    </span>
  )
}
