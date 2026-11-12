import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";
import { env } from "../config/env.js";
import { Admin } from "../models/Admin.js";
import { Course } from "../models/Course.js";
import { Lecture } from "../models/Lecture.js";

const SEED_COURSES = [
  {
    title: "Full-Stack Web Development with MERN",
    description:
      "Build and ship a complete app with MongoDB, Express, React and Node.js, from the database schema to the deployed frontend. You will follow one project from an empty folder to a working product.",
    price: 49,
    thumbnailUrl: "",
    lectures: [
      {
        title: "Course introduction and setup",
        description: "What we build, the tools you need and how the project is organised.",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        order: 1,
      },
      {
        title: "Project structure with MVC",
        description: "Separate routes, controllers and models from the first commit.",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        order: 2,
      },
      {
        title: "Building the Express API",
        description: "Create the course and lecture endpoints with validation.",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        order: 3,
      },
      {
        title: "Connecting MongoDB with Mongoose",
        description: "Define schemas, seed data and persist your records.",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        order: 4,
      },
      {
        title: "Admin authentication with JWT",
        description: "Protect management routes with a simple token-based login.",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        order: 5,
      },
      {
        title: "The React frontend",
        description: "Fetch data from the API and render the student-facing pages.",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        order: 6,
      },
    ],
  },
  {
    title: "TypeScript from Zero to Confident",
    description:
      "Types, generics and narrowing explained through small, practical exercises you can apply to any JavaScript codebase.",
    price: 29,
    thumbnailUrl: "",
    lectures: [
      {
        title: "Introduction to Static Typing",
        description: "Why TypeScript matters and how the compiler works.",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        order: 1,
      },
      {
        title: "Primitives and Object Types",
        description: "Interfaces, types, and strict object contracts.",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        order: 2,
      },
    ],
  },
  {
    title: "REST API Design with Express",
    description:
      "Structure routes, controllers and models using MVC, validate input and handle errors the way production APIs do.",
    price: 34,
    thumbnailUrl: "",
    lectures: [
      {
        title: "HTTP Methods and Status Codes",
        description: "Building semantic, predictable REST APIs.",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        order: 1,
      },
    ],
  },
  {
    title: "PostgreSQL for Application Developers",
    description:
      "Model relational data, write confident queries and connect Postgres to a Node.js backend.",
    price: 39,
    thumbnailUrl: "",
    lectures: [
      {
        title: "Relational Modeling",
        description: "Primary keys, foreign keys and indexes.",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        order: 1,
      },
    ],
  },
  {
    title: "React Patterns in Practice",
    description:
      "Component composition, data fetching and state management patterns for interfaces that stay easy to change.",
    price: 44,
    thumbnailUrl: "",
    lectures: [
      {
        title: "Composition vs Inheritance",
        description: "Building reusable UI components.",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        order: 1,
      },
    ],
  },
  {
    title: "Git and GitHub Workflow",
    description:
      "Branching, pull requests and code review habits that keep a team repository clean.",
    price: 19,
    thumbnailUrl: "",
    lectures: [
      {
        title: "Trunk-based Development",
        description: "Branching strategies for modern teams.",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        order: 1,
      },
    ],
  },
];

async function seed() {
  console.log("🌱 Starting Forge LMS database seed…");
  await connectDB();

  // 1. Seed or update Admin
  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, env.BCRYPT_ROUNDS);
  let admin = await Admin.findOne({ email: env.ADMIN_EMAIL.toLowerCase() });

  if (admin) {
    admin.passwordHash = passwordHash;
    await admin.save();
    console.log(`👤 Admin updated: ${env.ADMIN_EMAIL}`);
  } else {
    admin = await Admin.create({
      email: env.ADMIN_EMAIL.toLowerCase(),
      passwordHash,
      role: "admin",
    });
    console.log(`👤 Admin created: ${env.ADMIN_EMAIL}`);
  }

  // 2. Clear existing courses & lectures for clean seed
  await Course.deleteMany({});
  await Lecture.deleteMany({});
  console.log("🧹 Cleaned existing courses and lectures.");

  // 3. Seed Courses and Lectures
  for (const c of SEED_COURSES) {
    const course = await Course.create({
      title: c.title,
      description: c.description,
      price: c.price,
      thumbnailUrl: c.thumbnailUrl,
    });

    if (c.lectures && c.lectures.length > 0) {
      const lectureDocs = c.lectures.map((lec) => ({
        ...lec,
        courseId: course._id,
      }));
      await Lecture.insertMany(lectureDocs);
    }
  }

  const totalCourses = await Course.countDocuments();
  const totalLectures = await Lecture.countDocuments();

  console.log("=========================================");
  console.log(`✨ Seed complete!`);
  console.log(`📚 Total Courses: ${totalCourses}`);
  console.log(`🎥 Total Lectures: ${totalLectures}`);
  console.log(`🔑 Admin Login: ${env.ADMIN_EMAIL}`);
  console.log("=========================================");

  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
