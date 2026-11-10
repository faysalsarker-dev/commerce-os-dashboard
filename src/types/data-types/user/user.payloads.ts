import type { EmployeeStatus, Role, SalaryStatus } from "../enums";
import type { EmployeeDetail } from "./employee-detail.type";
import type { SalaryRecord } from "./salary-record.type";

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: Role;
  phone?: string;
  status?: EmployeeStatus;
  image?: string | File;
  employeeDetail: CreateEmployeeDetailPayload;
}

export interface CreateEmployeeDetailPayload {
  designation?: string;
  joinDate: string;
  baseSalary: number;
  nidNumber?: string;
  birthCertificateNumber?: string;
  address?: string;
  emergencyContact?: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  role?: Role;
  status?: EmployeeStatus;
  phone?: string;
  image?: string;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: Role;
  status?: EmployeeStatus;
}

export interface CreateSalaryRecordPayload {
  userId: string;
  month: number;
  year: number;
  baseSalary?: number;
  bonus?: number;
  deduction?: number;
  status?: SalaryStatus;
  notes?: string | null;
}

export interface UpdateSalaryRecordPayload {
  month?: number;
  year?: number;
  baseSalary?: number;
  bonus?: number;
  deduction?: number;
  status?: SalaryStatus;
  notes?: string | null;
}

export interface IncreaseSalaryPayload {
  userId: string;
  amount: number;
}

export interface SalaryQueryParams {
  month?: number | "all";
  year?: number;
  userId?: string;
  status?: SalaryStatus;
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?:
    | "name"
    | "baseSalary"
    | "bonus"
    | "deduction"
    | "netPay"
    | "status"
    | "month"
    | "year"
    | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface UserSalaryHistory {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  status: EmployeeStatus;
  employeeDetail: (EmployeeDetail & { baseSalary: number }) | null;
  salaryRecords: SalaryRecord[];
}

export interface IncreasedSalaryResponse extends EmployeeDetail {
  baseSalary: number;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: Role;
    status: EmployeeStatus;
  };
}
