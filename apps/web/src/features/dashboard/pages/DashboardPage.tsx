import { buildRoute, ROUTES_PATH } from "@create-resume/routes";
import { Calendar, Edit, Eye, FileText, Loader2, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useResumes } from "@/features/resume";

export function DashboardPage() {
	const { data: resumes, isLoading, error } = useResumes();

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("pt-BR", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		});
	};

	return (
		<div>
			<div className="mb-8">
				<h1 className="text-2xl font-bold mb-2">Dashboard</h1>
				<p className="text-muted-foreground">
					Gerencie seus currículos profissionais
				</p>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{/* Card para criar novo currículo */}
				<Link
					to={ROUTES_PATH.RESUME_CREATE}
					className="p-6 border rounded-lg bg-card hover:border-primary transition-colors group"
				>
					<div className="flex items-center gap-4 mb-4">
						<div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
							<Plus className="h-6 w-6 text-primary" />
						</div>
						<h3 className="font-semibold">Criar novo currículo</h3>
					</div>
					<p className="text-sm text-muted-foreground">
						Comece do zero e crie um currículo profissional
					</p>
				</Link>

				{/* Loading state */}
				{isLoading && (
					<div className="p-6 border rounded-lg bg-card flex items-center justify-center">
						<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
					</div>
				)}

				{/* Error state */}
				{error && (
					<div className="p-6 border rounded-lg bg-card border-destructive">
						<p className="text-sm text-destructive">
							Erro ao carregar currículos
						</p>
					</div>
				)}

				{/* Empty state */}
				{!isLoading && !error && resumes?.length === 0 && (
					<div className="p-6 border rounded-lg bg-card">
						<div className="flex items-center gap-4 mb-4">
							<div className="p-3 bg-muted rounded-lg">
								<FileText className="h-6 w-6 text-muted-foreground" />
							</div>
							<h3 className="font-semibold">Meus currículos</h3>
						</div>
						<p className="text-sm text-muted-foreground mb-4">
							Você ainda não tem currículos salvos
						</p>
						<Button variant="outline" size="sm" asChild>
							<Link to={ROUTES_PATH.RESUME_CREATE}>Criar primeiro</Link>
						</Button>
					</div>
				)}

				{/* Lista de currículos */}
				{resumes?.map((resume) => (
					<div
						key={resume.id}
						className="p-6 border rounded-lg bg-card hover:shadow-md transition-shadow"
					>
						<div className="flex items-start justify-between mb-4">
							<div className="flex items-center gap-4">
								<div className="p-3 bg-primary/10 rounded-lg">
									<FileText className="h-6 w-6 text-primary" />
								</div>
								<div>
									<h3 className="font-semibold">
										{resume.personalInfo.fullName || "Sem nome"}
									</h3>
									<p className="text-sm text-muted-foreground">
										{resume.personalInfo.email}
									</p>
								</div>
							</div>
						</div>

						<div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
							<Calendar className="h-3 w-3" />
							<span>Atualizado em {formatDate(resume.updatedAt)}</span>
						</div>

						<div className="flex flex-wrap gap-1 mb-4">
							{resume.experiences.length > 0 && (
								<span className="px-2 py-0.5 bg-muted rounded text-xs">
									{resume.experiences.length} experiência(s)
								</span>
							)}
							{resume.education.length > 0 && (
								<span className="px-2 py-0.5 bg-muted rounded text-xs">
									{resume.education.length} formação(ões)
								</span>
							)}
							{resume.skills.length > 0 && (
								<span className="px-2 py-0.5 bg-muted rounded text-xs">
									{resume.skills.length} habilidade(s)
								</span>
							)}
						</div>

						<div className="flex gap-2">
							<Button variant="outline" size="sm" asChild className="flex-1">
								<Link to={buildRoute.resumeView(resume.id)}>
									<Eye className="h-4 w-4 mr-1" />
									Ver
								</Link>
							</Button>
							<Button variant="outline" size="sm" asChild className="flex-1">
								<Link to={buildRoute.resumeEdit(resume.id)}>
									<Edit className="h-4 w-4 mr-1" />
									Editar
								</Link>
							</Button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
