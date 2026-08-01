export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  meta?: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: false
    hasPrevPage: false
  }
}

export type ApiError = {
  status: number
  data: {
    status: "fail"
    message: string
  }
}
