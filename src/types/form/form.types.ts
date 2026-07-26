import type { FieldValues, Path } from "react-hook-form"

export type FieldKind =
  | "text"
  | "textarea"
  | "number"
  | "password"
  | "select"
  | "multiselect"
  | "switch"
  | "checkbox"
  | "radio-group"
  | "color"
  | "date"
  | "relation"
  | "image-upload"

export interface BaseFieldConfig<T extends FieldValues> {
  name: Path<T>
  label: string
  kind: FieldKind
  description?: string
  placeholder?: string
  colSpan?: 1 | 2 | 3
  disabled?: boolean
  /** Show this field only when the predicate returns true — evaluated against live form values */
  condition?: (values: Partial<T>) => boolean
}

export interface TextFieldConfig<
  T extends FieldValues,
> extends BaseFieldConfig<T> {
  kind: "text" | "password" | "textarea" | "date"
}

export interface NumberFieldConfig<
  T extends FieldValues,
> extends BaseFieldConfig<T> {
  kind: "number"
  min?: number
  max?: number
  step?: number
  prefix?: string
  suffix?: string
}

export interface SwitchFieldConfig<
  T extends FieldValues,
> extends BaseFieldConfig<T> {
  kind: "switch" | "checkbox"
}

export interface SelectOption {
  label: string
  value: string
}

export interface SelectFieldConfig<
  T extends FieldValues,
> extends BaseFieldConfig<T> {
  kind: "select" | "multiselect" | "radio-group"
  options: SelectOption[]
}

/** Dynamic/async select — fetches its own options via an RTK Query hook (isLoading/isError handled internally) */
export interface RelationFieldConfig<
  T extends FieldValues,
> extends BaseFieldConfig<T> {
  kind: "relation"
  /** A query hook, such as an RTK Query `useGetCategoriesQuery` hook. */
  useQueryHook: RelationQueryHook
  queryArgs?: unknown
  labelKey: string
  valueKey: string
}

/** Bivariant on purpose: query hooks may accept `void`, filters, or no argument. */
export type RelationQueryHook = {
  bivarianceHack(args?: unknown): RelationQueryResult<unknown>
}["bivarianceHack"]

export interface RelationQueryResult<T> {
  data?: T
  isLoading?: boolean
  isError?: boolean
  isFetching?: boolean
  refetch?: () => unknown
}

export interface ColorFieldConfig<
  T extends FieldValues,
> extends BaseFieldConfig<T> {
  kind: "color"
}

export interface ImageUploadFieldConfig<
  T extends FieldValues,
> extends BaseFieldConfig<T> {
  kind: "image-upload"
  multiple?: boolean
  maxFiles?: number
  maxSizeMb?: number
  /** e.g. ["image/png", "image/jpeg"] */
  accept?: string[]
}

export type FieldConfig<T extends FieldValues> =
  | TextFieldConfig<T>
  | NumberFieldConfig<T>
  | SwitchFieldConfig<T>
  | SelectFieldConfig<T>
  | RelationFieldConfig<T>
  | ColorFieldConfig<T>
  | ImageUploadFieldConfig<T>

export type EntityFormConfig<T extends FieldValues> = FieldConfig<T>[]

/** The config accepted by `createForm().field()` before the field name is added. */
export type FieldConfigInput<T extends FieldValues> =
  FieldConfig<T> extends infer Config
    ? Config extends FieldConfig<T>
      ? Omit<Config, "name">
      : never
    : never

/** An image already saved on the backend (Cloudinary URL) vs a freshly-picked local File */
export interface ExistingImage {
  url: string
  id?: string
}

export type ImageValue = File | ExistingImage
