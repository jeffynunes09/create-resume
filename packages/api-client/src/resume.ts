import { ROUTES_PATH } from "@create-resume/routes";
import type { Resume } from "@create-resume/shared-types";
import type { ApiClient } from "./client.js";
export interface CreateResumeInput {
  summary?: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
    linkedIn?: string;
    github?: string;
    website?: string;
  };
  experiences: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description?: string;
    highlights: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    gpa?: string;
  }>;
  skills: Array<{
    name: string;
    level?: "beginner" | "intermediate" | "advanced" | "expert";
    category?: string;
  }>;
}

export function createResumeApi(client: ApiClient) {
  return {
    create: (data: CreateResumeInput): Promise<Resume> => {
      return client.post<Resume>(ROUTES_PATH.RESUMES, data);
    },

    getAll: (): Promise<Resume[]> => {
      return client.get<Resume[]>(ROUTES_PATH.RESUMES);
    },

    getById: (id: string): Promise<Resume> => {
      return client.get<Resume>(`${ROUTES_PATH.RESUMES}/${id}`);
    },

    update: (id: string, data: Partial<CreateResumeInput>): Promise<Resume> => {
      return client.put<Resume>(`${ROUTES_PATH.RESUMES}/${id}`, data);
    },

    delete: (id: string): Promise<void> => {
      return client.delete<void>(`${ROUTES_PATH.RESUMES}/${id}`);
    },
  };
}
