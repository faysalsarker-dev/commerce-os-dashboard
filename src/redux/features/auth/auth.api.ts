import { baseApi } from "@/redux/baseApi";
import type { ForgotPasswordPayload, LoginPayload, RegisterPayload, ResetPasswordPayload, UpdatePasswordPayload, UpdateProfilePayload } from "@/types/data-types/user/auth";
import type { User } from "@/types/data-types/user/user.type";
import type { ApiResponse } from "@/types/shared";


const BASE_URL = "/user";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Register
     */
    register: builder.mutation<ApiResponse<User>, RegisterPayload>({
      query: (data) => ({
        url: `${BASE_URL}/register`,
        method: "POST",
        data,
      }),
    }),

    /**
     * Login
     */
    login: builder.mutation<ApiResponse<User>, LoginPayload>({
      query: (data) => ({
        url: `${BASE_URL}/login`,
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "USER", id: "CURRENT" }],
    }),

    /**
     * Logout
     */
    logout: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: `${BASE_URL}/logout`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "USER", id: "CURRENT" }],
    }),

    /**
     * Refresh Access Token
     */
    refreshToken: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: `${BASE_URL}/refresh-token`,
        method: "POST",
      }),
    }),

    /**
     * Forgot Password
     */
    forgotPassword: builder.mutation<
      ApiResponse<null>,
      ForgotPasswordPayload
    >({
      query: (data) => ({
        url: `${BASE_URL}/forgot-password`,
        method: "POST",
        data,
      }),
    }),

    /**
     * Reset Password
     */
    resetPassword: builder.mutation<ApiResponse<null>, ResetPasswordPayload>({
      query: (data) => ({
        url: `${BASE_URL}/reset-password`,
        method: "PATCH",
        data,
      }),
    }),

    /**
     * Current User Profile
     */
    getProfile: builder.query<ApiResponse<User>, void>({
      query: () => ({
        url: `${BASE_URL}/profile`,
        method: "GET",
      }),
      providesTags: [{ type: "USER", id: "CURRENT" }],
      keepUnusedDataFor: 60 * 60 * 3,
    }),

    /**
     * Update Profile
     */
    updateProfile: builder.mutation<
      ApiResponse<User>,
      UpdateProfilePayload
    >({
      query: (data) => ({
        url: `${BASE_URL}/profile`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [{ type: "USER", id: "CURRENT" }],
    }),

    /**
     * Update Password
     */
    updatePassword: builder.mutation<
      ApiResponse<null>,
      UpdatePasswordPayload
    >({
      query: (data) => ({
        url: `${BASE_URL}/password`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [{ type: "USER", id: "CURRENT" }],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
} = authApi;