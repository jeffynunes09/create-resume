import { ROUTES_PATH } from "@create-resume/routes";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginFormData {
	email: string;
	password: string;
}

interface LoginFormProps {
	onSubmit?: (data: LoginFormData) => void;
	isLoading?: boolean;
	error?: string | null;
}

export function LoginForm({
	onSubmit,
	isLoading = false,
	error,
}: LoginFormProps) {
	const [formData, setFormData] = useState<LoginFormData>({
		email: "",
		password: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit?.(formData);
	};

	return (
		<Card className="w-full max-w-md">
			<CardHeader className="space-y-1">
				<CardTitle className="text-2xl font-bold text-center">Entrar</CardTitle>
				<CardDescription className="text-center">
					Digite seu email e senha para acessar sua conta
				</CardDescription>
			</CardHeader>
			<form onSubmit={handleSubmit}>
				<CardContent className="space-y-4">
					{error && (
						<div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
							{error}
						</div>
					)}
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							name="email"
							type="email"
							placeholder="seu@email.com"
							value={formData.email}
							onChange={handleChange}
							required
							autoComplete="email"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="password">Senha</Label>
						<Input
							id="password"
							name="password"
							type="password"
							placeholder="••••••••"
							value={formData.password}
							onChange={handleChange}
							required
							autoComplete="current-password"
						/>
					</div>
				</CardContent>
				<CardFooter className="flex flex-col gap-4">
					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading ? "Entrando..." : "Entrar"}
					</Button>
					<p className="text-sm text-muted-foreground text-center">
						Não tem uma conta?{" "}
						<Link
							to={ROUTES_PATH.REGISTER}
							className="text-primary hover:underline"
						>
							Cadastre-se
						</Link>
					</p>
				</CardFooter>
			</form>
		</Card>
	);
}
