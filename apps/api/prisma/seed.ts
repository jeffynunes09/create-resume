import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
	return bcrypt.hash(password, 10);
}

async function main() {
	console.log("Seeding database...");

	const adminPassword = await hashPassword("admin123");

	const admin = await prisma.user.upsert({
		where: { email: "admin@example.com" },
		update: { password: adminPassword },
		create: {
			email: "admin@example.com",
			password: adminPassword,
		},
	});

	console.log("Created admin user:", admin.email);

	const userPassword = await hashPassword("user123");

	const user = await prisma.user.upsert({
		where: { email: "user@example.com" },
		update: { password: userPassword },
		create: {
			email: "user@example.com",
			password: userPassword,
		},
	});

	console.log("Created user:", user.email);

	console.log("Seeding completed!");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
