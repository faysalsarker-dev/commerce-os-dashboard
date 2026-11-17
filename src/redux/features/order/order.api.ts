import { baseApi } from "@/redux/baseApi";
import type {
  CreateOrderPayload,
  OrderDetail,
  OrderFilters,
  OrderListItem,
  OrderListMeta,
  UpdateOrderPayload,
} from "@/types/data-types/order/order.types";
import type { ApiResponse } from "@/types/shared";

const BASE_URL = "/orders";

type PaginatedOrdersResponse = Omit<ApiResponse<OrderListItem[]>, "meta"> & {
  meta: OrderListMeta;
};

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<ApiResponse<OrderDetail>, CreateOrderPayload>(
      {
        query: (data) => ({
          url: BASE_URL,
          method: "POST",
          data,
        }),
        invalidatesTags: (_result, error, { customerId }) =>
          error
            ? []
            : [
                { type: "ORDER", id: "LIST" },
                { type: "SALES", id: "LIST" },
                { type: "CUSTOMER", id: customerId },
                { type: "CUSTOMER", id: "LIST" },
          ],
      },
    ),

    getOrders: builder.query<PaginatedOrdersResponse, OrderFilters | void>({
      query: (params) => ({
        url: BASE_URL,
        method: "GET",
        params: params || undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((order) => ({
                type: "ORDER" as const,
                id: order.id,
              })),
              { type: "ORDER" as const, id: "LIST" },
            ]
          : [{ type: "ORDER" as const, id: "LIST" }],
      keepUnusedDataFor: 60 * 5,
    }),

    getOrder: builder.query<ApiResponse<OrderDetail>, string>({
      query: (id) => ({
        url: `${BASE_URL}/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "ORDER", id }],
      keepUnusedDataFor: 60 * 5,
    }),

    updateOrder: builder.mutation<
      ApiResponse<OrderDetail>,
      { id: string; data: UpdateOrderPayload }
    >({
      query: ({ id, data }) => ({
        url: `${BASE_URL}/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (result, error, { id }) =>
        error
          ? []
          : [
              { type: "ORDER", id },
              { type: "ORDER", id: "LIST" },
              { type: "SALES", id: "LIST" },
              ...(result?.data
                ? [
                    { type: "CUSTOMER" as const, id: result.data.customerId },
                    { type: "CUSTOMER" as const, id: "LIST" },
                  ]
                : []),
            ],
    }),

    deleteOrder: builder.mutation<ApiResponse<OrderListItem>, string>({
      query: (id) => ({
        url: `${BASE_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) =>
        error
          ? []
          : [
              { type: "ORDER", id },
              { type: "ORDER", id: "LIST" },
              { type: "SALES", id: "LIST" },
              ...(result?.data
                ? [
                    { type: "CUSTOMER" as const, id: result.data.customerId },
                    { type: "CUSTOMER" as const, id: "LIST" },
                  ]
                : []),
            ],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useLazyGetOrdersQuery,
  useGetOrderQuery,
  useLazyGetOrderQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = orderApi;
