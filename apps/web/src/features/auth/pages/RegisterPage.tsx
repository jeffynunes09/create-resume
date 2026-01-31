import { RegisterForm } from "../components/RegisterForm";
import { useRegister } from "../hooks/useRegister";
import type { ApiError } from "@create-resume/api-client";

export function RegisterPage() {
  const { mutate, isPending, error } = useRegister();

  const handleRegister = (data: { email: string; password: string; confirmPassword: string }) => {
    mutate(data);
  };

  const errorMessage = error ? (error as unknown as ApiError).error : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Create Resume</h1>
          <p className="text-muted-foreground mt-2">
            Crie sua conta e comece a criar currículos profissionais
          </p>
        </div>
        <RegisterForm
          onSubmit={handleRegister}
          isLoading={isPending}
          error={errorMessage}
        />
      </div>
    </div>
  );
}
