import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { RegisterInput } from "@create-resume/schemas";
import { api } from "@/lib/api";
import { useAuth } from "../context/AuthContext";

export function useRegister() {
  const navigate = useNavigate();
  const { login } = useAuth();

  return useMutation({
    mutationFn: (data: RegisterInput) => api.auth.register(data),
    onSuccess: (response) => {
      login(response.user, response.token);
      navigate("/dashboard");
    },
  });
}
