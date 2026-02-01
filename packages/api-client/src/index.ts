import { createAuthApi } from "./auth.js";
import { ApiClient, type ApiClientConfig } from "./client.js";
import { createResumeApi } from "./resume.js";

export type { AuthUser, LoginResponse } from "./auth.js";
export type { ApiClientConfig, ApiError } from "./client.js";
export type { CreateResumeInput } from "./resume.js";

export function createApiClient(config: ApiClientConfig) {
	const client = new ApiClient(config);

	return {
		auth: createAuthApi(client),
		resume: createResumeApi(client),
	};
}
