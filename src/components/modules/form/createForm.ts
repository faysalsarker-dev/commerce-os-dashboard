import type { FieldValues, Path } from "react-hook-form"
import type {
  EntityFormConfig,
  FieldConfig,
  FieldConfigInput,
} from "@/types/form/form.types"

/**
 * Fluent builder for form configs — same pattern as your column-builder.
 * Usage:
 *   const productFormConfig = createForm<ProductFormValues>()
 *     .field("name", { kind: "text", label: "Name", required: true })
 *     .field("costPrice", { kind: "number", label: "Cost Price", prefix: "৳" })
 *     .build();
 */
export function createForm<T extends FieldValues>() {
  const fields: EntityFormConfig<T> = []

  const builder = {
    field<K extends Path<T>>(name: K, config: FieldConfigInput<T>) {
      fields.push({ name, ...config } as FieldConfig<T>)
      return builder
    },
    build(): EntityFormConfig<T> {
      return fields
    },
  }

  return builder
}
