export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type ApiError = {
  status: number;
  data: {
    status: "fail";
    message: string;
  };
};