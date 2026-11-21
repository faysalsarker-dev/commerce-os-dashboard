import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2, Megaphone, Plus } from "lucide-react"
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from "@/components/ui"
import { CAMPAIGN_PLATFORM_OPTIONS } from "./platforms"
import {
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
} from "@/redux/hooks"
import type {
  Campaign,
  CreateCampaignPayload,
  UpdateCampaignPayload,
} from "@/types/data-types/campaign.types"
import {
  CAMPAIGN_DEFAULT_VALUES,
  campaignFormSchema,
  type CampaignFormValues,
} from "@/types/validations/campaign/campaign.validation"
import { handleAsyncMutation } from "@/utils/asyncHandler"

export interface CampaignDialogProps {
  campaign?: Campaign | null
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode | null
}

export function CampaignDialog({
  campaign,
  open,
  onOpenChange,
  trigger,
}: CampaignDialogProps) {
  const isEditMode = Boolean(campaign)
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isControlled = open !== undefined
  const dialogOpen = isControlled ? open : internalOpen

  const setDialogOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (isControlled) onOpenChange?.(nextOpen)
      else setInternalOpen(nextOpen)
    },
    [isControlled, onOpenChange]
  )

  const [createCampaign, { isLoading: isCreating }] =
    useCreateCampaignMutation()
  const [updateCampaign, { isLoading: isUpdating }] =
    useUpdateCampaignMutation()
  const isSubmitting = isCreating || isUpdating

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: CAMPAIGN_DEFAULT_VALUES,
  })

  React.useEffect(() => {
    if (!dialogOpen) return

    if (campaign) {
      form.reset({
        name: campaign.name,
        platform: campaign.platform,
        trackingCode: campaign.trackingCode ?? "",
        startDate: campaign.startDate?.slice(0, 10) ?? "",
        endDate: campaign.endDate?.slice(0, 10) ?? "",
        isActive: campaign.isActive,
        isCampEnd: campaign.isCampEnd,
      })
    } else {
      form.reset(CAMPAIGN_DEFAULT_VALUES)
    }
  }, [campaign, dialogOpen, form])

  const onSubmit = async (values: CampaignFormValues) => {
    const commonData = {
      name: values.name.trim(),
      platform: values.platform,
      isActive: values.isActive,
      isCampEnd: values.isCampEnd,
    }

    if (isEditMode && campaign) {
      const data: UpdateCampaignPayload = {
        ...commonData,
        trackingCode: values.trackingCode.trim() || null,
        startDate: values.startDate || null,
        endDate: values.endDate || null,
      }

      await handleAsyncMutation(
        () => updateCampaign({ id: campaign.id, data }).unwrap(),
        {
          successMessage: "Campaign updated",
          errorMessage: "Unable to update campaign",
          onSuccess: () => setDialogOpen(false),
        }
      )
      return
    }

    const data: CreateCampaignPayload = {
      ...commonData,
      trackingCode: values.trackingCode.trim() || undefined,
      startDate: values.startDate || undefined,
      endDate: values.endDate || undefined,
    }

    await handleAsyncMutation(() => createCampaign(data).unwrap(), {
      successMessage: "Campaign created",
      errorMessage: "Unable to create campaign",
      onSuccess: () => {
        form.reset(CAMPAIGN_DEFAULT_VALUES)
        setDialogOpen(false)
      },
    })
  }

  const defaultTrigger =
    trigger === null
      ? null
      : (trigger ?? (
          <Button className="gap-1.5">
            <Plus className="size-4" />
            Create campaign
          </Button>
        ))

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {defaultTrigger && <DialogTrigger>{defaultTrigger}</DialogTrigger>}
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <Megaphone className="size-5" />
            </span>
            <div className="space-y-1">
              <DialogTitle>
                {isEditMode ? "Edit campaign" : "Create campaign"}
              </DialogTitle>
              <DialogDescription>
                {isEditMode
                  ? "Update the campaign details and status."
                  : "Add a campaign and its platform tracking details."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g. Summer collection launch"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose a platform" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CAMPAIGN_PLATFORM_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="trackingCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tracking code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Optional"
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormDescription>
                      Must be unique across campaigns.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start date</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" value={field.value ?? ""} />
                    </FormControl>
                    <FormDescription>Optional.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End date</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" value={field.value ?? ""} />
                    </FormControl>
                    <FormDescription>
                      Must not be before the start date.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-xl border p-3">
                    <div className="space-y-1">
                      <FormLabel>Active</FormLabel>
                      <FormDescription>
                        Enable or pause the campaign.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isCampEnd"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-xl border p-3">
                    <div className="space-y-1">
                      <FormLabel>Campaign ended</FormLabel>
                      <FormDescription>
                        Mark the campaign period as ended.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                {isEditMode ? "Save changes" : "Create campaign"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
