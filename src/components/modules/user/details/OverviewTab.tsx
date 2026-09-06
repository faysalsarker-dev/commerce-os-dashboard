import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  CalendarDays,
  Clock,
  ShieldAlert,
  MapPin,
  IdCard,
  Eye,
  EyeOff,
  Copy,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoRow, EmptyState } from "@/components/modules/user";
import { formatDate, formatRelativeTime, maskNid } from "@/lib/format";
import type { User } from "@/types/data-types/user/user.type";
import { cn } from "@/lib/utils";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function SectionCard({
  title,
  icon: Icon,
  action,
  children,
  className,
}: {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      variants={item}
      className={cn(
        "rounded-2xl border border-border/40 bg-card p-5 shadow-sm transition-colors hover:border-border/60",
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon && (
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-3.5 w-3.5" />
            </span>
          )}
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            {title}
          </h2>
        </div>
        {action}
      </div>
      <div className="space-y-1">{children}</div>
    </motion.section>
  );
}

interface OverviewTabProps {
  user: User;
  onCopy: (text: string, label: string) => void;
  copiedKey: string | null;
  onEdit: () => void;
}

export function OverviewTab({ user, onCopy, copiedKey, onEdit }: OverviewTabProps) {
  const [showNid, setShowNid] = useState(false);
  const detail = user.employeeDetail;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-4 lg:grid-cols-2"
    >
      {/* Contact Information */}
      <SectionCard
        title="Contact Information"
        icon={Mail}
        action={
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs gap-1 cursor-pointer"
            onClick={onEdit}
          >
            <Pencil className="h-3 w-3" /> Edit
          </Button>
        }
      >
        <InfoRow
          icon={Mail}
          label="Email Address"
          value={
            <div className="flex items-center justify-between gap-2">
              <span className="truncate">{user.email}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-lg shrink-0 cursor-pointer"
                onClick={() => onCopy(user.email, "Email")}
                title="Copy Email"
              >
                {copiedKey === "Email" ? (
                  <span className="text-emerald-500"><Copy className="h-3.5 w-3.5" /></span>
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          }
        />
        <InfoRow
          icon={Phone}
          label="Phone Number"
          value={
            user.phone ? (
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono">{user.phone}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-lg shrink-0 cursor-pointer"
                  onClick={() => onCopy(user.phone!, "Phone")}
                  title="Copy Phone"
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : (
              <span className="text-muted-foreground/60 italic">Not provided</span>
            )
          }
        />
        <InfoRow
          icon={CalendarDays}
          label="Member Since"
          value={formatDate(user.createdAt)}
        />
        <InfoRow
          icon={Clock}
          label="Last Active"
          value={
            user.isOnline ? (
              <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Online now
              </span>
            ) : (
              formatRelativeTime(user.lastSeenAt)
            )
          }
        />
      </SectionCard>

      {/* Emergency Contact */}
      <SectionCard title="Emergency Contact" icon={ShieldAlert}>
        {detail?.emergencyContact ? (
          <>
            <InfoRow
              icon={ShieldAlert}
              label="Emergency Contact"
              value={
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold">{detail.emergencyContact}</span>
                  <a
                    href={`tel:${detail.emergencyContact}`}
                    className="inline-flex h-7 items-center gap-1 rounded-lg border border-border px-2 text-xs font-medium text-primary hover:bg-accent transition-colors"
                  >
                    <Phone className="h-3 w-3" /> Call
                  </a>
                </div>
              }
            />
            <p className="px-3 pt-2 text-xs text-muted-foreground/70">
              Keep this contact up-to-date for urgent notifications and medical emergencies.
            </p>
          </>
        ) : (
          <EmptyState
            icon={ShieldAlert}
            title="No emergency contact"
            description="Add an emergency contact so the HR team can reach someone quickly."
            actionLabel="Edit details"
            onAction={onEdit}
          />
        )}
      </SectionCard>

      {/* Address */}
      <SectionCard title="Address & Location" icon={MapPin}>
        <InfoRow
          icon={MapPin}
          label="Residential Address"
          value={
            detail?.address ? (
              <span>{detail.address}</span>
            ) : (
              <span className="text-muted-foreground/60 italic">Not provided</span>
            )
          }
        />
      </SectionCard>

      {/* Identity & Verification */}
      <SectionCard title="Identity & Verification" icon={IdCard}>
        <InfoRow
          icon={IdCard}
          label="National ID (NID)"
          value={
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono tracking-wider text-foreground">
                {showNid
                  ? detail?.nidNumber ?? "Not provided"
                  : maskNid(detail?.nidNumber)}
              </span>
              <div className="flex items-center gap-1">
                {detail?.nidNumber && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-lg cursor-pointer"
                    title="Copy NID"
                    onClick={() => onCopy(detail.nidNumber!, "NID Number")}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-lg cursor-pointer"
                  aria-label={showNid ? "Hide NID" : "Show NID"}
                  onClick={() => setShowNid((v) => !v)}
                >
                  {showNid ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            </div>
          }
        />
        {detail?.birthCertificateNumber && (
          <InfoRow
            icon={IdCard}
            label="Birth Certificate"
            value={
              <span className="font-mono tracking-wider text-foreground">
                {detail.birthCertificateNumber}
              </span>
            }
          />
        )}
      </SectionCard>
    </motion.div>
  );
}

export default OverviewTab;
