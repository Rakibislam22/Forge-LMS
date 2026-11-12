import mongoose, { Document, Schema } from "mongoose";

export interface ICourse extends Document {
  title: string;
  description: string;
  price: number;
  thumbnailUrl?: string;
  lectureCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 120,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 2000,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      max: 99999.99,
      set: (v: number) => Math.round(v * 100) / 100,
    },
    thumbnailUrl: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = String(ret._id);
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

courseSchema.virtual("lectureCount", {
  ref: "Lecture",
  localField: "_id",
  foreignField: "courseId",
  count: true,
});

export const Course = mongoose.model<ICourse>("Course", courseSchema);
