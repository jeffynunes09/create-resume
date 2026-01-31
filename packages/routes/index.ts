export const ROUTES_PATH = {
  // Auth
  AUTH: "/auth/login",
  LOGIN: "/login",
  REGISTER: "/register",

  // Dashboard
  DASHBOARD: "/dashboard",

  // Resume
  RESUMES: "/resumes",
  RESUME_CREATE: "/resumes/new",
  RESUME_EDIT: "/resumes/:id/edit",
  RESUME_VIEW: "/resumes/:id",
} as const;

export type RoutePath = (typeof ROUTES_PATH)[keyof typeof ROUTES_PATH];

// Helper para rotas dinâmicas
export const buildRoute = {
  resumeEdit: (id: string) => `/resumes/${id}/edit`,
  resumeView: (id: string) => `/resumes/${id}`,
};
