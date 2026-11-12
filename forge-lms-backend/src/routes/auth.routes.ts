import { Router } from "express";
import rateLimit from "express-rate-limit";
import { login, getMe } from "../controllers/auth.controller.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { validate } from "../middleware/validate.js";
import { loginSchema } from "../validators/auth.schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { env } from "../config/env.js";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.LOGIN_RATE_LIMIT_MAX,
  message: {
    success: false,
    error: {
      code: "RATE_LIMITED",
      message: "Too many login attempts. Please try again after 15 minutes.",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/login", loginLimiter, validate(loginSchema), asyncHandler(login));
router.get("/me", requireAdmin, asyncHandler(getMe));

export default router;
