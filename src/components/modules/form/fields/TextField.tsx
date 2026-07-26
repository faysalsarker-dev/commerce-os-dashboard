/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { ControllerRenderProps } from "react-hook-form"
import type { TextFieldConfig } from "@/types/form/form.types"

export function TextField({
  field,
  config,
}: {
  field: ControllerRenderProps<any, any>
  config: TextFieldConfig<any>
}) {
  if (config.kind === "textarea") {
    return (
      <Textarea
        placeholder={config.placeholder}
        disabled={config.disabled}
        {...field}
        value={field.value ?? ""}
      />
    )
  }

  return (
    <Input
      type={
        config.kind === "password"
          ? "password"
          : config.kind === "date"
            ? "date"
            : "text"
      }
      placeholder={config.placeholder}
      disabled={config.disabled}
      {...field}
      value={field.value ?? ""}
    />
  )
}
