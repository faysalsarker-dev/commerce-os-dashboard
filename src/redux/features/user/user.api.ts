import { baseApi } from "@/redux/baseApi";
import type {
  CreateUserPayload,
  UpdateUserPayload,
  UserQueryParams,
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


    getUserProfile: builder.query<ApiResponse<User>, void>({
      query: () => ({
        url: `${BASE_URL}/profile`, 
        method: "GET",
         providesTags: () => [{ type: "USER", id: "PROFILE" }],
      keepUnusedDataFor: 60 * 5,
      }),
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
  }),
});

export const {
  useCreateUserMutation,
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useGetUserProfileQuery,
  useGetUserQuery,
  useLazyGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
