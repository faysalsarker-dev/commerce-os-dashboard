/* eslint-disable @typescript-eslint/no-explicit-any */
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import type { ControllerRenderProps } from "react-hook-form"
import type { SwitchFieldConfig } from "@/types/form/form.types"

export function SwitchField({
  field,
  config,
}: {
  field: ControllerRenderProps<any, any>
  config: SwitchFieldConfig<any>
}) {
  if (config.kind === "checkbox") {
    return (
      <Checkbox
        checked={!!field.value}
        onCheckedChange={field.onChange}
        disabled={config.disabled}
      />
    )
  }
  return (
    <Switch
      checked={!!field.value}
      onCheckedChange={field.onChange}
      disabled={config.disabled}
    />
  )
}
