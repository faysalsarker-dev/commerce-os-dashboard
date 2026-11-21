import { baseApi } from "@/redux/baseApi"
import type {
  Campaign,
  CampaignFilters,
  CreateCampaignPayload,
  UpdateCampaignPayload,
} from "@/types/data-types/campaign.types"
import type { ApiResponse } from "@/types/shared"

const BASE_URL = "/campaigns"

type CampaignPaginationMeta = {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

type CampaignListResponse = Omit<ApiResponse<Campaign[]>, "meta"> & {
  meta: CampaignPaginationMeta
}

export const campaignApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCampaign: builder.mutation<
      ApiResponse<Campaign>,
      CreateCampaignPayload
    >({
      query: (data) => ({ url: BASE_URL, method: "POST", data }),
      invalidatesTags: (_result, error) =>
        error
          ? []
          : [
              { type: "CAMPAIGN", id: "LIST" },
              { type: "CAMPAIGN", id: "REPORT" },
            ],
    }),
    getCampaigns: builder.query<CampaignListResponse, CampaignFilters | void>({
      query: (params) => ({
        url: BASE_URL,
        method: "GET",
        params: params || undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((campaign) => ({
                type: "CAMPAIGN" as const,
                id: campaign.id,
              })),
              { type: "CAMPAIGN" as const, id: "LIST" },
            ]
          : [{ type: "CAMPAIGN" as const, id: "LIST" }],
      keepUnusedDataFor: 60 * 5,
    }),
    getCampaign: builder.query<ApiResponse<Campaign>, string>({
      query: (id) => ({ url: `${BASE_URL}/${id}`, method: "GET" }),
      providesTags: (_, __, id) => [{ type: "CAMPAIGN", id }],
      keepUnusedDataFor: 60 * 5,
    }),
    updateCampaign: builder.mutation<
      ApiResponse<Campaign>,
      { id: string; data: UpdateCampaignPayload }
    >({
      query: ({ id, data }) => ({
        url: `${BASE_URL}/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_result, error, { id }) =>
        error
          ? []
          : [
              { type: "CAMPAIGN", id },
              { type: "CAMPAIGN", id: "LIST" },
              { type: "CAMPAIGN", id: "REPORT" },
            ],
    }),
    deleteCampaign: builder.mutation<ApiResponse<Campaign>, string>({
      query: (id) => ({ url: `${BASE_URL}/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, error, id) =>
        error
          ? []
          : [
              { type: "CAMPAIGN", id },
              { type: "CAMPAIGN", id: "LIST" },
              { type: "CAMPAIGN", id: "REPORT" },
            ],
    }),
  }),
})

export const {
  useCreateCampaignMutation,
  useGetCampaignsQuery,
  useLazyGetCampaignsQuery,
  useGetCampaignQuery,
  useLazyGetCampaignQuery,
  useUpdateCampaignMutation,
  useDeleteCampaignMutation,
} = campaignApi
