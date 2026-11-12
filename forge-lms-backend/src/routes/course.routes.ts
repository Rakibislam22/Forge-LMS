import { Router } from "express";
import {
  listCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { validate } from "../middleware/validate.js";
import {
  courseParamsSchema,
  createCourseSchema,
  updateCourseSchema,
} from "../validators/course.schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

// Public routes
router.get("/", asyncHandler(listCourses));
router.get("/:id", validate(courseParamsSchema), asyncHandler(getCourse));

// Protected admin routes
router.post("/", requireAdmin, validate(createCourseSchema), asyncHandler(createCourse));
router.put("/:id", requireAdmin, validate(updateCourseSchema), asyncHandler(updateCourse));
router.delete("/:id", requireAdmin, validate(courseParamsSchema), asyncHandler(deleteCourse));

export default router;
