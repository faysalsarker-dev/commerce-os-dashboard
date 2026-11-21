import { z } from "zod"
import { CAMPAIGN_PLATFORMS } from "@/types/data-types/campaign.types"

export const campaignFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Campaign name is required")
      .max(160, "Campaign name must be at most 160 characters"),
    platform: z.enum(CAMPAIGN_PLATFORMS),
    trackingCode: z
      .string()
      .trim()
      .max(200, "Tracking code must be at most 200 characters"),
    startDate: z.string(),
    endDate: z.string(),
    isActive: z.boolean(),
    isCampEnd: z.boolean(),
  })
  .refine(
    (values) =>
      !values.startDate ||
      !values.endDate ||
      values.endDate >= values.startDate,
    {
      message: "End date must be on or after the start date",
      path: ["endDate"],
    }
  )

export type CampaignFormValues = z.infer<typeof campaignFormSchema>

export const CAMPAIGN_DEFAULT_VALUES: CampaignFormValues = {
  name: "",
  platform: "FACEBOOK",
  trackingCode: "",
  startDate: "",
  endDate: "",
  isActive: true,
  isCampEnd: false,
}
