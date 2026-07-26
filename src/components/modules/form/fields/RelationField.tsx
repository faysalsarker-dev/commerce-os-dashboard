/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"
import type { ControllerRenderProps } from "react-hook-form"
import type { RelationFieldConfig } from "@/types/form/form.types"

/**
 * Dynamic/async select — e.g. Category dropdown fed by useGetCategoriesQuery.
 * isLoading / isError / refetch are all handled here, once, so no form ever
 * has to hand-roll loading state for a dropdown again.
 */
export function RelationField({
  field,
  config,
}: {
  field: ControllerRenderProps<any, any>
  config: RelationFieldConfig<any>
}) {
  const { data, isLoading, isError, isFetching, refetch } = config.useQueryHook(
    config.queryArgs
  )

  if (isLoading) {
    return <Skeleton className="h-9 w-full" />
  }

  if (isError) {
    return (
      <div className="flex items-center gap-2 text-sm text-destructive">
        Failed to load options.
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => refetch?.()}
        >
          <RotateCcw className="mr-1 h-3 w-3" /> Retry
        </Button>
      </div>
    )
  }

  const payload = data as { data?: unknown[]; items?: unknown[] } | undefined
  const options: unknown[] = Array.isArray(data)
    ? data
    : (payload?.data ?? payload?.items ?? [])
  const selectedOption = options
    .map((option) => option as Record<string, unknown>)
    .find((option) => String(option[config.valueKey]) === String(field.value))
  const selectedLabel = selectedOption
    ? String(selectedOption[config.labelKey] ?? selectedOption[config.valueKey])
    : undefined

  return (
    <Select
      onValueChange={(value) => field.onChange(value ?? undefined)}
      value={field.value ?? null}
      disabled={config.disabled || isFetching}
    >
      <SelectTrigger>
        <SelectValue
          placeholder={config.placeholder ?? `Select ${config.label}`}
        >
          {selectedLabel}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.length === 0 && (
          <div className="px-2 py-1.5 text-sm text-muted-foreground">
            No options found
          </div>
        )}
        {options.map((option) => {
          const item = option as Record<string, unknown>
          const value = item[config.valueKey]
          return (
            <SelectItem key={String(value)} value={String(value)}>
              {String(item[config.labelKey] ?? value)}
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
