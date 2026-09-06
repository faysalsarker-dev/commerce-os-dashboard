import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Copy,
  Check,
  Pencil,
  IdCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar, StatusBadge } from "@/components/modules/user";
import { formatDate, formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { User } from "@/types/data-types/user/user.type";
import { useNavigate } from "react-router";

interface ProfileHeroProps {
  user: User;
  copiedKey: string | null;
  onCopy: (text: string, label: string) => void;
  onEdit: () => void;
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function ProfileHero({ user, copiedKey, onCopy, onEdit }: ProfileHeroProps) {
  const detail = user.employeeDetail;
  const navigate = useNavigate();

  return (
    <motion.section
      variants={item}
      className="relative overflow-hidden rounded-3xl border border-border/40 bg-card shadow-sm"
    >
      {/* Gradient Backdrop */}
      <div className="relative h-32 sm:h-36 bg-gradient-to-br from-primary/15 via-primary/8 to-accent/10 dark:from-primary/20 dark:via-background dark:to-accent/8">
        {/* Mesh Texture Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(var(--primary-rgb,99,102,241),0.12)_0%,_transparent_50%),radial-gradient(circle_at_80%_80%,_rgba(var(--primary-rgb,99,102,241),0.06)_0%,_transparent_40%)]" />
        <div className="absolute inset-0 backdrop-blur-[1px]" />

        {/* Online Status Pill */}
        <div className="absolute right-4 top-4 hidden sm:flex items-center gap-2 rounded-full border border-white/20 dark:border-border/40 bg-white/60 dark:bg-background/60 px-3 py-1.5 text-xs backdrop-blur-md shadow-sm">
          <span
            className={cn(
              "size-2 rounded-full",
              user.isOnline
                ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse"
                : "bg-muted-foreground/40"
            )}
          />
          <span className="text-muted-foreground font-medium">
            {user.isOnline
              ? "Active Now"
              : `Last seen ${formatRelativeTime(user.lastSeenAt)}`}
          </span>
        </div>
      </div>

      {/* Profile Content */}
      <div className="flex flex-col gap-5 px-5 pb-6 sm:px-7 sm:pb-7">
        <div className="-mt-14 flex flex-col gap-4 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
          {/* Avatar & Identity */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <UserAvatar
              name={user.name}
              image={user.image}
              isOnline={user.isOnline}
              className="h-24 w-24 rounded-2xl ring-4 ring-card shadow-lg sm:h-28 sm:w-28"
            />

            <div className="min-w-0 space-y-1.5 pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {user.name}
                </h1>
                <StatusBadge value={user.role} />
                <StatusBadge value={user.status} />
              </div>

              <p className="text-sm font-medium text-muted-foreground">
                {detail?.designation ?? "Team Member"}
                {detail?.joinDate && (
                  <span className="font-normal text-muted-foreground/70">
                    {" "}· Joined {formatDate(detail.joinDate)}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:self-end">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl text-xs gap-1.5 cursor-pointer"
              onClick={onEdit}
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit Profile
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl text-xs gap-1.5 cursor-pointer"
              onClick={() => navigate(`/app/users/${user.id}/id-card`)}
            >
              <IdCard className="h-3.5 w-3.5" />
              ID Card
            </Button>
            <a
              href={`mailto:${user.email}`}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-primary px-3 text-xs font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              <Mail className="h-3.5 w-3.5" /> Send Email
            </a>
          </div>
        </div>

        {/* Quick Contact Chips */}
        <div className="flex flex-wrap items-center gap-2 border-t border-border/40 pt-4 text-xs">
          <button
            type="button"
            onClick={() => onCopy(user.email, "Email")}
            className="group inline-flex items-center gap-1.5 rounded-xl border border-border/50 bg-muted/30 px-3 py-1.5 text-muted-foreground transition-all hover:bg-muted/60 hover:text-foreground hover:border-border/80 cursor-pointer"
          >
            <Mail className="h-3.5 w-3.5 text-primary" />
            <span className="truncate max-w-[180px]">{user.email}</span>
            {copiedKey === "Email" ? (
              <Check className="ml-1 h-3 w-3 text-emerald-500" />
            ) : (
              <Copy className="ml-1 h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
            )}
          </button>

          {user.phone ? (
            <a
              href={`tel:${user.phone}`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border/50 bg-muted/30 px-3 py-1.5 text-muted-foreground transition-all hover:bg-muted/60 hover:text-foreground hover:border-border/80"
            >
              <Phone className="h-3.5 w-3.5 text-emerald-500" />
              <span>{user.phone}</span>
            </a>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-border/50 px-3 py-1.5 text-muted-foreground/50">
              <Phone className="h-3.5 w-3.5" /> No phone
            </span>
          )}

          {detail?.address && (
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-border/50 bg-muted/30 px-3 py-1.5 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-amber-500" />
              <span className="max-w-[200px] truncate">{detail.address}</span>
            </span>
          )}

          <span className="inline-flex items-center gap-1.5 rounded-xl border border-border/50 bg-muted/30 px-3 py-1.5 text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5 text-blue-500" />
            <span>Member since {formatDate(user.createdAt)}</span>
          </span>

          <button
            type="button"
            onClick={() => onCopy(user.id, "User ID")}
            className="group ml-auto inline-flex items-center gap-1.5 rounded-xl px-2 py-1 text-[11px] text-muted-foreground/60 hover:text-foreground transition-colors cursor-pointer"
            title="Click to copy User ID"
          >
            <span className="font-mono">ID: {user.id.slice(0, 8)}…</span>
            {copiedKey === "User ID" ? (
              <Check className="h-3 w-3 text-emerald-500" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </button>
        </div>
      </div>
    </motion.section>
  );
}

export default ProfileHero;
