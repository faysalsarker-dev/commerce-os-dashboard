export type CourierProvider = "PATHAO" | "STEADFAST";

export interface PathaoCredentials {
  clientId: string;
  clientSecret: string;
  username: string;
  password: string;
}

export interface PathaoConfig {
  storeId: number;
  sandbox: boolean;
}

export interface SteadfastCredentials {
  apiKey: string;
  secretKey: string;
}

export type SteadfastConfig = Record<string, never>;

export interface CourierAccount {
  id: string;
  provider: CourierProvider;
  label: string;
  config: PathaoConfig | SteadfastConfig | null;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  maskedHint: string;
  hasWebhookSecret: boolean;
  webhookUrl: string;
}

export interface CreatedCourierAccount extends CourierAccount {
  oneTimeWebhookSecret?: string;
}

export interface CourierAccountListQuery {
  page?: number;
  limit?: number;
  provider?: CourierProvider;
  isActive?: boolean;
}

export interface CourierAccountListResponse {
  success: boolean;
  message: string;
  data: CourierAccount[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export type TestCourierConnectionPayload =
  | {
      provider: "PATHAO";
      credentials: PathaoCredentials;
      config: PathaoConfig;
    }
  | {
      provider: "STEADFAST";
      credentials: SteadfastCredentials;
      config?: SteadfastConfig;
    };

export type CreateCourierAccountPayload =
  | {
      provider: "PATHAO";
      label: string;
      credentials: PathaoCredentials;
      config: PathaoConfig;
      isDefault?: boolean;
    }
  | {
      provider: "STEADFAST";
      label: string;
      credentials: SteadfastCredentials;
      config?: SteadfastConfig;
      webhookSecret?: string;
      isDefault?: boolean;
    };

export interface UpdateCourierAccountPayload {
  label?: string;
  credentials?: PathaoCredentials | SteadfastCredentials;
  config?: PathaoConfig | SteadfastConfig;
  webhookSecret?: string | null;
  isActive?: boolean;
  isDefault?: boolean;
}

export interface TestCourierConnectionResult {
  provider: CourierProvider;
  connected: true;
}
