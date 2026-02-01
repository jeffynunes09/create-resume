import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	hashPassword,
	type LoginInput,
	login,
	type RegisterInput,
	register,
	verifyToken,
} from "./auth.service";

// Mock do Prisma
vi.mock("../../../database/prisma.js", () => ({
	prisma: {
		user: {
			findUnique: vi.fn(),
			create: vi.fn(),
		},
	},
}));

// Mock do bcrypt
vi.mock("bcryptjs", () => ({
	default: {
		compare: vi.fn(),
		hash: vi.fn(),
	},
}));

// Mock do jwt
vi.mock("jsonwebtoken", () => ({
	default: {
		sign: vi.fn(),
		verify: vi.fn(),
	},
}));

const { prisma } = await import("../../../database/prisma.js");

describe("Auth Service", () => {
	const mockUser = {
		id: "user-123",
		email: "test@example.com",
		password: "$2a$10$hashedpassword",
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	const mockToken = "mock.jwt.token";

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("login", () => {
		const loginInput: LoginInput = {
			email: "test@example.com",
			password: "password123",
		};

		it("should login successfully with valid credentials", async () => {
			vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
			vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
			vi.mocked(jwt.sign).mockReturnValue(mockToken as never);

			const result = await login(loginInput);

			expect(prisma.user.findUnique).toHaveBeenCalledWith({
				where: { email: "test@example.com" },
			});
			expect(bcrypt.compare).toHaveBeenCalledWith(
				"password123",
				"$2a$10$hashedpassword",
			);
			expect(result).toEqual({
				user: {
					id: "user-123",
					email: "test@example.com",
				},
				token: mockToken,
			});
		});

		it("should throw error when user not found", async () => {
			vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

			await expect(login(loginInput)).rejects.toThrow("Credenciais inválidas");
		});

		it("should throw error when password is invalid", async () => {
			vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
			vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

			await expect(login(loginInput)).rejects.toThrow("Credenciais inválidas");
		});
	});

	describe("register", () => {
		const registerInput: RegisterInput = {
			email: "newuser@example.com",
			password: "password123",
			confirmPassword: "password123",
		};

		it("should register a new user successfully", async () => {
			vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
			vi.mocked(bcrypt.hash).mockResolvedValue(
				"$2a$10$hashedpassword" as never,
			);
			vi.mocked(prisma.user.create).mockResolvedValue({
				...mockUser,
				email: "newuser@example.com",
			});
			vi.mocked(jwt.sign).mockReturnValue(mockToken as never);

			const result = await register(registerInput);

			expect(prisma.user.findUnique).toHaveBeenCalledWith({
				where: { email: "newuser@example.com" },
			});
			expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
			expect(prisma.user.create).toHaveBeenCalledWith({
				data: {
					email: "newuser@example.com",
					password: "$2a$10$hashedpassword",
				},
			});
			expect(result).toEqual({
				user: {
					id: "user-123",
					email: "newuser@example.com",
				},
				token: mockToken,
			});
		});

		it("should throw error when passwords do not match", async () => {
			const input: RegisterInput = {
				email: "test@example.com",
				password: "password123",
				confirmPassword: "different",
			};

			await expect(register(input)).rejects.toThrow("As senhas não coincidem");
		});

		it("should throw error when password is too short", async () => {
			const input: RegisterInput = {
				email: "test@example.com",
				password: "12345",
				confirmPassword: "12345",
			};

			await expect(register(input)).rejects.toThrow(
				"A senha deve ter pelo menos 6 caracteres",
			);
		});

		it("should throw error when email is already in use", async () => {
			vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

			await expect(register(registerInput)).rejects.toThrow(
				"Este email já está em uso",
			);
		});
	});

	describe("hashPassword", () => {
		it("should hash password correctly", async () => {
			const password = "mypassword";
			const hashedPassword = "$2a$10$hashedpassword";

			vi.mocked(bcrypt.hash).mockResolvedValue(hashedPassword as never);

			const result = await hashPassword(password);

			expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
			expect(result).toBe(hashedPassword);
		});
	});

	describe("verifyToken", () => {
		it("should verify and decode token correctly", () => {
			const decodedToken = {
				userId: "user-123",
				email: "test@example.com",
			};

			vi.mocked(jwt.verify).mockReturnValue(decodedToken as never);

			const result = verifyToken(mockToken);

			expect(jwt.verify).toHaveBeenCalledWith(
				mockToken,
				process.env.JWT_SECRET || "your-secret-key-change-in-production",
			);
			expect(result).toEqual(decodedToken);
		});
	});
});
