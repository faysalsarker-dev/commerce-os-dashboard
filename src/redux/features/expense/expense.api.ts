import { baseApi } from "@/redux/baseApi";
import type {
  CreateExpensePayload,
  Expense,
  ExpenseFilters,
  UpdateExpensePayload,
} from "@/types/data-types/expense/expense.types";
import type { ApiResponse } from "@/types/shared";

export * from "./expense-category.api";

const BASE_URL = "/expense";

export const expenseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createExpense: builder.mutation<
      ApiResponse<Expense>,
      CreateExpensePayload
    >({
      query: (data) => ({
        url: BASE_URL,
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "EXPENSE", id: "LIST" }],
    }),

    getExpenses: builder.query<
      ApiResponse<Expense[]>,
      ExpenseFilters | void
    >({
      query: (params) => ({
        url: BASE_URL,
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((expense) => ({
                type: "EXPENSE" as const,
                id: expense.id,
              })),
              {
                type: "EXPENSE" as const,
                id: "LIST",
              },
            ]
          : [
              {
                type: "EXPENSE" as const,
                id: "LIST",
              },
            ],
      keepUnusedDataFor: 60 * 5,
    }),

    getExpense: builder.query<ApiResponse<Expense>, string>({
      query: (id) => ({
        url: `${BASE_URL}/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [
        {
          type: "EXPENSE",
          id,
        },
      ],
      keepUnusedDataFor: 60 * 5,
    }),

    updateExpense: builder.mutation<
      ApiResponse<Expense>,
      {
        id: string;
        data: UpdateExpensePayload;
      }
    >({
      query: ({ id, data }) => ({
        url: `${BASE_URL}/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [
        {
          type: "EXPENSE",
          id,
        },
        {
          type: "EXPENSE",
          id: "LIST",
        },
      ],
    }),

    deleteExpense: builder.mutation<ApiResponse<Expense>, string>({
      query: (id) => ({
        url: `${BASE_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        {
          type: "EXPENSE",
          id,
        },
        {
          type: "EXPENSE",
          id: "LIST",
        },
      ],
    }),
  }),
});

export const {
  // Create
  useCreateExpenseMutation,

  // Get All
  useGetExpensesQuery,
  useLazyGetExpensesQuery,

  // Get One
  useGetExpenseQuery,
  useLazyGetExpenseQuery,

  // Update
  useUpdateExpenseMutation,

  // Delete
  useDeleteExpenseMutation,
} = expenseApi;

