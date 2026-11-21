import { baseApi } from "@/redux/baseApi"
import type {
  CheckoutPayload,
  CheckoutResponse,
  SalesHistoryParams,
  SaleByInvoice,
  SalesHistoryItem,
  ScannedProduct,
  ScanProductPayload,
} from "@/types/data-types/sales/sales.types"
import type { ApiResponse } from "@/types/shared"

const BASE_URL = "/sales"

export const salesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Scan Product
     * Look up item details during checkout by product code/barcode
     */
    scanProduct: builder.mutation<
      ApiResponse<ScannedProduct>,
      ScanProductPayload
    >({
      query: (data) => ({
        url: `${BASE_URL}/scan`,
        method: "POST",
        data,
      }),
    }),

    /**
     * Complete Checkout
     * Complete a sale transaction
     */
    checkout: builder.mutation<ApiResponse<CheckoutResponse>, CheckoutPayload>({
      query: (data) => ({
        url: `${BASE_URL}/checkout`,
        method: "POST",
        data,
      }),
      invalidatesTags: [
        { type: "SALES", id: "LIST" },
        { type: "PRODUCT", id: "LIST" },
        { type: "CAMPAIGN", id: "REPORT" },
      ],
    }),

    getSaleByInvoice: builder.query<ApiResponse<SaleByInvoice>, string>({
      query: (invoiceNumber) => ({
        url: `${BASE_URL}/invoice/${invoiceNumber}`,
        method: "GET",
      }),
      providesTags: ["SALES" as const, { type: "SALES" as const, id: "LIST" }],
    }),
    /**
     * Sales History
     * View sales history for reporting or reconciliation
     */
    getSalesHistory: builder.query<
      ApiResponse<SalesHistoryItem[]>,
      SalesHistoryParams | void
    >({
      query: (params) => ({
        url: `${BASE_URL}/history`,
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((sale) => ({
                type: "SALES" as const,
                id: sale.saleId,
              })),
              { type: "SALES" as const, id: "LIST" },
            ]
          : [{ type: "SALES" as const, id: "LIST" }],
      keepUnusedDataFor: 60 * 5,
    }),
  }),
})

export const {
  useScanProductMutation,
  useCheckoutMutation,
  useGetSalesHistoryQuery,
  useLazyGetSalesHistoryQuery,
  useGetSaleByInvoiceQuery,
  useLazyGetSaleByInvoiceQuery,
} = salesApi
