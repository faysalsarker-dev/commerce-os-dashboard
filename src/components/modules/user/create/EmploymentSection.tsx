import type { UseFormRegister, FieldErrors } from "react-hook-form"
import { motion } from "framer-motion"
import { Briefcase, Calendar, AlertCircle } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import type { UserFormValues } from "@/types/validations/user/user.validation"
import { cn } from "@/lib/utils"

interface EmploymentSectionProps {
  register: UseFormRegister<UserFormValues>
  errors: FieldErrors<UserFormValues>
}

export function EmploymentSection({ register, errors }: EmploymentSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.26 }}
      className="rounded-xl border bg-card p-6 shadow-xs space-y-5"
    >
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Briefcase className="size-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Employment & Salary
            </h2>
            <p className="text-xs text-muted-foreground">
              Job title, contractual starting date, and monthly base wage
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="text-[11px] font-normal">
          Step 4 of 5
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Designation */}
        <div className="space-y-1.5 sm:col-span-3">
          <Label htmlFor="designation" className="text-sm font-medium">
            Designation / Title
          </Label>
          <div className="relative">
            <Briefcase className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              id="designation"
              placeholder="e.g. Senior Sales Executive"
              className="pl-9"
              {...register("designation")}
            />
          </div>
          <p className="text-[11px] text-muted-foreground">
            Official job title shown across receipts, sales logs, and employee badges.
          </p>
        </div>

        {/* Join Date */}
        <div className="space-y-1.5 sm:col-span-1">
          <Label htmlFor="joinDate" className="text-sm font-medium">
            Join Date <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Calendar className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              id="joinDate"
              type="date"
              className={cn(
                "pl-9",
                errors.joinDate && "border-destructive focus-visible:ring-destructive"
              )}
              {...register("joinDate")}
            />
          </div>
          {errors.joinDate && (
            <p className="text-xs text-destructive flex items-center gap-1 mt-1">
              <AlertCircle className="size-3" /> {errors.joinDate.message}
            </p>
          )}
        </div>

        {/* Base Salary */}
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="baseSalary" className="text-sm font-medium">
            Monthly Base Salary (BDT) <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-sm text-muted-foreground">
              ৳
            </span>
            <Input
              id="baseSalary"
              type="number"
              min={10}
              step={100}
              placeholder="e.g. 25000"
              className={cn(
                "pl-8 font-mono",
                errors.baseSalary && "border-destructive focus-visible:ring-destructive"
              )}
              {...register("baseSalary", { valueAsNumber: true })}
            />
          </div>
          {errors.baseSalary && (
            <p className="text-xs text-destructive flex items-center gap-1 mt-1">
              <AlertCircle className="size-3" /> {errors.baseSalary.message}
            </p>
          )}
        </div>
      </div>
    </motion.section>
  )
}
