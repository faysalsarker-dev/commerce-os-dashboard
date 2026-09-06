import { useState } from "react"
import type { UseFormRegister, FieldErrors } from "react-hook-form"
import { motion } from "framer-motion"
import { Lock, Eye, EyeOff, Check, AlertCircle } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import type { UserFormValues } from "@/types/validations/user/user.validation"
import { cn } from "@/lib/utils"

interface SecuritySectionProps {
  register: UseFormRegister<UserFormValues>
  errors: FieldErrors<UserFormValues>
  passwordValue?: string
  confirmPasswordValue?: string
}

export function SecuritySection({
  register,
  errors,
  passwordValue,
  confirmPasswordValue,
}: SecuritySectionProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="rounded-xl border bg-card p-6 shadow-xs space-y-5"
    >
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Lock className="size-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Account Security
            </h2>
            <p className="text-xs text-muted-foreground">
              Set up initial login password (minimum 6 characters)
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="text-[11px] font-normal">
          Step 2 of 5
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium">
              Password <span className="text-destructive">*</span>
            </Label>
            {passwordValue && (
              <span
                className={cn(
                  "text-[11px] font-medium",
                  passwordValue.length >= 8
                    ? "text-emerald-500"
                    : passwordValue.length >= 6
                    ? "text-amber-500"
                    : "text-destructive"
                )}
              >
                {passwordValue.length >= 8
                  ? "Strong"
                  : passwordValue.length >= 6
                  ? "Moderate"
                  : "Too Short"}
              </span>
            )}
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 6 characters"
              className={cn(
                "pr-10",
                errors.password && "border-destructive focus-visible:ring-destructive"
              )}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive flex items-center gap-1 mt-1">
              <AlertCircle className="size-3" /> {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password <span className="text-destructive">*</span>
            </Label>
            {confirmPasswordValue && passwordValue && (
              <span
                className={cn(
                  "text-[11px] font-medium flex items-center gap-1",
                  passwordValue === confirmPasswordValue
                    ? "text-emerald-500"
                    : "text-destructive"
                )}
              >
                {passwordValue === confirmPasswordValue ? (
                  <>
                    <Check className="size-3" /> Matched
                  </>
                ) : (
                  "Mismatch"
                )}
              </span>
            )}
          </div>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter password"
              className={cn(
                "pr-10",
                errors.confirmPassword && "border-destructive focus-visible:ring-destructive"
              )}
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-destructive flex items-center gap-1 mt-1">
              <AlertCircle className="size-3" /> {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>
    </motion.section>
  )
}
