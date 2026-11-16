import { baseApi } from "@/redux/baseApi";
import type {
  CourierAccount,
  CourierAccountListQuery,
  CourierAccountListResponse,
  CreateCourierAccountPayload,
  CreatedCourierAccount,
  TestCourierConnectionPayload,
  TestCourierConnectionResult,
  UpdateCourierAccountPayload,
} from "@/types/data-types/courier-integration/courier-integration.types";
import type { ApiResponse } from "@/types/shared";

const BASE_URL = "/courier-accounts";

export const courierIntegrationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    testCourierConnection: builder.mutation<
      ApiResponse<TestCourierConnectionResult>,
      TestCourierConnectionPayload
    >({
      query: (data) => ({
        url: `${BASE_URL}/test`,
        method: "POST",
        data,
      }),
    }),

    createCourierAccount: builder.mutation<
      ApiResponse<CreatedCourierAccount>,
      CreateCourierAccountPayload
    >({
      query: (data) => ({
        url: BASE_URL,
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "COURIER_ACCOUNT", id: "LIST" }],
    }),

    getCourierAccounts: builder.query<
      CourierAccountListResponse,
      CourierAccountListQuery | void
    >({
      query: (params) => ({
        url: BASE_URL,
        method: "GET",
        params: params || undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((account) => ({
                type: "COURIER_ACCOUNT" as const,
                id: account.id,
              })),
              { type: "COURIER_ACCOUNT" as const, id: "LIST" },
            ]
          : [{ type: "COURIER_ACCOUNT", id: "LIST" }],
      keepUnusedDataFor: 60 * 5,
    }),

    getCourierAccount: builder.query<ApiResponse<CourierAccount>, string>({
      query: (id) => ({
        url: `${BASE_URL}/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "COURIER_ACCOUNT", id }],
      keepUnusedDataFor: 60 * 5,
    }),

    updateCourierAccount: builder.mutation<
      ApiResponse<CourierAccount>,
      { id: string; data: UpdateCourierAccountPayload }
    >({
      query: ({ id, data }) => ({
        url: `${BASE_URL}/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "COURIER_ACCOUNT", id },
        { type: "COURIER_ACCOUNT", id: "LIST" },
      ],
    }),

    regenerateCourierWebhookSecret: builder.mutation<
      ApiResponse<CreatedCourierAccount>,
      string
    >({
      query: (id) => ({
        url: `${BASE_URL}/${id}/regenerate-webhook-secret`,
        method: "POST",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "COURIER_ACCOUNT", id },
        { type: "COURIER_ACCOUNT", id: "LIST" },
      ],
    }),

    deleteCourierAccount: builder.mutation<ApiResponse<CourierAccount>, string>(
      {
        query: (id) => ({
          url: `${BASE_URL}/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: (_, __, id) => [
          { type: "COURIER_ACCOUNT", id },
          { type: "COURIER_ACCOUNT", id: "LIST" },
        ],
      },
    ),
  }),
});

export const {
  useTestCourierConnectionMutation,
  useCreateCourierAccountMutation,
  useGetCourierAccountsQuery,
  useLazyGetCourierAccountsQuery,
  useGetCourierAccountQuery,
  useLazyGetCourierAccountQuery,
  useUpdateCourierAccountMutation,
  useRegenerateCourierWebhookSecretMutation,
  useDeleteCourierAccountMutation,
} = courierIntegrationApi;
