import type { Request, Response } from "express";
import {
	createResume,
	deleteResume,
	getResumeById,
	getResumes,
	updateResume,
} from "../services/index.js";

export async function createResumeController(req: Request, res: Response) {
	try {
		const userId = req.user?.userId;

		if (!userId) {
			res.status(401).json({ error: "Não autorizado" });
			return;
		}

		const resume = await createResume({
			userId,
			...req.body,
		});

		res.status(201).json(resume);
	} catch (error) {
		console.error("Error creating resume:", error);
		res.status(500).json({ error: "Erro ao criar currículo" });
	}
}

export async function getResumesController(_req: Request, res: Response) {
	try {
		const resumes = await getResumes();
		res.json(resumes);
	} catch (error) {
		console.error("Error fetching resumes:", error);
		res.status(500).json({ error: "Erro ao buscar currículos" });
	}
}

export async function getResumeByIdController(req: Request, res: Response) {
	try {
		const id = req.params.id as string;
		const resume = await getResumeById(id);

		if (!resume) {
			res.status(404).json({ error: "Currículo não encontrado" });
			return;
		}

		res.json(resume);
	} catch (error) {
		console.error("Error fetching resume:", error);
		res.status(500).json({ error: "Erro ao buscar currículo" });
	}
}

export async function updateResumeController(req: Request, res: Response) {
	try {
		const id = req.params.id as string;

		const existing = await getResumeById(id);
		if (!existing) {
			res.status(404).json({ error: "Currículo não encontrado" });
			return;
		}

		const resume = await updateResume(id, req.body);
		res.json(resume);
	} catch (error) {
		console.error("Error updating resume:", error);
		res.status(500).json({ error: "Erro ao atualizar currículo" });
	}
}

export async function deleteResumeController(req: Request, res: Response) {
	try {
		const id = req.params.id as string;

		const existing = await getResumeById(id);
		if (!existing) {
			res.status(404).json({ error: "Currículo não encontrado" });
			return;
		}

		await deleteResume(id);
		res.status(204).send();
	} catch (error) {
		console.error("Error deleting resume:", error);
		res.status(500).json({ error: "Erro ao deletar currículo" });
	}
}
