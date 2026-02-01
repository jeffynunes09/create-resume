import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../services/index.js";

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Express {
		interface Request {
			user?: {
				userId: string;
				email: string;
			};
		}
	}
}

export function authMiddleware(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		res.status(401).json({ error: "Token não fornecido" });
		return;
	}

	const parts = authHeader.split(" ");

	if (parts.length !== 2) {
		res.status(401).json({ error: "Token mal formatado" });
		return;
	}

	const [scheme, token] = parts as [string, string];

	if (!/^Bearer$/i.test(scheme)) {
		res.status(401).json({ error: "Token mal formatado" });
		return;
	}

	try {
		const decoded = verifyToken(token);
		req.user = decoded;
		next();
	} catch {
		res.status(401).json({ error: "Token inválido ou expirado" });
	}
}
