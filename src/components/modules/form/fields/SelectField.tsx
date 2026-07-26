/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  RadioGroup,
  RadioGroupItem,
  Label,
  Badge,
} from "@/components/ui"
import { X } from "lucide-react"
import type { ControllerRenderProps } from "react-hook-form"
import type { SelectFieldConfig } from "@/types/form/form.types"

/** Handles static select, multiselect (as removable badges), and radio-group — options passed inline in config */
export function SelectField({
  field,
  config,
}: {
  field: ControllerRenderProps<any, any>
  config: SelectFieldConfig<any>
}) {
  if (config.kind === "radio-group") {
    return (
      <RadioGroup
        value={field.value}
        onValueChange={field.onChange}
        className="flex flex-wrap gap-4"
      >
        {config.options.map((opt) => (
          <div key={opt.value} className="flex items-center gap-2">
            <RadioGroupItem
              value={opt.value}
              id={`${String(config.name)}-${opt.value}`}
            />
            <Label htmlFor={`${String(config.name)}-${opt.value}`}>
              {opt.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    )
  }

  if (config.kind === "multiselect") {
    const selected: string[] = field.value ?? []
    const toggle = (value: string | null) => {
      if (!value) return
      field.onChange(
        selected.includes(value)
          ? selected.filter((v) => v !== value)
          : [...selected, value]
      )
    }

    return (
      <div className="space-y-2">
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {selected.map((val) => {
              const opt = config.options.find((o) => o.value === val)
              return (
                <Badge key={val} variant="secondary" className="gap-1">
                  {opt?.label ?? val}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => toggle(val)}
                  />
                </Badge>
              )
            })}
          </div>
        )}
        <Select onValueChange={toggle} disabled={config.disabled}>
          <SelectTrigger>
            <SelectValue placeholder={config.placeholder ?? "Add..."} />
          </SelectTrigger>
          <SelectContent>
            {config.options
              .filter((o) => !selected.includes(o.value))
              .map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  return (
    <Select
      onValueChange={(value) => field.onChange(value ?? undefined)}
      value={field.value ?? null}
      disabled={config.disabled}
    >
      <SelectTrigger>
        <SelectValue placeholder={config.placeholder ?? "Select..."} />
      </SelectTrigger>
      <SelectContent>
        {config.options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
