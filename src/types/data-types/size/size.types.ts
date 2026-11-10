export interface Size {
  id: string;
  size: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSizePayload {
  size: string;
}

export interface UpdateSizePayload {
  size?: string;
}

export interface SizeFormValues {
  size: string;
}

export interface SizeFilters {
  searchTerm?: string;
  search?: string;
  sortBy?: "size" | "createdAt" | "updatedAt" | string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface SizeOption {
  value: string;
  label: string;
}

export interface PaginatedSizeResponse {
  data: Size[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SizeResponse {
  success: boolean;
  message: string;
  data: Size;
}

export interface SizesResponse {
  success: boolean;
  message: string;
  data: Size[];
}
