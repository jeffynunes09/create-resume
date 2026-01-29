import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { CreateResumeInput } from "@create-resume/api-client";
import { api } from "@/lib/api";
import { ROUTES_PATH } from "@create-resume/routes";

export function useCreateResume() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateResumeInput) => api.resume.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      navigate(ROUTES_PATH.DASHBOARD);
    },
  });
}
