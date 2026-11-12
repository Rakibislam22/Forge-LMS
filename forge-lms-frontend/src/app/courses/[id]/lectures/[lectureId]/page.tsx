"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Course, Lecture, ApiResponse, LectureResponse } from "@/types/course";
import { API_BASE_URL } from "@/config/api";
import { getSafeEmbedUrl } from "@/utils/videoUrl";
import { ErrorCoursesState } from "@/components/States";

export default function LectureWatchPage({
  params,
}: {
  params: Promise<{ id: string; lectureId: string }>;
}) {
  const resolvedParams = use(params);
  const { id: courseId, lectureId } = resolvedParams;
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);
  const [allLectures, setAllLectures] = useState<Lecture[]>([]);
  const [prevId, setPrevId] = useState<string | null>(null);
  const [nextId, setNextId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const apiUrl = `${API_BASE_URL}/courses/${courseId}/lectures/${lectureId}`;

        const res = await fetch(apiUrl, {
          cache: "no-store",
          headers: { Accept: "application/json" },
        });

        if (!res.ok) throw new Error(`Failed to load lecture (${res.status})`);

        const json: ApiResponse<LectureResponse> = await res.json();
        if (!json.success || !json.data) throw new Error(json.error?.message || "Lecture not found");

        if (!ignore) {
          setCourse(json.data.course);
          setCurrentLecture(json.data.lecture);
          setAllLectures(json.data.allLectures || []);
          setPrevId(json.data.prevLectureId || null);
          setNextId(json.data.nextLectureId || null);
          setLoading(false);

          // Save to student dashboard learning history in browser
          if (typeof window !== "undefined") {
            try {
              const historyItem = {
                courseId: json.data.course.id || (json.data.course as { _id?: string })._id,
                courseTitle: json.data.course.title,
                lectureId: json.data.lecture.id || (json.data.lecture as { _id?: string })._id,
                lectureTitle: json.data.lecture.title,
                lectureNumber: json.data.lecture.order || 1,
                watchedAt: new Date().toISOString(),
              };
              const raw = localStorage.getItem("forge_student_history");
              const list = raw ? JSON.parse(raw) : [];
              const updated = [
                historyItem,
                ...list.filter(
                  (item: { courseId: string; lectureId: string }) =>
                    item.courseId !== historyItem.courseId || item.lectureId !== historyItem.lectureId
                ),
              ].slice(0, 10);
              localStorage.setItem("forge_student_history", JSON.stringify(updated));
              localStorage.setItem("forge_last_watched", JSON.stringify(historyItem));
            } catch {
              // Ignore local storage errors
            }
          }
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Error loading lecture");
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [courseId, lectureId]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F6F4EF] text-[#15171C]">
        <Header activeTab="courses" backHref={`/courses/${courseId}`} backLabel="Course details" />
        <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-8 lg:px-10 py-6 sm:py-8 animate-pulse">
          <div className="h-5 w-64 bg-[#E9E5DB] rounded mb-6" />
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="aspect-video bg-[#E9E5DB] rounded-2xl mb-6" />
              <div className="h-8 w-1/2 bg-[#E9E5DB] rounded mb-3" />
              <div className="h-4 w-full bg-[#EFECE4] rounded" />
            </div>
            <div className="w-full lg:w-[340px] h-[400px] bg-[#E9E5DB] rounded-2xl" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !currentLecture || !course) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F6F4EF] text-[#15171C]">
        <Header activeTab="courses" backHref={`/courses/${courseId}`} backLabel="Course details" />
        <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-8 lg:px-10 py-12">
          <ErrorCoursesState onRetry={() => window.location.reload()} />
        </main>
        <Footer />
      </div>
    );
  }

  const safeEmbedUrl = getSafeEmbedUrl(currentLecture.videoUrl);
  const currentIndex = allLectures.findIndex(
    (l) => (l.id || l._id) === (currentLecture.id || currentLecture._id)
  );
  const lectureNumber =
    currentLecture.order || (currentIndex >= 0 ? currentIndex + 1 : 1);

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F4EF] text-[#15171C]">
      <Header
        activeTab="courses"
        backHref={`/courses/${courseId}`}
        backLabel={`${course.title.slice(0, 20)}…`}
      />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-8 lg:px-10 py-5 sm:py-8 pb-16 flex flex-col gap-5 sm:gap-6">
        {/* Breadcrumb Navigation (Desktop) */}
        <nav
          aria-label="Breadcrumb"
          className="hidden sm:flex text-[14px] text-[#5B606B] items-center gap-2 flex-wrap"
        >
          <Link href="/" className="underline hover:text-[#C2410C]">
            All courses
          </Link>
          <span aria-hidden="true" className="text-[#9A9588]">/</span>
          <Link
            href={`/courses/${courseId}`}
            className="underline hover:text-[#C2410C] truncate max-w-[260px]"
          >
            {course.title}
          </Link>
          <span aria-hidden="true" className="text-[#9A9588]">/</span>
          <span className="text-[#15171C] font-semibold truncate max-w-[300px]">
            {currentLecture.title}
          </span>
        </nav>

        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-start">
          {/* Main Video & Details Column */}
          <section className="flex-1 min-w-0 w-full flex flex-col gap-4 sm:gap-5">
            {/* Safe Video Player */}
            <div className="relative aspect-video rounded-[14px] overflow-hidden bg-[#15171C] shadow-sm">
              {safeEmbedUrl ? (
                <iframe
                  src={safeEmbedUrl}
                  title={currentLecture.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-6 text-center text-white relative">
                  <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-[#C2410C] flex items-center justify-center shadow-lg">
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                    >
                      <path d="M4.5 2.5v11l9-5.5z" fill="#FFFFFF" />
                    </svg>
                  </div>
                  <div className="text-[13px] sm:text-[14px] text-[#C9CDD6] max-w-[340px]">
                    {currentLecture.videoUrl
                      ? "External video player (YouTube / Vimeo)"
                      : "No video URL set for this lecture"}
                  </div>
                </div>
              )}
            </div>

            {/* Lecture Details */}
            <div className="flex flex-col gap-1.5 mt-1">
              <span className="text-[13px] sm:text-[14px] font-semibold text-[#C2410C]">
                Lecture {lectureNumber} of {allLectures.length || 1}
              </span>
              <h1 className="m-0 font-['Space_Grotesk'] font-bold text-[24px] sm:text-[30px] lg:text-[34px] leading-[1.1] tracking-[-0.01em] text-[#15171C]">
                {currentLecture.title}
              </h1>
              {currentLecture.description && (
                <p className="m-0 text-[15px] sm:text-[16.5px] leading-[1.6] text-[#5B606B] max-w-[720px] mt-1">
                  {currentLecture.description}
                </p>
              )}
            </div>

            {/* Previous / Next Action Buttons (Matches Mobile-Lecture.dc.html & Desktop) */}
            <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:gap-3 pt-2">
              <button
                type="button"
                disabled={!prevId}
                onClick={() => prevId && router.push(`/courses/${courseId}/lectures/${prevId}`)}
                className={`min-h-[48px] px-5 sm:px-6 rounded-[10px] font-semibold text-[14.5px] sm:text-[15.5px] border border-[#15171C] transition-colors flex items-center justify-center ${
                  prevId
                    ? "bg-white text-[#15171C] hover:bg-[#F6F4EF] cursor-pointer shadow-sm active:bg-[#E2DED5]"
                    : "opacity-35 cursor-not-allowed bg-transparent text-[#5B606B] border-[#9A9588]"
                }`}
              >
                ← Previous
              </button>

              <button
                type="button"
                disabled={!nextId}
                onClick={() => nextId && router.push(`/courses/${courseId}/lectures/${nextId}`)}
                className={`min-h-[48px] px-5 sm:px-6 rounded-[10px] font-semibold text-[14.5px] sm:text-[15.5px] transition-colors flex items-center justify-center ${
                  nextId
                    ? "bg-[#15171C] text-white hover:bg-[#2B2F38] cursor-pointer shadow-sm active:bg-[#3E434F]"
                    : "opacity-35 cursor-not-allowed bg-[#E2DED5] text-[#5B606B]"
                }`}
              >
                Next lecture →
              </button>
            </div>
          </section>

          {/* Sidebar Playlist */}
          <aside className="w-full lg:w-[340px] shrink-0 bg-white border border-[#E2DED5] rounded-[14px] overflow-hidden sticky top-20 shadow-sm mt-4 lg:mt-0">
            <div className="p-3.5 sm:p-[16px_22px] border-b border-[#E2DED5] bg-white">
              <h2 className="m-0 font-['Space_Grotesk'] font-bold text-[18px] sm:text-[20px] text-[#15171C]">
                Course lectures
              </h2>
            </div>

            <ol className="list-none m-0 p-0 divide-y divide-[#E2DED5] max-h-[480px] overflow-y-auto">
              {allLectures.map((lec, idx) => {
                const lecId = lec.id || lec._id;
                const isActive = lecId === (currentLecture.id || currentLecture._id);

                return (
                  <li key={lecId}>
                    <button
                      type="button"
                      onClick={() =>
                        router.push(`/courses/${courseId}/lectures/${lecId}`)
                      }
                      className={`w-full flex items-center gap-3.5 p-3.5 sm:p-[14px_18px] text-left transition-colors cursor-pointer border-0 ${
                        isActive
                          ? "bg-[#FBE9DF] text-[#C2410C]"
                          : "bg-white text-[#15171C] hover:bg-[#FBFAF7]"
                      }`}
                    >
                      <span
                        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-['Space_Grotesk'] font-bold text-[13.5px] ${
                          isActive
                            ? "bg-[#C2410C] text-white"
                            : "bg-[#F6F4EF] text-[#15171C]"
                        }`}
                      >
                        {lec.order || idx + 1}
                      </span>
                      <span
                        className={`text-[14.5px] leading-[1.35] line-clamp-2 ${
                          isActive ? "font-bold text-[#C2410C]" : "font-medium"
                        }`}
                      >
                        {lec.title}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
