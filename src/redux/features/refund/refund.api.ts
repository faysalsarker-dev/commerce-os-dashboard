import { baseApi } from "@/redux/baseApi";
import type {
  CreateRefundPayload,
  Refund,
  RefundFilters,
} from "@/types/data-types/refund/refund.types";
import type { ApiResponse } from "@/types/shared";

const BASE_URL = "/refund";

export const refundApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Process / Create a Refund
     */
    createRefund: builder.mutation<
      ApiResponse<Refund>,
      CreateRefundPayload
    >({
      query: (data) => ({
        url: BASE_URL,
        method: "POST",
        data,
      }),
      invalidatesTags: [
        { type: "REFUND", id: "LIST" },
        { type: "SALES", id: "LIST" },
        { type: "PRODUCT", id: "LIST" },
      ],
    }),

    /**
     * Get All Refunds List with optional filters
     */
    getRefunds: builder.query<
      ApiResponse<Refund[]>,
      RefundFilters | void
    >({
      query: (params) => ({
        url: BASE_URL,
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((refund) => ({
                type: "REFUND" as const,
                id: refund.id,
              })),
              { type: "REFUND" as const, id: "LIST" },
            ]
          : [{ type: "REFUND" as const, id: "LIST" }],
      keepUnusedDataFor: 60 * 5,
    }),

    /**
     * Get Refunds by Sale ID
     */
    getRefundsBySale: builder.query<ApiResponse<Refund[]>, string>({
      query: (saleId) => ({
        url: `${BASE_URL}/sale/${saleId}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((refund) => ({
                type: "REFUND" as const,
                id: refund.id,
              })),
              { type: "REFUND" as const, id: "LIST" },
            ]
          : [{ type: "REFUND" as const, id: "LIST" }],
      keepUnusedDataFor: 60 * 5,
    }),

    /**
     * Get Refund details by ID
     */
    getRefund: builder.query<ApiResponse<Refund>, string>({
      query: (id) => ({
        url: `${BASE_URL}/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "REFUND", id }],
      keepUnusedDataFor: 60 * 5,
    }),

    /**
     * Delete Refund record by ID
     */
    deleteRefund: builder.mutation<ApiResponse<Refund>, string>({
      query: (id) => ({
        url: `${BASE_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "REFUND", id },
        { type: "REFUND", id: "LIST" },
        { type: "SALES", id: "LIST" },
        { type: "PRODUCT", id: "LIST" },
      ],
    }),
  }),
});

export const {
  // Create / Process
  useCreateRefundMutation,

  // Get List
  useGetRefundsQuery,
  useLazyGetRefundsQuery,

  // Get By Sale
  useGetRefundsBySaleQuery,
  useLazyGetRefundsBySaleQuery,

  // Get One
  useGetRefundQuery,
  useLazyGetRefundQuery,

  // Delete
  useDeleteRefundMutation,
} = refundApi;
