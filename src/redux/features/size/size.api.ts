import { baseApi } from "@/redux/baseApi";
import type {
  CreateSizePayload,
  Size,
  SizeFilters,
  UpdateSizePayload,
} from "@/types/data-types/size/size.types";
import type { ApiResponse } from "@/types/shared";

const BASE_URL = "/size";

export const sizeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSize: builder.mutation<ApiResponse<Size>, CreateSizePayload>({
      query: (data) => ({
        url: BASE_URL,
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "SIZE", id: "LIST" }],
    }),

    getSizes: builder.query<ApiResponse<Size[]>, SizeFilters | void>({
      query: (params) => ({
        url: BASE_URL,
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((size) => ({
                type: "SIZE" as const,
                id: size.id,
              })),
              {
                type: "SIZE" as const,
                id: "LIST",
              },
            ]
          : [
              {
                type: "SIZE" as const,
                id: "LIST",
              },
            ],
      keepUnusedDataFor: 60 * 5,
    }),

    getSize: builder.query<ApiResponse<Size>, string>({
      query: (id) => ({
        url: `${BASE_URL}/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [
        {
          type: "SIZE",
          id,
        },
      ],
      keepUnusedDataFor: 60 * 5,
    }),

    getSizesForSelect: builder.query<ApiResponse<Size[]>, SizeFilters | void>({
      query: (params) => ({
        url: BASE_URL,
        method: "GET",
        params: { limit: 100, ...params },
      }),
      providesTags: [{ type: "SIZE", id: "LIST" }],
      keepUnusedDataFor: 60 * 5,
    }),

    updateSize: builder.mutation<
      ApiResponse<Size>,
      {
        id: string;
        data: UpdateSizePayload;
      }
    >({
      query: ({ id, data }) => ({
        url: `${BASE_URL}/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [
        {
          type: "SIZE",
          id,
        },
        {
          type: "SIZE",
          id: "LIST",
        },
      ],
    }),

    deleteSize: builder.mutation<ApiResponse<Size>, string>({
      query: (id) => ({
        url: `${BASE_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        {
          type: "SIZE",
          id,
        },
        {
          type: "SIZE",
          id: "LIST",
        },
      ],
    }),
  }),
});

export const {
  // Create
  useCreateSizeMutation,

  // Get All
  useGetSizesQuery,
  useLazyGetSizesQuery,
  useGetSizesForSelectQuery,
  useLazyGetSizesForSelectQuery,

  // Get One
  useGetSizeQuery,
  useLazyGetSizeQuery,

  // Update
  useUpdateSizeMutation,

  // Delete
  useDeleteSizeMutation,
} = sizeApi;

