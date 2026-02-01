import { buildRoute, ROUTES_PATH } from "@create-resume/routes";
import {
	AlignmentType,
	Document,
	HeadingLevel,
	Packer,
	Paragraph,
	TextRun,
} from "docx";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
	ArrowLeft,
	Download,
	Edit,
	FileText,
	Loader2,
	Trash2,
} from "lucide-react";
import { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ResumePreview } from "../components/ResumePreview";
import { useDeleteResume } from "../hooks/useDeleteResume";
import { useResume } from "../hooks/useResume";

const FONTS = [
	{ value: "inter", label: "Inter" },
	{ value: "arial", label: "Arial" },
	{ value: "times", label: "Times New Roman" },
	{ value: "georgia", label: "Georgia" },
	{ value: "roboto", label: "Roboto" },
];

const FONT_SIZES = [
	{ value: "12", label: "12px" },
	{ value: "14", label: "14px" },
	{ value: "16", label: "16px" },
	{ value: "18", label: "18px" },
];

const COLORS = [
	{ value: "#000000", label: "Preto" },
	{ value: "#1a365d", label: "Azul Escuro" },
	{ value: "#2d3748", label: "Cinza Escuro" },
	{ value: "#1a202c", label: "Quase Preto" },
	{ value: "#744210", label: "Marrom" },
];

