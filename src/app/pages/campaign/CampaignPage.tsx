import { useCallback, useMemo, useState } from "react"
import { Megaphone, Plus } from "lucide-react"
import { Button, Card, CardContent } from "@/components/ui"
import { DataTable } from "@/components/modules/table"
import { CampaignDialog } from "@/components/modules/campaign"
import { getDefaultValues } from "@/components/modules/filter"
import {
  FilterBar,
  PageContainer,
  PageHeader,
} from "@/components/shared/common"
import { Can } from "@/components/shared/permissions/Can"
import { useFilter } from "@/hooks/useFilter"
import { useDeleteCampaignMutation, useGetCampaignsQuery } from "@/redux/hooks"
import type {
  Campaign,
  CampaignFilters,
} from "@/types/data-types/campaign.types"
import { handleAsyncMutation } from "@/utils/asyncHandler"
import {
  CAMPAIGN_FILTER_CONFIG,
  CAMPAIGN_PAGE_CONFIG,
  createCampaignTableColumns,
} from "./campaign.config"

export default function CampaignPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)

  const filter = useFilter({
    defaultValues: getDefaultValues(CAMPAIGN_FILTER_CONFIG),
    debounceMs: { searchTerm: 300 },
    syncToUrl: true,
  })

  const queryParams = useMemo<CampaignFilters>(() => {
    const params = filter.queryParams
    const active = params.isActive
    const ended = params.isCampEnd
    return {
      page: params.page,
      limit: params.limit,
      searchTerm: params.searchTerm,
      platform: params.platform || undefined,
      isActive:
        active === "true" ? true : active === "false" ? false : undefined,
      isCampEnd:
        ended === "true" ? true : ended === "false" ? false : undefined,
    }
  }, [filter.queryParams])

  const { data: response, isLoading } = useGetCampaignsQuery(queryParams)
  const [deleteCampaign] = useDeleteCampaignMutation()

  const openCreateDialog = () => {
    setEditingCampaign(null)
    setDialogOpen(true)
  }

  const handleDelete = useCallback(
    (campaign: Campaign) =>
      handleAsyncMutation(() => deleteCampaign(campaign.id).unwrap(), {
        successMessage: `Campaign "${campaign.name}" deleted`,
        errorMessage: "Unable to delete campaign",
        errorDescription:
          "Campaigns linked to sales or expenses cannot be deleted. Deactivate the campaign instead.",
      }),
    [deleteCampaign]
  )

  const columns = useMemo(
    () =>
      createCampaignTableColumns({
        onEdit: (campaign) => {
          setEditingCampaign(campaign)
          setDialogOpen(true)
        },
        onDelete: handleDelete,
      }),
    [handleDelete]
  )

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open)
    if (!open) setEditingCampaign(null)
  }

  const campaigns = response?.data ?? []
  const totalCampaigns = response?.meta?.total ?? campaigns.length
  const activeCampaigns = campaigns.filter(
    (campaign) => campaign.isActive
  ).length
  const endedCampaigns = campaigns.filter(
    (campaign) => campaign.isCampEnd
  ).length

  return (
    <PageContainer>
      <PageHeader
        title={CAMPAIGN_PAGE_CONFIG.title}
        description={CAMPAIGN_PAGE_CONFIG.description}
        noAction
        actions={
          <Can I="create" a="campaign">
            <Button
              onClick={openCreateDialog}
              className="h-10 gap-2 rounded-xl"
            >
              <Plus className="size-4" />
              Create campaign
            </Button>
          </Can>
        }
      />

      <section className="grid gap-3 sm:grid-cols-3">
        <SummaryCard
          label="Campaigns"
          value={totalCampaigns}
          detail="Matching current filters"
          icon={Megaphone}
        />
        <SummaryCard
          label="Active"
          value={activeCampaigns}
          detail="Active on this page"
          icon={Megaphone}
        />
        <SummaryCard
          label="Ended"
          value={endedCampaigns}
          detail="Ended on this page"
          icon={Megaphone}
        />
      </section>

      <FilterBar filter={filter} filters={CAMPAIGN_FILTER_CONFIG} />

      <CampaignDialog
        campaign={editingCampaign}
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        trigger={null}
      />

      <DataTable
        columns={columns}
        data={campaigns}
        isLoading={isLoading}
        pagination={filter.tableState}
        onPaginationChange={filter.onTableStateChange}
        meta={response?.meta}
      />
    </PageContainer>
  )
}

function SummaryCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string
  value: number
  detail: string
  icon: typeof Megaphone
}) {
  return (
    <Card className="rounded-2xl border border-border/60 shadow-xs">
      <CardContent className="flex items-start justify-between gap-3 p-4 sm:p-5">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            {value.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
        </div>
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
      </CardContent>
    </Card>
  )
}
