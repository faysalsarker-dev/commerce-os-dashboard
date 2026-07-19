import type { EmployeeStatus, Role } from "../enums";
import type { EmployeeDetail } from "./employee-detail.type";
import type { SalaryRecord } from "./salary-record.type";


export interface User {
  id: string;

  name: string;
  email: string;
  phone: string | null;

  role: Role;
  status: EmployeeStatus;

  image: string | null;

  isOnline: boolean;
  lastSeenAt: string | null;

  employeeDetail?: EmployeeDetail | null;
  salaryRecords?: SalaryRecord[];

  createdAt: string;
  updatedAt: string;
}