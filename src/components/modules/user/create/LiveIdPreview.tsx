import { useMemo } from "react"
import { motion } from "framer-motion"
import {
  User,
  Mail,
  Phone,
  Calendar,
  BadgeDollarSign,
  IdCard,
  Building2,
  CheckCircle2,
  AlertCircle,
  Shield,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import type { UserFormValues } from "@/types/validations/user/user.validation"
import { CREATABLE_ROLES_META, STATUS_ITEMS } from "./constants"
import { cn } from "@/lib/utils"

interface LiveIdPreviewProps {
  watchedValues: Partial<UserFormValues>
  imagePreview: string | null
}

export function LiveIdPreview({ watchedValues, imagePreview }: LiveIdPreviewProps) {
  const roleMeta = useMemo(() => {
    return (
      CREATABLE_ROLES_META.find((r) => r.role === watchedValues.role) ||
      CREATABLE_ROLES_META[0]
    )
  }, [watchedValues.role])

  const statusMeta = useMemo(() => {
    return (
      STATUS_ITEMS.find((s) => s.value === watchedValues.status) ||
      STATUS_ITEMS[0]
    )
  }, [watchedValues.status])

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl border bg-card shadow-xs overflow-hidden"
    >
      {/* Top Banner Graphic */}
      <div className="relative h-24 bg-gradient-to-r from-primary/80 via-primary to-primary/60 p-3 flex items-start justify-between text-white">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-xs text-[10px] tracking-wider uppercase font-semibold">
          <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live Preview
        </div>
        <Building2 className="size-5 text-white/40" />
      </div>

      {/* Avatar overlapping banner */}
      <div className="px-5 pt-0 pb-5 space-y-4">
        <div className="flex items-end justify-between -mt-10 mb-2">
          <div className="relative size-20 rounded-2xl border-4 border-card bg-muted overflow-hidden shadow-md flex items-center justify-center">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="size-full object-cover"
              />
            ) : (
              <div className="size-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xl">
                {watchedValues.name?.trim() ? (
                  watchedValues.name
                    .trim()
                    .split(" ")
                    .slice(0, 2)
                    .map((w) => w[0]?.toUpperCase())
                    .join("")
                ) : (
                  <User className="size-8 text-muted-foreground/60" />
                )}
              </div>
            )}
          </div>

          <Badge
            variant="outline"
            className={cn(
              "gap-1 py-0.5 text-xs font-medium capitalize",
              statusMeta.badgeClass
            )}
          >
            <span className={cn("size-1.5 rounded-full", statusMeta.dotClass)} />
            {statusMeta.label}
          </Badge>
        </div>

        {/* Identity info */}
        <div className="space-y-1">
          <h3 className="font-bold text-lg text-foreground leading-snug break-words">
            {watchedValues.name?.trim() || "New Team Member"}
          </h3>
          <p className="text-xs font-medium text-muted-foreground">
            {watchedValues.designation?.trim() || "Position / Title not set"}
          </p>
        </div>

        {/* Role pill */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn("text-xs py-0.5 border", roleMeta.color)}>
            <Shield className="size-3 mr-1" />
            {roleMeta.title}
          </Badge>
        </div>

        {/* Divider */}
        <div className="border-t pt-3 space-y-2.5 text-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Mail className="size-3.5 text-muted-foreground/70" /> Email:
            </span>
            <span
              className="font-medium text-foreground truncate max-w-[160px]"
              title={watchedValues.email}
            >
              {watchedValues.email || "—"}
            </span>
          </div>

          <div className="flex items-center justify-between text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Phone className="size-3.5 text-muted-foreground/70" /> Phone:
            </span>
            <span className="font-medium text-foreground">
              {watchedValues.phone || "—"}
            </span>
          </div>

          <div className="flex items-center justify-between text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5 text-muted-foreground/70" /> Joining:
            </span>
            <span className="font-medium text-foreground">
              {watchedValues.joinDate ? watchedValues.joinDate : "—"}
            </span>
          </div>

          <div className="flex items-center justify-between text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <BadgeDollarSign className="size-3.5 text-muted-foreground/70" /> Base Salary:
            </span>
            <span className="font-mono font-semibold text-foreground">
              ৳{(Number(watchedValues.baseSalary) || 0).toLocaleString()} / mo
            </span>
          </div>

          <div className="flex items-center justify-between text-muted-foreground pt-1 border-t">
            <span className="flex items-center gap-1.5">
              <IdCard className="size-3.5 text-muted-foreground/70" /> Verification:
            </span>
            {watchedValues.nidNumber?.trim() || watchedValues.birthCertificateNumber?.trim() ? (
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
                <CheckCircle2 className="size-3" />
                {watchedValues.nidNumber?.trim() ? "NID Provided" : "Birth Cert Provided"}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium text-[11px]">
                <AlertCircle className="size-3" /> Pending ID
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
