import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	type CreateResumeInput,
	createResume,
	deleteResume,
	getResumeById,
	getResumes,
	updateResume,
} from "./resume.service";

// Mock do Prisma
vi.mock("../../../database/prisma.js", () => ({
	prisma: {
		resume: {
			create: vi.fn(),
			findMany: vi.fn(),
			findUnique: vi.fn(),
			update: vi.fn(),
			delete: vi.fn(),
		},
		experience: {
			deleteMany: vi.fn(),
		},
		education: {
			deleteMany: vi.fn(),
		},
		skill: {
			deleteMany: vi.fn(),
		},
		$transaction: vi.fn(),
	},
}));

// Importar o mock após a definição
const { prisma } = await import("../../../database/prisma.js");

describe("Resume Service", () => {
	const mockResumeData: CreateResumeInput = {
		userId: "user-123",
		summary: "Software Engineer with 5 years of experience",
		personalInfo: {
			fullName: "John Doe",
			email: "john@example.com",
			phone: "+1234567890",
			location: "San Francisco, CA",
			linkedIn: "linkedin.com/in/johndoe",
			github: "github.com/johndoe",
			website: "johndoe.com",
		},
		experiences: [
			{
				company: "Tech Corp",
				position: "Senior Developer",
				startDate: "2020-01",
				endDate: "2024-01",
				current: false,
				description: "Led development team",
				highlights: ["Built microservices", "Improved performance"],
			},
		],
		education: [
			{
				institution: "University of Tech",
				degree: "Bachelor of Science",
				field: "Computer Science",
				startDate: "2015-09",
				endDate: "2019-05",
				current: false,
				gpa: "3.8",
			},
		],
		skills: [
			{
				name: "JavaScript",
				level: "expert",
				category: "Programming",
			},
		],
	};

	const mockPrismaResume = {
		id: "resume-123",
		summary: "Software Engineer with 5 years of experience",
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-01"),
		personalInfo: {
			id: "info-123",
			resumeId: "resume-123",
			fullName: "John Doe",
			email: "john@example.com",
			phone: "+1234567890",
			location: "San Francisco, CA",
			linkedIn: "linkedin.com/in/johndoe",
			github: "github.com/johndoe",
			website: "johndoe.com",
		},
		experiences: [
			{
				id: "exp-123",
				resumeId: "resume-123",
				company: "Tech Corp",
				position: "Senior Developer",
				startDate: "2020-01",
				endDate: "2024-01",
				current: false,
				description: "Led development team",
				highlights: ["Built microservices", "Improved performance"],
			},
		],
		education: [
			{
				id: "edu-123",
				resumeId: "resume-123",
				institution: "University of Tech",
				degree: "Bachelor of Science",
				field: "Computer Science",
				startDate: "2015-09",
				endDate: "2019-05",
				current: false,
				gpa: "3.8",
			},
		],
		skills: [
			{
				id: "skill-123",
				resumeId: "resume-123",
				name: "JavaScript",
				level: "expert" as const,
				category: "Programming",
			},
		],
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("createResume", () => {
		it("should create a new resume with all related data", async () => {
			vi.mocked(prisma.resume.create).mockResolvedValue(mockPrismaResume);

			const result = await createResume(mockResumeData);

			expect(prisma.resume.create).toHaveBeenCalledWith({
				data: {
					summary: mockResumeData.summary,
					personalInfo: {
						create: mockResumeData.personalInfo,
					},
					experiences: {
						create: mockResumeData.experiences,
					},
					education: {
						create: mockResumeData.education,
					},
					skills: {
						create: mockResumeData.skills,
					},
				},
				include: {
					personalInfo: true,
					experiences: true,
					education: true,
					skills: true,
				},
			});

			expect(result).toEqual({
				id: "resume-123",
				summary: "Software Engineer with 5 years of experience",
				personalInfo: {
					fullName: "John Doe",
					email: "john@example.com",
					phone: "+1234567890",
					location: "San Francisco, CA",
					linkedIn: "linkedin.com/in/johndoe",
					github: "github.com/johndoe",
					website: "johndoe.com",
				},
				experiences: [
					{
						id: "exp-123",
						company: "Tech Corp",
						position: "Senior Developer",
						startDate: "2020-01",
						endDate: "2024-01",
						current: false,
						description: "Led development team",
						highlights: ["Built microservices", "Improved performance"],
					},
				],
				education: [
					{
						id: "edu-123",
						institution: "University of Tech",
						degree: "Bachelor of Science",
						field: "Computer Science",
						startDate: "2015-09",
						endDate: "2019-05",
						current: false,
						gpa: "3.8",
					},
				],
				skills: [
					{
						id: "skill-123",
						name: "JavaScript",
						level: "expert",
						category: "Programming",
					},
				],
				createdAt: "2024-01-01T00:00:00.000Z",
				updatedAt: "2024-01-01T00:00:00.000Z",
			});
		});
	});

	describe("getResumes", () => {
		it("should return all resumes ordered by updatedAt", async () => {
			vi.mocked(prisma.resume.findMany).mockResolvedValue([mockPrismaResume]);

			const result = await getResumes();

			expect(prisma.resume.findMany).toHaveBeenCalledWith({
				include: {
					personalInfo: true,
					experiences: true,
					education: true,
					skills: true,
				},
				orderBy: {
					updatedAt: "desc",
				},
			});

			expect(result).toHaveLength(1);
			expect(result[0].id).toBe("resume-123");
		});

		it("should return empty array when no resumes exist", async () => {
			vi.mocked(prisma.resume.findMany).mockResolvedValue([]);

			const result = await getResumes();

			expect(result).toEqual([]);
		});
	});

	describe("getResumeById", () => {
		it("should return resume when found", async () => {
			vi.mocked(prisma.resume.findUnique).mockResolvedValue(mockPrismaResume);

			const result = await getResumeById("resume-123");

			expect(prisma.resume.findUnique).toHaveBeenCalledWith({
				where: { id: "resume-123" },
				include: {
					personalInfo: true,
					experiences: true,
					education: true,
					skills: true,
				},
			});

			expect(result).toBeDefined();
			expect(result?.id).toBe("resume-123");
		});

		it("should return null when resume not found", async () => {
			vi.mocked(prisma.resume.findUnique).mockResolvedValue(null);

			const result = await getResumeById("non-existent");

			expect(result).toBeNull();
		});
	});

	describe("updateResume", () => {
		it("should update resume and related data", async () => {
			const updateData: Partial<CreateResumeInput> = {
				summary: "Updated summary",
				personalInfo: {
					fullName: "Jane Doe",
					email: "jane@example.com",
				},
			};

			vi.mocked(prisma.$transaction).mockResolvedValue([{}, {}, {}]);
			vi.mocked(prisma.resume.update).mockResolvedValue({
				...mockPrismaResume,
				summary: "Updated summary",
				personalInfo: {
					...mockPrismaResume.personalInfo,
					fullName: "Jane Doe",
					email: "jane@example.com",
				},
			});

			const result = await updateResume("resume-123", updateData);

			expect(prisma.$transaction).toHaveBeenCalled();
			expect(prisma.resume.update).toHaveBeenCalledWith({
				where: { id: "resume-123" },
				data: {
					summary: "Updated summary",
					personalInfo: {
						upsert: {
							create: updateData.personalInfo,
							update: updateData.personalInfo,
						},
					},
					experiences: undefined,
					education: undefined,
					skills: undefined,
				},
				include: {
					personalInfo: true,
					experiences: true,
					education: true,
					skills: true,
				},
			});

			expect(result.summary).toBe("Updated summary");
		});
	});

	describe("deleteResume", () => {
		it("should delete resume by id", async () => {
			vi.mocked(prisma.resume.delete).mockResolvedValue(mockPrismaResume);

			await deleteResume("resume-123");

			expect(prisma.resume.delete).toHaveBeenCalledWith({
				where: { id: "resume-123" },
			});
		});
	});
});
