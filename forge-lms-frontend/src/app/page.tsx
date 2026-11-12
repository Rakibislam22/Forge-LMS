"use client";

import { useState, useSyncExternalStore, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import { Course, ApiResponse, CoursesResponse } from "@/types/course";
import {
  CourseSkeletonGrid,
  EmptyCoursesState,
  ErrorCoursesState,
} from "@/components/States";

const emptySubscribe = () => () => {};

function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

const CATEGORIES = [
  { id: "all", label: "All Tracks" },
  { id: "fullstack", label: "Full-Stack & MERN" },
  { id: "backend", label: "Backend & APIs" },
  { id: "frontend", label: "Frontend & React" },
  { id: "database", label: "Databases" },
];

export default function HomePage() {
  const mounted = useMounted();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCourses = () => {
    setLoading(true);
    setError(null);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
      ? `${process.env.NEXT_PUBLIC_API_URL}/courses`
      : "/api/courses";

    fetch(apiUrl, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((json: ApiResponse<CoursesResponse>) => {
        if (!json.success || !json.data) {
          throw new Error(json.error?.message || "Failed to load courses");
        }
        setCourses(json.data.courses || []);
      })
      .catch((err) => {
        console.error("Error loading courses:", err);
        setError(err instanceof Error ? err.message : "Network error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/courses`
          : "/api/courses";

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
          setError(err instanceof Error ? err.message : "Network error");
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  const filteredCourses = courses.filter((course) => {
    const textMatch =
      !searchQuery.trim() ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!textMatch) return false;

    if (activeCategory === "all") return true;
    const lowerTitle = course.title.toLowerCase();
    const lowerDesc = course.description.toLowerCase();

    if (activeCategory === "fullstack") {
      return (
        lowerTitle.includes("mern") ||
        lowerTitle.includes("full-stack") ||
        lowerDesc.includes("mern")
      );
    }
    if (activeCategory === "backend") {
      return (
        lowerTitle.includes("api") ||
        lowerTitle.includes("express") ||
        lowerTitle.includes("rest") ||
        lowerTitle.includes("node")
      );
    }
    if (activeCategory === "frontend") {
      return (
        lowerTitle.includes("react") ||
        lowerTitle.includes("typescript") ||
        lowerTitle.includes("frontend")
      );
    }
    if (activeCategory === "database") {
      return (
        lowerTitle.includes("sql") ||
        lowerTitle.includes("postgres") ||
        lowerTitle.includes("mongo") ||
        lowerDesc.includes("database")
      );
    }
    return true;
  });

  if (!mounted) {
    return <div className="min-h-screen bg-[#F6F4EF]" suppressHydrationWarning />;
  }

  return (
    <div
      className="flex flex-col min-h-screen bg-[#F6F4EF] text-[#15171C]"
      suppressHydrationWarning
    >
      <Header activeTab="courses" />

      {/* Hero Section */}
      <section className="border-b border-[#E2DED5] bg-gradient-to-b from-white via-white to-[#F6F4EF] pt-12 pb-14 sm:pt-16 sm:pb-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-10">
          <div className="max-w-[760px]">
            {/* Tag Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBE9DF] border border-[#F2C97A]/40 text-[#C2410C] text-[13px] font-semibold tracking-wide mb-4">
              <span className="w-2 h-2 rounded-full bg-[#C2410C]" />
              <span>Open Learning · Zero Sign-Up Required</span>
            </div>

            <h1 className="m-0 font-['Space_Grotesk'] font-bold text-[36px] sm:text-[48px] lg:text-[54px] leading-[1.08] tracking-[-0.025em] text-[#15171C]">
              Master modern software engineering, one lecture at a time.
            </h1>

            <p className="m-0 mt-4 text-[17px] sm:text-[19px] leading-[1.55] text-[#5B606B]">
              Pick a course, open the lecture list and start watching immediately. Direct access to production-grade engineering courses — zero paywalls or registration forms.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#catalog"
                className="px-6 py-3 rounded-[8px] bg-[#15171C] text-white hover:bg-[#2B2F38] font-semibold text-[15px] transition-all shadow-sm flex items-center gap-2"
              >
                <span>Browse All Courses</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 3v10m-4-4 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>

              <Link
                href="/dashboard"
                className="px-6 py-3 rounded-[8px] bg-white border border-[#E2DED5] text-[#15171C] hover:border-[#15171C] font-semibold text-[15px] transition-all flex items-center gap-2"
              >
                <span>Student Dashboard</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 8h10m-4-4 4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Highlights Value Banner */}
          <div className="mt-12 pt-8 border-t border-[#E2DED5]/80 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="font-['Space_Grotesk'] font-bold text-[24px] sm:text-[28px] text-[#15171C]">
                {loading ? "6" : courses.length || 6} Tracks
              </div>
              <div className="text-[14px] text-[#5B606B] mt-0.5">Full-Stack & Backend</div>
            </div>

            <div>
              <div className="font-['Space_Grotesk'] font-bold text-[24px] sm:text-[28px] text-[#C2410C]">
                100% Free
              </div>
              <div className="text-[14px] text-[#5B606B] mt-0.5">Open access learning</div>
            </div>

            <div>
              <div className="font-['Space_Grotesk'] font-bold text-[24px] sm:text-[28px] text-[#2F6F5E]">
                Safe Embeds
              </div>
              <div className="text-[14px] text-[#5B606B] mt-0.5">YouTube & Vimeo player</div>
            </div>

            <div>
              <div className="font-['Space_Grotesk'] font-bold text-[24px] sm:text-[28px] text-[#1F3A5F]">
                Local History
              </div>
              <div className="text-[14px] text-[#5B606B] mt-0.5">Resume lessons anytime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Area */}
      <main
        id="catalog"
        className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-8 lg:px-10 py-10 sm:py-14"
        suppressHydrationWarning
      >
        {/* Search and Category Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-[14px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-[#15171C] text-white shadow-sm"
                    : "bg-white text-[#5B606B] border border-[#E2DED5] hover:text-[#15171C] hover:border-[#9A9588]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-[280px]">
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

        {/* Listing Grid */}
        <div>
          {loading ? (
            <CourseSkeletonGrid count={6} />
          ) : error ? (
            <ErrorCoursesState onRetry={fetchCourses} />
          ) : filteredCourses.length === 0 ? (
            courses.length === 0 ? (
              <EmptyCoursesState onRefresh={fetchCourses} />
            ) : (
              <div className="bg-white border border-[#E2DED5] rounded-[12px] p-10 text-center">
                <p className="text-[16px] text-[#5B606B] m-0">
                  No courses found for &ldquo;{searchQuery || activeCategory}&rdquo;.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                  }}
                  className="mt-3 text-[14px] font-semibold text-[#C2410C] hover:underline"
                >
                  Reset filters
                </button>
              </div>
            )
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id || course._id} course={course} />
              ))}
            </div>
          )}
        </div>

        {/* Why Forge LMS Educational Section */}
        <section className="mt-16 pt-12 border-t border-[#E2DED5]">
          <div className="text-center max-w-[600px] mx-auto mb-10">
            <h2 className="m-0 font-['Space_Grotesk'] font-bold text-[28px] sm:text-[34px] text-[#15171C]">
              Why Forge LMS?
            </h2>
            <p className="m-0 mt-2 text-[15px] sm:text-[16px] text-[#5B606B]">
              Designed specifically for focused, distraction-free technical learning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-[#E2DED5] rounded-[14px] p-6 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-[8px] bg-[#FBE9DF] text-[#C2410C] flex items-center justify-center font-bold text-[18px]">
                01
              </div>
              <h3 className="m-0 font-['Space_Grotesk'] font-bold text-[18px] text-[#15171C]">
                Zero Paywalls or Accounts
              </h3>
              <p className="m-0 text-[14px] leading-[1.6] text-[#5B606B]">
                Start watching immediately. There are no credit cards, registration forms, or promotional emails blocking your learning journey.
              </p>
            </div>

            <div className="bg-white border border-[#E2DED5] rounded-[14px] p-6 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-[8px] bg-[#FBE9DF] text-[#C2410C] flex items-center justify-center font-bold text-[18px]">
                02
              </div>
              <h3 className="m-0 font-['Space_Grotesk'] font-bold text-[18px] text-[#15171C]">
                Structured Course Syllabi
              </h3>
              <p className="m-0 text-[14px] leading-[1.6] text-[#5B606B]">
                Every course is organized into sequential lectures. Follow along with clear previous/next navigation and a responsive playlist drawer.
              </p>
            </div>

            <div className="bg-white border border-[#E2DED5] rounded-[14px] p-6 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-[8px] bg-[#FBE9DF] text-[#C2410C] flex items-center justify-center font-bold text-[18px]">
                03
              </div>
              <h3 className="m-0 font-['Space_Grotesk'] font-bold text-[18px] text-[#15171C]">
                Production-Ready Stack
              </h3>
              <p className="m-0 text-[14px] leading-[1.6] text-[#5B606B]">
                Built on Express, MongoDB, TypeScript, Next.js, and Tailwind CSS. Clean MVC architecture on the backend with real database persistence.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
