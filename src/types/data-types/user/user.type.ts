import type { EmployeeStatus, Role } from "../enums"
import type { EmployeeDetail } from "./employee-detail.type"
import type { SalaryRecord } from "./salary-record.type"

export interface UserSalesSummary {
  totalSales: number
  totalSalesCount: number
  totalPaid: number
  totalDue: number
  totalRefundAmount: number
  totalRefundItems: number
  totalItemsSold: number
}

export interface User {
  id: string

  name: string
  email: string
  phone: string | null

  role: Role
  status: EmployeeStatus

  image: string | null

  isOnline: boolean
  lastSeenAt: string | null

  employeeDetail?: EmployeeDetail | null
  salaryRecords?: SalaryRecord[]
  salesSummary?: UserSalesSummary | null

  createdAt: string
  updatedAt: string
}
