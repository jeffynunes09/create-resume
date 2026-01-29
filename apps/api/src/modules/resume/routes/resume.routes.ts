import { Router } from "express";
import {
  createResumeController,
  getResumesController,
  getResumeByIdController,
  updateResumeController,
  deleteResumeController,
} from "../controllers/index.js";
import { authMiddleware } from "../../auth/index.js";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.post("/", createResumeController);
router.get("/", getResumesController);
router.get("/:id", getResumeByIdController);
router.put("/:id", updateResumeController);
router.delete("/:id", deleteResumeController);

export default router;
