import type { Meta, StoryObj } from "@storybook/react";
import { ResumePreview } from "./ResumePreview";

const meta: Meta<typeof ResumePreview> = {
  title: "Resume/ResumePreview",
  component: ResumePreview,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: "210mm", maxWidth: "100%" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleData = {
  personalInfo: {
    fullName: "João Silva",
    email: "joao.silva@email.com",
    phone: "(11) 99999-9999",
    location: "São Paulo, SP",
    linkedIn: "linkedin.com/in/joaosilva",
    github: "github.com/joaosilva",
  },
  summary:
    "Desenvolvedor Full Stack com 5 anos de experiência em desenvolvimento web. Especializado em React, Node.js e TypeScript. Apaixonado por criar soluções elegantes e escaláveis.",
  experiences: [
    {
      id: "1",
      company: "Tech Company",
      position: "Desenvolvedor Full Stack Senior",
      startDate: "2022-01",
      endDate: "",
      current: true,
      description:
        "Desenvolvimento de aplicações web utilizando React e Node.js",
      highlights: [
        "Liderou equipe de 5 desenvolvedores",
        "Reduziu tempo de carregamento em 40%",
        "Implementou CI/CD com GitHub Actions",
      ],
    },
    {
      id: "2",
      company: "Startup XYZ",
      position: "Desenvolvedor Frontend",
      startDate: "2020-03",
      endDate: "2021-12",
      current: false,
      description: "Desenvolvimento de interfaces responsivas",
      highlights: [
        "Migração de jQuery para React",
        "Implementação de design system",
      ],
    },
  ],
  education: [
    {
      id: "1",
      institution: "Universidade de São Paulo",
      degree: "Bacharelado",
      field: "Ciência da Computação",
      startDate: "2015-02",
      endDate: "2019-12",
      current: false,
      gpa: "8.5",
    },
  ],
  skills: [
    { id: "1", name: "React", level: "expert" as const, category: "Frontend" },
    {
      id: "2",
      name: "TypeScript",
      level: "advanced" as const,
      category: "Frontend",
    },
    {
      id: "3",
      name: "Node.js",
      level: "advanced" as const,
      category: "Backend",
    },
    {
      id: "4",
      name: "PostgreSQL",
      level: "intermediate" as const,
      category: "Database",
    },
    {
      id: "5",
      name: "Docker",
      level: "intermediate" as const,
      category: "DevOps",
    },
  ],
};

export const Default: Story = {
  args: {
    data: sampleData,
  },
};

export const Empty: Story = {
  args: {
    data: {},
  },
};

export const MinimalInfo: Story = {
  args: {
    data: {
      personalInfo: {
        fullName: "Maria Santos",
        email: "maria@email.com",
      },
    },
  },
};

export const CustomFont: Story = {
  args: {
    data: sampleData,
    fontFamily: "Georgia, serif",
    fontSize: "16",
  },
};

export const DarkColor: Story = {
  args: {
    data: sampleData,
    textColor: "#1a365d",
  },
};

export const LargeFontSize: Story = {
  args: {
    data: sampleData,
    fontSize: "18",
  },
};

export const OnlyExperience: Story = {
  args: {
    data: {
      personalInfo: {
        fullName: "Carlos Oliveira",
        email: "carlos@email.com",
        phone: "(21) 98888-8888",
      },
      experiences: sampleData.experiences,
    },
  },
};

export const OnlyEducation: Story = {
  args: {
    data: {
      personalInfo: {
        fullName: "Ana Costa",
        email: "ana@email.com",
      },
      education: sampleData.education,
    },
  },
};

export const WithSummary: Story = {
  args: {
    data: {
      personalInfo: {
        fullName: "Pedro Lima",
        email: "pedro@email.com",
      },
      summary: sampleData.summary,
    },
  },
};
