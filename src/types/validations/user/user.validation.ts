import { z } from "zod"
import { EmployeeStatus, Role } from "@/types/data-types/enums"

export const userFormSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters.").max(100),
    email: z.email("Please enter a valid email address."),
    phone: z.string().trim().max(20, "Phone must be 20 characters or fewer.").optional(),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string(),
    role: z.enum(Role),
    status: z.enum(EmployeeStatus),
    image: z.array(z.instanceof(File)).max(1).default([]),
    designation: z.string().trim().max(100).optional(),
    joinDate: z.string().min(1, "Join date is required."),
    baseSalary: z.number().min(10, "Base salary must be at least 10."),
    nidNumber: z.string().trim().max(50).optional(),
    birthCertificateNumber: z.string().trim().max(50).optional(),
    address: z.string().trim().max(500).optional(),
    emergencyContact: z.string().trim().max(30).optional(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })
  .refine(
    (values) =>
      Boolean(
        values.nidNumber?.trim() || values.birthCertificateNumber?.trim()
      ),
    {
      message: "Enter either an NID number or a birth certificate number.",
      path: ["nidNumber"],
    }
  )

export type UserFormValues = z.infer<typeof userFormSchema>

export const USER_FORM_DEFAULT_VALUES: UserFormValues = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  role: Role.OFFLINE_SALESMAN,
  status: EmployeeStatus.ACTIVE,
  image: [],
  designation: "",
  joinDate: "",
  baseSalary: 10,
  nidNumber: "",
  birthCertificateNumber: "",
  address: "",
  emergencyContact: "",
}
