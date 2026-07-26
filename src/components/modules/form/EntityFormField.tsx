import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form"
import type {
  Control,
  ControllerRenderProps,
  FieldValues,
  Path,
} from "react-hook-form"
import type { FieldConfig } from "@/types/form/form.types"
import { cn } from "@/lib/utils"
import { TextField } from "./fields/TextField"
import { NumberField } from "./fields/NumberField"
import { SwitchField } from "./fields/SwitchField"
import { SelectField } from "./fields/SelectField"
import { RelationField } from "./fields/RelationField"
import { ColorField } from "./fields/ColorField"
import { ImageUploadField } from "./fields/ImageUploadField"

function renderInput<T extends FieldValues>(
  field: ControllerRenderProps<T, Path<T>>,
  config: FieldConfig<T>
) {
  switch (config.kind) {
    case "text":
    case "textarea":
    case "password":
    case "date":
      return <TextField field={field} config={config} />
    case "number":
      return <NumberField field={field} config={config} />
    case "switch":
    case "checkbox":
      return <SwitchField field={field} config={config} />
    case "select":
    case "multiselect":
    case "radio-group":
      return <SelectField field={field} config={config} />
    case "relation":
      return <RelationField field={field} config={config} />
    case "color":
      return <ColorField field={field} config={config} />
    case "image-upload":
      return <ImageUploadField field={field} config={config} />
  }
}

/**
 * Wraps shadcn's FormField/FormItem/FormMessage ONCE, generically.
 * Delegates the actual input rendering to field-registry by `kind`.
 * Every form built on this engine gets consistent labels, errors, and spacing for free.
 */
export function EntityFormField<T extends FieldValues>({
  control,
  config,
  watchedValues,
}: {
  control: Control<T>
  config: FieldConfig<T>
  watchedValues: Partial<T>
}) {
  if (config.condition && !config.condition(watchedValues)) {
    return null
  }

  const isCheckboxLike = config.kind === "switch" || config.kind === "checkbox"

  return (
    <FormField
      control={control}
      name={config.name}
      render={({ field }) => (
        <FormItem
          className={cn(
            config.colSpan === 2 && "sm:col-span-2",
            config.colSpan === 3 && "sm:col-span-3",
            isCheckboxLike &&
              "flex flex-row items-center justify-between rounded-lg border p-3"
          )}
        >
          <div className={isCheckboxLike ? "space-y-0.5" : "space-y-2"}>
            <FormLabel>{config.label}</FormLabel>
            {config.description && (
              <FormDescription>{config.description}</FormDescription>
            )}
          </div>
          <FormControl>{renderInput(field, config)}</FormControl>
          {!isCheckboxLike && <FormMessage />}
        </FormItem>
      )}
    />
  )
}
