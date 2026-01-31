import type { LoginInput, RegisterInput } from "@create-resume/schemas";
import type { ApiClient } from "./client.js";
import { ROUTES_PATH } from "@create-resume/routes";

export interface AuthUser {
  id: string;
  email: string;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
}

export type RegisterResponse = LoginResponse;

export function createAuthApi(client: ApiClient) {
  return {
    login: (data: LoginInput): Promise<LoginResponse> => {
      return client.post<LoginResponse>(ROUTES_PATH.AUTH, data);
    },
    register: (data: RegisterInput): Promise<RegisterResponse> => {
      return client.post<RegisterResponse>(`/auth${ROUTES_PATH.REGISTER}`, data);
    },
  };
}
