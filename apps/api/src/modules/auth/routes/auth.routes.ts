import { Router } from "express";
import { loginController } from "../controllers/index.js";
import { ROUTES_PATH } from "@create-resume/routes";
const router = Router();

router.post(ROUTES_PATH.LOGIN, loginController);

export default router;
