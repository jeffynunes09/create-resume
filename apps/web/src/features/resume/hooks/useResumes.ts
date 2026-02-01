import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useResumes() {
  return useQuery({
    queryKey: ["resumes"],
    queryFn: () => api.resume.getAll(),
  });
}
