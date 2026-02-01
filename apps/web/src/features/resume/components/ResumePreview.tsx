import type { Resume } from "@create-resume/shared-types";
import { Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ResumePreviewProps {
	data: Partial<Resume>;
	fontFamily?: string;
	fontSize?: string;
	textColor?: string;
}

export function ResumePreview({
	data,
	fontFamily = "Inter, system-ui, sans-serif",
	fontSize = "14",
	textColor = "#000000",
}: ResumePreviewProps) {
	const { personalInfo, summary, experiences, education, skills } = data;

	const formatDate = (date?: string) => {
		if (!date) return "";
		const parts = date.split("-");
		if (parts.length < 2) return date;
		const year = parts[0];
		const month = parts[1];
		if (!year || !month) return date;
		const months = [
			"Jan",
			"Fev",
			"Mar",
			"Abr",
			"Mai",
			"Jun",
			"Jul",
			"Ago",
			"Set",
			"Out",
			"Nov",
			"Dez",
		];
		const monthIndex = parseInt(month, 10) - 1;
		if (isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) return date;
		return `${months[monthIndex]} ${year}`;
	};

	const baseFontSize = parseInt(fontSize);
	const headingSize = baseFontSize + 10;
	const subHeadingSize = baseFontSize;
	const smallSize = baseFontSize - 2;

	return (
		<div
			className="bg-white p-8 min-w-[520px] shadow-lg min-h-[842px]"
			style={{
				fontFamily,
				fontSize: `${baseFontSize}px`,
				color: textColor,
			}}
		>
			{/* Header */}
			<div className="text-center mb-6">
				<h1 className="font-bold mb-2" style={{ fontSize: `${headingSize}px` }}>
					{personalInfo?.fullName || "Seu Nome"}
				</h1>
				<div
					className="flex flex-wrap justify-center gap-4 "
					style={{ fontSize: `${smallSize}px`, color: "#4a5568" }}
				>
					{personalInfo?.email && (
						<a
							href={`mailto:${personalInfo.email}`}
							className="flex items-center gap-1 hover:underline"
						>
							<Mail className="h-3 w-3" />
							{personalInfo.email}
						</a>
					)}
					{personalInfo?.phone && (
						<span className="flex items-center gap-1">
							<Phone className="h-3 w-3" />
							{personalInfo.phone}
						</span>
					)}
					{personalInfo?.location && (
						<span className="flex items-center gap-1">
							<MapPin className="h-3 w-3" />
							{personalInfo.location}
						</span>
					)}
					{personalInfo?.linkedIn && (
						<a
							href={
								personalInfo.linkedIn.startsWith("http")
									? personalInfo.linkedIn
									: `https://${personalInfo.linkedIn}`
							}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-1 hover:underline text-blue-600"
						>
							<Linkedin className="h-3 w-3" />
							LinkedIn
						</a>
					)}
					{personalInfo?.github && (
						<a
							href={
								personalInfo.github.startsWith("http")
									? personalInfo.github
									: `https://${personalInfo.github}`
							}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-1 hover:underline text-blue-600"
						>
							<Github className="h-3 w-3" />
							GitHub
						</a>
					)}
				</div>
			</div>

			{/* Summary */}
			{summary && (
				<>
					<Separator className="my-4" />
					<section>
						<h2
							className="font-bold uppercase tracking-wider mb-2"
							style={{ fontSize: `${subHeadingSize}px` }}
						>
							Resumo
						</h2>
						<p className="leading-relaxed" style={{ color: "#4a5568" }}>
							{summary}
						</p>
					</section>
				</>
			)}

			{/* Experience */}
			{experiences && experiences.length > 0 && (
				<>
					<Separator className="my-4" />
					<section>
						<h2
							className="font-bold uppercase tracking-wider mb-3"
							style={{ fontSize: `${subHeadingSize}px` }}
						>
							Experiência Profissional
						</h2>
						<div className="space-y-4">
							{experiences.map((exp) => (
								<div key={exp.id}>
									<div className="flex justify-between items-start">
										<div>
											<h3 className="font-semibold">{exp.position}</h3>
											<p style={{ color: "#4a5568" }}>{exp.company}</p>
										</div>
										<span
											style={{ fontSize: `${smallSize}px`, color: "#718096" }}
										>
											{formatDate(exp.startDate)} -{" "}
											{exp.current ? "Presente" : formatDate(exp.endDate)}
										</span>
									</div>
									{exp.description && (
										<p
											className="mt-1"
											style={{ fontSize: `${smallSize}px`, color: "#4a5568" }}
										>
											{exp.description}
										</p>
									)}
									{exp.highlights.length > 0 && (
										<ul
											className="list-disc list-inside mt-1"
											style={{ fontSize: `${smallSize}px`, color: "#4a5568" }}
										>
											{exp.highlights.map((h, i) => (
												<li key={i}>{h}</li>
											))}
										</ul>
									)}
								</div>
							))}
						</div>
					</section>
				</>
			)}

			{/* Education */}
			{education && education.length > 0 && (
				<>
					<Separator className="my-4" />
					<section>
						<h2
							className="font-bold uppercase tracking-wider mb-3"
							style={{ fontSize: `${subHeadingSize}px` }}
						>
							Educação
						</h2>
						<div className="space-y-3">
							{education.map((edu) => (
								<div key={edu.id} className="flex justify-between items-start">
									<div>
										<h3 className="font-semibold">
											{edu.degree} em {edu.field}
										</h3>
										<p style={{ color: "#4a5568" }}>{edu.institution}</p>
										{edu.gpa && (
											<p
												style={{ fontSize: `${smallSize}px`, color: "#718096" }}
											>
												CR: {edu.gpa}
											</p>
										)}
									</div>
									<span
										style={{ fontSize: `${smallSize}px`, color: "#718096" }}
									>
										{formatDate(edu.startDate)} -{" "}
										{edu.current ? "Presente" : formatDate(edu.endDate)}
									</span>
								</div>
							))}
						</div>
					</section>
				</>
			)}

			{/* Skills */}
			{skills && skills.length > 0 && (
				<>
					<Separator className="my-4" />
					<section>
						<h2
							className="font-bold uppercase tracking-wider mb-2"
							style={{ fontSize: `${subHeadingSize}px` }}
						>
							Habilidades
						</h2>
						<div className="flex flex-wrap gap-1.5">
							{skills.map((skill) => (
								<span
									key={skill.id}
									className="px-2 py-0.5 bg-gray-100 rounded"
									style={{ fontSize: `${smallSize}px` }}
								>
									{skill.name}
								</span>
							))}
						</div>
					</section>
				</>
			)}
		</div>
	);
}
