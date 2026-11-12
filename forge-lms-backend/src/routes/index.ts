import { Router } from "express";
import authRoutes from "./auth.routes.js";
import courseRoutes from "./course.routes.js";
import lectureRoutes from "./lecture.routes.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

router.use("/auth", authRoutes);
router.use("/courses", courseRoutes);
router.use("/courses", lectureRoutes);

export default router;