export function ResumeViewPage() {
	const { id } = useParams<{ id: string }>();
	const { data: resume, isLoading, error } = useResume(id!);
	const { mutate: deleteResume, isPending: isDeleting } = useDeleteResume();
	const previewRef = useRef<HTMLDivElement>(null);

	const [fontFamily, setFontFamily] = useState("inter");
	const [fontSize, setFontSize] = useState("14");
	const [textColor, setTextColor] = useState("#000000");
	const [isDownloading, setIsDownloading] = useState(false);

	const handleDelete = () => {
		if (window.confirm("Tem certeza que deseja excluir este currículo?")) {
			deleteResume(id!);
		}
	};

	const handlePrint = () => {
		window.print();
	};

	const handleDownloadPDF = async () => {
		if (!previewRef.current || !resume) return;

		setIsDownloading(true);
		try {
			const canvas = await html2canvas(previewRef.current, {
				scale: 2,
				useCORS: true,
				logging: false,
				backgroundColor: "#ffffff",
			});

			const imgData = canvas.toDataURL("image/png");
			const pdf = new jsPDF({
				orientation: "portrait",
				unit: "mm",
				format: "a4",
			});

			const imgWidth = 210;
			const imgHeight = (canvas.height * imgWidth) / canvas.width;

			pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

			// Adicionar links clicáveis no PDF
			const links: Array<{ url: string; text: string }> = [];

			if (resume.personalInfo.linkedIn) {
				const linkedInUrl = resume.personalInfo.linkedIn.startsWith("http")
					? resume.personalInfo.linkedIn
					: `https://${resume.personalInfo.linkedIn}`;
				links.push({ url: linkedInUrl, text: "LinkedIn" });
			}

			if (resume.personalInfo.github) {
				const githubUrl = resume.personalInfo.github.startsWith("http")
					? resume.personalInfo.github
					: `https://${resume.personalInfo.github}`;
				links.push({ url: githubUrl, text: "GitHub" });
			}

			if (links.length > 0) {
				// Encontrar os elementos de link no DOM e calcular suas posições
				const previewElement = previewRef.current;
				const previewRect = previewElement.getBoundingClientRect();
				const scale = imgWidth / previewRect.width;

				const linkElements = previewElement.querySelectorAll(
					'a[href*="linkedin"], a[href*="github"]',
				);
				linkElements.forEach((linkEl) => {
					const rect = linkEl.getBoundingClientRect();
					const x = (rect.left - previewRect.left) * scale;
					const y = (rect.top - previewRect.top) * scale;
					const width = rect.width * scale;
					const height = rect.height * scale;

					const href = linkEl.getAttribute("href");
					if (href) {
						pdf.link(x, y, width, height, { url: href });
					}
				});

				// Também adicionar link do email se existir
				const emailLink = previewElement.querySelector('a[href^="mailto:"]');
				if (emailLink) {
					const rect = emailLink.getBoundingClientRect();
					const x = (rect.left - previewRect.left) * scale;
					const y = (rect.top - previewRect.top) * scale;
					const width = rect.width * scale;
					const height = rect.height * scale;
					const href = emailLink.getAttribute("href");
					if (href) {
						pdf.link(x, y, width, height, { url: href });
					}
				}
			}

			pdf.save(`${resume.personalInfo.fullName || "curriculo"}.pdf`);
		} catch (err) {
			console.error("Erro ao gerar PDF:", err);
			alert("Erro ao gerar PDF. Tente novamente.");
		} finally {
			setIsDownloading(false);
		}
	};

	const handleDownloadDOCX = async () => {
		if (!resume) return;

		setIsDownloading(true);
		try {
			const sections: Paragraph[] = [];

			// Header - Nome
			sections.push(
				new Paragraph({
					children: [
						new TextRun({
							text: resume.personalInfo.fullName || "Seu Nome",
							bold: true,
							size: 48,
							color: textColor.replace("#", ""),
						}),
					],
					alignment: AlignmentType.CENTER,
					spacing: { after: 200 },
				}),
			);

			// Contato
			const contactParts: string[] = [];
			if (resume.personalInfo.email)
				contactParts.push(resume.personalInfo.email);
			if (resume.personalInfo.phone)
				contactParts.push(resume.personalInfo.phone);
			if (resume.personalInfo.location)
				contactParts.push(resume.personalInfo.location);

			if (contactParts.length > 0) {
				sections.push(
					new Paragraph({
						children: [
							new TextRun({
								text: contactParts.join(" | "),
								size: 20,
								color: "666666",
							}),
						],
						alignment: AlignmentType.CENTER,
						spacing: { after: 400 },
					}),
				);
			}

			// Resumo
			if (resume.summary) {
				sections.push(
					new Paragraph({
						text: "RESUMO",
						heading: HeadingLevel.HEADING_2,
						spacing: { before: 400, after: 200 },
					}),
				);
				sections.push(
					new Paragraph({
						children: [new TextRun({ text: resume.summary, size: 22 })],
						spacing: { after: 200 },
					}),
				);
			}

			// Experiência
			if (resume.experiences && resume.experiences.length > 0) {
				sections.push(
					new Paragraph({
						text: "EXPERIÊNCIA PROFISSIONAL",
						heading: HeadingLevel.HEADING_2,
						spacing: { before: 400, after: 200 },
					}),
				);

				for (const exp of resume.experiences) {
					sections.push(
						new Paragraph({
							children: [
								new TextRun({ text: exp.position, bold: true, size: 24 }),
								new TextRun({ text: ` - ${exp.company}`, size: 24 }),
							],
							spacing: { before: 200 },
						}),
					);

					const dateText = `${exp.startDate || ""} - ${exp.current ? "Presente" : exp.endDate || ""}`;
					sections.push(
						new Paragraph({
							children: [
								new TextRun({ text: dateText, size: 20, color: "666666" }),
							],
						}),
					);

					if (exp.description) {
						sections.push(
							new Paragraph({
								children: [new TextRun({ text: exp.description, size: 22 })],
								spacing: { before: 100 },
							}),
						);
					}

					for (const highlight of exp.highlights) {
						sections.push(
							new Paragraph({
								children: [new TextRun({ text: `• ${highlight}`, size: 22 })],
								indent: { left: 360 },
							}),
						);
					}
				}
			}

			// Educação
			if (resume.education && resume.education.length > 0) {
				sections.push(
					new Paragraph({
						text: "EDUCAÇÃO",
						heading: HeadingLevel.HEADING_2,
						spacing: { before: 400, after: 200 },
					}),
				);

				for (const edu of resume.education) {
					sections.push(
						new Paragraph({
							children: [
								new TextRun({
									text: `${edu.degree} em ${edu.field}`,
									bold: true,
									size: 24,
								}),
							],
							spacing: { before: 200 },
						}),
					);
					sections.push(
						new Paragraph({
							children: [new TextRun({ text: edu.institution, size: 22 })],
						}),
					);
					const dateText = `${edu.startDate || ""} - ${edu.current ? "Presente" : edu.endDate || ""}`;
					sections.push(
						new Paragraph({
							children: [
								new TextRun({ text: dateText, size: 20, color: "666666" }),
							],
						}),
					);
				}
			}

			// Habilidades
			if (resume.skills && resume.skills.length > 0) {
				sections.push(
					new Paragraph({
						text: "HABILIDADES",
						heading: HeadingLevel.HEADING_2,
						spacing: { before: 400, after: 200 },
					}),
				);
				sections.push(
					new Paragraph({
						children: [
							new TextRun({
								text: resume.skills.map((s) => s.name).join(" • "),
								size: 22,
							}),
						],
					}),
				);
			}

			const doc = new Document({
				sections: [{ children: sections }],
			});

			const blob = await Packer.toBlob(doc);
			saveAs(blob, `${resume.personalInfo.fullName || "curriculo"}.docx`);
		} catch (err) {
			console.error("Erro ao gerar DOCX:", err);
			alert("Erro ao gerar DOCX. Tente novamente.");
		} finally {
			setIsDownloading(false);
		}
	};

	const getFontFamilyStyle = () => {
		switch (fontFamily) {
			case "arial":
				return "Arial, sans-serif";
			case "times":
				return "'Times New Roman', Times, serif";
			case "georgia":
				return "Georgia, serif";
			case "roboto":
				return "Roboto, sans-serif";
			default:
				return "Inter, system-ui, sans-serif";
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-[calc(100vh-8rem)]">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (error || !resume) {
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
		<div className="px-4 lg:px-0">
			{/* Header */}
			<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 print:hidden">
				<div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
					<Button variant="ghost" size="sm" asChild className="w-fit">
						<Link to={ROUTES_PATH.DASHBOARD}>
							<ArrowLeft className="h-4 w-4 mr-2" />
							Voltar
						</Link>
					</Button>
					<div>
						<h1 className="text-xl sm:text-2xl font-bold">
							{resume.personalInfo.fullName}
						</h1>
						<p className="text-sm text-muted-foreground">
							{resume.personalInfo.email}
						</p>
					</div>
				</div>

				<div className="flex gap-2">
					<Button
						variant="outline"
						size="sm"
						asChild
						className="flex-1 sm:flex-none"
					>
						<Link to={buildRoute.resumeEdit(id!)}>
							<Edit className="h-4 w-4 mr-2" />
							Editar
						</Link>
					</Button>
					<Button
						variant="destructive"
						size="sm"
						onClick={handleDelete}
						disabled={isDeleting}
						className="flex-1 sm:flex-none"
					>
						<Trash2 className="h-4 w-4 mr-2" />
						{isDeleting ? "Excluindo..." : "Excluir"}
					</Button>
				</div>
			</div>

			{/* Formatting Controls */}
			<div className="flex flex-col lg:flex-row lg:flex-wrap lg:items-center gap-4 mb-6 p-4 bg-muted/50 rounded-lg print:hidden">
				{/* Customization Options */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:flex lg:flex-wrap lg:items-center lg:gap-4">
					<div className="flex items-center gap-2">
						<span className="text-sm font-medium whitespace-nowrap">
							Fonte:
						</span>
						<Select value={fontFamily} onValueChange={setFontFamily}>
							<SelectTrigger className="w-full sm:w-[150px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{FONTS.map((font) => (
									<SelectItem key={font.value} value={font.value}>
										{font.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="flex items-center gap-2">
						<span className="text-sm font-medium whitespace-nowrap">
							Tamanho:
						</span>
						<Select value={fontSize} onValueChange={setFontSize}>
							<SelectTrigger className="w-full sm:w-[100px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{FONT_SIZES.map((size) => (
									<SelectItem key={size.value} value={size.value}>
										{size.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="flex items-center gap-2">
						<span className="text-sm font-medium whitespace-nowrap">Cor:</span>
						<Select value={textColor} onValueChange={setTextColor}>
							<SelectTrigger className="w-full sm:w-[140px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{COLORS.map((color) => (
									<SelectItem key={color.value} value={color.value}>
										<div className="flex items-center gap-2">
											<div
												className="w-4 h-4 rounded border"
												style={{ backgroundColor: color.value }}
											/>
											{color.label}
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="hidden lg:block lg:flex-1" />

				{/* Download Buttons */}
				<div className="grid grid-cols-3 gap-2 sm:flex sm:gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={handleDownloadPDF}
						disabled={isDownloading}
						className="flex-1 sm:flex-none"
					>
						<Download className="h-4 w-4 sm:mr-2" />
						<span className="hidden sm:inline">PDF</span>
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={handleDownloadDOCX}
						disabled={isDownloading}
						className="flex-1 sm:flex-none"
					>
						<FileText className="h-4 w-4 sm:mr-2" />
						<span className="hidden sm:inline">DOCX</span>
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={handlePrint}
						className="flex-1 sm:flex-none"
					>
						<Download className="h-4 w-4 sm:mr-2" />
						<span className="hidden sm:inline">Imprimir</span>
					</Button>
				</div>
			</div>

			{/* Preview */}
			<div className="flex justify-center overflow-x-auto">
				<div
					ref={previewRef}
					className="w-full max-w-[210mm] shadow-lg print:shadow-none print:max-w-none"
					style={{
						fontFamily: getFontFamilyStyle(),
						fontSize: `${fontSize}px`,
						color: textColor,
					}}
				>
					<ResumePreview
						data={resume}
						fontFamily={getFontFamilyStyle()}
						fontSize={fontSize}
						textColor={textColor}
					/>
				</div>
			</div>
		</div>
	);
}
