import type { UseFormSetValue, FieldErrors } from "react-hook-form"
import { motion } from "framer-motion"
import { ShieldCheck, Check, AlertCircle } from "lucide-react"

import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import type { UserFormValues } from "@/types/validations/user/user.validation"
import { EmployeeStatus, Role } from "@/types/data-types/enums"
import { CREATABLE_ROLES_META, STATUS_ITEMS } from "./constants"
import { cn } from "@/lib/utils"

interface RoleAccessSectionProps {
  currentRole?: Role
  currentStatus?: EmployeeStatus
  setValue: UseFormSetValue<UserFormValues>
  errors: FieldErrors<UserFormValues>
}

export function RoleAccessSection({
  currentRole,
  currentStatus,
  setValue,
  errors,
}: RoleAccessSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
      className="rounded-xl border bg-card p-6 shadow-xs space-y-5"
    >
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <ShieldCheck className="size-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Role & System Access
            </h2>
            <p className="text-xs text-muted-foreground">
              Assign staff privileges and operating scope (Super Admin cannot be created here)
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="text-[11px] font-normal">
          Step 3 of 5
        </Badge>
      </div>

      {/* Role Cards Grid */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Select Role <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CREATABLE_ROLES_META.map((meta) => {
            const isSelected = currentRole === meta.role
            return (
              <button
                key={meta.role}
                type="button"
                onClick={() => setValue("role", meta.role, { shouldValidate: true, shouldDirty: true })}
                className={cn(
                  "relative text-left p-4 rounded-xl border-2 transition-all flex flex-col justify-between gap-2.5 group cursor-pointer",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary/20"
                    : "border-border/70 hover:border-border hover:bg-muted/30"
                )}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-foreground">
                      {meta.title}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn("text-[10px] px-1.5 py-0 h-4 border", meta.color)}
                    >
                      {meta.badge}
                    </Badge>
                  </div>
                  <div
                    className={cn(
                      "size-4 rounded-full border flex items-center justify-center transition-colors shrink-0",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/40 group-hover:border-muted-foreground"
                    )}
                  >
                    {isSelected && <Check className="size-2.5 stroke-[3]" />}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {meta.description}
                </p>
              </button>
            )
          })}
        </div>
        {errors.role && (
          <p className="text-xs text-destructive flex items-center gap-1 mt-1">
            <AlertCircle className="size-3" /> {errors.role.message}
          </p>
        )}
      </div>

      {/* Employment Status Selector */}
      <div className="space-y-2 pt-2 border-t">
        <Label className="text-sm font-medium">
          Employment Status <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-3 gap-2.5">
          {STATUS_ITEMS.map((st) => {
            const isSelected = currentStatus === st.value
            return (
              <button
                key={st.value}
                type="button"
                onClick={() => setValue("status", st.value, { shouldValidate: true, shouldDirty: true })}
                className={cn(
                  "flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-all cursor-pointer",
                  isSelected
                    ? "border-primary bg-primary/10 text-foreground font-semibold shadow-2xs"
                    : "border-border/70 hover:bg-muted/50 text-muted-foreground"
                )}
              >
                <span className={cn("size-2 rounded-full", st.dotClass)} />
                {st.label}
              </button>
            )
          })}
        </div>
      </div>
    </motion.section>
  )
}
