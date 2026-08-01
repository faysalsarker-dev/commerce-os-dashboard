/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import type { FieldValues } from "react-hook-form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
 Form ,Button } from "@/components/ui";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { EntityFormField } from "./EntityFormField";
import type { EntityFormConfig } from "@/types/form/form.types";

interface EntityFormSheetProps<TSchema extends z.ZodType<FieldValues, any, any>> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  schema: TSchema;
  config: EntityFormConfig<z.infer<TSchema>>;
  defaultValues?: Partial<z.infer<TSchema>>;
  onSubmit: (data: z.infer<TSchema>) => Promise<unknown>;
  submitLabel?: string;
  /** shown at the top of the sheet, e.g. "Adding size to: Maroon" — useful when the
   *  parent context (a color, a product) needs to stay visible while filling the form */
  contextLabel?: string;
}

/**
 * Slide-over twin of EntityFormDialog — same schema/config contract, rendered
 * in a Sheet instead of a centered modal. Best for repeated, fast entry against
 * a fixed parent context (e.g. adding several variant sizes to one color in a row),
 * since the trigger point (the color card) stays visible/partially in view.
 */
export function EntityFormSheet<TSchema extends z.ZodType<FieldValues, any, any>>({
  open,
  onOpenChange,
  title,
  description,
  schema,
  config,
  defaultValues,
  onSubmit,
  submitLabel = "Save",
  contextLabel,
}: EntityFormSheetProps<TSchema>) {
  type FormData = z.infer<TSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues: defaultValues as any,
  });

  useEffect(() => {
    if (open) form.reset(defaultValues as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultValues]);

  const watchedValues = form.watch();

  const handleSubmit = async (data: FormData) => {
    try {
      await onSubmit(data);
      toast.success(`${title} saved successfully`);
      onOpenChange(false);
      form.reset();
    } catch (err: any) {
      toast.error(err?.data?.message ?? err?.message ?? "Something went wrong");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {contextLabel && (
            <p className="text-sm font-medium text-primary">{contextLabel}</p>
          )}
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-6 space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {config.map((fieldConfig) => (
                <EntityFormField
                  key={String(fieldConfig.name)}
                  control={form.control}
                  config={fieldConfig}
                  watchedValues={watchedValues}
                />
              ))}
            </div>

            <SheetFooter className="mt-6">
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
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
