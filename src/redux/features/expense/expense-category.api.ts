import { baseApi } from "@/redux/baseApi";
import type {
  CreateExpenseCategoryPayload,
  ExpenseCategory,
  ExpenseCategoryFilters,
  UpdateExpenseCategoryPayload,
} from "@/types/data-types/expense/expense.types";
import type { ApiResponse } from "@/types/shared";

const BASE_URL = "/expense-category";

export const expenseCategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createExpenseCategory: builder.mutation<
      ApiResponse<ExpenseCategory>,
      CreateExpenseCategoryPayload
    >({
      query: (data) => ({
        url: BASE_URL,
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "EXPENSE_CATEGORY", id: "LIST" }],
    }),

    getExpenseCategories: builder.query<
      ApiResponse<ExpenseCategory[]>,
      ExpenseCategoryFilters | void
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
                type: "EXPENSE_CATEGORY" as const,
                id: category.id,
              })),
              {
                type: "EXPENSE_CATEGORY" as const,
                id: "LIST",
              },
            ]
          : [
              {
                type: "EXPENSE_CATEGORY" as const,
                id: "LIST",
              },
            ],
      keepUnusedDataFor: 60 * 5,
    }),

    getExpenseCategory: builder.query<ApiResponse<ExpenseCategory>, string>({
      query: (id) => ({
        url: `${BASE_URL}/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [
        {
          type: "EXPENSE_CATEGORY",
          id,
        },
      ],
      keepUnusedDataFor: 60 * 5,
    }),

    getExpenseCategoriesForSelect: builder.query<
      ApiResponse<ExpenseCategory[]>,
      ExpenseCategoryFilters | void
    >({
      query: (params) => ({
        url: BASE_URL,
        method: "GET",
        params: { limit: 100, isActive: true, ...params },
      }),
      providesTags: [{ type: "EXPENSE_CATEGORY", id: "LIST" }],
      keepUnusedDataFor: 60 * 5,
    }),

    updateExpenseCategory: builder.mutation<
      ApiResponse<ExpenseCategory>,
      {
        id: string;
        data: UpdateExpenseCategoryPayload;
      }
    >({
      query: ({ id, data }) => ({
        url: `${BASE_URL}/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [
        {
          type: "EXPENSE_CATEGORY",
          id,
        },
        {
          type: "EXPENSE_CATEGORY",
          id: "LIST",
        },
      ],
    }),

    deleteExpenseCategory: builder.mutation<
      ApiResponse<ExpenseCategory>,
      string
    >({
      query: (id) => ({
        url: `${BASE_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        {
          type: "EXPENSE_CATEGORY",
          id,
        },
        {
          type: "EXPENSE_CATEGORY",
          id: "LIST",
        },
      ],
    }),
  }),
});

export const {
  // Create
  useCreateExpenseCategoryMutation,

  // Get All
  useGetExpenseCategoriesQuery,
  useLazyGetExpenseCategoriesQuery,
  useGetExpenseCategoriesForSelectQuery,
  useLazyGetExpenseCategoriesForSelectQuery,

  // Get One
  useGetExpenseCategoryQuery,
  useLazyGetExpenseCategoryQuery,

  // Update
  useUpdateExpenseCategoryMutation,

  // Delete
  useDeleteExpenseCategoryMutation,
} = expenseCategoryApi;

