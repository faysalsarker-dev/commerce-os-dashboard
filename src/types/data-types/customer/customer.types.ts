/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Customer {
  id: string;
  name: string;
  phone: string | null;
  totalDue: number;
  totalOrders: number;
  totalSpent: number;
  createdAt?: string;
  updatedAt?: string;
  sales?: any[];
}

export interface CreateCustomerPayload {
  name: string;
  phone?: string | null;
}

export interface UpdateCustomerPayload {
  name?: string;
  phone?: string | null;
}

export interface CustomerFormValues {
  name: string;
  phone?: string;
}

export interface CustomerFilters {
  searchTerm?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CustomerOption {
  value: string;
  label: string;
}

export interface PaginatedCustomerResponse {
  data: Customer[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CustomerResponse {
  success: boolean;
  message: string;
  data: Customer;
}

export interface CustomersResponse {
  success: boolean;
  message: string;
  data: Customer[];
}
