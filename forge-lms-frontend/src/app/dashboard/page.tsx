"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import { Course, ApiResponse, CoursesResponse } from "@/types/course";
import { API_BASE_URL } from "@/config/api";
import { CourseSkeletonGrid, ErrorCoursesState } from "@/components/States";

interface WatchedLectureHistory {
  courseId: string;
  courseTitle: string;
  lectureId: string;
  lectureTitle: string;
  lectureNumber: number;
  watchedAt: string;
}

const emptySubscribe = () => () => {};

function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

function subscribeStorage(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

const EMPTY_HISTORY: WatchedLectureHistory[] = [];

let cachedHistoryRaw: string | null = "__init__";
let cachedHistoryValue: WatchedLectureHistory[] = EMPTY_HISTORY;

function getStoredHistory(): WatchedLectureHistory[] {
  if (typeof window === "undefined") return EMPTY_HISTORY;
  try {
    const raw = localStorage.getItem("forge_student_history");
    if (raw !== cachedHistoryRaw) {
      cachedHistoryRaw = raw;
      cachedHistoryValue = raw ? JSON.parse(raw) : EMPTY_HISTORY;
    }
    return cachedHistoryValue;
  } catch {
    return EMPTY_HISTORY;
  }
}

let cachedLastWatchedRaw: string | null = "__init__";
let cachedLastWatchedValue: WatchedLectureHistory | null = null;

function getStoredLastWatched(): WatchedLectureHistory | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("forge_last_watched");
    if (raw !== cachedLastWatchedRaw) {
      cachedLastWatchedRaw = raw;
      cachedLastWatchedValue = raw ? JSON.parse(raw) : null;
    }
    return cachedLastWatchedValue;
  } catch {
    return null;
  }
}

