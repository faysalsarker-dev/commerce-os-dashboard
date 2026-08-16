export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  image: string | null;
  displayOrder: number;
  createdAt: string; 
  updatedAt: string;
}


export interface CreateCategoryPayload {
  name: string;
  description?: string;
  image?: string;
  isActive?: boolean;
  displayOrder?: number;
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
  image?: string;
  isActive?: boolean;
  displayOrder?: number;
}

export interface CategoryFormValues {
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  displayOrder: number;
}


export interface CategoryFilters {
  search?: string;
  isActive?: boolean;
  sortBy?: "name" | "displayOrder" | "createdAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}


export interface CategoryOption {
  value: string;
  label: string;
}


export interface PaginatedCategoryResponse {
  data: Category[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}


export interface CategoryResponse {
  success: boolean;
  message: string;
  data: Category;
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  data: Category[];
}