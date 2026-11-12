import { Request, Response } from "express";
import { Lecture } from "../models/Lecture.js";
import { Course } from "../models/Course.js";
import { ApiError } from "../utils/ApiError.js";
import { respondSuccess } from "../utils/respond.js";

export async function listLectures(req: Request, res: Response) {
  const { id: courseId } = req.params;

  const course = await Course.findById(courseId);
  if (!course) {
    throw ApiError.notFound("Course not found");
  }

  const lectures = await Lecture.find({ courseId: course._id }).sort({ order: 1 });
  return respondSuccess(res, { lectures });
}

export async function getLecture(req: Request, res: Response) {
  const { id: courseId, lectureId } = req.params;

  const course = await Course.findById(courseId);
  if (!course) {
    throw ApiError.notFound("Course not found");
  }

  const allLectures = await Lecture.find({ courseId: course._id }).sort({ order: 1 });
  const currentIndex = allLectures.findIndex((l) => l.id === lectureId);

  if (currentIndex === -1) {
    throw ApiError.notFound("Lecture not found in this course");
  }

  const lecture = allLectures[currentIndex];
  const prevLecture = currentIndex > 0 ? allLectures[currentIndex - 1] : null;
  const nextLecture =
    currentIndex < allLectures.length - 1 ? allLectures[currentIndex + 1] : null;

  return respondSuccess(res, {
    lecture,
    course,
    prevLectureId: prevLecture ? prevLecture.id : null,
    nextLectureId: nextLecture ? nextLecture.id : null,
    allLectures,
  });
}

export async function createLecture(req: Request, res: Response) {
  const { id: courseId } = req.params;
  const { title, description, videoUrl, order } = req.body;

  const course = await Course.findById(courseId);
  if (!course) {
    throw ApiError.notFound("Course not found");
  }

  // Calculate order if not specified
  let lectureOrder = order;
  if (!lectureOrder) {
    const highest = await Lecture.findOne({ courseId: course._id }).sort({ order: -1 });
    lectureOrder = highest ? highest.order + 1 : 1;
  }

  const lecture = await Lecture.create({
    courseId: course._id,
    title,
    description,
    videoUrl,
    order: lectureOrder,
  });

  return respondSuccess(res, { lecture }, 201);
}

export async function updateLecture(req: Request, res: Response) {
  const { id: courseId, lectureId } = req.params;
  const { title, description, videoUrl, order } = req.body;

  const lecture = await Lecture.findOneAndUpdate(
    { _id: lectureId, courseId },
    { title, description, videoUrl, order },
    { new: true, runValidators: true }
  );

  if (!lecture) {
    throw ApiError.notFound("Lecture not found");
  }

  return respondSuccess(res, { lecture });
}

export async function deleteLecture(req: Request, res: Response) {
  const { id: courseId, lectureId } = req.params;

  const lecture = await Lecture.findOneAndDelete({ _id: lectureId, courseId });
  if (!lecture) {
    throw ApiError.notFound("Lecture not found");
  }

  return respondSuccess(res, { deleted: true });
}
