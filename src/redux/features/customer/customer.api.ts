import { baseApi } from "@/redux/baseApi";
import type {
  CreateCustomerPayload,
  Customer,
  CustomerFilters,
  UpdateCustomerPayload,
} from "@/types/data-types/customer/customer.types";
import type { ApiResponse } from "@/types/shared";

const BASE_URL = "/customer";

export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Create Customer
     */
    createCustomer: builder.mutation<
      ApiResponse<Customer>,
      CreateCustomerPayload
    >({
      query: (data) => ({
        url: BASE_URL,
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "CUSTOMER", id: "LIST" }],
    }),

    /**
     * Get Customers List with optional filters/search
     */
    getCustomers: builder.query<
      ApiResponse<Customer[]>,
      CustomerFilters | void
    >({
      query: (params) => ({
        url: BASE_URL,
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((customer) => ({
                type: "CUSTOMER" as const,
                id: customer.id,
              })),
              { type: "CUSTOMER" as const, id: "LIST" },
            ]
          : [{ type: "CUSTOMER" as const, id: "LIST" }],
      keepUnusedDataFor: 60 * 5,
    }),

    /**
     * Get Customer By ID
     */
    getCustomer: builder.query<ApiResponse<Customer>, string>({
      query: (id) => ({
        url: `${BASE_URL}/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "CUSTOMER", id }],
      keepUnusedDataFor: 60 * 5,
    }),

    /**
     * Get Customer By Phone Number
     */
    getCustomerByPhone: builder.query<ApiResponse<Customer | null>, string>({
      query: (phone) => ({
        url: `${BASE_URL}/phone/${phone}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data
          ? [{ type: "CUSTOMER", id: result.data.id }]
          : [{ type: "CUSTOMER", id: "LIST" }],
      keepUnusedDataFor: 60 * 5,
    }),

    /**
     * Update Customer By ID
     */
    updateCustomer: builder.mutation<
      ApiResponse<Customer>,
      { id: string; data: UpdateCustomerPayload }
    >({
      query: ({ id, data }) => ({
        url: `${BASE_URL}/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "CUSTOMER", id },
        { type: "CUSTOMER", id: "LIST" },
      ],
    }),

    /**
     * Delete Customer By ID
     */
    deleteCustomer: builder.mutation<ApiResponse<Customer>, string>({
      query: (id) => ({
        url: `${BASE_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "CUSTOMER", id },
        { type: "CUSTOMER", id: "LIST" },
      ],
    }),
  }),
});

export const {
  // Create
  useCreateCustomerMutation,

  // Get All / Search
  useGetCustomersQuery,
  useLazyGetCustomersQuery,

  // Get By ID
  useGetCustomerQuery,
  useLazyGetCustomerQuery,

  // Get By Phone
  useGetCustomerByPhoneQuery,
  useLazyGetCustomerByPhoneQuery,

  // Update
  useUpdateCustomerMutation,

  // Delete
  useDeleteCustomerMutation,
} = customerApi;
