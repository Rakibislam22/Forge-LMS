import { Router } from "express";
import {
  listLectures,
  getLecture,
  createLecture,
  updateLecture,
  deleteLecture,
} from "../controllers/lecture.controller.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { validate } from "../middleware/validate.js";
import {
  lectureParamsSchema,
  createLectureSchema,
  updateLectureSchema,
} from "../validators/lecture.schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router({ mergeParams: true });

// Public routes
router.get("/:id/lectures", validate(lectureParamsSchema), asyncHandler(listLectures));
router.get("/:id/lectures/:lectureId", validate(lectureParamsSchema), asyncHandler(getLecture));

// Protected admin routes
router.post("/:id/lectures", requireAdmin, validate(createLectureSchema), asyncHandler(createLecture));
router.put("/:id/lectures/:lectureId", requireAdmin, validate(updateLectureSchema), asyncHandler(updateLecture));
router.delete("/:id/lectures/:lectureId", requireAdmin, validate(lectureParamsSchema), asyncHandler(deleteLecture));

export default router;
