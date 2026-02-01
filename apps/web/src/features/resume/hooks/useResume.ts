import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useResume(id: string) {
	return useQuery({
		queryKey: ["resume", id],
		queryFn: () => api.resume.getById(id),
		enabled: !!id,
	});
}
