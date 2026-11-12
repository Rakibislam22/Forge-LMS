import { Request, Response } from "express";
import { Course } from "../models/Course.js";
import { Lecture } from "../models/Lecture.js";
import { ApiError } from "../utils/ApiError.js";
import { respondSuccess } from "../utils/respond.js";

export async function listCourses(_req: Request, res: Response) {
  const courses = await Course.find()
    .sort({ createdAt: -1 })
    .populate("lectureCount");

  return respondSuccess(res, { courses });
}

export async function getCourse(req: Request, res: Response) {
  const { id } = req.params;

  const course = await Course.findById(id).populate("lectureCount");
  if (!course) {
    throw ApiError.notFound("Course not found");
  }

  const lectures = await Lecture.find({ courseId: course._id }).sort({ order: 1 });

  return respondSuccess(res, {
    course,
    lectures,
  });
}

export async function createCourse(req: Request, res: Response) {
  const { title, description, price, thumbnailUrl } = req.body;

  const course = await Course.create({
    title,
    description,
    price,
    thumbnailUrl,
  });

  return respondSuccess(res, { course }, 201);
}

export async function updateCourse(req: Request, res: Response) {
  const { id } = req.params;
  const { title, description, price, thumbnailUrl } = req.body;

  const course = await Course.findByIdAndUpdate(
    id,
    { title, description, price, thumbnailUrl },
    { new: true, runValidators: true }
  );

  if (!course) {
    throw ApiError.notFound("Course not found");
  }

  return respondSuccess(res, { course });
}

export async function deleteCourse(req: Request, res: Response) {
  const { id } = req.params;

  const course = await Course.findByIdAndDelete(id);
  if (!course) {
    throw ApiError.notFound("Course not found");
  }

  // Cascade delete all lectures belonging to this course
  await Lecture.deleteMany({ courseId: course._id });

  return respondSuccess(res, { deleted: true });
}
