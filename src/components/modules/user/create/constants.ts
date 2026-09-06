import { EmployeeStatus, Role } from "@/types/data-types/enums"

export interface RoleMetaItem {
  role: Role
  title: string
  badge: string
  description: string
  color: string
}

export const CREATABLE_ROLES_META: RoleMetaItem[] = [
  {
    role: Role.ADMIN,
    title: "Admin",
    badge: "Operations",
    description: "System administration, store operations, reports, and staff management.",
    color: "from-indigo-500/15 to-blue-500/15 border-indigo-500/30 text-indigo-600 dark:text-indigo-400",
  },
  {
    role: Role.MANAGER,
    title: "Manager",
    badge: "Management",
    description: "Oversees daily sales, product inventory, shift records, and operational staff.",
    color: "from-sky-500/15 to-cyan-500/15 border-sky-500/30 text-sky-600 dark:text-sky-400",
  },
  {
    role: Role.MARKETER,
    title: "Marketer",
    badge: "Marketing",
    description: "Oversees promotional campaigns, discounts, product visibility, and customer reach.",
    color: "from-purple-500/15 to-pink-500/15 border-purple-500/30 text-purple-600 dark:text-purple-400",
  },
  {
    role: Role.SALESMAN,
    title: "Salesman",
    badge: "POS & Billing",
    description: "Handles sell counter, POS registers, customer billing, receipts, and returns.",
    color: "from-emerald-500/15 to-teal-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
  },
]

export const STATUS_ITEMS = [
  {
    value: EmployeeStatus.ACTIVE,
    label: "Active",
    badgeClass: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    dotClass: "bg-emerald-500",
  },
  {
    value: EmployeeStatus.INACTIVE,
    label: "Inactive",
    badgeClass: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    dotClass: "bg-amber-500",
  },
  {
    value: EmployeeStatus.TERMINATED,
    label: "Terminated",
    badgeClass: "bg-red-500/10 text-red-600 border-red-500/20",
    dotClass: "bg-red-500",
  },
] as const
