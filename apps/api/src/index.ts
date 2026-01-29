import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./database/prisma.js";
import { authRoutes } from "./modules/auth/index.js";
import { resumeRoutes } from "./modules/resume/index.js";

const app = express();
const PORT = process.env.API_PORT || 3001;
const HOST = process.env.API_HOST || "0.0.0.0";

app.use(cors());
app.use(express.json());

// Routes
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/resumes", resumeRoutes);

// Start server
app.listen(Number(PORT), HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
