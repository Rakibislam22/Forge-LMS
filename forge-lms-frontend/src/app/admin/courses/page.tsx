"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { Course, ApiResponse, CoursesResponse } from "@/types/course";
import { API_BASE_URL } from "@/config/api";
import { formatPrice } from "@/components/CourseCard";
import { clearAdminSession } from "@/utils/auth";

export default function AdminCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Delete modal state
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = `${API_BASE_URL}/courses`;

      const res = await fetch(apiUrl, {
        cache: "no-store",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) throw new Error("Failed to load courses");

      const json: ApiResponse<CoursesResponse> = await res.json();
      if (!json.success || !json.data) throw new Error(json.error?.message || "Failed to load courses");

      setCourses(json.data.courses || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const apiUrl = `${API_BASE_URL}/courses`;

        const res = await fetch(apiUrl, {
          cache: "no-store",
          headers: { Accept: "application/json" },
        });

        if (!res.ok) throw new Error("Failed to load courses");

        const json: ApiResponse<CoursesResponse> = await res.json();
        if (!json.success || !json.data) throw new Error(json.error?.message || "Failed to load courses");

        if (!ignore) {
          setCourses(json.data.courses || []);
          setLoading(false);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Error loading courses");
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;
    setDeleting(true);
    const id = courseToDelete.id || courseToDelete._id;

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("forge_admin_token") : "";
      const apiUrl = `${API_BASE_URL}/courses/${id}`;

      const res = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.status === 401) {
        clearAdminSession();
        router.push("/admin/login");
        return;
      }

      if (!res.ok) throw new Error("Failed to delete course");

      // Filter out from local state
      setCourses((prev) => prev.filter((c) => (c.id || c._id) !== id));
      setCourseToDelete(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete course");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="font-sans text-[#15171C] bg-[#F6F4EF] min-h-screen flex flex-col md:flex-row">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 flex flex-col gap-7 overflow-x-hidden">
        {/* Header and New Course Action */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="m-0 font-['Space_Grotesk'] font-bold text-[32px] sm:text-[36px] tracking-[-0.02em] text-[#15171C]">
              Courses
            </h1>
            <p className="m-0 text-[15px] text-[#5B606B]">
              Create, edit and remove courses. Open a course to manage its lectures.
            </p>
          </div>

          <Link
            href="/admin/courses/new"
            className="inline-flex items-center gap-2 min-h-[48px] px-5 sm:px-6 rounded-[10px] bg-[#C2410C] text-white font-semibold text-[15px] sm:text-[16px] hover:bg-[#A8370A] active:bg-[#8D2D06] transition-colors shadow-sm"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M8 2v12M2 8h12" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>New course</span>
          </Link>
        </div>

        {/* Courses Table Container */}
        <div className="bg-white border border-[#E2DED5] rounded-[14px] overflow-x-auto shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-[#5B606B] animate-pulse">
              Loading courses…
            </div>
          ) : error ? (
            <div className="p-8 text-center text-[#B42318] flex flex-col items-center gap-3">
              <span>{error}</span>
              <button
                onClick={fetchCourses}
                className="px-4 py-2 border border-[#B42318] rounded-lg text-[14px] text-[#B42318] hover:bg-[#B42318] hover:text-white transition-colors"
              >
                Try again
              </button>
            </div>
          ) : courses.length === 0 ? (
            <div className="p-12 text-center text-[#5B606B] flex flex-col items-center gap-3">
              <h3 className="font-['Space_Grotesk'] font-bold text-[20px] text-[#15171C] m-0">
                No courses yet
              </h3>
              <p className="m-0 text-[15px]">Click &quot;New course&quot; to publish your first one.</p>
            </div>
          ) : (
            <table className="w-full min-w-[640px] border-collapse text-[15px] text-left">
              <thead>
                <tr className="text-[#5B606B] text-[13px] tracking-[0.04em] uppercase border-b border-[#E2DED5]">
                  <th className="py-4 px-6 font-semibold">Course</th>
                  <th className="py-4 px-3 font-semibold">Price</th>
                  <th className="py-4 px-3 font-semibold">Lectures</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DED5]">
                {courses.map((course) => {
                  const id = course.id || course._id;
                  const tag = course.title.split(" ")[0].slice(0, 4).toUpperCase();

                  return (
                    <tr key={id} className="hover:bg-[#FBFAF7] transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-4">
                          <div className="shrink-0 relative w-16 h-11 rounded-lg overflow-hidden bg-[#1F3A5F]">
                            {course.thumbnailUrl ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={course.thumbnailUrl}
                                alt={course.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full relative flex items-center justify-center font-['Space_Grotesk'] font-bold text-[12px] text-white">
                                {tag}
                              </div>
                            )}
                          </div>
                          <span className="font-semibold text-[#15171C] line-clamp-1">
                            {course.title}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 font-semibold text-[#15171C]">
                        {formatPrice(course.price)}
                      </td>

                      <td className="py-3.5 px-3 text-[#5B606B]">
                        {course.lectureCount || 0}
                      </td>

                      <td className="py-3.5 px-6">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          <Link
                            href={`/admin/courses/${id}/lectures`}
                            className="inline-flex items-center min-h-[38px] px-3 rounded-lg font-semibold text-[14px] text-[#C2410C] hover:bg-[#FBE9DF] transition-colors"
                          >
                            Lectures
                          </Link>
                          <Link
                            href={`/admin/courses/${id}/edit`}
                            className="inline-flex items-center min-h-[38px] px-3 rounded-lg font-semibold text-[14px] text-[#15171C] hover:bg-[#F6F4EF] transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => setCourseToDelete(course)}
                            className="inline-flex items-center min-h-[38px] px-3 rounded-lg font-semibold text-[14px] text-[#B42318] hover:bg-[#B42318]/10 transition-colors cursor-pointer border-0 bg-transparent"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {courseToDelete && (
        <div className="fixed inset-0 bg-[#15171C]/55 flex items-center justify-center p-4 z-50">
          <div
            role="alertdialog"
            aria-labelledby="dtitle"
            aria-describedby="ddesc"
            className="w-full max-w-[440px] bg-white rounded-2xl p-6 sm:p-7 flex flex-col gap-3.5 shadow-2xl"
          >
            <h2
              id="dtitle"
              className="m-0 font-['Space_Grotesk'] font-bold text-[24px] text-[#15171C]"
            >
              Delete this course?
            </h2>
            <p id="ddesc" className="m-0 text-[15px] leading-[1.55] text-[#5B606B]">
              <strong className="text-[#15171C]">{courseToDelete.title}</strong> and all of its
              lectures will be permanently removed. Students will no longer see it.
            </p>
            <div className="flex justify-end gap-2.5 mt-2 flex-wrap">
              <button
                type="button"
                onClick={() => setCourseToDelete(null)}
                className="min-h-[44px] px-5 border border-[#15171C] rounded-[10px] bg-white text-[#15171C] font-semibold text-[15px] hover:bg-[#F6F4EF] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteCourse}
                className="min-h-[44px] px-5 border-0 rounded-[10px] bg-[#B42318] text-white font-semibold text-[15px] hover:bg-[#991B1B] cursor-pointer disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Delete course"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
