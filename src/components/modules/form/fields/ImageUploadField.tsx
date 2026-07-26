/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useState } from "react"
import { useDropzone, type FileRejection } from "react-dropzone"
import { X, ImagePlus } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ControllerRenderProps } from "react-hook-form"
import type {
  ImageUploadFieldConfig,
  ImageValue,
  ExistingImage,
} from "@/types/form/form.types"

function isExistingImage(value: ImageValue): value is ExistingImage {
  return !(value instanceof File) && typeof value === "object" && "url" in value
}

function previewUrl(value: ImageValue): string {
  return isExistingImage(value) ? value.url : URL.createObjectURL(value)
}

/**
 * Handles BOTH local Files (freshly picked, not yet uploaded) and ExistingImage
 * (already-saved Cloudinary URLs) in the same array. Upload to Cloudinary only
 * happens on form submit, via Multer on the backend — this component just
 * collects Files and hands them to react-hook-form like any other field value.
 */
export function ImageUploadField({
  field,
  config,
}: {
  field: ControllerRenderProps<any, any>
  config: ImageUploadFieldConfig<any>
}) {
  const values = useMemo<ImageValue[]>(() => {
    if (Array.isArray(field.value)) return field.value
    return field.value ? [field.value] : []
  }, [field.value])
  const [error, setError] = useState<string | null>(null)

  // revoke local object URLs on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      values.forEach((v) => {
        if (v instanceof File) URL.revokeObjectURL(previewUrl(v))
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onDrop = useCallback(
    (accepted: File[], rejected: FileRejection[]) => {
      setError(null)

      if (rejected.length > 0) {
        setError(
          rejected[0]?.errors?.[0]?.message ?? "Some files were rejected"
        )
      }

      const maxFiles = config.maxFiles ?? Infinity
      const room = maxFiles - values.length
      const toAdd = accepted.slice(0, Math.max(room, 0))

      if (accepted.length > toAdd.length) {
        setError(`You can upload up to ${maxFiles} image(s) total`)
      }

      field.onChange(
        config.multiple ? [...values, ...toAdd] : toAdd.slice(0, 1)
      )
    },
    [values, config, field]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: config.multiple ?? false,
    maxSize: (config.maxSizeMb ?? 5) * 1024 * 1024,
    accept: config.accept
      ? Object.fromEntries(config.accept.map((type) => [type, [] as string[]]))
      : { "image/*": [] },
    disabled: config.disabled,
  })

  const removeAt = (index: number) => {
    const next = [...values]
    const [removed] = next.splice(index, 1)
    if (removed instanceof File) URL.revokeObjectURL(previewUrl(removed))
    field.onChange(next)
  }

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25",
          config.disabled && "pointer-events-none opacity-50"
        )}
      >
        <input {...getInputProps()} />
        <ImagePlus className="mb-2 h-6 w-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {isDragActive
            ? "Drop images here"
            : "Drag & drop, or click to browse"}
        </p>
        {config.maxFiles && (
          <p className="mt-1 text-xs text-muted-foreground">
            Up to {config.maxFiles} image(s), max {config.maxSizeMb ?? 5}MB each
          </p>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {values.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {values.map((value, index) => (
            <div
              key={
                isExistingImage(value) ? value.url : `${value.name}-${index}`
              }
              className="group relative aspect-square overflow-hidden rounded-md border"
            >
              <img
                src={previewUrl(value)}
                alt=""
                className="h-full w-full object-cover"
              />
              {index === 0 && (
                <span className="absolute top-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                  Cover
                </span>
              )}
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
              {!isExistingImage(value) && (
                <span className="absolute bottom-1 left-1 rounded bg-amber-500/90 px-1.5 py-0.5 text-[10px] text-white">
                  New
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
