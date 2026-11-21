import { StatusBadge } from "@/components/ui/status-badge"
import { search, select } from "@/components/modules/filter"
import {
  action,
  column,
  createColumns,
} from "@/components/modules/table/column-builder"
import { formatDate } from "@/lib/format"
import { PlatformIcon } from "@/components/modules/campaign/PlatformIcon"
import { CAMPAIGN_PLATFORM_OPTIONS } from "@/components/modules/campaign/platforms"
import type { Campaign } from "@/types/data-types/campaign.types"

export const CAMPAIGN_PAGE_CONFIG = {
  title: "Campaigns",
  description: "Manage marketing campaigns and their tracking details.",
} as const

export const CAMPAIGN_FILTER_CONFIG = [
  search({
    name: "searchTerm",
    label: "Search",
    placeholder: "Search name or tracking code...",
  }),
  select({
    name: "platform",
    label: "Platform",
    placeholder: "All platforms",
    options: [
      { label: "All platforms", value: "" },
      ...CAMPAIGN_PLATFORM_OPTIONS,
    ],
  }),
  select({
    name: "isActive",
    label: "Status",
    placeholder: "All statuses",
    options: [
      { label: "All statuses", value: "" },
      { label: "Active", value: "true" },
      { label: "Inactive", value: "false" },
    ],
  }),
  select({
    name: "isCampEnd",
    label: "Campaign period",
    placeholder: "Any period",
    options: [
      { label: "Any period", value: "" },
      { label: "Ongoing", value: "false" },
      { label: "Ended", value: "true" },
    ],
  }),
]

type CampaignTableHandlers = {
  onEdit: (campaign: Campaign) => void
  onDelete: (campaign: Campaign) => void
}

export const createCampaignTableColumns = ({
  onEdit,
  onDelete,
}: CampaignTableHandlers) =>
  createColumns<Campaign>({
    resource: "campaign",
    columns: [
      column("platform", {
        label: "Platform",
        render: (campaign) => (
          <div className="flex items-center gap-2.5">
            <PlatformIcon platform={campaign.platform} />
            <span className="font-medium">
              {CAMPAIGN_PLATFORM_OPTIONS.find(
                (option) => option.value === campaign.platform
              )?.label ?? campaign.platform}
            </span>
          </div>
        ),
      }),
      column("name", {
        label: "Campaign",
        sortable: true,
        render: (campaign) => (
          <div className="min-w-36">
            <p className="font-semibold text-foreground">{campaign.name}</p>
            <p className="text-xs text-muted-foreground">
              Added {formatDate(campaign.createdAt)}
            </p>
          </div>
        ),
      }),
      column("trackingCode", {
        label: "Tracking code",
        render: (campaign) =>
          campaign.trackingCode ? (
            <span className="rounded-md bg-muted px-2 py-1 font-mono text-xs">
              {campaign.trackingCode}
            </span>
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
      }),
      column("startDate", {
        label: "Campaign dates",
        render: (campaign) => (
          <div className="text-sm whitespace-nowrap">
            {formatDate(campaign.startDate)}
            <span className="px-1 text-muted-foreground">to</span>
            {formatDate(campaign.endDate)}
          </div>
        ),
      }),
      column("isActive", {
        label: "Status",
        render: (campaign) => (
          <StatusBadge
            value={campaign.isActive}
            text={campaign.isActive ? "Active" : "Inactive"}
          />
        ),
      }),
      column("isCampEnd", {
        label: "Period",
        render: (campaign) => (
          <StatusBadge
            value={campaign.isCampEnd ? "completed" : "active"}
            text={campaign.isCampEnd ? "Ended" : "Ongoing"}
          />
        ),
      }),
      column.actions([
        action.edit<Campaign>({
          can: "edit",
          onClick: onEdit,
        }),
        action.delete<Campaign>({
          can: "delete",
          confirmTitle: "Delete campaign",
          confirmDescription:
            "This campaign can only be deleted if it has no linked sales or expenses.",
          onClick: onDelete,
        }),
      ]),
    ],
  })
