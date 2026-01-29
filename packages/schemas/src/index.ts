import { z } from "zod";

export const personalInfoSchema = z.object({
  fullName: z.string().min(1, "Nome completo é obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedIn: z.string().url().optional().or(z.literal("")),
  github: z.string().url().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
});

export const experienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1, "Empresa é obrigatória"),
  position: z.string().min(1, "Cargo é obrigatório"),
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean(),
  description: z.string(),
  highlights: z.array(z.string()),
});

export const educationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, "Instituição é obrigatória"),
  degree: z.string().min(1, "Grau é obrigatório"),
  field: z.string().min(1, "Área é obrigatória"),
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean(),
  gpa: z.string().optional(),
});

export const skillLevelSchema = z.enum([
  "beginner",
  "intermediate",
  "advanced",
  "expert",
]);

export const skillSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nome da skill é obrigatório"),
  level: skillLevelSchema.optional(),
  category: z.string().optional(),
});

export const resumeSchema = z.object({
  id: z.string(),
  personalInfo: personalInfoSchema,
  summary: z.string().optional(),
  experiences: z.array(experienceSchema),
  education: z.array(educationSchema),
  skills: z.array(skillSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createResumeSchema = resumeSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});


export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export const updateResumeSchema = createResumeSchema.partial();

// Type exports from schemas
export type PersonalInfoInput = z.infer<typeof personalInfoSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ExperienceInput = z.infer<typeof experienceSchema>;
export type EducationInput = z.infer<typeof educationSchema>;
export type SkillInput = z.infer<typeof skillSchema>;
export type ResumeInput = z.infer<typeof resumeSchema>;
export type CreateResumeInput = z.infer<typeof createResumeSchema>;
export type UpdateResumeInput = z.infer<typeof updateResumeSchema>;
