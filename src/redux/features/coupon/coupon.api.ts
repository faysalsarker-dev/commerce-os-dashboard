import { baseApi } from "@/redux/baseApi";
import type {
  Coupon,
  CouponFilters,
  CreateCouponPayload,
  UpdateCouponPayload,
  ValidateCouponPayload,
  ValidateCouponResult,
} from "@/types/data-types/coupon/coupon.types";
import type { ApiResponse } from "@/types/shared";

const BASE_URL = "/coupon";

export const couponApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Create a new coupon
     */
    createCoupon: builder.mutation<ApiResponse<Coupon>, CreateCouponPayload>({
      query: (data) => ({
        url: BASE_URL,
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "COUPON", id: "LIST" }],
    }),

    /**
     * Get coupons list with pagination, search, and filters
     */
    getCoupons: builder.query<ApiResponse<Coupon[]>, CouponFilters | void>({
      query: (params) => ({
        url: BASE_URL,
        method: "GET",
        params: params || undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((coupon) => ({
                type: "COUPON" as const,
                id: coupon.id,
              })),
              { type: "COUPON" as const, id: "LIST" },
            ]
          : [{ type: "COUPON" as const, id: "LIST" }],
      keepUnusedDataFor: 60 * 5,
    }),

    /**
     * Get a single coupon by ID
     */
    getCoupon: builder.query<ApiResponse<Coupon>, string>({
      query: (id) => ({
        url: `${BASE_URL}/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "COUPON", id }],
      keepUnusedDataFor: 60 * 5,
    }),

    /**
     * Update an existing coupon by ID
     */
    updateCoupon: builder.mutation<
      ApiResponse<Coupon>,
      { id: string; data: UpdateCouponPayload }
    >({
      query: ({ id, data }) => ({
        url: `${BASE_URL}/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "COUPON", id },
        { type: "COUPON", id: "LIST" },
      ],
    }),

    /**
     * Delete a coupon by ID
     */
    deleteCoupon: builder.mutation<ApiResponse<Coupon>, string>({
      query: (id) => ({
        url: `${BASE_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "COUPON", id },
        { type: "COUPON", id: "LIST" },
      ],
    }),

    /**
     * Validate a coupon against an order amount, channel, and customer
     */
    validateCoupon: builder.mutation<
      ApiResponse<ValidateCouponResult>,
      ValidateCouponPayload
    >({
      query: (data) => ({
        url: `${BASE_URL}/validate`,
        method: "POST",
        data,
      }),
    }),
  }),
});

export const {
  // Create
  useCreateCouponMutation,

  // Get All / Search
  useGetCouponsQuery,
  useLazyGetCouponsQuery,

  // Get One
  useGetCouponQuery,
  useLazyGetCouponQuery,

  // Update
  useUpdateCouponMutation,

  // Delete
  useDeleteCouponMutation,

  // Validate
  useValidateCouponMutation,
} = couponApi;

