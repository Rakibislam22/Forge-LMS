/**
 * Forge LMS Frontend API Configuration
 * All API calls connect directly to the Express + MongoDB backend.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
