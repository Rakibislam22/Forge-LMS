import { NextResponse } from "next/server";
import { Course } from "@/types/course";

// Seed course data matching assessment specifications and design mockups
const SEED_COURSES: Course[] = [
  {
    id: "6732dc01f1a2b3c4d5e6f701",
    title: "Full-Stack Web Development with MERN",
    description:
      "Build and ship a complete app with MongoDB, Express, React and Node.js, from the database schema to the deployed frontend.",
    price: 49,
    thumbnailUrl: "",
    lectureCount: 8,
    createdAt: "2026-11-01T10:00:00.000Z",
    updatedAt: "2026-11-01T10:00:00.000Z",
  },
  {
    id: "6732dc01f1a2b3c4d5e6f702",
    title: "TypeScript from Zero to Confident",
    description:
      "Types, generics and narrowing explained through small, practical exercises you can apply to any JavaScript codebase.",
    price: 29,
    thumbnailUrl: "",
    lectureCount: 6,
    createdAt: "2026-11-02T10:00:00.000Z",
    updatedAt: "2026-11-02T10:00:00.000Z",
  },
  {
    id: "6732dc01f1a2b3c4d5e6f703",
    title: "REST API Design with Express",
    description:
      "Structure routes, controllers and models using MVC, validate input and handle errors the way production APIs do.",
    price: 34,
    thumbnailUrl: "",
    lectureCount: 7,
    createdAt: "2026-11-03T10:00:00.000Z",
    updatedAt: "2026-11-03T10:00:00.000Z",
  },
  {
    id: "6732dc01f1a2b3c4d5e6f704",
    title: "PostgreSQL for Application Developers",
    description:
      "Model relational data, write confident queries and connect Postgres to a Node.js backend.",
    price: 39,
    thumbnailUrl: "",
    lectureCount: 5,
    createdAt: "2026-11-04T10:00:00.000Z",
    updatedAt: "2026-11-04T10:00:00.000Z",
  },
  {
    id: "6732dc01f1a2b3c4d5e6f705",
    title: "React Patterns in Practice",
    description:
      "Component composition, data fetching and state management patterns for interfaces that stay easy to change.",
    price: 44,
    thumbnailUrl: "",
    lectureCount: 9,
    createdAt: "2026-11-05T10:00:00.000Z",
    updatedAt: "2026-11-05T10:00:00.000Z",
  },
  {
    id: "6732dc01f1a2b3c4d5e6f706",
    title: "Git and GitHub Workflow",
    description:
      "Branching, pull requests and code review habits that keep a team repository clean.",
    price: 19,
    thumbnailUrl: "",
    lectureCount: 4,
    createdAt: "2026-11-06T10:00:00.000Z",
    updatedAt: "2026-11-06T10:00:00.000Z",
  },
];

export async function GET() {
  const backendUrl = process.env.BACKEND_API_URL || process.env.INTERNAL_API_URL;

  if (backendUrl) {
    try {
      const res = await fetch(`${backendUrl}/courses`, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
    } catch (err) {
      console.warn("Backend forwarding failed, falling back to seed data:", err);
    }
  }

  // Return standard envelope per 05-API.md
  return NextResponse.json({
    success: true,
    data: {
      courses: SEED_COURSES,
    },
  });
}
