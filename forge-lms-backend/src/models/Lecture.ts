import mongoose, { Document, Schema, Types } from "mongoose";
import { isValidVideoUrl } from "../utils/videoUrl.js";

export interface ILecture extends Document {
  courseId: Types.ObjectId;
  title: string;
  description?: string;
  videoUrl: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const lectureSchema = new Schema<ILecture>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 140,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },
    videoUrl: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isValidVideoUrl,
        message: "videoUrl must be a valid YouTube or Vimeo URL",
      },
    },
    order: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = String(ret._id);
        ret.courseId = String(ret.courseId);
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

lectureSchema.index({ courseId: 1, order: 1 });

export const Lecture = mongoose.model<ILecture>("Lecture", lectureSchema);
