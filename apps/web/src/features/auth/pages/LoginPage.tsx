import { LoginForm } from "../components/LoginForm";
import { useLogin } from "../hooks/useLogin";
import type { ApiError } from "@create-resume/api-client";

export function LoginPage() {
  const { mutate, isPending, error } = useLogin();

  const handleLogin = (data: { email: string; password: string }) => {
    mutate(data);
  };

  const errorMessage = error ? (error as unknown as ApiError).error : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Create Resume</h1>
          <p className="text-muted-foreground mt-2">
            Crie currículos profissionais em minutos
          </p>
        </div>
        <LoginForm
          onSubmit={handleLogin}
          isLoading={isPending}
          error={errorMessage}
        />
      </div>
    </div>
  );
}
