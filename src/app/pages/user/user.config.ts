import { search, select } from "@/components/modules/filter"
import { column, createColumns } from "@/components/modules/table/column-builder"
import { EmployeeStatus, Role } from "@/types/data-types/enums"
import type { User } from "@/types/data-types/user/user.type"
import { createForm } from "@/components/modules/form/createForm"
import type { UserFormValues } from "@/types/validations/user/user.validation"

export const USER_PAGE_CONFIG = {
  title: "Users",
  description: "View and manage your team members.",
  createDialog: {
    title: "Add User",
    description: "Create an account for a team member.",
    submitLabel: "Create User",
  },
} as const

const ROLE_OPTIONS = Object.values(Role).map((role) => ({
  label: role.replaceAll("_", " "),
  value: role,
}))

const STATUS_OPTIONS = Object.values(EmployeeStatus).map((status) => ({
  label: status.replaceAll("_", " "),
  value: status,
}))

export const USER_FILTER_CONFIG = [
  search({
    name: "search",
    label: "Search",
    placeholder: "Search by name or email...",
  }),
  select({
    name: "role",
    label: "Role",
    placeholder: "All roles",
    options: ROLE_OPTIONS,
  }),
  select({
    name: "status",
    label: "Status",
    placeholder: "All statuses",
    options: STATUS_OPTIONS,
  }),
]

export const userFormConfig = createForm<UserFormValues>()
  .field("image", {
    kind: "image-upload",
    label: "Profile Image",
    description: "Optional. Upload one square JPG, PNG, or WebP image up to 5MB.",
    maxFiles: 1,
    maxSizeMb: 5,
    accept: ["image/jpeg", "image/png", "image/webp"],
    hideUploaderWhenMaxed: true,
    colSpan: 2,
  })
  .field("name", {
    kind: "text",
    label: "Full Name",
    placeholder: "e.g. Ayesha Rahman",
    colSpan: 2,
  })
  .field("email", {
    kind: "text",
    label: "Email Address",
    placeholder: "ayesha@example.com",
    colSpan: 2,
  })
  .field("phone", {
    kind: "text",
    label: "Phone Number",
    placeholder: "+880 1XXX-XXXXXX",
  })
  .field("role", {
    kind: "select",
    label: "Role",
    options: ROLE_OPTIONS,
  })
  .field("status", {
    kind: "select",
    label: "Status",
    options: STATUS_OPTIONS,
  })
  .field("password", {
    kind: "password",
    label: "Password",
    placeholder: "At least 6 characters",
  })
  .field("confirmPassword", {
    kind: "password",
    label: "Confirm Password",
    placeholder: "Re-enter password",
  })
  .field("designation", {
    kind: "text",
    label: "Designation",
    placeholder: "e.g. Senior Offline Salesman",
    colSpan: 2,
  })
  .field("joinDate", {
    kind: "date",
    label: "Join Date",
  })
  .field("baseSalary", {
    kind: "number",
    label: "Base Salary",
    min: 0,
    step: 0.01,
    prefix: "৳",
  })
  .field("nidNumber", {
    kind: "text",
    label: "NID Number",
    placeholder: "National ID number",
    description: "Provide this or a birth certificate number.",
  })
  .field("birthCertificateNumber", {
    kind: "text",
    label: "Birth Certificate Number",
    placeholder: "Birth certificate number",
    description: "Provide this or an NID number.",
  })
  .field("emergencyContact", {
    kind: "text",
    label: "Emergency Contact",
    placeholder: "+880 1XXX-XXXXXX",
  })
  .field("address", {
    kind: "textarea",
    label: "Address",
    placeholder: "Current address",
    colSpan: 2,
  })
  .build()

const humanize = (value: string | null | undefined) =>
  value ? value.replaceAll("_", " ") : "-"

export const USER_TABLE_COLUMNS = createColumns<User>({
  resource: "users",
  columns: [
    column.image("image", {
      label: "Photo",
      size: 40,
      rounded: "full",
    }),
    column("name"),
    column("email"),
    column("phone"),
    column("role", { formatter: (value) => humanize(value as string) }),
    column.status("status", {
      formatter: (value) => humanize(value as string),
    }),
    column.date("createdAt", { label: "Joined" }),
  ],
})
