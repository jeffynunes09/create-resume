import { ROUTES_PATH } from "@create-resume/routes";
import type {
	Education,
	Experience,
	PersonalInfo,
	Resume,
	Skill,
} from "@create-resume/shared-types";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EducationForm } from "../components/EducationForm";
import { ExperienceForm } from "../components/ExperienceForm";
import { PersonalInfoForm } from "../components/PersonalInfoForm";
import { ResumePreview } from "../components/ResumePreview";
import { SkillsForm } from "../components/SkillsForm";
import { useResume } from "../hooks/useResume";
import { useUpdateResume } from "../hooks/useUpdateResume";

export function ResumeEditPage() {
	const { id } = useParams<{ id: string }>();
	const { data: resume, isLoading: isLoadingResume } = useResume(id!);
	const { mutate: updateResume, isPending, error } = useUpdateResume(id!);

	const [personalInfo, setPersonalInfo] = useState<Partial<PersonalInfo>>({});
	const [summary, setSummary] = useState("");
	const [experiences, setExperiences] = useState<Experience[]>([]);
	const [education, setEducation] = useState<Education[]>([]);
	const [skills, setSkills] = useState<Skill[]>([]);
	const [isInitialized, setIsInitialized] = useState(false);

	// Preencher formulário com dados existentes
	useEffect(() => {
		if (resume && !isInitialized) {
			setPersonalInfo(resume.personalInfo);
			setSummary(resume.summary || "");
			setExperiences(resume.experiences);
			setEducation(resume.education);
			setSkills(resume.skills);
			setIsInitialized(true);
		}
	}, [resume, isInitialized]);

	const resumeData: Partial<Resume> = {
		personalInfo: personalInfo as PersonalInfo,
		summary,
		experiences,
		education,
		skills,
	};

	const handleSave = () => {
		if (!personalInfo.fullName || !personalInfo.email) {
			alert("Por favor, preencha nome e email.");
			return;
		}

		updateResume({
			summary: summary || undefined,
			personalInfo: {
				fullName: personalInfo.fullName,
				email: personalInfo.email,
				phone: personalInfo.phone,
				location: personalInfo.location,
				linkedIn: personalInfo.linkedIn,
				github: personalInfo.github,
				website: personalInfo.website,
			},
			experiences: experiences.map((exp) => ({
				company: exp.company,
				position: exp.position,
				startDate: exp.startDate,
				endDate: exp.endDate,
				current: exp.current,
				description: exp.description,
				highlights: exp.highlights,
			})),
			education: education.map((edu) => ({
				institution: edu.institution,
				degree: edu.degree,
				field: edu.field,
				startDate: edu.startDate,
				endDate: edu.endDate,
				current: edu.current,
				gpa: edu.gpa,
			})),
			skills: skills.map((skill) => ({
				name: skill.name,
				level: skill.level,
				category: skill.category,
			})),
		});
	};

	if (isLoadingResume) {
		return (
			<div className="flex items-center justify-center h-[calc(100vh-8rem)]">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (!resume) {
		return (
			<div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] gap-4">
				<p className="text-muted-foreground">Currículo não encontrado</p>
				<Button variant="outline" asChild>
					<Link to={ROUTES_PATH.DASHBOARD}>
						<ArrowLeft className="h-4 w-4 mr-2" />
						Voltar ao Dashboard
					</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[calc(100vh-8rem)]">
			{/* Form */}
			<div className="flex-1 overflow-auto pb-6 lg:pb-0">
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
					<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
						<Button
							variant="ghost"
							size="sm"
							asChild
							className="w-full sm:w-auto"
						>
							<Link to={ROUTES_PATH.DASHBOARD}>
								<ArrowLeft className="h-4 w-4 mr-2" />
								Voltar
							</Link>
						</Button>
						<h1 className="text-2xl font-bold">Editar Currículo</h1>
					</div>
					<Button
						onClick={handleSave}
						disabled={isPending}
						className="w-full sm:w-auto"
					>
						<Save className="h-4 w-4 mr-2" />
						{isPending ? "Salvando..." : "Salvar"}
					</Button>
				</div>

				{error && (
					<div className="mb-4 p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
						Erro ao salvar currículo. Tente novamente.
					</div>
				)}

				<Tabs defaultValue="personal" className="w-full">
					<TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
						<TabsTrigger value="personal" className="text-xs sm:text-sm">
							Pessoal
						</TabsTrigger>
						<TabsTrigger value="experience" className="text-xs sm:text-sm">
							Experiência
						</TabsTrigger>
						<TabsTrigger value="education" className="text-xs sm:text-sm">
							Educação
						</TabsTrigger>
						<TabsTrigger value="skills" className="text-xs sm:text-sm">
							Habilidades
						</TabsTrigger>
					</TabsList>

					<div className="mt-6">
						<TabsContent value="personal">
							<PersonalInfoForm
								data={personalInfo}
								summary={summary}
								onChange={setPersonalInfo}
								onSummaryChange={setSummary}
							/>
						</TabsContent>

						<TabsContent value="experience">
							<ExperienceForm
								experiences={experiences}
								onChange={setExperiences}
							/>
						</TabsContent>

						<TabsContent value="education">
							<EducationForm education={education} onChange={setEducation} />
						</TabsContent>

						<TabsContent value="skills">
							<SkillsForm skills={skills} onChange={setSkills} />
						</TabsContent>
					</div>
				</Tabs>
			</div>

			{/* Preview - Hidden on mobile, visible on large screens */}
			<div className="hidden lg:block lg:w-[420px] lg:flex-shrink-0 overflow-auto border rounded-lg bg-gray-100 p-4">
				<h2 className="text-sm font-medium text-muted-foreground mb-4">
					Pré-visualização
				</h2>
				<div className="transform scale-[0.6] origin-top">
					<ResumePreview data={resumeData} />
				</div>
			</div>
		</div>
	);
}
