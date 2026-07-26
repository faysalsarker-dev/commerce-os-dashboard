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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useNavigate } from "react-router"
import { EntityFormField } from "./EntityFormField"
import type { EntityFormConfig } from "@/types/form/form.types"

interface EntityFormPageProps<TValues extends FieldValues, TResult> {
  title: string
  description?: string
  schema: z.ZodType<TValues>
  config: EntityFormConfig<TValues>
  defaultValues?: DefaultValues<TValues>
  onSubmit: (data: TValues) => Promise<TResult>
  /** where to navigate after a successful submit — receives the mutation result */
  onSuccessNavigate?: (result: TResult) => string
  submitLabel?: string
  backTo?: string
}

/**
 * Page-layout twin of EntityFormDialog — same schema/config contract, but
 * rendered as a full page (Card + back button) instead of a modal. Use this
 * for "create" flows that deserve their own route (e.g. /products/new)
 * rather than a dialog, while still reusing every field component/validation
 * rule from the same engine.
 */
export function EntityFormPage<TValues extends FieldValues, TResult>({
  title,
  description,
  schema,
  config,
  defaultValues,
  onSubmit,
  onSuccessNavigate,
  submitLabel = "Create",
  backTo,
}: EntityFormPageProps<TValues, TResult>) {
  const navigate = useNavigate()

  const form = useForm<TValues>({
    resolver: zodResolver(schema as never) as Resolver<TValues>,
    defaultValues,
  })

  const watchedValues = useWatch({ control: form.control }) as Partial<TValues>

  const handleSubmit = async (data: TValues) => {
    try {
      const result = await onSubmit(data)
      toast.success(`${title} saved successfully`)
      if (onSuccessNavigate) navigate(onSuccessNavigate(result))
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong"
      toast.error(message)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-6">
      {backTo && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(backTo)}
          className="-ml-2"
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Button>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
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

              <div className="flex justify-end gap-2 border-t pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
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
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
