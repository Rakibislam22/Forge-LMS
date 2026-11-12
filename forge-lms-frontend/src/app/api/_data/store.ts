import { Course, Lecture } from "@/types/course";

export const SEED_COURSES: Course[] = [
  {
    id: "6732dc01f1a2b3c4d5e6f701",
    title: "Full-Stack Web Development with MERN",
    description:
      "Build and ship a complete app with MongoDB, Express, React and Node.js, from the database schema to the deployed frontend. You will follow one project from an empty folder to a working product.",
    price: 49,
    thumbnailUrl: "",
    lectureCount: 6,
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
    lectureCount: 6,
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
    lectureCount: 6,
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

export const SEED_LECTURES: Lecture[] = [
  {
    id: "6732dc02f1a2b3c4d5e6f801",
    courseId: "6732dc01f1a2b3c4d5e6f701",
    title: "Course introduction and setup",
    description: "What we build, the tools you need and how the project is organised.",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    order: 1,
  },
  {
    id: "6732dc02f1a2b3c4d5e6f802",
    courseId: "6732dc01f1a2b3c4d5e6f701",
    title: "Project structure with MVC",
    description: "Separate routes, controllers and models from the first commit.",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    order: 2,
  },
  {
    id: "6732dc02f1a2b3c4d5e6f803",
    courseId: "6732dc01f1a2b3c4d5e6f701",
    title: "Building the Express API",
    description: "Create the course and lecture endpoints with validation.",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    order: 3,
  },
  {
    id: "6732dc02f1a2b3c4d5e6f804",
    courseId: "6732dc01f1a2b3c4d5e6f701",
    title: "Connecting MongoDB with Mongoose",
    description: "Define schemas, seed data and persist your records.",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    order: 4,
  },
  {
    id: "6732dc02f1a2b3c4d5e6f805",
    courseId: "6732dc01f1a2b3c4d5e6f701",
    title: "Admin authentication with JWT",
    description: "Protect management routes with a simple token-based login.",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    order: 5,
  },
  {
    id: "6732dc02f1a2b3c4d5e6f806",
    courseId: "6732dc01f1a2b3c4d5e6f701",
    title: "The React frontend",
    description: "Fetch data from the API and render the student-facing pages.",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    order: 6,
  },
];

// In-memory data store for Next.js preview before Express runs
const globalStore = globalThis as unknown as {
  __forgeCourses?: Course[];
  __forgeLectures?: Lecture[];
};

if (!globalStore.__forgeCourses) {
  globalStore.__forgeCourses = [...SEED_COURSES];
}
if (!globalStore.__forgeLectures) {
  globalStore.__forgeLectures = [...SEED_LECTURES];
}

export const coursesStore = globalStore.__forgeCourses;
export const lecturesStore = globalStore.__forgeLectures;
