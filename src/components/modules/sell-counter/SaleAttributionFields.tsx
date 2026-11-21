import { AlertCircle, Loader2, Megaphone } from "lucide-react"
import {
  Button,
  Card,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui"
import { useGetCampaignsQuery } from "@/redux/hooks"
import { SELECTABLE_SALE_CHANNELS } from "@/lib/config/sales"
import {
  SALE_CHANNEL_LABELS,
  type SaleChannel,
} from "@/types/data-types/sales/sales.types"
import { getErrorMessage } from "@/utils/asyncHandler"

interface SaleAttributionFieldsProps {
  channel: SaleChannel
  campaignId: string
  onChannelChange: (channel: SaleChannel) => void
  onCampaignChange: (campaignId: string) => void
}

export function SaleAttributionFields({
  channel,
  campaignId,
  onChannelChange,
  onCampaignChange,
}: SaleAttributionFieldsProps) {
  const {
    data: campaignsResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetCampaignsQuery({
    page: 1,
    limit: 100,
    isActive: true,
    isCampEnd: false,
  })
  const campaigns = campaignsResponse?.data ?? []

  return (
    <Card className="space-y-4 p-4">
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
          <Megaphone className="size-4" />
        </span>
        <div className="space-y-1">
          <h2 className="text-sm font-semibold">Sale attribution</h2>
          <p className="text-xs text-muted-foreground">
            Choose the channel and, optionally, the campaign for this sale.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="sale-channel">Sales channel</Label>
          <Select
            value={channel}
            onValueChange={(value) => {
              const selectedChannel = SELECTABLE_SALE_CHANNELS.find(
                (item) => item === value,
              )
              if (selectedChannel) onChannelChange(selectedChannel)
            }}
          >
            <SelectTrigger id="sale-channel" className="w-full">
              <SelectValue placeholder="Select a channel" />
            </SelectTrigger>
            <SelectContent>
              {SELECTABLE_SALE_CHANNELS.map((item) => (
                <SelectItem key={item} value={item}>
                  {SALE_CHANNEL_LABELS[item]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sale-campaign">Campaign (optional)</Label>
          <Select
            value={campaignId || "none"}
            onValueChange={(value) =>
              onCampaignChange(value === "none" ? "" : value ?? "")
            }
            disabled={isLoading || isError || campaigns.length === 0}
          >
            <SelectTrigger id="sale-campaign" className="w-full">
              <SelectValue
                placeholder={
                  isLoading
                    ? "Loading campaigns..."
                    : isError
                      ? "Campaigns unavailable"
                      : "No campaign"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No campaign</SelectItem>
              {campaigns.map((campaign) => (
                <SelectItem key={campaign.id} value={campaign.id}>
                  {campaign.name} · {campaign.platform}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin" />
          Loading active campaigns...
        </p>
      ) : null}
      {isError ? (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
        >
          <span className="flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            {getErrorMessage(error, "Campaigns could not be loaded.")}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void refetch()}
          >
            Retry
          </Button>
        </div>
      ) : null}
      {!isLoading && !isError && campaigns.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          No active campaigns are available. You can still complete the sale
          without campaign attribution.
        </p>
      ) : null}
    </Card>
  )
}
