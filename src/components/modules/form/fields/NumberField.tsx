/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from "@/components/ui/input"
import type { ControllerRenderProps } from "react-hook-form"
import type { NumberFieldConfig } from "@/types/form/form.types"

export function NumberField({
  field,
  config,
}: {
  field: ControllerRenderProps<any, any>
  config: NumberFieldConfig<any>
}) {
  return (
    <div className="relative">
      {config.prefix && (
        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
          {config.prefix}
        </span>
      )}
      <Input
        type="number"
        min={config.min}
        max={config.max}
        step={config.step ?? "any"}
        disabled={config.disabled}
        placeholder={config.placeholder}
        className={config.prefix ? "pl-7" : config.suffix ? "pr-7" : undefined}
        {...field}
        value={field.value ?? ""}
        onChange={(e) => {
          const val = e.target.value
          field.onChange(val === "" ? undefined : Number(val))
        }}
      />
      {config.suffix && (
        <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
          {config.suffix}
        </span>
      )}
    </div>
  )
}
