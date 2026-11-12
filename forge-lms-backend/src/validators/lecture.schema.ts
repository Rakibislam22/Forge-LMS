import { z } from "zod";
import mongoose from "mongoose";
import { isValidVideoUrl } from "../utils/videoUrl.js";

export const lectureParamsSchema = z.object({
  params: z.object({
    id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid course ID format",
    }),
    lectureId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid lecture ID format",
    }).optional(),
  }),
});

export const createLectureSchema = z.object({
  params: z.object({
    id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid course ID format",
    }),
  }),
  body: z.object({
    title: z.string().trim().min(3, "Title must be at least 3 characters").max(140, "Title cannot exceed 140 characters"),
    description: z.string().trim().max(2000, "Description cannot exceed 2000 characters").optional().default(""),
    videoUrl: z.string().trim().refine(isValidVideoUrl, {
      message: "videoUrl must be a valid YouTube or Vimeo URL",
    }),
    order: z.number().int().min(1, "Order must be an integer >= 1").optional(),
  }),
});

export const updateLectureSchema = z.object({
  params: z.object({
    id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid course ID format",
    }),
    lectureId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid lecture ID format",
    }),
  }),
  body: z.object({
    title: z.string().trim().min(3, "Title must be at least 3 characters").max(140, "Title cannot exceed 140 characters"),
    description: z.string().trim().max(2000, "Description cannot exceed 2000 characters").optional().default(""),
    videoUrl: z.string().trim().refine(isValidVideoUrl, {
      message: "videoUrl must be a valid YouTube or Vimeo URL",
    }),
    order: z.number().int().min(1, "Order must be an integer >= 1").optional(),
  }),
});
