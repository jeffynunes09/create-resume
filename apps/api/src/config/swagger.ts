import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Create Resume API",
			version: "1.0.0",
			description: "API para gerenciamento de currículos profissionais",
			contact: {
				name: "API Support",
			},
		},
		servers: [
			{
				url: "http://localhost:3000",
				description: "Development server",
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
			schemas: {
				PersonalInfo: {
					type: "object",
					required: ["fullName", "email"],
					properties: {
						fullName: { type: "string", example: "João Silva" },
						email: {
							type: "string",
							format: "email",
							example: "joao@email.com",
						},
						phone: { type: "string", example: "(11) 99999-9999" },
						location: { type: "string", example: "São Paulo, SP" },
						linkedIn: { type: "string", example: "linkedin.com/in/joaosilva" },
						github: { type: "string", example: "github.com/joaosilva" },
						website: { type: "string", example: "joaosilva.dev" },
					},
				},
				Experience: {
					type: "object",
					required: ["company", "position", "startDate"],
					properties: {
						id: { type: "string", format: "uuid" },
						company: { type: "string", example: "Tech Company" },
						position: { type: "string", example: "Desenvolvedor Full Stack" },
						startDate: { type: "string", format: "date", example: "2022-01" },
						endDate: { type: "string", format: "date", example: "2024-01" },
						current: { type: "boolean", default: false },
						description: { type: "string" },
						highlights: { type: "array", items: { type: "string" } },
					},
				},
				Education: {
					type: "object",
					required: ["institution", "degree", "field"],
					properties: {
						id: { type: "string", format: "uuid" },
						institution: {
							type: "string",
							example: "Universidade de São Paulo",
						},
						degree: { type: "string", example: "Bacharelado" },
						field: { type: "string", example: "Ciência da Computação" },
						startDate: { type: "string", format: "date" },
						endDate: { type: "string", format: "date" },
						current: { type: "boolean", default: false },
						gpa: { type: "string", example: "8.5" },
					},
				},
				Skill: {
					type: "object",
					required: ["name"],
					properties: {
						id: { type: "string", format: "uuid" },
						name: { type: "string", example: "React" },
						level: {
							type: "string",
							enum: ["beginner", "intermediate", "advanced", "expert"],
						},
						category: { type: "string", example: "Frontend" },
					},
				},
				Resume: {
					type: "object",
					properties: {
						id: { type: "string", format: "uuid" },
						personalInfo: { $ref: "#/components/schemas/PersonalInfo" },
						summary: { type: "string" },
						experiences: {
							type: "array",
							items: { $ref: "#/components/schemas/Experience" },
						},
						education: {
							type: "array",
							items: { $ref: "#/components/schemas/Education" },
						},
						skills: {
							type: "array",
							items: { $ref: "#/components/schemas/Skill" },
						},
						createdAt: { type: "string", format: "date-time" },
						updatedAt: { type: "string", format: "date-time" },
					},
				},
				CreateResumeInput: {
					type: "object",
					required: ["personalInfo"],
					properties: {
						personalInfo: { $ref: "#/components/schemas/PersonalInfo" },
						summary: { type: "string" },
						experiences: {
							type: "array",
							items: { $ref: "#/components/schemas/Experience" },
						},
						education: {
							type: "array",
							items: { $ref: "#/components/schemas/Education" },
						},
						skills: {
							type: "array",
							items: { $ref: "#/components/schemas/Skill" },
						},
					},
				},
				LoginInput: {
					type: "object",
					required: ["email", "password"],
					properties: {
						email: {
							type: "string",
							format: "email",
							example: "user@example.com",
						},
						password: { type: "string", minLength: 6, example: "password123" },
					},
				},
				RegisterInput: {
					type: "object",
					required: ["email", "password", "confirmPassword"],
					properties: {
						email: {
							type: "string",
							format: "email",
							example: "newuser@example.com",
						},
						password: { type: "string", minLength: 6, example: "password123" },
						confirmPassword: {
							type: "string",
							minLength: 6,
							example: "password123",
						},
					},
				},
				AuthResponse: {
					type: "object",
					properties: {
						user: {
							type: "object",
							properties: {
								id: { type: "string" },
								email: { type: "string" },
							},
						},
						token: { type: "string" },
					},
				},
				Error: {
					type: "object",
					properties: {
						error: { type: "string" },
						details: { type: "object" },
					},
				},
			},
		},
		security: [{ bearerAuth: [] }],
	},
	apis: ["./src/modules/**/routes/*.ts", "./src/modules/**/controllers/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
