"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Course, Lecture, ApiResponse, CourseDetailResponse } from "@/types/course";
import { API_BASE_URL } from "@/config/api";
import { formatPrice } from "@/components/CourseCard";
import { EmptyCoursesState, ErrorCoursesState } from "@/components/States";

const PALETTES = [
  { bg: "#1F3A5F", shape: "#2E5283", fg: "#FFFFFF", tag: "MERN" },
  { bg: "#C2410C", shape: "#A8370A", fg: "#FFFFFF", tag: "TS" },
  { bg: "#2F6F5E", shape: "#3F8A75", fg: "#FFFFFF", tag: "API" },
  { bg: "#E8B04A", shape: "#F2C97A", fg: "#15171C", tag: "SQL" },
  { bg: "#15171C", shape: "#2B2F38", fg: "#FFFFFF", tag: "React" },
  { bg: "#DAD3C3", shape: "#CBC2AE", fg: "#15171C", tag: "Git" },
];

function getPreset(title: string) {
  const lower = title.toLowerCase();
  if (lower.includes("mern") || lower.includes("mongo")) return PALETTES[0];
  if (lower.includes("type") || lower.includes("ts")) return PALETTES[1];
  if (lower.includes("api") || lower.includes("rest") || lower.includes("express")) return PALETTES[2];
  if (lower.includes("sql") || lower.includes("postgres")) return PALETTES[3];
  if (lower.includes("react")) return PALETTES[4];
  if (lower.includes("git")) return PALETTES[5];

  const tag = title.split(" ")[0].slice(0, 5).toUpperCase() || "CODE";
  return { ...PALETTES[0], tag };
}

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;

  const [course, setCourse] = useState<Course | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const apiUrl = `${API_BASE_URL}/courses/${courseId}`;

        const res = await fetch(apiUrl, {
          cache: "no-store",
          headers: { Accept: "application/json" },
        });

        if (!res.ok) throw new Error(`Failed to load course (${res.status})`);

        const json: ApiResponse<CourseDetailResponse> = await res.json();
        if (!json.success || !json.data) throw new Error(json.error?.message || "Course not found");

        if (!ignore) {
          setCourse(json.data.course);
          setLectures(json.data.lectures || []);
          setLoading(false);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Error loading course");
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F6F4EF] text-[#15171C]">
        <Header activeTab="courses" backHref="/" backLabel="All courses" />
        <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-8 lg:px-10 py-8 animate-pulse">
          <div className="h-5 w-48 bg-[#E9E5DB] rounded mb-8" />
          <div className="flex flex-col md:flex-row gap-8 items-stretch mb-10">
            <div className="flex-1 h-[240px] sm:h-[320px] bg-[#E9E5DB] rounded-2xl" />
            <div className="flex-1 flex flex-col gap-4 justify-center">
              <div className="h-9 w-3/4 bg-[#E9E5DB] rounded" />
              <div className="h-4 w-full bg-[#EFECE4] rounded" />
              <div className="h-4 w-5/6 bg-[#EFECE4] rounded" />
              <div className="h-10 w-32 bg-[#E9E5DB] rounded mt-4" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F6F4EF] text-[#15171C]">
        <Header activeTab="courses" backHref="/" backLabel="All courses" />
        <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-8 lg:px-10 py-12">
          <ErrorCoursesState onRetry={() => window.location.reload()} />
        </main>
        <Footer />
      </div>
    );
  }

  const firstLectureId = lectures.length > 0 ? (lectures[0].id || lectures[0]._id) : null;
  const preset = getPreset(course.title);

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F4EF] text-[#15171C]">
      <Header activeTab="courses" backHref="/" backLabel="All courses" />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-8 lg:px-10 py-6 sm:py-9 pb-16 flex flex-col gap-7 sm:gap-9">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="text-[14px] text-[#5B606B] flex items-center gap-2 flex-wrap"
        >
          <Link href="/" className="underline hover:text-[#C2410C] transition-colors">
            All courses
          </Link>
          <span aria-hidden="true" className="text-[#9A9588]">/</span>
          <span className="text-[#15171C] font-semibold truncate max-w-[420px]">
            {course.title}
          </span>
        </nav>

        {/* Hero Section */}
        <section className="flex flex-col md:flex-row gap-6 sm:gap-10 items-stretch">
          {/* Hero Thumbnail / Geometric Artwork */}
          <div
            className="w-full md:w-[420px] lg:w-[480px] shrink-0 relative h-[200px] sm:h-[280px] md:h-[320px] rounded-2xl overflow-hidden shadow-sm"
            style={{ backgroundColor: preset.bg }}
          >
            {course.thumbnailUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full relative select-none">
                <div
                  className="absolute -right-16 -top-20 w-[300px] sm:w-[340px] h-[300px] sm:h-[340px] rounded-full pointer-events-none"
                  style={{ backgroundColor: preset.shape }}
                />
                <div
                  className="absolute left-6 sm:left-10 bottom-6 sm:bottom-10 w-20 sm:w-24 h-2.5 sm:h-3 rounded-[6px] pointer-events-none"
                  style={{ backgroundColor: preset.shape }}
                />
                <div
                  className="absolute left-6 sm:left-10 top-6 sm:top-8 font-['Space_Grotesk'] font-bold text-[48px] sm:text-[68px] lg:text-[72px] tracking-[-0.03em] leading-none pointer-events-none"
                  style={{ color: preset.fg }}
                >
                  {preset.tag}
                </div>
              </div>
            )}
          </div>

          {/* Hero Content */}
          <div className="flex-1 flex flex-col justify-center gap-3.5 sm:gap-4">
            <h1 className="m-0 font-['Space_Grotesk'] font-bold text-[28px] sm:text-[38px] lg:text-[44px] leading-[1.05] tracking-[-0.02em] text-[#15171C]">
              {course.title}
            </h1>
            <p className="m-0 text-[15.5px] sm:text-[17px] leading-[1.6] text-[#5B606B]">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-2">
              <span className="font-['Space_Grotesk'] font-bold text-[28px] sm:text-[34px] text-[#15171C]">
                {formatPrice(course.price)}
              </span>

              {firstLectureId ? (
                <Link
                  href={`/courses/${courseId}/lectures/${firstLectureId}`}
                  className="inline-flex items-center justify-center min-h-[48px] px-6 sm:px-7 rounded-[10px] bg-[#C2410C] text-white font-semibold text-[15px] sm:text-[16px] hover:bg-[#A8370A] active:bg-[#8D2D06] transition-colors shadow-sm"
                >
                  Start first lecture
                </Link>
              ) : (
                <span className="inline-flex items-center justify-center min-h-[48px] px-5 rounded-[10px] bg-[#E2DED5] text-[#5B606B] font-semibold text-[14px]">
                  No lectures yet
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Lectures Curriculum Section */}
        <section className="bg-white border border-[#E2DED5] rounded-[14px] overflow-hidden mt-3 shadow-sm">
          <div className="p-4 sm:p-[20px_28px] border-b border-[#E2DED5] flex items-baseline justify-between gap-3 flex-wrap bg-white">
            <h2 className="m-0 font-['Space_Grotesk'] font-bold text-[21px] sm:text-[24px] text-[#15171C]">
              Lectures
            </h2>
            <span className="text-[13px] sm:text-[14px] font-medium text-[#5B606B]">
              {lectures.length} {lectures.length === 1 ? "lecture" : "lectures"}
            </span>
          </div>

          {lectures.length === 0 ? (
            <div className="p-8">
              <EmptyCoursesState />
            </div>
          ) : (
            <ol className="list-none m-0 p-0 divide-y divide-[#E2DED5]">
              {lectures.map((lec, idx) => {
                const lecId = lec.id || lec._id;
                return (
                  <li key={lecId}>
                    <Link
                      href={`/courses/${courseId}/lectures/${lecId}`}
                      className="group flex items-center gap-3.5 sm:gap-5 p-3.5 sm:p-[16px_28px] min-h-[56px] hover:bg-[#FBE9DF] transition-colors text-inherit no-underline"
                    >
                      <span className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#F6F4EF] group-hover:bg-white flex items-center justify-center font-['Space_Grotesk'] font-bold text-[14px] sm:text-[15px] text-[#15171C] transition-colors">
                        {lec.order || idx + 1}
                      </span>
                      <span className="flex-1 min-w-0 flex flex-col gap-0.5">
                        <span className="font-semibold text-[15px] sm:text-[16px] text-[#15171C] group-hover:text-[#C2410C] transition-colors line-clamp-1">
                          {lec.title}
                        </span>
                        {lec.description && (
                          <span className="text-[13px] sm:text-[14px] text-[#5B606B] line-clamp-1">
                            {lec.description}
                          </span>
                        )}
                      </span>
                      <span className="shrink-0 flex items-center gap-1.5 text-[14px] font-semibold text-[#C2410C] group-hover:translate-x-0.5 transition-transform">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          aria-hidden="true"
                          className="shrink-0"
                        >
                          <path d="M4 2.5v11l9-5.5z" fill="#C2410C" />
                        </svg>
                        <span className="hidden sm:inline">Watch</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
