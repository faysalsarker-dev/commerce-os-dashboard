import type { UseFormRegister, FieldErrors } from "react-hook-form"
import { motion } from "framer-motion"
import { IdCard, Phone, AlertTriangle, AlertCircle } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import type { UserFormValues } from "@/types/validations/user/user.validation"
import { cn } from "@/lib/utils"

interface VerificationSectionProps {
  register: UseFormRegister<UserFormValues>
  errors: FieldErrors<UserFormValues>
}

export function VerificationSection({ register, errors }: VerificationSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="rounded-xl border bg-card p-6 shadow-xs space-y-5"
    >
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <IdCard className="size-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Verification & Contact Details
            </h2>
            <p className="text-xs text-muted-foreground">
              Legal identity proof, emergency contacts, and residential address
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="text-[11px] font-normal">
          Step 5 of 5
        </Badge>
      </div>

      {/* Requirement alert banner */}
      <div className="flex items-start gap-3 p-3.5 rounded-lg border border-amber-500/30 bg-amber-500/5 text-amber-900 dark:text-amber-200">
        <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
        <div className="text-xs space-y-0.5">
          <p className="font-medium text-amber-700 dark:text-amber-300">
            Compliance Requirement
          </p>
          <p className="text-muted-foreground">
            At least one legal government document number is required: either a <strong>National ID (NID)</strong> or a <strong>Birth Certificate Number</strong>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* NID Number */}
        <div className="space-y-1.5">
          <Label htmlFor="nidNumber" className="text-sm font-medium">
            National ID (NID) Number
          </Label>
          <div className="relative">
            <IdCard className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              id="nidNumber"
              placeholder="e.g. 1992261234567890"
              className={cn(
                "pl-9",
                errors.nidNumber && "border-destructive focus-visible:ring-destructive"
              )}
              {...register("nidNumber")}
            />
          </div>
          {errors.nidNumber && (
            <p className="text-xs text-destructive flex items-center gap-1 mt-1">
              <AlertCircle className="size-3" /> {errors.nidNumber.message}
            </p>
          )}
        </div>

        {/* Birth Certificate Number */}
        <div className="space-y-1.5">
          <Label htmlFor="birthCertificateNumber" className="text-sm font-medium">
            Birth Certificate Number
          </Label>
          <div className="relative">
            <IdCard className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              id="birthCertificateNumber"
              placeholder="e.g. 2001261234567890"
              className="pl-9"
              {...register("birthCertificateNumber")}
            />
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="emergencyContact" className="text-sm font-medium">
            Emergency Contact Number
          </Label>
          <div className="relative">
            <Phone className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              id="emergencyContact"
              placeholder="e.g. +880 1812-000000 (Spouse / Guardian)"
              className="pl-9"
              {...register("emergencyContact")}
            />
          </div>
        </div>

        {/* Residential Address */}
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="address" className="text-sm font-medium">
            Residential Address
          </Label>
          <div className="relative">
            <Textarea
              id="address"
              rows={3}
              placeholder="House, Street, Area, City, Postal Code"
              className="resize-none"
              {...register("address")}
            />
          </div>
        </div>
      </div>
    </motion.section>
  )
}
