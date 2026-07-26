import { baseApi } from "@/redux/baseApi";
import type { CreateProductPayload, Product, ProductQueryParams, UpdateProductPayload } from "@/types/data-types/product/product.types";

import type { ApiResponse } from "@/types/shared";

const BASE_URL = "/product";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Create Product
     */
    createProduct: builder.mutation<
      ApiResponse<Product>,
      CreateProductPayload
    >({
      query: (data) => ({
        url: BASE_URL,
        method: "POST",
        data,
      }),
      invalidatesTags: [
        { type: "PRODUCT", id: "LIST" },
      ],
    }),

    /**
     * Get Products
     */
    getProducts: builder.query<
      ApiResponse<Product[]>,
      ProductQueryParams | void
    >({
      query: (params) => ({
        url: BASE_URL,
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

    /**
     * Get Single Product
     */
    getProduct: builder.query<ApiResponse<Product>, string>({
      query: (id) => ({
        url: `${BASE_URL}/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "PRODUCT", id }],
      keepUnusedDataFor: 60 * 5,
    }),

    /**
     * Update Product
     */
    updateProduct: builder.mutation<
      ApiResponse<Product>,
      {
        id: string;
        data: UpdateProductPayload;
      }
    >({
      query: ({ id, data }) => ({
        url: `${BASE_URL}/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "PRODUCT", id },
        { type: "PRODUCT", id: "LIST" },
      ],
    }),

    /**
     * Delete Product
     */
    deleteProduct: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `${BASE_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "PRODUCT", id },
        { type: "PRODUCT", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateProductMutation,

  useGetProductsQuery,
  useLazyGetProductsQuery,

  useGetProductQuery,
  useLazyGetProductQuery,

  useUpdateProductMutation,

  useDeleteProductMutation,
} = productApi;