import { loginSchema, registerSchema } from "@create-resume/schemas";
import type { Request, Response } from "express";
import { login, register } from "../services/index.js";

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

export async function registerController(req: Request, res: Response) {
  try {
    const validation = registerSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        error: "Dados inválidos",
        details: validation.error.flatten().fieldErrors,
      });
      return;
    }

    const result = await register(validation.data);

    res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Este email já está em uso") {
        res.status(409).json({ error: error.message });
        return;
      }
      if (
        error.message === "As senhas não coincidem" ||
        error.message === "A senha deve ter pelo menos 6 caracteres"
      ) {
        res.status(400).json({ error: error.message });
        return;
      }
    }

    console.error("Register error:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}
