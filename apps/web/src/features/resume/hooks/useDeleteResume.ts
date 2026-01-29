import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { ROUTES_PATH } from "@create-resume/routes";

export function useDeleteResume() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.resume.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      navigate(ROUTES_PATH.DASHBOARD);
    },
  });
}
