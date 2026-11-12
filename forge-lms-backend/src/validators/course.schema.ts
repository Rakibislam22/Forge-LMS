import { z } from "zod";
import mongoose from "mongoose";

export const courseParamsSchema = z.object({
  params: z.object({
    id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid course ID format",
    }),
  }),
});

export const createCourseSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3, "Title must be at least 3 characters").max(120, "Title cannot exceed 120 characters"),
    description: z.string().trim().min(10, "Description must be at least 10 characters").max(2000, "Description cannot exceed 2000 characters"),
    price: z.number().min(0, "Price must be 0 or more").max(99999.99, "Price cannot exceed 99999.99"),
    thumbnailUrl: z.string().trim().url("Thumbnail URL must be a valid URL").or(z.literal("")).optional(),
  }),
});

export const updateCourseSchema = z.object({
  params: z.object({
    id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid course ID format",
    }),
  }),
  body: z.object({
    title: z.string().trim().min(3, "Title must be at least 3 characters").max(120, "Title cannot exceed 120 characters"),
    description: z.string().trim().min(10, "Description must be at least 10 characters").max(2000, "Description cannot exceed 2000 characters"),
    price: z.number().min(0, "Price must be 0 or more").max(99999.99, "Price cannot exceed 99999.99"),
    thumbnailUrl: z.string().trim().url("Thumbnail URL must be a valid URL").or(z.literal("")).optional(),
  }),
});
