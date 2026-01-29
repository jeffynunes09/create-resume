import { createApiClient } from "@create-resume/api-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const api = createApiClient({
  baseUrl: API_URL,
  getToken: () => localStorage.getItem("token"),
});
