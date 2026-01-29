import type { Request, Response } from "express";
import { login } from "../services/index.js";
import { loginSchema } from "@create-resume/schemas";



export async function loginController(req: Request, res: Response) {
  try {
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        error: "Dados inválidos",
        details: validation.error.flatten().fieldErrors,
      });
      return;
    }

    const result = await login(validation.data);

    res.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "Credenciais inválidas") {
      res.status(401).json({ error: error.message });
      return;
    }

    console.error("Login error:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}
