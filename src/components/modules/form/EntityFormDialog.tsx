import { useEffect } from "react"
import {
  useForm,
  useWatch,
  type DefaultValues,
  type FieldValues,
  type Resolver,
} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { EntityFormConfig } from "@/types/form/form.types"
import { EntityFormField } from "./EntityFormField"
import type { ApiError } from "@/types/shared"

interface EntityFormDialogProps<TValues extends FieldValues, TResult> {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  schema: z.ZodType<TValues>
  config: EntityFormConfig<TValues>
  defaultValues?: DefaultValues<TValues>
  onSubmit: (data: TValues) => Promise<TResult>
  submitLabel?: string
}

/**
 * The one dialog every create/update flow in the app uses.
 * It doesn't know or care whether it's creating or updating — the caller
 * decides that by what it passes into `defaultValues` and `onSubmit`.
 */
export function EntityFormDialog<TValues extends FieldValues, TResult>({
  open,
  onOpenChange,
  title,
  description,
  schema,
  config,
  defaultValues,
  onSubmit,
  submitLabel = "Save",
}: EntityFormDialogProps<TValues, TResult>) {
  const form = useForm<TValues>({
    resolver: zodResolver(schema as never) as Resolver<TValues>,
    defaultValues,
  })

  // reset whenever the dialog reopens with fresh defaultValues (e.g. user clicks "Edit" on a different row)
  useEffect(() => {
    if (open) {
      form.reset(defaultValues)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultValues])

  const watchedValues = useWatch({ control: form.control }) as Partial<TValues>

  const handleSubmit = async (data: TValues) => {
    try {
      await onSubmit(data)
      toast.success(`${title} saved successfully`)
      onOpenChange(false)
      form.reset()
    } catch (err) {
      const error = err as ApiError
      toast.error(error?.data?.message ?? "Something went wrong")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {config.map((fieldConfig) => (
                <EntityFormField
                  key={String(fieldConfig.name)}
                  control={form.control}
                  config={fieldConfig}
                  watchedValues={watchedValues}
                />
              ))}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {submitLabel}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
