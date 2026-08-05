import { baseApi } from "@/redux/baseApi"

import type {
  CreateProductPayload,
  CreateProductVariantPayload,
  CreateStockMovementPayload,
  DeleteProductPayload,
  Product,
  ProductColor,
  ProductQueryParams,
  ProductVariant,
  StockMovement,
  UpdateProductPayload,
  UpdateProductVariantPayload,
} from "@/types/data-types/product/product.types"

import type { ApiResponse } from "@/types/shared"

const PRODUCT_BASE = "/product"
const COLOR_BASE = "/product/color"
const VARIANT_BASE = "/product/variant"

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // =====================================================
    // Product
    // =====================================================

    createProduct: builder.mutation<ApiResponse<Product>, CreateProductPayload>(
      {
        query: (data) => ({
          url: PRODUCT_BASE,
          method: "POST",
          data,
        }),
        invalidatesTags: [{ type: "PRODUCT", id: "LIST" }],
      }
    ),

    getProducts: builder.query<
      ApiResponse<Product[]>,
      ProductQueryParams | void
    >({
      query: (params) => ({
        url: PRODUCT_BASE,
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((product) => ({
                type: "PRODUCT" as const,
                id: product.id,
              })),
              { type: "PRODUCT" as const, id: "LIST" },
            ]
          : [{ type: "PRODUCT" as const, id: "LIST" }],
      keepUnusedDataFor: 60 * 5,
    }),

    getProduct: builder.query<ApiResponse<Product>, string>({
      query: (id) => ({
        url: `${PRODUCT_BASE}/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "PRODUCT", id }],
      keepUnusedDataFor: 60 * 5,
    }),

    updateProduct: builder.mutation<
      ApiResponse<Product>,
      { id: string; data: UpdateProductPayload }
    >({
      query: ({ id, data }) => ({
        url: `${PRODUCT_BASE}/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "PRODUCT", id },
        { type: "PRODUCT", id: "LIST" },
      ],
    }),

    deleteProduct: builder.mutation<ApiResponse<null>, DeleteProductPayload>({
      query: ({ id }) => ({
        url: `${PRODUCT_BASE}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "PRODUCT", id },
        { type: "PRODUCT", id: "LIST" },
      ],
    }),

    // =====================================================
    // Product Color
    // =====================================================

    createProductColor: builder.mutation<
      ApiResponse<ProductColor>,
      {
        productId?: string
        data: FormData | Record<string, unknown>
      } | FormData | Record<string, unknown>
    >({
      query: (payload) => {
        const data = "data" in (payload as any) ? (payload as any).data : payload
        return {
          url: COLOR_BASE,
          method: "POST",
          data,
        }
      },
      invalidatesTags: (_, __, payload) => [
        { type: "PRODUCT", id: (payload as any)?.productId || "LIST" },
        { type: "PRODUCT", id: "LIST" },
      ],
    }),

    updateProductColor: builder.mutation<
      ApiResponse<ProductColor>,
      {
        id: string
        productId?: string
        data: FormData | Record<string, unknown>
      }
    >({
      query: ({ id, data }) => ({
        url: `${COLOR_BASE}/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_, __, { productId }) => [
        { type: "PRODUCT", id: productId || "LIST" },
        { type: "PRODUCT", id: "LIST" },
      ],
    }),

    deleteProductColor: builder.mutation<
      ApiResponse<null>,
      { id: string; productId?: string }
    >({
      query: ({ id }) => ({
        url: `${COLOR_BASE}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, { productId }) => [
        { type: "PRODUCT", id: productId || "LIST" },
        { type: "PRODUCT", id: "LIST" },
      ],
    }),

    // =====================================================
    // Product Variant
    // =====================================================

    createProductVariant: builder.mutation<
      ApiResponse<ProductVariant>,
      {
        productColorId?: string
        productId?: string
        data: CreateProductVariantPayload
      } | CreateProductVariantPayload
    >({
      query: (payload) => {
        const data = "data" in (payload as any) ? (payload as any).data : payload
        return {
          url: VARIANT_BASE,
          method: "POST",
          data,
        }
      },
      invalidatesTags: (_, __, payload) => [
        { type: "PRODUCT", id: (payload as any)?.productId || "LIST" },
        { type: "PRODUCT", id: "LIST" },
      ],
    }),

    updateProductVariant: builder.mutation<
      ApiResponse<ProductVariant>,
      { id: string; productId: string; data: UpdateProductVariantPayload }
    >({
      query: ({ id, data }) => ({
        url: `${VARIANT_BASE}/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_, __, { productId }) => [
        { type: "PRODUCT", id: productId },
      ],
    }),

    deleteProductVariant: builder.mutation<
      ApiResponse<null>,
      { id: string; productId: string }
    >({
      query: ({ id }) => ({
        url: `${VARIANT_BASE}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, { productId }) => [
        { type: "PRODUCT", id: productId },
      ],
    }),

    // =====================================================
    // Stock Movement
    // =====================================================

    createStockMovement: builder.mutation<
      ApiResponse<StockMovement>,
      {
        variantId: string
        productId: string
        data: CreateStockMovementPayload
      }
    >({
      query: ({ variantId, data }) => ({
        url: `${VARIANT_BASE}/${variantId}/stock-movements`,
        method: "POST",
        data,
      }),
      invalidatesTags: (_, __, { productId }) => [
        { type: "PRODUCT", id: productId },
      ],
    }),
  }),
})

export const {
  useCreateProductMutation,

  useGetProductsQuery,
  useLazyGetProductsQuery,

  useGetProductQuery,
  useLazyGetProductQuery,

  useUpdateProductMutation,
  useDeleteProductMutation,

  useCreateProductColorMutation,
  useUpdateProductColorMutation,
  useDeleteProductColorMutation,

  useCreateProductVariantMutation,
  useUpdateProductVariantMutation,
  useDeleteProductVariantMutation,

  useCreateStockMovementMutation,
} = productApi
