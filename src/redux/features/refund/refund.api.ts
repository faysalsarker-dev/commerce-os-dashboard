import { baseApi } from "@/redux/baseApi";
import type {
  CreateRefundPayload,
  CreateRefundResponse,
  CreateExchangePayload,
  Exchange,
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
      ApiResponse<CreateRefundResponse>,
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
        { type: "ORDER" },
        { type: "EXCHANGE" },
        { type: "CAMPAIGN", id: "REPORT" },
      ],
    }),

    createExchange: builder.mutation<ApiResponse<Exchange>, CreateExchangePayload>({
      query: (data) => ({
        url: `${BASE_URL}/exchange`,
        method: "POST",
        data,
      }),
      invalidatesTags: (_result, error, { saleId }) => error ? [] : [
        { type: "REFUND", id: "LIST" },
        { type: "SALES", id: saleId },
        { type: "SALES", id: "LIST" },
        { type: "PRODUCT", id: "LIST" },
        { type: "ORDER" },
        { type: "EXCHANGE" },
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

    getExchangesBySale: builder.query<ApiResponse<Exchange[]>, string>({
      query: (saleId) => ({
        url: `${BASE_URL}/sale/${saleId}/exchanges`,
        method: "GET",
      }),
      providesTags: (result, _error, saleId) => [
        ...(result?.data ?? []).map((exchange) => ({
          type: "EXCHANGE" as const,
          id: exchange.id,
        })),
        { type: "EXCHANGE" as const, id: `SALE-${saleId}-EXCHANGES` },
      ],
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

  }),
});

export const {
  // Create / Process
  useCreateRefundMutation,
  useCreateExchangeMutation,

  // Get List
  useGetRefundsQuery,
  useLazyGetRefundsQuery,

  // Get By Sale
  useGetRefundsBySaleQuery,
  useLazyGetRefundsBySaleQuery,
  useGetExchangesBySaleQuery,
  useLazyGetExchangesBySaleQuery,

  // Get One
  useGetRefundQuery,
  useLazyGetRefundQuery,

} = refundApi;
