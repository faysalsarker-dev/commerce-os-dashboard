export const CAMPAIGN_PLATFORMS = [
  "FACEBOOK",
  "INSTAGRAM",
  "TIKTOK",
  "WHATSAPP",
  "GOOGLE",
  "YOUTUBE",
  "OTHER",
] as const

export type CampaignPlatform = (typeof CAMPAIGN_PLATFORMS)[number]

export interface Campaign {
  id: string
  name: string
  platform: CampaignPlatform
  trackingCode: string | null
  startDate: string | null
  endDate: string | null
  isActive: boolean
  isCampEnd: boolean
  createdAt: string
  updatedAt: string
  _count?: { sales: number; expenses: number }
}

export interface CreateCampaignPayload {
  name: string
  platform: CampaignPlatform
  trackingCode?: string
  startDate?: string | Date
  endDate?: string | Date
  isActive?: boolean
  isCampEnd?: boolean
}

export interface UpdateCampaignPayload {
  name?: string
  platform?: CampaignPlatform
  trackingCode?: string | null
  startDate?: string | Date | null
  endDate?: string | Date | null
  isActive?: boolean
  isCampEnd?: boolean
}

export interface CampaignFilters {
  page?: number
  limit?: number
  platform?: CampaignPlatform
  isActive?: boolean
  isCampEnd?: boolean
  searchTerm?: string
}
