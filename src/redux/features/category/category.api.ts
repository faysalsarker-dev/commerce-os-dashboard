import { baseApi } from "@/redux/baseApi";

import type {
  Category,
  CategoryFilters,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/types/data-types/category/category.types";

import type { ApiResponse } from "@/types/shared";

const BASE_URL = "/category";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation<
      ApiResponse<Category>,
      CreateCategoryPayload
    >({
      query: (data) => ({
        url: BASE_URL,
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "CATEGORY", id: "LIST" }],
    }),

    getCategories: builder.query<
      ApiResponse<Category[]>,
      CategoryFilters | void
    >({
      query: (params) => ({
        url: BASE_URL,
        method: "GET",
        params,
      }),

      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((category) => ({
                type: "CATEGORY" as const,
                id: category.id,
              })),
              {
                type: "CATEGORY" as const,
                id: "LIST",
              },
            ]
          : [
              {
                type: "CATEGORY" as const,
                id: "LIST",
              },
            ],

      keepUnusedDataFor: 60 * 5,
    }),
    getCategory: builder.query<ApiResponse<Category>, string>({
      query: (id) => ({
        url: `${BASE_URL}/${id}`,
        method: "GET",
      }),

      providesTags: (_, __, id) => [
        {
          type: "CATEGORY",
          id,
        },
      ],

      keepUnusedDataFor: 60 * 5,
    }),

        getCategoryForSeletect: builder.query<ApiResponse<Category>, string>({
      query: () => ({
        url: `${BASE_URL}`,
        method: "GET",
      }),

      providesTags:["CATEGORY"],

      keepUnusedDataFor: 60 * 5,
    }),




    updateCategory: builder.mutation<
      ApiResponse<Category>,
      {
        id: string;
        data: UpdateCategoryPayload;
      }
    >({
      query: ({ id, data }) => ({
        url: `${BASE_URL}/${id}`,
        method: "PATCH",
        data,
      }),

      invalidatesTags: (_, __, { id }) => [
        {
          type: "CATEGORY",
          id,
        },
        {
          type: "CATEGORY",
          id: "LIST",
        },
      ],
    }),
    deleteCategory: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `${BASE_URL}/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: (_, __, id) => [
        {
          type: "CATEGORY",
          id,
        },
        {
          type: "CATEGORY",
          id: "LIST",
        },
      ],
    }),
  }),
});

export const {
  // Create
  useCreateCategoryMutation,

  // Get All
  useGetCategoriesQuery,
  useLazyGetCategoriesQuery,
  useGetCategoryForSeletectQuery,

  // Get One
  useGetCategoryQuery,
  useLazyGetCategoryQuery,

  // Update
  useUpdateCategoryMutation,

  // Delete
  useDeleteCategoryMutation,
} = categoryApi;