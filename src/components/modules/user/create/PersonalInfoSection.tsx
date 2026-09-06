import { useState, useRef, useCallback } from "react"
import type { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form"
import { motion } from "framer-motion"
import {
  User,
  Mail,
  Phone,
  UploadCloud,
  X,
  AlertCircle,
} from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { UserFormValues } from "@/types/validations/user/user.validation"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface PersonalInfoSectionProps {
  register: UseFormRegister<UserFormValues>
  errors: FieldErrors<UserFormValues>
  setValue: UseFormSetValue<UserFormValues>
  imagePreview: string | null
  setImagePreview: (url: string | null) => void
}

export function PersonalInfoSection({
  register,
  errors,
  setValue,
  imagePreview,
  setImagePreview,
}: PersonalInfoSectionProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file (JPG, PNG, WebP)")
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image file size must be 5MB or less")
        return
      }
      if (imagePreview) URL.revokeObjectURL(imagePreview)
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
      setValue("image", [file], { shouldValidate: true, shouldDirty: true })
    },
    [imagePreview, setImagePreview, setValue]
  )

  const handleRemoveImage = useCallback(() => {
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImagePreview(null)
    setValue("image", [], { shouldValidate: true, shouldDirty: true })
    if (fileInputRef.current) fileInputRef.current.value = ""
  }, [imagePreview, setImagePreview, setValue])

  const onDropFile = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      if (e.dataTransfer.files?.[0]) {
        handleImageFile(e.dataTransfer.files[0])
      }
    },
    [handleImageFile]
  )

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl border bg-card p-6 shadow-xs space-y-5"
    >
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <User className="size-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Personal Information
            </h2>
            <p className="text-xs text-muted-foreground">
              Basic profile identity and contact information
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="text-[11px] font-normal">
          Step 1 of 5
        </Badge>
      </div>

      {/* Avatar Upload Dropzone */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">
          Profile Photo (Optional)
        </Label>
        <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-lg border border-dashed border-border/80 bg-muted/20">
          <div className="relative size-20 rounded-full border-2 border-border/80 overflow-hidden bg-muted flex items-center justify-center shrink-0 shadow-inner group">
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Avatar preview"
                  className="size-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Remove photo"
                >
                  <X className="size-5" />
                </button>
              </>
            ) : (
              <User className="size-9 text-muted-foreground/60" />
            )}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1.5 w-full">
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragOver(true)
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={onDropFile}
              className={cn(
                "rounded-lg p-3 transition-colors flex flex-col sm:flex-row items-center justify-between gap-3",
                isDragOver ? "bg-primary/10 border-primary" : "bg-card/50"
              )}
            >
              <div>
                <p className="text-xs font-medium text-foreground">
                  Upload profile portrait
                </p>
                <p className="text-[11px] text-muted-foreground">
                  JPG, PNG, or WebP up to 5MB. Recommended 1:1 square.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleImageFile(e.target.files[0])
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs gap-1.5 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadCloud className="size-3.5" />
                  Browse
                </Button>
                {imagePreview && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs text-destructive hover:text-destructive cursor-pointer"
                    onClick={handleRemoveImage}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        {/* Full Name */}
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <User className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              id="name"
              placeholder="e.g. Ayesha Rahman"
              className={cn("pl-9", errors.name && "border-destructive focus-visible:ring-destructive")}
              {...register("name")}
            />
          </div>
          {errors.name && (
            <p className="text-xs text-destructive flex items-center gap-1 mt-1">
              <AlertCircle className="size-3" /> {errors.name.message}
            </p>
          )}
        </div>

        {/* Email Address */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Mail className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              id="email"
              type="email"
              placeholder="ayesha@company.com"
              className={cn("pl-9", errors.email && "border-destructive focus-visible:ring-destructive")}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive flex items-center gap-1 mt-1">
              <AlertCircle className="size-3" /> {errors.email.message}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-sm font-medium">
            Phone Number
          </Label>
          <div className="relative">
            <Phone className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              id="phone"
              placeholder="+880 1712-345678"
              className={cn("pl-9", errors.phone && "border-destructive")}
              {...register("phone")}
            />
          </div>
          {errors.phone && (
            <p className="text-xs text-destructive flex items-center gap-1 mt-1">
              <AlertCircle className="size-3" /> {errors.phone.message}
            </p>
          )}
        </div>
      </div>
    </motion.section>
  )
}
