import type { Category } from "@/types/data-types/category/category.types"

// ---- Enums ----
export type StockMovementType =
  "IN" | "OUT" | "ADJUSTMENT" | "RETURN" | "DAMAGE"



export interface Product {
  id: string
  name: string
  description: string | null
  categoryId: string | null
  category?: Category | null
  costPrice: number
  sellingPrice: number
  colors: ProductColor[]
  createdAt: string
  updatedAt: string
}

export interface ProductColor {
  id: string
  productId: string
  colorName: string
  colorHex: string | null
  images: string[]
  variants: ProductVariant[]
  createdAt: string
}

export interface ProductVariant {
  id: string
  productColorId: string
  size: string
  sku: string
  stockQty: number
  costPriceOverride: number | null
  sellingPriceOverride: number | null
  qrCode: string
  createdAt: string
  updatedAt: string
}

export interface StockMovement {
  id: string
  variantId: string
  type: StockMovementType
  quantity: number
  reason: string | null
  createdAt: string
}

// ---- Form-only (draft) types, before submission ----
export interface VariantDraft {
  localId: string
  size: string
  sku: string
  stockQty: number
  costPriceOverride: number | null
  sellingPriceOverride: number | null
}

export interface ColorDraft {
  localId: string
  colorName: string
  colorHex: string
  images: string[] // object URLs, local preview only
  variants: VariantDraft[]
}

export interface ProductFormState {
  name: string
  description: string
  categoryId: string
  costPrice: string // string while typing, parsed to number on submit
  sellingPrice: string
  colors: ColorDraft[]
}

export interface CreateProductPayload {
  name: string
  description?: string
  categoryId?: string | null
  costPrice: number
  sellingPrice: number

  colors?: {
    colorName: string
    colorHex?: string | null
    images: string[]

    variants: {
      size: string
      sku: string
      stockQty: number
      costPriceOverride?: number | null
      sellingPriceOverride?: number | null
    }[]
  }[]
}

// =====================================
// Query Params
// =====================================

export interface ProductQueryParams {
  page?: number
  limit?: number
  search?: string
  status?: "active" | "draft" | "archived"
  categoryId?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export type UpdateProductPayload = Partial<CreateProductPayload>

export interface DeleteProductPayload {
  id: string
}

export interface CreateProductColorPayload {
  colorName: string
  colorHex?: string | null
  images: (File | { url: string })[]
}

export type UpdateProductColorPayload = Partial<CreateProductColorPayload>

export interface CreateProductVariantPayload {
  size: string
  sku: string
  stockQty: number
  costPriceOverride?: number | null
  sellingPriceOverride?: number | null
}

export type UpdateProductVariantPayload = Partial<CreateProductVariantPayload>

export interface CreateStockMovementPayload {
  type: StockMovementType
  quantity: number
  reason?: string
}
