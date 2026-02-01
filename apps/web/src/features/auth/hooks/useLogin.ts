import type { LoginInput } from "@create-resume/schemas";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuth } from "../context/AuthContext";

export function useLogin() {
	const navigate = useNavigate();
	const { login } = useAuth();

	return useMutation({
		mutationFn: (data: LoginInput) => api.auth.login(data),
		onSuccess: (response) => {
			login(response.user, response.token);
			navigate("/dashboard");
		},
	});
}
