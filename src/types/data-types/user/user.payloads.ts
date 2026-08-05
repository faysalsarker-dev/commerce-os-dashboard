import type { EmployeeStatus, Role } from "../enums";

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: Role;
  phone?: string;
  status?: EmployeeStatus;
  image?: string;
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
