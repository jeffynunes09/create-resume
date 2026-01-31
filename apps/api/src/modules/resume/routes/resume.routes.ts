import { Router, type Router as RouterType } from "express";
import {
  createResumeController,
  getResumesController,
  getResumeByIdController,
  updateResumeController,
  deleteResumeController,
} from "../controllers/index.js";
import { authMiddleware } from "../../auth/index.js";

const router: RouterType = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /resumes:
 *   post:
 *     summary: Criar novo currículo
 *     tags: [Resumes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateResumeInput'
 *     responses:
 *       201:
 *         description: Currículo criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resume'
 *       401:
 *         description: Não autorizado
 */
router.post("/", createResumeController);

/**
 * @swagger
 * /resumes:
 *   get:
 *     summary: Listar todos os currículos
 *     tags: [Resumes]
 *     responses:
 *       200:
 *         description: Lista de currículos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Resume'
 *       401:
 *         description: Não autorizado
 */
router.get("/", getResumesController);

/**
 * @swagger
 * /resumes/{id}:
 *   get:
 *     summary: Buscar currículo por ID
 *     tags: [Resumes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do currículo
 *     responses:
 *       200:
 *         description: Currículo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resume'
 *       404:
 *         description: Currículo não encontrado
 *       401:
 *         description: Não autorizado
 */
router.get("/:id", getResumeByIdController);

/**
 * @swagger
 * /resumes/{id}:
 *   put:
 *     summary: Atualizar currículo
 *     tags: [Resumes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do currículo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateResumeInput'
 *     responses:
 *       200:
 *         description: Currículo atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resume'
 *       404:
 *         description: Currículo não encontrado
 *       401:
 *         description: Não autorizado
 */
router.put("/:id", updateResumeController);

/**
 * @swagger
 * /resumes/{id}:
 *   delete:
 *     summary: Excluir currículo
 *     tags: [Resumes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do currículo
 *     responses:
 *       204:
 *         description: Currículo excluído com sucesso
 *       404:
 *         description: Currículo não encontrado
 *       401:
 *         description: Não autorizado
 */
router.delete("/:id", deleteResumeController);

export default router;
