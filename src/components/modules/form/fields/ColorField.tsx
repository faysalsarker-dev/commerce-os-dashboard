/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from "@/components/ui/input"
import type { ColorFieldConfig } from "@/types/form/form.types"
import type { ControllerRenderProps } from "react-hook-form"

export function ColorField({
  field,
  config,
}: {
  field: ControllerRenderProps<any, any>
  config: ColorFieldConfig<any>
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        className="h-9 w-10 cursor-pointer rounded border border-input bg-transparent p-1"
        disabled={config.disabled}
        value={field.value || "#000000"}
        onChange={(e) => field.onChange(e.target.value)}
      />
      <Input
        placeholder="#000000"
        disabled={config.disabled}
        {...field}
        value={field.value ?? ""}
      />
    </div>
  )
}
