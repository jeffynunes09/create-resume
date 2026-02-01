import type { CreateResumeInput } from "@create-resume/api-client";
import { ROUTES_PATH } from "@create-resume/routes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

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
