import { motion } from "framer-motion";
import {
  Briefcase,
  Wallet,
  CalendarDays,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { InfoRow, StatusBadge, EmptyState } from "@/components/modules/user";
import { formatDate, formatTenure, formatCurrency } from "@/lib/format";
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
  children,
  className,
}: {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
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
      <div className="mb-4 flex items-center gap-2">
        {Icon && (
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-3.5 w-3.5" />
          </span>
        )}
        <h2 className="text-sm font-semibold tracking-tight text-foreground">
          {title}
        </h2>
      </div>
      <div className="space-y-1">{children}</div>
    </motion.section>
  );
}

const ROLE_DESCRIPTIONS: Record<string, string> = {
  SUPER_ADMIN: "Full unrestricted platform administrator access",
  ADMIN: "Store and inventory management, user & order oversight",
  MANAGER: "Operational manager with sales, product, and counter control",
  MARKETER: "Marketing campaigns, discounts, promotions and growth analytics",
  SALESMAN: "Counter checkout, sales records, billing, and customer orders",
};

interface EmploymentTabProps {
  user: User;
  onEdit: () => void;
}

export function EmploymentTab({ user, onEdit }: EmploymentTabProps) {
  const detail = user.employeeDetail;

  if (!detail) {
    return (
      <div className="lg:col-span-2">
        <EmptyState
          icon={Briefcase}
          title="No employee details on file"
          description="This user has no employment record yet."
          actionLabel="Edit details"
          onAction={onEdit}
        />
      </div>
    );
  }

  const timelineSteps = [
    {
      label: "Joined the organization",
      date: detail.joinDate,
      desc: `Assigned as ${detail.designation ?? "team member"}`,
      active: true,
    },
    {
      label: "Employee record verified",
      date: detail.createdAt,
      desc: "HR and identification records documented",
      active: true,
    },
    {
      label: "Details last synced",
      date: detail.updatedAt,
      desc: "Profile or employment terms updated",
      active: true,
    },
    {
      label: `Current status: ${user.status.replace(/_/g, " ")}`,
      date: user.updatedAt,
      desc: `Operating as active member under ${user.role.replace(/_/g, " ")}`,
      active: user.status === "ACTIVE",
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-4 lg:grid-cols-2"
    >
      {/* Employment Details */}
      <SectionCard title="Employment Details" icon={Briefcase}>
        <InfoRow
          icon={Briefcase}
          label="Designation"
          value={detail.designation ?? "—"}
        />
        <InfoRow
          icon={Wallet}
          label="Base Salary"
          value={
            <span className="font-semibold text-foreground">
              {formatCurrency(detail.baseSalary)}
            </span>
          }
        />
        <InfoRow
          icon={CalendarDays}
          label="Official Join Date"
          value={formatDate(detail.joinDate)}
        />
        <InfoRow
          icon={Clock}
          label="Tenure at Company"
          value={
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-primary/8 text-primary text-xs font-semibold">
              {formatTenure(detail.joinDate)}
            </span>
          }
        />
      </SectionCard>

      {/* Role & Access */}
      <SectionCard title="Role & System Access" icon={ShieldCheck}>
        <div className="rounded-xl border border-primary/15 bg-gradient-to-br from-primary/5 to-transparent p-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-semibold text-foreground text-sm">
                {user.role.replace(/_/g, " ")}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {ROLE_DESCRIPTIONS[user.role] ?? "Standard platform permissions."}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-0 divide-y divide-border/40">
          <div className="flex items-center justify-between py-2.5 text-xs">
            <span className="text-muted-foreground">Account Status</span>
            <StatusBadge value={user.status} />
          </div>
          <div className="flex items-center justify-between py-2.5 text-xs">
            <span className="text-muted-foreground">User Role</span>
            <span className="font-semibold">{user.role.replace(/_/g, " ")}</span>
          </div>
          <div className="flex items-center justify-between py-2.5 text-xs">
            <span className="text-muted-foreground">Profile Created</span>
            <span className="font-medium">{formatDate(user.createdAt)}</span>
          </div>
        </div>
      </SectionCard>

      {/* Timeline */}
      <SectionCard title="Status Timeline" icon={Clock} className="lg:col-span-2">
        <ol className="relative space-y-6 pl-6 pt-2">
          {/* Vertical Line */}
          <div className="absolute left-[11px] top-4 bottom-4 w-px bg-gradient-to-b from-primary/60 via-border to-border/30" />

          {timelineSteps.map((step, idx) => (
            <li key={idx} className="relative pl-4">
              {/* Dot */}
              <span
                className={cn(
                  "absolute -left-[13px] top-1 h-3 w-3 rounded-full ring-4 ring-card",
                  step.active
                    ? "bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb,99,102,241),0.3)]"
                    : "bg-muted-foreground/40"
                )}
              />
              <p className="text-sm font-semibold text-foreground">
                {step.label}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatDate(step.date)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground/70">
                {step.desc}
              </p>
            </li>
          ))}
        </ol>
      </SectionCard>
    </motion.div>
  );
}

export default EmploymentTab;
