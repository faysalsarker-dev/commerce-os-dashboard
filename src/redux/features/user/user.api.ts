import { baseApi } from "@/redux/baseApi";
import type { SalaryRecord } from "@/types/data-types/user/salary-record.type";
import type {
  CreateSalaryRecordPayload,
  CreateUserPayload,
  IncreasedSalaryResponse,
  IncreaseSalaryPayload,
  SalaryQueryParams,
  UpdateSalaryRecordPayload,
  UpdateUserPayload,
  UserQueryParams,
  UserSalaryHistory,
} from "@/types/data-types/user/user.payloads";
import type { User } from "@/types/data-types/user/user.type";
import type { ApiResponse } from "@/types/shared";

const BASE_URL = "/user";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Create User (SUPER_ADMIN)
     */
    createUser: builder.mutation<ApiResponse<User>, CreateUserPayload | FormData>({
      query: (data) => ({
        url: BASE_URL,
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "USER", id: "LIST" }],
    }),

    /**
     * Get Users List (SUPER_ADMIN)
     */
    getUsers: builder.query<ApiResponse<User[]>, UserQueryParams | void>({
      query: (params) => ({
        url: BASE_URL,
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((user) => ({
                type: "USER" as const,
                id: user.id,
              })),
              { type: "USER" as const, id: "LIST" },
            ]
          : [{ type: "USER" as const, id: "LIST" }],
      keepUnusedDataFor: 60 * 5,
    }),

    /**
     * Get Single User by ID (SUPER_ADMIN)
     */
    getUser: builder.query<ApiResponse<User>, string>({
      query: (id) => ({
        url: `${BASE_URL}/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "USER", id }],
      keepUnusedDataFor: 60 * 5,
    }),

    /**
     * Get User Profile
     */
    getUserProfile: builder.query<ApiResponse<User>, void>({
      query: () => ({
        url: `${BASE_URL}/profile`,
        method: "GET",
      }),
      providesTags: () => [{ type: "USER", id: "PROFILE" }],
      keepUnusedDataFor: 60 * 5,
    }),

    /**
     * Update User (SUPER_ADMIN)
     */
    updateUser: builder.mutation<
      ApiResponse<User>,
      { id: string; data: UpdateUserPayload }
    >({
      query: ({ id, data }) => ({
        url: `${BASE_URL}/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "USER", id },
        { type: "USER", id: "LIST" },
      ],
    }),

    /**
     * Delete User (SUPER_ADMIN)
     */
    deleteUser: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `${BASE_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "USER", id },
        { type: "USER", id: "LIST" },
      ],
    }),

    // =====================================================
    // Salary Endpoints (SUPER_ADMIN)
    // =====================================================

    /**
     * Create Salary Record
     */
    createSalaryRecord: builder.mutation<
      ApiResponse<SalaryRecord>,
      CreateSalaryRecordPayload
    >({
      query: (data) => ({
        url: `${BASE_URL}/salary`,
        method: "POST",
        data,
      }),
      invalidatesTags: (_, __, arg) => [
        { type: "SALARY", id: "LIST" },
        { type: "SALARY", id: `USER_${arg.userId}` },
        { type: "USER", id: arg.userId },
      ],
    }),

    /**
     * Get Salary Records List
     */
    getSalaryRecords: builder.query<
      ApiResponse<SalaryRecord[]>,
      SalaryQueryParams | void
    >({
      query: (params) => ({
        url: `${BASE_URL}/salary`,
        method: "GET",
        params: params ?? undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((record) => ({
                type: "SALARY" as const,
                id: record.id,
              })),
              { type: "SALARY" as const, id: "LIST" },
            ]
          : [{ type: "SALARY" as const, id: "LIST" }],
      keepUnusedDataFor: 60 * 5,
    }),

    /**
     * Get Single Salary Record by ID
     */
    getSalaryRecord: builder.query<ApiResponse<SalaryRecord>, string>({
      query: (id) => ({
        url: `${BASE_URL}/salary/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "SALARY", id }],
      keepUnusedDataFor: 60 * 5,
    }),

    /**
     * Get User Salary History and Details
     */
    getUserSalaryHistory: builder.query<ApiResponse<UserSalaryHistory>, string>({
      query: (userId) => ({
        url: `${BASE_URL}/${userId}/salary`,
        method: "GET",
      }),
      providesTags: (_, __, userId) => [
        { type: "SALARY", id: `USER_${userId}` },
        { type: "USER", id: userId },
      ],
      keepUnusedDataFor: 60 * 5,
    }),

    /**
     * Update Salary Record by ID
     */
    updateSalaryRecord: builder.mutation<
      ApiResponse<SalaryRecord>,
      { id: string; data: UpdateSalaryRecordPayload }
    >({
      query: ({ id, data }) => ({
        url: `${BASE_URL}/salary/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (result, __, { id }) => [
        { type: "SALARY", id },
        { type: "SALARY", id: "LIST" },
        ...(result?.data?.userId
          ? [
              { type: "SALARY" as const, id: `USER_${result.data.userId}` },
              { type: "USER" as const, id: result.data.userId },
            ]
          : []),
      ],
    }),

    /**
     * Delete Salary Record by ID
     */
    deleteSalaryRecord: builder.mutation<ApiResponse<SalaryRecord>, string>({
      query: (id) => ({
        url: `${BASE_URL}/salary/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, __, id) => [
        { type: "SALARY", id },
        { type: "SALARY", id: "LIST" },
        ...(result?.data?.userId
          ? [
              { type: "SALARY" as const, id: `USER_${result.data.userId}` },
              { type: "USER" as const, id: result.data.userId },
            ]
          : []),
      ],
    }),

    /**
     * Increase Employee Base Salary
     */
    increaseEmployeeSalary: builder.mutation<
      ApiResponse<IncreasedSalaryResponse>,
      IncreaseSalaryPayload
    >({
      query: (data) => ({
        url: `${BASE_URL}/salary/increase`,
        method: "POST",
        data,
      }),
      invalidatesTags: (_, __, { userId }) => [
        { type: "SALARY", id: "LIST" },
        { type: "SALARY", id: `USER_${userId}` },
        { type: "USER", id: userId },
        { type: "USER", id: "LIST" },
      ],
    }),
  }),
});

export const {
  // User Hooks
  useCreateUserMutation,
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useGetUserProfileQuery,
  useGetUserQuery,
  useLazyGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,

  // Salary Hooks
  useCreateSalaryRecordMutation,
  useGetSalaryRecordsQuery,
  useLazyGetSalaryRecordsQuery,
  useGetSalaryRecordQuery,
  useLazyGetSalaryRecordQuery,
  useGetUserSalaryHistoryQuery,
  useLazyGetUserSalaryHistoryQuery,
  useUpdateSalaryRecordMutation,
  useDeleteSalaryRecordMutation,
  useIncreaseEmployeeSalaryMutation,
} = userApi;