export default function StudentDashboardPage() {
  const mounted = useMounted();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const lastWatched = useSyncExternalStore(
    subscribeStorage,
    getStoredLastWatched,
    () => null
  );

  const history = useSyncExternalStore(
    subscribeStorage,
    getStoredHistory,
    () => EMPTY_HISTORY
  );

  useEffect(() => {
    let ignore = false;
    async function fetchCourses() {
      try {
        const apiUrl = `${API_BASE_URL}/courses`;

        const res = await fetch(apiUrl, {
          cache: "no-store",
          headers: { Accept: "application/json" },
        });

        if (!res.ok) throw new Error(`HTTP error ${res.status}`);

        const json: ApiResponse<CoursesResponse> = await res.json();
        if (!json.success || !json.data) {
          throw new Error(json.error?.message || "Failed to load courses");
        }

        if (!ignore) {
          setCourses(json.data.courses || []);
          setLoading(false);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Failed to load catalog");
          setLoading(false);
        }
      }
    }

    fetchCourses();
    return () => {
      ignore = true;
    };
  }, []);

  const clearHistory = () => {
    try {
      localStorage.removeItem("forge_last_watched");
      localStorage.removeItem("forge_student_history");
      cachedHistoryRaw = null;
      cachedHistoryValue = EMPTY_HISTORY;
      cachedLastWatchedRaw = null;
      cachedLastWatchedValue = null;
      window.dispatchEvent(new Event("storage"));
    } catch {
      // Ignore
    }
  };

  const filteredCourses = courses.filter((c) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      c.title.toLowerCase().includes(query) ||
      c.description.toLowerCase().includes(query)
    );
  });

  const totalLectures = courses.reduce((acc, c) => acc + (c.lectureCount || 0), 0);

  if (!mounted) {
    return <div className="min-h-screen bg-[#F6F4EF]" suppressHydrationWarning />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F4EF] text-[#15171C]">
      <Header activeTab="dashboard" />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-8 lg:px-10 py-8 sm:py-12">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E2DED5]">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#FBE9DF] text-[#C2410C] font-semibold text-[13px] tracking-wide mb-2.5">
              <span>🎓</span>
              <span>Student Learning Center</span>
            </div>
            <h1 className="m-0 font-['Space_Grotesk'] font-bold text-[32px] sm:text-[40px] leading-[1.1] tracking-[-0.02em] text-[#15171C]">
              Student Dashboard
            </h1>
            <p className="m-0 mt-2 text-[15px] sm:text-[16px] text-[#5B606B] max-w-[620px]">
              Jump back into your recent lessons, monitor your curriculum progress, and explore all tracks with instant open access.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 text-[14px] font-semibold text-[#15171C] border border-[#E2DED5] rounded-[8px] bg-white hover:border-[#15171C] transition-colors"
            >
              Browse Catalog
            </Link>
            {lastWatched && (
              <button
                type="button"
                onClick={clearHistory}
                className="px-3 py-2 text-[13px] font-semibold text-[#5B606B] hover:text-[#B42318] transition-colors cursor-pointer"
                title="Clear local browser watch history"
              >
                Clear History
              </button>
            )}
          </div>
        </div>

        {/* Learning Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
          <div className="bg-white border border-[#E2DED5] rounded-[12px] p-4 sm:p-5 flex flex-col justify-between">
            <span className="text-[13px] font-semibold text-[#5B606B] uppercase tracking-wider">
              Available Tracks
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-['Space_Grotesk'] font-bold text-[28px] sm:text-[32px] text-[#15171C]">
                {loading ? "..." : courses.length}
              </span>
              <span className="text-[13px] text-[#5B606B]">Courses</span>
            </div>
          </div>

          <div className="bg-white border border-[#E2DED5] rounded-[12px] p-4 sm:p-5 flex flex-col justify-between">
            <span className="text-[13px] font-semibold text-[#5B606B] uppercase tracking-wider">
              Total Lectures
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-['Space_Grotesk'] font-bold text-[28px] sm:text-[32px] text-[#15171C]">
                {loading ? "..." : (totalLectures > 0 ? totalLectures : "12+")}
              </span>
              <span className="text-[13px] text-[#5B606B]">Video lessons</span>
            </div>
          </div>

          <div className="bg-white border border-[#E2DED5] rounded-[12px] p-4 sm:p-5 flex flex-col justify-between">
            <span className="text-[13px] font-semibold text-[#5B606B] uppercase tracking-wider">
              In Progress
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-['Space_Grotesk'] font-bold text-[28px] sm:text-[32px] text-[#C2410C]">
                {history.length}
              </span>
              <span className="text-[13px] text-[#5B606B]">Active lessons</span>
            </div>
          </div>

          <div className="bg-white border border-[#E2DED5] rounded-[12px] p-4 sm:p-5 flex flex-col justify-between">
            <span className="text-[13px] font-semibold text-[#5B606B] uppercase tracking-wider">
              Access Mode
            </span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-['Space_Grotesk'] font-bold text-[22px] sm:text-[24px] text-[#2F6F5E]">
                Open Access
              </span>
            </div>
            <span className="text-[12px] text-[#5B606B] mt-0.5">No login required</span>
          </div>
        </div>

        {/* Continue Learning Spotlight Card */}
        {lastWatched ? (
          <div className="mb-10 bg-gradient-to-r from-[#15171C] to-[#252830] text-white rounded-[16px] p-6 sm:p-8 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex flex-col gap-2 max-w-[680px]">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#C2410C] animate-pulse" />
                  <span className="text-[13px] font-bold text-[#FBE9DF] tracking-wide uppercase">
                    Continue Where You Left Off
                  </span>
                </div>
                <h2 className="m-0 font-['Space_Grotesk'] font-bold text-[24px] sm:text-[28px] text-white leading-snug">
                  {lastWatched.lectureTitle}
                </h2>
                <p className="m-0 text-[15px] text-[#CBC2AE]">
                  Part of <strong className="text-white">{lastWatched.courseTitle}</strong> · Lesson #{lastWatched.lectureNumber}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href={`/courses/${lastWatched.courseId}`}
                  className="px-4 py-2.5 rounded-[8px] border border-white/30 text-white hover:bg-white/10 text-[14px] font-semibold transition-colors"
                >
                  View Course Syllabus
                </Link>
                <Link
                  href={`/courses/${lastWatched.courseId}/lectures/${lastWatched.lectureId}`}
                  className="px-5 py-2.5 rounded-[8px] bg-[#C2410C] hover:bg-[#A8370A] text-white text-[14px] font-bold transition-colors inline-flex items-center gap-2 shadow-sm"
                >
                  <span>Resume Lecture</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M4 3.5v9l8-4.5-8-4.5z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-10 bg-white border border-[#E2DED5] rounded-[16px] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-[10px] bg-[#FBE9DF] flex items-center justify-center shrink-0 text-[24px]">
                🚀
              </div>
              <div>
                <h3 className="m-0 font-['Space_Grotesk'] font-bold text-[19px] text-[#15171C]">
                  Start Your First Lecture
                </h3>
                <p className="m-0 mt-1 text-[14px] text-[#5B606B]">
                  You have not watched any lectures yet. Pick any course below to begin immediately!
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="px-4 py-2.5 rounded-[8px] bg-[#15171C] text-white text-[14px] font-semibold hover:bg-[#333] transition-colors shrink-0"
            >
              Browse All Courses
            </Link>
          </div>
        )}

        {/* Recently Watched History List (if more than 1) */}
        {history.length > 1 && (
          <div className="mb-10">
            <h3 className="font-['Space_Grotesk'] font-bold text-[20px] text-[#15171C] mb-4">
              Recent Watch History
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {history.slice(1, 4).map((item) => (
                <Link
                  key={`${item.courseId}-${item.lectureId}`}
                  href={`/courses/${item.courseId}/lectures/${item.lectureId}`}
                  className="bg-white border border-[#E2DED5] rounded-[10px] p-4 hover:border-[#C2410C] hover:shadow-sm transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[12px] font-semibold text-[#C2410C]">
                      {item.courseTitle}
                    </span>
                    <h4 className="m-0 mt-1 text-[15px] font-semibold text-[#15171C] line-clamp-1">
                      {item.lectureTitle}
                    </h4>
                  </div>
                  <div className="mt-3 text-[13px] text-[#5B606B] flex items-center justify-between">
                    <span>Lesson #{item.lectureNumber}</span>
                    <span className="font-semibold text-[#C2410C]">Watch again →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Course Catalog Search & Section */}
        <div className="mt-8 pt-8 border-t border-[#E2DED5]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="m-0 font-['Space_Grotesk'] font-bold text-[24px] sm:text-[28px] text-[#15171C]">
                Explore All Courses
              </h2>
              <p className="m-0 mt-1 text-[14px] text-[#5B606B]">
                Full syllabus and lecture lists available for every track.
              </p>
            </div>

            {/* Quick Search */}
            <div className="relative w-full sm:w-[280px]">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[40px] pl-9 pr-3 text-[14px] bg-white border border-[#E2DED5] rounded-[8px] focus:outline-none focus:border-[#C2410C] text-[#15171C]"
              />
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="#5B606B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute left-3 top-3 pointer-events-none"
              >
                <circle cx="7" cy="7" r="5" />
                <path d="m11 11 3.5 3.5" />
              </svg>
            </div>
          </div>

          {loading ? (
            <CourseSkeletonGrid count={6} />
          ) : error ? (
            <ErrorCoursesState onRetry={() => window.location.reload()} />
          ) : filteredCourses.length === 0 ? (
            <div className="bg-white border border-[#E2DED5] rounded-[12px] p-8 text-center">
              <p className="text-[16px] text-[#5B606B] m-0">
                No courses match &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-3 text-[14px] font-semibold text-[#C2410C] hover:underline"
              >
                Clear search filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id || course._id} course={course} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
