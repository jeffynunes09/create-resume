import { prisma } from "../../../database/prisma.js";
import type { Resume } from "@create-resume/shared-types";
import type { Prisma } from "@prisma/client";

export interface CreateResumeInput {
  userId: string;
  summary?: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
    linkedIn?: string;
    github?: string;
    website?: string;
  };
  experiences: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description?: string;
    highlights: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    gpa?: string;
  }>;
  skills: Array<{
    name: string;
    level?: "beginner" | "intermediate" | "advanced" | "expert";
    category?: string;
  }>;
}

export async function createResume(input: CreateResumeInput) {
  const resume = await prisma.resume.create({
    data: {
      summary: input.summary,
      personalInfo: {
        create: input.personalInfo,
      },
      experiences: {
        create: input.experiences,
      },
      education: {
        create: input.education,
      },
      skills: {
        create: input.skills,
      },
    },
    include: {
      personalInfo: true,
      experiences: true,
      education: true,
      skills: true,
    },
  });

  return formatResume(resume);
}

export async function getResumes() {
  const resumes = await prisma.resume.findMany({
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

  return resumes.map(formatResume);
}

export async function getResumeById(id: string) {
  const resume = await prisma.resume.findUnique({
    where: { id },
    include: {
      personalInfo: true,
      experiences: true,
      education: true,
      skills: true,
    },
  });

  if (!resume) {
    return null;
  }

  return formatResume(resume);
}

export async function updateResume(
  id: string,
  input: Partial<CreateResumeInput>
) {
  // Delete existing related records
  await prisma.$transaction([
    prisma.experience.deleteMany({ where: { resumeId: id } }),
    prisma.education.deleteMany({ where: { resumeId: id } }),
    prisma.skill.deleteMany({ where: { resumeId: id } }),
  ]);

  const resume = await prisma.resume.update({
    where: { id },
    data: {
      summary: input.summary,
      personalInfo: input.personalInfo
        ? {
            upsert: {
              create: input.personalInfo,
              update: input.personalInfo,
            },
          }
        : undefined,
      experiences: input.experiences
        ? {
            create: input.experiences,
          }
        : undefined,
      education: input.education
        ? {
            create: input.education,
          }
        : undefined,
      skills: input.skills
        ? {
            create: input.skills,
          }
        : undefined,
    },
    include: {
      personalInfo: true,
      experiences: true,
      education: true,
      skills: true,
    },
  });

  return formatResume(resume);
}

export async function deleteResume(id: string) {
  await prisma.resume.delete({
    where: { id },
  });
}

type ResumeWithRelations = Prisma.ResumeGetPayload<{
  include: {
    personalInfo: true;
    experiences: true;
    education: true;
    skills: true;
  };
}>;

function formatResume(resume: ResumeWithRelations): Resume {
  return {
    id: resume.id,
    summary: resume.summary ?? undefined,
    personalInfo: resume.personalInfo
      ? {
          fullName: resume.personalInfo.fullName,
          email: resume.personalInfo.email,
          phone: resume.personalInfo.phone ?? undefined,
          location: resume.personalInfo.location ?? undefined,
          linkedIn: resume.personalInfo.linkedIn ?? undefined,
          github: resume.personalInfo.github ?? undefined,
          website: resume.personalInfo.website ?? undefined,
        }
      : { fullName: "", email: "" },
    experiences: resume.experiences.map((exp) => ({
      id: exp.id,
      company: exp.company,
      position: exp.position,
      startDate: exp.startDate,
      endDate: exp.endDate ?? undefined,
      current: exp.current,
      description: exp.description ?? "",
      highlights: exp.highlights,
    })),
    education: resume.education.map((edu) => ({
      id: edu.id,
      institution: edu.institution,
      degree: edu.degree,
      field: edu.field,
      startDate: edu.startDate,
      endDate: edu.endDate ?? undefined,
      current: edu.current,
      gpa: edu.gpa ?? undefined,
    })),
    skills: resume.skills.map((skill) => ({
      id: skill.id,
      name: skill.name,
      level: skill.level ?? undefined,
      category: skill.category ?? undefined,
    })),
    createdAt: resume.createdAt.toISOString(),
    updatedAt: resume.updatedAt.toISOString(),
  };
}
