import type { CreateResumeInput } from "@create-resume/api-client";
import { ROUTES_PATH } from "@create-resume/routes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

export function useUpdateResume(id: string) {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: Partial<CreateResumeInput>) =>
			api.resume.update(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["resumes"] });
			queryClient.invalidateQueries({ queryKey: ["resume", id] });
			navigate(ROUTES_PATH.DASHBOARD);
		},
	});
}
